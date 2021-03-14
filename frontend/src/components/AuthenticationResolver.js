import React from "react";
import PropTypes from "prop-types";
import { LinearProgress } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { resolveLogin } from "../actions";

// The AuthenticationResolver component is specifically responsible
// for determining the global authentication state of the application.
// If not included, the auth state will remain in loading forever.
//
// Note that the PageContainer component uses this, so if your page is
// wrapped in a PageContainer, then you don't need to use this.
export default function AuthenticationResolver({ children }) {
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

  return { children };
}

AuthenticationResolver.propTypes = {
  children: PropTypes.any,
};
