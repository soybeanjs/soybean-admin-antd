<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';

defineOptions({
  name: 'GlobalContent'
});

interface Props {
  /**
   * show padding for content
   */
  showPadding?: boolean;
}

withDefaults(defineProps<Props>(), {
  showPadding: true
});

const app = useAppStore();
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <component
      :is="Component"
      v-if="app.reloadFlag"
      :key="route.path"
      :class="{ 'p-16px': showPadding }"
      class="flex-grow bg-layout transition-300"
    />
  </RouterView>
</template>

<style scoped></style>
