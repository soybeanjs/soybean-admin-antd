<script setup lang="ts">
import { ColorPicker } from '@sa/materials';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import SettingItem from '../components/setting-item.vue';

defineOptions({
  name: 'ThemeColor'
});

const themeStore = useThemeStore();
</script>

<template>
  <ADivider>{{ $t('theme.themeColor.title') }}</ADivider>
  <div class="flex-vertical-stretch gap-12px">
    <SettingItem v-for="(_, key) in themeStore.themeColors" :key="key" :label="$t(`theme.themeColor.${key}`)">
      <template v-if="key === 'info'" #suffix>
        <ACheckbox v-model:checked="themeStore.isCustomizeInfoColor">
          {{ $t('theme.themeColor.followPrimary') }}
        </ACheckbox>
      </template>
      <ColorPicker
        v-model:color="themeStore.themeColors[key]"
        :disabled="key === 'info' && !themeStore.isCustomizeInfoColor"
      />
    </SettingItem>
  </div>
</template>

<style scoped></style>
