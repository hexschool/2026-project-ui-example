// 檢查每個頁面的共用區塊（<head>、頁首、頁尾＋登入 Modal＋底部 script）是否與 templates/page.html 一致
// 頁首、頁尾、登入 Modal 在每頁都完整寫一份，改範本後可以用這支確認 5 個頁面都同步了
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

// 頁尾之後還有登入 Modal 與 script，所以「頁尾」這段一路比對到 </html>
const blocks = {
  'head': [/<head>[\s\S]*?<\/head>/],
  '頁首': [/<a class="skip-link"[\s\S]*?<\/header>/],
  '頁尾＋登入 Modal＋script': [/<footer class="site-footer">[\s\S]*<\/html>/],
}
const pick = (html, [re]) => normalize((html.match(re) || [''])[0])

// 目前頁規則：活動細節標示「活動列表」；結帳與 Guideline 沒有目前頁
const expectedNavOf = {
  'index.html': 'index.html',
  'events.html': 'events.html',
  'event.html': 'events.html',
  'checkout.html': null,
  'guideline.html': null,
}

const template = fs.readFileSync(path.join(root, 'templates/page.html'), 'utf8')
let failed = 0
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8')
  const problems = Object.entries(blocks).filter(([, re]) => pick(html, re) !== pick(template, re)).map(([name]) => `${name} 與範本不同`)
  const header = (html.match(/<header class="site-header">[\s\S]*?<\/header>/) || [''])[0]
  const actives = [...header.matchAll(/class="nav-link active"[^>]*href="([^"]+)"|href="([^"]+)"[^>]*class="nav-link active"/g)].map((m) => m[1] || m[2])
  const expected = page in expectedNavOf ? expectedNavOf[page] : page
  if (actives.length > 1) problems.push(`頁首有 ${actives.length} 個目前頁`)
  if (expected === null && actives.length) problems.push(`頁首不應標示目前頁（目前指向 ${actives[0]}）`)
  if (expected && actives[0] !== expected) problems.push(`頁首目前頁指向 ${actives[0] || '（無）'}，應為 ${expected}`)
  if (!html.includes('id="loginModal"')) problems.push('缺少登入 Modal')
  console.log(`${problems.length ? '✗' : '✓'} ${page}${problems.length ? '：' + problems.join('；') : ''}`)
  if (problems.length) failed++
}
console.log(failed ? `\n${failed} 個頁面需要同步` : `\n全部 ${pages.length} 個頁面的共用區塊都與範本一致`)
process.exit(failed ? 1 : 0)
