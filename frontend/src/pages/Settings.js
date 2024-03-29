import React from "react";
import { Helmet } from "react-helmet";
import { TextField, Grid, Card, CardContent, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import PageContainer from "../components/PageContainer";
import { withAuthorization } from "../components/HOC";
import { changePassword } from "../services/auth";
import { openAlert } from "../actions";
import UserEdit from "../components/UserEdit";

const useStyles = makeStyles((theme) => ({
  grid: {
    textAlign: "center",
  },
  form: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "90%",
    },
    "& .MuiButton-root": {},
    "& .MuiInputBase-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 0.6)",
    },
  },
  lightSpacing: {
    margin: theme.spacing(1),
    width: "100%",
  },
  card: {
    maxWidth: 440,
  },
  button: {
    maxWidth: 200,
    color: "black",
    textTransform: "none",
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
        <Grid
          container
          spacing={4}
          alignItems="flex-start"
          justify="center"
          className={classes.grid}
        >
          <Grid item md={4} xs={6}>
            <UserEdit userData={loginState} />
          </Grid>
          <Grid item md={4} xs={6}>
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
                      disableElevation
                      variant="contained"
                      color="text.secondary"
                      type="submit"
                      className={classes.button}
                      disabled={state.disabled}
                    >
                      Change Password
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
