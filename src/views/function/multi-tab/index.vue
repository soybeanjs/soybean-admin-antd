<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { nanoid } from '@sa/utils';
import { sessionStg } from '@/utils/storage';
import { normalizeWorkspaceDraft } from '@/utils/workspace';
import { $t } from '@/locales';
import { useAuthStore } from '@/store/modules/auth';
import { useTabStore } from '@/store/modules/tab';
import { useRouterPush } from '@/hooks/common/router';

defineOptions({ name: 'FunctionMultiTab' });
const route = useRoute();
const tabStore = useTabStore();
const authStore = useAuthStore();
const { routerPushByKey } = useRouterPush();
const tabId = tabStore.getTabIdByRoute(route);
const draftKey = `${authStore.userInfo.userId}:${tabId}`;
const savedDrafts = sessionStg.get('multiTabDrafts');
const drafts = savedDrafts && typeof savedDrafts === 'object' && !Array.isArray(savedDrafts) ? savedDrafts : {};
const restored = normalizeWorkspaceDraft(drafts[draftKey]);
const note = ref(restored.text);
const count = ref(restored.count);
const tabLabel = ref('');
const queryEntries = computed(() =>
  Object.entries(route.query).map(([key, value]) => ({ key, value: JSON.stringify(value) }))
);

function saveDraft() {
  const current = sessionStg.get('multiTabDrafts');
  const existing = current && typeof current === 'object' && !Array.isArray(current) ? current : {};
  const entries = Object.entries(existing)
    .filter(([key]) => key !== draftKey)
    .slice(-49);
  const next = Object.fromEntries(entries);
  next[draftKey] = normalizeWorkspaceDraft({ text: note.value, count: count.value });
  sessionStg.set('multiTabDrafts', next);
  window.$message?.success($t('workspace.draftSaved'));
}
function renameTab() {
  const title = tabLabel.value.trim();
  if (!title) {
    window.$message?.warning($t('workspace.titleRequired'));
    return;
  }
  tabStore.setTabLabel(title.slice(0, 60), tabId);
}
function openAnotherTab() {
  routerPushByKey('function_multi-tab', { query: { ...route.query, a: nanoid() } });
}
</script>

<template>
  <div class="flex-col gap-16px">
    <ACard :title="$t('workspace.tabWorkspace')" :bordered="false" class="card-wrapper">
      <p class="mb-16px text-secondary">{{ $t('workspace.tabDescription') }}</p>
      <ASpace wrap>
        <AButton type="primary" @click="openAnotherTab">{{ $t('workspace.newTab') }}</AButton>
        <AButton @click="routerPushByKey('function_tab')">{{ $t('page.function.multiTab.backTab') }}</AButton>
        <AButton @click="tabStore.removeActiveTab">{{ $t('common.close') }}</AButton>
      </ASpace>
      <ADivider orientation="left">{{ $t('workspace.queryParams') }}</ADivider>
      <ADescriptions v-if="queryEntries.length" bordered :column="1">
        <ADescriptionsItem v-for="item in queryEntries" :key="item.key" :label="item.key">
          {{ item.value }}
        </ADescriptionsItem>
      </ADescriptions>
      <AEmpty v-else :description="$t('common.noData')" />
      <ADivider orientation="left">{{ $t('workspace.tabTitle') }}</ADivider>
      <ASpace wrap>
        <AInput
          v-model:value="tabLabel"
          :maxlength="60"
          :placeholder="$t('workspace.tabTitle')"
          @press-enter="renameTab"
        />
        <AButton @click="renameTab">{{ $t('workspace.renameTab') }}</AButton>
        <AButton @click="tabStore.resetTabLabel(tabId)">{{ $t('workspace.resetTitle') }}</AButton>
      </ASpace>
    </ACard>
    <ACard :title="$t('workspace.pageActions')" :bordered="false" class="card-wrapper">
      <ASpace class="mb-24px">
        <AStatistic :title="$t('workspace.counter')" :value="count" />
        <AButton :disabled="count >= 1000000" @click="count += 1">
          {{ $t('workspace.increment') }}
        </AButton>
        <AButton @click="count = 0">{{ $t('common.reset') }}</AButton>
      </ASpace>
      <AForm layout="vertical">
        <AFormItem :label="$t('workspace.note')">
          <ATextarea
            v-model:value="note"
            :maxlength="2000"
            show-count
            :rows="5"
            :placeholder="$t('workspace.notePlaceholder')"
          />
        </AFormItem>
      </AForm>
      <p class="mb-16px text-secondary">{{ $t('workspace.draftDescription') }}</p>
      <AButton type="primary" @click="saveDraft">{{ $t('workspace.saveDraft') }}</AButton>
    </ACard>
  </div>
</template>
