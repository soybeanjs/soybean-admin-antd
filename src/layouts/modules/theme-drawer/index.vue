<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';
import DarkMode from './components/dark-mode.vue';

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
      <AButton v-if="appStore.isMobile" @click="appStore.closeThemeDrawer">{{ $t('common.cancel') }}</AButton>
    </template>
    <DarkMode />
  </ADrawer>
</template>

<style scoped></style>
