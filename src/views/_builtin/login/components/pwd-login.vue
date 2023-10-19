<script setup lang="ts">
import { $t } from '@/locales';
import { loginModuleLabels } from '@/constants/app';
import { useRouterPush } from '@/hooks/common/router';

defineOptions({
  name: 'PwdLogin'
});

const { toggleLoginModule } = useRouterPush();
</script>

<template>
  <AForm>
    <AFormItem>
      <AInput size="large" :placeholder="$t('page.login.common.userNamePlaceholder')" />
    </AFormItem>
    <AFormItem>
      <AInput size="large" :placeholder="$t('page.login.common.passwordPlaceholder')" />
    </AFormItem>
    <ASpace direction="vertical" size="large" class="w-full">
      <div class="flex-y-center justify-between">
        <ACheckbox>{{ $t('page.login.pwdLogin.rememberMe') }}</ACheckbox>
        <AButton type="link">{{ $t('page.login.pwdLogin.forgetPassword') }}</AButton>
      </div>
      <AButton type="primary" block size="large" shape="round">{{ $t('common.confirm') }}</AButton>
      <div class="flex-y-center justify-between">
        <AButton class="flex-1" block @click="toggleLoginModule('code-login')">
          {{ loginModuleLabels['code-login'] }}
        </AButton>
        <div class="w-12px"></div>
        <AButton class="flex-1" block @click="toggleLoginModule('register')">
          {{ loginModuleLabels.register }}
        </AButton>
      </div>
    </ASpace>
  </AForm>
</template>

<style scoped></style>
