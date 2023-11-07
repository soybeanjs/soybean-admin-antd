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

  /**
   * global namespace
   */
  namespace Global {
    type AntdMenu = NonNullable<import('ant-design-vue').ItemType>;
    type AntSubMenu = import('ant-design-vue/es/menu/src/interface').SubMenuType;
    type RouteKey = import('@elegant-router/types').RouteKey;
    type RouteMap = import('@elegant-router/types').RouteMap;
    type LastLevelRouteKey = import('@elegant-router/types').LastLevelRouteKey;
    type RouteLocationNormalizedLoaded = import('vue-router').RouteLocationNormalizedLoaded;

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

    /**
     * form rule
     */
    type FormRule = import('ant-design-vue/es/form/interface.d.ts').Rule;

    type TabRoute = Pick<RouteLocationNormalizedLoaded, 'name' | 'path' | 'meta'> &
      Partial<Pick<RouteLocationNormalizedLoaded, 'fullPath' | 'query'>>;

    /**
     * the global tab
     */
    type Tab<T extends LastLevelRouteKey = LastLevelRouteKey> = {
      /**
       * the tab id
       */
      id: string;
      /**
       * the tab label
       */
      label: string;
      /**
       * the new tab label
       * @description if set, the tab label will be replaced by this value
       */
      newLabel?: string;
      /**
       * the tab route key
       */
      routeKey: T;
      /**
       * the tab route path
       */
      routePath: RouteMap[T];
      /**
       * the tab route full path
       */
      fullPath: string;
      /**
       * the tab fixed index
       */
      fixedIndex?: number;
      /**
       * tab icon
       * @description iconify icon
       */
      icon?: string;
      /**
       * tab local icon
       * @description local icon
       */
      localIcon?: string;
      /**
       * i18n key
       */
      i18nKey?: I18n.I18nKey;
    };
  }

  /**
   * i18n namespace
   * @description locales type
   */
  namespace I18n {
    type RouteKey = import('@elegant-router/types').RouteKey;

    type LangType = 'en' | 'zh-CN';

    type LangOption = {
      label: string;
      key: App.I18n.LangType;
    };

    type I18nRouteKey = Exclude<RouteKey, 'root' | 'not-found'>;

    type FormMsg = {
      required: string;
      invalid: string;
    };

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
      route: Record<I18nRouteKey, string>;
      page: {
        login: {
          common: {
            loginOrRegister: string;
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
      form: {
        userName: FormMsg;
        phone: FormMsg;
        pwd: FormMsg;
        code: FormMsg;
        email: FormMsg;
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

  /**
   * service namespace
   */
  namespace Service {
    /**
     * the backend service env type
     */
    type EnvType = 'dev' | 'test' | 'prod';

    /**
     * the backend service config
     */
    interface ServiceConfig {
      /**
       * the backend service base url
       */
      baseURL: string;
      /**
       * other backend service base url map
       */
      otherBaseURL: Record<string, string>;
    }

    /**
     * the backend service config map
     */
    type ServiceConfigMap = Record<EnvType, ServiceConfig>;

    /**
     * the backend service response data
     */
    type Response<T = unknown> = {
      /**
       * the backend service response code
       */
      code: string;
      /**
       * the backend service response message
       */
      message: string;
      /**
       * the backend service response data
       */
      data: T;
    };
  }
}
