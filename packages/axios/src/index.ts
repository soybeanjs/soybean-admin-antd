import axios from 'axios';
import type { CancelTokenSource, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { nanoid } from '@sa/utils';
import { createDefaultOptions, createRetryOptions } from './options';
import { getContentType, transformRequestData } from './shared';
import { REQUEST_ID_KEY } from './constant';
import type { RequestInstance, RequestOption } from './type';

export function createRequest(axiosConfig?: CreateAxiosDefaults, options?: Partial<RequestOption>) {
  const opts = createDefaultOptions(options);

  const instance = axios.create(axiosConfig);

  const cancelTokenSourceMap = new Map<string, CancelTokenSource>();

  // config axios retry
  const retryOptions = createRetryOptions(axiosConfig);
  axiosRetry(instance, retryOptions);

  instance.interceptors.request.use(conf => {
    const config: InternalAxiosRequestConfig = { ...conf };

    // set request id
    const requestId = nanoid();
    config.headers.set(REQUEST_ID_KEY, requestId);

    // config cancel token
    const cancelTokenSource = axios.CancelToken.source();
    config.cancelToken = cancelTokenSource.token;
    cancelTokenSourceMap.set(requestId, cancelTokenSource);

    // transform data
    const contentType = getContentType(config);
    config.data = transformRequestData(config.data, contentType);

    // handle config by hook
    const handledConfig = opts.onRequest?.(config) || config;

    return handledConfig;
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

  function cancelRequest(requestId: string) {
    const cancelTokenSource = cancelTokenSourceMap.get(requestId);
    if (cancelTokenSource) {
      cancelTokenSource.cancel();
      cancelTokenSourceMap.delete(requestId);
    }
  }

  function cancelAllRequest() {
    cancelTokenSourceMap.forEach(cancelTokenSource => {
      cancelTokenSource.cancel();
    });
    cancelTokenSourceMap.clear();
  }

  const requestInstance: RequestInstance = instance as RequestInstance;

  requestInstance.cancelRequest = cancelRequest;
  requestInstance.cancelAllRequest = cancelAllRequest;

  return requestInstance;
}

export default createRequest;
