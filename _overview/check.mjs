// 檢查總目錄資料、設計稿檔案、外框腳本與 index.html 是否一致（只讀檔案，不開瀏覽器）
// 用法：在根目錄執行 node _overview/check.mjs
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')
const exists = (file) => fs.existsSync(path.join(root, file))
const foldersIn = (dir) =>
  fs.readdirSync(path.join(root, dir), { withFileTypes: true })
    .filter((item) => item.isDirectory() && /^\d\d-/.test(item.name))
    .map((item) => item.name)
    .sort()
const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort())

const sandbox = { window: {} }
vm.runInNewContext(read('_overview/catalog.js'), sandbox)
const { repo, themes } = sandbox.window.UI_CATALOG

const problems = []
const expect = (ok, message) => { if (!ok) problems.push(message) }

// ---------- 1. 目錄資料 ⇄ 資料夾、檔案、縮圖 ----------
for (const file of ['preview.html', '_overview/frame-guard.js']) expect(exists(file), `找不到 ${file}`)
expect(same(themes.map((theme) => theme.dir), foldersIn('.')), '主題資料夾與 catalog.js 不一致')
for (const theme of themes) {
  expect(same(theme.styles.map((style) => style.dir), foldersIn(theme.dir)), `${theme.dir}：風格資料夾與 catalog.js 不一致`)
  const pages = new Set(theme.pages.map((page) => page.file.split('?')[0]))
  for (const style of theme.styles.filter((item) => exists(`${theme.dir}/${item.dir}`))) {
    const dir = `${theme.dir}/${style.dir}`
    const files = fs.readdirSync(path.join(root, dir)).filter((file) => file.endsWith('.html'))
    expect(same(pages, files), `${dir}：頁面檔案與 catalog.js 的 pages 不一致`)
    expect(exists(`_overview/thumbs/${theme.no}-${style.dir}.jpg`), `${dir}：缺少縮圖 _overview/thumbs/${theme.no}-${style.dir}.jpg`)

    // ---------- 2. 每一頁與範本都載入外框腳本，而且在樣式之前 ----------
    for (const file of [...files, 'templates/page.html']) {
      if (!exists(`${dir}/${file}`)) {
        problems.push(`${dir}/${file}：找不到檔案`)
        continue
      }
      const head = read(`${dir}/${file}`).split('</head>')[0].replace(/<!--[\s\S]*?-->/g, '')
      const guards = head.split('<script src="../../_overview/frame-guard.js"></script>').length - 1
      expect(guards === 1, `${dir}/${file}：<head> 應該載入一次 frame-guard.js，現在是 ${guards} 次`)
      expect(head.indexOf('frame-guard.js') < head.indexOf('rel="stylesheet"'), `${dir}/${file}：frame-guard.js 要放在樣式之前`)
    }
  }
}

// ---------- 3. index.html 的卡片 ----------
const index = read('index.html').replace(/<!--[\s\S]*?-->/g, '')
const links = [...index.matchAll(/href="([^"]+)"/g)].map((match) => match[1])
const linkOf = (theme, style, file) => `preview.html#${theme.slug}/${style.dir}/${file.replace('.html', '')}`
const known = new Set(themes.flatMap((theme) => theme.styles.flatMap((style) => theme.pages.map((page) => linkOf(theme, style, page.file)))))

for (const link of links) {
  if (/^\d\d-/.test(link) && !link.includes('/_wireframe/')) problems.push(`index.html：${link} 沒有走預覽頁`)
  if (link.startsWith('preview.html') && !known.has(link)) problems.push(`index.html：${link} 在 catalog.js 找不到`)
}
for (const link of known) expect(links.includes(link), `index.html：缺少 ${link}`)
for (const theme of themes) {
  expect(index.includes(`id="${theme.slug}"`), `index.html：缺少 id="${theme.slug}" 的主題區塊`)
  for (const style of theme.styles) {
    const id = `${theme.slug}-${style.no}-title`
    const title = (index.match(new RegExp(`id="${id}"[^>]*>([^<]*)<`)) || [])[1]
    expect(title === style.name, `index.html：#${id} 是「${title}」，catalog.js 是「${style.name}」`)
    // 複製卡片改資料時，容易漏改按鈕：卡片裡的連結只能是這套風格自己的
    const card = (index.match(new RegExp(`aria-labelledby="${id}"[^>]*>[^]*?</article>`)) || [''])[0]
    expect(card, `index.html：找不到 aria-labelledby="${id}" 的卡片`)
    const own = [`preview.html#${theme.slug}/${style.dir}/`, `${repo}${encodeURIComponent(theme.dir)}/${style.dir}"`]
    for (const [, link] of card.matchAll(/href=("[^"]+")/g)) {
      expect(own.some((start) => link.slice(1).startsWith(start)), `index.html：${theme.name} ${style.no} 的卡片連到別處 ${link}`)
    }
  }
}

// ---------- 結果 ----------
const styles = themes.reduce((sum, theme) => sum + theme.styles.length, 0)
if (problems.length) {
  console.log(problems.map((problem) => `✗ ${problem}`).join('\n'))
  console.log(`\n${problems.length} 個問題`)
} else {
  console.log(`✓ ${themes.length} 個主題、${styles} 套風格：目錄資料、檔案、縮圖、外框腳本與 index.html 都一致`)
}
process.exit(problems.length ? 1 : 0)
