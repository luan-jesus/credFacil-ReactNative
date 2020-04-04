import Axios from 'axios';

Axios.defaults.timeout = 18000;
const api = Axios.create({
  baseURL: 'http://192.168.0.2:5000'
});

export default api;