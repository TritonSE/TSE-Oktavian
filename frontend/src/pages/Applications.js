import React from "react";
import WithAuthentication from "../components/WithAuthentication";
import WithNavbar from "../components/WithNavbar";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { Grid, Snackbar, LinearProgress } from "@material-ui/core";
import { Visibility } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "@material-table/core";
import { TableIcons } from "../components/Icons";
import { getJWT, logout } from "../util/auth";
import { BACKEND_URL } from "../util/constants";

const useStyles = makeStyles(() => ({
  grid: {
    textAlign: "center",
  },
}));

export default function Applications() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    snack: {
      message: "",
      open: false,
    },
    loading: true,
    applications: [],
  });

  React.useEffect(() => {
    if (state.loading) {
      fetch(`${BACKEND_URL}/api/applications`, {
        headers: {
          Authorization: `Bearer ${getJWT()}`,
        },
      })
        .then((response) => {
          response
            .json()
            .then((json) => {
              if (response.ok) {
                const applications = json.applications.map((row) => {
                  return {
                    _id: row._id,
                    name: row.name,
                    email: row.email,
                    role: row.role,
                    stage: row.current_stage,
                    graduation: row.graduation,
                    submission: new Date(row.created_at).getFullYear(),
                    completed: row.completed,
                    accepted: row.accepted,
                  };
                });
                setState({
                  ...state,
                  loading: false,
                  applications: applications,
                });
              } else if (response.status === 401) {
                logout();
                history.push("/");
              } else {
                setState({
                  ...state,
                  loading: false,
                  snack: {
                    message: `Could not load applications: ${json.message}`,
                    open: true,
                  },
                });
              }
            })
            .catch((error) => {
              setState({
                ...state,
                loading: false,
                snack: {
                  message: `An error occurred: ${error.message}`,
                  open: true,
                },
              });
            });
        })
        .catch((error) => {
          setState({
            ...state,
            loading: false,
            snack: {
              message: `An error occurred: ${error.message}`,
              open: true,
            },
          });
        });
    }
  });

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({ ...state, snack: { ...state.snack, open: false } });
  };

  return (
    <WithAuthentication allow={true}>
      <Helmet>
        <title>Oktavian — All Applications</title>
      </Helmet>
      <WithNavbar>
        <Grid
          container
          spacing={0}
          alignItems="center"
          justify="center"
          className={classes.grid}
        >
          <Grid item xs={12}>
            {state.loading ? (
              <LinearProgress />
            ) : (
              <MaterialTable
                icons={TableIcons}
                actions={[
                  {
                    icon: function visibility() {
                      return <Visibility />;
                    },
                    tooltip: "View Application",
                    onClick: (event, row) => {
                      let origin =
                        window.location.protocol +
                        "//" +
                        window.location.hostname +
                        (window.location.port
                          ? ":" + window.location.port
                          : "");
                      window.open(`${origin}/application/${row._id}`);
                    },
                  },
                ]}
                options={{
                  filtering: true,
                  paging: true,
                  pageSize: 10,
                  emptyRowsWhenPaging: true,
                  pageSizeOptions: [10, 20, 50, 100],
                }}
                columns={[
                  { title: "Name", field: "name" },
                  { title: "Email", field: "email" },
                  { title: "Position", field: "role" },
                  { title: "Stage", field: "stage" },
                  {
                    title: "Graduating In",
                    field: "graduation",
                    type: "numeric",
                  },
                  {
                    title: "Submitted In",
                    field: "submission",
                    type: "numeric",
                  },
                  { title: "Completed", field: "completed", type: "boolean" },
                  { title: "Accepted", field: "accepted", type: "boolean" },
                ]}
                data={state.applications}
                title="All Applications"
              />
            )}
          </Grid>
          <Snackbar
            open={state.snack.open}
            autoHideDuration={6000}
            onClose={handleSnackClose}
            message={state.snack.message}
          />
        </Grid>
      </WithNavbar>
    </WithAuthentication>
  );
}
