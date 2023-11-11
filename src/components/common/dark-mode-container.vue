<script setup lang="ts">
defineOptions({ name: 'DarkModeContainer' });

interface Props {
  inverted?: boolean;
}

defineProps<Props>();
</script>

<template>
  <div
    class="bg-container text-base_text transition-300"
    :class="{ 'bg-inverted text-white text-opacity-88': inverted }"
  >
    <slot></slot>
  </div>
</template>

<style scoped></style>
