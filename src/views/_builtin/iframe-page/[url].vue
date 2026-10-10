<script setup lang="ts">
import { computed } from 'vue';
import { getEmbeddedURL } from '@/utils/url';
import { $t } from '@/locales';

const props = defineProps<{ url: string }>();
const embeddedURL = computed(() => getEmbeddedURL(props.url));
</script>

<template>
  <div class="h-full">
    <iframe
      v-if="embeddedURL"
      class="size-full"
      :src="embeddedURL"
      :title="$t('common.embeddedPage')"
      referrerpolicy="no-referrer"
    ></iframe>
    <AAlert v-else :message="$t('common.loadFailed')" type="error" show-icon />
  </div>
</template>
