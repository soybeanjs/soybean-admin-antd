import axios from 'axios';
import type { CreateAxiosDefaults } from 'axios';

export function createAxios(config?: CreateAxiosDefaults) {
  const instance = axios.create(config);

  instance.interceptors.request.use(conf => {
    return conf;
  });

  instance.interceptors.response.use(
    async response => {
      console.log('response: ', response);
      return response;
    },
    error => {
      console.log('response error: ', error);
      return Promise.reject(error);
    }
  );

  return instance;
}

export default createAxios;
