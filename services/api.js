import Axios from 'axios';

Axios.defaults.timeout = 20000;
const api = Axios.create({
  baseURL: 'http://192.168.0.20:5000'
});

export default api;