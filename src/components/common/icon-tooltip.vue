<script lang="ts" setup>
import { computed, useSlots } from 'vue';
import type { TooltipPlacement } from 'ant-design-vue/es/tooltip';

defineOptions({ name: 'IconTooltip' });

interface Props {
  icon?: string;
  localIcon?: string;
  desc?: string;
  placement?: TooltipPlacement;
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'mdi-help-circle',
  localIcon: '',
  desc: '',
  placement: 'top'
});

const slots = useSlots();

const hasCustomTrigger = computed(() => Boolean(slots.trigger));

if (!hasCustomTrigger.value && !props.icon && !props.localIcon) {
  throw new Error('icon or localIcon is required when no custom trigger slot is provided');
}
</script>

<template>
  <ATooltip :placement="placement">
    <template #title>
      <slot>
        <span>{{ desc }}</span>
      </slot>
    </template>
    <slot name="trigger">
      <div class="cursor-pointer">
        <SvgIcon :icon="icon" :local-icon="localIcon" />
      </div>
    </slot>
  </ATooltip>
</template>
