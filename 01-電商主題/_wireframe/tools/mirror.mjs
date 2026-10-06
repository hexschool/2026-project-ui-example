// 重新鏡像 wireframe 原站 → 本地純 HTML + CSS
// 用法：node tools/mirror.mjs            （從原站重新抓取）
//       node tools/mirror.mjs --cache <dir>  （改讀 <dir>/<name>.html 與 <dir>/app.css，不連網）
// 需求：Node 18+（使用全域 fetch）。只會寫入 pages/、assets/。
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ORIGIN = 'https://cartflow-plum.vercel.app'
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const cacheIdx = process.argv.indexOf('--cache')
const CACHE = cacheIdx > -1 ? path.resolve(process.argv[cacheIdx + 1]) : null

// 原站路徑 → 本地檔名（不含 .html）
export const PAGES = [
  ['/', 'home'],
  ['/products', 'products'],
  ['/product/p-1001', 'product-p-1001'],
  ['/product/p-1002', 'product-p-1002'],
  ['/product/p-1003', 'product-p-1003'],
  ['/product/p-1004', 'product-p-1004'],
  ['/product/p-1005', 'product-p-1005'],
  ['/product/p-1006', 'product-p-1006'],
  ['/cart', 'cart'],
  ['/checkout', 'checkout'],
  ['/order-result', 'order-result'],
  ['/login', 'login'],
  ['/register', 'register'],
  ['/orders', 'orders'],
  ['/admin', 'admin'],
  ['/admin/login', 'admin-login'],
  ['/admin/orders', 'admin-orders'],
  ['/admin/products/new', 'admin-products-new'],
  ['/admin/products/p-1001/edit', 'admin-products-p-1001-edit'],
]
const MIRRORED = new Set(PAGES.map(([, n]) => n))
const CSS_NAME = 'wireframe.css'

async function getText(url, cacheFile) {
  if (CACHE) return fs.readFile(path.join(CACHE, cacheFile), 'utf8')
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.text()
}

// ---------- CSS ----------
// 從 open 位置（某個 prelude 的起點）找到對應的 } 結尾，略過字串
function blockEnd(css, from) {
  let depth = 0
  let quote = null
  for (let i = css.indexOf('{', from); i < css.length; i++) {
    const c = css[i]
    if (quote) { if (c === '\\') i++; else if (c === quote) quote = null; continue }
    if (c === '"' || c === "'") { quote = c; continue }
    if (c === '{') depth++
    else if (c === '}' && --depth === 0) return i + 1
  }
  throw new Error('unbalanced CSS block at ' + from)
}
// 移除以 prelude 開頭的整個區塊；offset 用來略過 prelude 前綴（例如前一條規則的 "}"）
function removeBlock(css, prelude, label, offset = 0) {
  const found = css.indexOf(prelude)
  if (found < 0) throw new Error(`CSS block not found: ${label}`)
  const i = found + offset
  return css.slice(0, i) + css.slice(blockEnd(css, i))
}

