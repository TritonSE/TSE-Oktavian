import React from "react";
import PageContainer from "../components/PageContainer";
import { Helmet } from "react-helmet";
import {
  TextField,
  Button,
  Grid,
  FormHelperText,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { forgotPassword } from "../services/auth";
import { useDispatch } from "react-redux";
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

const ForgotPassword = () => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    disabled: false,
    email: "",
    secret: "",
  });
  const dispatch = useDispatch();

  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setState({ ...state, disabled: true });
    const body = {
      email: state.email,
      secret: state.secret,
    };
    const { ok, data } = await forgotPassword(body);
    if (ok) {
      dispatch(
        openAlert("A password reset request has been sent to your email")
      );
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
        <title>Forgot Password — TSE Oktavian</title>
      </Helmet>
      <PageContainer>
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
    </>
  );
};

export default withAuthorization(ForgotPassword, false);
