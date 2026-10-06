// 檢查每個頁面的共用區塊（<head> 共用部分、日期列＋頁首、頁尾、底部 script）是否與 templates/page.html 一致
// 頁首頁尾在每頁都完整寫一份，改範本後可以用這支確認 6 個頁面都同步了
// 用法：npm run check
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pages = fs.readdirSync(root).filter((f) => f.endsWith('.html')).sort()

// 去掉「目前頁面」標示與每頁不同的 title／description，再比對
const normalize = (html) =>
  html
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/, '')
    .replace(/\s+aria-current="page"/g, '')
    .replace(/class="nav-link active"/g, 'class="nav-link"')
    .replace(/class="nav-link site-member active"/g, 'class="nav-link site-member"')
    .replace(/\s+/g, ' ')
    .trim()

const blocks = {
  'head': [/<head>[\s\S]*?<\/head>/],
  '日期列＋頁首': [/<a class="skip-link"[\s\S]*?<\/header>/],
  '頁尾＋script': [/<footer class="site-footer">[\s\S]*<\/html>/],
}
const pick = (html, [re]) => normalize((html.match(re) || [''])[0])

// 每頁的目前頁標示：文章內頁標「文章列表」（只加 active，不加 aria-current）；Guideline 不標示
const expected = {
  'index.html': { href: 'index.html', current: true },
  'articles.html': { href: 'articles.html', current: true },
  'article.html': { href: 'articles.html', current: false },
  'pricing.html': { href: 'pricing.html', current: true },
  'account.html': { href: 'account.html', current: true },
  'guideline.html': null,
}

const template = fs.readFileSync(path.join(root, 'templates/page.html'), 'utf8')
let failed = 0
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8')
  const problems = Object.entries(blocks).filter(([, re]) => pick(html, re) !== pick(template, re)).map(([name]) => `${name} 與範本不同`)
  const header = (html.match(/<header class="site-header">[\s\S]*?<\/header>/) || [''])[0]
  const actives = [...header.matchAll(/<a class="nav-link(?: site-member)? active"([^>]*)>/g)].map((m) => ({
    href: (m[1].match(/href="([^"]+)"/) || [])[1],
    current: /aria-current="page"/.test(m[1]),
  }))
  const want = expected[page]
  if (want === null && actives.length) problems.push('Guideline 不應標示目前頁')
  if (want) {
    if (!actives.length) problems.push(`頁首沒有標示目前頁（應為 ${want.href}）`)
    actives.forEach((a) => {
      if (a.href !== want.href) problems.push(`頁首目前頁指向 ${a.href}，應為 ${want.href}`)
      if (a.current !== want.current) problems.push(want.current ? '目前頁缺少 aria-current="page"' : '文章內頁不加 aria-current')
    })
  }
  console.log(`${problems.length ? '✗' : '✓'} ${page}${problems.length ? '：' + problems.join('；') : ''}`)
  if (problems.length) failed++
}
console.log(failed ? `\n${failed} 個頁面需要同步` : `\n全部 ${pages.length} 個頁面的共用區塊都與範本一致`)
process.exit(failed ? 1 : 0)
