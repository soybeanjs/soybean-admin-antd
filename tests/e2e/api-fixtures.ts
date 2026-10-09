/** Synthetic frontend fixtures. These are not live backend or persistence checks. */
export const fixtureUser = {
  userId: 'e2e-user',
  userName: 'E2E Soybean',
  roles: ['R_SUPER'],
  buttons: ['B_CODE1', 'B_CODE2', 'B_CODE3']
};

export const fixtureUsers = [
  {
    id: 1,
    userName: 'fixture-alice',
    nickName: 'Alice fixture',
    userGender: '2',
    userPhone: '13800000001',
    userEmail: 'alice@example.test',
    userRoles: ['R_ADMIN'],
    status: '1',
    createBy: 'fixture',
    createTime: '2026-01-01 00:00:00',
    updateBy: 'fixture',
    updateTime: '2026-01-01 00:00:00'
  },
  {
    id: 2,
    userName: 'fixture-bob',
    nickName: 'Bob fixture',
    userGender: '1',
    userPhone: '13800000002',
    userEmail: 'bob@example.test',
    userRoles: ['R_USER'],
    status: '2',
    createBy: 'fixture',
    createTime: '2026-01-01 00:00:00',
    updateBy: 'fixture',
    updateTime: '2026-01-01 00:00:00'
  }
];

export function getFixtureResponse(url: URL, body?: { password?: string }) {
  if (url.pathname.endsWith('/auth/login')) {
    return body?.password === 'badpass'
      ? { code: '4001', data: null, msg: 'Fixture credentials rejected' }
      : { code: '0000', data: { token: 'e2e-fixture-token', refreshToken: 'e2e-fixture-refresh' }, msg: 'ok' };
  }

  if (url.pathname.endsWith('/auth/refreshToken')) {
    return {
      code: '0000',
      data: { token: 'e2e-refreshed-token', refreshToken: 'e2e-refreshed-refresh' },
      msg: 'ok'
    };
  }

  if (url.pathname.endsWith('/auth/getUserInfo')) {
    return { code: '0000', data: fixtureUser, msg: 'ok' };
  }

  if (url.pathname.endsWith('/systemManage/getUserList')) {
    const query = url.searchParams.get('userName') || '';
    const records = fixtureUsers.filter(user => user.userName.includes(query));
    return { code: '0000', data: { records, current: 1, size: 10, total: records.length }, msg: 'ok' };
  }

  if (url.pathname.endsWith('/systemManage/getAllRoles')) {
    return {
      code: '0000',
      data: [{ id: 1, roleName: 'Fixture administrator', roleCode: 'R_ADMIN' }],
      msg: 'ok'
    };
  }

  return null;
}
