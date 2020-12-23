import { getTokenFromLocalStorage } from './localStorageService';

const baseURL = process.env.REACT_APP_BASE_URL;
// console.log(`The base URL is ${baseURL}`, process.env);

export const axios = (require('axios').create({ baseURL }));

axios.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = getTokenFromLocalStorage();
    return config;
  },
  (error) => Promise.reject(error)
);

export const handleResponse = (res) => res.data;

export const handleError = (error) => {
  console.log('Error ->>', error);
  console.log('Response ->>', error.response);


  let message = 'Something went wrong! Please try again later.';
  if (error.response.data.message) {
    message = error.response.data.message;
  } else if (error.response.data) {
    message = error.response.data;
  }
  const err = new Error(message);
  err.status = error.response.status;
  throw err;
};

export const attachFilesToFormData = (files, keyName) => {
  const formData = new FormData();
  for (const file of files) {
    formData.append(keyName, file);
  }
  return formData
}
