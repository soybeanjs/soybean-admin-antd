import { setupVueRootValidator } from 'vite-plugin-vue-transition-root-validator/client';
import { createApp } from 'vue';
import { setupAppVersionNotification, setupDayjs, setupIconifyProvider, setupLoading, setupNProgress } from './plugins';
import './plugins/assets';
import { setupAppErrorHandle } from './plugins/app';
import { getLocale, setupI18n } from './locales';
import { setupStore } from './store';
import { setupRouter } from './router';
import App from './App.vue';

async function setupApp() {
  setupLoading();

  setupNProgress();

  setupIconifyProvider();

  setupDayjs();

  const app = createApp(App);
  setupAppErrorHandle(app);

  setupStore(app);

  await setupRouter(app);

  setupI18n(app);

  setupAppVersionNotification(app);

  setupVueRootValidator(app, {
    lang: getLocale() === 'zh-CN' ? 'zh' : 'en'
  });

  app.mount('#app');
}

setupApp().catch(() => {
  const app = document.querySelector('#app');
  if (app) app.textContent = '应用加载失败，请刷新页面重试。 / Unable to load the application. Please refresh.';
});
