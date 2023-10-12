<script setup lang="ts">
defineOptions({
  name: 'Tooltip'
});
</script>

<template>
  <div class="relative">
    <slot></slot>
    <div
      class="absolute z-10 hidden w-32 p-2 text-xs text-white bg-gray-800 rounded shadow-lg top-0 left-0 -mt-8 -ml-8"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>

<style scoped></style>
