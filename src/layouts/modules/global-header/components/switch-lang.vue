<script setup lang="ts">
import { ref } from 'vue';
import { setLocale } from '@/locales';
import { localStg } from '@/utils/storage';

defineOptions({
  name: 'SwitchLang'
});

const locale = ref<App.I18n.LangType>(localStg.get('lang') || 'zh-CN');

type LocaleOption = {
  label: string;
  key: App.I18n.LangType;
};

const options: LocaleOption[] = [
  {
    label: '中文',
    key: 'zh-CN'
  },
  {
    label: 'English',
    key: 'en'
  }
];

function handleSelect(key: App.I18n.LangType) {
  locale.value = key;
  setLocale(key);
  localStg.set('lang', key);
}
</script>

<template>
  <ADropdown placement="bottom">
    <AButton type="text" class="h-full">
      <div class="flex-y-center">
        <SvgIcon icon="heroicons:language" class="text-icon" />
      </div>
    </AButton>
    <template #overlay>
      <AMenu :selected-keys="[locale]">
        <AMenuItem v-for="option in options" :key="option.key" @click="handleSelect(option.key)">
          {{ option.label }}
        </AMenuItem>
      </AMenu>
    </template>
  </ADropdown>
</template>

<style scoped></style>
