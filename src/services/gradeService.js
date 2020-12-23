import { handleResponse, handleError, axios } from './configService';

const endpoint = '/grades';

export const getGradeList = () => axios.get(endpoint)
  .then(handleResponse)
  .catch(handleError);

export const getGrade = (gradeId) => axios.get(`${endpoint}/${gradeId}`)
  .then(handleResponse)
  .catch(handleError);

export const createGrade = (data) => axios.post(endpoint, data)
  .then(handleResponse)
  .catch(handleError);

export const updateGrade = (data) => axios.put(`${endpoint}/${data.id}`, data,)
  .then(handleResponse)
  .catch(handleError);

export const removeGrade = (gradeId) => axios.delete(`${endpoint}/${gradeId}`)
  .then(handleResponse)
  .catch(handleError);

export default {
  getGradeList,
  getGrade,
  createGrade,
  updateGrade,
  removeGrade
}
