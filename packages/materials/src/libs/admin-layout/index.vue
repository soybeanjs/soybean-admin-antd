<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useDraggable } from '@vueuse/core';
import type { AdminLayoutProps } from '../../types';
import { LAYOUT_MAX_Z_INDEX, LAYOUT_SCROLL_EL_ID, createLayoutCssVars, updateLayoutCssVars } from './shared';
import style from './index.module.css';

defineOptions({
  name: 'AdminLayout'
});

const props = withDefaults(defineProps<AdminLayoutProps>(), {
  mode: 'vertical',
  scrollMode: 'content',
  scrollElId: LAYOUT_SCROLL_EL_ID,
  commonClass: 'transition-all-300',
  fixedTop: true,
  maxZIndex: LAYOUT_MAX_Z_INDEX,
  headerVisible: true,
  headerHeight: 56,
  tabVisible: true,
  tabHeight: 48,
  siderVisible: true,
  siderCollapse: false,
  siderWidth: 220,
  siderCollapsedWidth: 64,
  footerVisible: true,
  footerHeight: 48,
  rightFooter: false,
  useSiderDrag: true
});

interface Emits {
  /** Update siderCollapse */
  (e: 'update:siderCollapse', collapse: boolean): void;
  (e: 'on-emit-sider-width-changed', siderWidth: number): void;
}

const emit = defineEmits<Emits>();

type SlotFn = (props?: Record<string, unknown>) => any;

type Slots = {
  /** Main */
  default?: SlotFn;
  /** Header */
  header?: SlotFn;
  /** Tab */
  tab?: SlotFn;
  /** Sider */
  sider?: SlotFn;
  /** Footer */
  footer?: SlotFn;
};

const slots = defineSlots<Slots>();

const cssVarsObjInnder = createLayoutCssVars(props);
const cssVars = computed(() => cssVarsObjInnder);
const maxZIndexComputed = computed(() => props.maxZIndex);
const openSiderDraggerComputed = computed(() => props.useSiderDrag);
// config visible
const showHeader = computed(() => Boolean(slots.header) && props.headerVisible);
const showTab = computed(() => Boolean(slots.tab) && props.tabVisible);
const showSider = computed(() => !props.isMobile && Boolean(slots.sider) && props.siderVisible);
const showMobileSider = computed(() => props.isMobile && Boolean(slots.sider) && props.siderVisible);
const showFooter = computed(() => Boolean(slots.footer) && props.footerVisible);

// scroll mode
const isWrapperScroll = computed(() => props.scrollMode === 'wrapper');
const isContentScroll = computed(() => props.scrollMode === 'content');

// layout direction
const isVertical = computed(() => props.mode === 'vertical');
const isHorizontal = computed(() => props.mode === 'horizontal');

const fixedHeaderAndTab = computed(() => props.fixedTop || (isHorizontal.value && isWrapperScroll.value));

// css
const leftGapClass = computed(() => {
  if (!props.fullContent && showSider.value) {
    return props.siderCollapse ? style['left-gap_collapsed'] : style['left-gap'];
  }

  return '';
});

const headerLeftGapClass = computed(() => (isVertical.value ? leftGapClass.value : ''));

const footerLeftGapClass = computed(() => {
  const condition1 = isVertical.value;
  const condition2 = isHorizontal.value && isWrapperScroll.value && !props.fixedFooter;
  const condition3 = Boolean(isHorizontal.value && props.rightFooter);

  if (condition1 || condition2 || condition3) {
    return leftGapClass.value;
  }

  return '';
});

const siderPaddingClass = computed(() => {
  let cls = '';

  if (showHeader.value && !headerLeftGapClass.value) {
    cls += style['sider-padding-top'];
  }
  if (showFooter.value && !footerLeftGapClass.value) {
    cls += ` ${style['sider-padding-bottom']}`;
  }

  return cls;
});

function handleClickMask() {
  emit('update:siderCollapse', true);
}

// #region dragger
//= ================================================
const dragDivRef = ref<HTMLDivElement | undefined>();
const dragViewLeftRef = ref<number>(props.siderWidth);

