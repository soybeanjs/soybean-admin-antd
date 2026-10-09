declare namespace AntDesign {
  type TableColumnType<T> = import('ant-design-vue').TableColumnType<T>;
  type TableColumnGroupType<T> = import('ant-design-vue').TableColumnGroupType<T>;
  type TablePaginationConfig = import('ant-design-vue').TablePaginationConfig;
  type TableColumnCheck = import('@sa/hooks').TableColumnCheck;
  type TableColumnFixed = import('@sa/hooks').TableColumnCheck['fixed'];
  type FlatResponseData<T> = import('@sa/axios').FlatResponseData<T>;

  type TableData = Api.Common.CommonRecord<object>;

  /** table column align */
  type Align = 'left' | 'center' | 'right';

  /**
   * the custom column key
   *
   * if you want to add a custom column, you should add a key to this type
   */
  type CustomColumnKey = 'operate' | 'index';

  type SetTableColumnKey<C, T> = Omit<C, 'key'> & { key?: keyof T | CustomColumnKey };

  type TableColumnTypeWithKey<T> = SetTableColumnKey<TableColumnType<T>, T>;

  type TableColumn<T> = SetTableColumnKey<TableColumnType<T>, T> | SetTableColumnKey<TableColumnGroupType<T>, T>;

  type TableColumnWithKey<T> = TableColumnTypeWithKey<T> & { key: string };

  type TableApiFn<T = any, R = Api.Common.CommonSearchParams> = (
    params: R
  ) => Promise<FlatResponseData<Api.Common.PaginatingQueryRecord<T>>>;

  /**
   * the type of table operation
   *
   * - add: add table item
   * - edit: edit table item
   */
  type TableOperateType = 'add' | 'edit';

  type GetTableData<A extends TableApiFn> = A extends TableApiFn<infer T> ? T : never;

  type AntdTableConfig<A extends TableApiFn> = Omit<
    import('@sa/hooks').UseTableOptions<Awaited<ReturnType<A>>, GetTableData<A>, TableColumn<GetTableData<A>>, true>,
    'pagination' | 'getColumnChecks' | 'getColumns' | 'transform'
  >;
}
