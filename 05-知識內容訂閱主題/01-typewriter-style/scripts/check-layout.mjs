// 檢查每個頁面的共用區塊（<head> 共用部分、頁首、頁尾、底部 script）是否與 templates/page.html 一致
// 頁首頁尾在每頁都完整寫一份，改範本後可以用這支確認所有頁面（10 頁）都同步了
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
    .replace(/class="site-member is-active"/g, 'class="site-member"')
    .replace(/\s+/g, ' ')
    .trim()

const blocks = {
  'head': [/<head>[\s\S]*?<\/head>/],
  '頁首': [/<a class="skip-link"[\s\S]*?<\/header>/],
  '頁尾＋script': [/<footer class="site-footer">[\s\S]*<\/html>/],
}
const pick = (html, [re]) => normalize((html.match(re) || [''])[0])

// 每頁的目前頁：文章內頁與作者個人頁標「文章列表」（只加 active）、個人頁面標會員入口；
// Guideline 與登入、註冊、忘記密碼（2026-11 補頁）不標示
const expected = {
  'index.html': 'index.html',
  'articles.html': 'articles.html',
  'article.html': 'articles.html',
  'pricing.html': 'pricing.html',
  'account.html': 'account.html',
  'guideline.html': null,
  'login.html': null,
  'register.html': null,
  'author.html': 'articles.html',
  'forgot-password.html': null,
}
// 目前頁只加 active、不加 aria-current 的頁面（文章列表的子頁）
const activeOnly = ['article.html', 'author.html']

const template = fs.readFileSync(path.join(root, 'templates/page.html'), 'utf8')
let failed = 0
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8')
  const diffs = Object.entries(blocks).filter(([, re]) => pick(html, re) !== pick(template, re)).map(([name]) => name)
  const header = (html.match(/<header class="site-header">[\s\S]*?<\/header>/) || [''])[0]
  const actives = [...header.matchAll(/class="nav-link active"[^>]*href="([^"]+)"|href="([^"]+)"[^>]*class="nav-link active"/g)].map((m) => m[1] || m[2])
  const problems = [...diffs.map((d) => `${d} 與範本不同`)]
  if (actives.length > 1) problems.push(`頁首有 ${actives.length} 個 active 導覽連結`)
  const want = page in expected ? expected[page] : page
  const got = actives[0] || null
  if (got !== want) problems.push(`頁首目前頁是 ${got ?? '（無）'}，應為 ${want ?? '（無）'}`)
  // 文章內頁、作者個人頁只加 active，不加 aria-current；其他目前頁要有 aria-current
  const current = (header.match(/aria-current="page"/g) || []).length
  if (activeOnly.includes(page) && current) problems.push('文章內頁與作者個人頁的頁首不加 aria-current')
  if (!activeOnly.includes(page) && want && !current) problems.push('目前頁缺少 aria-current="page"')
  if (page === 'account.html' && !/class="site-member is-active"[^>]*aria-current="page"|aria-current="page"[^>]*class="site-member is-active"/.test(header)) problems.push('桌機會員入口缺少 is-active 與 aria-current')
  console.log(`${problems.length ? '✗' : '✓'} ${page}${problems.length ? '：' + problems.join('；') : ''}`)
  if (problems.length) failed++
}
console.log(failed ? `\n${failed} 個頁面需要同步` : `\n全部 ${pages.length} 個頁面的共用區塊都與範本一致`)
process.exit(failed ? 1 : 0)
