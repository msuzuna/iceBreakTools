import { resolve } from 'path';
import { defineConfig } from 'vite';
import vitePluginPug from './plugins/vite-plugin-pug';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  root: 'src',
  envDir: '../',
  build: {
    outDir: '../public',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.pug'),
        roomTest: resolve(__dirname, 'src/roomTest/index.pug'),
      },
    },
  },
  plugins: [vitePluginPug()],
  css: {
    postcss: {
      plugins: [autoprefixer],
    },
  },
});
