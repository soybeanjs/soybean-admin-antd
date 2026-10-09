import { computed, effectScope, onScopeDispose, reactive, shallowRef, toValue, watch } from 'vue';
import type { MaybeRef, Ref } from 'vue';
import { useElementSize } from '@vueuse/core';
import type { TablePaginationConfig } from 'ant-design-vue';
import type { FlatResponseData } from '@sa/axios';
import { useBoolean, useTable as useHookTable } from '@sa/hooks';
import type { PaginationData, TableColumnCheck, TableColumnCheckTitle, UseTableOptions } from '@sa/hooks';
import { jsonClone } from '@sa/utils';
import type { TableRowSelection } from 'ant-design-vue/es/table/interface';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';

type TableData = AntDesign.TableData;
type TableColumn<T> = AntDesign.TableColumn<T>;

export type UseAntdTableOptions<ResponseData, ApiData, Pagination extends boolean> = Omit<
  UseTableOptions<ResponseData, ApiData, TableColumn<ApiData>, Pagination>,
  'pagination' | 'getColumnChecks' | 'getColumns'
> & {
  /**
   * get column visible
   *
   * @param column
   *
   * @default true
   *
   * @returns true if the column is visible, false otherwise
   */
  getColumnVisible?: (column: TableColumn<ApiData>) => boolean;
};

type PaginationParams = {
  page: number;
  pageSize: number;
};

type UseAntdPaginatedTableOptions<ResponseData, ApiData> = UseAntdTableOptions<ResponseData, ApiData, true> & {
  paginationProps?: Omit<TablePaginationConfig, 'current' | 'pageSize' | 'total'>;
  /**
   * whether to show the total count of the table
   *
   * @default true
   */
  showTotal?: boolean;
  onPaginationParamsChange?: (params: PaginationParams) => void | Promise<void>;
};

export function useAntdTable<ResponseData, ApiData>(options: UseAntdTableOptions<ResponseData, ApiData, false>) {
  const scope = effectScope();
  const appStore = useAppStore();

  const result = useHookTable<ResponseData, ApiData, TableColumn<ApiData>, false>({
    ...options,
    getColumnChecks: cols => getColumnChecks(cols, options.getColumnVisible),
    getColumns
  });

  scope.run(() => {
    watch(
      () => appStore.locale,
      () => {
        result.reloadColumns();
      }
    );
  });

  onScopeDispose(() => {
    scope.stop();
  });

  return result;
}

export function useTable<ResponseData, ApiData>(options: UseAntdPaginatedTableOptions<ResponseData, ApiData>) {
  const scope = effectScope();
  const appStore = useAppStore();

  const showTotal = computed(() => options.showTotal ?? true);

  const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['10', '15', '20', '25', '30'],
    showTotal: showTotal.value ? (total: number) => $t('datatable.itemCount', { total }) : undefined,
    onChange(current: number, pageSize: number) {
      pagination.current = current;
      pagination.pageSize = pageSize;
    },
    ...options.paginationProps
  }) as TablePaginationConfig;

  // this is for mobile, if the system does not support mobile, you can use `pagination` directly
  const mobilePagination = computed(() => {
    const p: TablePaginationConfig = {
      ...pagination,
      simple: appStore.isMobile
    };

    return p;
  });

  const paginationParams = computed<PaginationParams>(() => {
    const { current, pageSize } = pagination;

    return {
      page: current ?? 1,
      pageSize: pageSize ?? 10
    };
  });

  const result = useHookTable<ResponseData, ApiData, TableColumn<ApiData>, true>({
    ...options,
    pagination: true,
    getColumnChecks: cols => getColumnChecks(cols, options.getColumnVisible),
    getColumns,
    onFetched: async data => {
      pagination.total = data.total;
      pagination.pageSize = data.pageSize;
    }
  });

  /**
   * get data by page number
   *
   * @param page the page number. default is 1
   */
  async function getDataByPage(page: number = 1) {
    if (page !== pagination.current) {
      pagination.current = page;

      return;
    }

    await result.getData();
  }

  scope.run(() => {
    watch(
      () => appStore.locale,
      () => {
        result.reloadColumns();
      }
    );

    watch(paginationParams, async newVal => {
      await options.onPaginationParamsChange?.(newVal);

      await result.getData();
    });
  });

  onScopeDispose(() => {
    scope.stop();
  });

  return {
    ...result,
    getDataByPage,
    pagination,
    mobilePagination
  };
}

