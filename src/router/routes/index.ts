import type { ElegantRoute, CustomRoute } from '@elegant-router/types';
import { generatedRoutes } from '../elegant/routes';
import { layouts, views } from '../elegant/imports';
import { transformElegantRoutesToVueRoutes } from '../elegant/transform';

const customRoutes: CustomRoute[] = [
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
    name: 'not-found',
    path: '/:pathMatch(.*)*',
    component: 'layout.blank$view.404',
    meta: {
      title: 'not-found',
      constant: true
    }
  }
];

function createRoutes() {
  const constantRoutes: ElegantRoute[] = [];

  const authRoutes: ElegantRoute[] = [];

  [...customRoutes, ...generatedRoutes].forEach(item => {
    if (item.meta?.constant) {
      constantRoutes.push(item);
    } else {
      authRoutes.push(item);
    }
  });

  const constantVueRoutes = transformElegantRoutesToVueRoutes(constantRoutes, layouts, views);

  const authVueRoutes = transformElegantRoutesToVueRoutes(authRoutes, layouts, views);

  return {
    constantRoutes,
    authRoutes,
    constantVueRoutes,
    authVueRoutes
  };
}

export const { constantRoutes, authRoutes, constantVueRoutes, authVueRoutes } = createRoutes();
