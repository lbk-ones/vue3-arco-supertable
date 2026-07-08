import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from 'path';
import dts from 'vite-plugin-dts';
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        extensions: ['.ts', '.js', '.vue']
    },
    server: {
        proxy: {
            "/api": {
                target: "http://127.0.0.1:9999",
                changeOrigin: true,
                rewrite: function (p) { return p.replace(/^\/api/, ""); },
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
            rollupTypes: true,
        })
    ],
    build: {
        outDir: 'dist',
        lib: {
            entry: path.resolve(__dirname, 'src/arco-vue3-supertable.ts'),
            name: 'ArcoVue3Supertable',
            fileName: function (format) {
                if (format === 'umd') {
                    return 'arco-vue3-supertable.umd.js';
                }
                else if (format === 'es') {
                    return 'arco-vue3-supertable.es.js';
                }
                return 'arco-vue3-supertable.js';
            }
        },
        rollupOptions: {
            external: [
                'vue',
                '@arco-design/web-vue',
                'vue-json-pretty',
                'axios'
            ],
            // ✅ 完整的输出配置
            output: [
                {
                    format: 'umd',
                    name: 'ArcoVue3Supertable',
                    entryFileNames: 'arco-vue3-supertable.umd.js',
                    dir: 'dist',
                    globals: {
                        vue: 'Vue',
                        '@arco-design/web-vue': 'ArcoVue',
                        'vue-json-pretty': 'VueJsonPretty',
                        'axios': 'axios'
                    }
                },
                {
                    format: 'es',
                    entryFileNames: 'arco-vue3-supertable.es.js',
                    dir: 'dist'
                }
            ]
        }
    }
});
