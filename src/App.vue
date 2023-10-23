<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue';
import { useThemeStore } from './store/modules/theme';
import { useRouteStore } from './store/modules/route';

defineOptions({
  name: 'App'
});

const theme = useThemeStore();
const { initAuthRoute } = useRouteStore();

initAuthRoute();
</script>

<template>
  <ConfigProvider :theme="theme.antdTheme">
    <RouterView />
  </ConfigProvider>
</template>

<style scoped></style>
