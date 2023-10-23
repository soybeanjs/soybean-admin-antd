import type {
  ElegantRoute,
  RouteKey,
  SingleLevelRoute,
  CustomSingleLevelRoute,
  LastLevelRoute,
  LastLevelRouteKey
} from '@elegant-router/types';

/**
 * get global menus by auth routes
 * @param routes
 */
export function getGlobalMenusByAuthRoutes(routes: ElegantRoute[]) {
  const menus: App.Global.Menu[] = [];

  routes.forEach(route => {
    if (isFirstLevelRoute(route)) {
      const child = route.children[0];

      const { title, i18nKey, icon, localIcon } = child.meta ?? {};

      const menu: App.Global.Menu = {
        key: child.name,
        title,
        i18nKey,
        routeKey: child.name,
        routePath: route.path,
        icon,
        localIcon
      };

      menus.push(menu);
    } else {
      const { name, path } = route;
      const { title, i18nKey, icon, localIcon } = route.meta ?? {};

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
 * @param routes two level routes
 */
export function getCacheRouteNames(routes: ElegantRoute[]) {
  const cacheNames: RouteKey[] = [];

  routes.forEach(route => {
    if (hasChildren(route)) {
      route.children.forEach(child => {
        const lastLevelRoute = child as unknown as LastLevelRoute<LastLevelRouteKey>;

        if (lastLevelRoute.name && lastLevelRoute.component && lastLevelRoute.meta?.keepAlive) {
          cacheNames.push(lastLevelRoute.name);
        }
      });
    }
  });

  return cacheNames;
}

type FirstLevelRoute = SingleLevelRoute | CustomSingleLevelRoute;

function isFirstLevelRoute(route: ElegantRoute): route is FirstLevelRoute {
  const { children = [] } = route as FirstLevelRoute;

  return children.length === 1 && !children[0].name.includes('_');
}

function hasChildren<T extends ElegantRoute>(route: T): route is T & { children: ElegantRoute[] } {
  return Boolean((route as T & { children: ElegantRoute[] }).children?.length);
}
