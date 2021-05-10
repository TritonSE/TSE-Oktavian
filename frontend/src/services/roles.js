import { getData } from "../util/data";

export async function getRoles() {
  return getData("api/roles", true);
}

export async function getRole(role_id) {
  return getData(`api/roles/${role_id}`, true);
}
