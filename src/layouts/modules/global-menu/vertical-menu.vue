<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { useRouteStore } from '@/store/modules/route';

defineOptions({
  name: 'VerticalMenu'
});

const app = useAppStore();
const route = useRouteStore();
</script>

<template>
  <div class="menu-wrapper flex-1-hidden">
    <div class="h-full overflow-y-auto">
      <AMenu mode="inline" :inline-collapsed="app.siderCollapse" :items="route.antdMenus" class="menu w-full" />
    </div>
  </div>
</template>

<style scoped>
.menu-wrapper :deep(.ant-menu) {
  border-inline: none;
}

.menu-wrapper :deep(.ant-menu-light) {
  background-color: rgb(var(--container-bg-color));
}
</style>
