import { computed } from 'vue';
import { useCountDown, useLoading } from '@sa/hooks';
import { REG_PHONE } from '@/constants/reg';
import { notifyDemoAction } from '@/utils/demo';
import { $t } from '@/locales';

export function useCaptcha() {
  const { loading } = useLoading();
  const { count, start, stop, isCounting } = useCountDown(10);

  const label = computed(() => {
    let text = $t('page.login.codeLogin.getCode');

    const countingLabel = $t('page.login.codeLogin.reGetCode', { time: count.value });

    if (loading.value) {
      text = '';
    }

    if (isCounting.value) {
      text = countingLabel;
    }

    return text;
  });

  function isPhoneValid(phone: string) {
    if (phone.trim() === '') {
      window.$message?.error?.($t('form.phone.required'));

      return false;
    }

    if (!REG_PHONE.test(phone)) {
      window.$message?.error?.($t('form.phone.invalid'));

      return false;
    }

    return true;
  }

  async function getCaptcha(phone: string) {
    const valid = isPhoneValid(phone);

    if (!valid || loading.value) {
      return false;
    }

    notifyDemoAction();
    return false;
  }

  return {
    label,
    start,
    stop,
    isCounting,
    loading,
    getCaptcha
  };
}
