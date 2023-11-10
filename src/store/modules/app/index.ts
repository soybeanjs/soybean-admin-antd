import { ref, watch, effectScope, onScopeDispose } from 'vue';
import { defineStore } from 'pinia';
import { breakpointsTailwind, useBreakpoints, useTitle } from '@vueuse/core';
import { useBoolean } from '@sa/hooks';
import { SetupStoreId } from '@/enum';
import { router } from '@/router';
import { $t, setLocale } from '@/locales';
import { localStg } from '@/utils/storage';
import { useRouteStore } from '../route';
import { useTabStore } from '../tab';

export const useAppStore = defineStore(SetupStoreId.App, () => {
  const routeStore = useRouteStore();
  const tabStore = useTabStore();
  const scope = effectScope();
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const { bool: themeDrawerVisible, setTrue: openThemeDrawer, setFalse: closeThemeDrawer } = useBoolean();
  const { bool: reloadFlag, setBool: setReloadFlag } = useBoolean(true);
  const { bool: fullContent, toggle: toggleFullContent } = useBoolean();
  const { bool: siderCollapse, setBool: setSiderCollapse, toggle: toggleSiderCollapse } = useBoolean();

  /**
   * is mobile layout
   */
  const isMobile = breakpoints.smaller('sm');

  /**
   * reload page
   * @param duration duration time
   */
  async function reloadPage(duration = 0) {
    setReloadFlag(false);

    if (duration > 0) {
      await new Promise(resolve => {
        setTimeout(resolve, duration);
      });
    }

    setReloadFlag(true);
  }

  const locale = ref<App.I18n.LangType>(localStg.get('lang') || 'zh-CN');

  const localeOptions: App.I18n.LangOption[] = [
    {
      label: '中文',
      key: 'zh-CN'
    },
    {
      label: 'English',
      key: 'en'
    }
  ];

  function changeLocale(lang: App.I18n.LangType) {
    locale.value = lang;
    setLocale(lang);
    localStg.set('lang', lang);
  }

  /**
   * update document title by locale
   */
  function updateDocumentTitleByLocale() {
    const { i18nKey, title } = router.currentRoute.value.meta;

    const documentTitle = i18nKey ? $t(i18nKey) : title;

    useTitle(documentTitle);
  }

  // watch store
  scope.run(() => {
    // watch isMobile, if is mobile, collapse sider
    watch(
      isMobile,
      newValue => {
        if (newValue) {
          setSiderCollapse(true);
        }
      },
      { immediate: true }
    );

    // watch locale
    watch(locale, () => {
      updateDocumentTitleByLocale();
      routeStore.updateGlobalMenusByLocale();
      tabStore.updateTabsByLocale();
    });
  });

  /**
   * on scope dispose
   */
  onScopeDispose(() => {
    scope.stop();
  });

  return {
    themeDrawerVisible,
    openThemeDrawer,
    closeThemeDrawer,
    reloadFlag,
    reloadPage,
    fullContent,
    toggleFullContent,
    siderCollapse,
    setSiderCollapse,
    toggleSiderCollapse,
    locale,
    localeOptions,
    changeLocale,
    isMobile
  };
});
