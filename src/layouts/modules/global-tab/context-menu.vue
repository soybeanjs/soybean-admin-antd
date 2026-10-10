<script setup lang="ts">
import { computed } from 'vue';
import type { Trigger } from 'ant-design-vue/es/dropdown/props';
import { $t } from '@/locales';
import { useTabStore } from '@/store/modules/tab';

defineOptions({
  name: 'ContextMenu'
});

interface Props {
  tabId: string;
  /** Dropdown trigger, default is `contextmenu` */
  trigger?: Trigger[];
  excludeKeys?: App.Global.DropdownKey[];
  disabledKeys?: App.Global.DropdownKey[];
}

const props = withDefaults(defineProps<Props>(), {
  trigger: () => ['contextmenu'],
  excludeKeys: () => [],
  disabledKeys: () => []
});

const { removeTab, clearTabs, clearLeftTabs, clearRightTabs, fixTab, unfixTab, isTabRetain, homeTab } = useTabStore();

interface DropdownOption {
  key: App.Global.DropdownKey;
  label: string;
  icon: string;
  disabled?: boolean;
}

const options = computed(() => {
  const opts: DropdownOption[] = [
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

  if (props.tabId !== homeTab?.id) {
    if (isTabRetain(props.tabId)) {
      opts.push({
        key: 'unpin',
        label: $t('dropdown.unpin'),
        icon: 'mdi:pin-off-outline'
      });
    } else {
      opts.push({
        key: 'pin',
        label: $t('dropdown.pin'),
        icon: 'mdi:pin-outline'
      });
    }
  }

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
  closeCurrent() {
    removeTab(props.tabId);
  },
  closeOther() {
    clearTabs([props.tabId]);
  },
  closeLeft() {
    clearLeftTabs(props.tabId);
  },
  closeRight() {
    clearRightTabs(props.tabId);
  },
  closeAll() {
    clearTabs();
  },
  pin() {
    fixTab(props.tabId);
  },
  unpin() {
    unfixTab(props.tabId);
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
          <div class="flex-y-center gap-12px">
            <SvgIcon :icon="option.icon" class="text-icon" />
            <span>{{ option.label }}</span>
          </div>
        </AMenuItem>
      </AMenu>
    </template>
  </ADropdown>
</template>

<style scoped></style>
