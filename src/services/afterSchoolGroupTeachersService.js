import { handleResponse, handleError, axios } from './configService';

const endpoint = '/afterSchoolGroupTeachers';

export const getAfterSchoolGroupTeachersList = () => axios.get(endpoint)
.then(handleResponse)
.catch(handleError);

export const removeAfterSchoolGroupTeacher = (data) => axios.delete(`${endpoint}/group/${data.group_id}/user/${data.user_id}`)
  .then(handleResponse)
  .catch(handleError);

export const updateAfterSchoolGroupTeacher = (data) => axios.put(`${endpoint}/${data.id}`, data)
  .then(handleResponse)
  .catch(handleError);

export default {
  getAfterSchoolGroupTeachersList,
  removeAfterSchoolGroupTeacher,
  updateAfterSchoolGroupTeacher,
}
