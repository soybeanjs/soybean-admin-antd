import { defineConfig } from '@soybeanjs/eslint-config-vue';

export default defineConfig({
  overrides: {
    'vue/multi-word-component-names': [
      'warn',
      {
        ignores: ['index', 'App', 'Register', '[id]', '[url]']
      }
    ],
    'vue/component-name-in-template-casing': [
      'warn',
      'PascalCase',
      {
        registeredComponentsOnly: false,
        ignores: ['/^icon-/']
      }
    ]
  }
});
