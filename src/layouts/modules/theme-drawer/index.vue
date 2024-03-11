<script setup lang="ts">
import { SimpleScrollbar } from '@sa/materials';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';
import DarkMode from './modules/dark-mode.vue';
import LayoutMode from './modules/layout-mode.vue';
import ThemeColor from './modules/theme-color.vue';
import PageFun from './modules/page-fun.vue';
import ConfigOperation from './modules/config-operation.vue';

defineOptions({
  name: 'ThemeDrawer'
});

const appStore = useAppStore();
</script>

<template>
  <ADrawer
    :open="appStore.themeDrawerVisible"
    :title="$t('theme.themeDrawerTitle')"
    :closable="false"
    :body-style="{ padding: '0px' }"
    @close="appStore.closeThemeDrawer"
  >
    <template #extra>
      <ButtonIcon icon="ant-design:close-outlined" class="h-28px" @click="appStore.closeThemeDrawer" />
    </template>
    <SimpleScrollbar>
      <div class="px-24px pb-24px pt-8px">
        <DarkMode />
        <LayoutMode />
        <ThemeColor />
        <PageFun />
      </div>
    </SimpleScrollbar>
    <template #footer>
      <ConfigOperation />
    </template>
  </ADrawer>
</template>

<style scoped></style>
