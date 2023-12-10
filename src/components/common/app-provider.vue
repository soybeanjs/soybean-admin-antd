<script setup lang="ts">
import { createTextVNode, defineComponent } from 'vue';
import { App } from 'ant-design-vue';

defineOptions({
  name: 'AppProvider'
});

const ContextHolder = defineComponent({
  name: 'ContextHolder',
  setup() {
    const { message, modal, notification } = App.useApp();

    function register() {
      window.$message = message;
      window.$modal = modal;
      window.$notification = notification;
    }

    register();

    return () => createTextVNode();
  }
});
</script>

<template>
  <App class="h-full">
    <ContextHolder />
    <slot></slot>
  </App>
</template>

<style scoped></style>
