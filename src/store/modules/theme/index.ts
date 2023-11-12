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
   * set theme scheme
   * @param themeScheme
   */
  function setThemeScheme(themeScheme: UnionKey.ThemeScheme) {
    settings.value.themeScheme = themeScheme;
  }

  /**
   * toggle theme scheme
   */
  function toggleThemeScheme() {
    const themeSchemes: UnionKey.ThemeScheme[] = ['light', 'dark', 'auto'];

    const index = themeSchemes.findIndex(item => item === settings.value.themeScheme);

    const nextIndex = index === themeSchemes.length - 1 ? 0 : index + 1;

    const nextThemeScheme = themeSchemes[nextIndex];

    setThemeScheme(nextThemeScheme);
  }

  /**
   * dark mode
   */
  const darkMode = computed(() => {
    if (settings.value.themeScheme === 'auto') {
      return osTheme.value === 'dark';
    }

    return settings.value.themeScheme === 'dark';
  });

  /**
   * antd theme
   */
  const antdTheme = computed(() => getAntdTheme(settings.value.themeColor, settings.value.otherColor, darkMode.value));

  /**
   * set theme layout
   * @param mode theme layout mode
   */
  function setThemeLayout(mode: UnionKey.ThemeLayoutMode) {
    settings.value.layout.mode = mode;
  }

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
    setThemeScheme,
    toggleThemeScheme,
    antdTheme,
    setThemeLayout
  };
});
