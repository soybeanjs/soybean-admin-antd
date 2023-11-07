import { watch } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

export function useLayout() {
  const app = useAppStore();

  const breakpoints = useBreakpoints(breakpointsTailwind);

  const isMobile = breakpoints.smaller('sm');

  watch(
    isMobile,
    newValue => {
      if (newValue) {
        app.toggleSiderCollapse();
      }
    },
    { immediate: true }
  );

  return {
    isMobile
  };
}
