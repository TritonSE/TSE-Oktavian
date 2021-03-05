import { getJWT } from "../services/auth";
import { BACKEND_URL } from "../util/constants";

async function fetchData(method, slug, authenticated) {
  const headers = {};
  if (authenticated) {
    headers["Authorization"] = `Bearer ${getJWT()}`;
  }
  const response = await fetch(`${BACKEND_URL}/${slug}`, {
    method: method,
    headers: headers,
  });
  let json = await response.json();
  return {
    status: response.status,
    ok: response.ok,
    data: json,
  };
}

export { fetchData };
