import { getData, sendData } from "../util/data";

export async function getPipelines() {
  return getData("api/pipelines", true);
}

export async function createPipeline(body) {
  return sendData("api/pipelines", true, "POST", JSON.stringify(body));
}

export async function updatePipeline(body) {
  return sendData("api/pipelines", true, "PUT", JSON.stringify(body));
}

export async function deletePipeline(body) {
  return sendData("api/pipelines", true, "DELETE", JSON.stringify(body));
}
