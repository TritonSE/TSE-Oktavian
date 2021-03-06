import React from "react";
import PropTypes from "prop-types";

import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

// Any child nodes can only be viewed if the client meets the specified authentication requirements
// If allow is true, then the client must be logged in
// If allow is false, then the client must not be logged in
export default function WithAuthentication({ allow, children }) {
  if ((allow && !isAuthenticated()) || (!allow && isAuthenticated())) {
    return <Redirect to="/" />;
  }
  return <>{children}</>;
}

WithAuthentication.propTypes = {
  allow: PropTypes.bool,
  children: PropTypes.any,
};
