<script setup lang="ts">
import { ref } from 'vue';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';
import { useTabStore } from '@/store/modules/tab';

const tabStore = useTabStore();
const { routerPushByKey } = useRouterPush();

const tabLabel = ref('');

function changeTabLabel() {
  tabStore.setTabLabel(tabLabel.value);
}

function resetTabLabel() {
  tabStore.resetTabLabel();
}
</script>

<template>
  <ASpace direction="vertical" :size="16">
    <ACard :title="$t('page.function.tab.tabOperate.title')" :bordered="false" size="small" class="card-wrapper">
      <ADivider orientation="left">{{ $t('page.function.tab.tabOperate.addTab') }}</ADivider>
      <AButton @click="routerPushByKey('about')">{{ $t('page.function.tab.tabOperate.addTabDesc') }}</AButton>

      <ADivider orientation="left">{{ $t('page.function.tab.tabOperate.closeTab') }}</ADivider>
      <ASpace :size="16">
        <AButton @click="tabStore.removeActiveTab">
          {{ $t('page.function.tab.tabOperate.closeCurrentTab') }}
        </AButton>
        <AButton @click="tabStore.removeTabByRouteName('about')">
          {{ $t('page.function.tab.tabOperate.closeAboutTab') }}
        </AButton>
      </ASpace>

      <ADivider orientation="left">{{ $t('page.function.tab.tabOperate.addMultiTab') }}</ADivider>
      <ASpace :size="16" wrap class="m-0!">
        <AButton @click="routerPushByKey('function_multi-tab')">
          {{ $t('page.function.tab.tabOperate.addMultiTabDesc1') }}
        </AButton>
        <AButton @click="routerPushByKey('function_multi-tab', { query: { a: '1' } })">
          {{ $t('page.function.tab.tabOperate.addMultiTabDesc2') }}
        </AButton>
      </ASpace>
    </ACard>
    <ACard :title="$t('page.function.tab.tabTitle.title')" :bordered="false" size="small" class="card-wrapper">
      <ADivider orientation="left">{{ $t('page.function.tab.tabTitle.changeTitle') }}</ADivider>
      <AInputSearch
        v-model:value="tabLabel"
        :enter-button="$t('page.function.tab.tabTitle.change')"
        class="max-w-240px"
        @search="changeTabLabel"
      />

      <ADivider orientation="left">{{ $t('page.function.tab.tabTitle.resetTitle') }}</ADivider>
      <AButton @click="resetTabLabel">{{ $t('page.function.tab.tabTitle.reset') }}</AButton>
    </ACard>
  </ASpace>
</template>

<style scoped></style>
