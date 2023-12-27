import FormData from 'form-data';
import type { AxiosHeaderValue, InternalAxiosRequestConfig } from 'axios';
import type { ContentType } from './type';

export function transformRequestData(data: any, contentType: AxiosHeaderValue) {
  if (typeof contentType !== 'string') return data;

  const $contentType = contentType as ContentType;

  // 1. "application/json": do not transform

  // 2 "application/x-www-form-urlencoded": transform to query string
  if ($contentType === 'application/x-www-form-urlencoded' && typeof data === 'object') {
    const params = new URLSearchParams();
    Object.keys(data).forEach(key => {
      params.append(key, data[key]);
    });

    return params;
  }

  // 3. "multipart/form-data": transform to FormData
  if ($contentType === 'multipart/form-data' && typeof data === 'object') {
    const formData = new FormData();
    const entries = Object.entries(data);

    entries.forEach(([key, value]) => {
      if (isFiles(value)) {
        value.forEach(file => {
          formData.append(key, file);
        });
      } else {
        formData.append(key, value);
      }
    });
  }

  return data;
}

function isFiles(data: File[] | unknown): data is File[] {
  const isArray = Array.isArray(data);
  const hasData = isArray && data.length > 0;
  const isFile = hasData && Object.prototype.toString.call(data[0]) === '[object File]';

  return isFile;
}

export function getContentType(config: InternalAxiosRequestConfig) {
  const contentType: AxiosHeaderValue = config.headers?.['Content-Type'] || 'application/json';

  return contentType;
}
