<script setup lang="ts">
import { $t } from '@/locales';

defineOptions({
  name: 'CreativityBanner'
});
</script>

<template>
  <ACard
    :title="$t('page.home.creativity')"
    :bordered="false"
    size="small"
    class="card-wrapper flex-vertical-stretch h-full"
    :body-style="{ flex: 1, overflow: 'hidden' }"
  >
    <div class="flex-center h-full">
      <IconLocalBanner class="text-400px sm:text-320px text-primary" />
    </div>
  </ACard>
</template>

<style scoped></style>
