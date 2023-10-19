import { inject, provide } from 'vue';
import type { InjectionKey } from 'vue';

type ContextFn<T> = () => T;

/**
 * use context
 * @param contextName context name
 * @param fn context function
 * @example
 * ```ts
 * // there are three vue files: A.vue, B.vue, C.vue, and A.vue is the parent component of B.vue and C.vue
 *
 * // context.ts
 * import { ref } from 'vue';
 * import { useContext } from '@sa/hooks';
 *
 * export const { setupStore, useStore } = useContext('demo', () => {
 *   const count = ref(0);
 *
 *   function increment() {
 *     count.value++;
 *   }
 *
 *   function decrement() {
 *     count.value--;
 *   }
 *
 *   return {
 *     count,
 *     increment,
 *     decrement
 *   };
 * })
 * ```
 *
 * // A.vue
 * ```vue
 * <template>
 *   <div>A</div>
 * </template>
 * <script setup lang="ts">
 * import { setupStore } from './context';
 *
 * setupStore();
 * // const { increment } = setupStore(); // also can control the store in the parent component
 * </script>
 * ```
 * // B.vue
 * ```vue
 * <template>
 *  <div>B</div>
 * </template>
 * <script setup lang="ts">
 * import { useStore } from './context';
 *
 * const { count, increment } = useStore();
 * </script>
 * ```
 *
 * // C.vue is same as B.vue
 */
export default function useContext<T>(contextName: string, fn: ContextFn<T>) {
  const { useProvide, useInject } = createContext<T>(contextName);

  const context = fn();

  /**
   * setup store in the parent component
   */
  function setupStore() {
    return useProvide(context);
  }

  /**
   * use store in the child component
   */
  function useStore() {
    return useInject();
  }

  return {
    setupStore,
    useStore
  };
}

/**
 * create context
 */
function createContext<T>(contextName: string) {
  const injectKey: InjectionKey<T> = Symbol(contextName);

  function useProvide(context: T) {
    provide(injectKey, context);

    return context;
  }

  function useInject() {
    return inject(injectKey) as T;
  }

  return {
    useProvide,
    useInject
  };
}
