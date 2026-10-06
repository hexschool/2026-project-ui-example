// 重新鏡像 wireframe 原站 → 本地純 HTML + CSS
//
// 原站是單一路由（/）的 Next.js 單頁應用：頁首的按鈕用 React state 切換 5 個畫面（view），
// 網址不會變。所以這支腳本用 Playwright 開啟原站、依序點頁首按鈕切到每個畫面，
// 再把當下的 DOM 存成靜態 HTML（移除所有 script）。
//
// 用法：
//   node tools/mirror.mjs                 # 重新鏡像 pages/、assets/css/wireframe.css
//   node tools/mirror.mjs --screenshots   # 同上，並重拍 screenshots/（1440px 寬、全頁）
// 需求：Node 18+、Playwright（任一種方式找得到即可）：
//   1. 這個資料夾或上層有 node_modules/playwright
//   2. 環境變數 PLAYWRIGHT_DIR=<含 playwright 套件的 node_modules 資料夾>
//   3. 本機預設：/Users/casper/.npm/_npx/9833c18b2d85bc59/node_modules/
// 瀏覽器：環境變數 CHROMIUM_PATH 指定執行檔；沒指定時，若本機有 chromium_headless_shell-1234 就用它
//（headless shell 不會在 Dock 跳出圖示），否則交給 Playwright 自己找。
// 只會寫入 pages/、assets/css/wireframe.css、assets/css/fonts.css、assets/fonts/、screenshots/。
import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const ORIGIN = 'https://wireframe-2-video-platform.vercel.app'
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SHOTS = process.argv.includes('--screenshots')
const CSS_NAME = 'wireframe.css'

// 原站的 5 個畫面：id（原站 state 值）、本地檔名、頁首上要點的按鈕文字、切換完成的判斷依據（h1 文字）
export const VIEWS = [
  { id: 'home', file: 'home', label: '首頁', click: null, h1: '把想學很久的那件事，變成手上的作品。' },
  { id: 'courses', file: 'courses', label: '探索課程', click: 'header nav button:text-is("探索課程")', h1: '找到下一件作品' },
  { id: 'detail', file: 'detail', label: '課程詳情', click: 'header nav button:text-is("課程詳情")', h1: '從零開始的手捏陶｜做出第一只日用食器' },
  { id: 'learn', file: 'learn', label: '學習頁', click: 'header button:text-is("我的課程")', h1: '3-2 從土球到碗：拇指下壓的角度' },
  { id: 'teacher', file: 'teacher', label: '講師後台', click: 'header button:text-is("講師後台")', h1: '講師工作台' },
]

function loadPlaywright() {
  const candidates = [
    path.join(ROOT, 'tools', 'noop.js'),
    process.env.PLAYWRIGHT_DIR && path.join(process.env.PLAYWRIGHT_DIR, 'noop.js'),
    '/Users/casper/.npm/_npx/9833c18b2d85bc59/node_modules/noop.js',
  ].filter(Boolean)
  for (const from of candidates) {
    try { return createRequire(from)('playwright') } catch { /* 換下一個位置 */ }
  }
  throw new Error('找不到 playwright：請在上層安裝（npm i -D playwright），或設定 PLAYWRIGHT_DIR=<含 playwright 的 node_modules 資料夾>')
}

function chromiumPath() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH
  const shell = path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell')
  return existsSync(shell) ? shell : undefined
}

// ---------- CSS ----------
// 從 prelude 起點找到對應的 } 結尾，略過字串
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

// ---------- 字型 ----------
// 原站 CSS 用 @import 載入 Google Fonts（Noto Sans TC 400–700＋Noto Serif TC 500–700）。
// 實際只有 Noto Sans TC 被用到（body）；.font-serif 被 Tailwind 工具類別蓋成 ui-serif，Noto Serif TC 沒有任何規則使用。
// Google 把中文字型切成上百個 unicode-range 子集，這裡只下載「5 個畫面實際出現的字」所在的子集。
const FONT_FAMILIES = ['Noto Sans TC']
const UA_CHROME = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'

function parseRanges(value) {
  return value.split(',').map((s) => s.trim().replace(/^U\+/i, '')).map((r) => {
    if (r.includes('?')) return [parseInt(r.replace(/\?/g, '0'), 16), parseInt(r.replace(/\?/g, 'F'), 16)]
    const [a, b] = r.split('-')
    return [parseInt(a, 16), parseInt(b ?? a, 16)]
  })
}

