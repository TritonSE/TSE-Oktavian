import React from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { 
  TextField, Button, Grid, 
  Snackbar, Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { isAuthenticated, setJWT, setUser } from '../util/auth';
import { BACKEND_URL } from '../util/constants';

const useStyles = makeStyles((theme) => ({
  centered: {
    textAlign: 'center'
  },
  form: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%'
    },
    '& .MuiTypography-root': {
      margin: theme.spacing(1),
      width: '100%'
    },
    '& .MuiButton-root': {
      margin: theme.spacing(3)
    }
  },
  title: {
    margin: theme.spacing(2),
    textAlign: 'center'
  }
}));

export default function Login() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    email: '',
    password: '',
    snack: {
      message: '',
      open: false
    },
    form_disabled: false
  });

  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setState({ ...state, form_disabled: true });
    const submission = {
      email: state.email,
      password: state.password
    };
    if (submission.password.length < 6) {
      setState({...state, form_disabled: false, snack: {message: 'Password must be at least 6 characters long.', open: true}});
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });
      if (response.ok) {
        const json = await response.json();
        setJWT(json.token);
        setUser(json.user);
        history.push("/");
      }
      else if (response.status === 400) {
        setState({...state, form_disabled: false, snack: {message: 'Please fill out all required fields.', open: true}});
      }
      else if (response.status === 401) {
        setState({...state, form_disabled: false, snack: {message: 'Email or password not recognized.', open: true}});
      }
      else {
        const text = await response.text();
        setState({...state, form_disabled: false, snack: {message: `Could not log in: ${text}`, open: true}});
      }
    } 
    catch (error) {
      setState({...state, form_disabled: false, snack: {message: `An error occurred: ${error.message}`, open: true}});
    }
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState({...state, snack: {...state.snack, open: false}});
  };

  return isAuthenticated() ? <Redirect to="/"/> : ( 
    <Grid
      container
      spacing={0}
      alignItems="center"
      justify="center"
    >
      <Grid item md={6} xs={12}>
        <Typography variant="h4" className={classes.title}>
          Login
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField label='Email' variant='outlined' type='email' onChange={handleChange('email')}/>
          <TextField label='Password' variant='outlined' type='password' onChange={handleChange('password')}/>
          <Link to="forgot-password"><Typography>Forgot your password?</Typography></Link>
          <div className={classes.centered}>
            <Button variant="contained" color="primary" type="submit" disabled={state.form_disabled}>Submit</Button>
          </div>
        </form>
      </Grid>   
      <Snackbar open={state.snack.open} autoHideDuration={6000} onClose={handleSnackClose} message={state.snack.message}/>
    </Grid> 
  )
}
