<script setup lang="ts">
import { $t } from '@/locales';

defineOptions({
  name: 'LangSwitch'
});

interface Props {
  lang: App.I18n.LangType;
  langOptions: App.I18n.LangOption[];
}

defineProps<Props>();

type Emits = {
  (e: 'changeLang', lang: App.I18n.LangType): void;
};

const emits = defineEmits<Emits>();

function changeLang(lang: App.I18n.LangType) {
  emits('changeLang', lang);
}
</script>

<template>
  <ADropdown placement="bottom">
    <ButtonIcon :tooltip-content="$t('icon.lang')" tooltip-placement="left">
      <SvgIcon icon="heroicons:language" />
    </ButtonIcon>
    <template #overlay>
      <AMenu :selected-keys="[lang]">
        <AMenuItem v-for="option in langOptions" :key="option.key" @click="changeLang(option.key)">
          {{ option.label }}
        </AMenuItem>
      </AMenu>
    </template>
  </ADropdown>
</template>

<style scoped></style>
