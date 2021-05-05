import { getData, sendData } from "../util/data";

export async function getApplications(
  start_date,
  end_date,
  completed = null,
  current_stage = null
) {
  if (completed != null) {
    return getData(
      `api/applications?start_date=${start_date.getTime()}&end_date=${end_date.getTime()}&completed=false&current_stage=Final`,
      true
    );
  }
  return getData(
    `api/applications?start_date=${start_date.getTime()}&end_date=${end_date.getTime()}`,
    true
  );
}

export async function getApplication(id) {
  return getData(`api/applications/${id}`, true);
}

export async function createApplication(body) {
  return sendData(`api/applications`, false, "POST", JSON.stringify(body));
}
