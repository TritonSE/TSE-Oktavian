import { getData } from "../util/data";

export async function getRoles(role_name = null) {
  return getData(`api/roles?${role_name ? `name=${role_name}` : ""}`, true);
}
