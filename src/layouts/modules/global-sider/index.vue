<script setup lang="ts">
import GlobalLogo from '../../components/global-logo.vue';

defineOptions({
  name: 'GlobalSider'
});
</script>

<template>
  <DarkModeContainer class="flex-vertical-stretch wh-full shadow-sider">
    <GlobalLogo :show-title="true" class="h-48px" />
    <div class="flex-1-hidden"></div>
  </DarkModeContainer>
</template>

<style scoped></style>
