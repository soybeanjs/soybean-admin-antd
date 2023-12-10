<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Clipboard from 'clipboard';
import { $t } from '@/locales';
import { useThemeStore } from '@/store/modules/theme';

defineOptions({
  name: 'ConfigOperation'
});

const themeStore = useThemeStore();

const domRef = ref<HTMLElement | null>(null);

function initClipboard() {
  if (!domRef.value) return;

  const clipboard = new Clipboard(domRef.value, {
    text: () => getClipboardText()
  });

  clipboard.on('success', () => {
    window.$message?.success($t('theme.configOperation.copySuccessMsg'));
  });
}

function getClipboardText() {
  const reg = /"\w+":/g;

  const json = themeStore.settingsJson;

  return json.replace(reg, match => match.replace(/"/g, ''));
}

function handleReset() {
  themeStore.resetStore();

  setTimeout(() => {
    window.$message?.success($t('theme.configOperation.resetSuccessMsg'));
  }, 50);
}

onMounted(() => {
  initClipboard();
});
</script>

<template>
  <div class="flex justify-between">
    <AButton danger @click="handleReset">{{ $t('theme.configOperation.resetConfig') }}</AButton>
    <div ref="domRef">
      <AButton type="primary">{{ $t('theme.configOperation.copyConfig') }}</AButton>
    </div>
  </div>
</template>

<style scoped></style>
