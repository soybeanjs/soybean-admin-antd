<script setup lang="ts">
import { SimpleScrollbar } from '@sa/materials';
import BaseMenu from './base-menu.vue';

defineOptions({
  name: 'VerticalMenu'
});

interface Props {
  darkTheme?: boolean;
}

defineProps<Props>();
</script>

<template>
  <SimpleScrollbar class="flex-1-hidden">
    <BaseMenu :dark-theme="darkTheme" />
  </SimpleScrollbar>
</template>

<style scoped></style>
