import axios from 'axios';

const API_BASE = 'http://10.1.4.246:8080/api/v0/';
console.debug(`API_BASE -> ${API_BASE}`);

export default axios.create({
  baseURL: API_BASE,
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
});
