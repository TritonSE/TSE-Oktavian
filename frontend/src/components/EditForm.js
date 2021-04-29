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
} from "@material-ui/core";
import { withAuthorization } from "./HOC";
import { openAlert } from "../actions";
import { getRoles } from "../services/roles";

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
    // marginLeft: theme.spacing(6),
  },
  select: {
    width: "90%",
  },
}));

const EditForm = ({ userData }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    roles: [],
    roleIdToNameMap: {},
    isAdmin: userData.user.role.permissions.admin,
  });

  // const handleSubmit = async(event) => {
  //   event.preventDefault();
  // }

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
        <form className={classes.form}>
          {state.isAdmin ? (
            <>
              <div container className={classes.textCont}>
                <Typography className={classes.nonEdit} variant="caption">
                  User ID
                </Typography>
                <Typography className={classes.nonEdit}>{userData.user._id}</Typography>
                <hr />
              </div>
              <TextField
                label="Name"
                variant="outlined"
                type="text"
                defaultValue={userData.user.name}
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
              />
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                defaultValue={userData.user.email}
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
              <hr />
            </div>
          )}

          <TextField
            label="Phone Number"
            variant="outlined"
            type="text"
            defaultValue={userData.user.phone}
          />
          <TextField
            label="Github User"
            variant="outlined"
            type="text"
            defaultValue={userData.user.github_username}
          />
          <TextField
            label="Discord User"
            variant="outlined"
            type="text"
            defaultValue={userData.user.discord_username}
          />
          <TextField
            label="LinkedIn User"
            variant="outlined"
            type="text"
            defaultValue={userData.user.linkedin_username}
          />
          <Button variant="contained" color="secondary" type="submit">
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default withAuthorization(EditForm, true);
