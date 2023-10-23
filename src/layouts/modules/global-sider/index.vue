<script setup lang="ts">
import { useRouteStore } from '@/store/modules/route';
import GlobalLogo from '../../components/global-logo.vue';

defineOptions({
  name: 'GlobalSider'
});

const route = useRouteStore();
</script>

<template>
  <DarkModeContainer class="flex-vertical-stretch wh-full shadow-sider">
    <GlobalLogo :show-title="true" class="h-48px" />
    <div class="flex-1-hidden">
      <AMenu mode="inline" :items="route.antdMenus" />
    </div>
  </DarkModeContainer>
</template>

<style scoped></style>
