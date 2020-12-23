import { handleResponse, handleError, axios } from './configService';

const endpoint = '/students';

export const getStudentList = () => axios.get(endpoint)
  .then(handleResponse)
  .catch(handleError);

export const getStudent = (studentId) => axios.get(`${endpoint}/${studentId}`)
  .then(handleResponse)
  .catch(handleError);

export const createStudent = (data) => axios.post(endpoint, data)
  .then(handleResponse)
  .catch(handleError);

export const createStudentsBulkCsv = (data) => axios.post(`${endpoint}/create/bulk/csv`, data)
  .then(handleResponse)
  .catch(handleError);

export const createStudentsBulk = (data) => axios.post(`${endpoint}/create/bulk`, data)
  .then(handleResponse)
  .catch(handleError);

export const updateStudent = (data) => axios.put(`${endpoint}/${data.id}`, data)
  .then(handleResponse)
  .catch(handleError);

export const removeStudent = (studentId) => axios.delete(`${endpoint}/${studentId}`)
  .then(handleResponse)
  .catch(handleError);

export default {
  getStudentList,
  getStudent,
  createStudent,
  updateStudent,
  removeStudent
}
