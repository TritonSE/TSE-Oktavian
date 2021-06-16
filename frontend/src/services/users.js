import { sendData, getData } from "../util/data";

export async function getUsers(role_id = null) {
  return getData(`api/users?${role_id ? `role=${role_id}` : ""}`, true);
}

export async function getUser(user_id) {
  return getData(`api/users/${user_id}`, true);
}

export async function editUser(body) {
  return sendData("api/users", true, "PUT", JSON.stringify(body));
}

export async function deleteUser(id) {
  return sendData(`api/users/${id}`, true, "DELETE", JSON.stringify());
}

export async function activateUser(user_id, role_id) {
  return sendData("api/users/activate", true, "PUT", JSON.stringify({ user_id, role_id }));
}
