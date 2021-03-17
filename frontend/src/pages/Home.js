import React from "react";
import PageContainer from "../components/PageContainer";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import { withAuthorization } from "../components/HOC";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  centered: {
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
        <Grid container spacing={0} alignItems="center" justify="center">
          <Grid item md={6} xs={12}>
            <Typography variant="h4" className={classes.title}>
              Home
            </Typography>
          </Grid>
        </Grid>
      </PageContainer>
    </>
  );
};

export default withAuthorization(Home, false, [], true);
