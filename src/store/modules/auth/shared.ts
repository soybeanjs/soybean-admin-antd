import { localStg, sessionStg } from '@/utils/storage';

/** Get token */
export function getToken() {
  return sessionStg.get('token') || localStg.get('token') || '';
}

export function getRefreshToken() {
  return sessionStg.get('refreshToken') || localStg.get('refreshToken') || '';
}

export function setAuthTokens(tokens: Api.Auth.LoginToken, remember: boolean) {
  if (remember) {
    localStg.set('token', tokens.token);
    localStg.set('refreshToken', tokens.refreshToken);
    sessionStg.remove('token');
    sessionStg.remove('refreshToken');
  } else {
    sessionStg.set('token', tokens.token);
    sessionStg.set('refreshToken', tokens.refreshToken);
    localStg.remove('token');
    localStg.remove('refreshToken');
  }
}

/** Clear auth storage */
export function clearAuthStorage() {
  sessionStg.remove('multiTabDrafts');
  localStg.remove('token');
  localStg.remove('refreshToken');
  sessionStg.remove('token');
  sessionStg.remove('refreshToken');
}
