import {
  login as loginRequest,
  register as registerRequest,
  me,
  refresh as refreshRequest,
  logout as logoutRequest,
} from "../services/auth";
import { clearJWT, hasJWT, setJWT, getJWT } from "../util/jwt";
import { openAlert } from "./alert";

export const ACTION_LOGIN = "login/login";
export const ACTION_REGISTER = "login/register";
export const ACTION_RESOLVE = "login/resolve";
export const ACTION_LOGOUT = "login/logout";
export const ACTION_SET_LOGIN = "login/set";
export const ACTION_CLEAR_LOGIN = "login/clear";

export function setLogin(user) {
  return { type: ACTION_SET_LOGIN, user };
}

export function clearLogin() {
  return { type: ACTION_CLEAR_LOGIN };
}

export function login(credentials, callback) {
  return async (dispatch) => {
    if (hasJWT()) {
      dispatch(openAlert("User is already logged in"));
    } else {
      const { ok, data } = await loginRequest(credentials);
      if (ok) {
        setJWT(data.token);
        dispatch(setLogin(data.user));
      } else {
        dispatch(clearLogin());
        dispatch(openAlert(`Error: ${data.message}`));
      }
    }
    callback();
  };
}

export function register(credentials, callback) {
  return async (dispatch) => {
    if (hasJWT()) {
      dispatch(openAlert("User is already logged in"));
    } else {
      const { ok, data } = await registerRequest(credentials);
      if (ok) {
        setJWT(data.token);
        dispatch(setLogin(data.user));
      } else {
        dispatch(clearLogin());
        dispatch(openAlert(`Error: ${data.message}`));
      }
    }
    callback();
  };
}

export function logout() {
  return async (dispatch) => {
    if (hasJWT()) {
      const { ok, data } = await logoutRequest();
      if (ok) {
        clearJWT();
        dispatch(clearLogin());
      } else {
        dispatch(openAlert(`Error: ${data.message}`));
      }
    } else {
      dispatch(openAlert("User is already logged out"));
    }
  };
}

export function resolveLogin() {
  return async (dispatch) => {
    console.log("[Login Resolution] Starting ...");
    if (hasJWT()) {
      const { ok: meOk, data: meData } = await me();
      if (meOk) {
        console.log("[Login Resolution] User is logged in");
        dispatch(setLogin(meData.user));
      } else {
        console.log("[Login Resolution] User has an invalid access token");
        const { ok: refreshOk, data: refreshData } = await refreshRequest({ token: getJWT() });
        if (refreshOk) {
          console.log("[Login Resolution] Obtained a new access token using the refresh token");
          setJWT(refreshData.token);
          dispatch(setLogin(refreshData.user));
        } else {
          console.log("[Login Resolution] Refresh token is missing or invalid");
          clearJWT();
          dispatch(clearLogin());
          dispatch(openAlert(`Error: ${refreshData.message}`));
        }
      }
    } else {
      console.log("[Login Resolution] User is not logged in");
      dispatch(clearLogin());
    }
  };
}
