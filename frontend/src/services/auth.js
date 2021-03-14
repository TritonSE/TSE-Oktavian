import { getData, sendData } from '../util/data';

export async function login(body) {
  return sendData("api/auth/login", false, "POST", JSON.stringify(body)); 
}

export async function register(body) {
  return sendData("api/auth/register", false, "POST", JSON.stringify(body)); 
}

export async function forgotPassword(body) {
  return sendData("api/auth/forgot-password", false, "POST", JSON.stringify(body)); 
}

export async function resetPassword(body) {
  return sendData("api/auth/reset-password", false, "POST", JSON.stringify(body)); 
}

export async function me() {
  return getData("api/auth/me", true);
}
