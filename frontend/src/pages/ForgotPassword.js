import React from "react";
import WithAuthentication from "../components/WithAuthentication";
import WithNavbar from "../components/WithNavbar";
import { Helmet } from "react-helmet";
import {
  TextField,
  Button,
  Grid,
  FormHelperText,
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

export default function ForgotPassword() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    email: "",
    secret: "",
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
    const submission = {
      email: state.email,
      secret: state.secret,
    };
    const { ok, data } = await sendData(
      "api/auth/forgot-password",
      false,
      "POST",
      JSON.stringify(submission)
    );
    if (ok) {
      setState({
        email: "",
        secret: "",
        form_disabled: false,
        snack: {
          message: "Please check your email for a password reset request.",
          open: true,
        },
      });
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
        <title>Oktavian — Forgot Password</title>
      </Helmet>
      <WithNavbar>
        <Grid container spacing={0} alignItems="center" justify="center">
          <Grid item md={6} xs={12}>
            <Typography variant="h4" className={classes.title}>
              Recover Your Password
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                onChange={handleChange("email")}
              />
              <FormHelperText className={classes.lightSpacing}>
                You should expect an email within a few minutes. The reset token
                will expire within 1 hour.
              </FormHelperText>
              <TextField
                label="Secret"
                variant="outlined"
                type="password"
                onChange={handleChange("secret")}
              />
              <FormHelperText className={classes.lightSpacing}>
                This secret is only distributed internally.
              </FormHelperText>
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
