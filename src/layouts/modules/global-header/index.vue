<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
// import GlobalLogo from '../../components/global-logo.vue';
import SwitchLang from './components/switch-lang.vue';
import UserAvatar from './components/user-avatar.vue';

const app = useAppStore();
const themeStore = useThemeStore();

defineOptions({
  name: 'GlobalHeader'
});
</script>

<template>
  <DarkModeContainer class="flex-y-center h-full shadow-header">
    <div class="flex-1-hidden flex-y-center h-full">
      <MenuToggler :collapsed="app.siderCollapse" @click="app.toggleSiderCollapse" />
    </div>
    <div class="flex justify-end h-full">
      <SwitchLang />
      <ColorSchemaSwitch
        :color-schema="themeStore.colorScheme"
        :is-dark="themeStore.darkMode"
        @switch="themeStore.toggleColorScheme"
      />
      <UserAvatar />
    </div>
  </DarkModeContainer>
</template>

<style scoped></style>
