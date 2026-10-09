<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { RouteKey } from '@elegant-router/types';
import { SimpleScrollbar } from '@sa/materials';
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface';
import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useRouteStore } from '@/store/modules/route';
import { useThemeStore } from '@/store/modules/theme';
import { useRouterPush } from '@/hooks/common/router';
import { useMenu, useMixMenuContext } from '../context';

defineOptions({
  name: 'TopHybridHeaderFirst'
});

const route = useRoute();
const appStore = useAppStore();
const themeStore = useThemeStore();
const routeStore = useRouteStore();
const { routerPushByKeyWithMetaQuery } = useRouterPush();
const {
  firstLevelMenus,
  secondLevelMenus,
  activeFirstLevelMenuKey,
  handleSelectFirstLevelMenu,
  activeDeepestLevelMenuKey
} = useMixMenuContext('TopHybridHeaderFirst');
const { selectedKey } = useMenu();

const menuTheme = computed(() => (themeStore.darkMode ? 'dark' : 'light'));

/**
 * Handle first level menu select
 * @param key RouteKey
 */
function handleSelectMenu(key: RouteKey) {
  handleSelectFirstLevelMenu(key);

  // if there are second level menus, select the deepest one by default
  activeDeepestLevelMenuKey();
}

function handleHeaderClick(menuInfo: MenuInfo) {
  handleSelectMenu(menuInfo.key as RouteKey);
}

function handleSiderClick(menuInfo: MenuInfo) {
  routerPushByKeyWithMetaQuery(menuInfo.key as RouteKey);
}

const expandedKeys = ref<string[]>([]);

function updateExpandedKeys() {
  if (appStore.siderCollapse || !selectedKey.value) {
    expandedKeys.value = [];
    return;
  }
  expandedKeys.value = routeStore.getSelectedMenuKeyPath(selectedKey.value);
}

function handleOpenChange(keys: (string | number)[]) {
  expandedKeys.value = keys.map(key => String(key));
}

watch(
  () => route.name,
  () => {
    updateExpandedKeys();
  },
  { immediate: true }
);
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <AMenu
      mode="horizontal"
      :theme="menuTheme"
      :items="firstLevelMenus"
      :selected-keys="[activeFirstLevelMenuKey]"
      class="horizontal-menu size-full transition-300 border-0!"
      :style="{ lineHeight: themeStore.header.height + 'px' }"
      @click="handleHeaderClick"
    />
  </Teleport>
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <SimpleScrollbar class="menu-wrapper" :class="{ 'select-menu': !themeStore.darkMode }">
      <AMenu
        mode="inline"
        :theme="menuTheme"
        :items="secondLevelMenus"
        :selected-keys="[selectedKey]"
        :open-keys="expandedKeys"
        :inline-indent="18"
        class="size-full transition-300 border-0!"
        :class="{ 'bg-container!': !themeStore.darkMode }"
        @open-change="handleOpenChange"
        @click="handleSiderClick"
      />
    </SimpleScrollbar>
  </Teleport>
</template>

<style scoped></style>
