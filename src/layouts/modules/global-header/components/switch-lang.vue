<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';

defineOptions({
  name: 'SwitchLang'
});

const app = useAppStore();

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
</script>

<template>
  <ADropdown placement="bottom">
    <AButton type="text" class="h-full">
      <div class="flex-y-center">
        <SvgIcon icon="heroicons:language" class="text-icon" />
      </div>
    </AButton>
    <template #overlay>
      <AMenu :selected-keys="[app.locale]">
        <AMenuItem v-for="option in options" :key="option.key" @click="app.changeLocale(option.key)">
          {{ option.label }}
        </AMenuItem>
      </AMenu>
    </template>
  </ADropdown>
</template>

<style scoped></style>
