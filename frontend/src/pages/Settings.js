import React from "react";
import { Helmet } from "react-helmet";
import { TextField, Grid, Card, CardContent, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import PageContainer from "../components/PageContainer";
import { withAuthorization } from "../components/HOC";
import { changePassword } from "../services/auth";
import { openAlert } from "../actions";

const useStyles = makeStyles((theme) => ({
  grid: {
    textAlign: "center",
  },
  form: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "90%",
    },
    "& .MuiButton-root": {
      margin: theme.spacing(3),
    },
    "& .MuiInputBase-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 0.6)",
    },
  },
  lightSpacing: {
    margin: theme.spacing(1),
    width: "100%",
  },
  card: {
    marginBottom: theme.spacing(5),
  },
}));

const Settings = () => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    disabled: false,
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const dispatch = useDispatch();
  const loginState = useSelector((lstate) => lstate.login);

  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (state.new_password !== state.confirm_password) {
      dispatch(openAlert("Passwords do not match"));
      return;
    }

    setState({ ...state, disabled: true });
    const { ok, data } = await changePassword({ password: state.new_password });
    if (ok) {
      dispatch(openAlert("Your password has been changed"));
    } else {
      dispatch(openAlert(`Error: ${data.message}`));
    }
    setState({ ...state, disabled: false });
  };

  return (
    <>
      <Helmet>
        <title>Settings — TSE Oktavian</title>
      </Helmet>
      <PageContainer>
        <Grid container spacing={0} alignItems="center" justify="center" className={classes.grid}>
          <Grid item md={6} xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5">Account Information</Typography>
                <form className={classes.form}>
                  <TextField
                    label="ID"
                    variant="outlined"
                    type="text"
                    defaultValue={loginState.user._id}
                    disabled
                  />
                  <TextField
                    label="Name"
                    variant="outlined"
                    type="text"
                    defaultValue={loginState.user.name}
                    disabled
                  />
                  <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    defaultValue={loginState.user.email}
                    disabled
                  />
                </form>
              </CardContent>
            </Card>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5">Change Password</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                  <TextField
                    label="Old Password"
                    variant="outlined"
                    type="password"
                    onChange={handleChange("old_password")}
                  />
                  <TextField
                    label="New Password"
                    variant="outlined"
                    type="password"
                    onChange={handleChange("new_password")}
                  />
                  <TextField
                    label="Confirm Password"
                    variant="outlined"
                    type="password"
                    onChange={handleChange("confirm_password")}
                  />
                  <div>
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      disabled={state.disabled}
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </PageContainer>
    </>
  );
};

export default withAuthorization(Settings, true);
