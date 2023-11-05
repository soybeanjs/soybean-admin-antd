<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import { getColorPalette, mixColor } from '@sa/utils';
import { $t } from '@/locales';
import { useThemeStore } from '@/store/modules/theme';
import { loginModuleLabels } from '@/constants/app';
import PwdLogin from './components/pwd-login.vue';
import CodeLogin from './components/code-login.vue';
import Register from './components/register.vue';
import ResetPwd from './components/reset-pwd.vue';
import BindWechat from './components/bind-wechat.vue';

interface Props {
  /**
   * the login module
   */
  module?: UnionKey.LoginModule;
}

const props = withDefaults(defineProps<Props>(), {
  module: 'pwd-login'
});

const theme = useThemeStore();

interface LoginModule {
  key: UnionKey.LoginModule;
  label: string;
  component: Component;
}

const modules: LoginModule[] = [
  { key: 'pwd-login', label: loginModuleLabels['pwd-login'], component: PwdLogin },
  { key: 'code-login', label: loginModuleLabels['code-login'], component: CodeLogin },
  { key: 'register', label: loginModuleLabels.register, component: Register },
  { key: 'reset-pwd', label: loginModuleLabels['reset-pwd'], component: ResetPwd },
  { key: 'bind-wechat', label: loginModuleLabels['bind-wechat'], component: BindWechat }
];

const activeModule = computed(() => {
  const findItem = modules.find(item => item.key === props.module);
  return findItem || modules[0];
});

const bgThemeColor = computed(() => (theme.darkMode ? getColorPalette(theme.themeColor, 7) : theme.themeColor));

const bgColor = computed(() => {
  const COLOR_WHITE = '#ffffff';

  const ratio = theme.darkMode ? 0.5 : 0.2;

  return mixColor(COLOR_WHITE, theme.themeColor, ratio);
});

const transitionName: UnionKey.ThemeAnimateMode = 'slide-in-left';
</script>

<template>
  <div class="relative flex-center wh-full" :style="{ backgroundColor: bgColor }">
    <WaveBg :theme-color="bgThemeColor" />
    <ACard class="relative z-4">
      <div class="w-400px <sm:w-300px">
        <header class="flex-y-center justify-between">
          <SystemLogo class="text-64px text-primary <sm:text-48px" />
          <h3 class="text-28px font-500 text-primary <sm:text-22px">{{ $t('system.title') }}</h3>
          <ColorSchemaSwitch
            :color-schema="theme.colorScheme"
            :is-dark="theme.darkMode"
            class="text-20px <sm:text-18px"
            @switch="theme.toggleColorScheme"
          />
        </header>
        <main class="pt-24px">
          <h3 class="text-18px text-primary font-medium">{{ activeModule.label }}</h3>
          <div class="pt-24px animation-slide-in-left">
            <Transition :name="transitionName" mode="out-in" appear>
              <component :is="activeModule.component" />
            </Transition>
          </div>
        </main>
      </div>
    </ACard>
  </div>
</template>

<style scoped></style>
