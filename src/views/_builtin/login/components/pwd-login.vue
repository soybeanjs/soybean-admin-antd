<script setup lang="ts">
import { $t } from '@/locales';
import { loginModuleLabels } from '@/constants/app';
import { useRouterPush } from '@/hooks/common/router';
import { reactive } from 'vue';
import { useAntdForm, useFormRules } from '@/hooks/common/form';
import { useAuthStore } from '@/store/modules/auth';

defineOptions({
  name: 'PwdLogin'
});

const auth = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useAntdForm();
const { constantRules } = useFormRules();

interface FormModel {
  userName: string;
  password: string;
}

const model: FormModel = reactive({
  userName: 'Soybean',
  password: '123456'
});

const rules: Record<keyof FormModel, App.Global.FormRule[]> = {
  userName: constantRules.userName,
  password: constantRules.pwd
};

async function handleSubmit() {
  await validate();
  await auth.login(model.userName, model.password);
}
</script>

<template>
  <AForm ref="formRef" :model="model" :rules="rules">
    <AFormItem name="userName">
      <AInput v-model:value="model.userName" size="large" :placeholder="$t('page.login.common.userNamePlaceholder')" />
    </AFormItem>
    <AFormItem name="password">
      <AInputPassword
        v-model:value="model.password"
        size="large"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      />
    </AFormItem>
    <ASpace direction="vertical" size="large" class="w-full">
      <div class="flex-y-center justify-between">
        <ACheckbox>{{ $t('page.login.pwdLogin.rememberMe') }}</ACheckbox>
        <AButton type="link">{{ $t('page.login.pwdLogin.forgetPassword') }}</AButton>
      </div>
      <AButton type="primary" block size="large" shape="round" :loading="auth.loginLoading" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </AButton>
      <div class="flex-y-center justify-between">
        <AButton class="flex-1" block @click="toggleLoginModule('code-login')">
          {{ $t(loginModuleLabels['code-login']) }}
        </AButton>
        <div class="w-12px"></div>
        <AButton class="flex-1" block @click="toggleLoginModule('register')">
          {{ $t(loginModuleLabels.register) }}
        </AButton>
      </div>
    </ASpace>
  </AForm>
</template>

<style scoped></style>
