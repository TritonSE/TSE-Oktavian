import React from "react";
import WithAuthentication from "../components/WithAuthentication";
import WithNavbar from "../components/WithNavbar";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { Grid, Snackbar, LinearProgress } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "@material-table/core";
import { TableIcons } from "../components/Icons";
import { getJWT, getUser, logout } from "../services/auth";
import { BACKEND_URL } from "../util/constants";

const useStyles = makeStyles(() => ({
  grid: {
    textAlign: "center",
  },
}));

export default function Assignments() {
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
    const fetchData = async () => {
      try {
        let response = await fetch(
          `${BACKEND_URL}/api/reviews?user=${getUser()._id}`,
          {
            headers: {
              Authorization: `Bearer ${getJWT()}`,
            },
          }
        );
        let json = await response.json();
        if (response.status === 401) {
          logout();
          history.push("/");
          return;
        } else if (!response.ok) {
          setState({
            ...state,
            loading: false,
            snack: {
              message: `Could not load reviews: ${json.message}`,
              open: true,
            },
          });
          return;
        }
        const reviews = json.reviews;
        const applications = reviews
          .filter((review) => {
            return !review.completed;
          })
          .map((review) => {
            return {
              _id: review.application._id,
              name: review.application.name,
              email: review.application.email,
              role: review.application.role,
              stage: review.application.current_stage,
              graduation: review.application.graduation,
              submission: new Date(review.application.created_at).getFullYear(),
            };
          });
        setState({ ...state, loading: false, applications: applications });
      } catch (error) {
        setState({
          ...state,
          loading: false,
          snack: { message: `An error occurred: ${error.message}`, open: true },
        });
      }
    };
    if (state.loading) {
      fetchData();
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
        <title>Oktavian — Your Assignments</title>
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
                    icon: function edit() {
                      return <Edit />;
                    },
                    tooltip: "Edit Application",
                    onClick: (event, row) => {
                      let origin =
                        window.location.protocol +
                        "//" +
                        window.location.hostname +
                        (window.location.port
                          ? ":" + window.location.port
                          : "");
                      window.open(`${origin}/application/${row._id}#reviews`);
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
                ]}
                data={state.applications}
                title="Your Active Assignments"
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
