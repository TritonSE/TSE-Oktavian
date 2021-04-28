import { getData } from "../util/data";

export async function getUsers() {
  return getData("api/users", true);
}
