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
    <span class="text-base_text">{{ label }}</span>
    <slot></slot>
  </div>
</template>

<style scoped></style>
