<script setup lang="ts">
import Simplebar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';

defineOptions({
  name: 'SimpleScrollbar'
});
</script>

<template>
  <Simplebar class="h-full">
    <slot />
  </Simplebar>
</template>

<style scoped></style>
