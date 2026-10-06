// 檢查 _wireframe 是「純 HTML＋CSS、除了圖片之外可離線瀏覽」的狀態
// 用法：node tools/check-links.mjs
// 檢查範圍：index.html、pages/*.html 的 href / src / srcset / action / poster 與 inline style 的 url()，
//           以及 assets/css/*.css 的 url() 與 @import
// 失敗條件：
//   1. 指向不存在的本地檔案，或 #錨點 在目標頁不存在
//   2. 以 / 開頭的絕對路徑、/_next/ 殘留
//   3. 外部網址：只允許 images.unsplash.com 的圖片（原站的課程照片，刻意保留外部網址）
//   4. 任何可執行內容：<script>、<iframe>／<object>／<embed>、inline 事件（onclick= 等）、javascript: 網址
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ALLOWED_EXTERNAL = [/^https:\/\/images\.unsplash\.com\/photo-/] // 只有圖片可以是外部網址
const IGNORED = [/^#/, /^mailto:/, /^tel:/, /^data:/, /^http:\/\/www\.w3\.org\//] // w3.org 只出現在 SVG 命名空間

// 可執行內容（HTML 註解先移除再比對）
const EXECUTABLE = [
  [/<script\b/i, '<script>'],
  [/<(?:iframe|object|embed)\b/i, '<iframe>／<object>／<embed>'],
  [/<[a-z][^>]*\son[a-z]+\s*=/i, 'inline 事件屬性（on…=）'],
  [/\b(?:href|src|action|formaction|xlink:href)\s*=\s*["']?\s*javascript:/i, 'javascript: 網址'],
]

const files = [
  'index.html',
  ...(await fs.readdir(path.join(ROOT, 'pages'))).filter((f) => f.endsWith('.html')).map((f) => `pages/${f}`),
  ...(await fs.readdir(path.join(ROOT, 'assets/css'))).filter((f) => f.endsWith('.css')).map((f) => `assets/css/${f}`),
]

const problems = []
let checked = 0
let external = 0
// 連到 #錨點 時，確認目標頁面真的有該 id
async function checkAnchor(from, targetAbs, hash) {
  if (!hash || !targetAbs.endsWith('.html')) return
  const html = await fs.readFile(targetAbs, 'utf8')
  if (!html.includes(`id="${hash}"`)) problems.push(`${from}: 目標頁沒有錨點 #${hash}`)
}
// srcset 可能有多個候選：「a.png 1x, b.png 2x」→ 只取網址
const splitSrcset = (v) => v.split(',').map((s) => s.trim().split(/\s+/)[0]).filter(Boolean)
const decodeAttr = (v) => v.replace(/&amp;/g, '&').replace(/&quot;/g, '"')

for (const rel of files) {
  const abs = path.join(ROOT, rel)
  const text = await fs.readFile(abs, 'utf8')
  const isCss = rel.endsWith('.css')
  const code = isCss ? text.replace(/\/\*[\s\S]*?\*\//g, '') : text.replace(/<!--[\s\S]*?-->/g, '')

  let refs
  if (isCss) {
    refs = [
      ...[...code.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)].map((m) => m[1]),
      ...[...code.matchAll(/@import\s+["']([^"']+)["']/g)].map((m) => m[1]),
    ]
  } else {
    refs = [
      ...[...code.matchAll(/\b(href|src|srcset|srcSet|action|poster)="([^"]*)"/g)].flatMap((m) =>
        /^srcset$/i.test(m[1]) ? splitSrcset(decodeAttr(m[2])) : [decodeAttr(m[2])],
      ),
      // inline style 的 background-image:url(...)
      ...[...code.matchAll(/\bstyle="([^"]*)"/g)].flatMap((m) =>
        [...decodeAttr(m[1]).matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)].map((u) => u[1]),
      ),
    ]
    for (const [re, label] of EXECUTABLE) if (re.test(code)) problems.push(`${rel}: 含有可執行內容 ${label}`)
  }
  if (/\/_next\//.test(code)) problems.push(`${rel}: 含有 /_next/ 路徑`)

  for (const ref of refs) {
    if (ref.startsWith('#') && ref.length > 1 && !isCss) { await checkAnchor(rel, abs, ref.slice(1)); continue }
    if (IGNORED.some((re) => re.test(ref))) continue
    checked++
    if (/^[a-z][a-z0-9+.-]*:/i.test(ref) || ref.startsWith('//')) {
      if (ALLOWED_EXTERNAL.some((re) => re.test(ref))) external++
      else problems.push(`${rel}: 不允許的外部網址 ${ref}`)
      continue
    }
    if (ref.startsWith('/')) { problems.push(`${rel}: 絕對路徑 ${ref}`); continue }
    const [filePart, hash] = ref.split('#')
    const target = path.resolve(path.dirname(abs), decodeURI(filePart.split('?')[0]))
    try { await fs.access(target) } catch { problems.push(`${rel}: 找不到 ${ref}`); continue }
    await checkAnchor(rel, target, hash)
  }
}

console.log(`檢查 ${files.length} 個檔案、${checked} 個參照（其中 ${external} 個是允許的 Unsplash 圖片網址）`)
if (problems.length) {
  console.error(`發現 ${problems.length} 個問題：`)
  for (const p of problems) console.error('  ✗ ' + p)
  process.exit(1)
}
console.log('✓ 本地參照都指向存在的檔案；外部網址只有 Unsplash 圖片；沒有 script 或 inline 事件')
