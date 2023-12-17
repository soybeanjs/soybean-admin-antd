import { ofetch } from 'ofetch';
import type { FetchOptions } from 'ofetch';

export function createFetch(options: FetchOptions) {
  const request = ofetch.create(options);

  return request;
}

export default createFetch;
