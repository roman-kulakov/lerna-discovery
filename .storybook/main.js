const { postcssContentHashPlugin } = require('@spotim/webpack_package');
const increaseCssSpecificity = require('@spotim/postcss-increase-specificity');

const scssRule = {
  test: /\.scss$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: {
          exportLocalsConvention: 'camelCase',
        },
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            increaseCssSpecificity({
              id: '[data-openweb-style-wrapper]',
              withoutCssLoaderPrefix: true,
            }),

            postcssContentHashPlugin(),
          ],
        }
      },
    },
    {
      loader: 'sass-loader',
    },
  ],
}

module.exports = {
  stories: [
    "../packages/**/*.stories.mdx",
    "../packages/**/*.stories.@(ts|tsx)"
  ],
  addons: [
    "@storybook/addon-essentials"
  ],
  framework: "@storybook/react",
  webpackFinal: (config) => {
    return {
      ...config,
      module: {
        ...config.module,
        rules: [scssRule, ...config.module.rules],
      },
    };
  },
  core: {
    builder: 'webpack5',
  },
}
