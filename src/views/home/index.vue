<script setup lang="ts">
import { fetchDebug, fetchDebugAxios } from '@/service/api';

async function start() {
  const data = await fetchDebug();
  console.log('data: ', data);
}

async function startAxios() {
  const data = await fetchDebugAxios();
  console.log('data: ', data);
}

start();
startAxios();
</script>

<template>
  <div>
    <ACalendar :fullscreen="false" />
  </div>
</template>

<style scoped></style>
