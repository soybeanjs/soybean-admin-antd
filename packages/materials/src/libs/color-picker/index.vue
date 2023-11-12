<script setup lang="ts">
import { computed } from 'vue';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';

defineOptions({
  name: 'ColorPicker'
});

interface Props {
  darkMode?: boolean;
}

const props = defineProps<Props>();

const color = defineModel<string>('color');

const theme = computed(() => (props.darkMode ? 'black' : 'white'));
</script>

<template>
  <ColorPicker v-model:pure-color="color" :theme="theme" />
</template>

<style scoped></style>
