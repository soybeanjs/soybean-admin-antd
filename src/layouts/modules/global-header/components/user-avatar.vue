<script setup lang="ts">
import { Modal } from 'ant-design-vue';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';
import { useAuthStore } from '@/store/modules/auth';

defineOptions({
  name: 'UserAvatar'
});

const { resetStore } = useAuthStore();
const { routerPushByKey } = useRouterPush();

function logout() {
  Modal.confirm({
    title: $t('common.tip'),
    content: $t('common.logoutConfirm'),
    okText: $t('common.confirm'),
    cancelText: $t('common.cancel'),
    onOk: () => {
      resetStore();
    }
  });
}
</script>

<template>
  <ADropdown placement="bottomRight">
    <AButton type="text" class="h-full">
      <div class="flex-y-center">
        <SvgIcon icon="ph:user-circle" class="text-icon-large" />
        <span class="pl-8px text-16px font-medium">Soybean</span>
      </div>
    </AButton>
    <template #overlay>
      <AMenu>
        <AMenuItem @click="routerPushByKey('user-center')">
          <div class="flex-y-center">
            <SvgIcon icon="ph:user-circle" class="text-icon" />
            <span class="pl-8px">{{ $t('common.userCenter') }}</span>
          </div>
        </AMenuItem>
        <AMenuDivider />
        <AMenuItem @click="logout">
          <div class="flex-y-center">
            <SvgIcon icon="ph:sign-out" class="text-icon" />
            <span class="pl-8px">{{ $t('common.logout') }}</span>
          </div>
        </AMenuItem>
      </AMenu>
    </template>
  </ADropdown>
</template>

<style scoped></style>
