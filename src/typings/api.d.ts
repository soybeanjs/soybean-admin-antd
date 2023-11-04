/**
 * namespace Api
 * @description all backend api type
 */
declare namespace Api {
  /**
   * namespace Auth
   * @description backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      token: string;
      refreshToken: string;
    }
  }

  /**
   * namespace Route
   * @description backend api module: "route"
   */
  namespace Route {}
}
