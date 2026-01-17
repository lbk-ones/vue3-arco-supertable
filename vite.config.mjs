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
                target: "http://127.0.0.1:9214",
                changeOrigin: true,
                rewrite: function (p) { return p.replace(/^\/api/, ""); },
            },
        },
        strictPort: false,
    },
    plugins: [
        vue(),
        dts({
            tsconfigPath: './tsconfig.types.json',
            outDir: 'dist/types',
            insertTypesEntry: true
        })
    ],
    build: {
        outDir: 'dist',
        lib: {
            entry: ['src/vue3-arco-supertable.ts'],
            name: 'vue3-arco-supertable',
            fileName: function (format) { return "vue3-arco-supertable.".concat(format, ".js"); }
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
