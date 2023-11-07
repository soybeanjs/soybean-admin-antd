<script setup lang="ts">
defineOptions({
  name: 'ReloadButton'
});

interface Props {
  loading?: boolean;
}

defineProps<Props>();
</script>

<template>
  <AButton type="text" class="h-full text-icon">
    <icon-ant-design:reload-outlined :class="{ 'animate-spin': loading }" />
  </AButton>
</template>

<style scoped></style>
