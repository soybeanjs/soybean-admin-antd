<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';

defineOptions({
  name: 'ThemeDrawer'
});

const appStore = useAppStore();
</script>

<template>
  <ADrawer
    :open="appStore.themeDrawerVisible"
    :title="$t('themeDrawer.title')"
    :closable="false"
    @close="appStore.closeThemeDrawer"
  >
    <template #extra>
      <AButton @click="appStore.closeThemeDrawer">{{ $t('common.cancel') }}</AButton>
    </template>
  </ADrawer>
</template>

<style scoped></style>
