export interface RequestInstanceState {
  [key: string]: unknown;
  /** whether the request is refreshing token */
  refreshTokenFn: Promise<boolean> | null;
  /** the request error message stack */
  errMsgStack: string[];
  /** Business codes currently represented by a logout modal. */
  modalLogoutCodes: string[];
}

declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
    authRetryCount?: number;
    authSessionVersion?: number;
  }
}
