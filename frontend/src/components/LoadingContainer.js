import React from "react";
import PropTypes from "prop-types";

import { LinearProgress } from "@material-ui/core";

// LoadingContainer is essentially a wrapper around a default loading
// indicator. If the loading prop is set to true, then the indicator
// will be displayed. Otherwise, the children prop will be displayed.
export default function LoadingContainer({
  children,
  loading,
}) {
  if (loading) {
    return <LinearProgress />;
  }
  return <>{children}</>;
}

LoadingContainer.propTypes = {
  children: PropTypes.any,
  loading: PropTypes.bool,
};
