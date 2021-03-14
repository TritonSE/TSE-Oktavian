import React from "react";
import WithAuthentication from "../components/WithAuthentication";
import PageContainer from "../components/PageContainer";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  FormHelperText,
  FormGroup,
  FormLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { setJWT, setUser } from "../services/auth";
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

export default function Register() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    // Boilerplate
    snack: {
      message: "",
      open: false,
    },
    // User input
    form_disabled: false,
    name: "",
    email: "",
    password: "",
    secret: "",
  });

  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const submission = {
      name: state.name,
      email: state.email,
      password: state.password,
      secret: state.secret,
    };
    if (submission.password.length < 6) {
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
    const { ok, data } = await sendData(
      "api/auth/register",
      false,
      "POST",
      JSON.stringify(submission)
    );
    if (ok) {
      setJWT(data.token);
      setUser(data.user);
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
        <title>Register — TSE Oktavian</title>
      </Helmet>
      <PageContainer>
        <Grid container spacing={0} alignItems="center" justify="center">
          <Grid item md={6} xs={12}>
            <Typography variant="h4" className={classes.title}>
              Register
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
              <TextField
                label="Name"
                variant="outlined"
                type="text"
                onChange={handleChange("name")}
              />
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                onChange={handleChange("email")}
              />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                onChange={handleChange("password")}
              />
              <TextField
                label="Secret"
                variant="outlined"
                type="password"
                onChange={handleChange("secret")}
              />
              <FormHelperText className={classes.lightSpacing}>
                This secret is required for registration and is only distributed
                internally.
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
      </PageContainer>
    </WithAuthentication>
  );
}
