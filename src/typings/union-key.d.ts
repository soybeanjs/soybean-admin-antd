/**
 * the union key namespace
 */
declare namespace UnionKey {
  /** http请求头的content-type类型 */
  type ContentType = 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data';

  /**
   * 登录模块
   * - pwd-login: 账密登录
   * - code-login: 手机验证码登录
   * - register: 注册
   * - reset-pwd: 重置密码
   * - bind-wechat: 微信绑定
   */
  type LoginModule = 'pwd-login' | 'code-login' | 'register' | 'reset-pwd' | 'bind-wechat';

  /**
   * 布局模式
   * - vertical: 左侧菜单模式
   * - horizontal: 顶部菜单模式
   * - vertical-mix: 左侧菜单混合模式
   * - horizontal-mix: 顶部菜单混合模式
   */
  type ThemeLayoutMode = 'vertical' | 'horizontal' | 'vertical-mix' | 'horizontal-mix';

  /**
   * 内容溢出时的出现滚动条的方式
   * - wrapper 布局组件最外层的元素出现滚动条
   * - content 主体内容组件出现滚动条
   */
  type ThemeScrollMode = import('@sa/materials').LayoutScrollMode;

  /**
   * 多页签风格
   * - chrome: 谷歌风格
   * - button: 按钮风格
   */
  type ThemeTabMode = import('@sa/materials').PageTabMode;

  /**
   * 水平模式的菜单位置
   * - flex-start: 居左
   * - center: 居中
   * - flex-end: 居右
   */
  type ThemeHorizontalMenuPosition = 'flex-start' | 'center' | 'flex-end';

  /**
   * the theme animate mode
   */
  type ThemeAnimateMode =
    | 'pulse'
    | 'bounce'
    | 'spin'
    | 'ping'
    | 'bounce-alt'
    | 'flash'
    | 'pulse-alt'
    | 'rubber-band'
    | 'shake-x'
    | 'shake-y'
    | 'head-shake'
    | 'swing'
    | 'tada'
    | 'wobble'
    | 'jello'
    | 'heart-beat'
    | 'hinge'
    | 'jack-in-the-box'
    | 'light-speed-in-left'
    | 'light-speed-in-right'
    | 'light-speed-out-left'
    | 'light-speed-out-right'
    | 'flip'
    | 'flip-in-x'
    | 'flip-in-y'
    | 'flip-out-x'
    | 'flip-out-y'
    | 'rotate-in'
    | 'rotate-in-down-left'
    | 'rotate-in-down-right'
    | 'rotate-in-up-left'
    | 'rotate-in-up-right'
    | 'rotate-out'
    | 'rotate-out-down-left'
    | 'rotate-out-down-right'
    | 'rotate-out-up-left'
    | 'rotate-out-up-right'
    | 'roll-in'
    | 'roll-out'
    | 'zoom-in'
    | 'zoom-in-down'
    | 'zoom-in-left'
    | 'zoom-in-right'
    | 'zoom-in-up'
    | 'zoom-out'
    | 'zoom-out-down'
    | 'zoom-out-left'
    | 'zoom-out-right'
    | 'zoom-out-up'
    | 'bounce-in'
    | 'bounce-in-down'
    | 'bounce-in-left'
    | 'bounce-in-right'
    | 'bounce-in-up'
    | 'bounce-out'
    | 'bounce-out-down'
    | 'bounce-out-left'
    | 'bounce-out-right'
    | 'bounce-out-up'
    | 'slide-in-down'
    | 'slide-in-left'
    | 'slide-in-right'
    | 'slide-in-up'
    | 'slide-out-down'
    | 'slide-out-left'
    | 'slide-out-right'
    | 'slide-out-up'
    | 'fade-in'
    | 'fade-in-down'
    | 'fade-in-down-big'
    | 'fade-in-left'
    | 'fade-in-left-big'
    | 'fade-in-right'
    | 'fade-in-right-big'
    | 'fade-in-up'
    | 'fade-in-up-big'
    | 'fade-in-top-left'
    | 'fade-in-top-right'
    | 'fade-in-bottom-left'
    | 'fade-in-bottom-right'
    | 'fade-out'
    | 'fade-out-down'
    | 'fade-out-down-big'
    | 'fade-out-left'
    | 'fade-out-left-big'
    | 'fade-out-right'
    | 'fade-out-right-big'
    | 'fade-out-up'
    | 'fade-out-up-big'
    | 'fade-out-top-left'
    | 'fade-out-top-right'
    | 'fade-out-bottom-left'
    | 'fade-out-bottom-right'
    | 'back-in-up'
    | 'back-in-down'
    | 'back-in-right'
    | 'back-in-left'
    | 'back-out-up'
    | 'back-out-down'
    | 'back-out-right'
    | 'back-out-left';
}
