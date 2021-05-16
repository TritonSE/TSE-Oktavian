import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
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
  const classes = useStyles();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    roles: [],
    roleIdToNameMap: {},
    isAdmin: userData.user.role.permissions.user_edit,
    user: {
      _id: userData.user._id,
      name: userData.user.name,
      role: userData.user.role._id,
      graduation: userData.user.graduation,
      phone: userData.user.phone,
      github_username: userData.user.github_username,
      discord_username: userData.user.discord_username,
      linkedin_username: userData.user.linkedin_username,
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
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
          {state.isAdmin ? (
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
                onChange={(event) => {
                  setState({
                    ...state,
                    user: {
                      ...state.user,
                      name: event.target.value,
                    },
                  });
                }}
              />
              <Select
                variant="outlined"
                defaultValue={userData.user.role._id}
                renderValue={(value) => state.roleIdToNameMap[value]}
                className={classes.select}
                align="left"
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  getContentAnchorEl: null,
                }}
                onChange={(event) => {
                  setState({
                    ...state,
                    user: {
                      ...state.user,
                      role: event.target.value,
                    },
                  });
                }}
              >
                {state.roles.map((role) => (
                  <MenuItem key={role._id} value={role._id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                label="Year"
                variant="outlined"
                type="text"
                defaultValue={userData.user.graduation}
                onChange={(event) => {
                  setState({
                    ...state,
                    user: {
                      ...state.user,
                      graduation: event.target.value,
                    },
                  });
                }}
              />
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                defaultValue={userData.user.email}
                onChange={(event) => {
                  setState({
                    ...state,
                    user: {
                      ...state.user,
                      email: event.target.value,
                    },
                  });
                }}
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
                Graduation Year
              </Typography>
              <Typography className={classes.nonEdit}>{userData.user.graduation}</Typography>
              <Typography className={classes.nonEdit} variant="caption">
                Email
              </Typography>
              <Typography className={classes.nonEdit}>{userData.user.email}</Typography>
              <Divider />
            </div>
          )}
          <TextField
            label="Phone Number"
            variant="outlined"
            type="text"
            defaultValue={userData.user.phone}
            onChange={(event) => {
              setState({
                ...state,
                user: {
                  ...state.user,
                  phone: event.target.value,
                },
              });
            }}
          />
          <TextField
            label="Github User"
            variant="outlined"
            type="text"
            defaultValue={userData.user.github_username}
            onChange={(event) => {
              setState({
                ...state,
                user: {
                  ...state.user,
                  github_username: event.target.value,
                },
              });
            }}
          />
          <TextField
            label="Discord User"
            variant="outlined"
            type="text"
            defaultValue={userData.user.discord_username}
            onChange={(event) => {
              setState({
                ...state,
                user: {
                  ...state.user,
                  discord_username: event.target.value,
                },
              });
            }}
          />
          <TextField
            label="LinkedIn User"
            variant="outlined"
            type="text"
            defaultValue={userData.user.linkedin_username}
            onChange={(event) => {
              setState({
                ...state,
                user: {
                  ...state.user,
                  linkedin_username: event.target.value,
                },
              });
            }}
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
