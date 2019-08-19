module.exports = {
  extends: [
    'plugin:vue/essential'
  ],
  rules: {
    'vue/require-prop-type-constructor': 0,
    'vue/no-unused-components': 0,
    'vue/no-parsing-error': [2, {
      'invalid-first-character-of-tag-name': false
    }],
    'vue/no-side-effects-in-computed-properties': 0,
    'vue/no-use-v-if-with-v-for': 0
  }
}