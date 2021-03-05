import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ForceAuthentication from "./components/ForceAuthentication";
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
          <ForceAuthentication allow={false}>
            <Navbar component={<Login />} title="Login" />
          </ForceAuthentication>
        </Route>
        <Route exact={true} path="/register">
          <ForceAuthentication allow={false}>
            <Navbar component={<Register />} title="Register" />
          </ForceAuthentication>
        </Route>
        <Route exact={true} path="/forgot-password">
          <ForceAuthentication allow={false}>
            <Navbar component={<ForgotPassword />} title="Forgot Password" />
          </ForceAuthentication>
        </Route>
        <Route
          path="/reset-password/:token"
          component={({ match }) => {
            return (
              <ForceAuthentication allow={false}>
                <Navbar
                  component={<ResetPassword match={match} />}
                  title="Reset Password"
                />
              </ForceAuthentication>
            );
          }}
        />
        <Route exact={true} path="/dashboard">
          <ForceAuthentication allow={true}>
            <Navbar component={<Dashboard />} title="Dashboard" />
          </ForceAuthentication>
        </Route>
        <Route exact={true} path="/applications">
          <ForceAuthentication allow={true}>
            <Navbar component={<Applications />} title="All Applications" />
          </ForceAuthentication>
        </Route>
        <Route
          path="/application/:appid"
          component={({ match }) => {
            return (
              <ForceAuthentication allow={true}>
                <Navbar
                  component={<Application match={match} />}
                  title="Viewing Application"
                />
              </ForceAuthentication>
            );
          }}
        />
        <Route exact={true} path="/assignments">
          <ForceAuthentication allow={true}>
            <Navbar component={<Assignments />} title="Your Assignments" />
          </ForceAuthentication>
        </Route>
        <Route exact={true} path="/settings">
          <ForceAuthentication allow={true}>
            <Navbar component={<Settings />} title="Settings" />
          </ForceAuthentication>
        </Route>
        <Route exact={true} path="/create-application">
          {/* Authentication does not matter here */}
          <Navbar
            component={<CreateApplication />}
            title="Create Application"
          />
        </Route>
        <Route path="/">
          <Navbar component={<Home />} title="Home" />
        </Route>
      </Switch>
    </Router>
  );
}
