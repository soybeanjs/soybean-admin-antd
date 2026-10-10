<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { $t } from '@/locales';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';

defineOptions({ name: 'SuperPage' });
const authStore = useAuthStore();
const router = useRouter();
const { routerPushByKey } = useRouterPush();
const links = computed(() =>
  (['manage_user', 'manage_role', 'manage_menu'] as const).filter(key => router.hasRoute(key))
);
const availableCount = computed(
  () =>
    router
      .getRoutes()
      .filter(route => route.components && !route.meta.constant && !route.redirect && route.name !== 'not-found').length
);
</script>

<template>
  <div class="flex-col gap-16px">
    <ACard :title="$t('workspace.superOverview')" :bordered="false" class="card-wrapper">
      <p class="mb-24px text-secondary">{{ $t('workspace.superDescription') }}</p>
      <div class="grid gap-24px sm:grid-cols-3">
        <AStatistic :title="$t('workspace.roles')" :value="authStore.userInfo.roles.length" />
        <AStatistic :title="$t('workspace.permissions')" :value="authStore.userInfo.buttons.length" />
        <AStatistic :title="$t('workspace.availablePages')" :value="availableCount" />
      </div>
      <ADivider />
      <ADescriptions :column="1" bordered>
        <ADescriptionsItem :label="$t('page.manage.user.userName')">
          {{ authStore.userInfo.userName }}
        </ADescriptionsItem>
        <ADescriptionsItem :label="$t('workspace.roles')">
          <ASpace wrap>
            <ATag v-for="role in authStore.userInfo.roles" :key="role" color="blue">{{ role }}</ATag>
          </ASpace>
        </ADescriptionsItem>
        <ADescriptionsItem :label="$t('workspace.permissions')">
          <ASpace wrap>
            <ATag v-for="button in authStore.userInfo.buttons" :key="button">{{ button }}</ATag>
            <span v-if="!authStore.userInfo.buttons.length">{{ $t('workspace.noPermissions') }}</span>
          </ASpace>
        </ADescriptionsItem>
      </ADescriptions>
    </ACard>
    <ACard :title="$t('workspace.availablePages')" :bordered="false" class="card-wrapper">
      <ASpace wrap>
        <AButton v-for="key in links" :key="key" type="primary" ghost @click="routerPushByKey(key)">
          {{ $t(`route.${key}`) }}
        </AButton>
        <AButton @click="routerPushByKey('function_toggle-auth')">
          {{ $t('page.function.toggleAuth.toggleAccount') }}
        </AButton>
      </ASpace>
    </ACard>
  </div>
</template>
