import React from "react";
import WithData from "../components/WithData";
import WithAuthentication from "../components/WithAuthentication";
import WithNavbar from "../components/WithNavbar";
import { Helmet } from "react-helmet";
import { Grid, Snackbar } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "@material-table/core";
import { TableIcons } from "../components/Icons";
import { getUser } from "../services/auth";

const useStyles = makeStyles(() => ({
  grid: {
    textAlign: "center",
  },
}));

export default function Assignments() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    // Boilerplate
    snack: {
      message: "",
      open: false,
    },
    // Initial backend data
    reloading: true,
    applications: [],
  });

  const handleData = (data) => {
    const reviews = data.reviews;
    const applications = reviews
      .filter((review) => {
        return !review.completed;
      })
      .map((review) => {
        const app = review.application;
        return { ...app, submission: new Date(app.created_at).getFullYear() };
      });
    setState({
      ...state,
      reloading: false,
      applications: applications,
    });
  };

  const handleError = (data) => {
    setState({
      ...state,
      snack: {
        message: `Error: ${data.message}`,
        open: true,
      },
      reloading: false,
    });
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({ ...state, snack: { ...state.snack, open: false } });
  };

  return (
    <WithAuthentication allow={true}>
      <WithNavbar>
        <WithData
          slug={`api/reviews?user=${getUser()._id}`}
          authenticated={true}
          reloading={state.reloading}
          onSuccess={handleData}
          onError={handleError}
        >
          <Helmet>
            <title>Oktavian — Your Assignments</title>
          </Helmet>
          <Grid
            container
            spacing={0}
            alignItems="center"
            justify="center"
            className={classes.grid}
          >
            <Grid item xs={12}>
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
                  { title: "Stage", field: "current_stage" },
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
            </Grid>
            <Snackbar
              open={state.snack.open}
              autoHideDuration={6000}
              onClose={handleSnackClose}
              message={state.snack.message}
            />
          </Grid>
        </WithData>
      </WithNavbar>
    </WithAuthentication>
  );
}
