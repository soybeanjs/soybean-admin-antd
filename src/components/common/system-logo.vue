<script lang="ts" setup>
defineOptions({ name: 'SystemLogo' });

interface Props {
  /**
   * Whether fill the logo.
   */
  fill?: boolean;
}

defineProps<Props>();
</script>

<template>
  <IconLocalLogoFill v-if="fill" />
  <IconLocalLogo v-else />
</template>

<style scoped></style>
