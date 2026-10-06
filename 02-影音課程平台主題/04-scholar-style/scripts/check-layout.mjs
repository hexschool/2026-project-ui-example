// 檢查每個頁面的共用區塊（<head> 共用部分、頁首、頁尾＋登入對話框＋底部 script）是否與 templates/page.html 一致
// 頁首頁尾在每頁都完整寫一份，改範本後可以用這支確認 5 個頁面都同步了
// 用法：npm run check
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pages = ['guideline.html', 'index.html', 'courses.html', 'course.html', 'learn.html']

// 每頁的「目前頁」標示應該指向哪個連結（null＝不標示）；aria-current 只加在目前頁本身
const expected = {
  'guideline.html': null,
  'index.html': { href: 'index.html', current: true },
  'courses.html': { href: 'courses.html', current: true },
  'course.html': { href: 'courses.html', current: false }, // 課程詳情：頁首標示「探索課程」，不加 aria-current
  'learn.html': { href: 'learn.html', current: true },     // 學習頁：頁首標示「我的課程」
}

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
  const file = path.join(root, page)
  if (!fs.existsSync(file)) {
    console.log(`✗ ${page}：檔案不存在`)
    failed++
    continue
  }
  const html = fs.readFileSync(file, 'utf8')
  const problems = Object.entries(blocks)
    .filter(([, re]) => pick(html, re) !== pick(template, re))
    .map(([name]) => `${name} 與範本不同`)

  // 目前頁標示
  const header = (html.match(/<header class="site-header">[\s\S]*?<\/header>/) || [''])[0]
  const actives = [...header.matchAll(/<a class="nav-link[^"]* active[^"]*"([^>]*)>/g)]
  const want = expected[page]
  if (!want && actives.length) problems.push('頁首不應標示目前頁')
  if (want) {
    if (actives.length !== 1) problems.push(`頁首有 ${actives.length} 個 active 連結，應為 1 個`)
    else {
      const attrs = actives[0][1]
      const href = (attrs.match(/href="([^"]+)"/) || [])[1]
      if (href !== want.href) problems.push(`頁首目前頁指向 ${href}，應為 ${want.href}`)
      if (want.current !== attrs.includes('aria-current="page"')) problems.push(want.current ? '目前頁缺少 aria-current="page"' : '不應加 aria-current="page"')
    }
  }
  console.log(`${problems.length ? '✗' : '✓'} ${page}${problems.length ? '：' + problems.join('；') : ''}`)
  if (problems.length) failed++
}
console.log(failed ? `\n${failed} 個頁面需要同步` : `\n全部 ${pages.length} 個頁面的共用區塊都與範本一致`)
process.exit(failed ? 1 : 0)
