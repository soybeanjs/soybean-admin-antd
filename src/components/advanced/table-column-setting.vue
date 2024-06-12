<script setup lang="ts" generic="T extends Record<string, unknown>, K = never">
import { VueDraggable } from 'vue-draggable-plus';
import { $t } from '@/locales';

defineOptions({
  name: 'TableColumnSetting'
});

const columns = defineModel<AntDesign.TableColumnCheck[]>('columns', {
  required: true
});
</script>

<template>
  <APopover placement="bottomRight" trigger="click">
    <AButton size="small">
      <template #icon>
        <icon-ant-design-setting-outlined class="align-sub text-icon" />
      </template>
      <span class="ml-8px">{{ $t('common.columnSetting') }}</span>
    </AButton>
    <template #content>
      <VueDraggable v-model="columns" :animation="150" filter=".none_draggable">
        <div
          v-for="item in columns"
          :key="item.key"
          class="h-36px flex-y-center rd-4px hover:(bg-primary bg-opacity-20)"
        >
          <icon-mdi-drag class="mr-8px h-full cursor-move text-icon" />
          <ACheckbox v-model:checked="item.checked" class="none_draggable flex-1">
            {{ item.title }}
          </ACheckbox>
        </div>
      </VueDraggable>
    </template>
  </APopover>
</template>

<style scoped></style>
