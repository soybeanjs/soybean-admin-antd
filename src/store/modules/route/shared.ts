import type { SingleLevelRoute, MultiLevelRoute } from '@elegant-router/types';

export function getGlobalMenusByAuthRoutes(routes: (SingleLevelRoute | MultiLevelRoute)[]) {
  function isFirstLevelRoute(route: SingleLevelRoute | MultiLevelRoute): route is SingleLevelRoute {
    const { children = [] } = route as SingleLevelRoute;

    return children.length === 1 && !children[0].name.includes('_');
  }

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
      const { name, path, children } = route;
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

      if (children?.length) {
        menu.children = getGlobalMenusByAuthRoutes(children as unknown as (SingleLevelRoute | MultiLevelRoute)[]);
      }

      menus.push(menu);
    }
  });

  return menus;
}
