<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({ name: 'ColorSchemaSwitch' });

interface Props {
  themeSchema: UnionKey.ThemeScheme;
  isDark: boolean;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'switch'): void;
}

const emit = defineEmits<Emits>();

function handleSwitch() {
  emit('switch');
}

const icons: Record<UnionKey.ThemeScheme, string> = {
  light: 'material-symbols:sunny',
  dark: 'material-symbols:nightlight-rounded',
  auto: 'material-symbols:hdr-auto'
};

const icon = computed(() => icons[props.themeSchema]);
</script>

<template>
  <ButtonIcon :icon="icon" :tooltip-content="$t('icon.themeSchema')" @click="handleSwitch" />
</template>

<style scoped></style>
