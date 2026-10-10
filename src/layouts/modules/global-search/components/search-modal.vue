<script lang="ts" setup>
import { computed, ref, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { onKeyStroke, useDebounceFn } from '@vueuse/core';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useRouteStore } from '@/store/modules/route';
import SearchFooter from './search-footer.vue';
import SearchResult from './search-result.vue';

defineOptions({ name: 'SearchModal' });

const router = useRouter();
const appStore = useAppStore();
const routeStore = useRouteStore();

const isMobile = computed(() => appStore.isMobile);

const keyword = ref('');
const activePath = ref('');
const resultOptions = shallowRef<App.Global.Menu[]>([]);

const handleSearch = useDebounceFn(search, 300);

const visible = defineModel<boolean>('show', { required: true });

function search() {
  resultOptions.value = routeStore.searchMenus.filter((menu: App.Global.Menu) => {
    const trimKeyword = keyword.value.toLocaleLowerCase().trim();
    const title = (menu.i18nKey ? $t(menu.i18nKey) : menu.label).toLocaleLowerCase();
    return trimKeyword && title.includes(trimKeyword);
  });
  activePath.value = resultOptions.value[0]?.routePath ?? '';
}

function handleClose() {
  // handle with setTimeout to prevent user from seeing some operations
  setTimeout(() => {
    visible.value = false;
    resultOptions.value = [];
    keyword.value = '';
  }, 200);
}

/** key up */
function handleUp() {
  const { length } = resultOptions.value;
  if (length === 0) return;

  const index = getActivePathIndex();
  if (index === -1) return;

  const activeIndex = index === 0 ? length - 1 : index - 1;

  activePath.value = resultOptions.value[activeIndex].routePath;
}

/** key down */
function handleDown() {
  const { length } = resultOptions.value;
  if (length === 0) return;

  const index = getActivePathIndex();
  if (index === -1) return;

  const activeIndex = index === length - 1 ? 0 : index + 1;

  activePath.value = resultOptions.value[activeIndex].routePath;
}

function getActivePathIndex() {
  return resultOptions.value.findIndex(item => item.routePath === activePath.value);
}

/** key enter */
function handleEnter() {
  if (resultOptions.value?.length === 0 || activePath.value === '') return;
  handleClose();
  router.push(activePath.value);
}

function registerShortcut() {
  onKeyStroke('Escape', handleClose);
  onKeyStroke('Enter', handleEnter);
  onKeyStroke('ArrowUp', handleUp);
  onKeyStroke('ArrowDown', handleDown);
}

registerShortcut();
</script>

<template>
  <AModal
    v-model:open="visible"
    :closable="false"
    :footer="null"
    :width="isMobile ? '100%' : 630"
    :style="{ top: isMobile ? '0px' : '50px' }"
    :wrap-style="{ overflow: 'hidden' }"
    class="global-search-modal"
    @after-close="handleClose"
  >
    <AInputGroup>
      <AInput v-model:value="keyword" allow-clear :placeholder="$t('common.keywordSearch')" @input="handleSearch">
        <template #prefix>
          <icon-uil-search class="text-15px text-#c2c2c2" />
        </template>
      </AInput>
      <AButton v-if="isMobile" type="primary" ghost @click="handleClose">{{ $t('common.cancel') }}</AButton>
    </AInputGroup>

    <div class="mt-20px">
      <AEmpty v-if="resultOptions.length === 0" :description="$t('common.noData')" />
      <SearchResult v-else v-model:path="activePath" :options="resultOptions" @enter="handleEnter" />
    </div>
    <SearchFooter v-if="!isMobile" class="-mx-24px -mb-20px mt-20px" />
  </AModal>
</template>

<style lang="scss" scoped>
.global-search-modal {
  :deep(.ant-modal-body) {
    padding: 20px 24px;
  }
}
</style>
