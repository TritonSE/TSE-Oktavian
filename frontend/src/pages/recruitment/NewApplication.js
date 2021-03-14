import React from "react";
import PageContainer from "../../components/PageContainer";
import { Helmet } from "react-helmet";
import {
  TextField,
  Button,
  Grid,
  FormHelperText,
  RadioGroup,
  FormLabel,
  FormControl,
  FormControlLabel,
  Radio,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { sendData } from "../../services/data";
import { useDispatch } from "react-redux";
import { openAlert } from "../../actions";

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

export default function NewApplication() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    disabled: false,
    name: "",
    email: "",
    role: "Project Manager",
    graduation: "2021",
    resume: "",
    about: "",
    why: "",
  });
  const dispatch = useDispatch();

  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setState({
      ...state,
      disabled: true,
    });
    const submission = {
      name: state.name,
      email: state.email,
      role: state.role,
      graduation: parseInt(state.graduation),
      resume: state.resume,
      about: state.about,
      why: state.why,
    };
    const { ok, data } = await sendData(
      "api/applications",
      false,
      "POST",
      JSON.stringify(submission)
    );
    if (ok) {
      dispatch(openAlert("Sample application was submitted successfully."));
    } else {
      dispatch(openAlert(`Error: ${data.message}`));
    }
    setState({
      ...state,
      disabled: false,
    });
  };

  // No restrictions on authentication here
  return (
    <>
      <Helmet>
        <title>Create Application — TSE Oktavian</title>
      </Helmet>
      <PageContainer>
        <Grid container spacing={0} alignItems="center" justify="center">
          <Grid item md={6} xs={12}>
            <Typography variant="h4" className={classes.title}>
              New Application
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
              <FormControl>
                <FormLabel component="legend">Position</FormLabel>
                <RadioGroup
                  aria-label="role"
                  name="role1"
                  value={state.role}
                  onChange={handleChange("role")}
                >
                  <FormControlLabel
                    control={<Radio />}
                    value="Project Manager"
                    label="Project Manager"
                  />
                  <FormControlLabel
                    control={<Radio />}
                    value="Developer"
                    label="Developer"
                  />
                  <FormControlLabel
                    control={<Radio />}
                    value="Designer"
                    label="Designer"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl>
                <FormLabel component="legend">Graduation Year</FormLabel>
                <RadioGroup
                  aria-label="graduation"
                  name="graduation1"
                  value={state.graduation}
                  onChange={handleChange("graduation")}
                >
                  <FormControlLabel
                    value="2021"
                    control={<Radio />}
                    label="2021"
                  />
                  <FormControlLabel
                    value="2022"
                    control={<Radio />}
                    label="2022"
                  />
                  <FormControlLabel
                    value="2023"
                    control={<Radio />}
                    label="2023"
                  />
                  <FormControlLabel
                    value="2024"
                    control={<Radio />}
                    label="2024"
                  />
                </RadioGroup>
              </FormControl>
              <TextField
                label="Resume"
                variant="outlined"
                type="text"
                onChange={handleChange("resume")}
              />
              <FormHelperText className={classes.lightSpacing}>
                The resume field must contain a URL.
              </FormHelperText>
              <TextField
                multiline
                label="About Yourself"
                variant="outlined"
                type="text"
                onChange={handleChange("about")}
              />
              <TextField
                multiline
                label="Why TSE?"
                variant="outlined"
                type="text"
                onChange={handleChange("why")}
              />
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
}