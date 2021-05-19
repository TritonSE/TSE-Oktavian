import React from "react";
import { Helmet } from "react-helmet";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import PageContainer from "../components/PageContainer";
import { withAuthorization } from "../components/HOC";
import UserCard from "../components/UserCard";
import ProjectsCard from "../components/ProjectsCard";

const useStyles = makeStyles((theme) => ({
  grid: {
    textAlign: "center",
  },
  form: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "90%",
    },
    "& .MuiButton-root": {},
    "& .MuiInputBase-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 0.6)",
    },
  },
  lightSpacing: {
    margin: theme.spacing(1),
    width: "100%",
  },
  card: {
    maxWidth: 440,
  },
  button: {
    maxWidth: 200,
    color: "black",
    textTransform: "none",
  },
}));

const RosterInfo = (card) => {
  const classes = useStyles();
  const loginState = useSelector((lstate) => lstate.login);

  return (
    <>
      <Helmet>
        <title>Roster — TSE Oktavian</title>
      </Helmet>
      <PageContainer>
        <Grid
          container
          spacing={4}
          alignItems="flex-start"
          justify="center"
          className={classes.grid}
        >
          <Grid item md={4} xs={12}>
            <UserCard userData={loginState} card={card} />
          </Grid>
          <Grid item md={4} xs={12}>
            <ProjectsCard user={card.match.params.userid} />
          </Grid>
        </Grid>
      </PageContainer>
    </>
  );
};

export default withAuthorization(RosterInfo, true);
