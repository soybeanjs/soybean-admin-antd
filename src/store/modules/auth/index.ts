import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useLoading } from '@sa/hooks';
import { SetupStoreId } from '@/enum';
import { useRouterPush } from '@/hooks/common/router';
import { localStg } from '@/utils/storage';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const { route, toLogin } = useRouterPush(false);
  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  const token = ref(localStg.get('token') || '');

  async function resetStore() {
    const auth = useAuthStore();

    localStg.remove('token');

    auth.$reset();

    if (route.value.meta.requiresAuth) {
      toLogin();
    }
  }

  async function login() {
    startLoading();

    endLoading();
  }

  return {
    token,
    loginLoading,
    resetStore,
    login
  };
});
