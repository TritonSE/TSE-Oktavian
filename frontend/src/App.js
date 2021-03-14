import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";
import RecruitmentOverview from "./pages/recruitment/Overview.js";
import Applications from "./pages/recruitment/Applications";
import Assignments from "./pages/recruitment/Assignments";
import Application from "./pages/recruitment/Application";
import NewApplication from "./pages/recruitment/NewApplication";
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
          <Route exact={true} path="/settings">
            <Settings />
          </Route>
          <Route exact={true} path="/recruitment">
            <RecruitmentOverview />
          </Route>
          <Route exact={true} path="/recruitment/applications">
            <Applications />
          </Route>
          <Route
            path="/recruitment/application/:appid"
            component={({ match }) => {
              return <Application match={match} />;
            }}
          />
          <Route exact={true} path="/recruitment/assignments">
            <Assignments />
          </Route>
          <Route exact={true} path="/recruitment/new-application">
            <NewApplication />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}
