# 01｜純粹打字機：現場筆記 FieldNotes

> 黑白色系（白紙底、打字機炭黑、單一主色藍）。編輯器零多餘干擾，浮動工具列隨選隨現，會員方案表黑白分明一目了然。

概念是「一張白紙、一條藍色游標」：把整個平台想成打字機前的那張紙。炭黑的字打在白紙上，留白比裝飾多；介面退到最後面，只有「可以按的地方」與「訂閱限定」才出現唯一的藍色——像打字機旁那支校對用的藍鉛筆，也像編輯器裡閃爍的游標。

- **文字就是主視覺**：中文本來就是一字一格的等寬排版，英數換成打字機字體 Courier Prime，整段就像打字稿。長文欄寬 684px＝18px × 38 個全形字。
- **黑白分明**：選中、目前、已有權益用「實心墨塊」（炭黑底白字），未選、沒有用「空心框」；不靠灰階深淺、不靠陰影。
- **大膽只花在兩個地方**：個人頁面的編輯器（炭黑墨塊浮動工具列＋藍色選取、圓形＋插入鈕、藍色虛線「撕線」）與訂閱方案的比較矩陣（✓ 實心方格、✗ 空心方格、炭黑表頭）。
- 照片全部是黑白底片紀實攝影，網頁上除了藍色與狀態色，只有黑、白、灰。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。單一淺色主題，不跟著作業系統切換深色模式。
- **JS**：互動都交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡規格列的 5 件事（加上幾個選用的小互動）。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西（字體由 Google Fonts 載入，需要網路）。

**要修改樣式**：

```bash
npm install        # 安裝 bootstrap、bootstrap-icons、sass，並把 Bootstrap JS 與圖示字型複製進專案
npm run watch      # 開發時：監看 scss/，存檔就重新編譯 css/style.css
npm run css        # 編譯一次
npm run build      # 交付前：重新複製 vendor 檔案＋編譯一次 CSS
npm run check      # 檢查 6 個頁面的 head、頁首、頁尾是否與範本一致
npm run vendor     # 只重新複製 Bootstrap JS 與圖示字型（npm install 時會自動執行）
npm run images     # 重新生成圖片（需要已登入的 codex CLI，換圖時才用）
```

## 頁面

| 頁面 | 檔案 | 樣式 |
|---|---|---|
| 設計 Guideline | `guideline.html` | `scss/pages/_guideline.scss` |
| 首頁 | `index.html` | `scss/pages/_home.scss` |
| 文章列表 | `articles.html` | `scss/pages/_articles.scss` |
| 文章內頁（以〈一間餐廳的成本結構〉示範，含付費預覽牆） | `article.html` | `scss/pages/_article.scss` |
| 訂閱方案（方案卡、比較矩陣、結帳確認、FAQ） | `pricing.html` | `scss/pages/_pricing.scss` |
| 個人頁面「我的現場筆記」（讀者／作者／管理員） | `account.html` | `scss/pages/_account.scss` |

頁面上沒有列出所有頁面的導覽：從首頁依讀者流程點進各頁即可，Guideline 直接開 `guideline.html`。所有文章卡都連到 `article.html`（只做一篇文章頁）。

兩個頁面有「設計稿切換器」（虛線框＋斜線底紋，和產品介面區隔），切換時網址會同步，重新整理後停在同一個狀態：

```
article.html                    ← 未訂閱（免費段結尾是付費牆）
article.html?view=subscribed    ← 已訂閱（沒有付費牆，文章接著寫完、目錄沒有鎖頭、留言框可用）
account.html                    ← 讀者
account.html?role=author        ← 作者（多「創作」：我的文章、撰寫新文章、內容數據）
account.html?role=admin         ← 管理員（再多「平台管理」：作者申請審核、使用者管理、文章管理）
```

其他狀態（訂閱狀態的另外三種、付款三態、作者申請狀態、空狀態、編輯器的發布前檢查未通過等）放在相關區塊下方的「設計稿狀態示意」，以虛線和正式內容分開。

## 檔案結構

