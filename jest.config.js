const path = require('path');
const { lstatSync, readdirSync } = require('fs');

const basePath = path.resolve(__dirname, 'packages');
const packages = readdirSync(basePath).filter(name => {
  return lstatSync(path.join(basePath, name)).isDirectory();
});

module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!**/node_modules/**', '!src/**/*.(stories|test).{js,jsx,ts,tsx}'],
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/lib/',
    '<rootDir>/build/',
    '<rootDir>/.yalc',
    '<rootDir>/src/index.ts',
    '<rootDir>/src/types.ts',
  ],
  moduleNameMapper: {
    '\\.(sass|scss|css)$': 'identity-obj-proxy',
    ...packages.reduce(
      (acc, name) => ({
        ...acc,
        [`@spotim/${name}(.*)$`]: `<rootDir>/packages/./${name}/src/$1`,
      }),
      {},
    ),
  },
};
