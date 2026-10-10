import { addAPIProvider } from '@iconify/vue';

/** Configure the Iconify API provider (dynamic icons may require network access) */
export function setupIconifyProvider() {
  const { VITE_ICONIFY_URL } = import.meta.env;

  if (VITE_ICONIFY_URL) {
    addAPIProvider('', { resources: [VITE_ICONIFY_URL] });
  }
}
