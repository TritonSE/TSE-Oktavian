import React from "react";
import WithData from "../../components/WithData";
import WithAuthentication from "../../components/WithAuthentication";
import PageContainer from "../../components/PageContainer";
import { Helmet } from "react-helmet";
import { Grid } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "@material-table/core";
import { TableIcons } from "../../components/Icons";
import { getUser } from "../../services/auth";
import { useDispatch } from "react-redux";
import { openAlert } from "../../actions";

const useStyles = makeStyles(() => ({
  grid: {
    textAlign: "center",
  },
}));

export default function Assignments() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    reloading: true,
    applications: [],
  });
  const dispatch = useDispatch();

  const handleData = (data) => {
    const reviews = data.reviews;
    const applications = reviews
      .filter((review) => {
        return !review.completed;
      })
      .map((review) => {
        const app = review.application;
        return {
          ...app,
          role: app.role.name,
          submission: new Date(app.created_at).getFullYear(),
        };
      });
    setState({
      ...state,
      reloading: false,
      applications: applications,
    });
  };

  const handleError = (data) => {
    dispatch(openAlert(`Error: ${data.message}`));
    setState({
      ...state,
      reloading: false,
    });
  };

  return (
    <WithAuthentication allow={true}>
      <Helmet>
        <title>Your Assignments — TSE Oktavian</title>
      </Helmet>
      <PageContainer>
        <WithData
          slug={`api/reviews?user=${getUser()._id}`}
          authenticated={true}
          reloading={state.reloading}
          onSuccess={handleData}
          onError={handleError}
        >
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
                      window.open(
                        `${origin}/recruitment/application/${row._id}`
                      );
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
          </Grid>
        </WithData>
      </PageContainer>
    </WithAuthentication>
  );
}
