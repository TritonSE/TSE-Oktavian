import { getData } from '../util/data';

export async function getApplicationStats(start_date, end_date) {
  return getData(`api/stats/applications?start_date=${start_date.getTime()}&end_date=${end_date.getTime()}`, true); 
}
