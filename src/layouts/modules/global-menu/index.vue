<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import { transformColorWithOpacity } from '@sa/utils';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import HorizontalMenu from './modules/horizontal-menu.vue';
import TopHybridHeaderFirst from './modules/top-hybrid-header-first.vue';
import TopHybridSidebarFirst from './modules/top-hybrid-sidebar-first.vue';
import VerticalHybridHeaderFirst from './modules/vertical-hybrid-header-first.vue';
import VerticalMenu from './modules/vertical-menu.vue';
import VerticalMixMenu from './modules/vertical-mix-menu.vue';

defineOptions({
  name: 'GlobalMenu'
});

const appStore = useAppStore();
const themeStore = useThemeStore();

const activeMenu = computed(() => {
  const menuMap: Record<UnionKey.ThemeLayoutMode, Component> = {
    vertical: VerticalMenu,
    'vertical-mix': VerticalMixMenu,
    'vertical-hybrid-header-first': VerticalHybridHeaderFirst,
    horizontal: HorizontalMenu,
    'top-hybrid-sidebar-first': TopHybridSidebarFirst,
    'top-hybrid-header-first': TopHybridHeaderFirst
  };

  return menuMap[themeStore.layout.mode];
});

const reRenderVertical = computed(() => themeStore.layout.mode === 'vertical' && appStore.isMobile);

const selectedBgColor = computed(() => {
  const { darkMode, themeColor } = themeStore;

  const light = transformColorWithOpacity(themeColor, 0.1, '#ffffff');
  const dark = transformColorWithOpacity(themeColor, 0.3, '#000000');

  return darkMode ? dark : light;
});
</script>

<template>
  <component :is="activeMenu" :key="reRenderVertical" />
</template>

<style>
@import './index.scss';

.select-menu {
  --selected-bg-color: v-bind(selectedBgColor);
}
</style>
