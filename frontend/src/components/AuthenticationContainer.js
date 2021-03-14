import React from "react";
import PropTypes from "prop-types";

import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

// Any child nodes can only be viewed if the client meets the specified authentication requirements
// If allow is true, then the client must be logged in
// If allow is false, then the client must not be logged in
// If authentication has not been resolved yet, then nothing is rendered 
// If authentication has been resolved & allow is not satisfied, then a redirect occurs
export default function AuthenticationContainer({ allow, children }) {
  const loginState = useSelector((state) => state.login);
  if (loginState.loading) {
    return <></>;
  }
  if ((allow && !loginState.authenticated) || (!allow && loginState.authenticated)) {
    return <Redirect to="/" />;
  }
  return <>{children}</>;
}

AuthenticationContainer.propTypes = {
  allow: PropTypes.bool,
  children: PropTypes.any,
};
