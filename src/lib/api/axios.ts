
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1/auth', // Cambia si el puerto o la ruta cambia
  timeout: 10000, // Tiempo máximo de espera
});

export default api;