```
01-typewriter-style/
├─ *.html                    ← 6 個頁面，每頁完整包含頁首與頁尾
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 設計稿切換器、閱讀進度、字級、月／年切換、文章篩選
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 作者頭像、文章封面、內文配圖（AI 生成，黑白）、favicon.svg
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫
│  ├─ _base.scss             ← 全站基礎與共用小工具
│  ├─ components/            ← 頁首、頁尾、切換器、徽章、頭像、進度、文章卡、長文、付費牆、方案、訂閱狀態、編輯器、數據
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾是否與範本一致
   └─ generate-images.mjs    ← 生圖腳本（所有圖片的 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾每頁一份**：沒有元件系統，所以 6 個頁面各自完整寫一份。要改頁首或頁尾時，先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check`。每頁只有一處不同：目前頁的標示——首頁、文章列表、訂閱方案加 `active`＋`aria-current="page"`；文章內頁標「文章列表」只加 `active`；個人頁面標會員入口（手機選單的「我的現場筆記」與桌機的 `.site-member.is-active`）；Guideline 不標示。
- **新增頁面**：複製範本成新頁，改 `<title>`、description 與目前頁標示。在 `scss/pages/` 新增 partial、在 `scss/main.scss` 加一行 `@import`，執行 `npm run check`。
- **假資料直接寫在 HTML**：文案全部取自主題層的 `CONTENT.md`（Notion 原文）。跨頁要一致的數字：付費 438 篇／免費 127 篇／作者 142 位；月費 NT$ 180、年費 NT$ 1,800（省 NT$ 360，平均每月 NT$ 150）；〈一間餐廳的成本結構〉約 6,800 字、免費預覽前 2,200 字、剩下 4,600 字、已免費讀完 32%；到期日 2027/10/02、剩餘 364 天；收藏 38 篇；已發布 18 篇；漏斗 18,420 → 6,208 → 892 → 214。改動時要多頁同步（Guideline 也有）。
- **設計稿狀態**：`<body data-view="unsubscribed|subscribed">`、`<body data-role="reader|author|admin">`；元素用 `data-show-view="subscribed"`、`data-show-role="author admin"` 標記，CSS（`components/_switcher.scss`）依 body 屬性隱藏不屬於目前狀態的元素。沒有 JS 時停在預設狀態（未訂閱、讀者），畫面照樣完整。
- **JS**：`js/main.js` 只做 5 件事：① 設計稿切換器（讀網址參數、更新 `aria-pressed`、`history.replaceState`，有 `#錨點` 時套用後再捲過去，並重新計算目錄的 ScrollSpy）② 閱讀進度條（未訂閱時讀到付費牆＝32%）③ 字級 Aa 三段（切換 `.prose.is-size-*`，存在 localStorage）④ 月／年切換（省錢提示＋兩張付費卡的按鈕強調交換，★ 標籤固定在月費）⑤ 作者文章狀態篩選（`data-filter` → `data-status`）。選用：搜尋列展開後自動聚焦、收藏／追蹤的 `aria-pressed`、閱讀模式、確認付款的「處理中 → 訂閱成功」示意。目錄與側欄的目前位置用 Bootstrap ScrollSpy（`<body data-bs-spy="scroll">`）。
- **純 CSS 的互動**：主題卡 hover／focus 展開篇數（`grid-template-rows`）、結帳只有選「信用卡」才顯示卡號欄位（`:has()`）、篩選與排序的選中狀態（`.btn-check`）。
- **換行與空白**：標題、短說明用 `.text-phrase`（`word-break: keep-all`）＋`<wbr>` 標出詞組斷點；數字與單位之間用 `&nbsp;`。
- **表單**：設計稿沒有後端，表單都不送出（按鈕是 `type="button"`）；各表單上方的註解寫了串接後端時要怎麼改。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、字體、長文、間距、圓角、元件）
3. `bootstrap/scss/bootstrap`：用上面的變數編譯出整套 Bootstrap
4. `bootstrap-icons`：圖示字型與 class（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字體、區塊節奏、按鈕、焦點、表單微調，以及下表的共用類別
6. `components/*`：頁首、頁尾、設計稿切換器、徽章、頭像、閱讀進度、文章卡、長文、付費牆、方案卡與比較矩陣、訂閱狀態卡、編輯器、數據卡與漏斗
7. `pages/*`：各頁專屬樣式，class 一律加頁面前綴

原則是**先用 Bootstrap 的變數與工具類別**，真的做不到才寫自訂 CSS，而且自訂 CSS 也只引用變數，不寫死色碼。想換風格，主要改 `_variables.scss`。

### 共用類別

