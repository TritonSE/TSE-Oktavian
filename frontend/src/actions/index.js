import {
  ACTION_SET_LOADING,
  ACTION_OPEN_ALERT,
  ACTION_CLOSE_ALERT,
} from "../constants";

const setLoading = (dispatch, loading) => {
  dispatch({ type: ACTION_SET_LOADING, loading });
};

const openAlert = (dispatch, message) => {
  dispatch({ type: ACTION_OPEN_ALERT, message: message });
};

const closeAlert = (dispatch) => {
  dispatch({ type: ACTION_CLOSE_ALERT });
};

export { setLoading, openAlert, closeAlert };
