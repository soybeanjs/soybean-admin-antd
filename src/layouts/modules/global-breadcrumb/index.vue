<script setup lang="ts">
import type { RouteKey } from '@elegant-router/types';
import { useRouteStore } from '@/store/modules/route';
import { useRouterPush } from '@/hooks/common/router';

defineOptions({
  name: 'GlobalBreadcrumb'
});

const routeStore = useRouteStore();
const { routerPushByKey } = useRouterPush();

function handleClickMenu(key: RouteKey) {
  routerPushByKey(key);
}
</script>

<template>
  <ABreadcrumb>
    <ABreadcrumbItem v-for="item in routeStore.breadcrumbs" :key="item.key">
      <div class="i-flex-y-center align-middle">
        <component :is="item.icon" class="mr-4px text-icon" />
        {{ item.label }}
      </div>
      <template v-if="item.children?.length" #overlay>
        <AMenu>
          <AMenuItem v-for="option in item.children" :key="option.key" @click="handleClickMenu(option.routeKey)">
            <div class="flex-y-center gap-12px">
              <component :is="option.icon" />
              <span>{{ option.label }}</span>
            </div>
          </AMenuItem>
        </AMenu>
      </template>
    </ABreadcrumbItem>
  </ABreadcrumb>
</template>

<style scoped></style>
