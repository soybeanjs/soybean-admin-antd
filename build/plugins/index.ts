import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueDevtools from 'vite-plugin-vue-devtools';
import ElegantVueRouter from '@elegant-router/vue/vite';
import progress from 'vite-plugin-progress';
import { setupUnocss } from './unocss';
import { setupUnplugin } from './unplugin';

export function setupVitePlugins(viteEnv: Env.ImportMeta) {
  const plugins: PluginOption = [
    vue({
      script: {
        defineModel: true
      }
    }),
    vueJsx(),
    VueDevtools(),
    ElegantVueRouter({
      layouts: {
        base: 'src/layouts/base-layout/index.vue',
        blank: 'src/layouts/blank-layout/index.vue'
      },
      layoutLazyImport: () => false
    }),
    setupUnocss(viteEnv),
    ...setupUnplugin(viteEnv),
    progress()
  ];

  return plugins;
}
