<script setup lang="tsx">
import { ref } from 'vue';
import { Button, Popconfirm, Tag } from 'ant-design-vue';
import type { Ref } from 'vue';
import { useBoolean } from '@sa/hooks';
import { fetchGetAllPages, fetchGetMenuList } from '@/service/api';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import { yesOrNoRecord } from '@/constants/common';
import { enableStatusRecord, menuTypeRecord } from '@/constants/business';
import SvgIcon from '@/components/custom/svg-icon.vue';
import MenuOperateModal, { type OperateType } from './modules/menu-operate-modal.vue';

const { bool: visible, setTrue: openModal } = useBoolean();

const { columns, columnChecks, data, loading, pagination, getData } = useTable({
  apiFn: fetchGetMenuList,
  columns: () => [
    {
      key: 'id',
      title: $t('page.manage.menu.id'),
      align: 'center',
      dataIndex: 'id'
    },
    {
      key: 'menuType',
      title: $t('page.manage.menu.menuType'),
      align: 'center',
      width: 80,
      customRender: ({ record }) => {
        const tagMap: Record<Api.Common.EnableStatus, string> = {
          1: 'default',
          2: 'processing'
        };

        const label = $t(menuTypeRecord[record.menuType]);

        return <Tag color={tagMap[record.menuType]}>{label}</Tag>;
      }
    },
    {
      key: 'menuName',
      title: $t('page.manage.menu.menuName'),
      align: 'center',
      minWidth: 120,
      customRender: ({ record }) => {
        const { i18nKey, menuName } = record;

        const label = i18nKey ? $t(i18nKey) : menuName;

        return <span>{label}</span>;
      }
    },
    {
      key: 'icon',
      title: $t('page.manage.menu.icon'),
      align: 'center',
      width: 60,
      customRender: ({ record }) => {
        const icon = record.iconType === '1' ? record.icon : undefined;

        const localIcon = record.iconType === '2' ? record.icon : undefined;

        return (
          <div class="flex-center">
            <SvgIcon icon={icon} localIcon={localIcon} class="text-icon" />
          </div>
        );
      }
    },
    {
      key: 'routeName',
      title: $t('page.manage.menu.routeName'),
      align: 'center',
      dataIndex: 'routeName',
      minWidth: 120
    },
    {
      key: 'routePath',
      title: $t('page.manage.menu.routePath'),
      align: 'center',
      dataIndex: 'routePath',
      minWidth: 120
    },
    {
      key: 'status',
      title: $t('page.manage.menu.menuStatus'),
      align: 'center',
      width: 80,
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
      key: 'hideInMenu',
      title: $t('page.manage.menu.hideInMenu'),
      dataIndex: 'hideInMenu',
      align: 'center',
      width: 80,
      customRender: ({ record }) => {
        const hide: CommonType.YesOrNo = record.hideInMenu ? 'Y' : 'N';

        const tagMap: Record<CommonType.YesOrNo, string> = {
          Y: 'error',
          N: 'default'
        };

        const label = $t(yesOrNoRecord[hide]);

        return <Tag color={tagMap[hide]}>{label}</Tag>;
      }
    },
    {
      key: 'parentId',
      dataIndex: 'parentId',
      title: $t('page.manage.menu.parentId'),
      width: 90,
      align: 'center'
    },
    {
      key: 'order',
      dataIndex: 'order',
      title: $t('page.manage.menu.order'),
      align: 'center',
      width: 60
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 230,
      customRender: ({ record }) => (
        <div class="flex-center justify-end gap-8px">
          {record.menuType === '1' && (
            <Button type="primary" ghost size="small" onClick={() => handleAddChildMenu(record)}>
              {$t('page.manage.menu.addChildMenu')}
            </Button>
          )}
          <Button type="primary" ghost size="small" onClick={() => handleEdit(record)}>
            {$t('common.edit')}
          </Button>
          <Popconfirm title={$t('common.confirmDelete')} onConfirm={() => handleDelete(record.id)}>
            <Button danger ghost size="small">
              {$t('common.delete')}
            </Button>
          </Popconfirm>
        </div>
      )
    }
  ]
});

const { checkedRowKeys, onBatchDeleted, onDeleted, onSelectChange } = useTableOperate(data, getData);

const operateType = ref<OperateType>('add');

function handleAdd() {
  operateType.value = 'add';
  openModal();
}

async function handleBatchDelete() {
  // request

  onBatchDeleted();
}

function handleDelete(id: number) {
  // request
  console.log(id);

  onDeleted();
}
/** the edit menu data or the parent menu data when adding a child menu */
const editingData: Ref<Api.SystemManage.Menu | null> = ref(null);

function handleEdit(item: Api.SystemManage.Menu) {
  operateType.value = 'edit';
  editingData.value = { ...item };

  openModal();
}

function handleAddChildMenu(item: Api.SystemManage.Menu) {
  operateType.value = 'addChild';

  editingData.value = { ...item };

  openModal();
}

const allPages = ref<string[]>([]);

async function getAllPages() {
  const { data: pages } = await fetchGetAllPages();
  allPages.value = pages || [];
}

function init() {
  getAllPages();
}

// init
init();
</script>

<template>
  <div class="flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <ACard :title="$t('page.manage.menu.title')" :bordered="false" class="sm:flex-1-hidden card-wrapper">
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
        :columns="columns"
        :data-source="data"
        :row-selection="{
          type: 'checkbox',
          selectedRowKeys: checkedRowKeys,
          onChange: onSelectChange
        }"
        size="small"
        :loading="loading"
        row-key="id"
        :scroll="{ x: 702 }"
        :pagination="pagination"
        class="sm:h-full"
      />
      <MenuOperateModal
        v-model:visible="visible"
        :operate-type="operateType"
        :row-data="editingData"
        :all-pages="allPages"
        @submitted="getData"
      />
    </ACard>
  </div>
</template>

<style scoped></style>
