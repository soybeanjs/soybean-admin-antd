<script setup lang="ts">
import { ColorPicker } from '@sa/materials';
import { useThemeStore } from '@/store/modules/theme';
import SettingItem from '../components/setting-item.vue';

defineOptions({
  name: 'ThemeColor'
});

const themeStore = useThemeStore();
</script>

<template>
  <ADivider>{{ $t('theme.themeColor.title') }}</ADivider>
  <div class="flex-vertical-stretch gap-12px">
    <SettingItem :label="$t('theme.themeColor.primary')">
      <ColorPicker v-model:color="themeStore.themeColor" :dark-mode="themeStore.darkMode" />
    </SettingItem>
    <SettingItem :label="$t('theme.themeColor.info')">
      <ColorPicker v-model:color="themeStore.otherColor.info" :dark-mode="themeStore.darkMode" />
    </SettingItem>
    <SettingItem :label="$t('theme.themeColor.success')">
      <ColorPicker v-model:color="themeStore.otherColor.success" :dark-mode="themeStore.darkMode" />
    </SettingItem>
    <SettingItem :label="$t('theme.themeColor.warning')">
      <ColorPicker v-model:color="themeStore.otherColor.warning" :dark-mode="themeStore.darkMode" />
    </SettingItem>
    <SettingItem :label="$t('theme.themeColor.error')">
      <ColorPicker v-model:color="themeStore.otherColor.error" :dark-mode="themeStore.darkMode" />
    </SettingItem>
  </div>
</template>

<style scoped></style>
