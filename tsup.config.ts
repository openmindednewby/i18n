import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts', core: 'src/core/index.ts' },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: false,
  treeshake: true,
  minify: false,
  target: 'es2020',
  outDir: 'dist',
  external: ['react', 'react-dom', 'react-native', 'i18next', 'react-i18next'],
});
