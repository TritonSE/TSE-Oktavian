import React from "react";
import PropTypes from "prop-types";

import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../util/auth";

export default function WithAuthentication({ allow, children }) {
  if ((allow && !isAuthenticated()) || (!allow && isAuthenticated())) {
    return <Redirect to="/" />;
  }
  return <>{children}</>;
}

WithAuthentication.propTypes = {
  allow: PropTypes.bool,
  children: PropTypes.element,
};
