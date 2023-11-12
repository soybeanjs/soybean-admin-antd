<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { createReusableTemplate } from '@vueuse/core';
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface';
import { transformColorWithOpacity } from '@sa/utils';
import { SimpleScrollbar } from '@sa/materials';
import { useBoolean } from '@sa/hooks';
import type { RouteKey } from '@elegant-router/types';
import { useAppStore } from '@/store/modules/app';
import { useRouteStore } from '@/store/modules/route';
import { useThemeStore } from '@/store/modules/theme';
import { useRouterPush } from '@/hooks/common/router';

defineOptions({
  name: 'VerticalMixMenu'
});

const route = useRoute();
const appStore = useAppStore();
const themeStore = useThemeStore();
const routeStore = useRouteStore();
const { routerPushByKey } = useRouterPush();
const { bool: drawerVisible, setBool: setDrawerVisible } = useBoolean();

interface MixMenuItemProps {
  /**
   *  menu item label
   */
  label: App.Global.Menu['label'];
  /**
   *  menu item icon
   */
  icon: App.Global.Menu['icon'];
  /**
   * active menu item
   */
  active: boolean;
  /**
   * mini size
   */
  isMini: boolean;
}
const [DefineMixMenuItem, MixMenuItem] = createReusableTemplate<MixMenuItemProps>();

const activeMenuKey = ref('');

function setActiveMenuKey(key: string) {
  activeMenuKey.value = key;
}

function getActiveMenuKey() {
  const { hideInMenu, activeMenu } = route.meta;
  const name = route.name as string;

  const routeName = (hideInMenu ? activeMenu : name) || name;

  const [firstLevelRouteName] = routeName.split('_');

  setActiveMenuKey(firstLevelRouteName);
}

function handleClickMixMenu(menu: App.Global.Menu) {
  setActiveMenuKey(menu.key);

  if (menu.children?.length) {
    setDrawerVisible(true);
  } else {
    routerPushByKey(menu.routeKey);
  }
}

function handleResetActiveMenu() {
  getActiveMenuKey();
  setDrawerVisible(false);
}

const siderInverted = computed(() => !themeStore.darkMode && themeStore.sider.inverted);

const menuTheme = computed(() => (siderInverted.value ? 'dark' : 'light'));

const menus = computed(() => routeStore.menus.find(menu => menu.key === activeMenuKey.value)?.children || []);

const showDrawer = computed(() => (drawerVisible.value && menus.value.length) || appStore.mixSiderFixed);

const selectedKeys = computed(() => {
  const { hideInMenu, activeMenu } = route.meta;
  const name = route.name as string;

  const routeName = (hideInMenu ? activeMenu : name) || name;

  return [routeName];
});

const openKeys = computed(() => {
  const [selectedKey] = selectedKeys.value;

  if (!selectedKey) return [];

  return routeStore.getSelectedMenuKeyPath(selectedKey);
});

const selectedBgColor = computed(() => {
  const { darkMode, themeColor } = themeStore;

  const light = transformColorWithOpacity(themeColor, 0.1, '#ffffff');
  const dark = transformColorWithOpacity(themeColor, 0.3, '#000000');

  return darkMode ? dark : light;
});

function handleClickMenu(menuInfo: MenuInfo) {
  const routeKey = menuInfo.key as RouteKey;

  routerPushByKey(routeKey);
}

watch(
  () => route.name,
  () => {
    getActiveMenuKey();
  },
  { immediate: true }
);
</script>

<template>
  <!-- define component: MixMenuItem -->
  <DefineMixMenuItem v-slot="{ label, icon, active, isMini }">
    <div
      class="flex-vertical-center mx-4px mb-6px py-8px px-4px rounded-8px bg-transparent transition-300 cursor-pointer hover:bg-[rgb(0,0,0,0.08)]"
      :class="{
        'text-primary selected-mix-menu': active,
        'text-white:65 hover:text-white': siderInverted,
        '!text-white !bg-primary': active && siderInverted
      }"
    >
      <component :is="icon" :class="[isMini ? 'text-icon-small' : 'text-icon-large']" />
      <p
        class="w-full text-center ellipsis-text text-12px transition-height-300"
        :class="[isMini ? 'h-0 pt-0' : 'h-24px pt-4px']"
      >
        {{ label }}
      </p>
    </div>
  </DefineMixMenuItem>
  <div class="flex h-full" @mouseleave="handleResetActiveMenu">
    <div class="flex-1-hidden flex-vertical-stretch h-full">
      <slot></slot>
      <SimpleScrollbar>
        <MixMenuItem
          v-for="menu in routeStore.menus"
          :key="menu.key"
          :label="menu.label"
          :icon="menu.icon"
          :active="menu.key === activeMenuKey"
          :is-mini="appStore.siderCollapse"
          @click="handleClickMixMenu(menu)"
        />
      </SimpleScrollbar>
      <MenuToggler
        arrow-icon
        :collapsed="appStore.siderCollapse"
        :class="{ 'text-white:88 !hover:text-white': siderInverted }"
        @click="appStore.toggleSiderCollapse"
      />
    </div>
    <div
      class="relative h-full transition-width-300"
      :style="{ width: appStore.mixSiderFixed ? themeStore.sider.mixChildMenuWidth + 'px' : '0px' }"
    >
      <DarkModeContainer
        class="absolute-lt flex-vertical-stretch h-full nowrap-hidden transition-width-300 shadow-sm"
        :inverted="siderInverted"
        :style="{ width: showDrawer ? themeStore.sider.mixChildMenuWidth + 'px' : '0px' }"
      >
        <header class="flex-y-center justify-between" :style="{ height: themeStore.header.height + 'px' }">
          <h2 class="text-primary pl-8px text-16px font-bold">{{ $t('system.title') }}</h2>
          <PinToggler
            :pin="appStore.mixSiderFixed"
            :class="{ 'text-white:88 !hover:text-white': siderInverted }"
            @click="appStore.toggleMixSiderFixed"
          />
        </header>
        <SimpleScrollbar class="menu-wrapper flex-1-hidden" :class="{ 'select-menu': !siderInverted }">
          <AMenu
            mode="inline"
            :theme="menuTheme"
            :items="menus"
            :inline-indent="18"
            :selected-keys="selectedKeys"
            :open-keys="openKeys"
            class="wh-full border-0! transition-300"
            :class="{ 'bg-container!': !siderInverted }"
            @click="handleClickMenu"
          />
        </SimpleScrollbar>
      </DarkModeContainer>
    </div>
  </div>
</template>

<style scoped>
.selected-mix-menu {
  background-color: v-bind(selectedBgColor);
}

.menu-wrapper :deep(.ant-menu-inline .ant-menu-item) {
  width: calc(100% - 16px);
  margin-inline: 8px;
}

.menu-wrapper :deep(.ant-menu-sub) {
  background: transparent !important;
}

.select-menu :deep(.ant-menu-inline .ant-menu-item-selected) {
  background-color: v-bind(selectedBgColor);
}
</style>
