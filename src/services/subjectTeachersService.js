import { handleResponse, handleError, axios } from './configService';

const endpoint = '/subjectTeachers';

export const getSubjectTeachersList = () => axios.get(endpoint)
  .then(handleResponse)
  .catch(handleError);

export const getSubjectTeachers = (subjectTeachersId) => axios.get(`${endpoint}/${subjectTeachersId}`)
  .then(handleResponse)
  .catch(handleError);

export const createSubjectTeachers = (data) => axios.post(endpoint, data)
  .then(handleResponse)
  .catch(handleError);

export const updateSubjectTeachers = (data) => axios.put(`${endpoint}/${data.id}`, data,)
  .then(handleResponse)
  .catch(handleError);

export const removeSubjectTeachers = (subjectTeachersId) => axios.delete(`${endpoint}/${subjectTeachersId}`)
  .then(handleResponse)
  .catch(handleError);

export default {
  getSubjectTeachersList,
  getSubjectTeachers,
  createSubjectTeachers,
  updateSubjectTeachers,
  removeSubjectTeachers
}
