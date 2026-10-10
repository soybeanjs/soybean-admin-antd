<script setup lang="ts">
import { computed } from 'vue';
import { resolveAuthEntryURL } from '@/utils/workspace';
import { $t } from '@/locales';
import { useRouterPush } from '@/hooks/common/router';

defineOptions({ name: 'BindWechat' });
const { toggleLoginModule } = useRouterPush();
const authURL = resolveAuthEntryURL(import.meta.env.VITE_WECHAT_AUTH_URL, window.location.origin);
const steps = computed(() => [
  { title: $t('workspace.wechatStep1') },
  { title: $t('workspace.wechatStep2') },
  { title: $t('workspace.wechatStep3') }
]);
function startAuthorization() {
  if (authURL) window.location.assign(authURL);
}
</script>

<template>
  <div class="flex-col gap-24px">
    <div class="flex-center"><SvgIcon icon="mdi:wechat" class="text-64px text-green-600" /></div>
    <p class="text-center text-secondary">{{ $t('workspace.wechatDescription') }}</p>
    <ASteps direction="vertical" size="small" :current="0" :items="steps" />
    <AAlert
      v-if="!authURL"
      :message="$t('workspace.wechatUnconfigured')"
      :description="$t('workspace.wechatUnavailable')"
      type="info"
      show-icon
    />
    <AButton type="primary" size="large" block shape="round" :disabled="!authURL" @click="startAuthorization">
      {{ $t('workspace.startWechat') }}
    </AButton>
    <AButton size="large" block shape="round" @click="toggleLoginModule('pwd-login')">
      {{ $t('page.login.common.back') }}
    </AButton>
  </div>
</template>
