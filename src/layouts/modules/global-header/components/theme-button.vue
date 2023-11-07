<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';

defineOptions({
  name: 'ThemeButton'
});

const app = useAppStore();
</script>

<template>
  <AButton type="text" class="h-full text-icon" @click="app.openThemeDrawer">
    <icon-majesticons:color-swatch-line />
  </AButton>
</template>

<style scoped></style>
