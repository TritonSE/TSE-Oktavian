import React from "react";
import { Helmet } from "react-helmet";
import {
  TextField,
  Grid,
  Card,
  CardContent,
  Button,
  Typography,
} from "@material-ui/core";
import PageContainer from "../components/PageContainer";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { withAuthorization } from "../components/HOC";

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
    disabled: true,
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const loginState = useSelector((state) => state.login);

  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value });
  };

  return (
    <>
      <Helmet>
        <title>Settings — TSE Oktavian</title>
      </Helmet>
      <PageContainer>
        <Grid
          container
          spacing={0}
          alignItems="center"
          justify="center"
          className={classes.grid}
        >
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
                <Typography
                  className={classes.lightSpacing}
                  color="textSecondary"
                >
                  The ability to change passwords will be enabled in a future
                  update.
                </Typography>
                <form className={classes.form}>
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
