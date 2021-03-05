import React from "react";
import WithAuthentication from "../components/WithAuthentication";
import WithNavbar from "../components/WithNavbar";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardContent,
  Grid,
  Snackbar,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { getJWT, logout } from "../util/auth";
import { BACKEND_URL } from "../util/constants";
import { toTitleCase } from "../util/typography";

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

export default function Dashboard() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    snack: {
      message: "",
      open: false,
    },
    start_date: new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 9,
      new Date().getDate()
    ),
    end_date: new Date(),
    loading: true,
    stats: {},
  });

  const refreshStats = () => {
    fetch(
      `${BACKEND_URL}/api/stats?start_date=${state.start_date.getTime()}&end_date=${state.end_date.getTime()}`,
      {
        headers: {
          Authorization: `Bearer ${getJWT()}`,
        },
      }
    )
      .then((response) => {
        response
          .json()
          .then((json) => {
            if (response.ok) {
              const stats = JSON.parse(JSON.stringify(json.stats));
              setState({ ...state, loading: false, stats: stats });
            } else if (response.status === 401) {
              logout();
              history.push("/");
            } else {
              setState({
                ...state,
                loading: false,
                snack: {
                  message: `Could not load stats: ${json.message}`,
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
  };

  React.useEffect(() => {
    if (state.loading) {
      refreshStats();
    }
  });

  const handleStartDateChange = (new_date) => {
    setState({ ...state, start_date: new_date, loading: true });
  };

  const handleEndDateChange = (new_date) => {
    setState({ ...state, end_date: new_date, loading: true });
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({ ...state, snack: { ...state.snack, open: false } });
  };

  const getPositionStats = (role) => {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" className={classes.title}>
            {toTitleCase(role)}
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
      <WithNavbar title="Dashboard">
        <Grid
          container
          spacing={0}
          alignItems="center"
          justify="center"
          className={classes.centered}
        >
          <Grid item xs={12}>
            {state.loading ? (
              <div>
                <LinearProgress />
              </div>
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
                  Dashboard
                </Typography>
                <Grid container spacing={3}>
                  <Grid item md={4} xs={12}>
                    {getPositionStats("DEVELOPER")}
                  </Grid>
                  <Grid item md={4} xs={12}>
                    {getPositionStats("DESIGNER")}
                  </Grid>
                  <Grid item md={4} xs={12}>
                    {getPositionStats("PROJECT_MANAGER")}
                  </Grid>
                </Grid>
              </div>
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
