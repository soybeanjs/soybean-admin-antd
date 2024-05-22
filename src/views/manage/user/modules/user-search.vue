<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';
import { useAntdForm, useFormRules } from '@/hooks/common/form';
import { enableStatusOptions, userGenderOptions } from '@/constants/business';
import { translateOptions } from '@/utils/common';

defineOptions({
  name: 'UserSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, resetFields } = useAntdForm();

const model = defineModel<Api.SystemManage.UserSearchParams>('model', { required: true });

type RuleKey = Extract<keyof Api.SystemManage.UserSearchParams, 'userEmail' | 'userPhone'>;

const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  const { patternRules } = useFormRules(); // inside computed to make locale reactive

  return {
    userEmail: patternRules.email,
    userPhone: patternRules.phone
  };
});

async function reset() {
  await resetFields();
  emit('reset');
}

async function search() {
  await validate();
  emit('search');
}
</script>

<template>
  <ACard :title="$t('common.search')" :bordered="false" class="card-wrapper">
    <AForm
      ref="formRef"
      :model="model"
      :rules="rules"
      :label-col="{
        span: 5,
        md: 7
      }"
    >
      <ARow :gutter="[16, 16]" wrap>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem :label="$t('page.manage.user.userName')" name="userName" class="m-0">
            <AInput v-model:value="model.userName" :placeholder="$t('page.manage.user.form.userName')" />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem :label="$t('page.manage.user.userGender')" name="userGender" class="m-0">
            <ASelect
              v-model:value="model.userGender"
              :placeholder="$t('page.manage.user.form.userGender')"
              :options="translateOptions(userGenderOptions)"
              clearable
            />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem :label="$t('page.manage.user.nickName')" name="nickName" class="m-0">
            <AInput v-model:value="model.nickName" :placeholder="$t('page.manage.user.form.nickName')" />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem :label="$t('page.manage.user.userPhone')" name="userPhone" class="m-0">
            <AInput v-model:value="model.userPhone" :placeholder="$t('page.manage.user.form.userPhone')" />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem :label="$t('page.manage.user.userEmail')" name="userEmail" class="m-0">
            <AInput v-model:value="model.userEmail" :placeholder="$t('page.manage.user.form.userEmail')" />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem :label="$t('page.manage.user.userStatus')" name="userStatus" class="m-0">
            <ASelect
              v-model:value="model.status"
              :placeholder="$t('page.manage.user.form.userStatus')"
              :options="translateOptions(enableStatusOptions)"
              clearable
            />
          </AFormItem>
        </ACol>
        <div class="flex-1">
          <AFormItem class="m-0">
            <div class="w-full flex-y-center justify-end gap-12px">
              <AButton @click="reset">
                <template #icon>
                  <icon-ic-round-refresh class="text-icon" />
                </template>
                {{ $t('common.reset') }}
              </AButton>
              <AButton type="primary" ghost @click="search">
                <template #icon>
                  <icon-ic-round-search class="text-icon" />
                </template>
                {{ $t('common.search') }}
              </AButton>
            </div>
          </AFormItem>
        </div>
      </ARow>
    </AForm>
  </ACard>
</template>

<style scoped></style>
