<script setup lang="ts">
defineOptions({
  name: 'LangSwitch'
});

interface Props {
  lang: App.I18n.LangType;
  langOptions: App.I18n.LangOption[];
}

defineProps<Props>();

type Emits = {
  (e: 'changeLang', lang: App.I18n.LangType): void;
};

const emits = defineEmits<Emits>();

function changeLang(lang: App.I18n.LangType) {
  emits('changeLang', lang);
}
</script>

<template>
  <ADropdown placement="bottom">
    <AButton type="text" class="h-full">
      <div class="flex-y-center">
        <SvgIcon icon="heroicons:language" class="text-icon" />
      </div>
    </AButton>
    <template #overlay>
      <AMenu :selected-keys="[lang]">
        <AMenuItem v-for="option in langOptions" :key="option.key" @click="changeLang(option.key)">
          {{ option.label }}
        </AMenuItem>
      </AMenu>
    </template>
  </ADropdown>
</template>

<style scoped></style>
