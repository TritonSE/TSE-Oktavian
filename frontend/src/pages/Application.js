import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import {
  FormLabel,
  Checkbox,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Snackbar,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import { ExitToApp } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { isAuthenticated, getJWT, logout, getUser } from "../util/auth";
import { BACKEND_URL } from "../util/constants";
import { toTitleCase } from "../util/typography";

const useStyles = makeStyles((theme) => ({
  grid: {
    textAlign: "center",
  },
  form: {
    marginTop: theme.spacing(2),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "100%",
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

export default function Application({ match }) {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    snack: {
      message: "",
      open: false,
    },
    modal: false,
    loading: true,
    application: "",
    reviews: "",
    comments: "",
    rating: "",
    accepted: false,
  });

  React.useEffect(() => {
    if (!isAuthenticated()) {
      history.push("/");
      return;
    }
    const fetchData = async () => {
      try {
        let response = await fetch(
          `${BACKEND_URL}/api/applications/${match.params.appid}`,
          {
            headers: {
              Authorization: `Bearer ${getJWT()}`,
            },
          }
        );
        let json = await response.json();
        if (response.status === 401) {
          logout();
          history.push("/");
          return;
        } else if (!response.ok) {
          setState({
            ...state,
            loading: false,
            snack: {
              message: `Could not load application: ${json.message}`,
              open: true,
            },
          });
          return;
        }
        const application = json.application;
        response = await fetch(
          `${BACKEND_URL}/api/reviews?application=${match.params.appid}`,
          {
            headers: {
              Authorization: `Bearer ${getJWT()}`,
            },
          }
        );
        json = await response.json();
        if (response.status === 401) {
          logout();
          history.push("/");
          return;
        } else if (!response.ok) {
          setState({
            ...state,
            loading: false,
            snack: {
              message: `Could not load reviews: ${json.message}`,
              open: true,
            },
          });
          return;
        }
        const reviews = json.reviews;
        const new_state = {
          ...state,
          loading: false,
          application: {
            _id: application._id,
            about: application.about,
            accepted: application.accepted,
            completed: application.completed,
            created_at: new Date(application.created_at),
            current_stage: application.current_stage,
            email: application.email,
            graduation: application.graduation,
            name: application.name,
            resume: application.resume,
            role: application.role,
            why: application.why,
          },
          reviews: reviews.map((review) => {
            return {
              _id: review._id,
              accepted: review.accepted,
              comments: review.comments,
              completed: review.completed,
              created_at: new Date(review.created_at),
              rating: review.rating,
              reviewer: review.reviewer,
              stage: review.stage,
            };
          }),
        };
        for (const review of reviews) {
          if (!review.completed) {
            new_state.comments = review.comments;
            new_state.rating = review.rating;
            new_state.accepted = review.accepted;
            break;
          }
        }
        setState(new_state);
      } catch (error) {
        setState({
          ...state,
          loading: false,
          snack: { message: `An error occurred: ${error.message}`, open: true },
        });
      }
    };
    if (state.loading) {
      fetchData();
    }
  });

  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value });
  };

  const handleChecked = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.checked });
  };

  const handleModalOpen = () => {
    setState({ ...state, modal: true });
  };

  const handleModalClose = () => {
    setState({ ...state, modal: false });
  };

  const handleSubmit = (completed) => async (event) => {
    event.preventDefault();
    const submission = {
      comments: state.comments,
      rating: state.rating,
      accepted: state.accepted,
      completed: completed,
    };
    let incomplete_review = null;
    for (const review of state.reviews) {
      if (!review.completed) {
        incomplete_review = review;
        break;
      }
    }
    if (incomplete_review != null) {
      try {
        let response = await fetch(
          `${BACKEND_URL}/api/reviews/${incomplete_review._id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${getJWT()}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submission),
          }
        );
        let json = await response.json();
        if (response.ok) {
          setState({
            ...state,
            loading: true,
            modal: false,
            snack: {
              message: json.review.completed
                ? "Review completed!"
                : "Review progress saved successfully.",
              open: true,
            },
          });
        } else {
          setState({
            ...state,
            modal: false,
            snack: {
              message: `Could not update review: ${json.message}`,
              open: true,
            },
          });
        }
      } catch (error) {
        setState({
          ...state,
          modal: false,
          snack: { message: `An error occurred: ${error.message}`, open: true },
        });
      }
    }
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({ ...state, snack: { ...state.snack, open: false } });
  };

  return (
    <Grid
      container
      spacing={0}
      alignItems="center"
      justify="center"
      className={classes.grid}
    >
      <Grid item xs={10}>
        {state.loading ? (
          <LinearProgress />
        ) : (
          <div>
            <h2 id="application">
              {`${
                state.application.name
              }'s ${state.application.created_at.getFullYear()} ${toTitleCase(
                state.application.role
              )} Application`}
            </h2>
            {state.application.completed ? (
              state.application.accepted ? (
                <Chip label="Accepted" color="primary" />
              ) : (
                <Chip label="Rejected" color="secondary" />
              )
            ) : (
              <Chip label="In review" />
            )}
            <form className={classes.form}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    type="text"
                    defaultValue={state.application.name}
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    defaultValue={state.application.email}
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Role"
                    variant="outlined"
                    type="text"
                    defaultValue={state.application.role}
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Graduation Year"
                    variant="outlined"
                    type="text"
                    defaultValue={state.application.graduation}
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Submission Time"
                    variant="outlined"
                    type="email"
                    defaultValue={state.application.created_at}
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Resume"
                    variant="outlined"
                    type="text"
                    defaultValue={state.application.resume}
                    disabled
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    href={state.application.resume}
                    target="_blank"
                  >
                    Open resume &nbsp; <ExitToApp />
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    multiline
                    label="Tell us about yourself."
                    variant="outlined"
                    type="text"
                    defaultValue={state.application.about}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    multiline
                    label="Why TSE?"
                    variant="outlined"
                    type="text"
                    defaultValue={state.application.why}
                    disabled
                  />
                </Grid>
              </Grid>
            </form>
            <h2 id="reviews">Reviews</h2>
            {state.reviews.map((review) => {
              if (review.completed) {
                return (
                  <Card className={classes.card}>
                    <CardContent>
                      <h3>{toTitleCase(review.stage)} Stage</h3>
                      {review.accepted ? (
                        <Chip label="Passed" color="primary" />
                      ) : (
                        <Chip label="Rejected" color="secondary" />
                      )}
                      <form className={classes.form}>
                        <Grid container spacing={3}>
                          <Grid item xs={6}>
                            <TextField
                              label="Reviewer"
                              variant="outlined"
                              type="text"
                              defaultValue={review.reviewer.name}
                              disabled
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              label="Rating"
                              variant="outlined"
                              type="number"
                              defaultValue={review.rating}
                              disabled
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              multiline
                              label="Comments"
                              variant="outlined"
                              type="text"
                              defaultValue={review.comments}
                              disabled
                            />
                          </Grid>
                        </Grid>
                      </form>
                    </CardContent>
                  </Card>
                );
              } else if (review.reviewer._id === getUser()._id) {
                return (
                  <Card className={classes.card}>
                    <CardContent>
                      <h3>{toTitleCase(review.stage)} Stage</h3>
                      <Chip label="Incomplete" />
                      <form className={classes.form}>
                        <Grid container spacing={3}>
                          <Grid item xs={6}>
                            <TextField
                              label="Reviewer"
                              variant="outlined"
                              type="text"
                              defaultValue={review.reviewer.name}
                              disabled
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              label="Rating"
                              variant="outlined"
                              type="number"
                              onChange={handleChange("rating")}
                              defaultValue={state.rating}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              multiline
                              label="Comments"
                              variant="outlined"
                              type="text"
                              onChange={handleChange("comments")}
                              defaultValue={state.comments}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormLabel component="legend">
                              Should this person move on to next stage?
                            </FormLabel>
                            <Checkbox
                              name="accepted"
                              onChange={handleChecked("accepted")}
                              checked={state.accepted}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleModalOpen}
                            >
                              Complete
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={handleSubmit(false)}
                            >
                              Save for Later
                            </Button>
                          </Grid>
                        </Grid>
                      </form>
                    </CardContent>
                  </Card>
                );
              } else {
                return (
                  <Card className={classes.card}>
                    <CardContent>
                      <h3>{toTitleCase(review.stage)} Stage</h3>
                      <Chip label="Incomplete" />
                      <form className={classes.form}>
                        <Grid container spacing={3}>
                          <Grid item xs={6}>
                            <TextField
                              label="Reviewer"
                              variant="outlined"
                              type="text"
                              defaultValue={review.reviewer.name}
                              disabled
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              label="Rating"
                              variant="outlined"
                              type="number"
                              defaultValue={review.rating}
                              disabled
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              multiline
                              label="Comments"
                              variant="outlined"
                              type="text"
                              defaultValue={review.comments}
                              disabled
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormLabel component="legend">
                              Should this person move on to next stage?
                            </FormLabel>
                            <Checkbox
                              name="accepted"
                              checked={review.accepted}
                              disabled
                            />
                          </Grid>
                        </Grid>
                      </form>
                    </CardContent>
                  </Card>
                );
              }
            })}
          </div>
        )}
      </Grid>
      <Dialog
        open={state.modal}
        onClose={handleModalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Please confirm that your review is accurate!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Reverting reviews is painful, particularly since all rejection
            emails are automated. Triple check that you have made the
            appropriate decision for the applicant before submitting your review
            as it is final.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit(true)} color="primary" autoFocus>
            Confirm decision
          </Button>
          <Button onClick={handleModalClose} color="secondary">
            Go back
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={state.snack.open}
        autoHideDuration={6000}
        onClose={handleSnackClose}
        message={state.snack.message}
      />
    </Grid>
  );
}

Application.propTypes = {
  match: PropTypes.object,
};
