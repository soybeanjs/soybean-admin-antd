<script setup lang="tsx">
import { ref } from 'vue';
import { Button, Popconfirm, Tag } from 'ant-design-vue';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { notifyDemoAction } from '@/utils/demo';
import { fetchGetUserList } from '@/service/api';
import { $t } from '@/locales';
import { useRouterPush } from '@/hooks/common/router';
import { defaultTransform, useTable, useTableOperate, useTableScroll } from '@/hooks/common/table';
import UserOperateDrawer from './modules/user-operate-drawer.vue';
import UserSearch from './modules/user-search.vue';

const { routerPushByKey } = useRouterPush();
const { tableWrapperRef, scrollConfig } = useTableScroll();

const searchParams = ref<Api.SystemManage.UserSearchParams>({
  current: 1,
  size: 10,
  // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
  // the value can not be undefined, otherwise the property in Form will not be reactive
  status: undefined,
  userName: undefined,
  userGender: undefined,
  nickName: undefined,
  userPhone: undefined,
  userEmail: undefined
});

const defaultSearchParams = { ...searchParams.value };
function resetSearchParams() {
  searchParams.value = { ...defaultSearchParams };
}

const { columns, columnChecks, data, loading, error, getData, getDataByPage, mobilePagination } = useTable({
  api: () => fetchGetUserList(searchParams.value),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.value.current = params.page;
    searchParams.value.size = params.pageSize;
  },
  columns: () => [
    {
      key: 'index',
      title: $t('common.index'),
      dataIndex: 'index',
      align: 'center',
      width: 64
    },
    {
      key: 'userName',
      dataIndex: 'userName',
      title: $t('page.manage.user.userName'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'userGender',
      title: $t('page.manage.user.userGender'),
      align: 'center',
      dataIndex: 'userGender',
      width: 100,
      customRender: ({ record }) => {
        if (record.userGender === null) {
          return null;
        }

        const tagMap: Record<Api.SystemManage.UserGender, string> = {
          1: 'processing',
          2: 'error'
        };

        const label = $t(userGenderRecord[record.userGender]);

        return <Tag color={tagMap[record.userGender]}>{label}</Tag>;
      }
    },
    {
      key: 'nickName',
      dataIndex: 'nickName',
      title: $t('page.manage.user.nickName'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'userPhone',
      dataIndex: 'userPhone',
      title: $t('page.manage.user.userPhone'),
      align: 'center',
      width: 120
    },
    {
      key: 'userEmail',
      dataIndex: 'userEmail',
      title: $t('page.manage.user.userEmail'),
      align: 'center',
      minWidth: 200
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: $t('page.manage.user.userStatus'),
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
      width: 190,
      customRender: ({ record }) => (
        <div class="flex-center gap-8px">
          <Button
            type="link"
            size="small"
            onClick={() => routerPushByKey('manage_user-detail', { params: { id: String(record.id) } })}
          >
            {$t('workspace.viewDetail')}
          </Button>
          <Button type="primary" ghost size="small" onClick={() => edit(record.id)}>
            {$t('common.edit')}
          </Button>
          <Popconfirm title={$t('common.confirmDelete')} onConfirm={() => handleDelete(record.id)}>
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
  rowSelection
  // closeDrawer
} = useTableOperate(data, getData);

async function handleBatchDelete() {
  notifyDemoAction();
}

function handleDelete(_id: number) {
  notifyDemoAction();
}

function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <UserSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <AAlert v-if="error" :message="$t('common.loadFailed')" type="error" show-icon />
    <AAlert :message="$t('common.demoOnly')" type="info" show-icon />
    <ACard
      :title="$t('page.manage.user.title')"
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
        ref="tableWrapperRef"
        :columns="columns"
        :data-source="data"
        size="small"
        :row-selection="rowSelection"
        :scroll="scrollConfig"
        :loading="loading"
        row-key="id"
        :pagination="mobilePagination"
        class="h-full"
      />

      <UserOperateDrawer v-model:visible="drawerVisible" :operate-type="operateType" :row-data="editingData" />
    </ACard>
  </div>
</template>

<style scoped></style>
