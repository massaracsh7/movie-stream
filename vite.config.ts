import { defineConfig } from 'vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import 'isomorphic-fetch';
import globalStyle from '@originjs/vite-plugin-global-style';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    globalStyle({
      sourcePath: './src/styles', // Adjust this path as needed
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/_constants.scss"; @import "./src/styles/_mixins.scss"; @import "./src/styles/_placeholders.scss";`, // Include global variables
      },
    },
  },
  resolve: {
    alias: {
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      'node-fetch': 'isomorphic-fetch',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
  },
});