async function main() {
  const htmlByName = {}
  let cssHref = null
  for (const [route, name] of PAGES) {
    const html = await getText(ORIGIN + route, `${name}.html`)
    htmlByName[name] = html
    const hrefs = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1])
    for (const h of hrefs) {
      if (cssHref && cssHref !== h) throw new Error(`多於一個 CSS：${cssHref} / ${h}，請更新腳本`)
      cssHref = h
    }
    console.log('fetched', route)
  }

  // ---- CSS + 字型 ----
  const cssUrl = new URL(cssHref, ORIGIN)
  let css = await getText(cssUrl.href, 'app.css')
  // 深色模式：移除 OS 深色偏好區塊與 .dark 變數區塊（含 lab() 版本），讓畫面永遠是淺色。
  // .dark\:xxx 工具類別需要祖先有 .dark 才會生效，本站從不加 .dark，保留無妨。
  css = removeBlock(css, '@media (prefers-color-scheme:dark){', 'prefers-color-scheme:dark')
  css = removeBlock(css, '@supports (color:lab(0% 0 0)){.dark{', '@supports .dark')
  css = removeBlock(css, '}.dark{', '.dark', 1) // offset 1：保留前一條規則的 }
  if (/prefers-color-scheme|:root:not\(\.light\)|[}\s]\.dark\{/.test(css)) throw new Error('仍有深色模式規則殘留')

  const fontUrls = [...new Set([...css.matchAll(/url\(([^)]+\.woff2)\)/g)].map((m) => m[1]))]
  for (const rel of fontUrls) {
    const file = path.basename(rel)
    const dest = path.join(ROOT, 'assets/fonts', file)
    if (!CACHE) {
      const res = await fetch(new URL(rel, cssUrl))
      if (!res.ok) throw new Error(`${res.status} font ${rel}`)
      await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()))
    }
    css = css.split(`url(${rel})`).join(`url(../fonts/${file})`)
  }
  const cssHeader = `/*
 * 居所家具選物 — 電商流程線框圖（wireframe）編譯後樣式的本地鏡像
 * 來源：原站 Next.js + Tailwind v4 編譯產物 ${path.basename(cssHref)}
 * 本地修改：
 *   1. 移除「作業系統深色偏好」媒體查詢與 .dark 變數區塊 → 不論作業系統設定都維持淺色
 *   2. 字型 url() 改為相對路徑 ../fonts/*.woff2
 * 其餘內容未改動。請勿手動編輯；需要調整請改 mirror.css，或重跑 tools/mirror.mjs。
 */
`
  await fs.writeFile(path.join(ROOT, 'assets/css', CSS_NAME), cssHeader + css)
  console.log(`css → assets/css/${CSS_NAME} (${fontUrls.length} fonts)`)

  // ---- HTML ----
  const unmapped = new Set()
  const mapRoute = (href) => {
    const [p, hash] = href.split('#')
    let name = p === '/' || p === '' ? 'home' : p.replace(/^\/+|\/+$/g, '').replace(/\//g, '-')
    if (!MIRRORED.has(name)) {
      if (/^admin-products-p-\d+-edit$/.test(name)) name = 'admin-products-p-1001-edit'
      else if (/^product-p-\d+$/.test(name)) name = 'product-p-1001'
      else { unmapped.add(href); return href }
    }
    return `${name}.html${hash !== undefined ? '#' + hash : ''}`
  }

  for (const [route, name] of PAGES) {
    let h = htmlByName[name]
    h = h
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '') // 所有 script（含 self.__next_f.push RSC payload）
      .replace(/<link rel="(?:preload|modulepreload|prefetch)"[^>]*\/?>/g, '') // preload script / font
      .replace(/<meta name="next-size-adjust"[^>]*\/?>/g, '')
      .replace(/<div hidden="">(?:<!--\/?\$[!?]?-->)*<\/div>/g, '') // Next.js 空的 Suspense 容器
      .replace(/<template data-dgst="[^"]*"><\/template>/g, '') // client bailout 標記
      .replace(/<!--\/?\$[!?]?-->/g, '') // React Suspense 註解標記
      .replace(/<!-- -->/g, '') // React 文字節點分隔註解
      .replace('<meta charSet="utf-8"/>', '<meta charset="utf-8"/>')
      .replace(/<link rel="stylesheet" href="[^"]+"[^>]*\/>/, `<link rel="stylesheet" href="../assets/css/${CSS_NAME}"/><link rel="stylesheet" href="../assets/css/mirror.css"/>`)
      .replace(/\b(href|action|formAction)="(\/[^/"][^"]*|\/)"/g, (_, attr, v) => `${attr}="${mapRoute(v)}"`)
      .replace('<head>', `<head><!-- 本檔為 wireframe 靜態鏡像（原站路徑：${route}）：已移除所有 script，互動元件僅呈現初始畫面。頁面索引：../index.html -->`)
      .replace(/(<body[^>]*>)/, `$1<div class="wf-mirror-bar"><a href="../index.html">← 回到頁面索引</a><span class="wf-mirror-bar__route">${route}</span></div>`)
    // 與 tools/check-links.mjs 的規則一致：不可有 script、inline 事件、javascript: 網址或原站殘留
    if (/<script|<[a-z][^>]*\son[a-z]+\s*=|javascript:|\/_next\/|cartflow-plum/i.test(h)) throw new Error(`${name}: 清理後仍有 script／inline 事件／_next 殘留`)
    await fs.writeFile(path.join(ROOT, 'pages', `${name}.html`), h)
  }
  console.log(`html → pages/*.html (${PAGES.length})`)
  if (unmapped.size) console.warn('未對應的站內連結：', [...unmapped])
}

main().catch((e) => { console.error(e); process.exit(1) })
