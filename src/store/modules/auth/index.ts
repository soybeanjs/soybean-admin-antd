import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { defineStore } from 'pinia';
import { useLoading } from '@sa/hooks';
import { localStg } from '@/utils/storage';
import { fetchGetUserInfo, fetchLogin } from '@/service/api';
import { resetRequestState } from '@/service/request';
import { $t } from '@/locales';
import { useRouterPush } from '@/hooks/common/router';
import { SetupStoreId } from '@/enum';
import { useRouteStore } from '../route';
import { useTabStore } from '../tab';
import { clearAuthStorage, getToken, setAuthTokens } from './shared';
import { createAuthSession } from './session';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const route = useRoute();
  const routeStore = useRouteStore();
  const tabStore = useTabStore();
  const { toLogin, redirectFromLogin } = useRouterPush(false);
  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  const {
    token,
    userInfo,
    isLogin,
    sessionVersion,
    clearSession: clearSessionState
  } = createAuthSession(getToken(), clearAuthStorage);
  const rememberLogin = ref(Boolean(localStg.get('token')) || !getToken());
  let logoutTask: Promise<void> | null = null;

  function clearSession() {
    clearSessionState();
    resetRequestState();
  }

  function updateTokens(tokens: Api.Auth.LoginToken) {
    setAuthTokens(tokens, rememberLogin.value);
    token.value = tokens.token;
  }

  /** is super role in static route */
  const isStaticSuper = computed(() => {
    const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env;

    return VITE_AUTH_ROUTE_MODE === 'static' && userInfo.roles.includes(VITE_STATIC_SUPER_ROLE);
  });

  /** Clear the session before awaiting route or navigation work. */
  function resetStore(): Promise<void> {
    if (logoutTask) return logoutTask;
    recordUserId();
    clearSession();
    tabStore.cacheTabs();
    tabStore.$reset();
    logoutTask = (async () => {
      await routeStore.resetStore();
      if (!route.meta.constant) await toLogin();
    })().finally(() => {
      logoutTask = null;
    });
    return logoutTask;
  }

  /** Record the user ID of the previous login session Used to compare with the current user ID on next login */
  function recordUserId() {
    if (!userInfo.userId) {
      return;
    }

    // Store current user ID locally for next login comparison
    localStg.set('lastLoginUserId', userInfo.userId);
  }

  /**
   * Check if current login user is different from previous login user If different, clear all tabs
   *
   * @returns {boolean} Whether to clear all tabs
   */
  function checkTabClear(): boolean {
    if (!userInfo.userId) {
      return false;
    }

    const lastLoginUserId = localStg.get('lastLoginUserId');

    // Clear all tabs if current user is different from previous user
    if (!lastLoginUserId || lastLoginUserId !== userInfo.userId) {
      localStg.remove('globalTabs');
      tabStore.clearTabs();

      localStg.remove('lastLoginUserId');
      return true;
    }

    localStg.remove('lastLoginUserId');
    return false;
  }

  /**
   * Login
   *
   * @param userName User name
   * @param password Password
   * @param [redirect=true] Whether to redirect after login. Default is `true`
   */
  async function login(
    userName: string,
    password: string,
    options: boolean | { redirect?: boolean; remember?: boolean } = true
  ) {
    const { redirect = true, remember = true } = typeof options === 'boolean' ? { redirect: options } : options;
    if (loginLoading.value || logoutTask) return false;
    clearSession();
    const version = sessionVersion.value;
    rememberLogin.value = remember;
    startLoading();
    try {
      const { data: loginToken, error } = await fetchLogin(userName, password);
      if (version !== sessionVersion.value) return false;
      if (error) {
        await resetStore();
        return false;
      }
      updateTokens(loginToken);
      const pass = await getUserInfo();
      if (version !== sessionVersion.value) return false;
      if (!pass) {
        await resetStore();
        return false;
      }
      await routeStore.resetStore();
      await routeStore.initAuthRoute();
      if (version !== sessionVersion.value) return false;
      const isClear = checkTabClear();
      await redirectFromLogin(isClear ? false : redirect);
      window.$notification?.success({
        message: $t('page.login.common.loginSuccess'),
        description: $t('page.login.common.welcomeBack', { userName: userInfo.userName })
      });
      return true;
    } catch {
      if (version === sessionVersion.value) await resetStore();
      return false;
    } finally {
      endLoading();
    }
  }

  async function getUserInfo() {
    const version = sessionVersion.value;
    const { data: info, error } = await fetchGetUserInfo();

    if (version !== sessionVersion.value) return false;
    if (!error) {
      // update store
      Object.assign(userInfo, info);

      return true;
    }

    return false;
  }

  async function initUserInfo() {
    const hasToken = getToken();

    if (hasToken) {
      const pass = await getUserInfo();

      if (!pass) {
        await resetStore();
      }
    }
  }

  return {
    token,
    sessionVersion,
    clearSession,
    updateTokens,
    $reset: clearSession,
    userInfo,
    isStaticSuper,
    isLogin,
    loginLoading,
    resetStore,
    login,
    initUserInfo
  };
});
