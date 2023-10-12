<script setup lang="ts">
defineOptions({
  name: 'UserAvatar'
});
</script>

<template>
  <ADropdown>
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
            <span class="pl-8px">User Center</span>
          </div>
        </AMenuItem>
        <ADivider class="m-0!" />
        <AMenuItem>
          <div class="flex-y-center">
            <SvgIcon icon="ph:sign-out" class="text-icon" />
            <span class="pl-8px">Logout</span>
          </div>
        </AMenuItem>
      </AMenu>
    </template>
  </ADropdown>
</template>

<style scoped></style>
