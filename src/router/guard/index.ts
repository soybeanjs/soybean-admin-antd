import type { Router } from 'vue-router';

/**
 * 路由守卫函数
 * @param router - 路由实例
 */
export function createRouterGuard(router: Router) {
  router.beforeEach(async (_to, _from, next) => {
    window.NProgress?.start?.();

    next();
  });
  router.afterEach(_to => {
    window.NProgress?.done?.();
  });
}
