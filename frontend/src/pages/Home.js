import React from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { withAuthorization } from "../components/HOC";
import PageContainer from "../components/PageContainer";
import UserCard from "../components/UserCard";
import ProjectsCard from "../components/ProjectsCard";

const useStyles = makeStyles((theme) => ({
  grid: {
    textAlign: "center",
  },
  title: {
    margin: theme.spacing(2),
    textAlign: "center",
  },
}));

const Home = () => {
  const classes = useStyles();
  const loginState = useSelector((state) => state.login);
  if (!loginState.authenticated) {
    return <Redirect to="/login" />;
  }
  return (
    <>
      <Helmet>
        <title>Home — TSE Oktavian</title>
      </Helmet>
      <PageContainer>
        <Grid
          container
          className={classes.grid}
          spacing={4}
          alignItems="flex-start"
          justify="center"
        >
          <Grid item md={4} xs={12}>
            <UserCard userData={loginState} card={loginState} />
          </Grid>
          <Grid item md={4} xs={12}>
            <ProjectsCard user={loginState.user._id} />
          </Grid>
        </Grid>
      </PageContainer>
    </>
  );
};

export default withAuthorization(Home, false, [], true);
