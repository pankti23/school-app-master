import { handleResponse, handleError, axios } from "./configService";

const endpoint = "/roles";

export const getRolesList = () =>
  axios.get(endpoint).then(handleResponse).catch(handleError);

export default {
  getRolesList
};
