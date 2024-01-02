<script setup lang="ts">
import { fetchDebug, fetchDebugAxios } from '@/service/api';

async function start() {
  const data = await fetchDebug();
  console.log('data: ', data);
}

async function startAxios() {
  try {
    const data = await fetchDebugAxios();
    console.log('data: ', data);
  } catch (error) {
    console.log('error: ', error);
  }
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
