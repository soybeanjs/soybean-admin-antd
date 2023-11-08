<script setup lang="ts">
import { useFullscreen } from '@vueuse/core';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
// import GlobalLogo from '../global-logo/index.vue';
import ThemeButton from './components/theme-button.vue';
import UserAvatar from './components/user-avatar.vue';

const app = useAppStore();
const themeStore = useThemeStore();
const { isFullscreen, toggle } = useFullscreen();

defineOptions({
  name: 'GlobalHeader'
});
</script>

<template>
  <DarkModeContainer class="flex-y-center h-full shadow-header">
    <div class="flex-1-hidden flex-y-center h-full">
      <MenuToggler :collapsed="app.siderCollapse" @click="app.toggleSiderCollapse" />
    </div>
    <div class="flex-y-center justify-end h-full">
      <FullScreen :full="isFullscreen" @click="toggle" />
      <LangSwitch :lang="app.locale" :lang-options="app.localeOptions" @change-lang="app.changeLocale" />
      <ColorSchemaSwitch
        :color-schema="themeStore.colorScheme"
        :is-dark="themeStore.darkMode"
        @switch="themeStore.toggleColorScheme"
      />
      <ThemeButton />
      <UserAvatar />
    </div>
  </DarkModeContainer>
</template>

<style scoped></style>
