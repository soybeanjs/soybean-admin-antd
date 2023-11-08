<script setup lang="ts">
import { AdminLayout } from '@sa/materials';
import { useAppStore } from '@/store/modules/app';
import GlobalHeader from '../modules/global-header/index.vue';
import GlobalSider from '../modules/global-sider/index.vue';
import GlobalTab from '../modules/global-tab/index.vue';
import GlobalContent from '../modules/global-content/index.vue';
import GlobalFooter from '../modules/global-footer/index.vue';
import ThemeDrawer from '../modules/theme-drawer/index.vue';

defineOptions({
  name: 'BaseLayout'
});

const app = useAppStore();
</script>

<template>
  <AdminLayout
    :is-mobile="app.isMobile"
    :sider-collapse="app.siderCollapse"
    :full-content="app.fullContent"
    @click-mobile-sider-mask="app.setSiderCollapse(true)"
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
