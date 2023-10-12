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
    token: string;
    refreshToken: string;
    lang: App.I18n.LangType;
  }
}
