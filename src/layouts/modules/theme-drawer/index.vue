<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';

defineOptions({
  name: 'ThemeDrawer'
});

const app = useAppStore();
</script>

<template>
  <ADrawer
    :open="app.themeDrawerVisible"
    :title="$t('themeDrawer.title')"
    :closable="false"
    @close="app.closeThemeDrawer"
  >
    <template #extra>
      <AButton @click="app.closeThemeDrawer">{{ $t('common.cancel') }}</AButton>
    </template>
  </ADrawer>
</template>

<style scoped></style>
