<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface';
import type { RouteKey } from '@elegant-router/types';
import { useAppStore } from '@/store/modules/app';
import { useRouteStore } from '@/store/modules/route';
import { useRouterPush } from '@/hooks/common/router';
import { getSelectedMenuKeyPath } from './shared';

defineOptions({
  name: 'VerticalMenu'
});

const route = useRoute();
const app = useAppStore();
const routeStore = useRouteStore();
const { routerPushByKey } = useRouterPush();

const selectedKeys = computed(() => {
  const { hideInMenu, activeMenu } = route.meta;
  const name = route.name as string;

  const routeName = (hideInMenu ? activeMenu : name) || name;

  return [routeName];
});

const openKeys = computed(() => {
  const [selectedKey] = selectedKeys.value;

  if (!selectedKey) {
    return [];
  }

  return getSelectedMenuKeyPath(selectedKey, routeStore.antdMenus);
});

function handleClickMenu(menuInfo: MenuInfo) {
  const routeKey = menuInfo.key as RouteKey;

  routerPushByKey(routeKey);
}
</script>

<template>
  <div class="menu-wrapper flex-1-hidden">
    <div class="h-full overflow-y-auto">
      <AMenu
        mode="inline"
        :inline-collapsed="app.siderCollapse"
        :items="routeStore.antdMenus"
        :selected-keys="selectedKeys"
        :open-keys="openKeys"
        class="menu w-full"
        @click="handleClickMenu"
      />
    </div>
  </div>
</template>

<style scoped>
.menu-wrapper :deep(.ant-menu) {
  --at-apply: border-inline-none transition-300;
}

.menu-wrapper :deep(.ant-menu-light) {
  --at-apply: bg-container;
}

.menu-wrapper :deep(.ant-menu-inline-collapsed > .ant-menu-item) {
  padding-inline: calc(50% - 14px);
}

.menu-wrapper :deep(.ant-menu-inline-collapsed .ant-menu-submenu-title) {
  padding-inline: calc(50% - 14px);
}
</style>
