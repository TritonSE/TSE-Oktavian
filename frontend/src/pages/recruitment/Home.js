import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import { Helmet } from "react-helmet";
import { Card, CardContent, Grid, LinearProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { useDispatch } from "react-redux";
import LoadingContainer from "../../components/LoadingContainer";
import PageContainer from "../../components/PageContainer";
import { openAlert } from "../../actions";
import { getApplicationStats } from "../../services/stats";
import { withAuthorization } from "../../components/HOC";

const useStyles = makeStyles((theme) => ({
  centered: {
    textAlign: "center",
  },
  title: {
    margin: theme.spacing(2),
  },
  counter: {
    marginBottom: theme.spacing(1),
  },
}));

const Home = () => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    // Initial backend data
    loading: true,
    stats: null,
    // User input
    start_date: new Date(new Date().getFullYear(), new Date().getMonth() - 9, new Date().getDate()),
    end_date: new Date(),
  });
  const dispatch = useDispatch();

  React.useEffect(() => {
    const loadData = async () => {
      const { ok, data } = await getApplicationStats(state.start_date, state.end_date);
      if (ok) {
        const stats = JSON.parse(JSON.stringify(data.stats));
        setState((prev_state) => ({
          ...prev_state,
          loading: false,
          stats,
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

  const position_stats =
    state.stats == null ? (
      <></>
    ) : (
      Object.entries(state.stats).map(([role, stats]) => (
        <Grid item md={4} xs={12} key={role}>
          <Card>
            <CardContent>
              <Typography variant="h6" className={classes.title}>
                {role}
              </Typography>
              {Object.entries(stats).map(([stage, count]) => (
                <div className={classes.counter} key={`${role}-${stage}`}>
                  <Typography variant="h3">{count}</Typography>
                  <Typography variant="caption">{stage}</Typography>
                </div>
              ))}
            </CardContent>
          </Card>
        </Grid>
      ))
    );

  return (
    <>
      <Helmet>
        <title>Recruitment — TSE Oktavian</title>
      </Helmet>
      <PageContainer>
        <LoadingContainer loading={state.loading}>
          <Grid
            container
            spacing={0}
            alignItems="center"
            justify="center"
            className={classes.centered}
          >
            <Grid item xs={12}>
              {state.dates_change ? (
                <LinearProgress />
              ) : (
                <>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container spacing={3}>
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
                  <Typography variant="h5" className={classes.title}>
                    Breakdown by Position
                  </Typography>
                  <Grid container spacing={3}>
                    {position_stats}
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </LoadingContainer>
      </PageContainer>
    </>
  );
};

export default withAuthorization(Home, true, ["recruitment"]);