async function mirrorFonts(importUrl, usedChars) {
  const res = await fetch(importUrl, { headers: { 'User-Agent': UA_CHROME } }) // Chrome UA 才會拿到 woff2
  if (!res.ok) throw new Error(`${res.status} ${importUrl}`)
  const gcss = await res.text()
  const codepoints = [...new Set([...usedChars].map((c) => c.codePointAt(0)))]
  await fs.rm(path.join(ROOT, 'assets/fonts'), { recursive: true, force: true })
  await fs.mkdir(path.join(ROOT, 'assets/fonts'), { recursive: true })
  const out = []
  let bytes = 0
  for (const m of gcss.matchAll(/(?:\/\* ([\w-]+) \*\/\s*)?@font-face \{([^}]*)\}/g)) {
    const [, subsetName, body] = m
    const family = body.match(/font-family: '([^']+)'/)[1]
    if (!FONT_FAMILIES.includes(family)) continue
    const weight = body.match(/font-weight: (\d+)/)[1]
    const url = body.match(/url\(([^)]+)\)/)[1]
    const ranges = parseRanges(body.match(/unicode-range: ([^;]+);/)[1])
    if (!codepoints.some((cp) => ranges.some(([a, b]) => cp >= a && cp <= b))) continue
    const subset = subsetName || url.match(/\.(\d+)\.woff2$/)?.[1] || String(out.length)
    const file = `${family.toLowerCase().replace(/\s+/g, '-')}-${weight}-${subset}.woff2`
    const fr = await fetch(url)
    if (!fr.ok) throw new Error(`${fr.status} font ${url}`)
    const buf = Buffer.from(await fr.arrayBuffer())
    bytes += buf.length
    await fs.writeFile(path.join(ROOT, 'assets/fonts', file), buf)
    out.push(`@font-face {${body.replace(url, `../fonts/${file}`)}}`)
  }
  const header = `/*
 * 原站 @import 的 Google Fonts，只保留 ${FONT_FAMILIES.join('、')}，且只保留 5 個畫面實際用到的字所在的 unicode-range 子集
 *（共 ${out.length} 個檔案，約 ${Math.round(bytes / 1024)} KB）。由 tools/mirror.mjs 產生，請勿手動編輯。
 * 原 @import：${importUrl}
 */
`
  await fs.writeFile(path.join(ROOT, 'assets/css/fonts.css'), header + out.join('\n') + '\n')
  console.log(`fonts → assets/fonts/（${out.length} 個子集，${Math.round(bytes / 1024)} KB）＋ assets/css/fonts.css`)
}

async function mirrorCss(cssHref, usedChars) {
  const cssUrl = new URL(cssHref, ORIGIN)
  const res = await fetch(cssUrl)
  if (!res.ok) throw new Error(`${res.status} ${cssUrl}`)
  let css = await res.text()
  // 深色模式：移除 OS 深色偏好區塊與 .dark 變數區塊（含 lab() 版本），讓畫面永遠是淺色。
  // 本站幾乎都用寫死的色碼（bg-[#f7f4ee] 等），只有 bg-muted 之類的 shadcn 變數會受影響。
  css = removeBlock(css, '@media (prefers-color-scheme:dark){', 'prefers-color-scheme:dark')
  css = removeBlock(css, '@supports (color:lab(0% 0 0)){.dark{', '@supports .dark')
  css = removeBlock(css, '}.dark{', '.dark', 1) // offset 1：保留前一條規則的 }
  if (/prefers-color-scheme|:root:not\(\.light\)|[}\s]\.dark\{/.test(css)) throw new Error('仍有深色模式規則殘留')
  // 字型：@import 的 Google Fonts 改成本地的 fonts.css
  const imports = [...css.matchAll(/@import\s*(?:url\()?"([^"]+)"\)?;/g)]
  if (imports.length !== 1 || !imports[0][1].startsWith('https://fonts.googleapis.com/')) throw new Error('預期只有一個 Google Fonts @import，請更新腳本')
  await mirrorFonts(imports[0][1], usedChars)
  css = css.replace(imports[0][0], '@import "fonts.css";')
  if (/url\([^)]*\.(woff2?|ttf|otf)/.test(css)) throw new Error('CSS 出現其他字型檔，請比照 01 電商的 mirror.mjs 下載到 assets/fonts/')
  const header = `/*
 * Craftory 手感工藝線上學院 — 影音課程平台線框圖（wireframe）編譯後樣式的本地鏡像
 * 來源：${ORIGIN} 的 Next.js + Tailwind v4 編譯產物 ${path.basename(cssHref)}
 * 本地修改：
 *   1. 移除「作業系統深色偏好」媒體查詢與 .dark 變數區塊 → 不論作業系統設定都維持淺色
 *   2. Google Fonts 的 @import 改成本地 fonts.css（字型檔在 ../fonts/）
 * 其餘內容未改動。請勿手動編輯；需要調整請改 mirror.css，或重跑 tools/mirror.mjs。
 */
`
  await fs.writeFile(path.join(ROOT, 'assets/css', CSS_NAME), header + css)
  console.log(`css → assets/css/${CSS_NAME}`)
}

// ---------- HTML ----------
function mirrorBar(view) {
  const links = VIEWS.map((v) => v.id === view.id
    ? `<a href="${v.file}.html" aria-current="page">${v.label}</a>`
    : `<a href="${v.file}.html">${v.label}</a>`).join('')
  return `<div class="wf-mirror-bar"><a href="../index.html">← 回到頁面索引</a><nav class="wf-mirror-bar__views" aria-label="切換 wireframe 畫面">${links}</nav><span class="wf-mirror-bar__route">原站：/（畫面 ${view.id}）</span></div>`
}

function clean(html, view) {
  let h = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '') // 所有 script（含 self.__next_f.push RSC payload）
    .replace(/<link rel="(?:preload|modulepreload|prefetch)"[^>]*\/?>/g, '') // preload 圖片、script
    .replace(/<link rel="(?:icon|apple-touch-icon)"[^>]*\/?>/g, '') // 原站的 /icon.svg 等，鏡像不需要
    .replace(/<meta name="next-size-adjust"[^>]*\/?>/g, '')
    .replace(/<meta name="color-scheme" content="light dark"\s*\/?>/, '<meta name="color-scheme" content="light">')
    .replace(/<next-route-announcer\b[^>]*>[\s\S]*?<\/next-route-announcer>/g, '')
    .replace(/<div hidden="">(?:<!--\/?\$[!?]?-->)*<\/div>/g, '') // Next.js 空的 Suspense 容器
    .replace(/<template data-dgst="[^"]*"><\/template>/g, '')
    .replace(/<!--\/?\$[!?]?-->/g, '') // React Suspense 註解標記
    .replace(/<!-- -->/g, '') // React 文字節點分隔註解
    .replace(/<link rel="stylesheet" href="[^"]+"[^>]*\/?>/, `<link rel="stylesheet" href="../assets/css/${CSS_NAME}"><link rel="stylesheet" href="../assets/css/mirror.css">`)
    .replace('<head>', `<head><!-- 本檔為 wireframe 靜態鏡像（原站 ${ORIGIN}/ 的「${view.label}」畫面，原站以 React state 切換畫面，網址都是 /）：已移除所有 script，按鈕與互動元件只呈現初始畫面。頁面索引：../index.html -->`)
    .replace(/(<body[^>]*>)/, `$1${mirrorBar(view)}`)
  if (!h.startsWith('<!DOCTYPE')) h = '<!DOCTYPE html>' + h
  // 與 tools/check-links.mjs 的規則一致：不可有 script、inline 事件、javascript: 網址或原站殘留
  if (/<script|<[a-z][^>]*\son[a-z]+\s*=|javascript:|\/_next\/|wireframe-2-video-platform/i.test(h.replace(/<!--[\s\S]*?-->/g, ''))) {
    throw new Error(`${view.file}: 清理後仍有 script／inline 事件／_next 殘留`)
  }
  return h
}

