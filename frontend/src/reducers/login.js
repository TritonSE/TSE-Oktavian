import { ACTION_SET_LOGIN, ACTION_CLEAR_LOGIN } from "../actions";

function login(state = { loading: true, authenticated: false, user: null }, action) {
  switch (action.type) {
    case ACTION_SET_LOGIN:
      console.log({
        ...state,
        loading: false,
        authenticated: true,
        user: action.user,
      });
      return {
        ...state,
        loading: false,
        authenticated: true,
        user: action.user,
      };
    case ACTION_CLEAR_LOGIN:
      console.log({ ...state, loading: false, authenticated: false, user: null });
      return { ...state, loading: false, authenticated: false, user: null };
    default:
      return state;
  }
}

export default login;
