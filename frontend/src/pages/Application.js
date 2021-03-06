import React from "react";
import PropTypes from "prop-types";
import WithData from "../components/WithData";
import WithAuthentication from "../components/WithAuthentication";
import WithNavbar from "../components/WithNavbar";
import { Helmet } from "react-helmet";
import {
  FormLabel,
  Checkbox,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Chip,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import { ExitToApp } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { getUser } from "../services/auth";
import { sendData } from "../services/data";
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
  const [state, setState] = React.useState({
    // Boilerplate
    snack: {
      message: "",
      open: false,
    },
    // Backend data
    reloading_application: true,
    reloading_reviews: true,
    application: {},
    reviews: [],
    // User input
    modal: false,
    comments: "",
    rating: "",
    accepted: false,
  });

  const handleApplicationData = (data) => {
    const application = data.application;
    setState({
      ...state,
      reloading_application: false,
      application: {
        ...application,
        created_at: new Date(application.created_at),
      },
    });
  };

  const handleReviewData = (data) => {
    const reviews = data.reviews;
    const new_state = {
      ...state,
      reloading_reviews: false,
      reviews: reviews.map((review) => {
        return { ...review, created_at: new Date(review.created_at) };
      }),
    };
    // If a review is not completed, fill in the user input with what they last saved
    // Note that at most one review can be incomplete at a time (corresponds to the last stage)
    for (const review of reviews) {
      if (!review.completed) {
        new_state.comments = review.comments;
        new_state.rating = review.rating;
        new_state.accepted = review.accepted;
        break;
      }
    }
    setState(new_state);
  };

  const handleError = (data) => {
    setState({
      ...state,
      snack: {
        message: `Error: ${data.message}`,
        open: true,
      },
      reloading_application: false,
      reloading_reviews: false,
    });
  };

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
      const { ok, data } = await sendData(
        `api/reviews/${incomplete_review._id}`,
        true,
        "PUT",
        JSON.stringify(submission)
      );
      if (ok) {
        setState({
          ...state,
          reloading_application: true,
          reloading_reviews: true,
          modal: false,
          snack: {
            message: data.review.completed
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
            message: `Error: ${data.message}`,
            open: true,
          },
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
    <WithAuthentication allow={true}>
      <WithNavbar title="Viewing Application">
        <WithData
          slug={`api/applications/${match.params.appid}`}
          authenticated={true}
          reloading={state.reloading_application}
          onSuccess={handleApplicationData}
          onError={handleError}
        >
          <WithData
            slug={`api/reviews?application=${match.params.appid}`}
            authenticated={true}
            reloading={state.reloading_reviews}
            onSuccess={handleReviewData}
            onError={handleError}
          >
            <Helmet>
              <title>
                {state.reloading_application || state.reloading_reviews
                  ? "Oktavian — Loading Application"
                  : `Oktavian — ${state.application.name}'s Application`}
              </title>
            </Helmet>
            {state.reloading_application || state.reloading_reviews ? (
              <></>
            ) : (
              <Grid
                container
                spacing={0}
                alignItems="center"
                justify="center"
                className={classes.grid}
              >
                <Grid item xs={10}>
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
                      Reverting reviews is painful, particularly since all
                      rejection emails are automated. Triple check that you have
                      made the appropriate decision for the applicant before
                      submitting your review as it is final.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleSubmit(true)}
                      color="primary"
                      autoFocus
                    >
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
            )}
          </WithData>
        </WithData>
      </WithNavbar>
    </WithAuthentication>
  );
}

Application.propTypes = {
  match: PropTypes.object,
};
