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
    setupUnocss(viteEnv),
    ...setupUnplugin(viteEnv),
    progress()
  ];

  if (viteEnv.DEV) {
    plugins.push(
      ElegantVueRouter({
        layouts: {
          base: 'src/layouts/base-layout/index.vue',
          blank: 'src/layouts/blank-layout/index.vue'
        },
        layoutLazyImport: () => false
      })
    );
  }

  return plugins;
}
