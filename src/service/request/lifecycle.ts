import type { AxiosInstance, AxiosResponse } from 'axios';
import type { RequestInstanceState } from './type';

interface BusinessResponse {
  code: string | number;
  msg: string;
}

interface AuthFailureOptions {
  state: RequestInstanceState;
  logoutCodes: string[];
  modalLogoutCodes: string[];
  expiredTokenCodes: string[];
  refresh: () => Promise<boolean>;
  logout: () => void;
  getAuthorization: () => string | null;
  isCurrentSession: (response: AxiosResponse) => boolean;
  showLogoutModal: (message: string, close: () => void) => void;
}

export function createRequestState(): RequestInstanceState {
  return { refreshTokenFn: null, errMsgStack: [], modalLogoutCodes: [] };
}

export function refreshOnce(state: RequestInstanceState, refresh: () => Promise<boolean>) {
  if (!state.refreshTokenFn) {
    const pending = Promise.resolve()
      .then(refresh)
      .catch(() => false);
    state.refreshTokenFn = pending;
    pending.finally(() => {
      if (state.refreshTokenFn === pending) state.refreshTokenFn = null;
    });
  }
  return state.refreshTokenFn;
}

export function createAuthFailureHandler(options: AuthFailureOptions) {
  return async (response: AxiosResponse<BusinessResponse>, instance: AxiosInstance) => {
    if (!options.isCurrentSession(response)) return null;
    const code = String(response.data.code);
    if (options.logoutCodes.includes(code)) {
      options.logout();
      return null;
    }
    if (options.modalLogoutCodes.includes(code)) {
      if (!options.state.modalLogoutCodes.includes(code)) {
        options.state.modalLogoutCodes.push(code);
        let closed = false;
        options.showLogoutModal(response.data.msg, () => {
          if (closed) return;
          closed = true;
          options.state.modalLogoutCodes = options.state.modalLogoutCodes.filter(item => item !== code);
          if (options.isCurrentSession(response)) options.logout();
        });
      }
      return null;
    }
    if (!options.expiredTokenCodes.includes(code)) return null;
    if (response.config.skipAuthRefresh || (response.config.authRetryCount || 0) >= 1) {
      options.logout();
      return null;
    }
    const success = await refreshOnce(options.state, options.refresh);
    if (!options.isCurrentSession(response)) return null;
    if (!success) {
      options.logout();
      return null;
    }
    response.config.authRetryCount = 1;
    response.config.headers.set('Authorization', options.getAuthorization());
    return instance.request(response.config);
  };
}
