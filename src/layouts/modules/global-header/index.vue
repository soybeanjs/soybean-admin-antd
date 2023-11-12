<script setup lang="ts">
import { useFullscreen } from '@vueuse/core';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import HorizontalMenu from '../global-menu/horizontal-menu.vue';
import GlobalLogo from '../global-logo/index.vue';
import GlobalBreadcrumb from '../global-breadcrumb/index.vue';
import ThemeButton from './components/theme-button.vue';
import UserAvatar from './components/user-avatar.vue';

const appStore = useAppStore();
const themeStore = useThemeStore();
const { isFullscreen, toggle } = useFullscreen();

defineOptions({
  name: 'GlobalHeader'
});

interface Props {
  /**
   * whether to show the logo
   */
  showLogo?: App.Global.HeaderProps['showLogo'];
  /**
   * whether to show the menu toggler
   */
  showMenuToggler?: App.Global.HeaderProps['showMenuToggler'];
  /**
   * whether to show the menu
   */
  showMenu?: App.Global.HeaderProps['showMenu'];
}

defineProps<Props>();
</script>

<template>
  <DarkModeContainer class="flex-y-center h-full shadow-header">
    <GlobalLogo v-if="showLogo" class="h-full" :style="{ width: themeStore.sider.width + 'px' }" />
    <HorizontalMenu v-if="showMenu" />
    <div v-else class="flex-1-hidden flex-y-center h-full">
      <MenuToggler v-if="showMenuToggler" :collapsed="appStore.siderCollapse" @click="appStore.toggleSiderCollapse" />
      <GlobalBreadcrumb v-if="!appStore.isMobile" class="ml-12px" />
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
