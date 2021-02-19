import React from 'react';
import { Redirect } from 'react-router-dom';
import { 
  TextField, Button, Grid, FormHelperText, 
  RadioGroup, FormLabel, FormControl, 
  FormControlLabel, Snackbar, Radio,
  Typography
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

export default function CreateApplication() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    name: '',
    email: '',
    role: 'PROJECT_MANAGER',
    graduation: '2021',
    resume: '',
    about: '',
    why: '',
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
    const submission = {
      name: state.name,
      email: state.email,
      role: state.role,
      graduation: parseInt(state.graduation),
      resume: state.resume,
      about: state.about,
      why: state.why
    };
    try {
      const response = await fetch(`${BACKEND_URL}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });
      if (response.ok) {
        setState({...state, form_disabled: false, snack: {message: 'Sample application was submitted successfully.', open: true}});
      }
      else if (response.status === 400) {
        setState({...state, form_disabled: false, snack: {message: 'Please fill out all required fields.', open: true}});
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

  // This route should be authenticated, so people don't stumble upon it and
  // begin submitting applications in the off-season
  return !isAuthenticated() ? <Redirect to="/"/> : ( 
    <Grid
      container
      spacing={0}
      alignItems="center"
      justify="center"
    >
      <Grid item md={6} xs={12}>
        <Typography variant="h4" className={classes.title}>
          Create a Sample Application
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField label='Name' variant='outlined' type='text' onChange={handleChange('name')}/>
          <TextField label='Email' variant='outlined' type='email' onChange={handleChange('email')}/>
          <FormControl>
            <FormLabel component="legend">Position</FormLabel>
            <RadioGroup aria-label="role" name="role1" value={state.role} onChange={handleChange('role')}>
              <FormControlLabel
                value="PROJECT_MANAGER"
                control={<Radio/>}
                label="Project Manager"
              />
              <FormControlLabel
                value="DEVELOPER"
                control={<Radio/>}
                label="Developer"
              />
              <FormControlLabel
                value="DESIGNER"
                control={<Radio/>}
                label="Designer"
              />
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel component="legend">Graduation Year</FormLabel>
            <RadioGroup aria-label="graduation" name="graduation1" value={state.graduation} onChange={handleChange('graduation')}>
              <FormControlLabel
                value="2021"
                control={<Radio/>}
                label="2021"
              />
              <FormControlLabel
                value="2022"
                control={<Radio/>}
                label="2022"
              />
              <FormControlLabel
                value="2023"
                control={<Radio/>}
                label="2023"
              />
              <FormControlLabel
                value="2024"
                control={<Radio/>}
                label="2024"
              />
            </RadioGroup>
          </FormControl>
          <TextField label='Resume' variant='outlined' type='text' onChange={handleChange('resume')}/>
          <FormHelperText className={classes.lightSpacing}>The resume field must contain a URL.</FormHelperText>
          <TextField multiline label='About Yourself' variant='outlined' type='text' onChange={handleChange('about')}/>
          <TextField multiline label='Why TSE?' variant='outlined' type='text' onChange={handleChange('why')}/>
          <div className={classes.centered}>
            <Button variant="contained" color="primary" type="submit">Submit</Button>
          </div>
        </form>
      </Grid>   
      <Snackbar open={state.snack.open} autoHideDuration={6000} onClose={handleSnackClose} message={state.snack.message}/>
    </Grid> 
  )
}
