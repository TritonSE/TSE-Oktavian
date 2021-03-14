import { getData, sendData } from '../util/data';

export async function getApplications() {
  return getData('api/applications', true);
}

export async function getApplication(id) {
  return getData(`api/applications/${id}`, true);
}

export async function createApplication(body) {
  return sendData(`api/applications`, false, 'POST', JSON.stringify(body)); 
}
