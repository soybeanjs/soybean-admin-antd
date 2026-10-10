<script setup lang="ts">
import { computed, ref } from 'vue';
import { Modal } from 'ant-design-vue';
import { localStg } from '@/utils/storage';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';
import { useTabStore } from '@/store/modules/tab';
import { useThemeStore } from '@/store/modules/theme';

defineOptions({ name: 'UserCenter' });
const authStore = useAuthStore();
const appStore = useAppStore();
const themeStore = useThemeStore();
const tabStore = useTabStore();
const refreshing = ref(false);
const languageOptions = computed(() => appStore.localeOptions.map(item => ({ label: item.label, value: item.key })));
const appearanceOptions = computed(() =>
  (['light', 'dark', 'auto'] as const).map(value => ({ value, label: $t(`theme.appearance.themeSchema.${value}`) }))
);
const recentTabs = computed(() => tabStore.tabs.filter(tab => tab.routeKey !== 'user-center').slice(-8));
const sessionMode = computed(() => $t(localStg.get('token') ? 'workspace.remembered' : 'workspace.sessionOnly'));

function changeLanguage(value: unknown) {
  if (value === 'zh-CN' || value === 'en-US') appStore.changeLocale(value);
}
function changeAppearance(value: unknown) {
  if (value === 'light' || value === 'dark' || value === 'auto') themeStore.setThemeScheme(value);
}
async function refreshAccount() {
  if (refreshing.value) return;
  refreshing.value = true;
  try {
    await authStore.initUserInfo();
    if (authStore.isLogin) window.$message?.success($t('workspace.accountRefreshed'));
  } finally {
    refreshing.value = false;
  }
}
async function copyId() {
  try {
    await navigator.clipboard.writeText(authStore.userInfo.userId);
    window.$message?.success($t('workspace.copied'));
  } catch {
    window.$message?.error($t('workspace.copyFailed'));
  }
}
function logout() {
  Modal.confirm({
    title: $t('common.tip'),
    content: $t('common.logoutConfirm'),
    okText: $t('common.confirm'),
    cancelText: $t('common.cancel'),
    onOk: () => authStore.resetStore()
  });
}
</script>

<template>
  <div class="flex-col gap-16px">
    <ACard :title="$t('workspace.accountInfo')" :bordered="false" class="card-wrapper">
      <div class="mb-24px flex-y-center gap-16px">
        <AAvatar :size="64" class="bg-primary">{{ authStore.userInfo.userName.slice(0, 1).toUpperCase() }}</AAvatar>
        <div>
          <h2 class="text-22px font-semibold">{{ authStore.userInfo.userName }}</h2>
          <p class="text-secondary">{{ sessionMode }}</p>
        </div>
      </div>
      <ADescriptions bordered :column="{ xs: 1, sm: 2 }">
        <ADescriptionsItem :label="$t('workspace.userId')">{{ authStore.userInfo.userId }}</ADescriptionsItem>
        <ADescriptionsItem :label="$t('page.manage.user.userName')">
          {{ authStore.userInfo.userName }}
        </ADescriptionsItem>
        <ADescriptionsItem :label="$t('workspace.roles')">
          <ASpace wrap>
            <ATag v-for="role in authStore.userInfo.roles" :key="role" color="blue">{{ role }}</ATag>
          </ASpace>
        </ADescriptionsItem>
        <ADescriptionsItem :label="$t('workspace.permissions')">
          <ASpace v-if="authStore.userInfo.buttons.length" wrap>
            <ATag v-for="button in authStore.userInfo.buttons" :key="button">{{ button }}</ATag>
          </ASpace>
          <span v-else>{{ $t('workspace.noPermissions') }}</span>
        </ADescriptionsItem>
      </ADescriptions>
      <ASpace wrap class="mt-16px">
        <AButton :loading="refreshing" @click="refreshAccount">{{ $t('workspace.refreshInfo') }}</AButton>
        <AButton @click="copyId">{{ $t('workspace.copyId') }}</AButton>
        <AButton danger @click="logout">{{ $t('common.logout') }}</AButton>
      </ASpace>
    </ACard>
    <div class="grid gap-16px lg:grid-cols-2">
      <ACard :title="$t('workspace.preferences')" :bordered="false" class="card-wrapper">
        <p class="mb-24px text-secondary">{{ $t('workspace.localPreferences') }}</p>
        <AForm layout="vertical">
          <AFormItem :label="$t('workspace.language')">
            <ASelect :value="appStore.locale" :options="languageOptions" @change="changeLanguage" />
          </AFormItem>
          <AFormItem :label="$t('workspace.appearance')">
            <ASelect :value="themeStore.themeScheme" :options="appearanceOptions" @change="changeAppearance" />
          </AFormItem>
        </AForm>
      </ACard>
      <ACard :title="$t('workspace.sessionTabs')" :bordered="false" class="card-wrapper">
        <AList :data-source="recentTabs">
          <template #renderItem="{ item }">
            <AListItem>
              <AButton type="link" @click="tabStore.switchRouteByTab(item)">
                {{ item.newLabel || item.label }}
              </AButton>
            </AListItem>
          </template>
        </AList>
      </ACard>
    </div>
  </div>
</template>
