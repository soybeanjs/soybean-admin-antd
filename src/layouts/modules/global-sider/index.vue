<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import GlobalLogo from '../global-logo/index.vue';
import VerticalMenu from '../global-menu/vertical-menu.vue';

defineOptions({
  name: 'GlobalSider'
});

const appStore = useAppStore();
const themeStore = useThemeStore();

const darkMenu = computed(() => !themeStore.darkMode && themeStore.sider.inverted);
</script>

<template>
  <DarkModeContainer class="flex-vertical-stretch wh-full shadow-sider" :inverted="darkMenu">
    <GlobalLogo :show-title="!appStore.siderCollapse" class="h-48px" />
    <VerticalMenu :dark-theme="darkMenu" />
  </DarkModeContainer>
</template>

<style scoped></style>
