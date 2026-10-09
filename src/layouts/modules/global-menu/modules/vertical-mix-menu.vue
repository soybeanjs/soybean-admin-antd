<script setup lang="ts">
import { computed } from 'vue';
import type { RouteKey } from '@elegant-router/types';
import { useBoolean } from '@sa/hooks';
import { SimpleScrollbar } from '@sa/materials';
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface';
import { GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useRouteStore } from '@/store/modules/route';
import { useThemeStore } from '@/store/modules/theme';
import { useRouterPush } from '@/hooks/common/router';
import { useMenu, useMixMenuContext } from '../context';
import GlobalLogo from '../../global-logo/index.vue';
import FirstLevelMenu from '../components/first-level-menu.vue';

defineOptions({
  name: 'VerticalMixMenu'
});

const appStore = useAppStore();
const themeStore = useThemeStore();
const routeStore = useRouteStore();
const { routerPushByKeyWithMetaQuery } = useRouterPush();
const { bool: drawerVisible, setBool: setDrawerVisible } = useBoolean();
const {
  firstLevelMenus,
  secondLevelMenus,
  activeFirstLevelMenuKey,
  isActiveFirstLevelMenuHasChildren,
  getActiveFirstLevelMenuKey,
  handleSelectFirstLevelMenu
} = useMixMenuContext('VerticalMixMenu');
const { selectedKey } = useMenu();

const inverted = computed(() => !themeStore.darkMode && themeStore.sider.inverted);

const menuTheme = computed(() => (inverted.value ? 'dark' : 'light'));

const hasChildMenus = computed(() => secondLevelMenus.value.length > 0);

const showDrawer = computed(() => hasChildMenus.value && (drawerVisible.value || appStore.mixSiderFixed));

function handleSelectMenu(key: RouteKey) {
  handleSelectFirstLevelMenu(key);

  if (isActiveFirstLevelMenuHasChildren.value) {
    setDrawerVisible(true);
  }
}

function handleResetActiveMenu() {
  setDrawerVisible(false);

  if (!appStore.mixSiderFixed) {
    getActiveFirstLevelMenuKey();
  }
}

const openKeys = computed(() => {
  if (appStore.siderCollapse || !selectedKey.value) return [];

  return routeStore.getSelectedMenuKeyPath(selectedKey.value);
});

function handleClickMenu(menuInfo: MenuInfo) {
  const key = menuInfo.key as RouteKey;

  routerPushByKeyWithMetaQuery(key);
}
</script>

<template>
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <div class="h-full flex" @mouseleave="handleResetActiveMenu">
      <FirstLevelMenu
        :menus="firstLevelMenus"
        :active-menu-key="activeFirstLevelMenuKey"
        :inverted="inverted"
        :sider-collapse="appStore.siderCollapse"
        :dark-mode="themeStore.darkMode"
        :theme-color="themeStore.themeColor"
        @select="handleSelectMenu"
        @toggle-sider-collapse="appStore.toggleSiderCollapse"
      >
        <GlobalLogo :show-title="false" :style="{ height: themeStore.header.height + 'px' }" />
      </FirstLevelMenu>
      <div
        class="relative h-full transition-width-300"
        :style="{ width: appStore.mixSiderFixed && hasChildMenus ? themeStore.sider.mixChildMenuWidth + 'px' : '0px' }"
      >
        <DarkModeContainer
          class="absolute-lt h-full flex-col-stretch nowrap-hidden shadow-sm transition-all-300"
          :inverted="inverted"
          :style="{ width: showDrawer ? themeStore.sider.mixChildMenuWidth + 'px' : '0px' }"
        >
          <header class="flex-y-center justify-between px-12px" :style="{ height: themeStore.header.height + 'px' }">
            <h2 class="text-16px text-primary font-bold">{{ $t('system.title') }}</h2>
            <PinToggler
              :pin="appStore.mixSiderFixed"
              :class="{ 'text-white:88 !hover:text-white': inverted }"
              @click="appStore.toggleMixSiderFixed"
            />
          </header>
          <SimpleScrollbar class="menu-wrapper" :class="{ 'select-menu': !inverted }">
            <AMenu
              mode="inline"
              :theme="menuTheme"
              :items="secondLevelMenus"
              :selected-keys="[selectedKey]"
              :open-keys="openKeys"
              class="size-full transition-300 border-0!"
              :class="{ 'bg-container!': !inverted }"
              @click="handleClickMenu"
            />
          </SimpleScrollbar>
        </DarkModeContainer>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped></style>
