<script setup lang="ts">
import HeaderBanner from './modules/header-banner.vue';
import CardData from './modules/card-data.vue';
import LineChart from './modules/line-chart.vue';
import PieChart from './modules/pie-chart.vue';
import ProjectNews from './modules/project-news.vue';
import CreativityBanner from './modules/creativity-banner.vue';
</script>

<template>
  <ASpace direction="vertical" :size="16">
    <HeaderBanner />
    <CardData />
    <ARow :gutter="[16, 16]">
      <ACol :span="24" :lg="14">
        <LineChart />
      </ACol>
      <ACol :span="24" :lg="10">
        <PieChart />
      </ACol>
    </ARow>
    <ARow :gutter="[16, 16]">
      <ACol :span="24" :lg="14">
        <ProjectNews />
      </ACol>
      <ACol :span="24" :lg="10">
        <CreativityBanner />
      </ACol>
    </ARow>
  </ASpace>
</template>

<style scoped></style>
