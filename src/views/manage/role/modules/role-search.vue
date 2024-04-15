<script setup lang="ts">
import { $t } from '@/locales';
import { enableStatusOptions } from '@/constants/business';

defineOptions({
  name: 'RoleSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.SystemManage.RoleSearchParams>('model', { required: true });

function reset() {
  emit('reset');
}

function search() {
  emit('search');
}
</script>

<template>
  <ACard :title="$t('common.search')" :bordered="false" class="card-wrapper">
    <AForm :model="model" :label-width="80">
      <ARow :gutter="[16, 16]" wrap>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem :label="$t('page.manage.role.roleName')" name="roleName" class="m-0">
            <AInput v-model:value="model.roleName" :placeholder="$t('page.manage.role.form.roleName')" />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem :label="$t('page.manage.role.roleCode')" name="roleCode" class="m-0">
            <AInput v-model:value="model.roleCode" :placeholder="$t('page.manage.role.form.roleCode')" />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem :label="$t('page.manage.role.roleStatus')" name="status" class="m-0">
            <ASelect v-model:value="model.status" :placeholder="$t('page.manage.role.form.roleStatus')" allow-clear>
              <ASelectOption v-for="option in enableStatusOptions" :key="option.value" :value="option.value">
                {{ $t(option.label) }}
              </ASelectOption>
            </ASelect>
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem class="m-0">
            <div class="w-full flex-y-center justify-end gap-12px">
              <AButton @click="reset">
                <div class="flex-y-center gap-8px">
                  <icon-ic-round-refresh class="text-icon" />
                  <span>{{ $t('common.reset') }}</span>
                </div>
              </AButton>
              <AButton type="primary" ghost @click="search">
                <div class="flex-y-center gap-8px">
                  <icon-ic-round-search class="text-icon" />
                  <span>{{ $t('common.search') }}</span>
                </div>
              </AButton>
            </div>
          </AFormItem>
        </ACol>
      </ARow>
    </AForm>
  </ACard>
</template>

<style scoped></style>
