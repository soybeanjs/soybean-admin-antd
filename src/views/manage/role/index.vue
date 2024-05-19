<script setup lang="tsx">
import { computed, shallowRef } from 'vue';
import { Button, Popconfirm, Tag } from 'ant-design-vue';
import { useElementSize } from '@vueuse/core';
import { fetchGetRoleList } from '@/service/api';
// import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import { enableStatusRecord } from '@/constants/business';
import RoleOperateDrawer from './modules/role-operate-drawer.vue';
import RoleSearch from './modules/role-search.vue';

// const appStore = useAppStore();

const wrapperEl = shallowRef<HTMLElement | null>(null);
const { height: wrapperElHeight } = useElementSize(wrapperEl);

const scrollConfig = computed(() => {
  return {
    y: wrapperElHeight.value - 72,
    x: 702
  };
});

const { columns, columnChecks, data, loading, getData, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: fetchGetRoleList,
  apiParams: {
    current: 1,
    size: 10,
    status: undefined,
    roleName: undefined,
    roleCode: undefined
  },
  columns: () => [
    {
      key: 'index',
      dataIndex: 'index',
      title: $t('common.index'),
      width: 64,
      align: 'center'
    },
    {
      key: 'roleName',
      dataIndex: 'roleName',
      title: $t('page.manage.role.roleName'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'roleCode',
      dataIndex: 'roleCode',
      title: $t('page.manage.role.roleCode'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'roleDesc',
      dataIndex: 'roleDesc',
      title: $t('page.manage.role.roleDesc'),
      minWidth: 120
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: $t('page.manage.role.roleStatus'),
      align: 'center',
      width: 100,
      customRender: ({ record }) => {
        if (record.status === null) {
          return null;
        }

        const tagMap: Record<Api.Common.EnableStatus, string> = {
          1: 'success',
          2: 'warning'
        };

        const label = $t(enableStatusRecord[record.status]);

        return <Tag color={tagMap[record.status]}>{label}</Tag>;
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      customRender: ({ record }) => (
        <div class="flex-center gap-8px">
          <Button type="primary" ghost size="small" onClick={() => edit(record.id)}>
            {$t('common.edit')}
          </Button>
          <Popconfirm onConfirm={() => handleDelete(record.id)} title={$t('common.confirmDelete')}>
            <Button danger size="small">
              {$t('common.delete')}
            </Button>
          </Popconfirm>
        </div>
      )
    }
  ]
});

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted,
  onSelectChange
  // closeDrawer
} = useTableOperate(data, getData);

async function handleBatchDelete() {
  // request

  onBatchDeleted();
}

function handleDelete(id: number) {
  // request
  console.log(id);

  onDeleted();
}

function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <RoleSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData" />
    <ACard
      :title="$t('page.manage.role.title')"
      :bordered="false"
      :body-style="{ flex: 1, overflow: 'hidden' }"
      class="flex-col-stretch sm:flex-1-hidden card-wrapper"
    >
      <template #extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <ATable
        ref="wrapperEl"
        :columns="columns"
        :data-source="data"
        :row-selection="{
          type: 'checkbox',
          selectedRowKeys: checkedRowKeys,
          onChange: onSelectChange
        }"
        :loading="loading"
        row-key="id"
        size="small"
        :pagination="mobilePagination"
        :scroll="scrollConfig"
        class="h-full"
      />
      <RoleOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </ACard>
  </div>
</template>

<style scoped></style>
