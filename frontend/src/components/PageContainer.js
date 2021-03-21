import React from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  CssBaseline,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Snackbar,
  Typography,
} from "@material-ui/core";
import {
  Menu,
  ExitToApp,
  Face,
  Dashboard,
  Settings,
  Inbox,
  RateReview,
} from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, closeAlert } from "../actions";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    color: "white",
    textDecoration: "none",
  },
}));

// The PageContainer component is critical and should
// be present on most pages. It wraps the main components of
// the page, sets the sidebar and navbar and applies some styling.
export default function PageContainer({ window, children }) {
  const classes = useStyles();
  const theme = useTheme();
  const [state, setState] = React.useState(false);
  const loginState = useSelector((state) => state.login);
  const alertState = useSelector((state) => state.alert);
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setState(!state);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(closeAlert());
  };

  const sections = [
    {
      name: "Recruitment",
      items: [
        {
          icon: <Dashboard />,
          text: "Dashboard",
          link: "/recruitment",
        },
        {
          icon: <Inbox />,
          text: "All Applications",
          link: "/recruitment/applications",
        },
        {
          icon: <RateReview />,
          text: "Your Assignments",
          link: "/recruitment/assignments",
        },
      ],
      display:
        loginState.authenticated &&
        loginState.user.role != null &&
        loginState.user.role.permit_regular_review,
    },
    {
      name: "Account",
      items: [
        {
          icon: <Settings />,
          text: "Settings",
          link: "/settings",
        },
        {
          text: "Logout",
        },
      ],
      display: loginState.authenticated,
    },
    {
      name: "Account",
      items: [
        {
          icon: <ExitToApp />,
          text: "Login",
          link: "/login",
        },
        {
          icon: <Face />,
          text: "Register",
          link: "/register",
        },
      ],
      display: !loginState.authenticated,
    },
  ];

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      {sections.map((section) => {
        return section.display ? (
          <>
            <Divider />
            <List key={section.name}>
              <ListItem>
                <Typography
                  color="textSecondary"
                  display="block"
                  variant="caption"
                >
                  {section.name}
                </Typography>
              </ListItem>
              {section.items.map((item) => {
                if (item.text === "Logout") {
                  return (
                    <>
                      <ListItem button key={"Logout"} onClick={handleLogout}>
                        <ListItemIcon>
                          <ExitToApp />
                        </ListItemIcon>
                        <ListItemText primary={"Logout"} />
                      </ListItem>
                    </>
                  );
                }
                return (
                  <>
                    <ListItem
                      button
                      key={item.text}
                      component={Link}
                      to={item.link}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItem>
                  </>
                );
              })}
            </List>
          </>
        ) : (
          <></>
        );
      })}
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <Menu />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            className={classes.title}
            component={Link}
            to="/"
          >
            Oktavian
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={state}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
      <Snackbar
        open={alertState.open}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        message={alertState.message}
      />
    </div>
  );
}

PageContainer.propTypes = {
  children: PropTypes.any,
  window: PropTypes.instanceOf(window.constructor),
};