下面這些類別跨頁共用，新頁面直接套用，不要在 `pages/*` 另寫一份。用法與示範都在 `guideline.html`。

| 類別 | 用途 | 位置 |
|---|---|---|
| `.page-header`、`.page-lead` | 首頁以外各頁的頁首：麵包屑 → H1 → 說明，間距固定 | `_base.scss` |
| `.section`、`.section-alt`、`.section-heading` | 區塊上下留白 56／88／112px、稿紙灰區塊、標題列（左標題＋副標、右動作）；相鄰區塊之間一條炭黑分節線 | `_base.scss` |
| `.btn-primary`／`.btn-dark`／`.btn-outline-dark`／`.btn-text` | 按鈕四個層級：主要（色帶藍，全頁唯一）、強調（炭黑墨塊）、次要（炭黑框）、文字連結；hover 一律變藍 | `_base.scss` |
| `.segmented`（`.segmented-sm`） | 分段控制（`.btn-group`＋`.btn-check`）：月／年、字級、付費層級、數據期間；選中是墨塊 | `_base.scss` |
| `.tag`（`.is-selected`、`.is-empty`）、`.tag-list` | `#標籤`：一般、選中（墨塊）、0 篇（虛線） | `_base.scss` |
| `.callout`（`.is-ok`／`.is-warn`／`.is-error`／`.is-brand`） | 提示框：左側 3px 色條＋圖示＋文字（＋按鈕） | `_base.scss` |
| `.table-scroll`＋`.table-data`（`.is-text`、`.table-wide`） | 資料表：表頭稿紙灰、數字欄靠右；放不下時在外框內橫向捲動 | `_base.scss` |
| `.demo-state`（`-tag`、`-title`、`-stage`、`-label`） | 頁面上的「設計稿狀態示意」，以虛線和正式內容分開 | `_base.scss` |
| `.empty-state` | 空狀態：圖示＋一句說明＋一個下一步 | `_base.scss` |
| `.info-list` | 資訊列（標籤左、值右）：訂閱摘要、扣款資訊 | `_base.scss` |
| `.font-type`、`.figure-num`、`.figure-unit`、`.num` | 打字稿字體、打字機大數字（價格、到期日、數據卡）與單位、表格的等寬數字 | `_base.scss` |
| `.caret`（`.is-blinking`） | 品牌的藍色游標（品牌字、首頁 H1、編輯器） | `_base.scss` |
| `.paper-stack`（mixin `paper-stack`） | 疊紙：浮起層的表現方式（付費牆、結帳摘要、插入選單、下拉選單、對話框） | `_base.scss` |
| `.text-phrase`、`.bleed-x` | 詞組換行；手機滿版橫向捲動列 | `_base.scss` |
| `.design-switch`、`.role-chip`、`data-show-view`／`data-show-role` | 設計稿切換器與「作者可見」標記（設計稿專用的外觀） | `components/_switcher.scss` |
| `.badge-access`（`.is-locked`／`.is-free`／`.is-draft`／`.is-removed`） | 權限徽章，一律放在標題前面 | `components/_badges.scss` |
| `.badge-state`（`.is-ok`／`.is-warn`／`.is-error`／`.is-neutral`／`.is-progress`／`.is-ink`）、`.meta-line` | 狀態徽章（圖示＋文字）；分類與文章資訊列 | `components/_badges.scss` |
| `.avatar`（`-xs`／`-sm`／`-md`／`-lg`）、`.avatar-initial`、`.author-line` | 方形黑白頭像、字首頭像、作者列 | `components/_avatar.scss` |
| `.reading-progress`、`.progress.is-done`／`.is-empty`、`.progress-labeled` | 閱讀進度 3 種尺寸 × 3 種狀態（尚未開始＝虛線空軌） | `components/_progress.scss` |
| `.article-list`／`.article-item`、`.article-mini`、`.library-card` | 文章卡（列表）、精簡文章卡、收藏卡 | `components/_article-card.scss` |
| `.prose`（`.is-size-sm`／`-md`／`-lg`）、`.prose-table`、`.lede`、`.pull-quote` | 長文排版（684px、行高 ≥ 1.85）、損益表、導言、引文 | `components/_prose.scss` |
| `.paywall-teaser`、`.paywall`、`.plan-options`／`.plan-option`、`.save-tag` | 付費牆：140px 漸層淡出、疊紙卡片、月／年 RadioCard | `components/_paywall.scss` |
| `.plan-card`（`.is-recommended`）、`.check-list`、`.check-mark`、`.compare-table` | 方案卡、✓／✗ 方格記號、黑白分明的比較矩陣（首欄凍結） | `components/_plans.scss` |
| `.sub-card`、`.sub-state` | 訂閱狀態卡（訂閱中＝墨塊＋大字到期日）與其他三態 | `components/_subscription.scss` |
| `.editor`、`.editor-toolbar`、`.editor-selection`、`.preview-divider`、`.editor-plus`、`.editor-insert-menu`、`.editor-settings`、`.publish-check` | 編輯器元件集 | `components/_editor.scss` |
| `.stat-tile`（`.is-key`）、`.funnel`（`.is-dark`）、`.chart-panel` | 數據卡、閱讀漏斗（等比例橫條、CSS 畫） | `components/_stats.scss` |

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 紙 | 白紙 `$paper #FFFFFF`（頁面底、卡片、浮起層）、稿紙灰 `$paper-gray #F4F4F2`（交替區塊、表頭、推薦欄淡底、停用欄位） |
| 墨 | 打字機炭黑 `$ink #1A1A1A`（17.4:1，文字、墨塊）、鉛灰 `$ink-muted #595959`（7.0:1）、淡墨 `$ink-faint #6F6F6F`（5.0:1，placeholder） |
| 線 | 細線 `$rule #D9D9D6`（裝飾）、控件框線 `$control #858585`（非文字 3.7:1）；區塊之間用炭黑分節線 |
| 藍 | 色帶藍 `$ribbon #1F3BD1`（8.1:1，全站唯一的彩色：主要按鈕、連結、焦點、游標、選取、訂閱限定）、深藍 `$ribbon-deep #172EA8`（hover）、淡藍 `$ribbon-tint #E6EAFB`（選取底、訂閱限定徽章底） |
| 狀態色 | 成功 `$ok #1E6B3A`（6.5:1）、提醒 `$warn #8A5300`（6.3:1）、錯誤 `$error #B3261E`（6.5:1）；只當文字、圖示與框線，淡底一律稿紙灰 |
| 選中 | `$component-active-bg` 炭黑：選中是墨塊，不是藍 |
| 字體 | 打字稿 `"Courier Prime", "Noto Serif TC"`（標題、長文、引言、大數字）；介面 `"Noto Sans TC"`（導覽、按鈕、表單、小字）。不用全大寫標籤、不用英文眉標 |
| 長文 | 最大寬 684px（`$prose-max-width`）、18px／1.95、段距 1.5em；Aa：17／2.0、18／1.95、20／1.85 |
| 圓角 | 0；只有 radio、狀態圓點、編輯器＋插入鈕是圓的 |
| 陰影 | 無模糊陰影；浮起層用疊紙（1px 炭黑框＋右下 6px 第二張紙） |
| 焦點 | 色帶藍 2px＋2px 白紙間隙 |
| 動態 | 只有藍色游標閃爍與主題卡展開；`prefers-reduced-motion` 時關閉 |

