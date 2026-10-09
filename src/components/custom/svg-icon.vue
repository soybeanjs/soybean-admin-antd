<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue';
import type { Component } from 'vue';
import { Icon } from '@iconify/vue';

defineOptions({ name: 'SvgIcon', inheritAttrs: false });

/**
 * Props
 *
 * - Support iconify and local svg icon
 * - If icon and localIcon are passed at the same time, localIcon will be rendered first
 */
interface Props {
  /** Iconify icon name */
  icon?: string;
  /** Local svg icon name */
  localIcon?: string;
}

const props = defineProps<Props>();

// Vue's useId is unique within the app and stable across SSR hydration.
const svgInstanceId = useId();

const attrs = useAttrs();

const bindAttrs = computed<{ class: string; style: string }>(() => ({
  class: (attrs.class as string) || '',
  style: (attrs.style as string) || ''
}));

const localIconModules = import.meta.glob<Component>('../../assets/svg-icon/**/*.svg', {
  eager: true,
  import: 'default',
  query: '?component'
});

// Keep the previous sprite's directory-name convention for nested local icons.
const localIcons = new Map(
  Object.entries(localIconModules).map(([file, component]) => [
    file.replace('../../assets/svg-icon/', '').replace(/\.svg$/, '').replaceAll('/', '-'),
    component
  ])
);

const localIconComponent = computed(() => localIcons.get(props.localIcon || 'no-icon') || localIcons.get('no-icon'));

/** If localIcon is passed, render localIcon first */
const renderLocalIcon = computed(() => props.localIcon || !props.icon);
</script>

<template>
  <template v-if="renderLocalIcon">
    <svg aria-hidden="true" width="1em" height="1em" fill="currentColor" v-bind="bindAttrs">
      <!-- Keep each SVG's own fill, stroke and viewBox while inheriting the icon size and color. -->
      <component :is="localIconComponent" :data-svg-id="svgInstanceId" width="100%" height="100%" />
    </svg>
  </template>
  <template v-else>
    <Icon v-if="icon" :icon="icon" v-bind="bindAttrs" />
  </template>
</template>

<style scoped></style>
