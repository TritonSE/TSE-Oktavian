import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import WithData from "../../components/WithData";
import WithAuthentication from "../../components/WithAuthentication";
import PageContainer from "../../components/PageContainer";
import { Helmet } from "react-helmet";
import {
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { useDispatch } from "react-redux";
import { openAlert } from "../../actions";

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

export default function Overview() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    // Initial backend data
    reloading: true,
    stats: null,
    // User input
    start_date: new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 9,
      new Date().getDate()
    ),
    end_date: new Date(),
  });
  const dispatch = useDispatch();

  const handleData = (data) => {
    const stats = JSON.parse(JSON.stringify(data.stats));
    setState({ ...state, reloading: false, stats: stats });
  };

  const handleError = (data) => {
    openAlert(dispatch, `Error: ${data.message}`);
    setState({
      ...state,
      reloading: false,
    });
  };

  const handleStartDateChange = (new_date) => {
    setState({ ...state, start_date: new_date, reloading: true });
  };

  const handleEndDateChange = (new_date) => {
    setState({ ...state, end_date: new_date, reloading: true });
  };

  const getPositionStats = (role) => {
    if (state.stats == null) {
      return <></>;
    }
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" className={classes.title}>
            {role}
          </Typography>
          {Object.keys(state.stats[role]).map((stage) => {
            const count = state.stats[role][stage];
            return (
              <div className={classes.counter} key={`${role}-${stage}`}>
                <Typography variant="h3">{count}</Typography>
                <Typography variant="caption">{stage}</Typography>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  return (
    <WithAuthentication allow={true}>
      <Helmet>
        <title>Recruitment — TSE Oktavian</title>
      </Helmet>
      <PageContainer>
        <WithData
          slug={`api/stats/applications?start_date=${state.start_date.getTime()}&end_date=${state.end_date.getTime()}`}
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
            className={classes.centered}
          >
            <Grid item xs={12}>
              {state.dates_change ? (
                <LinearProgress />
              ) : (
                <div>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container spacing={3}>
                      <Grid item md={6} xs={12}>
                        <DatePicker
                          label="Start Date"
                          format="MM/dd/yyyy"
                          value={state.start_date}
                          onChange={handleStartDateChange}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <DatePicker
                          label="End Date"
                          format="MM/dd/yyyy"
                          value={state.end_date}
                          onChange={handleEndDateChange}
                        />
                      </Grid>
                    </Grid>
                  </MuiPickersUtilsProvider>
                  <Typography variant="h4" className={classes.title}>
                    Recruitment Overview
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item md={4} xs={12}>
                      {getPositionStats("Developer")}
                    </Grid>
                    <Grid item md={4} xs={12}>
                      {getPositionStats("Designer")}
                    </Grid>
                    <Grid item md={4} xs={12}>
                      {getPositionStats("Project Manager")}
                    </Grid>
                  </Grid>
                </div>
              )}
            </Grid>
          </Grid>
        </WithData>
      </PageContainer>
    </WithAuthentication>
  );
}
