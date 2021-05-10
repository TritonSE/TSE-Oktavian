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
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

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
  const [state, setState] = useState({
    loading: false,
    role,
    permissions: {
      ...role.permissions,
      edit_project: false,
      create_project: false,
      manage_role: false,
      activate_accounts: false,
    },
  });

  const handleChange = (event) => {
    const { permissions } = state;
    const field_name = event.target.name;
    permissions[field_name] = event.target.checked;
    setState({ ...state, permissions });
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
            />
          )}

          <Typography variant="h5">Role Permissions</Typography>

          <FormControl component="fieldset" className={classes.formControl}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.permissions.roster}
                    onChange={handleChange}
                    name="roster"
                  />
                }
                label="View Roster"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.permissions.recruitment}
                    onChange={handleChange}
                    name="recruitment"
                  />
                }
                label="Recruitment"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.permissions.final_approval}
                    onChange={handleChange}
                    name="final_approval"
                  />
                }
                label="Final Review"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.permissions.admin}
                    onChange={handleChange}
                    name="admin"
                  />
                }
                label="Admin"
              />
              <FormControlLabel
                className={classes.indentedCheckbox}
                disabled={!state.permissions.admin}
                control={
                  <Checkbox
                    checked={state.permissions.edit_project}
                    onChange={handleChange}
                    name="edit_project"
                  />
                }
                label="Edit Existing Project"
              />
              <FormControlLabel
                className={classes.indentedCheckbox}
                disabled={!state.permissions.admin}
                control={
                  <Checkbox
                    checked={state.permissions.create_project}
                    onChange={handleChange}
                    name="create_project"
                  />
                }
                label="Create New Project"
              />
              <FormControlLabel
                className={classes.indentedCheckbox}
                disabled={!state.permissions.admin}
                control={
                  <Checkbox
                    checked={state.permissions.manage_role}
                    onChange={handleChange}
                    name="manage_role"
                  />
                }
                label="Manage Role"
              />
              <FormControlLabel
                className={classes.indentedCheckbox}
                disabled={!state.permissions.admin}
                control={
                  <Checkbox
                    checked={state.permissions.activate_accounts}
                    onChange={handleChange}
                    name="activate_accounts"
                  />
                }
                label="Activate/Deactivate Accounts"
              />
            </FormGroup>
          </FormControl>

          {mode === "edit" ? (
            <Button
              className={`${classes.deleteButton} ${classes.warning}`}
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={(event) => {
                event.preventDefault();

                // TODO - Implement delete functionality
              }}
            >
              Delete Role
            </Button>
          ) : (
            ""
          )}
        </CardContent>
      </Card>

      <Grid container xs={12} alignItems="center" justify="center">
        <Button
          className={classes.saveButton}
          variant="contained"
          color="primary"
          onClick={(event) => {
            event.preventDefault();
            // TODO - Implement save function
          }}
        >
          Save Changes
        </Button>
      </Grid>
    </>
  );
};

export default withAuthorization(RolePermissionCard, true, ["admin"]);
