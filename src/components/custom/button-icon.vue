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
}

withDefaults(defineProps<Props>(), {
  cls: 'h-full text-icon',
  icon: '',
  tooltipContent: '',
  tooltipPlacement: 'bottom'
});
</script>

<template>
  <ATooltip v-if="tooltipContent" :placement="tooltipPlacement" :title="tooltipContent">
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
