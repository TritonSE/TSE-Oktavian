// This was once http://localhost:8000 or some other substitution.
// Now the backend server hosts the frontend, so the requests are made to the same URL.
const BACKEND_URL = "";

// Redux action types
const ACTION_SET_LOADING = "loading/set";
const ACTION_OPEN_ALERT = "alert/open";
const ACTION_CLOSE_ALERT = "alert/close";

export {
  BACKEND_URL,
  ACTION_SET_LOADING,
  ACTION_OPEN_ALERT,
  ACTION_CLOSE_ALERT,
};
