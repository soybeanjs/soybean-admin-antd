import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export type ContentType =
  | 'text/html'
  | 'text/plain'
  | 'multipart/form-data'
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'application/octet-stream';

export interface RequestOption {
  /**
   * The hook before request
   *
   * For example: You can add header token in this hook
   *
   * @param config Axios config
   */
  onRequest: (config: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig>;
  /**
   * The hook to check backend response is success or not
   *
   * @param response Axios response
   */
  onBackendSuccess: (response: AxiosResponse) => boolean;
  /**
   * The hook after backend request fail
   *
   * For example: You can handle the expired token in this hook
   *
   * @param response Axios response
   * @param instance Axios instance
   * @returns
   */
  onBackendFail: (response: AxiosResponse, instance: AxiosInstance) => Promise<AxiosResponse> | Promise<void>;
  /**
   * The hook to handle error
   *
   * For example: You can show error message in this hook
   *
   * @param error
   */
  onError: (error: AxiosError) => Promise<void>;
}

/** The axios instance with cancel request function */
export type RequestInstance = AxiosInstance & {
  cancelRequest: (requestId: string) => void;
  cancelAllRequest: () => void;
};
