import { Addon } from '@embroider/addon-dev/rollup';
import { babel } from '@rollup/plugin-babel';

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

export default {
  output: addon.output(),

  plugins: [
    addon.publicEntrypoints(['**/*.js', '**/*.gjs', 'index.js']),

    addon.appReexports([
      'components/**/*.js',
      'components/**/*.gjs',
      'helpers/**/*.js',
      'services/**/*.js',
    ]),

    addon.dependencies(),

    addon.hbs(),

    addon.gjs(),

    babel({
      extensions: ['.js', '.gjs'],
      babelHelpers: 'bundled',
    }),

    addon.keepAssets(['**/*.css']),

    addon.clean(),
  ],
};
