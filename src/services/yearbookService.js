import { handleResponse, handleError, attachFilesToFormData, axios } from './configService';

const endpoint = '/yearbooks';

export const getYearbookList = () => axios.get(endpoint)
  .then(handleResponse)
  .catch(handleError);

export const uploadPhotos = (yearbookId, files) => {
  const formData = attachFilesToFormData(files, 'photos');

  return axios.put(`${endpoint}/photos/${yearbookId}`, formData)
    .then(handleResponse)
    .catch(handleError);
};

export const deletePhoto = (yearbookId, filename) => {
  return axios.delete(`${endpoint}/photo/${yearbookId}/file/${filename}`)
    .then(handleResponse)
    .catch(handleError);
};

export const deletePhotos = (yearbookId, photos) => {
  const data = { photos };
  return axios.put(`${endpoint}/remove/photos/${yearbookId}`, data)
    .then(handleResponse)
    .catch(handleError);
};



export default {
  getYearbookList,
  uploadPhotos,
  deletePhoto,
  deletePhotos
}
