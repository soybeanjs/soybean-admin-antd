<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { useRouteStore } from '@/store/modules/route';
import GlobalLogo from '../../components/global-logo.vue';

defineOptions({
  name: 'GlobalSider'
});

const app = useAppStore();
const route = useRouteStore();
</script>

<template>
  <DarkModeContainer class="flex-vertical-stretch wh-full shadow-sider">
    <GlobalLogo :show-title="!app.siderCollapse" class="h-48px" />
    <div class="flex-1-hidden">
      <AMenu mode="inline" :inline-collapsed="app.siderCollapse" :items="route.antdMenus" class="w-full" />
    </div>
  </DarkModeContainer>
</template>

<style scoped></style>
