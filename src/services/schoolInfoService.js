import { handleResponse, handleError, axios } from "./configService";

const endpoint = "/schoolInfo";

export const getDivisionsList = () =>
  axios
    .get(`${endpoint}/divisions/all`)
    .then(handleResponse)
    .catch(handleError);

export const getDivisionsTree = () =>
  axios
    .get(`${endpoint}/divisions/tree`)
    .then(handleResponse)
    .catch(handleError);

export const getSchoolInfo = () =>
  axios
    .get(endpoint)
    .then(handleResponse)
    .catch(handleError);

export const updateSchoolInfo = info =>
  axios
    .put(endpoint, info)
    .then(handleResponse)
    .catch(handleError);

export const uploadSchoolLogo = file => {
  const formData = new FormData();

  formData.append("logo", file);

  return axios
    .put(`${endpoint}/logo`, formData)
    .then(handleResponse)
    .catch(handleError);
};

export default {
  getDivisionsList,
  getDivisionsTree,
  getSchoolInfo,
  updateSchoolInfo,
  uploadSchoolLogo
};
