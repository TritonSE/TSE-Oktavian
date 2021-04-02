import { getJWT } from "./jwt";
import { BACKEND_URL } from "../constants";

async function makeRequest(slug, options) {
  const response = await fetch(`${BACKEND_URL}/${slug}`, options);
  const json = await response.json();
  return {
    status: response.status,
    ok: response.ok,
    data: json,
  };
}

async function getData(slug, authenticated) {
  const headers = {};
  if (authenticated) {
    headers.Authorization = `Bearer ${getJWT()}`;
  }
  return await makeRequest(slug, {
    headers,
  });
}

async function sendData(slug, authenticated, method, body) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (authenticated) {
    headers.Authorization = `Bearer ${getJWT()}`;
  }
  return await makeRequest(slug, {
    method,
    headers,
    body,
  });
}

export { getData, sendData };
