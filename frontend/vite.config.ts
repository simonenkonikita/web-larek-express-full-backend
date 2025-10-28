import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths({ root: __dirname })],
  base: '/',
  resolve: {
    alias: {
      $fonts: resolve('./src/vendor/fonts'),
      $assets: resolve('./src/assets'),
    }
  },
  build: {
    assetsInlineLimit: 0,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "./src/scss/variables" as *;
          @use "./src/scss/mixins";
        `,
      },

    }
  },

})
