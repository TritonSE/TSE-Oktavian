import React from "react";
import { Helmet } from "react-helmet";
import { Grid } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "@material-table/core";
import { useDispatch, useSelector } from "react-redux";
import { TableIcons } from "../../components/Icons";
import { getUserReviews } from "../../services/reviews";
import PageContainer from "../../components/PageContainer";
import LoadingContainer from "../../components/LoadingContainer";
import { openAlert } from "../../actions";
import { withAuthorization } from "../../components/HOC";

const useStyles = makeStyles(() => ({
  grid: {
    textAlign: "center",
  },
}));

const Assignments = () => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    loading: true,
    applications: [],
  });
  const dispatch = useDispatch();
  const loginState = useSelector((lstate) => lstate.login);

  React.useEffect(() => {
    const loadData = async () => {
      if (loginState.user == null) {
        return;
      }
      const { ok, data } = await getUserReviews(loginState.user._id);
      if (ok) {
        const { reviews } = data;
        const applications = reviews
          .filter((review) => !review.completed)
          .map((review) => {
            const app = review.application;
            return {
              ...app,
              role: app.role.name,
            };
          });
        setState((prev_state) => ({
          ...prev_state,
          loading: false,
          applications,
        }));
      } else {
        dispatch(openAlert(`Error: ${data.message}`));
        setState((prev_state) => ({
          ...prev_state,
          loading: false,
        }));
      }
    };
    if (state.loading) {
      loadData();
    }
  }, [state.loading, loginState.user, dispatch]);

  return (
    <>
      <Helmet>
        <title>Your Assignments — TSE Oktavian</title>
      </Helmet>
      <PageContainer>
        <LoadingContainer loading={state.loading}>
          <Grid container spacing={0} alignItems="center" justify="center" className={classes.grid}>
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
                      const origin = `${window.location.protocol}//${window.location.hostname}${
                        window.location.port ? `:${window.location.port}` : ""
                      }`;
                      window.open(`${origin}/recruitment/application/${row._id}`);
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
                    title: "Start Quarter",
                    field: "start_quarter",
                  },
                  {
                    title: "Start Year",
                    field: "start_year",
                    type: "numeric",
                  },
                  {
                    title: "Graduation Quarter",
                    field: "graduation_quarter",
                  },
                  {
                    title: "Graduation Year",
                    field: "graduation_year",
                    type: "numeric",
                  },
                ]}
                data={state.applications}
                title="Your Active Assignments"
              />
            </Grid>
          </Grid>
        </LoadingContainer>
      </PageContainer>
    </>
  );
};

export default withAuthorization(Assignments, true, ["recruitment"]);
