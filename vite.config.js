import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // with options
      "/api": {
        target: "http://127.0.0.1:9124",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [vue(), viteStaticCopy({
    targets: [
      {
        // 1. 源文件/目录路径
        src: 'src/types/*', // 使用通配符 * 匹配 src/assets 下的所有文件
        // 2. 目标路径，相对于 'dist' 目录
        dest: 'types' // 复制到 dist/assets 目录
      }
    ]
  })],
  build: {
    // 打包后的文件输出目录，默认就是 'dist'
    outDir: 'dist',
    lib: {
      // 1. 指定库的入口文件
      entry: ['src/index.js'],
      // 2. 指定库的名称 (在 UMD 模式下会暴露在 window 全局对象上)
      name: 'SuperTable',
      // 3. 指定打包后生成的文件名格式
      //    Vite 会自动生成 .es.js, .umd.js 等后缀
      fileName: (format) => `arco-vue3-supertable.${format}.js`
    },
    rollupOptions: {
      // 4. 确保外部化处理那些你不想打包进库的依赖
      //    比如 Vue，用户会自己安装 Vue
      external: ['vue', '@arco-design/web-vue', 'vue-json-pretty', 'axios'],
      output: {
        // 5. 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
});
