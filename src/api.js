import axios from 'axios';

export const baseUrl = 'https://api.integration.axreg.app/'

const api = axios.create({
  baseURL: baseUrl,
  timeout: 70000,
});

api.defaults.headers = {
  'Integrator-Key': 'c61a7db0-2236-481e-aaa1-068fcfccd4af',
  'Institution-Key': 'e40b1bb2-e3d1-4c84-83ae-307ea731bd55',
  'Content-Type': 'application/json'
}

export default api;
