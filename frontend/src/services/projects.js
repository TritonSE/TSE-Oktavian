import { getData } from "../util/data";

export async function getProjects(user_id = null) {
  if (user_id) return getData(`api/projects?user=${user_id}`, true);
  return getData("api/projects", true);
}
