import { ref, computed, effectScope, onScopeDispose, watch, toRefs } from 'vue';
import type { Ref } from 'vue';
import { defineStore } from 'pinia';
import { usePreferredColorScheme, useEventListener } from '@vueuse/core';
import { SetupStoreId } from '@/enum';
import { localStg } from '@/utils/storage';
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
   * reset store
   */
  function resetStore() {
    const themeStore = useThemeStore();

    themeStore.$reset();
  }

  /**
   * theme colors
   */
  const themeColors = computed(() => {
    const { themeColor, otherColor, isInfoFollowPrimary } = settings.value;
    const colors: App.Theme.ThemeColor = {
      primary: themeColor,
      ...otherColor,
      info: isInfoFollowPrimary ? themeColor : otherColor.info
    };
    return colors;
  });

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
  const antdTheme = computed(() => getAntdTheme(themeColors.value, darkMode.value));

  /**
   * settings json
   * @description it is for copy settings
   */
  const settingsJson = computed(() => JSON.stringify(settings.value));

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
   * set theme layout
   * @param mode theme layout mode
   */
  function setThemeLayout(mode: UnionKey.ThemeLayoutMode) {
    settings.value.layout.mode = mode;
  }

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

  /**
   * cache theme settings
   */
  function cacheThemeSettings() {
    const isProd = import.meta.env.PROD;

    if (!isProd) return;

    localStg.set('themeSettings', settings.value);
  }

  // cache theme settings when page is closed or refreshed
  useEventListener(window, 'beforeunload', () => {
    cacheThemeSettings();
  });

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
    resetStore,
    settingsJson,
    darkMode,
    themeColors,
    antdTheme,
    toggleThemeScheme,
    setThemeScheme,
    updateThemeColors,
    setThemeLayout
  };
});
