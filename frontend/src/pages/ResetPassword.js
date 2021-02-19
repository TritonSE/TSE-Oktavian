import React from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { 
  TextField, Button, Grid, Snackbar, Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { isAuthenticated } from '../util/auth';
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
    '& .MuiFormControl-root': {
      margin: theme.spacing(1),
      width: '100%'
    },
    '& .MuiButton-root': {
      margin: theme.spacing(3)
    },
  },
  title: {
    margin: theme.spacing(2),
    textAlign: 'center'
  },
  lightSpacing: {
    margin: theme.spacing(1),
    width: '100%'
  }
}));

export default function ResetPassword({match}) {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    password: '',
    confirm_password: '',
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
    if (state.password !== state.confirm_password) {
      setState({...state, form_disabled: false, snack: {message: 'Passwords do not match.', open: true}});
      return;
    }
    if (state.password.length < 6) {
      setState({...state, form_disabled: false, snack: {message: 'Password must be at least 6 characters long.', open: true}});
      return;
    }
    const submission = {
      token: match.params.token,
      password: state.password
    };
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });
      if (response.ok) {
        history.push("/");
      }
      else if (response.status === 403) {
        setState({...state, form_disabled: false, snack: {message: 'Invalid or expired token.', open: true}});
      }
      else {
        const text = await response.text();
        setState({...state, form_disabled: false, snack: {message: `Could not reset password: ${text}`, open: true}});
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
          Reset Your Password
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField label='Password' variant='outlined' type='password' onChange={handleChange('password')}/>
          <TextField label='Confirm Password' variant='outlined' type='password' onChange={handleChange('confirm_password')}/>
          <div className={classes.centered}>
            <Button variant="contained" color="primary" type="submit">Submit</Button>
          </div>
        </form>
      </Grid>   
      <Snackbar open={state.snack.open} autoHideDuration={6000} onClose={handleSnackClose} message={state.snack.message}/>
    </Grid> 
  )
}
