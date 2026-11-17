// 檢查每個頁面的共用區塊（<head> 共用部分、頁首、頁尾＋登入 Modal＋底部 script）是否與 templates/page.html 一致
// 頁首、頁尾、登入 Modal 在每頁都完整寫一份，改範本後可以用這支確認 10 個頁面都同步了
// 用法：npm run check
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pages = fs.readdirSync(root).filter((f) => f.endsWith('.html')).sort()

// 每頁的「目前頁」：活動細節標示「活動列表」；結帳、Guideline 與 2026-11 補的 5 頁（頁首沒有對應項目）不標示
const expectedCurrent = {
  'index.html': 'index.html',
  'events.html': 'events.html',
  'event.html': 'events.html',
  'checkout.html': null,
  'guideline.html': null,
  'register.html': null,
  'tickets.html': null,
  'ticket.html': null,
  'orders.html': null,
  'follows.html': null,
}

// 去掉「目前頁面」標示與每頁不同的 title／description，再比對
const normalize = (html) =>
  html
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/, '')
    .replace(/\s+aria-current="page"/g, '')
    .replace(/class="nav-link active"/g, 'class="nav-link"')
    .replace(/\s+/g, ' ')
    .trim()

const blocks = {
  'head': /<head>[\s\S]*?<\/head>/,
  '頁首': /<a class="skip-link"[\s\S]*?<\/header>/,
  // 頁尾之後一路到 </html>：包含登入 Modal 與底部的 script（頁尾的 class 是 "site-footer on-ink"，所以用 [^"]* 比對）
  '頁尾＋登入 Modal＋script': /<footer class="site-footer[^"]*">[\s\S]*<\/html>/,
}
const pick = (html, re) => normalize((html.match(re) || [''])[0])

const template = fs.readFileSync(path.join(root, 'templates/page.html'), 'utf8')
let failed = 0
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8')
  const problems = Object.entries(blocks)
    .filter(([, re]) => pick(html, re) !== pick(template, re))
    .map(([name]) => `${name}與範本不同`)

  if (!html.includes('id="loginModal"')) problems.push('缺少登入 Modal（#loginModal）')

  const header = (html.match(/<header class="site-header">[\s\S]*?<\/header>/) || [''])[0]
  const actives = [...header.matchAll(/<a class="nav-link active"[^>]*href="([^"]+)"/g)].map((m) => m[1])
  if (actives.length > 1) problems.push(`頁首有 ${actives.length} 個目前頁標示`)

  if (page in expectedCurrent) {
    const expected = expectedCurrent[page]
    const actual = actives[0] || null
    if (expected !== actual) problems.push(`頁首目前頁是 ${actual || '（無）'}，應為 ${expected || '（無）'}`)
    // 只有頁面本身才加 aria-current="page"（活動細節標示「活動列表」但不加）
    const hasAriaCurrent = /class="nav-link active" aria-current="page"/.test(header)
    if (expected === page && !hasAriaCurrent) problems.push('目前頁缺少 aria-current="page"')
    if (expected && expected !== page && hasAriaCurrent) problems.push('不是頁面本身，不要加 aria-current="page"')
  } else {
    problems.push('不在頁面清單裡（新增頁面時，要在 expectedCurrent 補上目前頁規則）')
  }

  console.log(`${problems.length ? '✗' : '✓'} ${page}${problems.length ? '：' + problems.join('；') : ''}`)
  if (problems.length) failed++
}
console.log(failed ? `\n${failed} 個頁面需要同步` : `\n全部 ${pages.length} 個頁面的共用區塊都與範本一致`)
process.exit(failed ? 1 : 0)
