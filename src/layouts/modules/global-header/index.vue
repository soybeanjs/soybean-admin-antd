<script setup lang="ts">
import { useFullscreen } from '@vueuse/core';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import GlobalBreadcrumb from '../global-breadcrumb/index.vue';
import ThemeButton from './components/theme-button.vue';
import UserAvatar from './components/user-avatar.vue';

const appStore = useAppStore();
const themeStore = useThemeStore();
const { isFullscreen, toggle } = useFullscreen();

defineOptions({
  name: 'GlobalHeader'
});
</script>

<template>
  <DarkModeContainer class="flex-y-center h-full shadow-header">
    <div class="flex-1-hidden flex-y-center h-full">
      <MenuToggler :collapsed="appStore.siderCollapse" class="mr-12px" @click="appStore.toggleSiderCollapse" />
      <GlobalBreadcrumb v-if="!appStore.isMobile" />
    </div>
    <div class="flex-y-center justify-end h-full">
      <FullScreen v-if="!appStore.isMobile" :full="isFullscreen" @click="toggle" />
      <LangSwitch :lang="appStore.locale" :lang-options="appStore.localeOptions" @change-lang="appStore.changeLocale" />
      <ThemeSchemaSwitch
        :theme-schema="themeStore.themeScheme"
        :is-dark="themeStore.darkMode"
        @switch="themeStore.toggleThemeScheme"
      />
      <ThemeButton />
      <UserAvatar />
    </div>
  </DarkModeContainer>
</template>

<style scoped></style>
