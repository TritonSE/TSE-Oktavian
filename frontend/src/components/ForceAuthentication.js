import React from "react";
import PropTypes from "prop-types";

import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../util/auth";

export default function ForceAuthentication({ allow, children }) {
  if ((allow && !isAuthenticated()) || (!allow && isAuthenticated())) {
    return <Redirect to="/" />;
  }
  return <>{children}</>;
}

ForceAuthentication.propTypes = {
  allow: PropTypes.bool,
  children: PropTypes.element,
};
