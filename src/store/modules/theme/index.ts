import { ref, computed, effectScope, onScopeDispose, watch, toRefs } from 'vue';
import type { Ref } from 'vue';
import { defineStore } from 'pinia';
import { usePreferredColorScheme } from '@vueuse/core';
import { SetupStoreId } from '@/enum';
import { createThemeToken, initThemeSettings, setupThemeVarsToHtml, toggleCssDarkMode, getAntdTheme } from './shared';

/**
 * theme store
 */
export const useThemeStore = defineStore(SetupStoreId.Theme, () => {
  const scope = effectScope();
  const osTheme = usePreferredColorScheme();

  const { themeTokens, darkThemeTokens } = createThemeToken();

  /**
   * theme settings
   */
  const settings: Ref<App.Theme.ThemeSetting> = ref(initThemeSettings(themeTokens.colors));

  /**
   * set color scheme
   * @param colorScheme
   */
  function setColorScheme(colorScheme: App.Theme.ColorScheme) {
    settings.value.colorScheme = colorScheme;
  }

  /**
   * toggle color scheme
   */
  function toggleColorScheme() {
    const colorSchemes: App.Theme.ColorScheme[] = ['light', 'dark', 'auto'];

    const index = colorSchemes.findIndex(item => item === settings.value.colorScheme);

    const nextIndex = index === colorSchemes.length - 1 ? 0 : index + 1;

    const nextColorScheme = colorSchemes[nextIndex];

    setColorScheme(nextColorScheme);
  }

  /**
   * dark mode
   */
  const darkMode = computed(() => {
    if (settings.value.colorScheme === 'auto') {
      return osTheme.value === 'dark';
    }

    return settings.value.colorScheme === 'dark';
  });

  /**
   * antd theme
   */
  const antdTheme = computed(() => getAntdTheme(settings.value.themeColor, settings.value.otherColor, darkMode.value));

  function init() {
    setupThemeVarsToHtml(themeTokens, darkThemeTokens);
  }

  // watch store
  scope.run(() => {
    // watch dark mode
    watch(
      darkMode,
      val => {
        toggleCssDarkMode(val);
      },
      { immediate: true }
    );
  });

  /**
   * on scope dispose
   */
  onScopeDispose(() => {
    scope.stop();
  });

  // init
  init();

  return {
    ...toRefs(settings.value),
    darkMode,
    setColorScheme,
    toggleColorScheme,
    antdTheme
  };
});
