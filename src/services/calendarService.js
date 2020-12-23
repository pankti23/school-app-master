import {handleResponse, handleError, axios, attachFilesToFormData} from './configService';

const itemsEndpoint = '/calendarItems';
const datesEndpoint = '/calendarDates';
const typesEndpoint = '/itemTypes';


export const createCalendarItem = (data) => axios.post(itemsEndpoint, data)
  .then(handleResponse)
  .catch(handleError);

export const updateCalendarItem = (data, saveAllDates) =>
  axios.put(`${itemsEndpoint}/${data.id}?saveAllDates=${saveAllDates}`, data)
  .then(handleResponse)
  .catch(handleError);

export const removeCalendarItem = (itemId, date, deleteAllDates) => {
  return axios.delete(`${datesEndpoint}/date/${date}/item/${itemId}?deleteAllDates=${deleteAllDates}`)
    .then(handleResponse)
    .catch(handleError);
}

export const uploadAttachments = (itemId, files) => {
  const formData = attachFilesToFormData(files, 'attachments');

  return axios.put(`${itemsEndpoint}/attachments/${itemId}`, formData)
    .then(handleResponse)
    .catch(handleError);
};

export const getTypesList = () => axios.get(typesEndpoint)
  .then(handleResponse)
  .catch(handleError);

export const getDatesList = () => axios.get(datesEndpoint)
  .then(handleResponse)
  .catch(handleError);

export const getDatesInYear = () => axios.get(`${datesEndpoint}/all/year`)
  .then(handleResponse)
  .catch(handleError);

export const getDatesInWeek = (date) => axios.get(`${datesEndpoint}/all/week/${date}`)
  .then(handleResponse)
  .catch(handleError);

export const getDataForWeek = (startDate, endDate) =>
  axios.get(`${datesEndpoint}/data/week/${startDate}/${endDate}`)
    .then(handleResponse)
    .catch(handleError);

export const getItemById = (id) => axios.get(`${itemsEndpoint}/${id}`)
  .then(handleResponse)
  .catch(handleError);

export const getItemByType = (type) => axios.get(`${itemsEndpoint}?type=${type}`)
  .then(handleResponse)
  .catch(handleError);


export default {
  getTypesList,
  getDatesInYear,
  getDatesInWeek,
  getDatesList,
  getItemById,
  getItemByType
}
