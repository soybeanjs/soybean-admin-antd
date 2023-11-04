import type { RouteRecordRaw } from 'vue-router';
import { useSvgIconRender } from '@sa/hooks';
import { $t } from '@/locales';
import SvgIcon from '@/components/custom/svg-icon.vue';
import type { ElegantRoute, LastLevelRouteKey } from '@elegant-router/types';

/**
 * get global menus by auth routes
 * @param routes elegant routes
 */
export function getGlobalMenusByAuthRoutes(routes: ElegantRoute[]) {
  const menus: App.Global.Menu[] = [];

  routes.forEach(route => {
    const { name, path } = route;
    const { title, i18nKey, icon, localIcon, hideInMenu } = route.meta ?? {};

    if (!hideInMenu) {
      const menu: App.Global.Menu = {
        key: name,
        title,
        i18nKey,
        routeKey: name,
        routePath: path,
        icon,
        localIcon
      };

      if (hasChildren(route)) {
        menu.children = getGlobalMenusByAuthRoutes(route.children);
      }

      menus.push(menu);
    }
  });

  return menus;
}

/**
 * get cache route names
 * @param routes vue routes (two levels)
 */
export function getCacheRouteNames(routes: RouteRecordRaw[]) {
  const cacheNames: LastLevelRouteKey[] = [];

  routes.forEach(route => {
    // only get last two level route, which has component
    route.children?.forEach(child => {
      if (child.component && child.meta?.keepAlive) {
        cacheNames.push(child.name as LastLevelRouteKey);
      }
    });
  });

  return cacheNames;
}

export function getAntdMenuByGlobalMenus(globalMenus: App.Global.Menu[]) {
  const { SvgIconVNode } = useSvgIconRender(SvgIcon, import.meta.env.VITE_MENU_ICON);

  const menus: App.Global.AntdMenu[] = [];

  globalMenus.forEach(menu => {
    const { key, title, i18nKey, icon, localIcon, children } = menu;

    const label = i18nKey ? $t(i18nKey) : title;

    const antdMenu: App.Global.AntdMenu = {
      key,
      label,
      title: label,
      icon: SvgIconVNode({ icon, localIcon, fontSize: 20 })
    };

    if (children?.length) {
      (antdMenu as App.Global.AntSubMenu).children = getAntdMenuByGlobalMenus(children);
    }

    menus.push(antdMenu);
  });

  return menus;
}

function hasChildren<T extends ElegantRoute>(route: T): route is T & { children: ElegantRoute[] } {
  return Boolean((route as T & { children: ElegantRoute[] }).children?.length);
}
