<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { $t } from '@/locales';
import { useRouterPush } from '@/hooks/common/router';

const props = defineProps<{ mode: 'hidden' | 'nested' }>();
const route = useRoute();
const router = useRouter();
const { routerPushByKey } = useRouterPush();
const count = ref(0);
const note = ref('');
const title = computed(() => (route.meta.i18nKey ? $t(route.meta.i18nKey) : route.meta.title));
const pages = computed<
  Array<
    | 'function_hide-child_one'
    | 'function_hide-child_two'
    | 'function_hide-child_three'
    | 'multi-menu_first_child'
    | 'multi-menu_second_child_home'
  >
>(() =>
  props.mode === 'hidden'
    ? ['function_hide-child_one', 'function_hide-child_two', 'function_hide-child_three']
    : ['multi-menu_first_child', 'multi-menu_second_child_home']
);
const activeMenuLabel = computed(() => {
  const meta = router.getRoutes().find(item => item.name === route.meta.activeMenu)?.meta;
  return meta?.i18nKey ? $t(meta.i18nKey) : meta?.title || title.value;
});
const levels = computed(() => route.path.split('/').filter(Boolean));
</script>

<template>
  <div class="flex-col gap-16px">
    <ACard :title="title" :bordered="false" class="card-wrapper">
      <p class="mb-24px text-secondary">
        {{ $t(mode === 'hidden' ? 'workspace.hiddenDescription' : 'workspace.nestedDescription') }}
      </p>
      <ASpace wrap>
        <AButton
          v-for="page in pages"
          :key="page"
          :type="route.name === page ? 'primary' : 'default'"
          @click="routerPushByKey(page)"
        >
          {{ $t(`route.${page}`) }}
        </AButton>
      </ASpace>
      <ADivider />
      <ADescriptions bordered :column="1">
        <ADescriptionsItem :label="$t('workspace.currentRoute')">{{ route.fullPath }}</ADescriptionsItem>
        <ADescriptionsItem :label="$t('workspace.activeMenu')">{{ activeMenuLabel }}</ADescriptionsItem>
        <ADescriptionsItem :label="$t('workspace.routeLevels')">
          <ASteps :current="levels.length - 1" size="small" :items="levels.map(level => ({ title: level }))" />
        </ADescriptionsItem>
      </ADescriptions>
    </ACard>
    <ACard :title="$t('workspace.pageActions')" :bordered="false" class="card-wrapper">
      <ASpace wrap class="mb-24px">
        <AStatistic :title="$t('workspace.counter')" :value="count" />
        <AButton @click="count += 1">
          {{ $t('workspace.increment') }}
        </AButton>
        <AButton
          @click="
            count = 0;
            note = '';
          "
        >
          {{ $t('common.reset') }}
        </AButton>
      </ASpace>
      <AForm layout="vertical">
        <AFormItem :label="$t('workspace.note')">
          <ATextarea
            v-model:value="note"
            :maxlength="2000"
            show-count
            :rows="4"
            :placeholder="$t('workspace.notePlaceholder')"
          />
        </AFormItem>
      </AForm>
    </ACard>
  </div>
</template>
