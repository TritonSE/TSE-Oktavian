import { React, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  IconButton,
  Button,
  MenuItem,
  Menu,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Link,
} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LocalPhoneOutlinedIcon from "@material-ui/icons/LocalPhoneOutlined";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { withAuthorization } from "./HOC";
import { openAlert } from "../actions";
import { getUsers, deleteUser } from "../services/users";
import LoadingContainer from "./LoadingContainer";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 440,
  },
  bigIcon: {
    fontSize: 100,
  },
  adminIcon: {
    fontSize: 100,
    marginLeft: theme.spacing(5),
  },
  grayText: {
    color: "#8A8A8A",
    marginBottom: theme.spacing(1),
  },
  text: {
    marginBottom: theme.spacing(2),
  },
  smallIcon: {
    fontSize: "small",
    marginRight: theme.spacing(1),
  },
  leftText: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    textAlign: "left",
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  settings: {
    float: "right",
  },
}));

const roleButton = createMuiTheme({
  palette: {
    action: {
      disabled: "black",
    },
  },
});

const UserCard = ({ userData, card }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    loading: true,
    canEdit: userData.user.role.permissions.user_edit,
    canDelete: userData.user.role.permissions.account_activation,
    _id: null,
    name: "",
    role: "",
    graduation: 0,
    email: "",
    phone: "",
    github_username: "",
    discord_username: "",
    linkedin_username: "",
  });

  const stripLinkedin = (url) => {
    if (url === "") {
      return "";
    }
    const index = url.indexOf("/in/");
    return url.substring(index + 4, url.length - 1);
  };

  const handleDeactivateOpen = () => {
    setOpen(true);
  };

  const handleDeactivateClose = () => {
    setOpen(false);
  };

  const handleDeactivate = async () => {
    const { ok, data } = await deleteUser(state._id);
    if (ok) {
      dispatch(openAlert("Account successfully deleted!"));
      // if user deactivated their own account, redirect to login
      if (userData.user._id === state._id) {
        userData.authenticated = false;
        history.push("/login");
      } else {
        history.push("/roster");
      }
    } else {
      dispatch(openAlert(`Error: ${data.message}`));
    }
    setOpen(false);
  };

  useEffect(() => {
    const loadCard = async () => {
      const { ok, data } = await getUsers();
      if (ok) {
        // displays the user's own card for Home and a selected user for Roster
        let cardId = userData.user._id;
        if (card.match !== undefined) {
          cardId = card.match.params.userid;
        }
        const cardUser = data.users.find((user) => user._id === cardId);
        setState({
          ...state,
          loading: false,
          _id: cardUser._id,
          name: cardUser.name,
          role: cardUser.role.name.toUpperCase(),
          graduation: cardUser.graduation,
          email: cardUser.email,
          phone: cardUser.phone,
          github_username: cardUser.github_username,
          discord_username: cardUser.discord_username,
          linkedin_username: cardUser.linkedin_username,
        });
      } else {
        dispatch(openAlert(`Error: ${data.message}`));
        setState({
          ...state,
          loading: false,
        });
      }
    };
    if (state.loading) {
      loadCard();
    }
  }, []);

  return (
    <LoadingContainer loading={state.loading}>
      <Card className={classes.card}>
        <CardContent>
          {state.canEdit || state.canDelete ? (
            <>
              <IconButton
                className={classes.settings}
                aria-controls="settings"
                aria-haspopup="true"
                onClick={(event) => {
                  setAnchorEl(event.currentTarget);
                }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="settings"
                className={classes.root}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                onClose={() => {
                  setAnchorEl(null);
                }}
              >
                <MenuItem>Edit</MenuItem>
                {state.canDelete && <MenuItem onClick={handleDeactivateOpen}>Deactivate</MenuItem>}
                <Dialog
                  open={open}
                  onClose={handleDeactivateClose}
                  aria-describedby="deactivation-alert"
                >
                  <DialogContent>
                    <DialogContentText id="deactivation-alert">
                      Are you sure you want to deactivate this account?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleDeactivateClose} variant="outlined" color="primary">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDeactivate}
                      variant="contained"
                      color="primary"
                      autoFocus
                      disableElevation
                    >
                      Yes
                    </Button>
                  </DialogActions>
                </Dialog>
              </Menu>
              <AccountCircleOutlinedIcon className={classes.adminIcon} />
            </>
          ) : (
            <>
              <AccountCircleOutlinedIcon className={classes.bigIcon} />
            </>
          )}
          <Typography className={classes.text} variant="h5">
            {state.name}
          </Typography>
          <Typography className={classes.grayText}>CLASS OF {state.graduation}</Typography>
          <ThemeProvider theme={roleButton}>
            <Button disabled variant="outlined" color="primary">
              {state.role}
            </Button>
          </ThemeProvider>
          <Divider className={classes.divider} />
          <div className={classes.leftText}>
            <Link href={`mailto:${state.email}`}>
              <Typography className={classes.text}>
                <MailOutlineIcon className={classes.smallIcon} />
                {state.email}
              </Typography>
            </Link>

            <Link href={`tel:${state.phone}`}>
              <Typography className={classes.text}>
                <LocalPhoneOutlinedIcon className={classes.smallIcon} />
                {state.phone}
              </Typography>
            </Link>

            <Link
              target="_blank"
              rel="noopener"
              href={`https://github.com/${state.github_username}`}
            >
              <Typography className={classes.text}>
                <GitHubIcon className={classes.smallIcon} />
                {state.github_username}
              </Typography>
            </Link>

            {state.discord_username ? (
              <Link target="_blank" rel="noopener" href="https://discord.com/channels/@me">
                <Typography className={classes.text}>
                  <SportsEsportsIcon className={classes.smallIcon} />
                  {state.discord_username}
                </Typography>
              </Link>
            ) : (
              ""
            )}

            {state.linkedin_username ? (
              <Link target="_blank" rel="noopener" href={state.linkedin_username}>
                <Typography className={classes.text}>
                  <LinkedInIcon className={classes.smallIcon} />
                  {stripLinkedin(state.linkedin_username)}
                </Typography>
              </Link>
            ) : (
              ""
            )}
          </div>
        </CardContent>
      </Card>
    </LoadingContainer>
  );
};

export default withAuthorization(UserCard, true);
