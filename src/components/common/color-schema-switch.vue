<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'ColorSchemaSwitch' });

interface Props {
  colorSchema: App.Theme.ColorScheme;
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

const icons: Record<App.Theme.ColorScheme, string> = {
  light: 'material-symbols:sunny',
  dark: 'material-symbols:nightlight-rounded',
  auto: 'material-symbols:hdr-auto'
};

const icon = computed(() => icons[props.colorSchema]);
</script>

<template>
  <AButton type="text" class="h-full text-icon" @click="handleSwitch">
    <SvgIcon :icon="icon" />
  </AButton>
</template>

<style scoped></style>
