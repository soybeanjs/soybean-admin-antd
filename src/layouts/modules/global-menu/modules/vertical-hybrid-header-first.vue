<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { RouteKey } from '@elegant-router/types';
import { useBoolean } from '@sa/hooks';
import { SimpleScrollbar } from '@sa/materials';
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface';
import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useRouteStore } from '@/store/modules/route';
import { useThemeStore } from '@/store/modules/theme';
import { useRouterPush } from '@/hooks/common/router';
import { useMenu, useMixMenuContext } from '../context';
import GlobalLogo from '../../global-logo/index.vue';
import FirstLevelMenu from '../components/first-level-menu.vue';

defineOptions({
  name: 'VerticalHybridHeaderFirst'
});

const route = useRoute();
const appStore = useAppStore();
const themeStore = useThemeStore();
const routeStore = useRouteStore();
const { routerPushByKeyWithMetaQuery } = useRouterPush();
const { bool: drawerVisible, setBool: setDrawerVisible } = useBoolean();
const {
  firstLevelMenus,
  activeFirstLevelMenuKey,
  handleSelectFirstLevelMenu,
  getActiveFirstLevelMenuKey,
  secondLevelMenus,
  activeSecondLevelMenuKey,
  isActiveSecondLevelMenuHasChildren,
  handleSelectSecondLevelMenu,
  getActiveSecondLevelMenuKey,
  childLevelMenus,
  hasChildLevelMenus,
  activeDeepestLevelMenuKey
} = useMixMenuContext('VerticalHybridHeaderFirst');
const { selectedKey } = useMenu();

const inverted = computed(() => !themeStore.darkMode && themeStore.sider.inverted);

const menuTheme = computed(() => (inverted.value ? 'dark' : 'light'));

const showDrawer = computed(() => hasChildLevelMenus.value && (drawerVisible.value || appStore.mixSiderFixed));

function handleSelectMixMenu(key: RouteKey) {
  handleSelectSecondLevelMenu(key);

  if (isActiveSecondLevelMenuHasChildren.value) {
    setDrawerVisible(true);
  }
}

/**
 * Handle second level menu selection based on autoSelectFirstMenu setting:
 * - When disabled: Activate first second-level menu for display only, expand third-level menu if exists
 * - When enabled: Navigate to the deepest menu automatically
 */
function handleSelectMenu(key: RouteKey) {
  handleSelectFirstLevelMenu(key);

  if (secondLevelMenus.value.length === 0) return;

  const secondFirstMenuKey = secondLevelMenus.value[0].routeKey;

  // Case 1: autoSelectFirstMenu disabled - only activate menu for display
  if (!themeStore.sider.autoSelectFirstMenu) {
    // Check if there are third-level menus
    const hasChildren = secondLevelMenus.value.find(menu => menu.key === secondFirstMenuKey)?.children?.length;

    // If there are third-level menus, expand them
    if (hasChildren) {
      handleSelectMixMenu(secondFirstMenuKey);
    }
    return;
  }

  // Case 2: autoSelectFirstMenu enabled - navigate to deepest menu
  activeDeepestLevelMenuKey();
  setDrawerVisible(false);
}

function handleResetActiveMenu() {
  setDrawerVisible(false);

  if (!appStore.mixSiderFixed) {
    getActiveFirstLevelMenuKey();
    getActiveSecondLevelMenuKey();
  }
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

function handleHeaderClick(menuInfo: MenuInfo) {
  handleSelectMenu(menuInfo.key as RouteKey);
}

function handleSiderClick(menuInfo: MenuInfo) {
  routerPushByKeyWithMetaQuery(menuInfo.key as RouteKey);
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
    <div class="h-full flex" @mouseleave="handleResetActiveMenu">
      <FirstLevelMenu
        :menus="secondLevelMenus"
        :active-menu-key="activeSecondLevelMenuKey"
        :inverted="inverted"
        :sider-collapse="appStore.siderCollapse"
        :dark-mode="themeStore.darkMode"
        :theme-color="themeStore.themeColor"
        @select="handleSelectMixMenu"
        @toggle-sider-collapse="appStore.toggleSiderCollapse"
      >
        <GlobalLogo :show-title="false" :style="{ height: themeStore.header.height + 'px' }" />
      </FirstLevelMenu>
      <div
        class="relative h-full transition-width-300"
        :style="{
          width: appStore.mixSiderFixed && hasChildLevelMenus ? themeStore.sider.mixChildMenuWidth + 'px' : '0px'
        }"
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
              :items="childLevelMenus"
              :selected-keys="[selectedKey]"
              :open-keys="expandedKeys"
              :inline-indent="18"
              class="size-full transition-300 border-0!"
              :class="{ 'bg-container!': !inverted }"
              @open-change="handleOpenChange"
              @click="handleSiderClick"
            />
          </SimpleScrollbar>
        </DarkModeContainer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped></style>
