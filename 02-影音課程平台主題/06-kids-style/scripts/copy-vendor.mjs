// 把 node_modules 裡網頁需要的檔案複製到專案內，讓 HTML 不必引用 node_modules
// - Bootstrap JS（含 Popper）→ js/vendor/
// - Bootstrap Icons 字型 → css/fonts/（圖示樣式由 scss/main.scss 一起編譯進 css/style.css）
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const copies = [
  ['node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', 'js/vendor/bootstrap.bundle.min.js'],
  ['node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map', 'js/vendor/bootstrap.bundle.min.js.map'], // 讓 DevTools 不出現找不到 source map 的警告
  ['node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2', 'css/fonts/bootstrap-icons.woff2'],
  ['node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff', 'css/fonts/bootstrap-icons.woff'],
]

for (const [from, to] of copies) {
  fs.mkdirSync(path.dirname(path.join(root, to)), { recursive: true })
  fs.copyFileSync(path.join(root, from), path.join(root, to))
  console.log(`copied ${to}`)
}
