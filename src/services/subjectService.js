import { handleResponse, handleError, axios } from './configService';

const endpoint = '/subjects';

export const getSubjectList = () => axios.get(endpoint)
  .then(handleResponse)
  .catch(handleError);

export const getSubject = (subjectId) => axios.get(`${endpoint}/${subjectId}`)
  .then(handleResponse)
  .catch(handleError);

export const createSubject = (data) => axios.post(endpoint, data)
  .then(handleResponse)
  .catch(handleError);

export const updateSubject= (data) => axios.put(`${endpoint}/${data.id}`, data,)
  .then(handleResponse)
  .catch(handleError);

export const removeSubject = (subjectId) => axios.delete(`${endpoint}/${subjectId}`)
  .then(handleResponse)
  .catch(handleError);

export default {
  getSubjectList,
  getSubject,
  createSubject,
  updateSubject,
  removeSubject
}