async function main() {
  const { chromium } = loadPlaywright()
  const browser = await chromium.launch({ executablePath: chromiumPath() })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: 'light', locale: 'zh-TW' })
  let cssHref = null
  // 5 個畫面用到的所有字（含 lg:hidden 等隱藏元素與 placeholder），加上 ASCII，決定要下載哪些字型子集
  let usedChars = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'
  try {
    for (const view of VIEWS) {
      // 每個畫面都重新載入，確保是該畫面的初始狀態（例如講師後台預設選第一門課、章節展開）
      await page.goto(ORIGIN + '/', { waitUntil: 'networkidle' })
      if (view.click) await page.click(view.click)
      await page.mouse.move(0, 0) // 滑鼠移開，避免剛點過的按鈕停在 hover 樣式
      await page.locator('h1', { hasText: view.h1 }).first().waitFor()
      await page.waitForLoadState('networkidle')
      // 等圖片（含 background-image）都載入完成
      await page.evaluate(async () => {
        const urls = new Set([...document.querySelectorAll('img')].map((i) => i.currentSrc || i.src))
        for (const el of document.querySelectorAll('[style*="url("]')) {
          for (const m of el.style.backgroundImage.matchAll(/url\("?([^")]+)"?\)/g)) urls.add(m[1])
        }
        await Promise.all([...urls].map((u) => new Promise((r) => { const im = new Image(); im.onload = im.onerror = r; im.src = u })))
      })
      usedChars += await page.evaluate(() => document.body.textContent +
        [...document.querySelectorAll('[placeholder]')].map((e) => e.getAttribute('placeholder')).join(''))
      const html = await page.evaluate(() => '<!DOCTYPE html>' + document.documentElement.outerHTML)
      const href = (html.match(/<link rel="stylesheet" href="([^"]+)"/) || [])[1]
      if (!href) throw new Error(`${view.file}: 找不到 CSS`)
      if (cssHref && cssHref !== href) throw new Error(`多於一個 CSS：${cssHref} / ${href}，請更新腳本`)
      cssHref = href
      await fs.writeFile(path.join(ROOT, 'pages', `${view.file}.html`), clean(html, view))
      console.log(`html → pages/${view.file}.html`)
      if (SHOTS) {
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.screenshot({ path: path.join(ROOT, 'screenshots', `${view.file}.png`), fullPage: true })
        console.log(`png  → screenshots/${view.file}.png`)
      }
    }
  } finally {
    await browser.close()
  }
  await mirrorCss(cssHref, usedChars)
}

main().catch((e) => { console.error(e); process.exit(1) })