完整規範請看 `guideline.html`。改色時，Guideline 的色票 hex、對比度與其他寫死色碼的地方也要一起改，清單見上一層 [`../README.md`](../README.md) 的「換色時同步檢查」。

## 圖片

`images/` 的 17 張圖片（作者頭像 8、文章封面 8、內文配圖 1，檔名照主題層的 `IMAGES.md`）皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，人物與場景都是虛構的。調性是黑白底片紀實攝影（Kodak Tri-X 400、細顆粒、中性灰階），生成後一律裁切、縮放並轉成灰階 JPEG：頭像 600 × 600、封面 1200 × 630、配圖 1536 × 864。頭像在頁面上是方形（不加圓角）；沒有照片的人（作者牆後 4 位、留言讀者、申請者、停用的使用者）用 CSS 的字首頭像。`favicon.svg` 是手寫的 SVG（白紙方框＋「現」＋藍色游標）。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`：

```bash
npm run images                                              # 產生缺少的圖片
node scripts/generate-images.mjs --only avatar-chen,cover-caseload   # 只重做指定的圖
node scripts/generate-images.mjs --force                    # 全部重做
```

換成其他風格時，改腳本裡的 `STYLE`（整組圖的共同調性）與各張描述即可，檔名不變，HTML 不用改。
