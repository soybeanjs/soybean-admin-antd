const local: App.I18n.Schema = {
  system: {
    title: 'Soybean 管理系统'
  },
  common: {
    tip: '提示',
    add: '添加',
    addSuccess: '添加成功',
    edit: '修改',
    editSuccess: '修改成功',
    delete: '删除',
    deleteSuccess: '删除成功',
    batchDelete: '批量删除',
    confirm: '确认',
    cancel: '取消',
    pleaseCheckValue: '请检查输入的值是否合法',
    action: '操作',
    backToHome: '返回首页',
    lookForward: '敬请期待',
    userCenter: '个人中心',
    logout: '退出登录',
    logoutConfirm: '确认退出登录吗？'
  },
  page: {
    login: {
      common: {
        userNamePlaceholder: '请输入用户名',
        phonePlaceholder: '请输入手机号',
        codePlaceholder: '请输入验证码',
        passwordPlaceholder: '请输入密码',
        confirmPasswordPlaceholder: '请再次输入密码',
        codeLogin: '验证码登录',
        confirm: '确定',
        back: '返回',
        validateSuccess: '验证成功',
        loginSuccess: '登录成功',
        welcomeBack: '欢迎回来，{userName}!'
      },
      pwdLogin: {
        title: '密码登录',
        rememberMe: '记住我',
        forgetPassword: '忘记密码？',
        register: '注册账号',
        otherAccountLogin: '其他账号登录',
        otherLoginMode: '其他登录方式',
        superAdmin: '超级管理员',
        admin: '管理员',
        user: '普通用户'
      },
      codeLogin: {
        title: '验证码登录',
        getCode: '获取验证码',
        imageCodePlaceholder: '请输入图片验证码'
      },
      register: {
        title: '注册账号',
        agreement: '我已经仔细阅读并接受',
        protocol: '《用户协议》',
        policy: '《隐私权政策》'
      },
      resetPwd: {
        title: '重置密码'
      },
      bindWeChat: {
        title: '绑定微信'
      }
    }
  }
};

export default local;
