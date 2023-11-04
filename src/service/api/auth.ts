import { request } from '../request';

/**
 * login
 * @param userName user name
 * @param password password
 */
export function fetchLogin(userName: string, password: string) {
  return request<App.Service.Response<Api.Auth.LoginToken>>({
    url: '/auth/login',
    method: 'post',
    data: {
      userName,
      password
    }
  });
}
