<script setup lang="ts">
import { computed } from 'vue';
import { getColorPalette, mixColor } from '@sa/utils';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';

const theme = useThemeStore();

const bgThemeColor = computed(() => (theme.darkMode ? getColorPalette(theme.themeColor, 7) : theme.themeColor));

const bgColor = computed(() => {
  const COLOR_WHITE = '#ffffff';

  const ratio = theme.darkMode ? 0.5 : 0.2;

  return mixColor(COLOR_WHITE, theme.themeColor, ratio);
});
</script>

<template>
  <div class="relative flex-center wh-full" :style="{ backgroundColor: bgColor }">
    <WaveBg :theme-color="bgThemeColor" />
    <div class="soy-card relative z-4">
      <div class="w-400px <sm:w-300px">
        <header class="flex-y-center justify-between">
          <SystemLogo class="text-64px text-primary <sm:text-48px" />
          <h3 class="text-28px font-500 text-primary <sm:text-22px">{{ $t('system.title') }}</h3>
          <ColorSchemaSwitch
            :color-schema="theme.colorScheme"
            :is-dark="theme.darkMode"
            class="text-20px <sm:text-18px"
            @switch="theme.toggleColorScheme"
          />
        </header>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
