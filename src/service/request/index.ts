import { BACKEND_ERROR_CODE, REQUEST_ID_KEY, createFlatRequest, createRequest } from '@sa/axios';
import { getServiceBaseURL } from '@/utils/service';
import { $t } from '@/locales';
import { useAuthStore } from '@/store/modules/auth';
import { userCache } from '../cache/users';
import { getAuthorization, handleRefreshToken, showErrorMsg } from './shared';
import { createAuthFailureHandler, createRequestState } from './lifecycle';
import type { RequestInstanceState } from './type';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL, otherBaseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

const requestState = createRequestState();
const logoutListeners = new Set<() => void>();
const handleAuthFailure = createAuthFailureHandler({
  state: requestState,
  logoutCodes: import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || [],
  modalLogoutCodes: import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [],
  expiredTokenCodes: import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [],
  refresh: handleRefreshToken,
  logout: () => {
    useAuthStore().resetStore();
  },
  getAuthorization,
  isCurrentSession: response => response.config.authSessionVersion === useAuthStore().sessionVersion,
  showLogoutModal(message, close) {
    const cleanup = () => {
      window.removeEventListener('beforeunload', cleanup);
      logoutListeners.delete(cleanup);
      close();
    };
    logoutListeners.add(cleanup);
    window.addEventListener('beforeunload', cleanup);
    if (!window.$modal) {
      cleanup();
      return;
    }
    window.$modal.error({
      title: $t('common.error'),
      content: message,
      okText: $t('common.confirm'),
      maskClosable: false,
      onOk: cleanup,
      onCancel: cleanup
    });
  }
});

export const request = createFlatRequest<App.Service.Response, any, RequestInstanceState>(
  {
    baseURL,
    headers:
      import.meta.env.VITE_USE_MOCK === 'Y' && import.meta.env.VITE_APIFOX_TOKEN
        ? { apifoxToken: import.meta.env.VITE_APIFOX_TOKEN }
        : undefined
  },
  {
    async onRequest(config) {
      config.authSessionVersion ??= useAuthStore().sessionVersion;
      config.headers.set('Authorization', getAuthorization());

      return config;
    },
    isBackendSuccess(response) {
      // when the backend response code is "0000"(default), it means the request is success
      // to change this logic by yourself, you can modify the `VITE_SERVICE_SUCCESS_CODE` in `.env` file
      return String(response.data.code) === import.meta.env.VITE_SERVICE_SUCCESS_CODE;
    },
    onBackendFail: handleAuthFailure,
    transform(response) {
      return response.data.data;
    },
    onError(error) {
      // when the request is fail, you can show error message

      if (
        error.config?.authSessionVersion !== undefined &&
        error.config.authSessionVersion !== useAuthStore().sessionVersion
      )
        return;
      window.dispatchEvent(
        new CustomEvent('request:error', {
          detail: {
            requestId: error.config?.headers.get(REQUEST_ID_KEY),
            code: error.code,
            status: error.response?.status,
            method: error.config?.method
          }
        })
      );
      let message = error.message;
      let backendErrorCode = '';

      // get backend error message and code
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.msg || message;
        backendErrorCode = String(error.response?.data?.code) || '';
      }

      // the error message is displayed in the modal
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      if (modalLogoutCodes.includes(backendErrorCode)) {
        return;
      }

      // when the token is expired, refresh token and retry request, so no need to show error message
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
      if (expiredTokenCodes.includes(backendErrorCode)) {
        return;
      }

      showErrorMsg(request.state, message);
    }
  }
);
request.state = requestState;

export const demoRequest = createRequest<App.Service.DemoResponse>(
  {
    baseURL: otherBaseURL.demo
  },
  {
    async onRequest(config) {
      const { headers } = config;

      // set token
      const Authorization = getAuthorization();
      Object.assign(headers, { Authorization });

      return config;
    },
    isBackendSuccess(response) {
      // when the backend response code is "200", it means the request is success
      // you can change this logic by yourself
      return response.data.status === '200';
    },
    async onBackendFail(_response) {
      // when the backend response code is not "200", it means the request is fail
      // for example: the token is expired, refresh token and retry request
    },
    transform(response) {
      return response.data.result;
    },
    onError(error) {
      // when the request is fail, you can show error message

      let message = error.message;

      // show backend error message
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.message || message;
      }

      window.$message?.error(message);
    }
  }
);

export function resetRequestState() {
  userCache.clear();
  logoutListeners.forEach(listener => window.removeEventListener('beforeunload', listener));
  logoutListeners.clear();
  Object.assign(requestState, createRequestState());
  request.cancelAllRequest();
  demoRequest.cancelAllRequest();
}
