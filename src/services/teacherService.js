import { handleResponse, handleError, axios } from './configService';

const endpoint = 'users/role';

export const getMainTeachersList = () => axios.get(`${endpoint}/6`)
  .then(handleResponse)
  .catch(handleError);

export const getSubjectTeachersList = () => axios.get(`${endpoint}/7`)
  .then(handleResponse)
  .catch(handleError);

export default {
  getMainTeachersList,
  getSubjectTeachersList,
}
