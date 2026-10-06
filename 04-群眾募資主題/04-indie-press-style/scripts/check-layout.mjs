// 檢查每個頁面的共用區塊（<head> 共用部分、頁首、頁尾、底部 script）是否與 templates/page.html 一致
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

// 頁首導覽的目前頁：專案細節標「探索專案」（只加 active、不加 aria-current）；Guideline 不標示
const expectedNav = {
  'index.html': 'index.html',
  'projects.html': 'projects.html',
  'project.html': 'projects.html',
  'account.html': 'account.html',
  'guideline.html': null,
}

const template = fs.readFileSync(path.join(root, 'templates/page.html'), 'utf8')
let failed = 0
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8')
  const problems = Object.entries(blocks).filter(([, re]) => pick(html, re) !== pick(template, re)).map(([name]) => `${name}與範本不同`)
  const header = (html.match(/<header class="site-header">[\s\S]*?<\/header>/) || [''])[0]
  const actives = [...header.matchAll(/<a class="nav-link active"[^>]*>/g)].map(([tag]) => tag)
  const expected = page in expectedNav ? expectedNav[page] : page
  if (expected === null) {
    if (actives.length) problems.push('頁首不應標示目前頁')
  } else if (actives.length !== 1) {
    problems.push(`頁首應有 1 個目前頁，現在有 ${actives.length} 個`)
  } else {
    const [tag] = actives
    const href = (tag.match(/href="([^"]+)"/) || [])[1]
    const current = tag.includes('aria-current="page"')
    if (href !== expected) problems.push(`頁首目前頁指向 ${href}，應為 ${expected}`)
    if (page === 'project.html' && current) problems.push('專案細節的「探索專案」不加 aria-current')
    if (page !== 'project.html' && !current) problems.push('目前頁要加 aria-current="page"')
  }
  console.log(`${problems.length ? '✗' : '✓'} ${page}${problems.length ? '：' + problems.join('；') : ''}`)
  if (problems.length) failed++
}
console.log(failed ? `\n${failed} 個頁面需要同步` : `\n全部 ${pages.length} 個頁面的共用區塊都與範本一致`)
process.exit(failed ? 1 : 0)
