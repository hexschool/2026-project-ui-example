# _wireframe：共用的線框圖參考

這個資料夾是影音課程平台設計稿的**資訊架構與版型依據**：所有風格（`01-dark-theater-style`、`04-scholar-style`、`05-swiss-style` 以及之後的各套）的頁面組成、區塊順序與欄數都以這裡為準。它本身不需要安裝任何東西，瀏覽器直接開就能看。

- 來源：<https://wireframe-2-video-platform.vercel.app/>（v0 產生的 Next.js 單頁應用，原站標題「Craftory｜把想學很久的事，變成手上的作品」）
- 鏡像日期：2026-10-06，共 5 個鏡像頁：4 個對應本次頁面（首頁、課程列表、課程詳情、學習頁）＋講師後台（參考，不做）

## 原站的結構

原站**只有一個網址 `/`**（`/courses`、`/learn` 等路徑都是 404）。頁首的按鈕用 React state 切換 5 個畫面，網址不會變：

| 原站畫面（state） | 怎麼進去 | 本地鏡像 | 對應本次頁面 |
|---|---|---|---|
| `home` 首頁 | 預設畫面；點品牌 logo | `pages/home.html` | `index.html` 首頁 |
| `courses` 探索課程 | 頁首導覽「探索課程」 | `pages/courses.html` | `courses.html` 課程列表 |
| `detail` 課程詳情 | 頁首導覽「課程詳情」、任一課程卡 | `pages/detail.html` | `course.html` 課程詳情 |
| `learn` 學習頁 | 頁首「我的課程」、課程詳情「立即購買，開始上課」 | `pages/learn.html` | `learn.html` 課程播放／學習頁 |
| `teacher` 講師後台 | 頁首「講師後台」 | `pages/teacher.html` | （不做，Guideline 講師狀態的參考） |

設計 Guideline（`guideline.html`）wireframe 沒有，規格見 `WIREFRAME_SPEC.md` §3.00。

## 範圍與資料來源

1. **wireframe 只提供資訊架構與版型**：頁面有哪些、區塊順序、桌機欄數、元件與互動狀態。視覺風格由各風格自己決定。
2. **文案以 Notion 為唯一來源**，已逐字整理在上一層的 [`../CONTENT.md`](../CONTENT.md)。wireframe 漏掉不少 Notion 區塊（首頁的學員作品牆＋學習保障與底部 CTA、課程詳情的講師介紹／學員評價／常見問題、學習頁的續看提示／課程問答／附件下載），也有自己多寫的文字（例如「不是把影片看完，是把作品做出來。」「找到下一件作品」），對照表在 `WIREFRAME_SPEC.md` §5。
3. 畫面上的英文全大寫眉標、文字箭頭（→、←）、「·」串起的資訊列、◉ ⌁ ◷ ✦ 這類符號、全站相同的「4.9」「1,845 人正在學」，都是線框圖的標記或佔位，**不要照搬**（`WIREFRAME_SPEC.md` §0.1）。
4. 圖片是 Unsplash 的佔位照片（陶瓶、皮靴、電鋸、金耳環…），和課程內容對不上；各風格依 [`../IMAGES.md`](../IMAGES.md) 生成自己的圖。

## 怎麼瀏覽

直接用瀏覽器開啟 **`index.html`**（雙擊或拖進瀏覽器），不需要伺服器。

- `index.html`：頁面索引，分成「學生流程（本次必做）」與「講師流程（參考）」兩組，每頁都有縮圖、對應的本次檔名、一句話說明、頁面連結與全頁截圖連結。
- 每個鏡像頁最上方有一條細列：「← 回到頁面索引」、**5 個畫面的切換連結**（原站靠 JS 切換，鏡像沒有 JS，所以改由這條細列切換），右邊顯示原站畫面名稱。
- 頁面裡的原站按鈕（頁首導覽、課程卡、「探索全部課程」等）**都不會動**，請用最上方細列換頁。
- 課程照片仍連到 Unsplash 的網址，離線時圖片會是空白，版面不受影響。
- 實作新風格時，搭配 **`WIREFRAME_SPEC.md`** 閱讀：逐頁列出區塊順序、桌機欄數、元件、互動與狀態、RWD 規則，以及 wireframe 與 Notion 的差異與驗收清單。

## 檔案結構

```
_wireframe/
├─ index.html                ← 頁面索引（從這裡開始）
├─ WIREFRAME_SPEC.md         ← 逐頁版型規格（實作新風格的依據）
├─ README.md                 ← 本檔
├─ pages/                    ← 5 個鏡像頁（純 HTML，檔名＝原站畫面的 state 名稱）
│  ├─ home.html                首頁
│  ├─ courses.html             探索課程
│  ├─ detail.html              課程詳情
│  ├─ learn.html               學習頁
│  └─ teacher.html             講師後台（參考）
├─ assets/
│  ├─ css/wireframe.css      ← 原站編譯後的 CSS（Tailwind v4），只移除了深色模式、把 Google Fonts 的 @import 改成本地
│  ├─ css/fonts.css          ← Noto Sans TC 的 @font-face（由 mirror.mjs 產生）
│  ├─ css/mirror.css         ← 鏡像專用的附加樣式（強制淺色、最上方的切換細列）
│  └─ fonts/*.woff2          ← Noto Sans TC 400／500／600／700，只有頁面用到的 unicode-range 子集（108 個檔案，約 6 MB）
├─ screenshots/              ← 原站全頁截圖，1440px 寬、淺色模式，檔名與 pages/ 相同
└─ tools/
   ├─ mirror.mjs             ← 用 Playwright 從原站重新鏡像 pages/、CSS、字型（加 --screenshots 連截圖一起重拍）
   └─ check-links.mjs        ← 檢查本地參照都存在、外部網址只有 Unsplash 圖片、沒有 script 或 inline 事件
```

