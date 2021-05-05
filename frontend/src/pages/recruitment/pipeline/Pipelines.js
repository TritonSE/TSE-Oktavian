import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Button } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";

import { withAuthorization } from "../../../components/HOC";
import PageContainer from "../../../components/PageContainer";
import LoadingContainer from "../../../components/LoadingContainer";
import { openAlert } from "../../../actions";
import { getUsers } from "../../../services/users";
import { getRoles } from "../../../services/roles";
import { getPipelines } from "../../../services/pipelines";

import PipelineCard from "./PipelineCard";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: theme.spacing(2),
  },
}));

const Pipelines = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [state, setState] = useState({
    loading: true,
    roles: [],
    users: [],
    pipelines: [],
    numNewPipelines: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      const roles_res = await getRoles();
      const users_res = await getUsers();
      const pipelines_res = await getPipelines();

      if (roles_res.ok && users_res.ok && pipelines_res.ok) {
        setState((prev_state) => ({
          ...prev_state,
          loading: false,
          roles: roles_res.data.roles,
          users: users_res.data.users,
          pipelines: pipelines_res.data.pipelines,
        }));
      } else {
        if (!roles_res.ok) {
          dispatch(openAlert(`Error: ${roles_res.data.message}`));
        }
        if (!users_res.ok) {
          dispatch(openAlert(`Error: ${users_res.data.message}`));
        }
        if (!pipelines_res.ok) {
          dispatch(openAlert(`Error: ${pipelines_res.data.message}`));
        }

        setState((prev_state) => ({
          ...prev_state,
          loading: false,
        }));
      }
    };

    if (state.loading) {
      loadData();
    }
  }, []);

  const newPipelines = Array(state.numNewPipelines)
    .fill()
    .map((_, idx) => (
      <PipelineCard key={`newPipeline-${idx}`} roles={state.roles} users={state.users} />
    ));

  return (
    <>
      <Helmet>
        <title>All Pipelines - TSE Oktavian</title>
      </Helmet>
      <PageContainer>
        <LoadingContainer loading={state.loading}>
          <Grid container direction="column" alignItems="center">
            <Typography variant="h5" className={classes.title}>
              Application Pipelines
            </Typography>
            {state.pipelines.map((pipeline) => (
              <PipelineCard
                key={pipeline._id}
                pipeline={pipeline}
                roles={state.roles}
                users={state.users}
              />
            ))}
            {newPipelines}
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setState({
                  ...state,
                  numNewPipelines: state.numNewPipelines + 1,
                });
              }}
            >
              Add New Pipeline
            </Button>
          </Grid>
        </LoadingContainer>
      </PageContainer>
    </>
  );
};

export default withAuthorization(Pipelines, true, ["recruitment"]);
