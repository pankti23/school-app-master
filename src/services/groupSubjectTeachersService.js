import { handleResponse, handleError, axios } from './configService';

const endpoint = '/groupSubjectTeachers';

export const getGroupSubjectTeachersList = () => axios.get(endpoint)
  .then(handleResponse)
  .catch(handleError);

export default {
  getGroupSubjectTeachersList
}
