import React from "react";
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
import { setJWT, setUser } from "../util/auth";
import { BACKEND_URL } from "../util/constants";

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
    name: "",
    email: "",
    password: "",
    secret: "",
    role_developer: false,
    role_designer: false,
    role_project_manager: false,
    role_final: false,
    snack: {
      message: "",
      open: false,
    },
    form_disabled: false,
  });

  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value });
  };

  const handleChecked = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.checked });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const submission = {
      name: state.name,
      email: state.email,
      password: state.password,
      secret: state.secret,
      roles: [],
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
    if (state.role_designer) {
      submission.roles.push("DESIGNER");
    }
    if (state.role_developer) {
      submission.roles.push("DEVELOPER");
    }
    if (state.role_project_manager) {
      submission.roles.push("PROJECT_MANAGER");
    }
    if (state.role_final) {
      submission.roles.push("FINAL");
    }
    if (submission.roles.length === 0) {
      setState({
        ...state,
        form_disabled: false,
        snack: {
          message: "You must select at least one application type.",
          open: true,
        },
      });
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
      if (response.ok) {
        const json = await response.json();
        setJWT(json.token);
        setUser(json.user);
        history.push("/");
      } else if (response.status === 400) {
        setState({
          ...state,
          form_disabled: false,
          snack: {
            message: "Please fill out all required fields.",
            open: true,
          },
        });
      } else if (response.status === 403) {
        setState({
          ...state,
          form_disabled: false,
          snack: { message: "Invalid secret value.", open: true },
        });
      } else if (response.status === 409) {
        setState({
          ...state,
          form_disabled: false,
          snack: {
            message: "An account with that email already exists.",
            open: true,
          },
        });
      } else {
        const text = await response.text();
        setState({
          ...state,
          form_disabled: false,
          snack: { message: `Could not log in: ${text}`, open: true },
        });
      }
    } catch (error) {
      setState({
        ...state,
        form_disabled: false,
        snack: { message: `An error occurred: ${error.message}`, open: true },
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
          <FormControl>
            <FormLabel component="legend">
              What types of applications are you responsible for?
            </FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={handleChecked("role_project_manager")}
                    name="role-project-manager"
                  />
                }
                label="Project Managers"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={handleChecked("role_developer")}
                    name="role-developer"
                  />
                }
                label="Developers"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={handleChecked("role_designer")}
                    name="role-designer"
                  />
                }
                label="Designers"
              />
            </FormGroup>
          </FormControl>
          <FormControl>
            <FormLabel component="legend">
              Are you cleared to make final decisions?
            </FormLabel>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={handleChecked("role_final")}
                  name="role-final"
                />
              }
              label="Yes"
            />
            <FormHelperText>
              Do not select this unless you are the president. Your registration
              will be flagged.
            </FormHelperText>
          </FormControl>
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
  );
}
