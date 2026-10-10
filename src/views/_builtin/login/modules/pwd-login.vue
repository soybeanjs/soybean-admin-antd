<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { loginModuleRecord } from '@/constants/app';
import { $t } from '@/locales';
import { useAuthStore } from '@/store/modules/auth';
import { useAntdForm, useFormRules } from '@/hooks/common/form';
import { useRouterPush } from '@/hooks/common/router';

defineOptions({
  name: 'PwdLogin'
});

const authStore = useAuthStore();
const remember = ref(true);
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useAntdForm();

interface FormModel {
  userName: string;
  password: string;
}

const model: FormModel = reactive({
  userName: import.meta.env.VITE_USE_MOCK === 'Y' ? 'Soybean' : '',
  password: import.meta.env.VITE_USE_MOCK === 'Y' ? '123456' : ''
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const { formRules } = useFormRules();

  return {
    userName: formRules.userName,
    password: formRules.pwd
  };
});

async function handleSubmit() {
  await validate();
  await authStore.login(model.userName, model.password, { remember: remember.value });
}
</script>

<template>
  <AForm ref="formRef" :model="model" :rules="rules" @keyup.enter="handleSubmit">
    <AFormItem name="userName">
      <AInput
        v-model:value="model.userName"
        autocomplete="username"
        size="large"
        :placeholder="$t('page.login.common.userNamePlaceholder')"
      />
    </AFormItem>
    <AFormItem name="password">
      <AInputPassword
        v-model:value="model.password"
        autocomplete="current-password"
        size="large"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      />
    </AFormItem>
    <ASpace direction="vertical" size="large" class="w-full">
      <div class="flex-y-center justify-between">
        <ACheckbox v-model:checked="remember">{{ $t('page.login.pwdLogin.rememberMe') }}</ACheckbox>
        <AButton type="text" @click="toggleLoginModule('reset-pwd')">
          {{ $t('page.login.pwdLogin.forgetPassword') }}
        </AButton>
      </div>
      <AButton type="primary" block size="large" shape="round" :loading="authStore.loginLoading" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </AButton>
      <div class="flex-y-center justify-between">
        <AButton class="h-34px flex-1" block @click="toggleLoginModule('code-login')">
          {{ $t(loginModuleRecord['code-login']) }}
        </AButton>
        <div class="w-12px"></div>
        <AButton class="h-34px flex-1" block @click="toggleLoginModule('register')">
          {{ $t(loginModuleRecord.register) }}
        </AButton>
      </div>
    </ASpace>
  </AForm>
</template>

<style scoped></style>
