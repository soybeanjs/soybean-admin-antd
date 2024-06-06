<script lang="ts" setup>
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({ name: 'PinToggler' });

interface Props {
  pin?: boolean;
}

const props = defineProps<Props>();

const icon = computed(() => (props.pin ? 'mdi-pin-off' : 'mdi-pin'));
</script>

<template>
  <ButtonIcon :tooltip-content="pin ? $t('icon.unpin') : $t('icon.pin')" tooltip-placement="bottomLeft" trigger-parent>
    <SvgIcon :icon="icon" />
  </ButtonIcon>
</template>

<style scoped></style>
