import {
  ACTION_OPEN_ALERT,
  ACTION_CLOSE_ALERT,
} from "../actions";

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

export default alert;
