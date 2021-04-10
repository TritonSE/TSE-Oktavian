import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import MaterialTable from "@material-table/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Helmet } from "react-helmet";
import { Grid } from "@material-ui/core";
import { Visibility } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { TableIcons } from "../../components/Icons";
import LoadingContainer from "../../components/LoadingContainer";
import PageContainer from "../../components/PageContainer";
import { openAlert } from "../../actions";
import { getApplications } from "../../services/applications";
import { withAuthorization } from "../../components/HOC";

const useStyles = makeStyles((theme) => ({
  grid: {
    textAlign: "center",
  },
  dates: {
    marginBottom: theme.spacing(2),
  },
}));

const Applications = () => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    // Initial backend data
    loading: true,
    applications: [],
    // User input
    start_date: new Date(new Date().getFullYear(), new Date().getMonth() - 9, new Date().getDate()),
    end_date: new Date(),
  });
  const dispatch = useDispatch();

  React.useEffect(() => {
    const loadData = async () => {
      const { ok, data } = await getApplications(state.start_date, state.end_date);
      if (ok) {
        const applications = data.applications.map((app) => ({
          ...app,
          role: app.role.name,
        }));
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
  }, [state.loading, state.start_date, state.end_date, dispatch]);

  const handleStartDateChange = (new_date) => {
    setState({ ...state, start_date: new_date, loading: true });
  };

  const handleEndDateChange = (new_date) => {
    setState({ ...state, end_date: new_date, loading: true });
  };

  return (
    <>
      <Helmet>
        <title>All Applications — TSE Oktavian</title>
      </Helmet>
      <PageContainer>
        <LoadingContainer loading={state.loading}>
          <Grid container spacing={0} alignItems="center" justify="center" className={classes.grid}>
            <Grid item xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container spacing={3} className={classes.dates}>
                  <Grid item md={6} xs={12}>
                    <DatePicker
                      label="Submission Start Date"
                      format="MM/dd/yyyy"
                      value={state.start_date}
                      onChange={handleStartDateChange}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <DatePicker
                      label="Submission End Date"
                      format="MM/dd/yyyy"
                      value={state.end_date}
                      onChange={handleEndDateChange}
                    />
                  </Grid>
                </Grid>
              </MuiPickersUtilsProvider>
              <MaterialTable
                icons={TableIcons}
                actions={[
                  {
                    icon: function visibility() {
                      return <Visibility />;
                    },
                    tooltip: "View Application",
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
                    title: "Graduating In",
                    field: "graduation",
                    type: "numeric",
                  },
                  { title: "Completed", field: "completed", type: "boolean" },
                  { title: "Accepted", field: "accepted", type: "boolean" },
                  { title: "Last Reviewer", field: "last_reviewer" },
                ]}
                data={state.applications}
                title="All Applications"
              />
            </Grid>
          </Grid>
        </LoadingContainer>
      </PageContainer>
    </>
  );
};

export default withAuthorization(Applications, true, ["recruitment"]);
