<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';
import DarkMode from './modules/dark-mode.vue';
import LayoutMode from './modules/layout-mode.vue';
import ThemeColor from './modules/theme-color.vue';

defineOptions({
  name: 'ThemeDrawer'
});

const appStore = useAppStore();
</script>

<template>
  <ADrawer
    :open="appStore.themeDrawerVisible"
    :title="$t('theme.themeDrawerTitle')"
    :closable="false"
    @close="appStore.closeThemeDrawer"
  >
    <template #extra>
      <ButtonIcon icon="ant-design:close-outlined" class="h-28px" @click="appStore.closeThemeDrawer" />
    </template>
    <DarkMode />
    <LayoutMode />
    <ThemeColor />
  </ADrawer>
</template>

<style scoped></style>
