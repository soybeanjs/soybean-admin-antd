<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue';
import { useThemeStore } from './store/modules/theme';

defineOptions({
  name: 'App'
});

const themeStore = useThemeStore();
</script>

<template>
  <ConfigProvider :theme="themeStore.antdTheme">
    <AppProvider>
      <RouterView class="bg-layout" />
    </AppProvider>
  </ConfigProvider>
</template>

<style scoped></style>
