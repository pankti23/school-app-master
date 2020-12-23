import { handleResponse, handleError, axios } from './configService';

const endpoint = '/users';

export const createUser = (data) => axios.post(endpoint, data)
  .then(handleResponse)
  .catch(handleError);

export const updateUser = (data) => axios.put(`${endpoint}/${data.id}`, data)
  .then(handleResponse)
  .catch(handleError);

export const getUsersList = () => axios.get(`${endpoint}`)
  .then(handleResponse)
  .catch(handleError);

export const regenerateUserActivationToken = (id) => axios.get(`${endpoint}/activation-token/new-token/${id}`)
  .then(handleResponse)
  .catch(handleError);

export const getCampusPrincipalList = () => axios.get(`${endpoint}/role/4`)
  .then(handleResponse)
  .catch(handleError);

export const getLevelPrincipalList = () => axios.get(`${endpoint}/role/5`)
  .then(handleResponse)
  .catch(handleError);

export const getSchoolAdminsList = () => axios.get(`${endpoint}/role/2`)
  .then(handleResponse)
  .catch(handleError);

export default {
  createUser,
  updateUser,
  getUsersList,
  getCampusPrincipalList,
  getLevelPrincipalList,
  getSchoolAdminsList
}
  