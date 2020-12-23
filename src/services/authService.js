import { handleResponse, handleError, axios } from './configService';

import {clearLocalStorage, getTokenFromLocalStorage} from "./localStorageService";

const endpoint = '/users';

export const login = (data) => axios.post(`${endpoint}/login`, data)
  .then(handleResponse)
  .catch(handleError);

export const logout = () => axios.post(`${endpoint}/logout`, null)
  .then(handleResponse)
  .catch(handleError);

export const getSchoolCodes = () => axios.get('/schools/codes/all')
  .then(handleResponse)
  .catch(handleError);

export const getSchoolYears = (code) => {
    let path = '/schools/years/all';
    if (code) {
      path = path + '?code=' + code;
    }
    return axios.get(path)
      .then(handleResponse)
      .catch(handleError);
}

export const getCurrentUser = () =>  axios.get(`${endpoint}/auth/me`)
    .then(handleResponse)
    .catch(handleError);

export const sendRestPasswordLink = (data) => axios.post(`${endpoint}/password/reset-link`, data)
  .then(handleResponse)
  .catch(handleError);

export const setNewPassword = (data) => axios.post(`${endpoint}/password/reset-password`, data)
    .then(handleResponse)
    .catch(handleError);

export const getUserByActivationToken = (token) =>  axios.get(`${endpoint}/activation-token/${token}`)
  .then(handleResponse)
  .catch(handleError);

export const activateUser = (data) => axios.post(`${endpoint}/activate`, data)
  .then(handleResponse)
  .catch(handleError);

export const resendEmailActivationToken = (id) => axios.get(`${endpoint}/activation-token/new-token/${id}`)
  .then(handleResponse)
  .catch(handleError);


export async function isUserLoggedIn() {
  const token = getTokenFromLocalStorage();
  if (!token) {
    return false;
  }
  let user;
  try {
    user = await getCurrentUser();
    user.jwt = token;
  } catch (err) {
    console.log(err);
    clearLocalStorage()
    return false;
  }
  if (!user) {
    clearLocalStorage()
    return false;
  }
  return user;
}

export default {
  login,
  logout,
  getSchoolCodes,
  getCurrentUser,
  isUserLoggedIn,
  sendRestPasswordLink,
  setNewPassword,
  getUserByActivationToken,
  resendEmailActivationToken,
  activateUser
}
