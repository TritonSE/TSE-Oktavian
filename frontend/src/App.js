import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateApplication from "./pages/CreateApplication";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Applications from "./pages/Applications";
import Assignments from "./pages/Assignments";
import Application from "./pages/Application";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#0C2B35",
    },
    secondary: {
      main: "#DEBB01",
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route exact={true} path="/login">
            <Login />
          </Route>
          <Route exact={true} path="/register">
            <Register />
          </Route>
          <Route exact={true} path="/forgot-password">
            <ForgotPassword />
          </Route>
          <Route
            path="/reset-password/:token"
            component={({ match }) => {
              return <ResetPassword match={match} />;
            }}
          />
          <Route exact={true} path="/dashboard">
            <Dashboard />
          </Route>
          <Route exact={true} path="/applications">
            <Applications />
          </Route>
          <Route
            path="/application/:appid"
            component={({ match }) => {
              return <Application match={match} />;
            }}
          />
          <Route exact={true} path="/assignments">
            <Assignments />
          </Route>
          <Route exact={true} path="/settings">
            <Settings />
          </Route>
          <Route exact={true} path="/create-application">
            <CreateApplication />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}
