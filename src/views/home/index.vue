<script setup lang="ts"></script>

<template>
  <div>
    <!-- <LookForward /> -->
    <div class="text-28px text-primary">primary</div>
    <div class="text-28px text-info">info</div>
    <div class="text-28px text-success">success</div>
    <div class="text-28px text-warning">warning</div>
    <div class="text-28px text-error">error</div>
    <div v-for="i in 100" :key="i">{{ i }}</div>
  </div>
</template>

<style scoped></style>
