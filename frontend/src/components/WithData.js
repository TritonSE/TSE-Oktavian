import React from "react";
import PropTypes from "prop-types";

import { LinearProgress } from "@material-ui/core";
import { fetchData } from "../services/data";

export default function WithData({
  children,
  slug,
  authenticated,
  reloading,
  onSuccess,
  onError,
}) {
  React.useEffect(async () => {
    if (reloading) {
      let { ok, data } = await fetchData("GET", slug, authenticated);
      if (ok) {
        onSuccess(data);
      } else {
        onError(data);
      }
    }
  }, [slug, authenticated, reloading, onSuccess, onError]);
  if (reloading) {
    return <LinearProgress />;
  }
  return <>{children}</>;
}

WithData.propTypes = {
  children: PropTypes.any,
  slug: PropTypes.string,
  authenticated: PropTypes.bool,
  reloading: PropTypes.bool,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};
