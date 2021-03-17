import React from "react";
import { Redirect } from "react-router-dom";
import { LinearProgress } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { resolveLogin } from "../actions";

const withAuthorization = (
  WrappedComponent,
  authenticated,
  permissions = [],
  ignore = false
) => (props) => {
  const loginState = useSelector((state) => state.login);
  const dispatch = useDispatch();

  // The login state is only loading when Redux is first loaded
  React.useEffect(() => {
    if (loginState.loading) {
      dispatch(resolveLogin());
    }
  }, [loginState.loading, dispatch]);

  // If the login state is loading, then just display a loading indicator
  if (loginState.loading) {
    return <LinearProgress />;
  }

  if (!ignore) {
    // User is authenticated when they are not suppose to be
    if (
      (authenticated && !loginState.authenticated) ||
      (!authenticated && loginState.authenticated)
    ) {
      console.log("Authentication check failed.");
      return <Redirect to="/" />;
    }

    // User does not meet certain permissions
    if (authenticated) {
      for (const permission of permissions) {
        if (
          loginState.user.role == null ||
          loginState.user.role[permission] !== true
        ) {
          return <Redirect to="/" />;
        }
      }
    }
  }

  return <WrappedComponent {...props} />;
};

export { withAuthorization };
