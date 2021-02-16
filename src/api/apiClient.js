import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://6xyw5rm9x7.execute-api.eu-central-1.amazonaws.com',
});

export default instance;
