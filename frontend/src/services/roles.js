import { getData } from "../util/data";

export async function getRoles() {
  return getData("api/roles", true);
}
