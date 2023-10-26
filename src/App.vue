<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue';
import { useThemeStore } from './store/modules/theme';

defineOptions({
  name: 'App'
});

const theme = useThemeStore();
</script>

<template>
  <ConfigProvider :theme="theme.antdTheme">
    <RouterView />
  </ConfigProvider>
</template>

<style scoped></style>
