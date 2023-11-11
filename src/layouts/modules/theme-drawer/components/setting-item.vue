<script setup lang="ts">
defineOptions({
  name: 'SettingItem'
});

interface Props {
  /**
   * label
   */
  label: string;
}

defineProps<Props>();
</script>

<template>
  <div class="flex-y-center justify-between w-full">
    <span>{{ label }}</span>
    <slot></slot>
  </div>
</template>

<style scoped></style>
