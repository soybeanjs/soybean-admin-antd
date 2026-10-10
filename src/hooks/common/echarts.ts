import { computed, effectScope, nextTick, onActivated, onScopeDispose, shallowRef, watch } from 'vue';
import { useElementSize } from '@vueuse/core';
import { LineChart, PieChart } from 'echarts/charts';
import type { LineSeriesOption, PieSeriesOption } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import type {
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  TooltipComponentOption
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useThemeStore } from '@/store/modules/theme';

export type ECOption = echarts.ComposeOption<
  | LineSeriesOption
  | PieSeriesOption
  | TitleComponentOption
  | LegendComponentOption
  | TooltipComponentOption
  | GridComponentOption
>;

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  PieChart,
  LabelLayout,
  CanvasRenderer
]);

interface ChartHooks {
  onRender?: (chart: echarts.ECharts) => void | Promise<void>;
  onUpdated?: (chart: echarts.ECharts) => void | Promise<void>;
  onDestroy?: (chart: echarts.ECharts) => void | Promise<void>;
}

/**
 * use echarts
 *
 * @param optionsFactory echarts options factory function
 * @param darkMode dark mode
 */
export function useEcharts<T extends ECOption>(optionsFactory: () => T, hooks: ChartHooks = {}) {
  const scope = effectScope();

  const themeStore = useThemeStore();
  const darkMode = computed(() => themeStore.darkMode);

  const domRef = shallowRef<HTMLElement | null>(null);
  const initialSize = { width: 0, height: 0 };
  const { width, height } = useElementSize(domRef, initialSize);

  const chart = shallowRef<echarts.ECharts | null>(null);
  let disposed = false;
  let optionsUpdated = false;
  let resizeFrame: number | undefined;
  let generation = 0;
  let renderTask: Promise<void> | null = null;
  const chartOptions: T = optionsFactory();

  const {
    onRender = instance => {
      const textColor = darkMode.value ? 'rgb(224, 224, 224)' : 'rgb(31, 31, 31)';
      const maskColor = darkMode.value ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)';

      instance.showLoading({
        color: themeStore.themeColor,
        textColor,
        fontSize: 14,
        maskColor
      });
    },
    onUpdated = instance => {
      instance.hideLoading();
    },
    onDestroy
  } = hooks;

  /**
   * whether can render chart
   *
   * when domRef is ready and initialSize is valid
   */
  function canRender() {
    return domRef.value && initialSize.width > 0 && initialSize.height > 0;
  }

  /** is chart rendered */
  function isRendered() {
    return Boolean(domRef.value && chart.value);
  }

  /**
   * update chart options
   *
   * @param callback callback function
   */
  async function updateOptions(callback: (opts: T, optsFactory: () => T) => ECOption = () => chartOptions) {
    if (disposed) return;

    const updatedOpts = callback(chartOptions, optionsFactory);

    Object.assign(chartOptions, updatedOpts);
    optionsUpdated = true;

    chart.value?.setOption({ ...updatedOpts, backgroundColor: 'transparent' });

    if (chart.value) await onUpdated(chart.value);
  }

  function setOptions(options: T) {
    chart.value?.setOption(options);
  }

  /** render chart */
  async function render() {
    if (disposed || !canRender() || isRendered()) return;
    if (renderTask) {
      await renderTask;
      return;
    }
    const current = generation;
    const pending = (async () => {
      await nextTick();
      if (disposed || current !== generation || !canRender() || isRendered()) return;
      chart.value = echarts.init(domRef.value!, darkMode.value ? 'dark' : 'light');
      chart.value.setOption({ ...chartOptions, backgroundColor: 'transparent' });
      const instance = chart.value;
      await onRender(instance);
      if (optionsUpdated && instance === chart.value && !disposed) await onUpdated(instance);
    })();
    renderTask = pending;
    try {
      await pending;
    } finally {
      if (renderTask === pending) renderTask = null;
    }
  }

  /** resize chart */
  function resize() {
    if (resizeFrame !== undefined) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = undefined;
      if (!disposed) chart.value?.resize();
    });
  }

  /** destroy chart */
  async function destroy() {
    generation += 1;
    renderTask = null;
    const instance = chart.value;
    chart.value = null;
    if (!instance) return;
    try {
      await onDestroy?.(instance);
    } finally {
      instance.dispose();
    }
  }

  /** change chart theme */
  async function changeTheme() {
    await destroy();
    await render();
    if (chart.value) await onUpdated(chart.value);
  }

  /**
   * render chart by size
   *
   * @param w width
   * @param h height
   */
  async function renderChartBySize(w: number, h: number) {
    initialSize.width = w;
    initialSize.height = h;

    // Hidden KeepAlive pages can have zero size; retain their chart and options.
    if (!canRender()) return;

    // resize chart
    if (isRendered()) {
      resize();
    }

    // render chart
    await render();
  }

  scope.run(() => {
    watch([width, height], ([newWidth, newHeight]) => {
      renderChartBySize(newWidth, newHeight);
    });

    watch(darkMode, () => {
      changeTheme();
    });
  });

  onActivated(() => {
    nextTick(resize);
  });

  onScopeDispose(() => {
    disposed = true;
    if (resizeFrame !== undefined) cancelAnimationFrame(resizeFrame);
    destroy().catch(() => {});
    scope.stop();
  });

  return {
    domRef,
    chart,
    updateOptions,
    setOptions
  };
}
