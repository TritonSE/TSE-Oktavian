import React from "react";
import WithAuthentication from "../components/WithAuthentication";
import PageContainer from "../components/PageContainer";
import { Helmet } from "react-helmet";
import { Link, useHistory } from "react-router-dom";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { setJWT, setUser } from "../services/auth";
import { sendData } from "../services/data";
import { useDispatch } from "react-redux";
import { openAlert } from "../actions";

const useStyles = makeStyles((theme) => ({
  centered: {
    textAlign: "center",
  },
  form: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "100%",
    },
    "& .MuiTypography-root": {
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
}));

export default function Login() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    disabled: false,
    email: "",
    password: "",
  });
  const dispatch = useDispatch();

  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setState({ ...state, disabled: true });
    const submission = {
      email: state.email,
      password: state.password,
    };
    if (submission.password.length < 6) {
      dispatch(openAlert("Error: Password must be at least 6 characters"));
      setState({
        ...state,
        disabled: false,
      });
      return;
    }
    const { ok, data } = await sendData(
      "api/auth/login",
      false,
      "POST",
      JSON.stringify(submission)
    );
    if (ok) {
      setJWT(data.token);
      setUser(data.user);
      history.push("/");
    } else {
      dispatch(openAlert(`Error: ${data.message}`));
    }
    setState({
      ...state,
      disabled: false,
    });
  };

  return (
    <WithAuthentication allow={false}>
      <Helmet>
        <title>Login — TSE Oktavian</title>
      </Helmet>
      <PageContainer>
        <Grid container spacing={0} alignItems="center" justify="center">
          <Grid item md={6} xs={12}>
            <Typography variant="h4" className={classes.title}>
              Login
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
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
              <Link to="forgot-password">
                <Typography>Forgot your password?</Typography>
              </Link>
              <div className={classes.centered}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={state.disabled}
                >
                  Submit
                </Button>
              </div>
            </form>
          </Grid>
        </Grid>
      </PageContainer>
    </WithAuthentication>
  );
}
