import React from "react";
import { Helmet } from "react-helmet";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import { ExitToApp } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import PageContainer from "../../components/PageContainer";
import LoadingContainer from "../../components/LoadingContainer";
import { getApplication } from "../../services/applications";
import { getApplicationReviews, updateReview } from "../../services/reviews";
import { openAlert } from "../../actions";
import { withAuthorization } from "../../components/HOC";

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

const Application = ({ match }) => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    // Initial backend data
    loading: true,
    application: {},
    reviews: [],
    // User input
    modal: false,
    comments: "",
    rating: "",
    accepted: false,
  });
  const loginState = useSelector((lstate) => lstate.login);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const loadData = async () => {
      const { ok: ok1, data: data1 } = await getApplication(match.params.appid);
      if (!ok1) {
        dispatch(openAlert(`Error: ${data1.message}`));
        setState((prev_state) => ({
          ...prev_state,
          loading: false,
        }));
        return;
      }
      const application = {
        ...data1.application,
        created_at: new Date(data1.application.created_at),
      };
      const { ok: ok2, data: data2 } = await getApplicationReviews(match.params.appid);
      if (!ok2) {
        dispatch(openAlert(`Error: ${data2.message}`));
        setState((prev_state) => ({
          ...prev_state,
          loading: false,
        }));
        return;
      }
      const reviews = data2.reviews
        .map((review) => ({ ...review, created_at: new Date(review.created_at) }))
        .sort((a, b) => a.created_at - b.created_at);
      const updates = {
        loading: false,
        application,
        reviews,
      };
      // If a review is not completed, fill in the user input with what they last saved
      // Note that at most one review can be incomplete at a time (corresponds to the last stage)
      for (const review of reviews) {
        if (!review.completed) {
          updates.comments = review.comments;
          updates.rating = review.rating;
          updates.accepted = review.accepted;
          break;
        }
      }
      setState((prev_state) => ({
        ...prev_state,
        ...updates,
      }));
    };
    if (state.loading) {
      loadData();
    }
  }, [state.loading, match.params.appid, dispatch]);

  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value });
  };

  const handleRadioChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value === "true" });
  };

  const handleModalOpen = () => {
    setState({ ...state, modal: true });
  };

  const handleModalClose = () => {
    setState({ ...state, modal: false });
  };

  const handleSubmit = (completed) => async (event) => {
    event.preventDefault();
    const body = {
      comments: state.comments,
      rating: state.rating,
      accepted: state.accepted,
      completed,
    };
    let incomplete_review = null;
    for (const review of state.reviews) {
      if (!review.completed) {
        incomplete_review = review;
        break;
      }
    }
    if (incomplete_review != null) {
      const { ok, data } = await updateReview(incomplete_review._id, body);
      if (ok) {
        dispatch(
          openAlert(
            data.review.completed ? "Review completed!" : "Review progress saved successfully."
          )
        );
        setState({
          ...state,
          loading: true,
          modal: false,
        });
      } else {
        dispatch(openAlert(`Error: ${data.message}`));
        setState({
          ...state,
          modal: false,
        });
      }
    }
  };

  const fixedReview = (review) => {
    let review_status;
    if (!review.completed) {
      review_status = <Chip label="Incomplete" />;
    } else if (!review.accepted) {
      review_status = <Chip label="Rejected" color="secondary" />;
    } else {
      review_status = <Chip label="Passed" color="primary" />;
    }
    return (
      <Card className={classes.card}>
        <CardContent>
          <h3>{review.stage} Stage</h3>
          {review_status}
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
              {review.completed ? (
                <></>
              ) : (
                <Grid item xs={12}>
                  <FormControl>
                    <FormLabel component="legend">
                      Should this person move on to next stage?
                    </FormLabel>
                    <RadioGroup
                      aria-label="accepted"
                      name="accepted"
                      defaultValue={review.accepted}
                    >
                      <FormControlLabel control={<Radio />} value label="Yes" disabled />
                      <FormControlLabel control={<Radio />} value={false} label="No" disabled />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </form>
        </CardContent>
      </Card>
    );
  };

  const editableReview = (review) => (
    <Card className={classes.card}>
      <CardContent>
        <h3>{review.stage} Stage</h3>
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
              <FormControl>
                <FormLabel component="legend">Should this person move on to next stage?</FormLabel>
                <RadioGroup
                  aria-label="accepted"
                  name="accepted"
                  value={state.accepted}
                  onChange={handleRadioChange("accepted")}
                >
                  <FormControlLabel control={<Radio />} value label="Yes" />
                  <FormControlLabel control={<Radio />} value={false} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleModalOpen}>
                Complete
              </Button>
              <Button variant="contained" color="secondary" onClick={handleSubmit(false)}>
                Save for Later
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );

  let application_status;
  if (!state.application.completed) {
    application_status = <Chip label="In review" />;
  } else if (!state.application.accepted) {
    application_status = <Chip label="Rejected" color="secondary" />;
  } else {
    application_status = <Chip label="Accepted" color="primary" />;
  }

  return (
    <>
      <Helmet>
        <title>Loading Application — TSE Oktavian</title>
      </Helmet>
      <PageContainer title="Viewing Application">
        <LoadingContainer loading={state.loading}>
          {state.loading ? (
            <></>
          ) : (
            <>
              <Helmet>
                <title>{`${state.application.name}'s Application — TSE Oktavian`}</title>
              </Helmet>
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
                      {`${state.application.name}'s ${state.application.created_at.getFullYear()} ${
                        state.application.role.name
                      } Application`}
                    </h2>
                    {application_status}
                    <form className={classes.form}>
                      <Grid container spacing={3}>
                        <Grid item md={4} xs={12}>
                          <TextField
                            label="Name"
                            variant="outlined"
                            type="text"
                            defaultValue={state.application.name}
                            disabled
                          />
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <TextField
                            label="Email"
                            variant="outlined"
                            type="email"
                            defaultValue={state.application.email}
                            disabled
                          />
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <TextField
                            label="Role"
                            variant="outlined"
                            type="text"
                            defaultValue={state.application.role.name}
                            disabled
                          />
                        </Grid>
                        <Grid item md={3} xs={6}>
                          <TextField
                            label="Start Quarter"
                            variant="outlined"
                            type="text"
                            defaultValue={state.application.start_quarter}
                            disabled
                          />
                        </Grid>
                        <Grid item md={3} xs={6}>
                          <TextField
                            label="Start Year"
                            variant="outlined"
                            type="text"
                            defaultValue={state.application.start_year}
                            disabled
                          />
                        </Grid>
                        <Grid item md={3} xs={6}>
                          <TextField
                            label="Graduation Quarter"
                            variant="outlined"
                            type="text"
                            defaultValue={state.application.graduation_quarter}
                            disabled
                          />
                        </Grid>
                        <Grid item md={3} xs={6}>
                          <TextField
                            label="Graduation Year"
                            variant="outlined"
                            type="text"
                            defaultValue={state.application.graduation_year}
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
                      if (
                        !review.completed &&
                        loginState.authenticated &&
                        review.reviewer._id === loginState.user._id
                      ) {
                        return editableReview(review);
                      }
                      return fixedReview(review);
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
                    Please confirm that your review is accurate!
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Reverting reviews is painful, particularly since all rejection emails are
                      automated. Triple check that you have made the appropriate decision for the
                      applicant before submitting your review as it is final.
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
              </Grid>
            </>
          )}
        </LoadingContainer>
      </PageContainer>
    </>
  );
};

export default withAuthorization(Application, true, ["recruitment"]);
