export function normalizeLocale(locale: unknown): App.I18n.LangType {
  return locale === 'en-US' ? 'en-US' : 'zh-CN';
}
