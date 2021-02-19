import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact={true} path="/login">
          <Navbar component={<Login />} title="Login" />
        </Route>
        <Route exact={true} path="/register">
          <Navbar component={<Register />} title="Register" />
        </Route>
        <Route exact={true} path="/create-application">
          <Navbar
            component={<CreateApplication />}
            title="Create Application"
          />
        </Route>
        <Route exact={true} path="/forgot-password">
          <Navbar component={<ForgotPassword />} title="Forgot Password" />
        </Route>
        <Route
          path="/reset-password/:token"
          component={({ match }) => {
            return (
              <Navbar
                component={<ResetPassword match={match} />}
                title="Reset Password"
              />
            );
          }}
        />
        <Route exact={true} path="/dashboard">
          <Navbar component={<Dashboard />} title="Dashboard" />
        </Route>
        <Route exact={true} path="/applications">
          <Navbar component={<Applications />} title="All Applications" />
        </Route>
        <Route
          path="/application/:appid"
          component={({ match }) => {
            return (
              <Navbar
                component={<Application match={match} />}
                title="Viewing Application"
              />
            );
          }}
        />
        <Route exact={true} path="/assignments">
          <Navbar component={<Assignments />} title="Your Assignments" />
        </Route>
        <Route exact={true} path="/settings">
          <Navbar component={<Settings />} title="Settings" />
        </Route>
        <Route path="/">
          <Navbar component={<Home />} title="Home" />
        </Route>
      </Switch>
    </Router>
  );
}
