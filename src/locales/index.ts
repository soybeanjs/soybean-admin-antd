import type { App } from 'vue';
import { createI18n } from 'vue-i18n';
import { localStg } from '@/utils/storage';
import { normalizeLocale } from './utils';
import messages from './locale';

const i18n = createI18n({
  locale: normalizeLocale(localStg.get('lang')),
  fallbackLocale: 'en-US',
  messages,
  legacy: false
});

/**
 * Setup plugin i18n
 *
 * @param app
 */
export function setupI18n(app: App) {
  app.use(i18n);
  document.documentElement.lang = i18n.global.locale.value;
}

export const i18nLocale = i18n.global.locale;

export const $t = i18n.global.t as App.I18n.$T;

export function setLocale(locale: App.I18n.LangType) {
  i18n.global.locale.value = normalizeLocale(locale);
  document.documentElement.lang = i18n.global.locale.value;
}

export function getLocale(): App.I18n.LangType {
  return i18n.global.locale.value as App.I18n.LangType;
}
