import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useBoolean } from '@sa/hooks';
import { SetupStoreId } from '@/enum';
import { setLocale } from '@/locales';
import { localStg } from '@/utils/storage';

export const useAppStore = defineStore(SetupStoreId.App, () => {
  const locale = ref<App.I18n.LangType>(localStg.get('lang') || 'zh-CN');

  function changeLocale(lang: App.I18n.LangType) {
    locale.value = lang;
    setLocale(lang);
    localStg.set('lang', lang);
  }

  const { bool: siderCollapse, toggle: toggleSiderCollapse } = useBoolean();

  return {
    locale,
    changeLocale,
    siderCollapse,
    toggleSiderCollapse
  };
});
