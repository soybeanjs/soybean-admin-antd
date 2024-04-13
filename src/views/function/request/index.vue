<script setup lang="ts">
import { $t } from '@/locales';
import { fetchCustomBackendError } from '@/service/api';

async function logout() {
  await fetchCustomBackendError('8888', $t('request.logoutMsg'));
}

async function logoutWithModal() {
  await fetchCustomBackendError('7777', $t('request.logoutWithModalMsg'));
}

async function refreshToken() {
  await fetchCustomBackendError('9999', $t('request.tokenExpired'));
}
</script>

<template>
  <ASpace direction="vertical" :size="16">
    <ACard :title="$t('request.logout')" :bordered="false" size="small" class="card-wrapper">
      <AButton @click="logout">{{ $t('common.trigger') }}</AButton>
    </ACard>
    <ACard :title="$t('request.logoutWithModal')" :bordered="false" size="small" class="card-wrapper">
      <AButton @click="logoutWithModal">{{ $t('common.trigger') }}</AButton>
    </ACard>
    <ACard :title="$t('request.refreshToken')" :bordered="false" size="small" class="card-wrapper">
      <AButton @click="refreshToken">{{ $t('common.trigger') }}</AButton>
    </ACard>
  </ASpace>
</template>

<style scoped></style>
