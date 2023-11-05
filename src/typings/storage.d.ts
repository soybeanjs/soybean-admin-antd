/**
 * the storage namespace
 */
declare namespace StorageType {
  interface Session {
    /**
     * the theme color
     */
    themeColor: string;
    /**
     * the theme settings
     */
    themeSettings: App.Theme.ThemeSetting;
  }

  interface Local {
    /**
     * the i18n language
     */
    lang: App.I18n.LangType;
    /**
     * the token
     */
    token: string;
    /**
     * the refresh token
     */
    refreshToken: string;
    /**
     * the user info
     */
    userInfo: Api.Auth.UserInfo;
  }
}
