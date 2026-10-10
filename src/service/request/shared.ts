import { useAuthStore } from '@/store/modules/auth';
import { getRefreshToken, getToken } from '@/store/modules/auth/shared';
import { fetchRefreshToken } from '../api';
import type { RequestInstanceState } from './type';

export function getAuthorization() {
  const token = getToken();
  const Authorization = token ? `Bearer ${token}` : null;

  return Authorization;
}

/** refresh token */
export async function handleRefreshToken() {
  const authStore = useAuthStore();
  const version = authStore.sessionVersion;
  const rToken = getRefreshToken();
  if (!rToken) return false;
  const { error, data } = await fetchRefreshToken(rToken);
  if (version !== authStore.sessionVersion) return false;
  if (!error) {
    authStore.updateTokens(data);
    return true;
  }
  return false;
}

export function showErrorMsg(state: RequestInstanceState, message: string) {
  if (!window.$message) return;
  if (!state.errMsgStack?.length) {
    state.errMsgStack = [];
  }

  const isExist = state.errMsgStack.includes(message);

  if (!isExist) {
    state.errMsgStack.push(message);

    window.$message?.error(message, 1.5, () => {
      state.errMsgStack = state.errMsgStack.filter(msg => msg !== message);
    });
  }
}
