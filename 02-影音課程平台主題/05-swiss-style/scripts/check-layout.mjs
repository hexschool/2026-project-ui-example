// 檢查每個頁面的共用區塊（<head> 共用部分、頁首、頁尾＋登入對話框＋script）是否與 templates/page.html 一致
// 頁首頁尾在每頁都完整寫一份，改範本後可以用這支確認 10 個頁面都同步了
// 用法：npm run check
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pages = fs.readdirSync(root).filter((f) => f.endsWith('.html')).sort()

// 每頁的「目前頁面」標示：頁首導覽要標在哪一個連結（null＝不標示）
const expectedNav = {
  'index.html': 'index.html',
  'courses.html': 'courses.html',
  'course.html': 'courses.html',
  'learn.html': 'my-courses.html',
  'guideline.html': null,
  // 2026-11 補頁
  'register.html': null,
  'checkout.html': null,
  'order-result.html': null,
  'my-courses.html': 'my-courses.html',
  'orders.html': 'my-courses.html',
}
// 子頁：只加 active、不加 aria-current（課程詳情標「探索課程」；學習頁、購買紀錄標「我的課程」）
const activeOnly = new Set(['course.html', 'learn.html', 'orders.html'])

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
  '頁尾＋登入對話框＋script': /<footer class="site-footer">[\s\S]*<\/html>/,
}
const pick = (html, re) => normalize((html.match(re) || [''])[0])

const template = fs.readFileSync(path.join(root, 'templates/page.html'), 'utf8')
let failed = 0
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8')
  const problems = Object.entries(blocks).filter(([, re]) => pick(html, re) !== pick(template, re)).map(([name]) => `${name}與範本不同`)
  const header = (html.match(/<header class="site-header">[\s\S]*?<\/header>/) || [''])[0]
  const actives = [...header.matchAll(/<a class="nav-link active"([^>]*)>/g)]
  const want = expectedNav[page]
  if (!(page in expectedNav)) problems.push('不在 expectedNav 裡，請補上這頁的目前頁標示')
  if (actives.length > 1) problems.push(`頁首有 ${actives.length} 個 active 導覽連結`)
  const href = actives[0]?.[1].match(/href="([^"]+)"/)?.[1] ?? null
  if (page in expectedNav && href !== want) problems.push(`頁首目前頁應為 ${want ?? '（不標示）'}，實際是 ${href ?? '（不標示）'}`)
  if (actives[0]) {
    const hasCurrent = /aria-current="page"/.test(actives[0][1])
    if (activeOnly.has(page) && hasCurrent) problems.push('這頁是子頁：頁首目前頁只加 active，不加 aria-current')
    if (!activeOnly.has(page) && !hasCurrent) problems.push('目前頁的導覽連結要加 aria-current="page"')
  }
  console.log(`${problems.length ? '✗' : '✓'} ${page}${problems.length ? '：' + problems.join('；') : ''}`)
  if (problems.length) failed++
}
console.log(failed ? `\n${failed} 個頁面需要同步` : `\n全部 ${pages.length} 個頁面的共用區塊都與範本一致`)
process.exit(failed ? 1 : 0)
