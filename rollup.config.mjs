import { Addon } from '@embroider/addon-dev/rollup';
import { babel } from '@rollup/plugin-babel';

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

export default {
  output: addon.output(),

  plugins: [
    addon.publicEntrypoints([
      '**/*.js',
      'index.js',
    ]),

    addon.appReexports([
      'components/**/*.js',
      'helpers/**/*.js',
      'services/**/*.js',
    ]),

    addon.dependencies(),

    babel({
      extensions: ['.js', '.gjs'],
      babelHelpers: 'bundled',
    }),

    addon.hbs(),

    addon.gjs(),

    addon.keepAssets(['**/*.css']),

    addon.clean(),
  ],
};
