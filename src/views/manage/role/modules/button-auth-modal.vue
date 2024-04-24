<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import type { DataNode } from 'ant-design-vue/es/tree';
import { $t } from '@/locales';

defineOptions({
  name: 'ButtonAuthModal'
});

interface Props {
  /** the roleId */
  roleId: number;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

function closeModal() {
  visible.value = false;
}

const title = computed(() => $t('common.edit') + $t('page.manage.role.buttonAuth'));

const tree = shallowRef<DataNode[]>([]);

async function getAllButtons() {
  // request
  tree.value = [
    { key: 1, title: 'button1', code: 'code1' },
    { key: 2, title: 'button2', code: 'code2' },
    { key: 3, title: 'button3', code: 'code3' },
    { key: 4, title: 'button4', code: 'code4' },
    { key: 5, title: 'button5', code: 'code5' },
    { key: 6, title: 'button6', code: 'code6' },
    { key: 7, title: 'button7', code: 'code7' },
    { key: 8, title: 'button8', code: 'code8' },
    { key: 9, title: 'button9', code: 'code9' },
    { key: 10, title: 'button10', code: 'code10' }
  ];
}

const checks = shallowRef<number[]>([]);

async function getChecks() {
  console.log(props.roleId);
  // request
  checks.value = [1, 2, 3, 4, 5];
}

function handleSubmit() {
  console.log(checks.value, props.roleId);
  // request

  window.$message?.success?.($t('common.modifySuccess'));

  closeModal();
}

function init() {
  getAllButtons();
  getChecks();
}

// init
init();
</script>

<template>
  <AModal v-model:open="visible" :title="title" class="w-480px">
    <ATree v-model:checked-keys="checks" :tree-data="tree" checkable :height="280" class="h-280px" />
    <template #footer>
      <AButton size="small" class="mt-16px" @click="closeModal">
        {{ $t('common.cancel') }}
      </AButton>
      <AButton type="primary" size="small" class="mt-16px" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </AButton>
    </template>
  </AModal>
</template>

<style scoped></style>