## 與原站的差異

| 項目 | 原站 | 本地鏡像 |
|---|---|---|
| 畫面切換 | 單一網址，React state 切換 5 個畫面 | 每個畫面一個 HTML 檔；由 `tools/mirror.mjs` 開啟原站、點頁首按鈕切到該畫面後，存下當下的 DOM |
| JavaScript | Next.js／React（含 RSC payload） | **全部移除**。所有 `<script>`、`<link rel="preload">`、`next-route-announcer`、React Suspense 註解都拿掉了；`check-links.mjs` 會檢查沒有 `<script>`、inline 事件與 `javascript:` 網址 |
| 互動 | 頁首導覽、課程卡、講師後台的篩選與章節收合等由 React 控制 | **不會動**，只呈現每個畫面的初始狀態（講師後台預設選第一門課、章節展開）。例外：課程詳情購買卡裡的 `<details>` 章節清單、課程列表的 checkbox 是原生 HTML，仍可點 |
| 畫面之間的連結 | 按鈕 | 原站按鈕保留原樣（不會動），改用每頁最上方細列的連結切換 |
| 深色模式 | CSS 有 `@media (prefers-color-scheme: dark)` 與 `.dark` 變數 | **已移除**，`color-scheme` 改為 `light`；原站幾乎都用寫死的色碼，影響很小 |
| 圖示 | `/icon.svg`、`/apple-icon.png` 等 favicon | 移除（鏡像不需要） |
| 圖片 | Unsplash 外部網址 | **保留外部網址**（需連網才看得到）；`check-links.mjs` 只允許 `images.unsplash.com` 這一種外部網址 |
| 字型 | CSS 第一行 `@import` Google Fonts：Noto Sans TC 400–700 與 Noto Serif TC 500–700 | 改成 `@import "fonts.css"`，字型檔存在 `assets/fonts/`。只下載 Noto Sans TC（全站內文）且只保留 5 個畫面實際出現的字所在的子集；Noto Serif TC 原站有載入但沒有任何規則使用（`font-serif` 實際是 `ui-serif` 系統襯線字），所以不下載。頁面若新增原本沒有的字，重跑 `mirror.mjs` 即可 |
| 頁面頂端 | 無 | 多一條 32px 細列（樣式在 `mirror.css`）；原站根容器是 `min-h-screen`，`mirror.css` 把它的最小高度扣掉細列高度 |
| 原站的錯字 | 「��門課」「變���」（原始碼裡就是壞的） | 照原樣保留（鏡像要忠實反映原站；正確文字見 `CONTENT.md`） |

除了上表，所有版面 markup 與 class 都和原站相同。本地頁面（隱藏細列後）與 `screenshots/` 的原站截圖逐頁比對，版面一致，只有文字反鋸齒造成的零星像素差異（0.02% 以下）。

## 維護

需要 Node 18 以上與 Playwright：

```bash
# 從原站重新抓取 5 個畫面、CSS 與字型（會覆寫 pages/、assets/css/wireframe.css、assets/css/fonts.css、assets/fonts/）
node tools/mirror.mjs

# 同上，並重拍 screenshots/（1440px 寬、全頁、淺色模式）
node tools/mirror.mjs --screenshots

# 檢查 index.html、pages/*.html、assets/css/*.css：本地參照都存在、外部網址只有 Unsplash 圖片、沒有 script 或 inline 事件
node tools/check-links.mjs
```

- Playwright 的位置：`mirror.mjs` 會依序找本資料夾上層的 `node_modules/playwright`、環境變數 `PLAYWRIGHT_DIR`、本機 npx 快取（`/Users/casper/.npm/_npx/9833c18b2d85bc59/node_modules/`）。瀏覽器用環境變數 `CHROMIUM_PATH`，沒指定時優先用 `~/Library/Caches/ms-playwright/chromium_headless_shell-1234/` 的 headless shell（不會在 Dock 跳出圖示）。
- 原站若新增畫面，要在 `tools/mirror.mjs` 的 `VIEWS` 清單加上：畫面 id、本地檔名、頁首上要點的按鈕、切換完成時的 H1 文字，並同步更新 `index.html` 與 `WIREFRAME_SPEC.md`。
- 請不要手動修改 `assets/css/wireframe.css` 與 `pages/*.html`（它們要忠實反映原站）；鏡像才需要的樣式都寫在 `mirror.css`。
