<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import type { MenuInfo, MenuMode } from 'ant-design-vue/es/menu/src/interface';
import type { RouteKey } from '@elegant-router/types';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useRouteStore } from '@/store/modules/route';
import { useRouterPush } from '@/hooks/common/router';

defineOptions({
  name: 'BaseMenu'
});

interface Props {
  darkTheme?: boolean;
  mode?: MenuMode;
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'inline'
});

const route = useRoute();
const appStore = useAppStore();
const themeStore = useThemeStore();
const routeStore = useRouteStore();
const { routerPushByKey } = useRouterPush();

const menuTheme = computed(() => (props.darkTheme ? 'dark' : 'light'));

const isHorizontal = computed(() => props.mode === 'horizontal');

const selectedKeys = computed(() => {
  const { hideInMenu, activeMenu } = route.meta;
  const name = route.name as string;

  const routeName = (hideInMenu ? activeMenu : name) || name;

  return [routeName];
});

const openKeys = computed(() => {
  if (isHorizontal.value || appStore.siderCollapse) return [];

  const [selectedKey] = selectedKeys.value;

  if (!selectedKey) return [];

  return routeStore.getSelectedMenuKeyPath(selectedKey);
});

const headerHeight = computed(() => `${themeStore.header.height}px`);

function handleClickMenu(menuInfo: MenuInfo) {
  const routeKey = menuInfo.key as RouteKey;

  routerPushByKey(routeKey);
}
</script>

<template>
  <AMenu
    :mode="mode"
    :theme="menuTheme"
    :items="routeStore.menus"
    :selected-keys="selectedKeys"
    :open-keys="openKeys"
    :inline-collapsed="appStore.siderCollapse"
    class="menu wh-full bg-container! border-0! transition-300"
    :class="{ 'horizontal-menu': isHorizontal }"
    @click="handleClickMenu"
  />
</template>

<style scoped>
.menu :deep(.ant-menu-inline-collapsed > .ant-menu-item) {
  padding-inline: calc(50% - 14px);
}

.menu :deep(.ant-menu-inline-collapsed .ant-menu-submenu-title) {
  padding-inline: calc(50% - 14px);
}

.horizontal-menu {
  line-height: v-bind(headerHeight);
}
</style>
