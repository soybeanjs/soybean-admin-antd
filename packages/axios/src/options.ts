import type { CreateAxiosDefaults } from 'axios';
import type { IAxiosRetryConfig } from 'axios-retry';
import { isHttpSuccess } from './shared';
import type { RequestOption } from './type';

export function createDefaultOptions(options?: Partial<RequestOption>) {
  const opts: RequestOption = {
    onRequest: async config => config,
    onBackendSuccess: _response => true,
    onBackendFail: async () => {},
    onError: async () => {}
  };

  Object.assign(opts, options);

  return opts;
}

export function createRetryOptions(config?: Partial<CreateAxiosDefaults>) {
  const retryConfig: IAxiosRetryConfig = {
    retries: 3
  };

  Object.assign(retryConfig, config);

  return retryConfig;
}

export function createAxiosConfig(config?: Partial<CreateAxiosDefaults>) {
  const TEN_SECONDS = 10 * 1000;

  const axiosConfig: CreateAxiosDefaults = {
    timeout: TEN_SECONDS,
    headers: {
      'Content-Type': 'application/json'
    },
    validateStatus: isHttpSuccess
  };

  Object.assign(axiosConfig, config);

  return axiosConfig;
}
