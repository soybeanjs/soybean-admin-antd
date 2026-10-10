import { computed, getCurrentScope, onScopeDispose, ref } from 'vue';

/**
 * count down
 *
 * @param seconds - count down seconds
 */
export default function useCountDown(seconds: number) {
  const count = ref(0);
  const isCounting = computed(() => count.value > 0);
  let interval: ReturnType<typeof setInterval> | undefined;

  function start(updateSeconds: number = seconds) {
    stop();
    const duration = Math.max(0, updateSeconds);
    if (!Number.isFinite(duration) || duration === 0) return;
    const deadline = Date.now() + duration * 1000;
    count.value = Math.ceil(duration);
    interval = setInterval(() => {
      count.value = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      if (!count.value) stop();
    }, 250);
  }

  function stop() {
    clearInterval(interval);
    interval = undefined;
    count.value = 0;
  }

  if (getCurrentScope()) onScopeDispose(stop);

  return {
    count,
    isCounting,
    start,
    stop
  };
}
