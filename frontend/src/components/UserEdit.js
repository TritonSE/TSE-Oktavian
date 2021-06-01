import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Divider,
} from "@material-ui/core";
import { withAuthorization } from "./HOC";
import { openAlert } from "../actions";
import { getRoles } from "../services/roles";
import { editUser } from "../services/users";

const useStyles = makeStyles((theme) => ({
  form: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "90%",
    },
    "& .MuiButton-root": {
      margin: theme.spacing(3),
    },
    "& .MuiInputBase-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 0.6)",
    },
  },
  nonEdit: {
    marginBottom: theme.spacing(2),
  },
  textCont: {
    textAlign: "left",
    padding: "5%",
  },
  card: {
    maxWidth: 440,
  },
  select: {
    width: "90%",
  },
  button: {
    maxWidth: 171,
    color: "black",
    textTransform: "none",
  },
}));

const UserEdit = ({ userData }) => {
  const quarters = ["Fall", "Winter", "Spring", "Summer"];
  const linkedinURL = "linkedin.com/in/";
  const classes = useStyles();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    roles: [],
    roleIdToNameMap: {},
    canEdit: userData.user.role.permissions.user_edit,
    user: {
      _id: userData.user._id,
      name: userData.user.name,
      role: userData.user.role._id,
      grad_quarter: userData.user.grad_quarter,
      graduation: userData.user.graduation,
      phone: userData.user.phone,
      github_username: userData.user.github_username,
      discord_username: userData.user.discord_username,
      linkedin_username: userData.user.linkedin_username,
    },
  });

  const handleUserChange = (prop) => (event) => {
    setState({
      ...state,
      user: {
        ...state.user,
        [prop]: event.target.value,
      },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // checks to make sure linkedin is a url containing "linkedin.com/in/"
    if (state.user.linkedin_username.indexOf(linkedinURL) === -1) {
      dispatch(openAlert("Make sure the linkedin field contains 'linkedin/in/'!"));
      return;
    }

    // adds 'https://' if not already presesnt
    if (state.user.linkedin_username.indexOf("https://www.") !== 0) {
      setState({
        ...state,
        user: {
          ...state.user,
          linkedin_username: `https://www.${state.user.linkedin_username}`,
        },
      });
    }

    const { ok, data } = await editUser(state.user);
    if (ok) {
      dispatch(openAlert("User info successfully updated!"));
    } else {
      dispatch(openAlert(`Error: ${data.message}`));
    }
  };

  useEffect(() => {
    const loadRoles = async () => {
      const roles_res = await getRoles();
      if (roles_res.ok) {
        setState({
          ...state,
          roles: roles_res.data.roles,
          roleIdToNameMap: roles_res.data.roles.reduce((map, role) => {
            map[role._id] = role.name;
            return map;
          }, {}),
        });
      } else {
        dispatch(openAlert(`Error: ${roles_res.data.message}`));
      }
    };
    loadRoles();
  }, []);

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5">Account Info</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          {state.canEdit ? (
            <>
              <div className={classes.textCont}>
                <Typography className={classes.nonEdit} variant="caption">
                  User ID
                </Typography>
                <Typography className={classes.nonEdit}>{userData.user._id}</Typography>
                <Divider />
              </div>
              <TextField
                label="Name"
                variant="outlined"
                type="text"
                defaultValue={userData.user.name}
                onChange={handleUserChange("name")}
              />
              <TextField
                select
                label="Role"
                variant="outlined"
                defaultValue={userData.user.role._id}
                renderValue={(value) => state.roleIdToNameMap[value]}
                className={classes.select}
                align="left"
                SelectProps={{
                  MenuProps: {
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    getContentAnchorEl: null,
                  },
                }}
                onChange={handleUserChange("role")}
              >
                {state.roles.map((role) => (
                  <MenuItem key={role._id} value={role._id}>
                    {role.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                defaultValue={userData.user.email}
                onChange={handleUserChange("email")}
              />
            </>
          ) : (
            <div container className={classes.textCont}>
              <Typography className={classes.nonEdit} variant="caption">
                User ID
              </Typography>
              <Typography className={classes.nonEdit}>{userData.user._id}</Typography>
              <Typography className={classes.nonEdit} variant="caption">
                Name
              </Typography>
              <Typography className={classes.nonEdit}>{userData.user.name}</Typography>
              <Typography className={classes.nonEdit} variant="caption">
                Role
              </Typography>
              <Typography className={classes.nonEdit}>
                {state.roleIdToNameMap[userData.user.role._id]}
              </Typography>
              <Typography className={classes.nonEdit} variant="caption">
                Email
              </Typography>
              <Typography className={classes.nonEdit}>{userData.user.email}</Typography>
              <Divider />
            </div>
          )}
          <TextField
            select
            label="Graduation Quarter"
            variant="outlined"
            value={state.user.grad_quarter}
            align="left"
            onChange={handleUserChange("grad_quarter")}
            SelectProps={{
              MenuProps: {
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              },
            }}
          >
            {quarters.map((qtr) => (
              <MenuItem key={qtr} value={qtr}>
                {qtr}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Graduation Year"
            variant="outlined"
            type="number"
            defaultValue={userData.user.graduation}
            onChange={handleUserChange("graduation")}
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            type="text"
            defaultValue={userData.user.phone}
            onChange={handleUserChange("phone")}
          />
          <TextField
            label="Github User"
            variant="outlined"
            type="text"
            defaultValue={userData.user.github_username}
            onChange={handleUserChange("github_username")}
          />
          <TextField
            label="Discord User"
            variant="outlined"
            type="text"
            defaultValue={userData.user.discord_username}
            onChange={handleUserChange("discord_username")}
          />
          <TextField
            label="LinkedIn User"
            variant="outlined"
            type="text"
            defaultValue={userData.user.linkedin_username}
            onChange={handleUserChange("linkedin_username")}
          />
          <Button
            disableElevation
            variant="contained"
            color="text.secondary"
            type="submit"
            className={classes.button}
          >
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default withAuthorization(UserEdit, true);
