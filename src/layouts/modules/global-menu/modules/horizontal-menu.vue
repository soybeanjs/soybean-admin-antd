<script setup lang="ts">
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface';
import type { RouteKey } from '@elegant-router/types';
import { GLOBAL_HEADER_MENU_ID } from '@/constants/app';
import { useRouterPush } from '@/hooks/common/router';
import { useRouteStore } from '@/store/modules/route';
import { useMenu } from '../../../context';

defineOptions({
  name: 'HorizontalMenu'
});

const { selectedKeys } = useMenu();

const routeStore = useRouteStore();

const { routerPushByKeyWithMetaQuery } = useRouterPush();

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
      :items="routeStore.menus"
      :inline-indent="18"
      class="horizontal-menu size-full transition-300 border-0!"
      @click="handleClickMenu"
    />
  </Teleport>
</template>

<style lang="scss" scoped></style>
