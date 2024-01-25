<script setup lang="ts">
import { $t } from '@/locales';
import pkg from '~/package.json';

interface PkgJson {
  name: string;
  version: string;
  dependencies: PkgVersionInfo[];
  devDependencies: PkgVersionInfo[];
}

interface PkgVersionInfo {
  name: string;
  version: string;
}

const { name, version, dependencies, devDependencies } = pkg;

function transformVersionData(tuple: [string, string]): PkgVersionInfo {
  const [$name, $version] = tuple;
  return {
    name: $name,
    version: $version
  };
}

const pkgJson: PkgJson = {
  name,
  version,
  dependencies: Object.entries(dependencies).map(item => transformVersionData(item)),
  devDependencies: Object.entries(devDependencies).map(item => transformVersionData(item))
};

const latestBuildTime = BUILD_TIME;
</script>

<template>
  <ASpace direction="vertical" :size="16">
    <ACard :title="$t('page.about.title')" :bordered="false" size="small" class="card-wrapper">
      <p>{{ $t('page.about.introduction') }}</p>
    </ACard>
    <ACard :title="$t('page.about.projectInfo.title')" :bordered="false" size="small" class="card-wrapper">
      <ADescriptions label-placement="left" bordered size="small" :column="{ xs: 1, sm: 2 }">
        <ADescriptionsItem :label="$t('page.about.projectInfo.version')">
          <ATag color="blue">{{ pkgJson.version }}</ATag>
        </ADescriptionsItem>
        <ADescriptionsItem :label="$t('page.about.projectInfo.latestBuildTime')">
          <ATag color="blue">{{ latestBuildTime }}</ATag>
        </ADescriptionsItem>
        <ADescriptionsItem :label="$t('page.about.projectInfo.githubLink')">
          <a class="text-primary" :href="pkg.homepage" target="_blank" rel="noopener noreferrer">
            {{ $t('page.about.projectInfo.githubLink') }}
          </a>
        </ADescriptionsItem>
        <ADescriptionsItem :label="$t('page.about.projectInfo.previewLink')">
          <a class="text-primary" :href="pkg.website" target="_blank" rel="noopener noreferrer">
            {{ $t('page.about.projectInfo.previewLink') }}
          </a>
        </ADescriptionsItem>
      </ADescriptions>
    </ACard>
    <ACard :title="$t('page.about.prdDep')" :bordered="false" size="small" class="card-wrapper">
      <ADescriptions label-placement="left" bordered size="small" :column="{ xs: 1, sm: 2 }">
        <ADescriptionsItem v-for="item in pkgJson.dependencies" :key="item.name" :label="item.name">
          {{ item.version }}
        </ADescriptionsItem>
      </ADescriptions>
    </ACard>
    <ACard :title="$t('page.about.devDep')" :bordered="false" size="small" class="card-wrapper">
      <ADescriptions label-placement="left" bordered size="small" :column="{ xs: 1, sm: 2 }">
        <ADescriptionsItem v-for="item in pkgJson.devDependencies" :key="item.name" :label="item.name">
          {{ item.version }}
        </ADescriptionsItem>
      </ADescriptions>
    </ACard>
  </ASpace>
</template>

<style scoped></style>
