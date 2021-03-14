import { combineReducers } from "redux";

import {
  ACTION_SET_LOADING,
  ACTION_OPEN_ALERT,
  ACTION_CLOSE_ALERT,
} from "../constants";

function loading(state = false, action) {
  switch (action.type) {
    case ACTION_SET_LOADING:
      return action.loading;
    default:
      return state;
  }
}

function alert(state = { open: false, message: "" }, action) {
  switch (action.type) {
    case ACTION_OPEN_ALERT:
      return { ...state, open: true, message: action.message };
    case ACTION_CLOSE_ALERT:
      return { ...state, open: false };
    default:
      return state;
  }
}

export default combineReducers({
  loading,
  alert,
});
