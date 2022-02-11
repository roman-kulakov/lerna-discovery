module.exports = {
  extends: '@spotim/eslint-config',
  root: true,
  ignorePatterns: ['**/dist/**'],
  rules: {
    'no-console': 'off',
    'no-param-reassign': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
  },
};
