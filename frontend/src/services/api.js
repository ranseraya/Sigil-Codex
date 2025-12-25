import axios from 'axios';

const API_URL = 'YOUR_BACKEND_URL_HERE'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;