import React from "react";
import PropTypes from "prop-types";
import WithAuthentication from "../components/WithAuthentication";
import WithNavbar from "../components/WithNavbar";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { sendData } from "../services/data";

const useStyles = makeStyles((theme) => ({
  centered: {
    textAlign: "center",
  },
  form: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "100%",
    },
    "& .MuiFormControl-root": {
      margin: theme.spacing(1),
      width: "100%",
    },
    "& .MuiButton-root": {
      margin: theme.spacing(3),
    },
  },
  title: {
    margin: theme.spacing(2),
    textAlign: "center",
  },
  lightSpacing: {
    margin: theme.spacing(1),
    width: "100%",
  },
}));

export default function ResetPassword({ match }) {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    password: "",
    confirm_password: "",
    snack: {
      message: "",
      open: false,
    },
    form_disabled: false,
  });

  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (state.password !== state.confirm_password) {
      setState({
        ...state,
        form_disabled: false,
        snack: { message: "Passwords do not match.", open: true },
      });
      return;
    }
    if (state.password.length < 6) {
      setState({
        ...state,
        form_disabled: false,
        snack: {
          message: "Password must be at least 6 characters long.",
          open: true,
        },
      });
      return;
    }
    const submission = {
      token: match.params.token,
      password: state.password,
    };
    const { ok, data } = await sendData(
      "api/auth/reset-password",
      false,
      "POST",
      JSON.stringify(submission)
    );
    if (ok) {
      history.push("/");
    } else {
      setState({
        ...state,
        form_disabled: false,
        snack: { message: `Error: ${data.message}`, open: true },
      });
    }
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({ ...state, snack: { ...state.snack, open: false } });
  };

  return (
    <WithAuthentication allow={false}>
      <Helmet>
        <title>Oktavian — Reset Password</title>
      </Helmet>
      <WithNavbar>
        <Grid container spacing={0} alignItems="center" justify="center">
          <Grid item md={6} xs={12}>
            <Typography variant="h4" className={classes.title}>
              Reset Your Password
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                onChange={handleChange("password")}
              />
              <TextField
                label="Confirm Password"
                variant="outlined"
                type="password"
                onChange={handleChange("confirm_password")}
              />
              <div className={classes.centered}>
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </div>
            </form>
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

ResetPassword.propTypes = {
  match: PropTypes.object,
};
