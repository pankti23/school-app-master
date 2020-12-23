import { handleResponse, handleError, axios } from "./configService";

const endpoint = "/scores";

export const deleteScore = (data) =>
  axios
    .delete(`${endpoint}/${data.id}`)
    .then(handleResponse)
    .catch(handleError);

export const getScoresList = () =>
  axios.get(endpoint).then(handleResponse).catch(handleError);

export const getScoresListByCampusByDate = (data) =>
  axios
    .get(`${endpoint}/campus/${data.campusId}/date/${data.date}`)
    .then(handleResponse)
    .catch(handleError);

export const updateScore = (data) =>
  axios
    .put(`${endpoint}/${data.id}`, data)
    .then(handleResponse)
    .catch(handleError);

export default {
  deleteScore,
  getScoresList,
  getScoresListByCampusByDate,
  updateScore
};
