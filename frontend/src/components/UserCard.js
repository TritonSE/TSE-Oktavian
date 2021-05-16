import { React, useState, useEffect } from "react";
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
import { getUsers } from "../services/users";
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [state, setState] = useState({
    loading: true,
    canEdit: userData.user.role.permissions.user_edit,
    name: "",
    role: "",
    graduation: 0,
    email: "",
    phone: "",
    github_username: "",
    discord_username: "",
    linkedin_username: "",
  });

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
          {state.canEdit ? (
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
                <MenuItem>Deactivate</MenuItem>
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
            <Typography className={classes.text}>
              <MailOutlineIcon className={classes.smallIcon} />
              {state.email}
            </Typography>
            <Typography className={classes.text}>
              <LocalPhoneOutlinedIcon className={classes.smallIcon} />
              {state.phone}
            </Typography>
            <Typography className={classes.text}>
              <GitHubIcon className={classes.smallIcon} />
              {state.github_username}
            </Typography>
            <Typography className={classes.text}>
              <SportsEsportsIcon className={classes.smallIcon} />
              {state.discord_username}
            </Typography>
            <Typography className={classes.text}>
              <LinkedInIcon className={classes.smallIcon} />
              {state.linkedin_username}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </LoadingContainer>
  );
};

export default withAuthorization(UserCard, true);
