import { handleResponse, handleError, axios } from './configService';

const endpoint = '/afterSchoolGroups';

export const getAfterSchoolGroupList = () => axios.get(endpoint)
  .then(handleResponse)
  .catch(handleError);

export const getAfterSchoolGroup = (afterSchoolGroupId) => axios.get(`${endpoint}/${afterSchoolGroupId}`)
  .then(handleResponse)
  .catch(handleError);

export const createAfterSchoolGroup = (data) => axios.post(endpoint, data)
  .then(handleResponse)
  .catch(handleError);

export const updateAfterSchoolGroup = (data) => axios.put(`${endpoint}/${data.id}`, data,)
  .then(handleResponse)
  .catch(handleError);

export const removeAfterSchoolGroup = (afterSchoolGroupId) => axios.delete(`${endpoint}/${afterSchoolGroupId}`)
  .then(handleResponse)
  .catch(handleError);

export default {
  getAfterSchoolGroupList,
  getAfterSchoolGroup,
  createAfterSchoolGroup,
  updateAfterSchoolGroup,
  removeAfterSchoolGroup
}
