<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import GlobalLogo from '../global-logo/index.vue';
import VerticalMenu from '../global-menu/vertical-menu.vue';
import VerticalMixMenu from '../global-menu/vertical-mix-menu.vue';

defineOptions({
  name: 'GlobalSider'
});

const appStore = useAppStore();
const themeStore = useThemeStore();

const darkMenu = computed(() => !themeStore.darkMode && themeStore.sider.inverted);
const isVerticalMix = computed(() => themeStore.layout.mode === 'vertical-mix');
const showLogo = computed(() => !isVerticalMix.value && themeStore.layout.mode !== 'horizontal-mix');
</script>

<template>
  <DarkModeContainer class="flex-vertical-stretch wh-full shadow-sider" :inverted="darkMenu">
    <GlobalLogo
      v-if="showLogo"
      :show-title="!appStore.siderCollapse"
      :style="{ height: themeStore.header.height + 'px' }"
    />
    <VerticalMixMenu v-if="isVerticalMix">
      <GlobalLogo :show-title="false" :style="{ height: themeStore.header.height + 'px' }" />
    </VerticalMixMenu>
    <VerticalMenu v-else :dark-theme="darkMenu" />
  </DarkModeContainer>
</template>

<style scoped></style>
