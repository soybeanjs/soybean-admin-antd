<script setup lang="ts">
defineOptions({
  name: 'FullScreen'
});

interface Props {
  full?: boolean;
}

defineProps<Props>();
</script>

<template>
  <AButton type="text" class="h-full text-icon">
    <icon-gridicons-fullscreen-exit v-if="full" />
    <icon-gridicons-fullscreen v-else />
  </AButton>
</template>

<style scoped></style>
