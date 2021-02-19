import React from 'react';
import { 
  AppBar, CssBaseline, Divider, Drawer, 
  Hidden, IconButton,
  List, ListItem, ListItemIcon, 
  ListItemText, Toolbar, Typography 
} from '@material-ui/core';
import { Menu, ExitToApp, Face, Dashboard, Settings, Inbox, RateReview } from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom';
import { isAuthenticated, logout } from '../util/auth';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
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
    color: 'white',
    textDecoration: 'none'
  }
}));

export default function Navbar(props) {
  const { window, component, title } = props;
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const [state, setState] = React.useState(false);
  React.useEffect(() => {
    document.title = `TSE Recruitment — ${title}`;
  }, [title]);

  const handleDrawerToggle = () => {
    setState(!state);
  };

  const handleLogout = (event) => {
    logout(); 
    history.push("/"); 
  };

  const drawer = isAuthenticated() ? (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListItem button key={"Dashboard"} component={Link} to="/dashboard">
          <ListItemIcon><Dashboard/></ListItemIcon>
          <ListItemText primary={"Dashboard"} />
        </ListItem>
        <ListItem button key={"Applications"} component={Link} to="/applications">
          <ListItemIcon><Inbox/></ListItemIcon>
          <ListItemText primary={"All Applications"} />
        </ListItem>
        <ListItem button key={"Assignments"} component={Link} to="/assignments">
          <ListItemIcon><RateReview/></ListItemIcon>
          <ListItemText primary={"Your Assignments"} />
        </ListItem>
        <ListItem button key={"Settings"} component={Link} to="/settings">
          <ListItemIcon><Settings/></ListItemIcon>
          <ListItemText primary={"Settings"} />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key={"Logout"} onClick={handleLogout}>
          <ListItemIcon><ExitToApp/></ListItemIcon>
          <ListItemText primary={"Logout"} />
        </ListItem>
      </List>
    </div>
  ) : (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListItem button key={"Login"} component={Link} to="/login">
          <ListItemIcon><ExitToApp/></ListItemIcon>
          <ListItemText primary={"Login"} />
        </ListItem>
        <ListItem button key={"Register"} component={Link} to="/register">
          <ListItemIcon><Face/></ListItemIcon>
          <ListItemText primary={"Register"} />
        </ListItem>
      </List>
    </div>
  );
  const container = window !== undefined ? () => window().document.body : undefined;
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
            <Menu/>
          </IconButton>
          <Typography variant="h6" noWrap className={classes.title} component={Link} to="/">
            TSE Recruitment
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
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
        {component}
      </main>
    </div>
  );
}
