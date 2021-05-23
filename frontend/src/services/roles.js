import { getData, sendData } from "../util/data";

export async function getRoles(role_name = null) {
  return getData(`api/roles?${role_name ? `name=${role_name}` : ""}`, true);
}

export async function getRole(role_id) {
  return getData(`api/roles/${role_id}`, true);
}

export async function editRole(body) {
  return sendData(`api/roles`, true, "PUT", JSON.stringify(body));
}

export async function createRole(body) {
  return sendData(`api/roles`, true, "POST", JSON.stringify(body));
}

export async function deleteRole(role_id) {
  return sendData(`api/roles/${role_id}`, true, "DELETE", "");
}
