import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { resetPassword } from "../services/auth";
import PageContainer from "../components/PageContainer";
import { openAlert } from "../actions";
import { withAuthorization } from "../components/HOC";

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

const ResetPassword = ({ match }) => {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    disabled: false,
    password: "",
    confirm_password: "",
  });
  const dispatch = useDispatch();

  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setState({ ...state, disabled: true });
    if (state.password !== state.confirm_password) {
      dispatch(openAlert("Error: Passwords do not match"));
      setState({
        ...state,
        disabled: false,
      });
      return;
    }
    if (state.password.length < 6) {
      dispatch(openAlert("Error: Password must be at least 6 characters"));
      setState({
        ...state,
        disabled: false,
      });
      return;
    }
    const body = {
      token: match.params.token,
      password: state.password,
    };
    const { ok, data } = await resetPassword(body);
    if (ok) {
      dispatch(openAlert("Your password has been reset."));
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
    <>
      <Helmet>
        <title>Reset Password — Oktavian</title>
      </Helmet>
      <PageContainer>
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
                <Button variant="contained" color="primary" type="submit" disabled={state.disabled}>
                  Submit
                </Button>
              </div>
            </form>
          </Grid>
        </Grid>
      </PageContainer>
    </>
  );
};

ResetPassword.propTypes = {
  match: PropTypes.object,
};

export default withAuthorization(ResetPassword, false);
