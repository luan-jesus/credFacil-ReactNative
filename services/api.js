import Axios from 'axios';

Axios.defaults.timeout = 20000;
const api = Axios.create({
  baseURL: 'https://credfacil.herokuapp.com'
});

export default api;