// 檢查每個頁面的共用區塊（<head> 共用部分、頁首、頁尾、底部 script）是否與 templates/page.html 一致
// 頁首頁尾在每頁都完整寫一份，改範本後可以用這支確認 10 個頁面都同步了
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
    .replace(/\s+/g, ' ')
    .trim()

const blocks = {
  'head': [/<head>[\s\S]*?<\/head>/],
  '頁首': [/<a class="skip-link"[\s\S]*?<\/header>/],
  '頁尾＋script': [/<footer class="site-footer">[\s\S]*<\/html>/],
}
const pick = (html, [re]) => normalize((html.match(re) || [''])[0])

const template = fs.readFileSync(path.join(root, 'templates/page.html'), 'utf8')
let failed = 0
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8')
  const diffs = Object.entries(blocks).filter(([, re]) => pick(html, re) !== pick(template, re)).map(([name]) => name)
  const header = (html.match(/<header class="site-header">[\s\S]*?<\/header>/) || [''])[0]
  const nav = (header.match(/class="nav-link active"/g) || []).length
  const problems = [...diffs.map((d) => `${d} 與範本不同`)]
  if (nav > 1) problems.push(`頁首有 ${nav} 個 active 導覽連結`)
  // 目前頁標示要指向自己（商品詳情頁的頁首標示「商品一覽」）
  const navHref = (header.match(/class="nav-link active"[^>]*href="([^"]+)"|href="([^"]+)"[^>]*class="nav-link active"/) || []).slice(1).find(Boolean)
  const expectedNav = page === 'product.html' ? 'products.html' : page
  if (navHref && navHref !== expectedNav) problems.push(`頁首目前頁指向 ${navHref}，應為 ${expectedNav}`)
  console.log(`${problems.length ? '✗' : '✓'} ${page}${problems.length ? '：' + problems.join('；') : ''}`)
  if (problems.length) failed++
}
console.log(failed ? `\n${failed} 個頁面需要同步` : `\n全部 ${pages.length} 個頁面的共用區塊都與範本一致`)
process.exit(failed ? 1 : 0)
