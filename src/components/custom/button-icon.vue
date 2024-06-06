<script setup lang="ts">
import type { TooltipPlacement } from 'ant-design-vue/es/tooltip';
import { twMerge } from 'tailwind-merge';
defineOptions({
  name: 'ButtonIcon',
  inheritAttrs: false
});

interface Props {
  /** Button class */
  class?: string;
  /** Iconify icon name */
  icon?: string;
  /** Tooltip content */
  tooltipContent?: string;
  /** Tooltip placement */
  tooltipPlacement?: TooltipPlacement;
  /** Trigger tooltip on parent */
  triggerParent?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  class: 'h-36px text-icon',
  icon: '',
  tooltipContent: '',
  tooltipPlacement: 'bottom',
  triggerParent: false
});

function getPopupContainer(triggerNode: HTMLElement) {
  return props.triggerParent ? triggerNode.parentElement! : document.body;
}

const DEFAULT_CLASS = 'h-[36px] text-icon';
</script>

<template>
  <ATooltip :placement="tooltipPlacement" :get-popup-container="getPopupContainer" :title="tooltipContent">
    <AButton type="text" :class="twMerge(DEFAULT_CLASS, props.class)" v-bind="$attrs">
      <div class="flex-center gap-8px">
        <slot>
          <SvgIcon :icon="icon" />
        </slot>
      </div>
    </AButton>
  </ATooltip>
</template>

<style scoped></style>
