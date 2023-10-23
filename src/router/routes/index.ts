import type { ElegantRoute, CustomRoute, SingleLevelRoute } from '@elegant-router/types';
import { autoRoutes } from '../elegant/routes';
import { layouts, views } from '../elegant/imports';
import { transformElegantRouteToVueRoute, transformElegantRouteToTreeRoute } from '../elegant/transform';

export function createRoutes() {
  const builtinRoutes: CustomRoute[] = [
    {
      name: 'root',
      path: '/',
      redirect: {
        name: 'home'
      },
      meta: {
        title: 'root',
        constant: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      component: 'layout.blank',
      children: [
        {
          name: 'not-found',
          path: '',
          component: 'view.404',
          meta: {
            title: 'not-found',
            constant: true
          }
        }
      ]
    }
  ];

  const constantRoutes: ElegantRoute[] = [...builtinRoutes];

  const authRoutes: ElegantRoute[] = [];

  autoRoutes.forEach(route => {
    const isConstant = Boolean(route.meta?.constant);

    const isSingleConstant = Boolean((route as SingleLevelRoute).children?.[0]?.meta?.constant);

    if (isConstant || isSingleConstant) {
      constantRoutes.push(route);
    } else {
      authRoutes.push(route);
    }
  });

  const constantVueRoutes = transformElegantRouteToVueRoute(constantRoutes, layouts, views);

  const authVueRoutes = transformElegantRouteToVueRoute(authRoutes, layouts, views);

  const treeRoutes = transformElegantRouteToTreeRoute(authRoutes);

  return {
    constantRoutes,
    authRoutes,
    constantVueRoutes,
    authVueRoutes,
    treeRoutes
  };
}
