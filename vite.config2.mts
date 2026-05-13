import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:9999",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      }
    },
    strictPort: false,
  },
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.types.json',
      outDir: 'dist/types',
      insertTypesEntry: true,
      rollupTypes: true
    })
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: ['src/arco-vue3-supertable.ts'],
      name: 'arco-vue3-supertable',
      fileName: (format) => `arco-vue3-supertable.${format}.js`
    },
    rollupOptions: {
      external: ['vue', '@arco-design/web-vue', 'vue-json-pretty', 'axios'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
});
