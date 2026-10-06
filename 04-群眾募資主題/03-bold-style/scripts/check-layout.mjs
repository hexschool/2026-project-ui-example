// 檢查每個頁面的共用區塊（<head> 共用部分、頁首、頁尾與底部 script）是否與 templates/page.html 一致
// 頁首頁尾在每頁都完整寫一份，改範本後可以用這支確認 5 個頁面都同步了
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

// 頁首「目前頁」應該指向哪裡：專案細節標示「探索專案」（只加 active、不加 aria-current），Guideline 不標示
const expectedNav = { 'project.html': 'projects.html', 'guideline.html': null }
const noAriaCurrent = ['project.html']

const template = fs.readFileSync(path.join(root, 'templates/page.html'), 'utf8')
let failed = 0
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8')
  const diffs = Object.entries(blocks).filter(([, re]) => pick(html, re) !== pick(template, re)).map(([name]) => name)
  const header = (html.match(/<header class="site-header">[\s\S]*?<\/header>/) || [''])[0]
  const active = [...header.matchAll(/<a class="nav-link active" href="([^"]+)"( aria-current="page")?>/g)]
  const problems = [...diffs.map((d) => `${d} 與範本不同`)]
  const expected = page in expectedNav ? expectedNav[page] : page
  if (active.length > 1) problems.push(`頁首有 ${active.length} 個 active 導覽連結`)
  if (expected === null && active.length) problems.push(`頁首不應標示目前頁（目前標示 ${active[0][1]}）`)
  if (expected && !active.length) problems.push(`頁首沒有標示目前頁（應為 ${expected}）`)
  if (expected && active.length && active[0][1] !== expected) problems.push(`頁首目前頁指向 ${active[0][1]}，應為 ${expected}`)
  if (active.length) {
    const hasAria = Boolean(active[0][2])
    if (noAriaCurrent.includes(page) && hasAria) problems.push('頁首目前頁不應加 aria-current（只加 active）')
    if (!noAriaCurrent.includes(page) && !hasAria) problems.push('頁首目前頁缺少 aria-current="page"')
  }
  console.log(`${problems.length ? '✗' : '✓'} ${page}${problems.length ? '：' + problems.join('；') : ''}`)
  if (problems.length) failed++
}
console.log(failed ? `\n${failed} 個頁面需要同步` : `\n全部 ${pages.length} 個頁面的共用區塊都與範本一致`)
process.exit(failed ? 1 : 0)
