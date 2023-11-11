<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface';
import type { RouteKey } from '@elegant-router/types';
import { useAppStore } from '@/store/modules/app';
import { useRouteStore } from '@/store/modules/route';
import { useRouterPush } from '@/hooks/common/router';

defineOptions({
  name: 'VerticalMenu'
});

interface Props {
  darkTheme?: boolean;
}

const props = defineProps<Props>();

const route = useRoute();
const appStore = useAppStore();
const routeStore = useRouteStore();
const { routerPushByKey } = useRouterPush();

const menuTheme = computed(() => (props.darkTheme ? 'dark' : 'light'));

const selectedKeys = computed(() => {
  const { hideInMenu, activeMenu } = route.meta;
  const name = route.name as string;

  const routeName = (hideInMenu ? activeMenu : name) || name;

  return [routeName];
});

const openKeys = computed(() => {
  if (appStore.siderCollapse) return [];

  const [selectedKey] = selectedKeys.value;

  if (!selectedKey) return [];

  return routeStore.getSelectedMenuKeyPath(selectedKey);
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
        :theme="menuTheme"
        :items="routeStore.menus"
        :selected-keys="selectedKeys"
        :open-keys="openKeys"
        :inline-collapsed="appStore.siderCollapse"
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
