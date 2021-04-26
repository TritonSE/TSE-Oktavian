import React from "react";
import { Redirect } from "react-router-dom";
import { LinearProgress } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { resolveLogin } from "../actions";

const REFRESH_INTERVAL = /* 30 * 60 */ 5 * 1000;

// The withAuthorization HOC performs authentication
// checks on the component that it wraps. It will ensure
// that the user visited `WrappedComponent` meets the
// specified authentication `authenticated` criteria as
// well as the authorization `permissions` criteria. If the
// user's auth state is still being loaded, it will render a
// loading bar instead of the component it wraps.
const withAuthorization = (WrappedComponent, authenticated, permissions = [], ignore = false) => (
  props
) => {
  const loginState = useSelector((state) => state.login);
  const dispatch = useDispatch();

  const intervalID = setInterval(() => { dispatch(resolveLogin()); console.log("resolveLogin called from setInterval"); }, REFRESH_INTERVAL);
  React.useEffect(() => () => {
    clearInterval(intervalID);
  });

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
    // User is authenticated when they are not supposed to be
    if (
      (authenticated && !loginState.authenticated) ||
      (!authenticated && loginState.authenticated)
    ) {
      return <Redirect to="/" />;
    }

    // User does not meet certain permissions
    if (authenticated) {
      for (const permission of permissions) {
        if (loginState.user.role == null || loginState.user.role.permissions[permission] !== true) {
          return <Redirect to="/" />;
        }
      }
    }
  }

  /* eslint-disable react/jsx-props-no-spreading */
  return <WrappedComponent {...props} />;
  /* eslint-enable react/jsx-props-no-spreading */
};

export { withAuthorization };
