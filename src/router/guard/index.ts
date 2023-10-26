import type { Router } from 'vue-router';
import { useRouteStore } from '@/store/modules/route';

/**
 * 路由守卫函数
 * @param router - 路由实例
 */
export function createRouterGuard(router: Router) {
  router.beforeEach(async (_to, _from, next) => {
    window.NProgress?.start?.();

    const { isInitAuthRoute, initAuthRoute } = useRouteStore();

    if (!isInitAuthRoute) {
      await initAuthRoute();
    }

    next();
  });
  router.afterEach(_to => {
    window.NProgress?.done?.();
  });
}
