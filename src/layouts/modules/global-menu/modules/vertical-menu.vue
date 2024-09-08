<script setup lang="ts">
import { SimpleScrollbar } from '@sa/materials';
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface';
import type { RouteKey } from '@elegant-router/types';
import { useAppStore } from '@/store/modules/app';
import { useRouterPush } from '@/hooks/common/router';
import { GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useRouteStore } from '@/store/modules/route';
import { useMenu } from '../../../context';

defineOptions({
  name: 'VerticalMenu'
});

const appStore = useAppStore();

const { routerPushByKeyWithMetaQuery } = useRouterPush();

const routeStore = useRouteStore();

const { selectedKeys, openKeys } = useMenu();

function handleClickMenu(menuInfo: MenuInfo) {
  const key = menuInfo.key as RouteKey;

  routerPushByKeyWithMetaQuery(key);
}
</script>

<template>
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <SimpleScrollbar>
      <AMenu
        mode="inline"
        :items="routeStore.menus"
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
