<script setup lang="ts">
import { computed } from 'vue';
import { watermarkTimeFormatOptions } from '@/constants/app';
import { $t } from '@/locales';
import { useThemeStore } from '@/store/modules/theme';
import SettingItem from '../../../components/setting-item.vue';

defineOptions({
  name: 'WatermarkSettings'
});

const themeStore = useThemeStore();

/** ant-design-vue passes `boolean | string | number` to the `update:checked` handler */
function handleWatermarkEnableUserName(enable: boolean | string | number) {
  themeStore.setWatermarkEnableUserName(Boolean(enable));
}

function handleWatermarkEnableTime(enable: boolean | string | number) {
  themeStore.setWatermarkEnableTime(Boolean(enable));
}

const isWatermarkTextVisible = computed(
  () => themeStore.watermark.visible && !themeStore.watermark.enableUserName && !themeStore.watermark.enableTime
);
</script>

<template>
  <ADivider>{{ $t('theme.general.watermark.title') }}</ADivider>
  <TransitionGroup tag="div" name="setting-list" class="flex-col-stretch gap-12px">
    <SettingItem key="1" :label="$t('theme.general.watermark.visible')">
      <ASwitch v-model:checked="themeStore.watermark.visible" />
    </SettingItem>
    <SettingItem v-if="themeStore.watermark.visible" key="2" :label="$t('theme.general.watermark.enableUserName')">
      <ASwitch :checked="themeStore.watermark.enableUserName" @update:checked="handleWatermarkEnableUserName" />
    </SettingItem>
    <SettingItem v-if="themeStore.watermark.visible" key="3" :label="$t('theme.general.watermark.enableTime')">
      <ASwitch :checked="themeStore.watermark.enableTime" @update:checked="handleWatermarkEnableTime" />
    </SettingItem>
    <SettingItem
      v-if="themeStore.watermark.visible && themeStore.watermark.enableTime"
      key="4"
      :label="$t('theme.general.watermark.timeFormat')"
    >
      <ASelect
        v-model:value="themeStore.watermark.timeFormat"
        :options="watermarkTimeFormatOptions"
        size="small"
        class="w-210px"
      />
    </SettingItem>
    <SettingItem v-if="isWatermarkTextVisible" key="5" :label="$t('theme.general.watermark.text')">
      <AInput
        v-model:value="themeStore.watermark.text"
        type="text"
        size="small"
        class="w-120px"
        placeholder="SoybeanAdmin"
      />
    </SettingItem>
  </TransitionGroup>
</template>

<style scoped>
.setting-list-move,
.setting-list-enter-active,
.setting-list-leave-active {
  --uno: transition-all-300;
}

.setting-list-enter-from,
.setting-list-leave-to {
  --uno: opacity-0 -translate-x-30px;
}

.setting-list-leave-active {
  --uno: absolute;
}
</style>
