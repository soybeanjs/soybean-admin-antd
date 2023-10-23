/**
 * the global namespace for the app
 */
declare namespace App {
  /**
   * theme namespace
   */
  namespace Theme {
    type ColorPaletteNumber = import('@sa/color-palette').ColorPaletteNumber;

    /**
     * color scheme
     */
    type ColorScheme = 'light' | 'dark' | 'auto';

    /**
     * theme setting
     */
    interface ThemeSetting {
      /**
       * color scheme
       */
      colorScheme: ColorScheme;
      /**
       * theme color
       */
      themeColor: string;
      /**
       * other color
       */
      otherColor: OtherColor;
    }

    interface OtherColor {
      info: string;
      success: string;
      warning: string;
      error: string;
    }

    interface ThemeColor extends OtherColor {
      primary: string;
    }

    type ThemeColorKey = keyof ThemeColor;

    type ThemePaletteColor = {
      [key in ThemeColorKey | `${ThemeColorKey}-${ColorPaletteNumber}`]: string;
    };

    type BaseToken = Record<string, Record<string, string>>;

    interface ThemeTokenColor extends ThemePaletteColor {
      nprogress: string;
      container: string;
      layout: string;
      base_text: string;
      [key: string]: string;
    }

    type ThemeToken = {
      colors: ThemeTokenColor;
      boxShadow: {
        header: string;
        sider: string;
        tab: string;
      };
    };
  }

  namespace Global {
    type AntdMenu = NonNullable<import('ant-design-vue').ItemType>;
    type RouteKey = import('@elegant-router/types').RouteKey;
    type RouteMap = import('@elegant-router/types').RouteMap;

    /**
     * the global menu
     */
    interface Menu<T extends RouteKey = RouteKey> {
      key: string;
      title?: string;
      i18nKey?: I18n.I18nKey;
      routeKey: T;
      routePath: RouteMap[T];
      icon?: string;
      localIcon?: string;
      children?: Menu<T>[];
    }
  }

  /**
   * i18n namespace
   * @description locales type
   */
  namespace I18n {
    type RouteKey = import('@elegant-router/types').AutoRouteKey;

    type LangType = 'en' | 'zh-CN';

    type Schema = {
      system: {
        title: string;
      };
      common: {
        tip: string;
        add: string;
        addSuccess: string;
        edit: string;
        editSuccess: string;
        delete: string;
        deleteSuccess: string;
        batchDelete: string;
        confirm: string;
        cancel: string;
        pleaseCheckValue: string;
        action: string;
        backToHome: string;
        lookForward: string;
        userCenter: string;
        logout: string;
        logoutConfirm: string;
      };
      route: Record<RouteKey, string>;
      page: {
        login: {
          common: {
            userNamePlaceholder: string;
            phonePlaceholder: string;
            codePlaceholder: string;
            passwordPlaceholder: string;
            confirmPasswordPlaceholder: string;
            codeLogin: string;
            confirm: string;
            back: string;
            validateSuccess: string;
            loginSuccess: string;
            welcomeBack: string;
          };
          pwdLogin: {
            title: string;
            rememberMe: string;
            forgetPassword: string;
            register: string;
            otherAccountLogin: string;
            otherLoginMode: string;
            superAdmin: string;
            admin: string;
            user: string;
          };
          codeLogin: {
            title: string;
            getCode: string;
            imageCodePlaceholder: string;
          };
          register: {
            title: string;
            agreement: string;
            protocol: string;
            policy: string;
          };
          resetPwd: {
            title: string;
          };
          bindWeChat: {
            title: string;
          };
        };
      };
    };

    type GetI18nKey<T extends Record<string, unknown>, K extends keyof T = keyof T> = K extends string
      ? T[K] extends Record<string, unknown>
        ? `${K}.${GetI18nKey<T[K]>}`
        : K
      : never;

    type I18nKey = GetI18nKey<Schema>;

    type TranslateOptions<Locales extends string> = import('vue-i18n').TranslateOptions<Locales>;

    interface $T {
      (key: I18nKey): string;
      (key: I18nKey, plural: number, options?: TranslateOptions<LangType>): string;
      (key: I18nKey, defaultMsg: string, options?: TranslateOptions<I18nKey>): string;
      (key: I18nKey, list: unknown[], options?: TranslateOptions<I18nKey>): string;
      (key: I18nKey, list: unknown[], plural: number): string;
      (key: I18nKey, list: unknown[], defaultMsg: string): string;
      (key: I18nKey, named: Record<string, unknown>, options?: TranslateOptions<LangType>): string;
      (key: I18nKey, named: Record<string, unknown>, plural: number): string;
      (key: I18nKey, named: Record<string, unknown>, defaultMsg: string): string;
    }
  }
}
