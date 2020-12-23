import { handleResponse, handleError, axios } from './configService';

const endpoint = '/levels';

export const getLevelList = () => axios.get(endpoint)
  .then(handleResponse)
  .catch(handleError);

export const getLevel = (levelId) => axios.get(`${endpoint}/${levelId}`)
  .then(handleResponse)
  .catch(handleError);

export const createLevel = (data) => axios.post(endpoint, data)
  .then(handleResponse)
  .catch(handleError);

export const updateLevel = (data) => axios.put(`${endpoint}/${data.id}`, data,)
  .then(handleResponse)
  .catch(handleError);

export const removeLevel = (levelId) => axios.delete(`${endpoint}/${levelId}`)
  .then(handleResponse)
  .catch(handleError);

export default {
  getLevelList,
  getLevel,
  createLevel,
  updateLevel,
  removeLevel
}
