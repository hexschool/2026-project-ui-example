# _wireframe：共用的版型參考

這個資料夾是群眾募資設計稿的**資訊架構與版型依據**：所有風格（`01-hardware-lab-style`、`02-green-style`、`03-bold-style`、`04-indie-press-style`、`05-business-style`、`06-toy-factory-style` 以及之後的各套）的頁面組成、區塊順序與欄數都以這裡為準。

- 來源：Notion「04-群眾募資主題：島造 ISLANDMAKE 在地製造提案平台」頁面裡的附件 `index.html`（<https://app.notion.com/p/3ef6ab47eb4880638063f06429c057ed>）
- 下載日期：2026-10-06，**原樣保存**為 `index.html`，沒有改過任何內容（SHA-256 `9b1d85be0254e2a28b7f7f1bcf8e556e43e2ea6e36dcfba00b535334930b1dfa`）

## 範圍與資料來源

1. **wireframe 只提供資訊架構與版型**：頁面有哪些、區塊順序、桌機欄數、元件、互動與狀態規則。
2. 這份 wireframe 是一套**有自己視覺風格的高保真稿**（奶油底、磚紅、深夜色、襯線標題、藥丸按鈕）。它的配色、字體、圓角都**不是規格**，六套風格各自重新設計，見 `WIREFRAME_SPEC.md` §0.1。
3. **文案以 Notion 為唯一來源**，整理在上一層的 [`../CONTENT.md`](../CONTENT.md)，逐字使用。wireframe 有一些 Notion 沒有的文字（例如首頁的平台數字 NT$ 14.2 億、各區塊的英文眉標、延遲原因說明），對照表在 `WIREFRAME_SPEC.md` §6；兩者不一致時**以 Notion 為準**。
4. 每套共 10 頁。Notion 規定的 5 頁（設計 Guideline、首頁、專案列表、專案細節與贊助方案選擇、個人頁面）剛好就是 wireframe 的 5 個頁面區塊；2026-11 補的 5 頁（登入、註冊、贊助結帳、贊助成功、贊助紀錄詳情）**wireframe 沒有、也沒有截圖**，版型直接看 `WIREFRAME_SPEC.md` §3.05～3.09，文案看 `../CONTENT.md` 附錄 B.7～B.12。提案者後台與管理員後台仍是第二階段，不做。
5. 圖片清單在 [`../IMAGES.md`](../IMAGES.md)；每套風格的規範與新增步驟在 [`../README.md`](../README.md)。

## 怎麼瀏覽

用瀏覽器開啟 **`index.html`**。它是單一 HTML 檔，5 個頁面放在 5 個 `<section class="page">` 裡，用網址 hash 切換（頁面內的 JS 監聽 `hashchange`）：

| 頁面 | 網址 | 頁面區塊 | 截圖 |
|---|---|---|---|
| 設計 Guideline | `index.html#guideline` | `section#page-guideline` | `screenshots/guideline.png` |
| 首頁 | `index.html#home`（預設） | `section#page-home` | `screenshots/home.png` |
| 專案列表 | `index.html#projects` | `section#page-projects` | `screenshots/projects.png` |
| 專案細節與贊助方案選擇 | `index.html#project` | `section#page-project` | `screenshots/project.png` |
| 個人頁面 | `index.html#account` | `section#page-account` | `screenshots/account.png` |

- 頁首導覽就是這 5 個 hash 連結（這是 wireframe 的頁面切換器，**不是**產品導覽）。
- 最上方深色細列的「顯示設計標註」勾選框會打開每個區塊的「設計註」，裡面寫了互動、RWD 與狀態規則。這些內容已整理進 `WIREFRAME_SPEC.md`，但對照原稿時很有用。
- 樣式用的是 jsDelivr CDN 的 Bootstrap 5.3.3（`<link>` 與 `<script>` 都保留原樣），**離線時畫面會失去 Bootstrap 樣式**；看不到網路時請看 `screenshots/`。

## 截圖

`screenshots/` 是 1440px 寬、淺色模式的全頁截圖，每頁兩張：

| 檔名 | 內容 |
|---|---|
| `<頁面>.png` | 預設畫面（設計註隱藏） |
| `<頁面>-notes.png` | 打開「顯示設計標註」，可以看到每個設計註在哪個區塊 |

頁面名稱：`guideline`、`home`、`projects`、`project`、`account`，共 10 張（2026-11 補的 5 頁沒有截圖）。截圖包含 wireframe 的設計稿工具列、頁首與頁尾（實作時這些要依規格改掉，見 `WIREFRAME_SPEC.md` §0.2）。

重新截圖（Playwright 的 headless shell，不要用 Google Chrome.app，以免 Dock 圖示跳動）：

```js
// 重點：每張截圖前先 goto('about:blank') 再開 index.html#<頁面>，
// 否則同一份文件只換 hash，上一張打開的設計註會殘留到下一張
import { createRequire } from 'node:module'
const require = createRequire('/Users/casper/.npm/_npx/9833c18b2d85bc59/node_modules/')
const { chromium } = require('playwright')
const browser = await chromium.launch({
  executablePath: `${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell`,
})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('about:blank')
await page.goto(`file://${process.cwd()}/index.html#project`, { waitUntil: 'networkidle' })
// 要看設計註：勾選 #toggleNote 並觸發 change 事件
await page.screenshot({ path: 'screenshots/project.png', fullPage: true })
await browser.close()
```

## 檔案結構

```
_wireframe/
├─ index.html          ← Notion 附件原檔（5 個頁面區塊，hash 切換）
├─ WIREFRAME_SPEC.md   ← 逐頁版型規格（10 頁，實作新風格的依據；§3.05～3.09 是 wireframe 沒有的補頁）
├─ README.md           ← 本檔
└─ screenshots/        ← 1440px 全頁截圖，每頁「預設」與「顯示設計標註」各一張
```

## 讀 wireframe 時要注意

- 圖片都是深色漸層加斜線紋理的佔位方塊（`.art`），換成 `../IMAGES.md` 的圖片，比例照規格。
- 按鈕、輸入框多半是 `<span>` 做出來的外觀，實作要用真正的 `<a>`、`<button>`、`<input>`。
- `⌕`、`☰`、`♡`、`→`、`↗` 等字元是 icon 的位置，換成 Bootstrap Icons；文案不含箭頭。
- 「狀態示意 — 篩選無結果」「狀態示意 — 里程碑逾期」這類小標，是非預設狀態的示範，實作時放到該頁的「設計稿狀態示意」區。
- 頁尾的「設計稿」欄（列出 5 頁）不要做；頁首的頁面切換器也不要做，改成產品導覽（`WIREFRAME_SPEC.md` §2.2、§2.3）。
