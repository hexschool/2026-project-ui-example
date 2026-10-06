// 檢查每個頁面的共用區塊（<head> 共用部分、頁首、頁尾、底部 script）是否與 templates/page.html 一致
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
    .replace(/class="(nav-link|site-member) active"/g, 'class="$1"')
    .replace(/\s+/g, ' ')
    .trim()

const blocks = {
  'head': [/<head>[\s\S]*?<\/head>/],
  '頁首': [/<a class="skip-link"[\s\S]*?<\/header>/],
  '頁尾＋script': [/<footer class="site-footer">[\s\S]*<\/html>/],
}
const pick = (html, [re]) => normalize((html.match(re) || [''])[0])

// 每頁的目前頁標示：[導覽連結的 href, 是否加 aria-current]；null 代表不標示
const expected = {
  'index.html': ['index.html', true],
  'articles.html': ['articles.html', true],
  'article.html': ['articles.html', false], // 文章內頁標示「文章列表」，只加 active
  'pricing.html': ['pricing.html', true],
  'account.html': ['account.html', true],   // 會員入口（桌機 .site-member＋選單裡的「我的現場筆記」）
  'guideline.html': null,
}

const template = fs.readFileSync(path.join(root, 'templates/page.html'), 'utf8')
let failed = 0
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8')
  const diffs = Object.entries(blocks).filter(([, re]) => pick(html, re) !== pick(template, re)).map(([name]) => name)
  const header = (html.match(/<header class="site-header">[\s\S]*?<\/header>/) || [''])[0]
  const problems = [...diffs.map((d) => `${d} 與範本不同`)]

  const actives = [...header.matchAll(/<a class="(?:nav-link|site-member) active"[^>]*>/g)].map((m) => m[0])
  const hrefs = [...new Set(actives.map((a) => (a.match(/href="([^"]+)"/) || [])[1]))]
  const exp = expected[page]
  if (exp === undefined) problems.push('沒有設定目前頁的對應（scripts/check-layout.mjs 的 expected）')
  else if (exp === null) {
    if (actives.length) problems.push('這頁不應標示目前頁')
  } else {
    const [href, current] = exp
    if (!actives.length) problems.push(`頁首沒有標示目前頁（應為 ${href}）`)
    if (hrefs.length > 1 || (hrefs[0] && hrefs[0] !== href)) problems.push(`頁首目前頁指向 ${hrefs.join('、')}，應為 ${href}`)
    const withCurrent = actives.filter((a) => a.includes('aria-current="page"')).length
    if (current && withCurrent !== actives.length) problems.push('目前頁連結要加 aria-current="page"')
    if (!current && withCurrent) problems.push('這頁的目前頁只加 active，不加 aria-current')
  }

  console.log(`${problems.length ? '✗' : '✓'} ${page}${problems.length ? '：' + problems.join('；') : ''}`)
  if (problems.length) failed++
}
console.log(failed ? `\n${failed} 個頁面需要同步` : `\n全部 ${pages.length} 個頁面的共用區塊都與範本一致`)
process.exit(failed ? 1 : 0)
