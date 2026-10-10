import { $t } from '@/locales';

/** Unimplemented template actions must not imply that data was persisted. */
export function notifyDemoAction() {
  window.$message?.info($t('common.demoOnly'));
}