export function useTableOperate<T extends TableData = TableData>(data: Ref<T[]>, getData: () => Promise<void>) {
  const { bool: drawerVisible, setTrue: openDrawer, setFalse: closeDrawer } = useBoolean();

  const operateType = shallowRef<AntDesign.TableOperateType>('add');
  function handleAdd() {
    operateType.value = 'add';
    openDrawer();
  }

  /** the editing row data */
  const editingData: Ref<T | null> = shallowRef(null);

  function handleEdit(id: T['id']) {
    operateType.value = 'edit';
    const findItem = data.value.find(item => item.id === id) || null;
    editingData.value = jsonClone(findItem);

    openDrawer();
  }

  /** the checked row keys of table */
  const checkedRowKeys: Ref<T['id'][]> = shallowRef([]);

  function onSelectChange(keys: (string | number)[]) {
    checkedRowKeys.value = keys as T['id'][];
  }

  const rowSelection = computed<TableRowSelection<T>>(() => {
    return {
      columnWidth: 48,
      type: 'checkbox',
      selectedRowKeys: checkedRowKeys.value,
      onChange: onSelectChange
    };
  });

  /** the hook after the batch delete operation is completed */
  async function onBatchDeleted() {
    window.$message?.success($t('common.deleteSuccess'));

    checkedRowKeys.value = [];

    await getData();
  }

  /** the hook after the delete operation is completed */
  async function onDeleted() {
    window.$message?.success($t('common.deleteSuccess'));

    await getData();
  }

  return {
    drawerVisible,
    openDrawer,
    closeDrawer,
    operateType,
    handleAdd,
    editingData,
    handleEdit,
    checkedRowKeys,
    onSelectChange,
    rowSelection,
    onBatchDeleted,
    onDeleted
  };
}

export function useTableScroll(scrollX: MaybeRef<number> = 702) {
  const tableWrapperRef = shallowRef<HTMLElement | null>(null);
  const { height: wrapperElHeight } = useElementSize(tableWrapperRef);

  const scrollConfig = computed(() => {
    return {
      y: wrapperElHeight.value - 72,
      x: toValue(scrollX)
    };
  });

  return {
    tableWrapperRef,
    scrollConfig
  };
}

export function defaultTransform<ApiData>(
  response: FlatResponseData<any, Api.Common.PaginatingQueryRecord<ApiData>>
): PaginationData<ApiData> {
  const { data, error } = response;

  if (!error) {
    const { records, current, size, total } = data;

    return {
      data: records,
      pageNum: current,
      pageSize: size,
      total
    };
  }

  return {
    data: [],
    pageNum: 1,
    pageSize: 10,
    total: 0
  };
}

function getColumnChecks<Column extends TableColumn<any>>(
  cols: Column[],
  getColumnVisible?: (column: Column) => boolean
) {
  const checks: TableColumnCheck[] = [];

  cols.forEach(column => {
    if (isTableColumnHasKey(column)) {
      checks.push({
        key: column.key as string,
        // ant-design-vue column title may be a VNode, which the shared `TableColumnCheckTitle` cannot express
        title: column.title as TableColumnCheckTitle,
        checked: true,
        fixed: normalizeColumnFixed(column.fixed),
        visible: getColumnVisible?.(column) ?? true
      });
    }
  });

  return checks;
}

/**
 * Normalize the ant-design-vue column fixed value
 *
 * @param fixed the fixed value of the column
 *
 * @returns the normalized fixed value, `true` means fixed to left
 */
function normalizeColumnFixed(fixed: boolean | 'left' | 'right' | undefined): AntDesign.TableColumnFixed {
  if (fixed === true) {
    return 'left';
  }

  if (fixed === false || fixed === undefined) {
    return 'unFixed';
  }

  return fixed;
}

function getColumns<Column extends TableColumn<any>>(cols: Column[], checks: TableColumnCheck[]) {
  const columnMap = new Map<string, Column>();

  cols.forEach(column => {
    if (isTableColumnHasKey(column)) {
      columnMap.set(column.key as string, column);
    }
  });

  const filteredColumns = checks
    .filter(item => item.checked)
    .map(check => {
      return {
        ...columnMap.get(check.key),
        fixed: check.fixed === 'unFixed' ? undefined : check.fixed
      } as Column;
    });

  return filteredColumns;
}

export function isTableColumnHasKey<T>(column: TableColumn<T>): column is AntDesign.TableColumnWithKey<T> {
  return Boolean((column as AntDesign.TableColumnWithKey<T>).key);
}
