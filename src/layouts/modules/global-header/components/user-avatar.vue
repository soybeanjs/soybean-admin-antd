<script setup lang="ts">
import { $t } from '@/locales';

defineOptions({
  name: 'UserAvatar'
});
</script>

<template>
  <ADropdown placement="bottomRight">
    <AButton type="text" class="h-full">
      <div class="flex-y-center">
        <SvgIcon icon="ph:user-circle" class="text-icon-large" />
        <span class="pl-8px text-16px font-medium">Soybean</span>
      </div>
    </AButton>
    <template #overlay>
      <AMenu>
        <AMenuItem>
          <div class="flex-y-center">
            <SvgIcon icon="ph:user-circle" class="text-icon" />
            <span class="pl-8px">{{ $t('common.userCenter') }}</span>
          </div>
        </AMenuItem>
        <AMenuDivider />
        <AMenuItem>
          <div class="flex-y-center">
            <SvgIcon icon="ph:sign-out" class="text-icon" />
            <span class="pl-8px">{{ $t('common.logout') }}</span>
          </div>
        </AMenuItem>
      </AMenu>
    </template>
  </ADropdown>
</template>

<style scoped></style>
