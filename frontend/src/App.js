import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";
import RecruitmentHome from "./pages/recruitment/Home";
import Applications from "./pages/recruitment/Applications";
import Assignments from "./pages/recruitment/Assignments";
import Application from "./pages/recruitment/Application";
import NewApplication from "./pages/recruitment/NewApplication";
import Final from "./pages/recruitment/Final";
import Pipelines from "./pages/recruitment/pipeline/Pipelines";
import Roster from "./pages/Roster";
import RosterInfo from "./pages/RosterInfo";
import RosterEdit from "./pages/RosterEdit";
import Roles from "./pages/admin/roles/Roles";
import PendingUsers from "./pages/admin/pending_users/PendingUsers";
import PendingUserInfo from "./pages/admin/pending_users/PendingUserInfo";
import EditRole from "./pages/admin/roles/EditRoles";
import CreateRole from "./pages/admin/roles/CreateRole";

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
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/forgot-password">
            <ForgotPassword />
          </Route>
          <Route
            path="/reset-password/:token"
            component={({ match }) => <ResetPassword match={match} />}
          />
          <Route exact path="/settings">
            <Settings />
          </Route>
          <Route exact path="/recruitment">
            <RecruitmentHome />
          </Route>
          <Route exact path="/recruitment/applications">
            <Applications />
          </Route>
          <Route exact path="/recruitment/final">
            <Final />
          </Route>
          <Route
            path="/recruitment/application/:appid"
            component={({ match }) => <Application match={match} />}
          />
          <Route exact path="/recruitment/assignments">
            <Assignments />
          </Route>
          <Route exact path="/recruitment/new">
            <NewApplication />
          </Route>
          <Route exact path="/recruitment/pipelines">
            <Pipelines />
          </Route>
          <Route exact path="/roster">
            <Roster />
          </Route>
          <Route
            exact
            path="/roster/:userid"
            component={({ match }) => <RosterInfo match={match} />}
          />
          <Route
            exact
            path="/roster/edit/:userid"
            component={({ match }) => <RosterEdit match={match} />}
          />
          <Route
            exact
            path="/admin/roles/edit/:roleId"
            component={({ match }) => <EditRole match={match} />}
          />
          <Route exact path="/admin/roles/create">
            <CreateRole />
          </Route>
          <Route exact path="/admin/roles">
            <Roles />
          </Route>
          <Route exact path="/admin/pending">
            <PendingUsers />
          </Route>
          <Route
            exact
            path="/admin/pending/:userid"
            component={({ match }) => <PendingUserInfo match={match} />}
          />
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/">
            <Redirect to="/" />
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}
