<script setup lang="ts">
import { computed, ref } from 'vue';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import AppearanceSettings from './modules/appearance/index.vue';
import ConfigOperation from './modules/config-operation.vue';
import GeneralSettings from './modules/general/index.vue';
import LayoutSettings from './modules/layout/index.vue';
import PresetSettings from './modules/preset/index.vue';

defineOptions({
  name: 'ThemeDrawer'
});

const appStore = useAppStore();

const activeTab = ref('appearance');

const drawerWidth = computed(() => {
  const width = 400;

  // On mobile devices, use 90% of viewport width with a maximum of 400px
  if (appStore.isMobile) {
    return `min(90vw, ${width}px)`;
  }

  return width;
});

function handleClose() {
  appStore.closeThemeDrawer();
}
</script>

<template>
  <ADrawer
    :open="appStore.themeDrawerVisible"
    :width="drawerWidth"
    :title="$t('theme.themeDrawerTitle')"
    :body-style="{ padding: '0px' }"
    @close="handleClose"
  >
    <template #extra>
      <ButtonIcon icon="ant-design:close-outlined" class="h-28px" @click="handleClose" />
    </template>

    <div class="h-full flex-col-stretch">
      <ATabs v-model:active-key="activeTab" class="px-24px pt-8px">
        <ATabPane key="appearance" :tab="$t('theme.tabs.appearance')" />
        <ATabPane key="layout" :tab="$t('theme.tabs.layout')" />
        <ATabPane key="general" :tab="$t('theme.tabs.general')" />
        <ATabPane key="preset" :tab="$t('theme.tabs.preset')" />
      </ATabs>

      <div class="min-h-400px flex-1 overflow-y-auto px-24px pb-24px">
        <KeepAlive>
          <AppearanceSettings v-if="activeTab === 'appearance'" />
          <LayoutSettings v-else-if="activeTab === 'layout'" />
          <GeneralSettings v-else-if="activeTab === 'general'" />
          <PresetSettings v-else-if="activeTab === 'preset'" />
        </KeepAlive>
      </div>
    </div>

    <template #footer>
      <ConfigOperation />
    </template>
  </ADrawer>
</template>

<style scoped></style>
