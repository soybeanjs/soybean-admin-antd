<script setup lang="ts">
import type { RouteKey } from '@elegant-router/types';
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface';
import { SimpleScrollbar } from '@sa/materials';
import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useRouterPush } from '@/hooks/common/router';
import { useMenu, useMixMenuContext } from '../../../context';

defineOptions({
  name: 'ReversedHorizontalMixMenu'
});

const appStore = useAppStore();

const { firstLevelMenus, childLevelMenus, setActiveFirstLevelMenuKey, isActiveFirstLevelMenuHasChildren } =
  useMixMenuContext();

const { selectedKeys, openKeys } = useMenu();

const { routerPushByKeyWithMetaQuery } = useRouterPush();

function handleSelectMixMenu(menuInfo: MenuInfo) {
  const key = menuInfo.key as RouteKey;

  setActiveFirstLevelMenuKey(key);

  if (!isActiveFirstLevelMenuHasChildren.value) {
    routerPushByKeyWithMetaQuery(key);
  }
}

function handleClickMenu(menuInfo: MenuInfo) {
  const key = menuInfo.key as RouteKey;

  routerPushByKeyWithMetaQuery(key);
}
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <AMenu
      mode="horizontal"
      :selected-keys="selectedKeys"
      :items="firstLevelMenus"
      :inline-indent="18"
      class="horizontal-menu size-full transition-300 border-0!"
      @click="handleSelectMixMenu"
    />
  </Teleport>
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <SimpleScrollbar>
      <AMenu
        mode="inline"
        :items="childLevelMenus"
        :inline-collapsed="appStore.siderCollapse"
        :selected-keys="selectedKeys"
        :inline-indent="18"
        :open-keys="openKeys"
        class="size-full bg-container transition-300 border-0!"
        @click="handleClickMenu"
      />
    </SimpleScrollbar>
  </Teleport>
</template>

<style scoped></style>
