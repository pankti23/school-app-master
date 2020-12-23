import { handleResponse, handleError, axios } from './configService';

const endpoint = '/groups';

export const getGroupList = () => axios.get(endpoint)
  .then(handleResponse)
  .catch(handleError);

export const getGroup = (groupId) => axios.get(`${endpoint}/${groupId}`)
  .then(handleResponse)
  .catch(handleError);

export const createGroup = (data) => axios.post(endpoint, data)
  .then(handleResponse)
  .catch(handleError);

export const updateGroup = (data) => axios.put(`${endpoint}/${data.id}`, data,)
  .then(handleResponse)
  .catch(handleError);

export const removeGroup = (groupId) => axios.delete(`${endpoint}/${groupId}`)
  .then(handleResponse)
  .catch(handleError);

export default {
  getGroupList,
  getGroup,
  createGroup,
  updateGroup,
  removeGroup
}
