<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useElementBounding } from '@vueuse/core';
import { PageTab } from '@sa/materials';
import BetterScroll from '@/components/custom/better-scroll.vue';
import { useTabStore } from '@/store/modules/tab';
import { useThemeStore } from '@/store/modules/theme';

defineOptions({
  name: 'GlobalTab'
});

const route = useRoute();
const theme = useThemeStore();
const tab = useTabStore();

const bsWrapper = ref<HTMLElement>();
const { width: bsWrapperWidth, left: bsWrapperLeft } = useElementBounding(bsWrapper);
const bsScroll = ref<InstanceType<typeof BetterScroll>>();
const tabRef = ref<HTMLElement>();

const isChromeMode = true;

const TAB_DATA_ID = 'data-tab-id';

type TabNamedNodeMap = NamedNodeMap & {
  [TAB_DATA_ID]: Attr;
};

async function scrollToActiveTab() {
  await nextTick();
  if (!tabRef.value) return;

  const { children } = tabRef.value;

  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];

    const { value: tabId } = (child.attributes as TabNamedNodeMap)[TAB_DATA_ID];

    if (tabId === tab.activeTabId) {
      const { left, width } = child.getBoundingClientRect();
      const clientX = left + width / 2;

      setTimeout(() => {
        scrollByClientX(clientX);
      }, 50);

      break;
    }
  }
}

function scrollByClientX(clientX: number) {
  const currentX = clientX - bsWrapperLeft.value;
  const deltaX = currentX - bsWrapperWidth.value / 2;

  if (bsScroll.value?.instance) {
    const { maxScrollX, x: leftX, scrollBy } = bsScroll.value.instance;

    const rightX = maxScrollX - leftX;
    const update = deltaX > 0 ? Math.max(-deltaX, rightX) : Math.min(-deltaX, -leftX);

    scrollBy(update, 0, 300);
  }
}

function init() {
  tab.initTabStore(route);
}

// watch
watch(
  () => route.fullPath,
  () => {
    tab.addTab(route);
  }
);
watch(
  () => tab.activeTabId,
  () => {
    scrollToActiveTab();
  }
);

// init
init();
</script>

<template>
  <DarkModeContainer class="flex-y-center wh-full pl-16px shadow-tab">
    <div ref="bsWrapper" class="flex-1-hidden h-full">
      <BetterScroll ref="bsScroll" :options="{ scrollX: true, scrollY: false }">
        <div ref="tabRef" class="flex h-full pr-18px" :class="[isChromeMode ? 'items-end' : 'items-center gap-12px']">
          <PageTab
            v-for="item in tab.tabs"
            :key="item.id"
            :[TAB_DATA_ID]="item.id"
            :dark-mode="theme.darkMode"
            :active="item.id === tab.activeTabId"
            :active-color="theme.themeColor"
            :closable="!tab.isTabRetain(item.id)"
            @click="tab.switchRouteByTab(item)"
            @close="tab.removeTab(item.id)"
          >
            <template #prefix>
              <SvgIcon
                :icon="item.icon"
                :local-icon="item.localIcon"
                class="inline-block align-text-bottom text-16px"
              />
            </template>
            {{ item.label }}
          </PageTab>
        </div>
      </BetterScroll>
    </div>
  </DarkModeContainer>
</template>

<style scoped></style>
