import { computed, reactive, ref } from 'vue';

export function createAuthSession(initialToken: string, clearStorage: () => void) {
  const token = ref(initialToken);
  const sessionVersion = ref(0);
  const userInfo = reactive<Api.Auth.UserInfo>({ userId: '', userName: '', roles: [], buttons: [] });
  const isLogin = computed(() => Boolean(token.value));

  function clearSession() {
    sessionVersion.value += 1;
    token.value = '';
    Object.keys(userInfo).forEach(key => Reflect.deleteProperty(userInfo, key));
    Object.assign(userInfo, { userId: '', userName: '', roles: [], buttons: [] });
    clearStorage();
  }

  return { token, userInfo, isLogin, sessionVersion, clearSession };
}
