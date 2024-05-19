<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import type { MenuInfo, MenuMode } from 'ant-design-vue/es/menu/src/interface';
import { SimpleScrollbar } from '@sa/materials';
import { transformColorWithOpacity } from '@sa/utils';
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
  menus: App.Global.Menu[];
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

const siderCollapse = computed(() => themeStore.layout.mode === 'vertical' && appStore.siderCollapse);

const inlineCollapsed = computed(() => (props.mode === 'inline' ? siderCollapse.value : undefined));

const selectedKeys = computed(() => {
  const { hideInMenu, activeMenu } = route.meta;
  const name = route.name as string;

  const routeName = (hideInMenu ? activeMenu : name) || name;

  return [routeName];
});

const openKeys = computed(() => {
  if (isHorizontal.value || inlineCollapsed.value) return [];

  const [selectedKey] = selectedKeys.value;

  if (!selectedKey) return [];

  return routeStore.getSelectedMenuKeyPath(selectedKey);
});

const headerHeight = computed(() => `${themeStore.header.height}px`);

const selectedBgColor = computed(() => {
  const { darkMode, themeColor } = themeStore;

  const light = transformColorWithOpacity(themeColor, 0.1, '#ffffff');
  const dark = transformColorWithOpacity(themeColor, 0.3, '#000000');

  return darkMode ? dark : light;
});

function handleClickMenu(menuInfo: MenuInfo) {
  const key = menuInfo.key as RouteKey;

  const query = routeStore.getSelectedMenuMetaByKey(key) || {};

  routerPushByKey(key, { query });
}
</script>

<template>
  <SimpleScrollbar class="menu-wrapper" :class="{ 'select-menu': !darkTheme }">
    <AMenu
      :mode="mode"
      :theme="menuTheme"
      :items="menus"
      :selected-keys="selectedKeys"
      :open-keys="openKeys"
      :inline-collapsed="inlineCollapsed"
      :inline-indent="18"
      class="size-full transition-300 border-0!"
      :class="{ 'bg-container!': !darkTheme, 'horizontal-menu': isHorizontal }"
      @click="handleClickMenu"
    />
  </SimpleScrollbar>
</template>

<style lang="scss" scoped>
.menu-wrapper {
  :deep(.ant-menu-inline) {
    .ant-menu-item {
      width: calc(100% - 16px);
      margin-inline: 8px;
    }
  }

  :deep(.ant-menu-submenu-title) {
    width: calc(100% - 16px);
    margin-inline: 8px;
  }

  :deep(.ant-menu-inline-collapsed) {
    > .ant-menu-item {
      padding-inline: calc(50% - 14px);
    }

    .ant-menu-item-icon {
      vertical-align: -0.25em;
    }

    .ant-menu-submenu-title {
      padding-inline: calc(50% - 14px);
    }
  }

  :deep(.ant-menu-horizontal) {
    .ant-menu-item {
      display: flex;
      align-items: center;
    }

    .ant-menu-submenu-title {
      display: flex;
      align-items: center;
    }
  }
}

.select-menu {
  :deep(.ant-menu-inline) {
    .ant-menu-item-selected {
      background-color: v-bind(selectedBgColor);
    }
  }
}

.horizontal-menu {
  line-height: v-bind(headerHeight);
}
</style>
