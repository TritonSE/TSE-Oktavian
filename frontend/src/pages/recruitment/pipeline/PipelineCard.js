import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Select,
  MenuItem,
  Button,
  Tooltip,
  TextField,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Autocomplete } from "@material-ui/lab/Autocomplete";
import { useDispatch } from "react-redux";

import { withAuthorization } from "../../../components/HOC";
import { openAlert } from "../../../actions";
import { createPipeline, deletePipeline, updatePipeline } from "../../../services/pipelines";

const useStyles = makeStyles((theme) => ({
  show: {
    position: "relative",
    display: "block",
    marginBottom: 15,
  },
  hide: {
    display: "none",
  },
  title: {
    margin: theme.spacing(2),
  },
  closeBtn: {
    position: "absolute",
    right: 12,
    top: 12,
    cursor: "pointer",
  },
  select: {
    minWidth: 175,
  },
  autocompleteCont: {
    width: 500,
  },
  saveBtn: {
    marginTop: 15,
  },
}));

const PipelineCard = ({ pipeline, roles, users }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [state, setState] = useState({
    isNewPipeline: pipeline === undefined,
    role: pipeline ? pipeline.role._id : "",
    reviewers: pipeline ? pipeline.reviewers : [],
    pipelineId: pipeline ? pipeline._id : "",
    updated: false,
    enabled: true,
  });

  const roleIdToNameMap = roles.reduce((map, role) => {
    map[role._id] = role.name;
    return map;
  }, {});

  const initialReviewers = new Set(state.reviewers.map((reviewer_data) => reviewer_data._id));

  const handleSave = async (event) => {
    event.preventDefault();

    if (state.isNewPipeline) {
      const body = {
        role: state.role,
        reviewers: state.reviewers.map((reviewer) => reviewer._id),
      };

      createPipeline(body).then(({ ok, data }) => {
        if (ok) {
          dispatch(openAlert("New pipeline created!"));

          setState({
            ...state,
            updated: false,
            isNewPipeline: false,
            pipelineId: data.pipeline._id,
          });
        } else {
          dispatch(openAlert(`Error: ${data.message}`));
        }
      });
    } else {
      const body = {
        id: state.pipelineId,
        role: state.role,
        reviewers: state.reviewers.map((reviewer) => reviewer._id),
      };

      updatePipeline(body).then(({ ok, data }) => {
        if (ok) {
          dispatch(openAlert("Pipeline successfully updated"));
          setState({
            ...state,
            updated: false,
          });
        } else {
          dispatch(openAlert(`Error: ${data.message}`));
        }
      });
    }
  };

  const handleClose = async (event) => {
    event.preventDefault();

    if (!state.isNewPipeline) {
      const body = {
        id: state.pipelineId,
      };

      deletePipeline(body).then(({ ok, data }) => {
        if (ok) {
          dispatch(openAlert("Pipeline successfully deleted"));
          setState({
            ...state,
            enabled: false,
          });
        } else {
          dispatch(openAlert(`Error: ${data.message}`));
        }
      });
    } else {
      setState({
        ...state,
        enabled: false,
      });
    }
  };

  return (
    <Card className={state.enabled ? classes.show : classes.hide}>
      <CardContent>
        <Tooltip title={state.isNewPipeline ? "Cancel" : "Delete Pipeline"}>
          <CloseIcon onClick={handleClose} className={classes.closeBtn} />
        </Tooltip>
        <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={5}>
          <Grid item>
            <Typography variant="h6">Role</Typography>
            <Select
              value={state.role}
              className={classes.select}
              onChange={(event) => {
                setState({
                  ...state,
                  role: event.target.value,
                  updated: true,
                });
              }}
              renderValue={(value) => roleIdToNameMap[value]}
            >
              {roles.map((role) => (
                <MenuItem key={role._id} value={role._id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item>
            <Typography variant="h6">Reviewers</Typography>
            <div className={classes.autocompleteCont}>
              <Autocomplete
                multiple
                options={users}
                getOptionLabel={(user) => user.name}
                value={users.filter((user) => initialReviewers.has(user._id))}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" placeholder="Reviewers" />
                )}
                onChange={(_, newValue) => {
                  setState({
                    ...state,
                    reviewers: newValue,
                    updated: true,
                  });
                }}
              />
            </div>
          </Grid>
        </Grid>
        <Grid container direction="row" justify="center" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            disabled={!state.updated}
            onClick={handleSave}
            className={classes.saveBtn}
          >
            {state.isNewPipeline ? "Create" : "Update"}
          </Button>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default withAuthorization(PipelineCard, true, ["recruitment"]);
