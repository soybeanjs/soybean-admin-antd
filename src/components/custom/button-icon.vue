<script setup lang="ts">
import { computed } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import type { TooltipPlacement } from 'ant-design-vue/es/tooltip';

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

interface ButtonProps {
  className: string;
}

const [DefineButton, Button] = createReusableTemplate<ButtonProps>();

const cls = computed(() => {
  let clsStr = props.class;

  if (!clsStr.includes('h-')) {
    clsStr += ' h-36px';
  }

  if (!clsStr.includes('text-')) {
    clsStr += ' text-icon';
  }

  return clsStr;
});

function getPopupContainer(triggerNode: HTMLElement) {
  return props.triggerParent ? triggerNode.parentElement! : document.body;
}
</script>

<template>
  <!-- define component start: Button -->
  <DefineButton v-slot="{ $slots, className }">
    <AButton type="text" :class="className">
      <div class="flex-center gap-8px">
        <component :is="$slots.default" />
      </div>
    </AButton>
  </DefineButton>
  <!-- define component end: Button -->

  <ATooltip
    v-if="tooltipContent"
    :placement="tooltipPlacement"
    :get-popup-container="getPopupContainer"
    :title="tooltipContent"
  >
    <Button :class-name="cls" v-bind="$attrs">
      <slot>
        <SvgIcon :icon="icon" />
      </slot>
    </Button>
  </ATooltip>
  <Button v-else :class-name="cls" v-bind="$attrs">
    <slot>
      <SvgIcon :icon="icon" />
    </slot>
  </Button>
</template>

<style scoped></style>
