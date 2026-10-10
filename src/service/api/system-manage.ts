import { findPaginatedRecord } from '@/utils/workspace';
import { useAuthStore } from '@/store/modules/auth';
import { userCache } from '../cache/users';
import { request } from '../request';

/** get role list */
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RoleList>({
    url: '/systemManage/getRoleList',
    method: 'get',
    params
  });
}

/**
 * get all roles
 *
 * these roles are all enabled
 */
export function fetchGetAllRoles() {
  return request<Api.SystemManage.AllRole[]>({
    url: '/systemManage/getAllRoles',
    method: 'get'
  });
}

/** get user list */
export async function fetchGetUserList(params?: Api.SystemManage.UserSearchParams, signal?: AbortSignal) {
  const version = useAuthStore().sessionVersion;
  const result = await request<Api.SystemManage.UserList>({
    url: '/systemManage/getUserList',
    method: 'get',
    params,
    signal
  });
  if (!result.error && version === useAuthStore().sessionVersion)
    result.data.records.forEach(record => userCache.set(record));
  return result;
}

/** get menu list */
export function fetchGetMenuList() {
  return request<Api.SystemManage.MenuList>({
    url: '/systemManage/getMenuList/v2',
    method: 'get'
  });
}

/** get all pages */
export function fetchGetAllPages() {
  return request<string[]>({
    url: '/systemManage/getAllPages',
    method: 'get'
  });
}

/** get menu tree */
export function fetchGetMenuTree() {
  return request<Api.SystemManage.MenuTree[]>({
    url: '/systemManage/getMenuTree',
    method: 'get'
  });
}

export async function fetchGetUserDetail(id: number, signal?: AbortSignal) {
  signal?.throwIfAborted();
  const cached = userCache.get(id);
  if (cached) return cached;
  return findPaginatedRecord(
    async current => {
      const result = await fetchGetUserList({ current, size: 100 }, signal);
      if (result.error) throw result.error;
      return result.data;
    },
    id,
    signal
  );
}
