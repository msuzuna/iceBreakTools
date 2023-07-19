import { resolve } from "path";
import { defineConfig } from "vite";
import vitePluginPug from "./plugins/vite-plugin-pug";
import autoprefixer from "autoprefixer";

export default defineConfig({
  root: "src",
  envDir: '../',
  build: {
    outDir: "../public",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "src/index.pug",
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
