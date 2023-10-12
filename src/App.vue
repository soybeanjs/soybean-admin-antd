<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue';
import { useThemeStore } from './store/modules/theme';

const theme = useThemeStore();

defineOptions({
  name: 'App'
});
</script>

<template>
  <ConfigProvider :theme="theme.antdTheme">
    <RouterView />
  </ConfigProvider>
</template>

<style scoped></style>
