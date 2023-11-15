interface Window {
  /**
   * NProgress instance
   */
  NProgress?: import('nprogress').NProgress;
  /**
   * ant-design-vue message instance
   */
  $message?: import('ant-design-vue/es/message/interface').MessageInstance;
  /**
   * ant-design-vue modal instance
   */
  $modal?: Omit<import('ant-design-vue/es/modal/confirm').ModalStaticFunctions, 'warn'>;
  /**
   * ant-design-vue notification instance
   */
  $notification?: import('ant-design-vue/es/notification/interface').NotificationInstance;
}

interface ViewTransition {
  ready: Promise<void>;
}

interface Document {
  startViewTransition?: (callback: () => Promise<void> | void) => ViewTransition;
}

interface ImportMeta {
  readonly env: Env.ImportMeta;
}

/**
 * build time of the project
 */
declare const BUILD_TIME: string;
