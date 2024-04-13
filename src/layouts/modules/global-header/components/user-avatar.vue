<script setup lang="ts">
import { Modal } from 'ant-design-vue';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';

defineOptions({
  name: 'UserAvatar'
});

const authStore = useAuthStore();
const { routerPushByKey, toLogin } = useRouterPush();

function loginOrRegister() {
  toLogin();
}

function logout() {
  Modal.confirm({
    title: $t('common.tip'),
    content: $t('common.logoutConfirm'),
    okText: $t('common.confirm'),
    cancelText: $t('common.cancel'),
    onOk: () => {
      authStore.resetStore();
    }
  });
}
</script>

<template>
  <AButton v-if="!authStore.isLogin" @click="loginOrRegister">{{ $t('page.login.common.loginOrRegister') }}</AButton>
  <ADropdown v-else placement="bottomRight" trigger="click">
    <ButtonIcon>
      <SvgIcon icon="ph:user-circle" class="text-icon-large" />
      <span class="text-16px font-medium">{{ authStore.userInfo.userName }}</span>
    </ButtonIcon>
    <template #overlay>
      <AMenu>
        <AMenuItem @click="routerPushByKey('user-center')">
          <div class="flex-center gap-8px">
            <SvgIcon icon="ph:user-circle" class="text-icon" />
            {{ $t('common.userCenter') }}
          </div>
        </AMenuItem>
        <AMenuDivider />
        <AMenuItem @click="logout">
          <div class="flex-center gap-8px">
            <SvgIcon icon="ph:sign-out" class="text-icon" />
            {{ $t('common.logout') }}
          </div>
        </AMenuItem>
      </AMenu>
    </template>
  </ADropdown>
</template>

<style scoped></style>
