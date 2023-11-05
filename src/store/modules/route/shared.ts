import type { RouteRecordRaw } from 'vue-router';
import type { ElegantConstRoute, RouteKey, RouteMap, LastLevelRouteKey } from '@elegant-router/types';
import { useSvgIconRender } from '@sa/hooks';
import { $t } from '@/locales';
import SvgIcon from '@/components/custom/svg-icon.vue';

/**
 * filter auth routes by roles
 * @param routes auth routes
 * @param roles roles
 */
export function filterAuthRoutesByRoles(routes: ElegantConstRoute[], roles: string[]) {
  const SUPER_ROLE = 'R_SUPER';

  if (roles.includes(SUPER_ROLE)) {
    return routes;
  }

  return routes.flatMap(route => filterAuthRouteByRoles(route, roles));
}

/**
 * filter auth route by roles
 * @param route auth route
 * @param roles roles
 */
function filterAuthRouteByRoles(route: ElegantConstRoute, roles: string[]) {
  const routeRoles = (route.meta && route.meta.roles) || [];

  if (!routeRoles.length) {
    return [route];
  }

  const hasPermission = routeRoles.some(role => roles.includes(role));

  const filterRoute = { ...route };

  if (filterRoute.children?.length) {
    filterRoute.children = filterRoute.children.flatMap(item => filterAuthRouteByRoles(item, roles));
  }

  return hasPermission ? [filterRoute] : [];
}

/**
 * get global menus by auth routes
 * @param routes auth routes
 */
export function getGlobalMenusByAuthRoutes(routes: ElegantConstRoute[]) {
  const menus: App.Global.Menu[] = [];

  routes.forEach(route => {
    const { name, path } = route;
    const { title, i18nKey, icon, localIcon, hideInMenu } = route.meta ?? {};

    if (!hideInMenu) {
      const menu: App.Global.Menu = {
        key: name,
        title,
        i18nKey,
        routeKey: name as RouteKey,
        routePath: path as RouteMap[RouteKey],
        icon,
        localIcon
      };

      if (route.children?.length) {
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

/**
 * get antd menus
 * @param globalMenus
 */
export function transformGlobalMenusToAntdMenu(globalMenus: App.Global.Menu[]) {
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
      (antdMenu as App.Global.AntSubMenu).children = transformGlobalMenusToAntdMenu(children);
    }

    menus.push(antdMenu);
  });

  return menus;
}

/**
 * is route exist by route name
 * @param routeName
 * @param routes
 */
export function isRouteExistByRouteName(routeName: RouteKey, routes: ElegantConstRoute[]) {
  return routes.some(route => recursiveGetIsRouteExistByRouteName(route, routeName));
}

/**
 * recursive get is route exist by route name
 * @param route
 * @param routeName
 */
function recursiveGetIsRouteExistByRouteName(route: ElegantConstRoute, routeName: RouteKey) {
  let isExist = route.name === routeName;

  if (isExist) {
    return true;
  }

  if (route.children && route.children.length) {
    isExist = route.children.some(item => recursiveGetIsRouteExistByRouteName(item, routeName));
  }

  return isExist;
}
