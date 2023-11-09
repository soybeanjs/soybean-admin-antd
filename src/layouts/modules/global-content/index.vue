<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { useRouteStore } from '@/store/modules/route';

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

const appStore = useAppStore();
const routeStore = useRouteStore();
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <Transition
      enter-active-class="animate-fade-in animate-duration-750"
      leave-active-class="animate-fade-out animate-duration-750"
      mode="out-in"
    >
      <KeepAlive :include="routeStore.cacheRoutes">
        <component
          :is="Component"
          v-if="appStore.reloadFlag"
          :key="route.path"
          :class="{ 'p-16px': showPadding }"
          class="flex-grow bg-layout transition-300"
        />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>

<style></style>
