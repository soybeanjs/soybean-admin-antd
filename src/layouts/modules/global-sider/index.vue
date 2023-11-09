<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import GlobalLogo from '../global-logo/index.vue';
import VerticalMenu from '../global-menu/vertical-menu.vue';

defineOptions({
  name: 'GlobalSider'
});

const appStore = useAppStore();
</script>

<template>
  <DarkModeContainer class="flex-vertical-stretch wh-full shadow-sider">
    <GlobalLogo :show-title="!appStore.siderCollapse" class="h-48px" />
    <VerticalMenu />
  </DarkModeContainer>
</template>

<style scoped></style>
