import fs from 'fs';
import path from 'path';

import minimist from 'minimist';
import { getPackages } from '@lerna/project';
import { filterPackages } from '@lerna/filter-packages';
import batchPackages from '@lerna/batch-packages';
import sourcemaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import sizes from '@atomico/rollup-plugin-sizes';
import autoExternal from 'rollup-plugin-auto-external';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import postCssCustomProps from 'postcss-custom-properties';

const { externals: globals, postcssContentHashPlugin } = require('@spotim/webpack_package');
const increaseCssSpecificity = require('@spotim/postcss-increase-specificity');

async function getSortedPackages(scope, ignore) {
  const packages = await getPackages(__dirname);
  const filtered = filterPackages(packages, scope, ignore, false);

  return batchPackages(filtered).reduce((arr, batch) => arr.concat(batch), []);
}

async function build(commandLineArgs) {
  const config = [];

  // Support --scope and --ignore globs if passed in via commandline
  const { scope, ignore } = minimist(process.argv.slice(2));
  const packages = await getSortedPackages(scope, ignore);

  // prevent rollup warning
  delete commandLineArgs.ci;
  delete commandLineArgs.scope;
  delete commandLineArgs.ignore;

  packages.forEach(pkg => {
    const basePath = path.relative(__dirname, pkg.location);
    const input = path.join(basePath, 'src/index.ts');
    const packageJsonPath = path.join(basePath, 'package.json');
    const { name, main, umd, module, version } = pkg.toJSON();
    console.log(`🚀 Building ${name} v${version}`);

    const basePlugins = [
      sourcemaps(),
      resolve(),
      commonjs(),
      json(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
      }),
      sizes(),
    ];

    config.push({
      input,
      output: [
        {
          name,
          file: path.join(basePath, umd),
          format: 'umd',
          globals,
          sourcemap: true,
        },
        {
          name,
          file: path.join(basePath, main),
          format: 'cjs',
          globals,
          sourcemap: true,
          exports: 'auto',
        },
        {
          name,
          file: path.join(basePath, module),
          format: 'es',
          globals,
          sourcemap: true,
        },
      ],
      plugins: [
        // Auto externalize all of your deps and peerDeps
        autoExternal({
          packagePath: packageJsonPath,
        }),
        ...basePlugins,
        postcss({
          minimize: true,
          extract: path.resolve(basePath, 'dist/main.css'),
          autoModules: false,
          modules: {
            scopeBehaviour: 'local',
            hashPrefix: 'prefix',
            generateScopedName: `${name}__[local]__[hash]`,
            localsConvention: 'camelCase',
          },
          use: ['sass'],
          plugins: [
            postCssCustomProps({ preserve: true }),
            increaseCssSpecificity({
              id: '[data-openweb-style-wrapper]',
            }),
            postcssContentHashPlugin(),
          ],
        }),

        typescript({
          tsconfig: fs.existsSync(`${basePath}/tsconfig.json`) ? `${basePath}/tsconfig.json` : 'tsconfig.json',
          tsconfigOverride: {
            compilerOptions: {
              declaration: true,
              paths: {
                '@spotim/*': ['packages/*/src'],
              },
            },
            include: fs.existsSync(`${basePath}/tsconfig.json`) ? [] : null,
          },
        }),
      ],
    });
  });

  return config;
}

export default build;
