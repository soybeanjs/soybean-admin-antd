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
      <div class="flex-y-center gap-8px">
        <icon-ant-design-setting-outlined class="text-icon" />
        <span>{{ $t('common.columnSetting') }}</span>
      </div>
    </AButton>
    <template #content>
      <VueDraggable v-model="columns">
        <div
          v-for="item in columns"
          :key="item.key"
          class="h-36px flex-y-center rd-4px hover:(bg-primary bg-opacity-20)"
        >
          <icon-mdi-drag class="mr-8px cursor-move text-icon" />
          <ACheckbox v-model:checked="item.checked">
            {{ item.title }}
          </ACheckbox>
        </div>
      </VueDraggable>
    </template>
  </APopover>
</template>

<style scoped></style>
