// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
});

export const setAuthToken = (token) => {
  // ya no se usa, se deja vacío
};

export default api;
