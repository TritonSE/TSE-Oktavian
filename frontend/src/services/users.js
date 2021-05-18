import { sendData, getData } from "../util/data";

export async function getUsers(role_id = null) {
  return getData(`api/users?${role_id ? `role=${role_id}` : ""}`, true);
}

export async function editUser(body) {
  return sendData("api/users", true, "PUT", JSON.stringify(body));
}
