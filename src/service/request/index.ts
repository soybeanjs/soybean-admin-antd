import { createRequest } from '@sa/fetch';
import { createRequest as createAxios } from '@sa/axios';
import { localStg } from '@/utils/storage';
import { createProxyPattern, createServiceConfig } from '~/env.config';

const { baseURL, otherBaseURL } = createServiceConfig(import.meta.env);

const isHttpProxy = import.meta.env.VITE_HTTP_PROXY === 'Y';

export const request = createRequest({
  baseURL: isHttpProxy ? createProxyPattern() : baseURL,
  headers: {
    apifoxToken: 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2'
  },
  onRequest(context) {
    const { headers } = context.options;

    if (headers) {
      const token = localStg.get('token');

      const Authorization = token ? `Bearer ${token}` : '';

      Object.assign(headers, { Authorization });
    }
  }
  // onRequestError(context) {
  //   console.error('onRequestError', context);
  // },
  // onResponse(context) {
  //   console.log('onResponse', context);
  // },
  // onResponseError(context) {
  //   console.log('onResponseError', context);
  // }
});

export const demoRequest = createRequest({ baseURL: isHttpProxy ? createProxyPattern('demo') : otherBaseURL.demo });

export const axios = createAxios({
  baseURL: isHttpProxy ? createProxyPattern() : baseURL
});
