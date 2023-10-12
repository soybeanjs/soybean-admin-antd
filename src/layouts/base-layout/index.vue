<script setup lang="ts">
import { AdminLayout } from '@sa/materials';
import GlobalHeader from '../modules/global-header/index.vue';
import GlobalSider from '../modules/global-sider/index.vue';
import GlobalTab from '../modules/global-tab/index.vue';
import GlobalContent from '../modules/global-content/index.vue';
import GlobalFooter from '../modules/global-footer/index.vue';

defineOptions({
  name: 'BaseLayout'
});
</script>

<template>
  <AdminLayout>
    <template #header>
      <GlobalHeader />
    </template>
    <template #tab>
      <GlobalTab />
    </template>
    <template #sider>
      <GlobalSider />
    </template>
    <GlobalContent />
    <template #footer>
      <GlobalFooter />
    </template>
  </AdminLayout>
</template>

<style scoped></style>
