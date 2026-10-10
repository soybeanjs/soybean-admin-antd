import { h } from 'vue';
import type { App } from 'vue';
import { Button } from 'ant-design-vue';
import { $t } from '@/locales';
import { readAppVersion } from './version';

export function setupAppErrorHandle(app: App) {
  app.config.errorHandler = (err, _vm, info) => {
    const detail = { name: err instanceof Error ? err.name : 'Error', info };
    // eslint-disable-next-line no-console
    console.error('[app:error]', detail);
    window.dispatchEvent(new CustomEvent('app:error', { detail }));
  };
  const onRejection = () => {
    window.dispatchEvent(new CustomEvent('app:error', { detail: { name: 'UnhandledRejection' } }));
  };
  window.addEventListener('unhandledrejection', onRejection);
  app.onUnmount(() => window.removeEventListener('unhandledrejection', onRejection));
}

export function setupAppVersionNotification(app: App) {
  // Update check interval in milliseconds
  const UPDATE_CHECK_INTERVAL = 3 * 60 * 1000;

  const canAutoUpdateApp = import.meta.env.VITE_AUTOMATICALLY_DETECT_UPDATE === 'Y' && import.meta.env.PROD;
  if (!canAutoUpdateApp) return;

  let isShow = false;
  let updateInterval: ReturnType<typeof setInterval> | undefined;
  let pending = false;
  let stopped = false;

  const checkForUpdates = async () => {
    if (isShow || pending || stopped || document.visibilityState !== 'visible') return;
    pending = true;
    const buildTime = await readAppVersion(`${import.meta.env.BASE_URL}version.json`);
    pending = false;

    // If build time hasn't changed, no update is needed
    if (
      !buildTime ||
      buildTime === BUILD_TIME ||
      stopped ||
      document.visibilityState !== 'visible' ||
      !window.$notification
    ) {
      return;
    }

    isShow = true;

    const key = `open${Date.now()}`;

    window.$notification?.open({
      key,
      message: $t('system.updateTitle'),
      description: $t('system.updateContent'),
      btn() {
        return h('div', { style: { display: 'flex', justifyContent: 'end', gap: '12px', width: '325px' } }, [
          h(
            Button,
            {
              onClick() {
                window.$notification?.destroy(key);
                isShow = false;
              }
            },
            () => $t('system.updateCancel')
          ),
          h(
            Button,
            {
              type: 'primary',
              onClick() {
                location.reload();
              }
            },
            () => $t('system.updateConfirm')
          )
        ]);
      },
      onClose() {
        isShow = false;
      }
    });
  };

  const startUpdateInterval = () => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
    updateInterval = setInterval(checkForUpdates, UPDATE_CHECK_INTERVAL);
  };

  const onVisibilityChange = () => {
    clearInterval(updateInterval);
    if (document.visibilityState === 'visible') {
      checkForUpdates();
      startUpdateInterval();
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);
  if (document.visibilityState === 'visible') startUpdateInterval();
  app.onUnmount(() => {
    stopped = true;
    clearInterval(updateInterval);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  });
}
