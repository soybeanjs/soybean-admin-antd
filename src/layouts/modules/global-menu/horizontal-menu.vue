<script setup lang="ts">
import { useThemeStore } from '@/store/modules/theme';
import BaseMenu from './base-menu.vue';

defineOptions({
  name: 'HorizontalMenu'
});

const themeStore = useThemeStore();
</script>

<template>
  <div class="flex-1-hidden h-full px-12px">
    <BaseMenu :dark-theme="themeStore.sider.inverted" mode="horizontal" />
  </div>
</template>

<style scoped></style>
