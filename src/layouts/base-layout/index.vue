<script setup lang="ts">
import { computed } from 'vue';
import { AdminLayout } from '@sa/materials';
import type { LayoutMode } from '@sa/materials';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import GlobalHeader from '../modules/global-header/index.vue';
import GlobalSider from '../modules/global-sider/index.vue';
import GlobalTab from '../modules/global-tab/index.vue';
import GlobalContent from '../modules/global-content/index.vue';
import GlobalFooter from '../modules/global-footer/index.vue';
import ThemeDrawer from '../modules/theme-drawer/index.vue';

defineOptions({
  name: 'BaseLayout'
});

const appStore = useAppStore();
const themeStore = useThemeStore();

const layoutMode = computed(() => {
  const vertical: LayoutMode = 'vertical';
  const horizontal: LayoutMode = 'horizontal';
  return themeStore.layout.mode.includes(vertical) ? vertical : horizontal;
});
</script>

<template>
  <AdminLayout
    v-model:sider-collapse="appStore.siderCollapse"
    :mode="layoutMode"
    :is-mobile="appStore.isMobile"
    :full-content="appStore.fullContent"
  >
    <template #header>
      <GlobalHeader />
    </template>
    <template #tab>
      <GlobalTab />
    </template>
    <template #sider>
      <GlobalSider />
    </template>
    <GlobalContent />
    <ThemeDrawer />
    <template #footer>
      <GlobalFooter />
    </template>
  </AdminLayout>
</template>

<style scoped></style>
