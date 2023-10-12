/**
 * namespace Env
 * @description it is used to declare the type of the import.meta object
 */
declare namespace Env {
  type YesOrNo = 'Y' | 'N';

  /**
   * the router history mode
   */
  type RouterHistoryMode = 'hash' | 'history' | 'memory';

  /**
   *  interface for import.meta
   */
  interface ImportMeta extends ImportMetaEnv {
    /**
     * the base url of the application
     */
    readonly VITE_BASE_URL: string;
    /**
     * the title of the application
     */
    readonly VITE_APP_TITLE: string;
    /**
     * the description of the application
     */
    readonly VITE_APP_DESC: string;
    /**
     * whether to enable the http proxy
     * @description only valid in the development environment
     */
    readonly VITE_HTTP_PROXY?: YesOrNo;
    /**
     * the router history mode
     */
    readonly VITE_ROUTER_HISTORY_MODE?: RouterHistoryMode;

    /**
     * the prefix of the iconify icon
     */
    readonly VITE_ICON_PREFIX: 'icon';

    /**
     * the prefix of the local icon
     * @description this prefix is start with the icon prefix
     */
    readonly VITE_ICON_LOCAL_PREFIX: 'local-icon';
  }
}
