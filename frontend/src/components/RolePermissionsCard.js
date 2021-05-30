import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteRole, editRole, createRole } from "../services/roles";
import { openAlert } from "../actions";

import { withAuthorization } from "./HOC";

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 400,
    padding: "30px 20px",
  },
  roleName: {
    borderRadius: 5,
    border: "1px solid lightgray",
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  inputField: {
    width: "90%",
    padding: "3px !important",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  indentedCheckbox: {
    marginLeft: theme.spacing(2),
  },
  deleteButton: {
    width: "100%",
    color: "white",
    marginTop: theme.spacing(2),
  },
  saveButton: {
    margin: 30,
  },
  warning: {
    backgroundColor: "#D15555",
    "&:hover": {
      backgroundColor: "#b85454",
    },
  },
}));

const RolePermissionCard = ({ role, mode }) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    loading: false,
    role,
    modal: false,
  });

  const adminSubPermissions = [
    "user_edit",
    "project_edit",
    "project_create",
    "role_management",
    "account_activation",
  ];

  const handleModalOpen = () => {
    setState({ ...state, modal: true });
  };

  const handleModalClose = () => {
    setState({ ...state, modal: false });
  };

  const handleDelete = () => {
    deleteRole(state.role._id).then((res) => {
      if (!res.ok) {
        // reports error if server responds with invalid status
        dispatch(openAlert(`Error: ${res.data.message}`));
        return;
      }
      history.push(`/admin/roles/`);
    });
  };

  const handleSubmit = (fun) => {
    // checks to make sure name field is not empty
    if (state.role.name === null || state.role.name === "") {
      dispatch(openAlert(`Error: name field cannot be empty.`));
      return;
    }

    // calls the create/edit function depending on the page
    fun(state.role).then((res) => {
      if (!res.ok) {
        // reports error if server responds with invalid status
        dispatch(openAlert(`Error: ${res.data.message}`));
        return;
      }
      history.push(`/admin/roles/`);
    });
  };

  // capitalizes first letter of every word
  const capitalize = (str) => {
    const words = str.toLowerCase().split(" ");

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(" ");
  };

  const handleTextField = (event) => {
    const text = capitalize(event.target.value);
    setState((prevState) => ({
      ...prevState,
      role: {
        ...prevState.role,
        name: text,
      },
    }));
  };

  const handleChange = (event) => {
    const { permissions } = state.role;
    let { external_recruitment } = state.role;
    const field_name = event.target.name;
    if (field_name === "external_recruitment") {
      // handle special case for external_recruitment field
      external_recruitment = event.target.checked;
    } else {
      permissions[field_name] = event.target.checked;
    }

    // unchecks admin box if any indented checkboxes were unchecked
    if (adminSubPermissions.includes(field_name) && !permissions[field_name]) {
      permissions["admin"] = false;
    }

    setState((prevState) => ({
      ...prevState,
      role: {
        ...prevState.role,
        permissions,
        external_recruitment,
      },
    }));
  };

  const handleAdminChange = (event) => {
    const { permissions } = state.role;
    const field_name = event.target.name;
    permissions[field_name] = event.target.checked;
    // if admin set to true, check all indented permissions
    if (event.target.checked) {
      adminSubPermissions.forEach((subPermission) => {
        permissions[subPermission] = true;
      });
    } else {
      adminSubPermissions.forEach((subPermission) => {
        permissions[subPermission] = false;
      });
    }

    setState((prevState) => ({
      ...prevState,
      role: {
        ...prevState.role,
        permissions,
      },
    }));
  };

  // if all admin subpermissions are checked, return true
  const checkAllSubPermissions = (permissions) => {
    let result = true;
    adminSubPermissions.forEach((subPermission) => {
      if (!permissions[subPermission]) {
        result = false;
      }
    });
    return result;
  };

  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5">Role Name</Typography>

          {mode === "edit" ? (
            <Typography variant="h6" className={classes.roleName}>
              {state.role.name}
            </Typography>
          ) : (
            <TextField
              className={classes.inputField}
              variant="outlined"
              palceholder="Role Name"
              required
              onChange={handleTextField}
            />
          )}

          <Typography variant="h5">Role Permissions</Typography>

          <FormControl component="fieldset" className={classes.formControl}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.role.permissions.roster || false}
                    onChange={handleChange}
                    name="roster"
                  />
                }
                label="View Roster"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.role.permissions.recruitment || false}
                    onChange={handleChange}
                    name="recruitment"
                  />
                }
                label="Recruitment"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.role.permissions.final_approval || false}
                    onChange={handleChange}
                    name="final_approval"
                  />
                }
                label="Final Review"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkAllSubPermissions(state.role.permissions) || false}
                    onChange={handleAdminChange}
                    name="admin"
                  />
                }
                label="Admin"
              />
              <FormControlLabel
                className={classes.indentedCheckbox}
                control={
                  <Checkbox
                    checked={state.role.permissions.user_edit || false}
                    onChange={handleChange}
                    name="user_edit"
                  />
                }
                label="Edit Users"
              />

              <FormControlLabel
                className={classes.indentedCheckbox}
                control={
                  <Checkbox
                    checked={state.role.permissions.project_edit || false}
                    onChange={handleChange}
                    name="project_edit"
                  />
                }
                label="Edit Existing Project"
              />
              <FormControlLabel
                className={classes.indentedCheckbox}
                control={
                  <Checkbox
                    checked={state.role.permissions.project_create || false}
                    onChange={handleChange}
                    name="project_create"
                  />
                }
                label="Create/Delete Projects"
              />
              <FormControlLabel
                className={classes.indentedCheckbox}
                control={
                  <Checkbox
                    checked={state.role.permissions.role_management || false}
                    onChange={handleChange}
                    name="role_management"
                  />
                }
                label="Manage Role"
              />
              <FormControlLabel
                className={classes.indentedCheckbox}
                control={
                  <Checkbox
                    checked={state.role.permissions.account_activation || false}
                    onChange={handleChange}
                    name="account_activation"
                  />
                }
                label="Activate/Deactivate Accounts"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.role.external_recruitment}
                    onChange={handleChange}
                    name="external_recruitment"
                  />
                }
                label="Can be assigned to pending users"
              />
            </FormGroup>
          </FormControl>

          {mode === "edit" ? (
            <Button
              className={`${classes.deleteButton} ${classes.warning}`}
              variant="contained"
              startIcon={<DeleteIcon />}
              disabled={state.role.builtin}
              onClick={(event) => {
                event.preventDefault();
                handleModalOpen();
              }}
            >
              Delete Role
            </Button>
          ) : (
            ""
          )}
        </CardContent>
      </Card>

      {mode === "edit" ? (
        <Dialog
          open={state.modal}
          onClose={handleModalClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Are you sure you want to delete the {state.role.name} role
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Deleting a role from the database is permanent and you will not be able to undo this
              action. Please make sure you understand what you are doing and that you mean to delete
              this role.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelete} color="primary" autoFocus>
              Confirm decision
            </Button>
            <Button onClick={handleModalClose} color="secondary">
              Go back
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        ""
      )}

      <Grid container xs={12} alignItems="center" justify="center">
        <Button
          type="submit"
          className={classes.saveButton}
          variant="contained"
          color="primary"
          onClick={(event) => {
            event.preventDefault();
            if (mode === "edit") {
              handleSubmit(editRole);
            } else {
              handleSubmit(createRole);
            }
          }}
        >
          {mode === "edit" ? "Save Changes" : "Create"}
        </Button>
      </Grid>
    </>
  );
};

export default withAuthorization(RolePermissionCard, true, ["role_management"]);
