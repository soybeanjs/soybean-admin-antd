<script lang="ts" setup>
import { $t } from '@/locales';

defineOptions({ name: 'MenuToggle' });

interface Props {
  collapsed?: boolean;
}

defineProps<Props>();

function getPopupContainer(triggerNode: HTMLElement) {
  return triggerNode.parentElement!;
}
</script>

<template>
  <ButtonIcon
    :tooltip-content="collapsed ? $t('icon.expand') : $t('icon.collapse')"
    tooltip-placement="right"
    :get-popup-container="getPopupContainer"
  >
    <SvgIcon v-if="collapsed" icon="line-md:menu-fold-right" />
    <SvgIcon v-else icon="line-md:menu-fold-left" />
  </ButtonIcon>
</template>

<style scoped></style>
