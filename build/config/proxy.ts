import type { ProxyOptions } from 'vite-plus';
import { consola } from 'consola';
import { bgRed, bgYellow, green, lightBlue } from 'kolorist';
import { createServiceConfig } from '../../src/utils/service';

/**
 * Set http proxy
 *
 * @param env - The current env
 * @param enable - If enable http proxy
 */
export function createViteProxy(env: Env.ImportMeta, enable: boolean) {
  const isEnableHttpProxy = enable && env.VITE_HTTP_PROXY === 'Y';

  if (!isEnableHttpProxy) return undefined;

  const isEnableProxyLog = env.VITE_PROXY_LOG === 'Y';

  const { baseURL, proxyPattern, other } = createServiceConfig(env);

  const proxy: Record<string, ProxyOptions> = createProxyItem(
    { baseURL, proxyPattern },
    isEnableProxyLog,
    env.VITE_DEV_BACKEND
  );

  other.forEach(item => {
    Object.assign(proxy, createProxyItem(item, isEnableProxyLog, env.VITE_DEV_BACKEND));
  });

  return proxy;
}

function createProxyItem(item: App.Service.ServiceConfigItem, enableLog: boolean, devBackend?: string) {
  const proxy: Record<string, ProxyOptions> = {};

  const relative = item.baseURL.startsWith('/');
  const target = relative ? devBackend : item.baseURL;
  if (!target || !/^https?:\/\//u.test(target)) return proxy;
  const pattern = relative ? item.baseURL : item.proxyPattern;

  proxy[pattern] = {
    target,
    changeOrigin: true,
    configure: (_proxy, options) => {
      _proxy.on('proxyReq', (_proxyReq, req, _res) => {
        if (!enableLog) return;

        const requestUrl = `${lightBlue('[proxy url]')}: ${bgYellow(` ${req.method} `)} ${green(`${item.proxyPattern}${req.url}`)}`;

        const proxyUrl = `${lightBlue('[real request url]')}: ${green(`${options.target}${req.url}`)}`;

        consola.log(`${requestUrl}\n${proxyUrl}`);
      });
      _proxy.on('error', (_err, req, _res) => {
        if (!enableLog) return;
        consola.log(bgRed(`Error: ${req.method} `), green(`${options.target}${req.url}`));
      });
    },
    rewrite: path => path.replace(new RegExp(`^${pattern.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')}`), '')
  };

  return proxy;
}
