import type { CreateAxiosDefaults } from 'axios';
import type { IAxiosRetryConfig } from 'axios-retry';
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
