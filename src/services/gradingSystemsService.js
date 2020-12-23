import { handleResponse, handleError, axios } from './configService';

const endpoint = '/gradingSystems';

export const getGradingSystems = () => axios.get(endpoint)
  .then(handleResponse)
  .catch(handleError);

export const createGradingSystem = (data) => axios.post(endpoint, data)
  .then(handleResponse)
  .catch(handleError);

export const updateGradingSystem = (data) => axios.put(`${endpoint}/${data.id}`, data,)
  .then(handleResponse)
  .catch(handleError);  
 
export const removeGradingSystem = (gradeSystemId) => axios.delete(`${endpoint}/${gradeSystemId}`)
  .then(handleResponse)
  .catch(handleError);

export const getStandardGradingSystems = () => axios.get(`${endpoint}/standard/all`)
  .then(handleResponse)
  .catch(handleError);

export const getGradingSystemById = (gradeSystemId) => axios.get(`${endpoint}/${gradeSystemId}`)
  .then(handleResponse)
  .catch(handleError);

export const getGradingSystemByCampusId = (campusId) => axios.get(`${endpoint}/campus/${campusId}`)
  .then(handleResponse)
  .catch(handleError);

export default {
  getGradingSystems,
  createGradingSystem,
  updateGradingSystem,
  removeGradingSystem,
  getStandardGradingSystems,
  getGradingSystemById,
  getGradingSystemByCampusId,
}