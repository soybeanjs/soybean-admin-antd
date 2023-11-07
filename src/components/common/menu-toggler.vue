<script lang="ts" setup>
import { $t } from '@/locales';

defineOptions({ name: 'MenuToggle' });

interface Props {
  collapsed?: boolean;
}

defineProps<Props>();
</script>

<template>
  <ButtonIcon
    :tooltip-content="collapsed ? $t('icon.expand') : $t('icon.collapse')"
    tooltip-placement="right"
    trigger-parent
  >
    <SvgIcon v-if="collapsed" icon="line-md:menu-fold-right" />
    <SvgIcon v-else icon="line-md:menu-fold-left" />
  </ButtonIcon>
</template>

<style scoped></style>
