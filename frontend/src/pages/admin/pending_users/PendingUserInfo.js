import React, { useEffect, useState } from "react";

import { Helmet } from "react-helmet";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardContent,
  Grid,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
} from "@material-ui/core";

import PageContainer from "../../../components/PageContainer";
import { withAuthorization } from "../../../components/HOC";
import LoadingContainer from "../../../components/LoadingContainer";
import { getUser, deleteUser, activateUser } from "../../../services/users";
import { getRoles } from "../../../services/roles";
import { openAlert } from "../../../actions";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: "100%",
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  card: {
    minWidth: "400px",
    textAlign: "center",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(5),
  },
  btn: {
    marginLeft: "10px",
    marginRight: "10px",
  },
  select: {
    width: "90%",
  },
}));

const PendingUserInfo = ({ match }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [state, setState] = useState({
    loading: true,
    user: {},
    roles: [],
    assigned_role: "",
    showDecline: false,
    showAccept: false,
  });

  useEffect(() => {
    const loadData = async () => {
      const user_res = await getUser(match.params.userid);

      if (user_res.ok) {
        const roles_res = await getRoles();

        if (user_res.data.user === null) {
          dispatch(openAlert(`Error: User not found`));
          return;
        }

        if (user_res.data.user.role.name !== "Pending") {
          dispatch(openAlert(`Error: User was already assigned a role`));
          return;
        }

        if (roles_res.ok) {
          setState({
            ...state,
            loading: false,
            user: user_res.data.user,
            roles: roles_res.data.roles.filter((role) => role.external_recruitment),
          });
        } else {
          dispatch(openAlert(`Error: ${roles_res.data.message}`));
        }
      } else {
        dispatch(openAlert(`Error: ${user_res.data.message}`));
      }
    };

    if (state.loading) {
      loadData();
    }
  });

  const handleBtn = (field, value) => () => {
    setState({
      ...state,
      [field]: value,
    });
  };

  const handleAcceptDoneBtn = async () => {
    const { ok, data } = await activateUser(state.user._id, state.assigned_role);

    if (ok) {
      dispatch(openAlert("Successfully assigned role to pending user"));
      history.goBack();
    } else {
      dispatch(openAlert(`Error: ${data.message}`));
    }
  };

  const handleDeclineYesBtn = async () => {
    const { ok, data } = await deleteUser(state.user._id);

    if (ok) {
      dispatch(openAlert("Pending user has been deleted."));
      history.goBack();
    } else {
      dispatch(openAlert(`Error: ${data.message}`));
    }
  };

  const handleRoleChange = (event) => {
    setState({
      ...state,
      assigned_role: event.target.value,
    });
  };

  return (
    <>
      <Helmet>
        <title>Pending User Info — TSE Oktavian</title>
      </Helmet>
      <PageContainer>
        <LoadingContainer loading={state.loading}>
          <Grid container className={classes.root} justify="center" alignItems="center" spacing={0}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5">{state.user.name}</Typography>
                <Typography variant="caption">{state.user.email}</Typography>
              </CardContent>
            </Card>
            <Grid container direction="row" justify="center">
              <Button
                className={classes.btn}
                variant="contained"
                color="primary"
                onClick={handleBtn("showAccept", true)}
              >
                Accept
              </Button>
              <Button
                className={classes.btn}
                variant="contained"
                onClick={handleBtn("showDecline", true)}
              >
                Decline
              </Button>
            </Grid>
          </Grid>
          <Dialog
            open={state.showAccept}
            aria-labelledby="accept-dialog-title"
            aria-describedby="accept-dialog-description"
          >
            <DialogTitle id="accept-dialog-title">Accept User</DialogTitle>
            <DialogContent>
              <DialogContentText id="accept-dialog-description">
                Assign a role to complete the approval process.
              </DialogContentText>
              <TextField
                select
                label="Role"
                variant="outlined"
                className={classes.select}
                value={state.assigned_role}
                SelectProps={{
                  MenuProps: {
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    getContentAnchorEl: null,
                  },
                }}
                onChange={handleRoleChange}
              >
                {state.roles.map((role) => (
                  <MenuItem key={role._id} value={role._id}>
                    {role.name}
                  </MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleBtn("showAccept", false)} variant="contained">
                Cancel
              </Button>
              <Button
                onClick={handleAcceptDoneBtn}
                variant="contained"
                color="primary"
                disabled={state.assigned_role === ""}
              >
                Done
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={state.showDecline}
            aria-labelledby="decline-dialog-title"
            aria-describedby="decline-dialog-description"
          >
            <DialogTitle id="decline-dialog-title">Decline User</DialogTitle>
            <DialogContent>
              <DialogContentText id="decline-dialog-description">
                Are you sure you want to decline this pending user?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleBtn("showDecline", false)} variant="contained">
                Cancel
              </Button>
              <Button onClick={handleDeclineYesBtn} variant="contained" color="primary">
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </LoadingContainer>
      </PageContainer>
    </>
  );
};

export default withAuthorization(PendingUserInfo, true, ["final_approval"]);
