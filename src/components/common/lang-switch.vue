<script setup lang="ts">
import { computed } from 'vue';
import type { TooltipPlacement } from 'ant-design-vue/es/tooltip';
import { $t } from '@/locales';

defineOptions({
  name: 'LangSwitch'
});

interface Props {
  /**
   * current language
   */
  lang: App.I18n.LangType;
  /**
   * language options
   */
  langOptions: App.I18n.LangOption[];
  /**
   * show tooltip
   */
  showTooltip?: boolean;
  /**
   * tooltip placement
   */
  tooltipPlacement?: TooltipPlacement;
}

const props = withDefaults(defineProps<Props>(), {
  showTooltip: true,
  tooltipPlacement: 'left'
});

type Emits = {
  (e: 'changeLang', lang: App.I18n.LangType): void;
};

const emits = defineEmits<Emits>();

const tooltipContent = computed(() => {
  if (!props.showTooltip) return '';

  return $t('icon.lang');
});

function changeLang(lang: App.I18n.LangType) {
  emits('changeLang', lang);
}
</script>

<template>
  <ADropdown placement="bottom">
    <ButtonIcon :tooltip-content="tooltipContent" tooltip-placement="left">
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
