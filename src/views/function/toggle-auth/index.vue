<script setup lang="ts">
import { computed, ref } from 'vue';
import { useLoading } from '@sa/hooks';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';
import { useAuth } from '@/hooks/business/auth';

const appStore = useAppStore();
const authStore = useAuthStore();
const { hasAuth } = useAuth();
const { loading, startLoading, endLoading } = useLoading();

type AccountKey = 'super' | 'admin' | 'user';

interface Account {
  key: AccountKey;
  label: string;
  userName: string;
  password: string;
}

const accounts = computed<Account[]>(() => [
  {
    key: 'super',
    label: $t('page.login.pwdLogin.superAdmin'),
    userName: 'Super',
    password: '123456'
  },
  {
    key: 'admin',
    label: $t('page.login.pwdLogin.admin'),
    userName: 'Admin',
    password: '123456'
  },
  {
    key: 'user',
    label: $t('page.login.pwdLogin.user'),
    userName: 'User',
    password: '123456'
  }
]);

const loginAccount = ref<AccountKey>('super');

async function handleToggleAccount(account: Account) {
  loginAccount.value = account.key;

  startLoading();
  await authStore.login(account.userName, account.password, false);
  endLoading();
  appStore.reloadPage();
}
</script>

<template>
  <ASpace direction="vertical" :size="16">
    <ACard :title="$t('route.function_toggle-auth')" :bordered="false" size="small" class="card-wrapper">
      <ADescriptions layout="vertical" bordered size="small" :column="1">
        <ADescriptionsItem :label="$t('page.manage.user.userRole')">
          <ASpace>
            <ATag v-for="role in authStore.userInfo.roles" :key="role">{{ role }}</ATag>
          </ASpace>
        </ADescriptionsItem>
        <ADescriptionsItem ions-item :label="$t('page.function.toggleAuth.toggleAccount')">
          <ASpace>
            <AButton
              v-for="account in accounts"
              :key="account.key"
              :loading="loading && loginAccount === account.key"
              :disabled="loading && loginAccount !== account.key"
              @click="handleToggleAccount(account)"
            >
              {{ account.label }}
            </AButton>
          </ASpace>
        </ADescriptionsItem>
      </ADescriptions>
    </ACard>
    <ACard :title="$t('page.function.toggleAuth.authHook')" :bordered="false" size="small" class="card-wrapper">
      <ASpace>
        <AButton v-if="hasAuth('B_CODE1')">{{ $t('page.function.toggleAuth.superAdminVisible') }}</AButton>
        <AButton v-if="hasAuth('B_CODE2')">{{ $t('page.function.toggleAuth.adminVisible') }}</AButton>
        <AButton v-if="hasAuth('B_CODE3')">
          {{ $t('page.function.toggleAuth.adminOrUserVisible') }}
        </AButton>
      </ASpace>
    </ACard>
  </ASpace>
</template>

<style scoped></style>
