import React from "react";
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
import { isAuthenticated, getJWT, logout } from "../util/auth";
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
    loading: true,
    stats: {},
  });

  React.useEffect(() => {
    if (!isAuthenticated()) {
      history.push("/");
      return;
    }
    if (state.loading) {
      fetch(`${BACKEND_URL}/api/stats`, {
        headers: {
          Authorization: `Bearer ${getJWT()}`,
        },
      })
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
    }
  });

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
    <Grid
      container
      spacing={0}
      alignItems="center"
      justify="center"
      className={classes.centered}
    >
      <Grid item xs={12}>
        {state.loading ? (
          <LinearProgress />
        ) : (
          <div>
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
  );
}
