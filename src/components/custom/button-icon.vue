<script setup lang="ts">
import type { TooltipPlacement } from 'ant-design-vue/es/tooltip';

defineOptions({
  name: 'ButtonIcon'
});

interface Props {
  /**
   * button class
   */
  cls?: string;
  /**
   * iconify icon name
   */
  icon?: string;
  /**
   * tooltip content
   */
  tooltipContent?: string;
  /**
   * tooltip placement
   */
  tooltipPlacement?: TooltipPlacement;
  /**
   * get popup container
   * @param triggerNode
   */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
}

withDefaults(defineProps<Props>(), {
  cls: 'h-full text-icon',
  icon: '',
  tooltipContent: '',
  tooltipPlacement: 'bottom',
  getPopupContainer: () => document.body
});
</script>

<template>
  <ATooltip
    v-if="tooltipContent"
    :placement="tooltipPlacement"
    :get-popup-container="getPopupContainer"
    :title="tooltipContent"
  >
    <AButton type="text" :class="cls">
      <slot>
        <SvgIcon :icon="icon" />
      </slot>
    </AButton>
  </ATooltip>
  <AButton v-else type="text" :class="cls">
    <slot>
      <SvgIcon :icon="icon" />
    </slot>
  </AButton>
</template>

<style scoped></style>
