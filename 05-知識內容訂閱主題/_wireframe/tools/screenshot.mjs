// 重新截 _wireframe/index.html 各頁面區塊的 1440 寬全頁截圖 → screenshots/
// 用法：node tools/screenshot.mjs
// 需求：Node 18+、Playwright（不在本資料夾安裝）、chrome-headless-shell
//   - PLAYWRIGHT_MODULES：含 playwright 的 node_modules 路徑（預設為本機 npx 快取）
//   - HEADLESS_SHELL：chrome-headless-shell 執行檔（預設為 ms-playwright 快取）
//   macOS 請用 chrome-headless-shell，不要用 Google Chrome.app（每次啟動 Dock 圖示會跳動）
// 注意：index.html 從 jsDelivr 載入 Bootstrap 5.3.3，截圖時需要網路。
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MODULES = process.env.PLAYWRIGHT_MODULES || '/Users/casper/.npm/_npx/9833c18b2d85bc59/node_modules/'
const SHELL = process.env.HEADLESS_SHELL || path.join(os.homedir(),
  'Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell')
const { chromium } = createRequire(MODULES)('playwright')

// 檔名 → wireframe 的 hash 路由（與個人頁面的角色切換）
const SHOTS = [
  ['guideline.png', 'guideline'],
  ['home.png', 'home'],
  ['articles.png', 'articles'],
  ['article.png', 'article'],
  ['pricing.png', 'pricing'],
  ['account.png', 'account', 'all'],
  ['account-reader.png', 'account', 'reader'],
  ['account-author.png', 'account', 'author'],
  ['account-admin.png', 'account', 'admin'],
]

const browser = await chromium.launch({ executablePath: SHELL, headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
await page.goto(pathToFileURL(path.join(ROOT, 'index.html')).href, { waitUntil: 'networkidle' })
for (const [file, hash, role] of SHOTS) {
  await page.evaluate((h) => { location.hash = '#' + h }, hash)
  await page.waitForTimeout(250)
  if (role) await page.click(`#roleSeg [data-role-set="${role}"]`)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: path.join(ROOT, 'screenshots', file), fullPage: true })
  console.log(`✓ screenshots/${file}`)
}
await browser.close()
