<script setup lang="ts">
defineOptions({
  name: 'TableHeaderOperation'
});

interface Props {
  disabledDelete?: boolean;
  loading?: boolean;
}

defineProps<Props>();

interface Emits {
  (e: 'add'): void;
  (e: 'delete'): void;
  (e: 'refresh'): void;
}

const emit = defineEmits<Emits>();

const columns = defineModel<AntDesign.TableColumnCheck[]>('columns', {
  default: () => []
});

function add() {
  emit('add');
}

function batchDelete() {
  emit('delete');
}

function refresh() {
  emit('refresh');
}
</script>

<template>
  <div class="flex flex-wrap justify-end gap-x-12px gap-y-8px lt-sm:(w-200px py-12px)">
    <slot name="prefix"></slot>
    <slot name="default">
      <AButton size="small" ghost type="primary" @click="add">
        <div class="flex-y-center gap-8px">
          <icon-ic-round-plus class="text-icon" />
          <span>{{ $t('common.add') }}</span>
        </div>
      </AButton>
      <APopconfirm :description="$t('common.confirmDelete')" :disabled="disabledDelete" @confirm="batchDelete">
        <AButton size="small" danger :disabled="disabledDelete">
          <div class="flex-y-center gap-8px">
            <icon-ic-round-delete class="text-icon" />
            <span>{{ $t('common.batchDelete') }}</span>
          </div>
        </AButton>
      </APopconfirm>
    </slot>
    <AButton size="small" @click="refresh">
      <div class="flex-y-center gap-8px">
        <icon-mdi-refresh class="text-icon" :class="{ 'animate-spin': loading }" />
        <span>{{ $t('common.refresh') }}</span>
      </div>
    </AButton>
    <TableColumnSetting v-model:columns="columns" />
    <slot name="suffix"></slot>
  </div>
</template>

<style scoped></style>
