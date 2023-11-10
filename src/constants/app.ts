import { transformRecordToOption } from '@/utils/common';

export const themeSchemaRecord: Record<UnionKey.ThemeScheme, App.I18n.I18nKey> = {
  light: 'theme.themeSchema.light',
  dark: 'theme.themeSchema.dark',
  auto: 'theme.themeSchema.auto'
};

export const loginModuleRecord: Record<UnionKey.LoginModule, App.I18n.I18nKey> = {
  'pwd-login': 'page.login.pwdLogin.title',
  'code-login': 'page.login.codeLogin.title',
  register: 'page.login.register.title',
  'reset-pwd': 'page.login.resetPwd.title',
  'bind-wechat': 'page.login.bindWeChat.title'
};

export const themeLayoutModeRecord: Record<UnionKey.ThemeLayoutMode, string> = {
  vertical: '左侧菜单模式',
  horizontal: '顶部菜单模式',
  'vertical-mix': '左侧菜单混合模式',
  'horizontal-mix': '顶部菜单混合模式'
};
export const themeLayoutModeOptions = transformRecordToOption(themeLayoutModeRecord);

export const themeScrollModeRecord: Record<UnionKey.ThemeScrollMode, string> = {
  wrapper: '外层滚动',
  content: '主体滚动'
};
export const themeScrollModeOptions = transformRecordToOption(themeScrollModeRecord);

export const themeTabModeRecord: Record<UnionKey.ThemeTabMode, string> = {
  chrome: '谷歌风格',
  button: '按钮风格'
};
export const themeTabModeOptions = transformRecordToOption(themeTabModeRecord);

export const themeHorizontalMenuPositionRecord: Record<UnionKey.ThemeHorizontalMenuPosition, string> = {
  'flex-start': '居左',
  center: '居中',
  'flex-end': '居右'
};
export const themeHorizontalMenuPositionOptions = transformRecordToOption(themeHorizontalMenuPositionRecord);
