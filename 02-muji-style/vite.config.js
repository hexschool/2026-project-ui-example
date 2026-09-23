import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // 相對路徑：build 後的 dist/ 可放在任意子目錄（GitHub Pages 等）
  base: './',
  plugins: [
    vue({
      // 模板內的 <img src="images/xxx.jpg"> 維持原樣（指向 public/），不轉成模組 import
      template: { transformAssetUrls: false },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5.3 仍使用 @import 與全域函式，關閉 Dart Sass 的過時警告
        quietDeps: true,
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
      },
    },
  },
})