useDraggable(dragDivRef, {
  axis: 'x',
  initialValue: {
    x: dragViewLeftRef.value,
    y: 0
  },
  onMove: position => {
    // console.log('onMove', position, event);
    dragViewLeftRef.value = position.x;
  },
  onEnd: position => {
    // console.log('onEnd', position, event);
    dragViewLeftRef.value = Math.round(position.x);
    updateLayoutCssVars(cssVarsObjInnder, '--soy-sider-width', `${dragViewLeftRef.value}px`);
    emit('on-emit-sider-width-changed', dragViewLeftRef.value);
  }
});
watch(
  () => props.siderWidth,
  nV => {
    if (nV !== dragViewLeftRef.value) {
      dragViewLeftRef.value = nV;
      updateLayoutCssVars(cssVarsObjInnder, '--soy-sider-width', `${dragViewLeftRef.value}px`);
    }
  }
);
const siderCollapseComputed = computed(() => props.siderCollapse);
watch(
  () => props.siderCollapsedWidth,
  nV => {
    if (siderCollapseComputed.value) {
      dragViewLeftRef.value = Math.round(nV);
      updateLayoutCssVars(cssVarsObjInnder, '--soy-sider-collapsed-width', `${dragViewLeftRef.value}px`);
    }
  }
);
watch(
  () => siderCollapseComputed.value,
  nV => {
    if (nV) {
      dragViewLeftRef.value = Math.round(props.siderCollapsedWidth);
    } else {
      dragViewLeftRef.value = Math.round(props.siderWidth);
    }
  }
);
// #endregion  -------------------------------------
</script>

<template>
  <div class="relative h-full" :class="[commonClass]" :style="cssVars">
    <div
      :id="isWrapperScroll ? scrollElId : undefined"
      class="flex flex-col h-full"
      :class="[commonClass, scrollWrapperClass, { 'overflow-y-auto': isWrapperScroll }]"
    >
      <!-- Header -->
      <template v-if="showHeader">
        <header
          v-show="!fullContent"
          class="flex-shrink-0"
          :class="[
            style['layout-header'],
            commonClass,
            headerClass,
            headerLeftGapClass,
            { 'absolute top-0 left-0 w-full': fixedHeaderAndTab }
          ]"
        >
          <slot name="header"></slot>
        </header>
        <div
          v-show="!fullContent && fixedHeaderAndTab"
          class="flex-shrink-0 overflow-hidden"
          :class="[style['layout-header-placement']]"
        ></div>
      </template>

      <!-- Tab -->
      <template v-if="showTab">
        <div
          class="flex-shrink-0"
          :class="[
            style['layout-tab'],
            commonClass,
            tabClass,
            { 'top-0!': fullContent || !showHeader },
            leftGapClass,
            { 'absolute left-0 w-full': fixedHeaderAndTab }
          ]"
        >
          <slot name="tab"></slot>
        </div>
        <div
          v-show="fullContent || fixedHeaderAndTab"
          class="flex-shrink-0 overflow-hidden"
          :class="[style['layout-tab-placement']]"
        ></div>
      </template>

      <!-- Sider -->
      <template v-if="showSider">
        <aside
          v-show="!fullContent"
          class="absolute left-0 top-0 h-full"
          :class="[
            commonClass,
            siderClass,
            siderPaddingClass,
            siderCollapse ? style['layout-sider_collapsed'] : style['layout-sider']
          ]"
        >
          <slot name="sider"></slot>
        </aside>
      </template>

      <!-- Mobile Sider -->
      <template v-if="showMobileSider">
        <aside
          class="absolute left-0 top-0 w-0 h-full bg-white"
          :class="[
            commonClass,
            mobileSiderClass,
            style['layout-mobile-sider'],
            siderCollapse ? 'overflow-hidden' : style['layout-sider']
          ]"
        >
          <slot name="sider"></slot>
        </aside>
        <div
          v-show="!siderCollapse"
          class="absolute left-0 top-0 w-full h-full bg-[rgba(0,0,0,0.2)]"
          :class="[style['layout-mobile-sider-mask']]"
          @click="handleClickMask"
        ></div>
      </template>

      <!-- Main Content -->
      <main
        :id="isContentScroll ? scrollElId : undefined"
        class="flex flex-col flex-grow"
        :class="[commonClass, contentClass, leftGapClass, { 'overflow-y-auto': isContentScroll }]"
      >
        <slot></slot>
      </main>

      <!-- Footer -->
      <template v-if="showFooter">
        <footer
          v-show="!fullContent"
          class="flex-shrink-0"
          :class="[
            style['layout-footer'],
            commonClass,
            footerClass,
            footerLeftGapClass,
            { 'absolute left-0 bottom-0 w-full': fixedFooter }
          ]"
        >
          <slot name="footer"></slot>
        </footer>
        <div
          v-show="!fullContent && fixedFooter"
          class="flex-shrink-0 overflow-hidden"
          :class="[style['layout-footer-placement']]"
        ></div>
      </template>
    </div>
    <!--sider 拖拽-->
    <div
      ref="dragDivRef"
      draggable="true"
      class="drag-bar-view absolute top-0 h-full w-3px cursor-col-resize"
      :style="{
        left: `${dragViewLeftRef}px`,
        'z-index': maxZIndexComputed,
        display: showSider && openSiderDraggerComputed ? 'block' : 'none'
      }"
    />
  </div>
</template>

<style scoped>
.drag-bar-view:hover {
  background-color: greenyellow;
  box-shadow: 0 0 5px 0 #1b233626;
}
</style>
