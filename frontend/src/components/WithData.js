import React from "react";
import PropTypes from "prop-types";

import { LinearProgress } from "@material-ui/core";
import { getData } from "../services/data";

// Any child nodes can only be viewed if the specified data from the backend has been fetched
// Data can be reloaded by setting the `reloading` prop from false to true
// `onSuccess` and `onError` are expected to reset `reloading` from true to false, indicating that the request has been fulfilled
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
