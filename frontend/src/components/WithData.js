import React from "react";
import PropTypes from "prop-types";

import { LinearProgress } from "@material-ui/core";
import { getData } from "../services/data";

export default function WithData({
  children,
  slug,
  authenticated,
  reloading,
  onSuccess,
  onError,
}) {
  React.useEffect(() => {
    async function doAsync() {
      let { ok, data } = await getData(slug, authenticated);
      if (ok) {
        onSuccess(data);
      } else {
        onError(data);
      }
    }
    if (reloading) {
      doAsync();
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
