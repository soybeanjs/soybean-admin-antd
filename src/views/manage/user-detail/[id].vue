<script setup lang="ts">
import { computed, onScopeDispose, ref, shallowRef, watch } from 'vue';
import { parseRecordId } from '@/utils/workspace';
import { fetchGetUserDetail } from '@/service/api';
import { $t } from '@/locales';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';

defineOptions({ name: 'UserDetail' });
const props = defineProps<{ id: string }>();
const { routerPushByKey } = useRouterPush();
const authStore = useAuthStore();
const user = shallowRef<Api.SystemManage.User | null>(null);
const loading = ref(false);
const error = ref(false);
const validId = computed(() => parseRecordId(props.id));
let controller: AbortController | undefined;

const fields = computed(() =>
  user.value
    ? [
        { label: $t('workspace.userId'), value: user.value.id },
        { label: $t('page.manage.user.userName'), value: user.value.userName },
        { label: $t('page.manage.user.nickName'), value: user.value.nickName },
        {
          label: $t('page.manage.user.userGender'),
          value:
            user.value.userGender === '1'
              ? $t('page.manage.user.gender.male')
              : user.value.userGender === '2'
                ? $t('page.manage.user.gender.female')
                : '—'
        },
        { label: $t('page.manage.user.userPhone'), value: user.value.userPhone },
        { label: $t('page.manage.user.userEmail'), value: user.value.userEmail },
        { label: $t('workspace.createdAt'), value: user.value.createTime },
        { label: $t('workspace.updatedAt'), value: user.value.updateTime },
        { label: $t('workspace.createdBy'), value: user.value.createBy },
        { label: $t('workspace.updatedBy'), value: user.value.updateBy }
      ]
    : []
);
async function load() {
  controller?.abort();
  const pending = new AbortController();
  controller = pending;
  user.value = null;
  error.value = false;
  loading.value = false;
  if (validId.value === null) return;
  loading.value = true;
  try {
    const result = await fetchGetUserDetail(validId.value, pending.signal);
    if (!pending.signal.aborted) user.value = result;
  } catch {
    if (!pending.signal.aborted) error.value = true;
  } finally {
    if (controller === pending) loading.value = false;
  }
}
watch(() => props.id, load, { immediate: true });
watch(
  () => authStore.sessionVersion,
  () => {
    controller?.abort();
    user.value = null;
  }
);
onScopeDispose(() => controller?.abort());
</script>

<template>
  <ACard :title="$t('workspace.detail')" :bordered="false" class="card-wrapper">
    <template #extra>
      <AButton @click="routerPushByKey('manage_user')">{{ $t('workspace.backUsers') }}</AButton>
    </template>
    <ASkeleton v-if="loading" active :paragraph="{ rows: 8 }" />
    <template v-else-if="user">
      <div class="mb-24px flex-y-center gap-16px">
        <AAvatar :size="64" class="bg-primary">{{ user.userName.slice(0, 1).toUpperCase() }}</AAvatar>
        <div>
          <h2 class="text-22px font-semibold">{{ user.nickName || user.userName }}</h2>
          <ATag :color="user.status === '1' ? 'success' : 'warning'">
            {{ $t(user.status === '1' ? 'page.manage.common.status.enable' : 'page.manage.common.status.disable') }}
          </ATag>
        </div>
      </div>
      <ADescriptions bordered :column="{ xs: 1, sm: 2 }">
        <ADescriptionsItem v-for="field in fields" :key="field.label" :label="field.label">
          {{ field.value === '' ? '—' : (field.value ?? '—') }}
        </ADescriptionsItem>
      </ADescriptions>
      <ADivider orientation="left">{{ $t('workspace.roles') }}</ADivider>
      <ASpace wrap>
        <ATag v-for="role in user.userRoles" :key="role" color="blue">{{ role }}</ATag>
        <span v-if="!user.userRoles.length">{{ $t('common.noData') }}</span>
      </ASpace>
    </template>
    <AResult
      v-else
      :status="error ? 'warning' : '404'"
      :title="$t(validId === null ? 'workspace.invalidId' : error ? 'workspace.detailFailed' : 'workspace.missingUser')"
      :sub-title="$t(error ? 'workspace.detailFailedDescription' : 'workspace.missingDescription')"
    >
      <template #extra>
        <AButton v-if="validId !== null" type="primary" @click="load">{{ $t('workspace.retry') }}</AButton>
      </template>
    </AResult>
  </ACard>
</template>
