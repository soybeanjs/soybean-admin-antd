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

async function handleRepeatedMessageError() {
  await Promise.all([
    fetchCustomBackendError('2222', $t('page.function.request.repeatedErrorMsg1')),
    fetchCustomBackendError('2222', $t('page.function.request.repeatedErrorMsg1')),
    fetchCustomBackendError('2222', $t('page.function.request.repeatedErrorMsg1')),
    fetchCustomBackendError('3333', $t('page.function.request.repeatedErrorMsg2')),
    fetchCustomBackendError('3333', $t('page.function.request.repeatedErrorMsg2')),
    fetchCustomBackendError('3333', $t('page.function.request.repeatedErrorMsg2'))
  ]);
}

async function handleRepeatedModalError() {
  await Promise.all([
    fetchCustomBackendError('7777', $t('request.logoutWithModalMsg')),
    fetchCustomBackendError('7777', $t('request.logoutWithModalMsg')),
    fetchCustomBackendError('7777', $t('request.logoutWithModalMsg'))
  ]);
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
    <ACard
      :title="$t('page.function.request.repeatedErrorOccurOnce')"
      :bordered="false"
      size="small"
      class="card-wrapper"
    >
      <AButton @click="handleRepeatedMessageError">{{ $t('page.function.request.repeatedError') }}(Message)</AButton>
      <AButton class="ml-12px" @click="handleRepeatedModalError">
        {{ $t('page.function.request.repeatedError') }}(Modal)
      </AButton>
    </ACard>
  </ASpace>
</template>

<style scoped></style>
