import { handleResponse, handleError, axios } from "./configService";

const endpoint = "/permissions";

export const getPermissionsList = () =>
  axios.get(endpoint).then(handleResponse).catch(handleError);

export const getLoggedInUserPermissionForRoute = (route) =>
  axios.get(`${endpoint}/me/${route}`).then(handleResponse).catch(handleError);

export const updatePermissions = (data) =>
  axios
    .put(`${endpoint}/${data.id}`, data)
    .then(handleResponse)
    .catch(handleError);

export default {
  getPermissionsList,
  updatePermissions,
  getLoggedInUserPermissionForRoute
};
