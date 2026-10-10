import { ref, toValue, watch } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { REG_CODE_SIX, REG_EMAIL, REG_PHONE, REG_PWD, REG_USER_NAME } from '@/constants/reg';
import { $t, i18nLocale } from '@/locales';

export function useFormRules() {
  const patternRules = {
    userName: {
      pattern: REG_USER_NAME,
      get message() {
        return $t('form.userName.invalid');
      },
      trigger: 'change'
    },
    phone: {
      pattern: REG_PHONE,
      get message() {
        return $t('form.phone.invalid');
      },
      trigger: 'change'
    },
    pwd: {
      pattern: REG_PWD,
      get message() {
        return $t('form.pwd.invalid');
      },
      trigger: 'change'
    },
    code: {
      pattern: REG_CODE_SIX,
      get message() {
        return $t('form.code.invalid');
      },
      trigger: 'change'
    },
    email: {
      pattern: REG_EMAIL,
      get message() {
        return $t('form.email.invalid');
      },
      trigger: 'change'
    }
  } satisfies Record<string, App.Global.FormRule>;

  const formRules = {
    userName: [createRequiredRule(() => $t('form.userName.required')), patternRules.userName],
    phone: [createRequiredRule(() => $t('form.phone.required')), patternRules.phone],
    pwd: [createRequiredRule(() => $t('form.pwd.required')), patternRules.pwd],
    code: [createRequiredRule(() => $t('form.code.required')), patternRules.code],
    email: [createRequiredRule(() => $t('form.email.required')), patternRules.email]
  } satisfies Record<string, App.Global.FormRule[]>;

  /** the default required rule */
  const defaultRequiredRule = createRequiredRule(() => $t('form.required'));

  function createRequiredRule(message: string | (() => string)) {
    return {
      required: true,
      get message() {
        return typeof message === 'function' ? message() : message;
      }
    };
  }

  /** create a rule for confirming the password */
  function createConfirmPwdRule(pwd: string | Ref<string> | ComputedRef<string>) {
    const confirmPwdRule: App.Global.FormRule[] = [
      createRequiredRule(() => $t('form.confirmPwd.required')),
      {
        validator: (rule, value) => {
          if (value.trim() !== '' && value !== toValue(pwd)) {
            return Promise.reject(rule.message);
          }
          return Promise.resolve();
        },
        get message() {
          return $t('form.confirmPwd.invalid');
        },
        trigger: 'change'
      }
    ];
    return confirmPwdRule;
  }

  return {
    patternRules,
    formRules,
    defaultRequiredRule,
    createRequiredRule,
    createConfirmPwdRule
  };
}

export function useAntdForm() {
  const formRef = ref<FormInstance | null>(null);
  watch(i18nLocale, () => formRef.value?.clearValidate());

  async function validate() {
    await formRef.value?.validate();
  }

  function resetFields() {
    formRef.value?.resetFields();
  }

  return {
    formRef,
    validate,
    resetFields
  };
}
