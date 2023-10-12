<script setup lang="ts">
defineOptions({
  name: 'GlobalContent'
});

interface Props {
  /** 显示padding */
  showPadding?: boolean;
}

withDefaults(defineProps<Props>(), {
  showPadding: true
});
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <component
      :is="Component"
      :key="route.path"
      :class="{ 'p-16px': showPadding }"
      class="flex-grow bg-layout transition-all-300"
    />
  </RouterView>
</template>

<style scoped></style>
