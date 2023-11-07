<script setup lang="ts">
import { computed } from 'vue';
import type { Trigger } from 'ant-design-vue/es/dropdown/props';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useTabStore } from '@/store/modules/tab';

defineOptions({
  name: 'ContextMenu'
});

interface Props {
  tabId: string;
  trigger?: Trigger[];
  excludeKeys?: App.Global.DropdownKey[];
  disabledKeys?: App.Global.DropdownKey[];
}

const props = withDefaults(defineProps<Props>(), {
  trigger: () => ['contextmenu'],
  excludeKeys: () => [],
  disabledKeys: () => []
});

const app = useAppStore();
const tab = useTabStore();

interface DropdownOption {
  key: App.Global.DropdownKey;
  label: string;
  icon: string;
  disabled?: boolean;
}

const options = computed(() => {
  const opts: DropdownOption[] = [
    {
      key: 'reloadCurrent',
      label: $t('dropdown.reloadCurrent'),
      icon: 'ant-design:reload-outlined'
    },
    {
      key: 'closeCurrent',
      label: $t('dropdown.closeCurrent'),
      icon: 'ant-design:close-outlined'
    },
    {
      key: 'closeOther',
      label: $t('dropdown.closeOther'),
      icon: 'ant-design:column-width-outlined'
    },
    {
      key: 'closeLeft',
      label: $t('dropdown.closeLeft'),
      icon: 'mdi:format-horizontal-align-left'
    },
    {
      key: 'closeRight',
      label: $t('dropdown.closeRight'),
      icon: 'mdi:format-horizontal-align-right'
    },
    {
      key: 'closeAll',
      label: $t('dropdown.closeAll'),
      icon: 'ant-design:line-outlined'
    }
  ];
  const { excludeKeys, disabledKeys } = props;

  const result = opts.filter(opt => !excludeKeys.includes(opt.key));

  disabledKeys.forEach(key => {
    const opt = result.find(item => item.key === key);

    if (opt) {
      opt.disabled = true;
    }
  });

  return result;
});

const dropdownAction: Record<App.Global.DropdownKey, () => void> = {
  reloadCurrent() {
    app.reloadPage();
  },
  closeCurrent() {
    tab.removeTab(props.tabId);
  },
  closeOther() {
    tab.clearTabs([props.tabId]);
  },
  closeLeft() {
    tab.clearLeftTabs(props.tabId);
  },
  closeRight() {
    tab.clearRightTabs(props.tabId);
  },
  closeAll() {
    tab.clearTabs();
  }
};
</script>

<template>
  <ADropdown :trigger="trigger" placement="bottom" destroy-popup-on-hide>
    <slot></slot>
    <template #overlay>
      <AMenu>
        <AMenuItem
          v-for="option in options"
          :key="option.key"
          :disabled="option.disabled"
          @click="dropdownAction[option.key]"
        >
          <div class="flex-y-center">
            <SvgIcon :icon="option.icon" class="text-icon" />
            <span class="pl-12px">{{ option.label }}</span>
          </div>
        </AMenuItem>
      </AMenu>
    </template>
  </ADropdown>
</template>

<style scoped></style>
