import React from "react";
import { Helmet } from "react-helmet";
import { TextField, Button, Grid, FormHelperText, Typography, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import PageContainer from "../components/PageContainer";
import { register, openAlert } from "../actions";
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

const Register = () => {
  const quarters = ["Fall", "Winter", "Spring"];
  const classes = useStyles();
  const [state, setState] = React.useState({
    disabled: false,
    name: "",
    email: "",
    password: "",
    quarter: quarters[0],
    year: 0,
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
      name: state.name,
      email: state.email,
      password: state.password,
      grad_quarter: state.quarter,
      graduation: state.year,
      secret: state.secret,
    };
    if (body.password.length < 6) {
      dispatch(openAlert("Error: Password must be at least 6 characters"));
      setState({
        ...state,
        disabled: false,
      });
      return;
    }
    dispatch(
      register(body, () => {
        setState({
          ...state,
          disabled: false,
        });
      })
    );
  };

  return (
    <>
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
                select
                label="Graduation Quarter"
                variant="outlined"
                value={state.quarter}
                className={classes.lightSpacing}
                onChange={handleChange("quarter")}
                SelectProps={{
                  MenuProps: {
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    getContentAnchorEl: null,
                  },
                }}
              >
                {quarters.map((qtr) => (
                  <MenuItem key={qtr} value={qtr}>
                    {qtr}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Graduation Year"
                variant="outlined"
                type="text"
                onChange={handleChange("year")}
              />
              <TextField
                label="Secret"
                variant="outlined"
                type="password"
                onChange={handleChange("secret")}
              />
              <FormHelperText className={classes.lightSpacing}>
                This secret is required for registration and is only distributed internally.
              </FormHelperText>
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

export default withAuthorization(Register, false);
