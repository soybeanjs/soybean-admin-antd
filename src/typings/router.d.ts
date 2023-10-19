import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * title of the route
     * @description it can be used in document title
     */
    title: string;
    /**
     * i18n key of the route
     * @description it's used in i18n, if it is set, the title will be ignored
     */
    i18nKey?: App.I18n.I18nKey;
    /**
     * whether to require authentication
     */
    requiresAuth?: boolean;
  }
}
