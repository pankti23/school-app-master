import { handleResponse, handleError, axios } from './configService';

const endpoint = '/campuses';

export const getCampusList = () => axios.get(endpoint)
  .then(handleResponse)
  .catch(handleError);

export const getCampus = (campusId) => axios.get(`${endpoint}/${campusId}`)
  .then(handleResponse)
  .catch(handleError);

export const createCampus = (data) => axios.post(endpoint, data)
  .then(handleResponse)
  .catch(handleError);

export const updateCampus = (data) => axios.put(`${endpoint}/${data.id}`, data)
  .then(handleResponse)
  .catch(handleError);

export const removeCampus = (campusId) => axios.delete(`${endpoint}/${campusId}`)
  .then(handleResponse)
  .catch(handleError);

export default {
  getCampusList,
  getCampus,
  createCampus,
  updateCampus,
  removeCampus
}
