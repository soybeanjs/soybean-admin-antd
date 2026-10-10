<script setup lang="ts">
import { onScopeDispose, ref, watch } from 'vue';

const props = defineProps<{ load: () => Promise<string> }>();
const markup = ref('');
let sequence = 0;

watch(
  () => props.load,
  async load => {
    sequence += 1;
    const current = sequence;
    markup.value = '';
    try {
      const svg = await load();
      if (current === sequence) markup.value = svg;
    } catch {
      // Illustrations are optional; a failed asset must not block navigation.
    }
  },
  { immediate: true }
);

onScopeDispose(() => {
  sequence += 1;
});
</script>

<template>
  <!-- Only bundled, repository-owned SVG markup is accepted by the loader. -->
  <!-- eslint-disable-next-line vue/no-v-html -->
  <span class="svg-illustration size-1em inline-flex" v-html="markup"></span>
</template>

<style scoped>
.svg-illustration :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
