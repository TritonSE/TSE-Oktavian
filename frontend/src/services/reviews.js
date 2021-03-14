import { getData, sendData } from '../util/data';

export async function getUserReviews(user_id) {
  return getData(`api/reviews?user=${user_id}`, true);
}

export async function getApplicationReviews(app_id) {
  return getData(`api/reviews?application=${app_id}`, true);
}

export async function updateReview(id, body) {
  return sendData(`api/reviews/${id}`, true, 'PUT', JSON.stringify(body)); 
}
