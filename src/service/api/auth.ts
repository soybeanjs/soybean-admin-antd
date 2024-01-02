import { axios, request } from '../request';

/**
 * Login
 *
 * @param userName User name
 * @param password Password
 */
export function fetchLogin(userName: string, password: string) {
  return request<App.Service.Response<Api.Auth.LoginToken>>('/auth/login', {
    method: 'post',
    body: {
      userName,
      password
    }
  });
}

/** Get user info */
export function fetchGetUserInfo() {
  return request<App.Service.Response<Api.Auth.UserInfo>>('/auth/getUserInfo');
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<App.Service.Response<Api.Auth.LoginToken>>('/auth/refreshToken', {
    method: 'post',
    body: {
      refreshToken
    }
  });
}

export function fetchDebug() {
  return request<App.Service.Response<string>>('/debug-post', {
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: 'a=1'
  });
}

export function fetchDebugAxios() {
  return axios<App.Service.Response<string>>('/debug-post', {
    method: 'post'
  });
}
