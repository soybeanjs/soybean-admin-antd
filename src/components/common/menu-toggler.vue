<script lang="ts" setup>
defineOptions({ name: 'MenuToggle' });

interface Props {
  collapsed?: boolean;
}

defineProps<Props>();
</script>

<template>
  <AButton type="text" class="h-full text-icon">
    <SvgIcon v-if="collapsed" icon="line-md:menu-fold-right" />
    <SvgIcon v-else icon="line-md:menu-fold-left" />
  </AButton>
</template>

<style scoped></style>
