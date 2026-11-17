// 檢查每個頁面的共用區塊（<head> 共用部分、頁首、頁尾＋登入對話框＋底部 script）是否與 templates/page.html 一致
// 頁首頁尾在每頁都完整寫一份，改範本後可以用這支確認 10 個頁面都同步了
// 用法：npm run check
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pages = fs.readdirSync(root).filter((f) => f.endsWith('.html')).sort()

// 每頁頁首「目前頁」應該指向的連結（guideline.html、register.html、checkout.html、order-result.html 不標示）
// my-courses.html 標示「我的課程」（選單裡與桌機右側各一個）；
// course.html 標示「探索課程」、learn.html 與 orders.html 標示「我的課程」，這三頁都不加 aria-current
const expectedNav = {
  'index.html': 'index.html',
  'courses.html': 'courses.html',
  'course.html': 'courses.html',
  'my-courses.html': 'my-courses.html',
  'learn.html': 'my-courses.html',
  'orders.html': 'my-courses.html',
}
// 標示目前頁但不加 aria-current 的子頁
const noCurrent = ['course.html', 'learn.html', 'orders.html']

// 去掉「目前頁面」標示與每頁不同的 title／description，再比對
const normalize = (html) =>
  html
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/, '')
    .replace(/\s+aria-current="page"/g, '')
    .replace(/(class="nav-link[^"]*?) active(?=[\s"])/g, '$1')
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
  const activeHrefs = [...header.matchAll(/<a class="nav-link[^"]* active[^"]*" href="([^"]+)"/g)].map((m) => m[1])
  const unique = [...new Set(activeHrefs)]
  const expected = expectedNav[page]
  if (unique.length > 1) problems.push(`頁首有 ${unique.length} 種目前頁連結（${unique.join('、')}）`)
  if (expected && unique[0] !== expected) problems.push(`頁首目前頁應為 ${expected}${unique[0] ? `，目前是 ${unique[0]}` : '，目前沒有標示'}`)
  if (!expected && unique.length) problems.push(`這頁不需要標示目前頁，但標了 ${unique[0]}`)
  // aria-current 只給「目前頁本身」：course.html 標探索課程、learn.html 與 orders.html 標我的課程，但都不加
  // normalize() 比對範本前會拿掉 aria-current，不標示目前頁的頁面要在這裡另外擋
  const current = (header.match(/aria-current="page"/g) || []).length
  if (!expected && current) problems.push('這頁不標示目前頁，但頁首有 aria-current')
  if (noCurrent.includes(page) && current) problems.push(`${page} 的頁首不加 aria-current`)
  if (expected && !noCurrent.includes(page) && current !== activeHrefs.length) problems.push('目前頁的連結都要加 aria-current="page"')
  console.log(`${problems.length ? '✗' : '✓'} ${page}${problems.length ? '：' + problems.join('；') : ''}`)
  if (problems.length) failed++
}
console.log(failed ? `\n${failed} 個頁面需要同步` : `\n全部 ${pages.length} 個頁面的共用區塊都與範本一致`)
process.exit(failed ? 1 : 0)
