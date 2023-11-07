import { ref, nextTick } from 'vue';
import { defineStore } from 'pinia';
import { useBoolean } from '@sa/hooks';
import { SetupStoreId } from '@/enum';
import { setLocale } from '@/locales';
import { localStg } from '@/utils/storage';

export const useAppStore = defineStore(SetupStoreId.App, () => {
  const { bool: reloadFlag, setBool: setReloadFlag } = useBoolean(true);
  const { bool: fullContent, toggle: toggleFullContent } = useBoolean();
  const { bool: siderCollapse, toggle: toggleSiderCollapse } = useBoolean();

  /**
   * reload page
   * @param duration duration time
   */
  async function reloadPage(duration = 0) {
    setReloadFlag(false);

    await nextTick();

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

  return {
    reloadFlag,
    reloadPage,
    fullContent,
    toggleFullContent,
    siderCollapse,
    toggleSiderCollapse,
    locale,
    localeOptions,
    changeLocale
  };
});
