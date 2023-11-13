import { ref, computed, effectScope, onScopeDispose, watch, toRefs } from 'vue';
import type { Ref } from 'vue';
import { defineStore } from 'pinia';
import { usePreferredColorScheme } from '@vueuse/core';
import { SetupStoreId } from '@/enum';
import { createThemeToken, initThemeSettings, addThemeVarsToHtml, toggleCssDarkMode, getAntdTheme } from './shared';

/**
 * theme store
 */
export const useThemeStore = defineStore(SetupStoreId.Theme, () => {
  const scope = effectScope();
  const osTheme = usePreferredColorScheme();

  /**
   * theme settings
   */
  const settings: Ref<App.Theme.ThemeSetting> = ref(initThemeSettings());

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

  /**
   * theme colors
   */
  const themeColors = computed(() => {
    const { themeColor, otherColor, isCustomizeInfoColor } = settings.value;
    const colors: App.Theme.ThemeColor = {
      primary: themeColor,
      ...otherColor,
      info: isCustomizeInfoColor ? otherColor.info : themeColor
    };
    return colors;
  });

  /**
   * update theme colors
   * @param key theme color key
   * @param color theme color
   */
  function updateThemeColors(key: App.Theme.ThemeColorKey, color: string) {
    if (key === 'primary') {
      settings.value.themeColor = color;
    } else {
      settings.value.otherColor[key] = color;
    }
  }

  /**
   * setup theme vars to html
   */
  function setupThemeVarsToHtml() {
    const { themeTokens, darkThemeTokens } = createThemeToken(themeColors.value);
    addThemeVarsToHtml(themeTokens, darkThemeTokens);
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

    // themeColors change, update css vars
    watch(
      themeColors,
      () => {
        setupThemeVarsToHtml();
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

  return {
    ...toRefs(settings.value),
    darkMode,
    setThemeScheme,
    toggleThemeScheme,
    antdTheme,
    setThemeLayout,
    themeColors,
    updateThemeColors
  };
});
