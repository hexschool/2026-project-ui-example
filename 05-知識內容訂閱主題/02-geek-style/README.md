# 02｜極客代碼知識庫：現場筆記 FieldNotes

> 深色系＋冷色調（VS Code 暗底、電光綠、天藍）。支援 Markdown 即時高亮與代碼塊預覽，會員權限以分支權限樹狀圖呈現。

| # | 風格 | 色系 | UI 視覺特點 |
|---|---|---|---|
| 02 | 極客代碼知識庫 | 深色系 ＋ 冷色調（VS Code 暗底、電光綠、天藍） | 支援 Markdown 即時高亮與代碼塊預覽，會員權限以分支權限樹狀圖呈現。 |

概念是「在暗色編輯器裡打開的一座知識庫」：每篇第一線長文是一份即時高亮的 Markdown，會員權限長成一棵分支樹。整站的版面照程式編輯器（IDE）的方式組：

- **活動列**（頁首）：≥ 992px 固定在視窗左側的 96px 直立列，< 992px 是頂端 56px 單列。
- **側欄面板**：貼齊活動列、滿高、自己捲動的面板（篩選樹、本篇目錄、權限分支樹、作者檔案、表單、Guideline 目錄）。首頁與訂閱方案沒有側欄面板。
- **編輯區**：其餘寬度；版心只存在於編輯區內。
- **窗格**（`.pane`）：`$panel` 底、1px 線、6px 圓角、上方 32px 標題列；並排的窗格常常無間距、共用框線（`.pane-group`）。
- **頁尾面板＋狀態列**：頁尾是 `$rail` 底的面板，連結畫成資料夾樹；最下面是一條電光綠的狀態列（版權列）。

大膽只花在三個招牌元素，細節見下方「排版語言」：

1. **Markdown 即時高亮**：H1 前 `#`、H2 前 `##`、長文 h3 前 `###`、引言前 `>`，左側等寬行號槽（首頁 hero 1–8、長文、編輯器），首頁 H1 結尾一個閃爍的方塊游標。
2. **代碼塊預覽**：Guideline 的程式碼區塊做成編輯器分頁（語言標籤、行號、語法上色）；編輯器插入選單每一項左邊有區塊縮圖。文章本文沒有程式碼。
3. **權限分支樹**：個人頁側欄的閱讀主幹、創作分支、平台管理分支；文章列表是串在分支線上的「提交紀錄」；方案與比較矩陣用分支線與節點。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（與同主題 `03-thinktank-style` 相同架構）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。單一深色主題，`$enable-dark-mode: false`，`:root { color-scheme: dark }`（捲軸與原生表單控制項是深色），作業系統切換深淺色時畫面不變。
- **JS**：互動都交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的指令列搜尋（展開時聚焦、Esc 收起）與規格列出的 5 件事（設計稿切換器、閱讀進度條、字級調整、月／年切換、作者文章篩選），以及收藏／追蹤／閱讀模式的 `aria-pressed`。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西（字體從 Google Fonts 載入，離線時會退回系統字體）。

**要修改樣式**：

```bash
npm install        # 安裝 bootstrap、bootstrap-icons、sass，並把 Bootstrap JS 與圖示字型複製進專案
npm run watch      # 開發時：監看 scss/，存檔就重新編譯 css/style.css
npm run css        # 編譯一次
npm run build      # 交付前：重新複製 vendor 檔案＋編譯一次 CSS
npm run check      # 檢查所有頁面的 head、頁首（活動列＋指令列搜尋）、頁尾是否與範本一致
npm run vendor     # 只重新複製 Bootstrap JS 與圖示字型（npm install 時會自動執行）
npm run images     # 重新生成圖片（需要已登入的 codex CLI，換圖時才用）
```

## 頁面

| 頁面 | 檔案 | 樣式 | 狀態 |
|---|---|---|---|
| 首頁 | `index.html` | `scss/pages/_home.scss` | 完成 |
| 文章列表 | `articles.html` | `scss/pages/_articles.scss` | 完成 |
| 文章內頁（以〈一間餐廳的成本結構〉示範，含付費預覽牆） | `article.html` | `scss/pages/_article.scss` | 完成 |
| 訂閱方案（價目、比較矩陣、結帳、FAQ） | `pricing.html` | `scss/pages/_pricing.scss` | 完成 |
| 個人頁面「我的現場筆記」（讀者／作者／管理員） | `account.html` | `scss/pages/_account.scss` | 完成 |
| 登入 | `login.html` | `scss/pages/_auth.scss` | 完成 |
| 免費註冊 | `register.html` | `scss/pages/_auth.scss` | 完成 |
| 忘記密碼 | `forgot-password.html` | `scss/pages/_auth.scss` | 完成 |
| 作者個人頁（以陳柏諺示範） | `author.html` | `scss/pages/_author.scss`（提交紀錄與分頁沿用 `_articles.scss`） | 完成 |
| 設計 Guideline | `guideline.html` | `scss/pages/_guideline.scss` | 完成 |

頁面上沒有列出所有頁面的導覽：從首頁依讀者流程點進各頁即可；Guideline 不從頁首、頁尾連結，直接開 `guideline.html`。示意使用者陳柏諺已登入，所以頁首沒有登入／註冊按鈕；登入、註冊、忘記密碼從文章付費牆、方案頁、登入頁的連結進去。

兩個頁面有**設計稿切換器**（虛線框「設計稿狀態示意（非產品介面）」，`.demo-switch`），也可以直接用網址參數開啟：

```
article.html                    ← 未訂閱（漸層淡出＋付費牆窗格、目錄後 3 節上鎖、留言框停用）
article.html?view=subscribed    ← 已訂閱（沒有付費牆，內文接續 3 個章節，留言框可用）
account.html                    ← 讀者（閱讀＋帳號，申請成為作者是一條還沒合併的虛線分支）
account.html?role=author        ← 作者（多一條天藍的「創作」分支）
account.html?role=admin         ← 管理員（再多一條紫色的「平台管理」分支）
```

一頁只能呈現一種狀態，其他狀態放在相關區塊下方的「設計稿狀態示意」（`.demo-state`，虛線框，標題寫明情境）。

## 檔案結構

```
02-geek-style/
├─ *.html                    ← 10 個頁面，每頁完整包含頁首（活動列＋指令列搜尋）與頁尾（頁尾面板＋狀態列）
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製（開頭的註解寫了目前頁的標示規則）
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的少量互動
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 作者頭像 8、文章封面 8、內文配圖 1（AI 生成，冷調低光的紀實攝影）、favicon.svg
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫（含所有元件的深色覆寫）＋本風格變數
│  ├─ _base.scss             ← 全站基礎、Markdown 記號、行號槽、版心、區塊節奏、按鈕、表單、標籤、提示框
│  ├─ components/            ← IDE 骨架（_ide）、頁首、頁尾、徽章、頭像、長文（_markdown）、文章卡、付費牆、方案、個人頁元件、編輯器、設計稿示意
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查每頁的 head、頁首、頁尾是否與範本一致，以及目前頁標示
   └─ generate-images.mjs    ← 生圖腳本（17 張圖的 prompt 與裁切）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾每頁一份**：沒有元件系統，所以 10 個頁面各自完整寫一份。要改頁首或頁尾時，先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check`。每頁只有一處不同，就是目前頁的標示：
  - `index.html` → 首頁；`articles.html` → 文章列表；`pricing.html` → 訂閱方案：該項 `<a class="nav-link">` 加 `active`＋`aria-current="page"`。
  - `account.html` → 會員入口，兩個都加：選單內的「我的現場筆記」（`nav-link`）與桌機下段的 `nav-link site-member`。
  - `article.html`、`author.html` → 文章列表只加 `active`，不加 `aria-current`。
  - `guideline.html`、`login.html`、`register.html`、`forgot-password.html` 不標示。
- **狀態切換**：`<body data-view="unsubscribed|subscribed">`、`<body data-role="reader|author|admin">`；元素用 `data-show-view="subscribed"`、`data-show-role="author admin"` 標記，CSS（`components/_demo.scss`）依 body 屬性隱藏不屬於目前狀態的元素。沒有 JS 時以 HTML 寫的預設值（未訂閱、讀者）呈現。網址有 `#錨點` 時，套用狀態後再捲過去。
- **假資料直接寫在 HTML**：文章、作者、方案與數據的文案逐字取自主題的 `CONTENT.md`。跨頁要一致的數字（438／127／142 篇位、NT$ 180／1,800／150／360、6,800／2,200 字與 32%、2027/10/02、收藏 38、已發布 18、漏斗 18,420 → 6,208 → 892 → 214）在多頁出現，改動時要一起改。
- **換行與空白**：標題用 `.text-phrase`＋`<wbr>` 標出詞組斷點；數字與單位之間用一般空格（等寬資訊列）或 `&nbsp;`（標題、內文）。
- **表單**：設計稿沒有後端。登入、註冊、忘記密碼用 `<form action="目的頁">` 以 GET 換頁：Email、密碼、卡號欄一律不加 `name`（不會出現在網址列），只用 `id`＋`<label for>`＋`autocomplete`；串接後端時改用 POST 並補上 `name`。頁首的指令列搜尋是 GET 到 `articles.html?q=…`。
- **沒有頁面的連結**（頁尾的關於現場筆記、作者審核標準、聯絡我們）用不帶 `href` 的 `<a>`，不能聚焦、沒有 hover 底線。

## 排版語言

和同主題的 01 純粹打字機、03 高端政經智庫、04 溫暖心靈慢讀，以及同一批新做的 05 撞色創作者沙龍、06 手帳筆記插畫比，02 的差別不只在配色，而是整套版面照編輯器的方式組：**不是置中容器，是活動列｜側欄面板｜編輯區三欄；東西放在窗格裡，靠底色深淺分層（`$editor` → `$panel` → `$panel-raised`），不靠陰影；標題前有 Markdown 記號，長文左側有行號。** 大部分零件在 `scss/components/_ide.scss`（骨架、窗格、樹、分支）與 `_base.scss`（記號、行號槽、版心）。

### 網格與版心

- **IDE 三欄**：活動列 96px（≥ 992px 固定；`body` 留出 `padding-left: 96px`）｜側欄面板 288px（≥ 1200px；992–1199px 為 256px）｜編輯區（其餘）。面板與編輯區貼齊視窗，背景滿版到 1920px；版心只在編輯區內。
- **版心**（左右內距 16 → 24（≥ 768）→ 48px（≥ 992））：
  - `.wrap` 1200px：首頁、訂閱方案（沒有側欄面板）。
  - `.wrap-list` 960px：文章列表、作者頁。
  - `.wrap-account` 1040px：個人頁、Guideline。
  - 長文 `.prose` 700px（＋左側 56px 行號槽，≥ 1200px 才顯示，`.md-lines-xl`）。
- **側欄面板**的寫法（`_ide.scss` 開頭有範例）：

  ```html
  <div class="ide">
    <aside class="side-panel" aria-label="篩選">
      <div class="panel-head"><h2 class="panel-title">篩選</h2>（右側動作，選用）</div>
      <div class="panel-body">…</div>
    </aside>
    <div class="editor-area"><div class="wrap-list">…</div></div>
  </div>
  ```

  ≥ 992px 面板 `position: sticky; top: 0; height: 100dvh; overflow-y: auto`，`$panel` 底、右邊 1px `$line`，頂端 36px 標題列（`.panel-head`，也是 sticky）。寬度可用 `style="--side-w: 20rem"` 改（≥ 1200px 生效；個人頁 300px、作者頁 320px）；表單頁用 `.ide.auth-ide`（`pages/_auth.scss`），≥ 1200px 440px、992–1199px 也加寬到 360px。`.ide.ide-xl` 讓面板 ≥ 1200px 才出現（文章內頁）。祖先元素不能有 `overflow: hidden`，否則 sticky 失效。< 992px 面板不 sticky，各頁改成 Offcanvas、下拉或內容上方的區塊。
- **區塊節奏**：`.section` 上下 48px（< 992）／64px；區塊之間用 `.section-rule`（上方 1px `$line`，從活動列右緣滿版到視窗右緣）。
- **捲動偏移**：`scroll-padding-top` ≥ 992px 為 16px、< 992px 為 72px（頂端列 56px＋16px）。

### 頁首（活動列）

- ≥ 992px：`.activity-bar` 固定在左側（96px、`$rail` 底、右邊 1px `$line`）。由上而下：品牌（40px `#` 方塊＋「現場筆記」12px）→ 首頁、文章列表、訂閱方案（圖示 20px＋下方 12px 文字，每項至少 64px 高）→ 彈性空白 → 搜尋 → 會員入口（32px 頭像＋「我的現場筆記」）。`.site-header` 本身是一條從頁頂到頁底的 `$rail` 底色，整頁截圖或捲到頁尾時左側仍是完整的一條。
- < 992px：頂端 56px 單列，sticky；品牌靠左，搜尋、會員頭像、選單圖示靠右（各 44px）；選單用 Collapse 展開 3 個導覽＋「我的現場筆記」。
- 目前頁：左緣 3px `$volt` 直條＋`$panel` 底＋白字、圖示變綠；會員入口的頭像多一圈綠框。hover 只換字色與底色。
- **指令列搜尋** `#siteSearch`：Bootstrap Collapse。≥ 992px 是 fixed 浮層，在編輯區頂端中央（寬 min(640px, 編輯區 − 48px)）；< 992px 蓋在頂端列下方、滿寬。兩種都不推擠版面。`❯` 提示符號（裝飾）＋輸入框＋「搜尋」按鈕；展開時自動聚焦輸入框，Esc 收起並把焦點還給按鈕（`js/main.js` 第 0 節）。
- **閱讀進度條** `.reading-progress`（文章內頁）：≥ 992px 固定在視窗最上緣（從活動列右緣到右緣）3px `$volt`；< 992px sticky 在頂端列正下方。

### 頁尾（頁尾面板＋狀態列）

- 頁尾面板（`$rail` 底、上方 1px `$line`）：≥ 1200px 左邊品牌＋說明（最寬 420px）｜右邊 3 欄資料夾樹；< 1200px 上下排。欄名是資料夾（`folder2-open` 天藍圖示＋讀者／作者／平台），連結是樹狀檔案列（`.tree`，左側連接線用 border 畫），< 576px 兩欄。
- 狀態列 `.site-statusbar`：滿版、至少 28px、`$volt` 底、`#0B0F0C` 等寬 13px 字，只放版權列，< 576px 允許兩行。

### 卡片造型：窗格

- `.pane`：`$panel` 底、1px `$line`、6px 圓角；`.pane-head` 是 32px 標題列（`$panel-raised` 底），只放既有文案（方案名、分類、權限徽章），**不補寫英文檔名或面板名**。`.pane-body` 內距 20／24px。
- `.pane.is-accent`：1px `$volt` 框（首頁主要 CTA、付費牆）；`.pane.is-recommended`：2px `$volt` 框＋`$rec-tint` 底（推薦方案）。
- `.pane-group`（＋`.pane-group-2` ≥ 768px 兩欄、`.pane-group-3` ≥ 992px 三欄，預留）：窗格**無間距相接、共用框線**，外圍 6px 圓角。首頁 CTA、方案、結帳都用它；這是和其他風格「有間距的卡片」最大的不同。
- 陰影只給蓋在內容上的層（指令列、付費牆、下拉、對話框、浮動工具列）：`0 12px 32px rgba(0,0,0,.55)`＋1px `#454545` 框。

### 標題階層

| 層級 | 類別 | 字級（≥ 992 → 以下） | 記號 |
|---|---|---|---|
| 首頁 H1 | `.home-hero-title.md-h1` | 64（≥ 1200）／56（992–1199）→ 48（≥ 768）→ 36px，Noto Sans TC 900、行高 1.18 | `#` |
| 各頁 H1 | `h1.md-h1` | 36 → 30px，700 | `#` |
| 文章 H1 | `$article-title-sizes` | 40 → 30px，行高 1.35 | `#` |
| 區塊 H2 | `h2.md-h2`（放在 `.section-head` 裡） | 28 → 24px，700 | `##` |
| 長文 h2／h3 | `.prose h2`／`.prose h3`（自動加記號） | 25／20px | `##`／`###` |
| H3、卡片標題 | `h3`、`.story-title` | 20px（列表文章標題 17–20px） | 無 |

- 記號用 `@include md-marker("##", 2)` 產生：`::before` 寫 `content: "##" / ""`（替代文字留空，螢幕閱讀器不讀，複製標題也不會帶到 `#`），`$volt`、JetBrains Mono 700、縮成 0.55em，掛在標題左側（hanging），標題換行時第二行和第一行的字對齊。**只有 H1、H2、長文 h2／h3 有記號**，卡片標題與 H3 沒有，避免滿畫面都是 `#`。
- 等寬字只給記號、數字、資訊列、徽章、麵包屑、行號與程式碼（`.mono`、`.num`、`.meta`、`.statusline`）；標題與長文一律 Noto Sans TC。

### 招牌元素

1. **行號槽** `.md-lines`（`_base.scss`）：裡面每個直接子元素是一「行」，行號用 `::after` 的 CSS counter 畫在左側 56px 槽裡（`content: counter(ln) / ""`，純裝飾）。子元素加 `.md-blank` 時，上方的間距也算一行空行。每一行用 CSS 變數對齊行號：`--ln-h`（第一行的行高，行號在這個高度內垂直置中）、`--ln-top`（行號往下偏移，例如引言區塊的上內距）、`--ln-gap`（`.md-blank` 上方的間距）。預設 ≥ 992px 顯示，`.md-lines-xl` 改成 ≥ 1200px（長文）。注意：`.md-blank` 用掉 `::before`，所以自己也用 `::before` 的元件（`.md-quote`）要包一層 `div.md-blank`（首頁 hero 的引文就是這樣）。
2. **方塊游標** `.cursor`：首頁 H1 結尾與編輯器空行。固定寬度的行內方塊，閃爍只改 `opacity`（`steps(1)` 1s，先常亮 1 秒），版面不跳動；`prefers-reduced-motion` 時常亮。
3. **引言區塊** `.md-quote`（`_markdown.scss`）：`$panel` 底、左 3px `$volt` 線、左側 `>` 記號欄、引文 20px／1.75 500 字重、署名列 28px 頭像。長文的 `blockquote` 自動套用。
4. **代碼塊預覽** `.code-block`（`_markdown.scss`）：上方分頁列（`.code-block-tab`、`.code-block-lang`，語言名稱如 `js`）、`.code-line` 行號、語法上色 `.tok-kw`（`$branch-admin`）、`.tok-str`（`$syntax-string`）、`.tok-var`（`$sky`）、`.tok-fn`、`.tok-com`（`$fg-dim` 斜體），可橫向捲動。只用在 Guideline。
5. **樹與分支**（`_ide.scss`）：
   - `.tree`：樹狀列表，`├─`、`└─` 連接線用 border 畫（不打字元）；變數 `--tree-indent`、`--tree-x`（直線位置）、`--tree-y`（橫線高度）、`--tree-line`。用在頁尾、首頁主題樹、篩選樹、大綱樹。
   - `.node`：分支節點（12px 圓、2px 框；`.node-lg` 20px）；顏色 `.node-volt`（訂閱限定、主幹）、`.node-sky`（免費、創作）、`.node-admin`（平台管理）、`.node-pass`／`.node-warn`（預留）／`.node-fail`；`.node-hollow`、`.node-hollow-sky`（空心）、`.node-dashed`（虛線，未合併或「無」）。節點外圈用 `--node-ring`（預設 `$editor`，在 `.pane`、`.side-panel`、`.on-panel` 裡自動換成 `$panel`）把線切開。
   - `.branch-h`：一條**橫向**分支線串起幾個子元素，每個子元素的第一個元素是 `span.node.branch-node`（`aria-hidden`）。< 768px 自動改成**直向**（`.branch-h-lg` 改成 < 992px 才直向，預留）。變數 `--branch-color`、`--branch-gap`。首頁本週精選的次要 3 篇、方案卡上方的 3 節點用它。
   - `.branch-v`：**直向**分支線（提交紀錄列表、權限分支樹、忘記密碼的流程線、註冊頁權益摘要），每個子元素裡放 `.branch-node`；變數 `--branch-x`、`--branch-pad`、`--branch-node-y`、`--branch-color`。
   - `.indent-guides`：縮排導線清單（圖示在左、項目之間一條細直線），首頁訂閱保障用它。
6. **指令列** `.cmdline`：`❯` 提示符號（`.cmdline-prompt`，`aria-hidden`）＋輸入框＋按鈕。頁首搜尋、文章列表搜尋、編輯器插入選單用它。
7. **編輯器分頁籤** `.editor-tabs`（`_base.scss`）：排序、收藏、我的文章分頁。選中分頁頂端 2px `$volt`、底色同編輯區；`.tab-count` 是等寬數量。

### 各頁構圖（≥ 992px，做其他頁時照這份）

| 頁面 | 側欄面板 | 編輯區 | 主角元件 |
|---|---|---|---|
| 首頁 | 無 | `.wrap` 1200：單欄 README 式 hero（左側行號槽 1–8、`#` 大標＋游標、按鈕列、等寬狀態列、滿寬引文，右側留空）→ 4 列特點窗格 → 兩欄主題檔案樹 → 主推橫向窗格 5 : 7＋次要 3 篇掛在橫向分支線 → 作者牆＋評價 8｜保障清單 4 → 分隔線 → 相接的 CTA 窗格 | 記號標題、引言區塊、檔案樹、分支線 |
| 文章列表 | 「篩選」：4 組篩選樹（主題 8 列單選、10 個等寬 `#標籤`、權限 radio、閱讀時間 checkbox），標題列右側「清除篩選」 | `.wrap-list` 960：等寬麵包屑 → H1 → 說明 → 指令列搜尋（最寬 720）→ 列表盒：編輯器分頁籤（排序）＋右側「顯示 1–8 篇」→ 8 列提交紀錄（`.branch-v`：訂閱限定 `$volt` 實心節點、免費 `$sky` 空心節點；無縮圖）→ 等寬分頁 → 狀態示意 | 篩選樹、提交紀錄 |
| 文章內頁 | 「本篇目錄」（≥ 1200，`.ide-xl`）：5 個 h2 的大綱樹（`##` 記號，未訂閱後 3 項鎖住）→ 閱讀進度 32% → 字級分段控制 | 麵包屑＋設計稿切換器 → 標題區（700）→ 長文（`.md-lines.md-lines-xl` 行號槽、`.md-table` 損益表、`---` 等寬虛線）→ 付費牆窗格（1px `$volt` 框、陰影）→ 作者卡、延伸閱讀窗格、讀者回應（作者回覆接在縮排分支線上）。992–1199 目錄改成標題區下方的 Collapse 窗格、行號隱藏；< 992 底部固定行動列 | 行號槽長文、記號、鎖住的付費牆窗格 |
| 訂閱方案 | 無 | `.wrap` 1200：麵包屑 → H1＋副標靠左 8｜計費分段控制靠右 4（下方預留省錢提示，`visibility` 切換）→ 橫向分支線 3 節點 → 3 個方案窗格相接（`.plan-track`＋`.plan-pane`，月費 `.is-recommended`；< 992 改成左側直線、上下排）→ 分支圖比較矩陣（真的 `<table>`，每欄中央一條直線，✓ 實心節點、✗ 虛線空心節點）→ 結帳兩窗格相接 7 : 5（右邊終端機收據，sticky）→ 樹狀 FAQ（最寬 880、靠左） | 分支圖矩陣、相接的方案窗格、終端機收據 |
| 個人頁 | 300px：個人卡 → **權限分支樹**（閱讀主幹 `$volt`、創作分支 `$sky`、平台管理分支 `$branch-admin`、帳號回到主幹；讀者看到一條虛線的「申請成為作者」分支；看不到的分支整條不渲染） | `.wrap-account` 1040：麵包屑 → H1＋角色切換器 → 9 個區塊（順序＝分支樹），各區塊 `##` H2 起頭、上方 1px 線；訂閱狀態窗格 5 : 7（到期日 `$volt` 大字）、收藏 3 個窗格放在分頁盒裡、我的文章的統計做成相接的 4 格狀態列、內容數據是 4 個分開的數據卡（只有「由本篇帶來的訂閱」強調）＋CSS 漏斗、編輯器（行號＋區塊記號槽、選取、浮動工具列、免費預覽分隔線、插入選單附區塊縮圖；≥ 1400 寫作 8｜設定 4）。< 992 側欄變成內容上方的一列（個人卡＋「目前位置」下拉，點開是同一棵樹） | 權限分支樹、即時高亮編輯器 |
| 作者頁 | 320px「作者檔案」（`.side-panel.author-panel`，sticky，像程式碼託管網站的個人頁；`.author-panel` 本身沒有樣式，只標出這個面板，內容樣式在 `pages/_author.scss` 的 `.author-*`）：標題列放等寬麵包屑 → 96px 方形頭像 → H1（`#`）→ 認證作者徽章 → 職稱 → 1px 線 → 簡介 → 追蹤按鈕（滿寬；按下後電光綠底「已追蹤」，同一顆按鈕、尺寸不變）。< 992 變成內容上方的區塊：麵包屑一列 → 64px 頭像和姓名、徽章、職稱橫排 → 簡介與追蹤 | `.wrap-list` 960：`##` H2｜等寬「顯示 1–6 篇，共 18 篇」（< 768 移到 H2 下方）→ 外框列表盒裡的提交紀錄（`.commit-list`，不放作者列與縮圖、標題 h3）→ 等寬分頁 → 空狀態示意 | 滿高個人檔案面板 |
| 登入、註冊、忘記密碼 | **表單面板** `.auth-panel`（≥ 1200 440px、內距 48px；992–1199 360px、內距 32px）：內容從頂端 96px 開始，不垂直置中；H1（`#`）→ 說明 → 表單（輸入框 `$rail` 底、等寬字；「忘記密碼？」在密碼標籤同一列靠右）→ 滿寬主要按鈕；面板最下方是 1px 線隔開的切換列 `.auth-switch`（還沒有帳號？／已經有帳號？／返回登入）。< 992 變成內容上方滿寬的面板區塊（表單最寬 512、靠左） | `.auth-notes`（最寬 640、靠左，頂端和 H1 對齊）：狀態示意由上而下；註冊頁先放免費會員權益窗格（最寬 480，`.benefit-branch` 灰線＋✓ 實心／✗ 虛線節點，一般框，層級低於表單）再放欄位錯誤示意；忘記密碼的 3 個示意排成直向流程線 `.auth-flow`（節點 `$pass` 信封 → `$sky` 鑰匙 → `$fail` 沙漏），設定新密碼是真的能送出的窗格表單 | IDE 側欄裡的表單 |
| Guideline | 「目錄」（≥ 1200，`.ide-xl`）：12 節，等寬編號 01–12＋節名，ScrollSpy 目前項 `$volt-tint` 底＋左側 2px `$volt`；面板最下方一句「數值的唯一來源是 `_variables.scss`」。1200px 以下同一個 `<aside>` 變成編輯區頂端可橫向捲動的目錄列（44px、sticky：992–1199 `top: 0`、< 992 `top: 56px`），目前項底部 2px `$volt` | `.wrap-account` 1040：等寬麵包屑 → H1＋狀態列 → 12 節，每節「01 / 12」節號 → `##` H2 → `//` 註解樣式的一句原則 → 示範。色票是「主題設定檔」樣式的列（色塊｜token 名＋hex｜用途｜對比度與等級），按用途分 8 個窗格，不是方格卡；規格表在 < 768px 改成一列一張（每格前面用 `data-label` 補欄名）；付費牆畫成編輯器的分割畫面（≥ 1400 左未訂閱｜右已訂閱）；3 棵權限分支樹並排；Do／Don't 畫成 diff（− 刪掉的寫法、＋ 改成的寫法，≥ 1400 兩欄） | 代碼塊預覽、3 棵角色樹、diff 對照 |

### 首頁各寬度怎麼收合

- **1920**：編輯區背景滿版，內容維持 1200 置中；≥ 1400 時首頁 hero 的行號槽掛到版心外，hero 的字和下面各區塊的左緣對齊。
- **1200–1440**：同上；首頁主題樹的「86 篇 ‧ 最新更新」在 ≥ 1400 靠右同一列，以下移到描述下方。
- **992–1199**：活動列不變；首頁 H1 56px；作者牆 4 欄三排；頁尾面板上下排。
- **768–991**：頂端列；行號槽隱藏（記號保留）；主推窗格仍是封面 5｜內容 7；次要 3 篇橫向分支線；作者牆 6 欄兩排。
- **390**：H1 36px；按鈕滿寬上下排；狀態列 3 行（拿掉直線）；4 列特點改成「圖示＋H3 一行、說明在下」；主題樹單欄；主推封面在上；次要 3 篇的分支線改**直向**；作者牆在窗格內橫向捲動；保障清單在評價下方；CTA 上下排。

### 和設計方向的差異

- 個人頁編輯器：SPEC 建議 ≥ 992px 寫作 8｜設定 4，實作改成 ≥ 1400px 才並排（設定面板 sticky）；992–1399px 扣掉 300px 側欄後寫作窗格會窄到標題一行只剩 10 個字，所以設定面板放到寫作窗格下方，≥ 768px 內容排兩欄。
- 個人頁「其他訂閱狀態」：≥ 768px 3 欄，但 992–1199px 有側欄、編輯區只剩約 540px，這段改回 1 欄。
- 首頁作者牆：設計方向寫「≥ 1400 一排 11 格」，實作改成 ≥ 768px 6 欄兩排（992–1199 為 4 欄三排）、< 768px 窗格內橫向捲動。11 格一排時每格只有約 68px，「獨立書店店主」這類職稱在 12px 會斷成兩行，6 欄時每個職稱都是一行。
- 登入、註冊、忘記密碼的表單面板：設計方向寫 440px、內距 48px；992–1199px 改成 360px、內距 32px（440px 時編輯區只剩約 450px，錯誤示意的欄位會擠成很窄的一欄）。面板底部的切換列和表單左緣對齊、不置中，因為整套是靠左的編輯器版面。
- 作者頁：H1「陳柏諺」照全站規則前面有 `#` 記號；SPEC 建議「顯示 1–6 篇，共 18 篇」在 < 768px 改到標題下方，照做。
- Guideline 目錄：設計方向只寫了側欄面板。≥ 1200 照做；1200px 以下沒有側欄面板（`.ide-xl`），改成編輯區頂端一列 sticky 的橫向目錄，12 節在手機上也能直接跳，不用另外開 Offcanvas。付費牆的未訂閱／已訂閱並列在 ≥ 1400 才左右排，1200–1399 每欄只剩約 360px，付費牆窗格裡的兩個方案會擠成很窄的一欄。
- Guideline 的漏斗圖：深色與淺色兩張上下排（並排時每張不到 480px，刻度字會疊在一起）。同一個原因，`.funnel-ticks` 在 < 576px 只留 0、10,000、25,000 三個刻度字，格線照樣每 5,000 一條（個人頁內容數據也一起改）。
- 分頁籤與分支樹的計數 `.tab-count`：原本是 `$fg-dim`，在分支樹的 hover 底（4.29）與目前項 `$volt-tint`（3.83）上不到 4.5，改成 `$fg-muted`。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、字體、長文字級、間距、圓角、元件的深色覆寫、IDE 版面 token）
3. `bootstrap/scss/bootstrap`
4. `bootstrap-icons`：圖示字型（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字體、等寬類別、Markdown 記號 mixin、行號槽、版心、區塊節奏、頁面標題區、麵包屑、按鈕、表單、分段控制、分頁籤、標籤、提示框、空狀態、資料表、焦點、skip-link、減少動態
6. `components/*`：IDE 骨架（`_ide`）、頁首、頁尾、徽章、頭像、長文（`_markdown`）、文章卡、付費牆、方案、個人頁元件、編輯器、設計稿示意
7. `pages/*`：各頁專屬樣式，class 一律加頁面前綴（`home-`、`articles-`、`article-`、`pricing-`、`acct-`、`gl-`、`auth-`、`author-`）

原則是**先用 Bootstrap 的變數與工具類別**，做不到才寫自訂 CSS，而且自訂 CSS 只引用變數，不寫死色碼。

### 共用類別

| 類別 | 用途 | 位置 |
|---|---|---|
| `.ide`、`.ide-xl`、`.side-panel`、`.panel-head`、`.panel-title`、`.panel-body`、`.panel-section`、`.editor-area` | 側欄面板｜編輯區（見「網格與版心」） | `components/_ide.scss` |
| `.pane`、`.pane-head`、`.pane-body`、`.is-accent`、`.is-recommended` | 窗格 | `components/_ide.scss` |
| `.pane-group`、`.pane-group-2`、`.pane-group-3` | 無間距相接的窗格組（`.pane-group-3` 是預留的寫法，目前頁面沒用到） | `components/_ide.scss` |
| `.tree` | 樹狀列表（連接線用 border 畫） | `components/_ide.scss` |
| `.node`（＋顏色、`.node-lg`、`.node-hollow`、`.node-hollow-sky`、`.node-dashed`）、`.on-panel` | 分支節點（顏色裡的 `.node-warn` 是預留的，目前頁面沒用到） | `components/_ide.scss` |
| `.branch-h`（`.branch-h-lg`）、`.branch-v`、`.branch-node` | 橫向／直向分支線（`.branch-h-lg` 是預留的寫法，目前頁面沒用到） | `components/_ide.scss` |
| `.indent-guides` | 縮排導線清單 | `components/_ide.scss` |
| `.cmdline`、`.cmdline-prompt` | 指令列 | `components/_ide.scss` |
| `.tabbox`、`.tabbox-bar`、`.tabbox-count`、`.tabbox-body` | 分頁盒：編輯器分頁籤列（右側可放計數）＋內容；分頁可以是 Bootstrap tab 或 radio（`.btn-check`＋`label.nav-link`） | `components/_ide.scss` |
| `.md-h1`、`.md-h2`、`.md-h3`、`@include md-marker($marker, $count)` | Markdown 記號標題（`.md-h3` 是預留的，目前頁面的 H3 不加記號） | `_base.scss` |
| `.md-lines`、`.md-lines-xl`、`.md-blank`、`--ln-h`、`--ln-top`、`--ln-gap` | 行號槽 | `_base.scss` |
| `.cursor` | 方塊游標 | `_base.scss` |
| `.wrap`、`.wrap-list`、`.wrap-account` | 版心 1200／960／1040 | `_base.scss` |
| `.section`、`.section-rule`、`.section-head`、`.section-sub` | 區塊節奏與區塊標題列（H2＋副標｜右側按鈕） | `_base.scss` |
| `.page-header`、`.page-lead`、`.breadcrumb` | 頁面標題區、等寬路徑麵包屑 | `_base.scss` |
| `.mono`、`.num`、`.figure-num`、`.figure-unit` | 等寬字、等寬數字、大數字（價格、到期日）與單位 | `_base.scss` |
| `.meta` | 等寬資訊列（`‧` 分隔，換行時 `‧` 不留在行首；人名、職稱這類文字項目加 `.text-sans`） | `_base.scss` |
| `.statusline` | 等寬狀態列（項目之間 1px 直線） | `_base.scss` |
| `.text-volt`、`.text-sky`、`.text-pass`、`.text-dim`、`.text-muted-fg`、`.text-note`、`.text-phrase` | 文字色與詞組換行（`.text-sky`、`.text-pass` 是預留的，目前頁面沒用到） | `_base.scss` |
| `.btn-primary` | 主要按鈕：`$volt` 底、`#0B0F0C` 字 | `_base.scss` |
| `.btn-outline-info` | **次要按鈕**：1px `$sky` 框、天藍字（hover `$info-tint` 底） | `_base.scss` |
| `.btn-outline-secondary`、`.btn-secondary`、`.btn-text` | 中性外框、中性實心、文字按鈕（`.btn-secondary` 只是把 Bootstrap 內建的樣式改成深色，目前頁面沒用到） | `_base.scss` |
| `.segmented`、`.segmented-sm` | 分段控制（計費、字級、期間、付費層級） | `_base.scss` |
| `.editor-tabs`、`.tab-count` | 編輯器分頁籤 | `_base.scss` |
| `.tag`、`.tag-list` | 等寬 `#標籤` | `_base.scss` |
| `.callout`（`-success`、`-warning`、`-danger`、`-brand`）、`.callout-title`、`.callout-body` | 提示框（深色淡底） | `_base.scss` |
| `.empty-state` | 空狀態（虛線框） | `_base.scss` |
| `.table-data` | 資料表（等寬數字） | `_base.scss` |
| `.img-frame`、`.ratio-cover`、`.ratio-16x9` | 圖片外框與比例（`.ratio-16x9` 是預留的，目前頁面沒用到） | `_base.scss` |
| `.perm-premium`、`.perm-free`、`.perm-draft`、`.perm-removed` | 權限徽章（訂閱限定綠、免費天藍） | `components/_badges.scss` |
| `.kicker`、`.kicker-category` | 權限徽章＋分類那一列 | `components/_badges.scss` |
| `.status`（`.is-success`／`-warning`／`-danger`／`-info`／`-brand`／`-neutral`） | 狀態徽章 | `components/_badges.scss` |
| `.role-chip` | 角色標記「作者可見」「管理員可見」（虛線等寬小框） | `components/_badges.scss` |
| `.avatar`（`-24`～`-96`）、`.avatar-initial`、`.author-line` | 6px 圓角方形頭像、字首頭像、作者列 | `components/_avatar.scss` |
| `.story`、`.story-title`、`.story-meta`、`.title-link` | 文章標題連結與資訊（首頁次要文章；提交紀錄列表另寫在 `pages/_articles.scss`） | `components/_article-card.scss` |
| `.prose`、`.prose-sm`、`.prose-lg`、`.lede` | 長文（700px、17px／1.9，Aa 三段） | `components/_markdown.scss` |
| `.md-quote`、`.md-table-wrap`、`.md-table` | 引言區塊、渲染後的 Markdown 表格 | `components/_markdown.scss` |
| `.code-block`、`.code-block-tab`、`.code-block-lang`、`.code-line`、`.tok-*` | 代碼塊預覽 | `components/_markdown.scss` |
| `.demo-switch`、`.demo-switch-label`、`.demo-state`、`.demo-state-title`、`.demo-state-note`、`.demo-caption`、`.demo-stage` | 設計稿切換器與狀態示意（虛線、`$fg-dim`，和產品介面區隔） | `components/_demo.scss` |
| `.reading-progress` | 閱讀進度條 | `components/_header.scss` |
| `.paywall`、`.paywall-tail`、`.paywall-fade`、`.paywall-head`、`.paywall-body`、`.paywall-progress`、`.paywall-plans`、`.paywall-trust` | 付費預覽牆（漸層淡出＋1px `$volt` 框窗格） | `components/_paywall.scss` |
| `.radio-card-grid`、`.radio-card`、`.radio-card-name`、`.radio-card-price`、`.radio-card-check`、`.save-tag` | 選項卡（付費牆方案、付款方式）：選中 `$volt` 框＋淡底＋勾 | `components/_paywall.scss` |
| `.plan-track`、`.plan-pane`、`.plan-flag`、`.plan-price`、`.plan-fit`、`.benefit-list`、`.plan-cta` | 方案窗格與串起 3 個節點的分支線 | `components/_plans.scss` |
| `.benefit-branch`（加在 `.benefit-list.branch-v` 上） | 權益清單的分支版：一條 `$branch-free` 灰線串起 ✓ 實心節點、✗ 虛線空心節點（註冊頁的免費會員權益摘要） | `components/_plans.scss` |
| `.matrix-wrap`、`.matrix`、`.matrix-flag`、`.mx`（`.mx-yes`／`.mx-no`／`.mx-na`）、`.matrix-hint` | 分支圖比較矩陣（真的 `<table>`，節點裝飾、文字「有／無」） | `components/_plans.scss` |
| `.receipt`、`.receipt-total` | 收據列：名稱 ……… 等寬數值 | `components/_plans.scss` |
| `.branch-tree`、`.branch-lane`（`.is-trunk`／`.is-branch`／`.is-create`／`.is-admin`／`.is-account`／`.is-pending`）、`.branch-lane-name`、`.lane-items`、`.lane-link`、`.lane-pending-note`、`.lane-apply` | 權限分支樹（主幹、分岔弧線、未合併的虛線分支；連結加 `.nav-link` 給 ScrollSpy；`.is-trunk` 沒有樣式，只標出這條是主幹，線的樣式寫在 `.branch-lane` 本身） | `components/_account-ui.scss` |
| `.sub-pane`、`.kv-list`、`.kv-compact` | 訂閱狀態窗格 5 : 7、鍵值列 | `components/_account-ui.scss` |
| `.bookmark`、`.bookmark-title`、`.bookmark-progress` | 收藏窗格（權限｜閱讀狀態、進度） | `components/_account-ui.scss` |
| `.stat-strip`、`.stat-cards`、`.stat-card` | 相接的 4 格狀態列、分開的數據卡（`.is-accent` 強調一張） | `components/_account-ui.scss` |
| `.funnel`、`.funnel-chart`、`.funnel-row`、`.funnel-track`、`.funnel-bar`、`.funnel-value`、`.funnel-axis`、`.funnel-ticks` | 閱讀漏斗：CSS 等比例橫條（`--value`）、刻度（`--at`；< 576px 只留 0、10,000、25,000） | `components/_account-ui.scss` |
| `.review-head`、`.review-plan`、`.user-cell`、`.admin-article`、`.cancel-pane`、`.cancel-actions`、`.btn-outline-fail` | 申請審核卡、使用者表格頭像列、違規下架列、取消確認、危險的次要按鈕 | `components/_account-ui.scss` |
| `.write-pane`、`.write-doc`、`.wb`（`.wb-title`／`.wb-lede`／`.wb-rule`／`.wb-selection`／`.wb-empty`／`.is-placeholder`） | 寫作窗格：左側槽＝行號＋區塊記號（`#`、`---`）。`.write-pane` 本身沒有樣式，只用來標出寫作窗格（空白狀態加 `.write-pane-blank`），樣式在 `.write-doc` 與 `.wb` | `components/_editor.scss` |
| `.float-toolbar`、`.preview-divider`、`.insert-btn`、`.insert-menu`、`.insert-group`、`.insert-item`、`.blk-thumb` | 浮動格式工具列、免費預覽分隔線、「＋」鈕、插入選單與 32 × 24 區塊縮圖 | `components/_editor.scss` |
| `.write-bar`、`.editor-saved`、`.settings-pane`、`.settings-collapse`、`.settings-row`、`.tag-removable`、`.tag-add`、`.checklist` | 底部操作列、文章設定面板、可移除標籤、發布前檢查清單 | `components/_editor.scss` |
| `.gl-ide`、`.gl-side`、`.gl-toc-list`、`.gl-toc-num`、`.gl-toc-total`、`.gl-side-note` | Guideline 目錄：≥ 1200 側欄面板、以下頂端目錄列 | `pages/_guideline.scss` |
| `.gl-wrap`、`.gl-header`、`.gl-section`、`.gl-section-num`、`.gl-principle`、`.gl-sub`、`.gl-caption`、`.gl-list`、`.gl-stage`、`.gl-stage-panel`、`.gl-row`、`.gl-pair`、`.gl-table` | Guideline 的節、`//` 原則列、示範台、規格表（< 768 一列一張） | `pages/_guideline.scss` |
| `.gl-palette`、`.gl-tokens`、`.gl-token`、`.gl-chip`（`.is-text`／`.is-line`；淺色底專用的文字色加 `.is-on-light`）、`.gl-c-{token}`、`.gl-token-name`、`.gl-token-use`、`.gl-token-ratio`、`.gl-grade` | 「主題設定檔」樣式的色票列；`.gl-c-*` 由 `$gl-swatches` 從 `_variables.scss` 產生 | `pages/_guideline.scss` |
| `.gl-type-list`、`.gl-type-row`、`.gl-type-sample`、`.gl-type-use`、`.gl-prose-demo`、`.gl-aa`、`.gl-aa-label`、`.gl-modes`、`.gl-mode-*` | 字級列、長文示範、Aa 三段、閱讀模式示意 | `pages/_guideline.scss` |
| `.gl-ide-map`（`-bar`／`-side`／`-editor`／`-wrap`）、`.gl-space`、`.gl-space-bar`、`.gl-space-use`、`.gl-shapes`、`.gl-shape`、`.gl-shape-stage`、`.gl-shape-edge`、`.gl-layers`、`.gl-layer-*`、`.gl-elev`、`.gl-elev-card`（`.is-lg`／`.is-sm`） | IDE 三欄示意、間距尺度、圓角、底色分層、浮層陰影 | `pages/_guideline.scss` |
| `.gl-force-focus`、`.gl-fields`、`.gl-topic`、`.gl-avatars` | 靜態的焦點示範、表單 6 態、單列主題窗格、頭像列 | `pages/_guideline.scss` |
| `.gl-split`、`.gl-split-col`、`.gl-split-tab`、`.gl-split-body`、`.gl-progress`、`.gl-progress-row`、`.gl-progress-title`、`.gl-billing`、`.gl-states-4`、`.gl-roles`、`.gl-tree-reader`、`.gl-editor` | 付費牆分割畫面、閱讀進度 3 × 3、月／年兩態、4 態並列、3 棵角色樹（讀者那棵的主幹畫到虛線分支）、編輯器元件集 | `pages/_guideline.scss` |
| `.gl-funnels`、`.gl-funnel-light`、`.gl-mini-bars`、`.gl-mini-trapezoid`、`.gl-copy-table`、`.gl-copy-btn`、`.gl-empties` | 深／淺兩張漏斗、Do／Don't 小圖、S01–S22 文案表 | `pages/_guideline.scss` |
| `.gl-diffs`、`.gl-diff`、`.gl-diff-row`（`.is-del`／`.is-add`）、`.gl-diff-label`、`.gl-diff-demo`、`.gl-dont-corner`、`.gl-dont-dots` | Do／Don't 的 diff 對照 | `pages/_guideline.scss` |

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 底色分層 | 活動列、頁尾、輸入框 `$rail #181818` → 編輯區（頁面底）`$editor #1E1E1E` → 面板、窗格 `$panel #252526` → 標題列、表頭 `$panel-raised #2D2D30`；hover 列 `$row-hover #2A2D2E` |
| 線 | `$line #3C3C3C`（分隔，只當裝飾）、`$line-strong #454545`、可操作元件的框 `$control #7A7A7A`（≥ 3:1） |
| 文字 | 標題 `$fg-strong #F2F2F2`、內文 `$fg #D4D4D4`（11.25:1，不用純白）、次要 `$fg-muted #A8A8A8`（7.01:1）、行號與 placeholder `$fg-dim #8F8F8F`（5.15:1） |
| 主色 | 電光綠 `$volt #3DF58A`：主要按鈕、目前位置、訂閱限定、游標、記號、分支主幹、狀態列；hover `#6BFFA8`；按鈕字 `#0B0F0C`（13.44:1）；淡底 `$volt-tint #1E3A2A`、推薦淡底 `$rec-tint #222B25`。不當內文字色 |
| 第二冷色 | 天藍 `$sky #4FC1FF`：連結、免費權限、資訊、次要按鈕框、創作分支；淡底 `$info-tint #1B2E3D` |
| 狀態色 | 成功 `$pass #89D185`（和主色分開）、提醒 `$warn #E2C08D`、錯誤 `$fail #F48771`，各有深色淡底 `-tint`；一律搭配圖示與文字 |
| 其他 | 平台管理分支、關鍵字 `$branch-admin #C586C0`；字串 `$syntax-string #CE9178`；選取 `$selection #264F78` |
| 字體 | Noto Sans TC 400／500／700／900（介面、標題、長文）＋ JetBrains Mono 400／500／700（只給記號、數字、資訊列、程式碼；中文退回 Noto Sans TC） |
| 字級 | 介面 15px／1.65；首頁 H1 64／56／48／36px；各頁 H1 36 → 30；文章 H1 40 → 30；H2 28 → 24；H3 20；等寬資訊列 13px；程式碼 14px；大數字 56 → 44px |
| 長文 | 最大寬 700px；內文 17px／1.9（Aa 三段 16／17／19px，行高 1.95／1.9／1.85）；導言 20px／1.8；h2 25px、h3 20px；引言 20px／1.75 |
| 圓角 | 按鈕、輸入框、徽章 4px；窗格、卡片、選單、頭像 6px；貼齊視窗邊的面板 0；只有節點、狀態點、開關是圓的 |
| 陰影 | 只給浮層：`0 12px 32px rgba(0,0,0,.55)`＋1px `#454545` 框 |
| 焦點 | 2px 編輯區色間隙＋2px `$volt` 外圈（`$focus-ring-double`）；活動列、圖示按鈕用 2px `$volt` outline |
| 版面 | 活動列 96px（≥ 992）／頂端列 56px；側欄面板 288／256px；面板標題列 36px；窗格標題列 32px；版心 1200／960／1040／700；行號槽 56px；區塊上下 64／48px |
| 觸控 | < 992px 所有可點的東西至少 44px（`.btn-sm` 在 < 992px 也是 44px） |
| 動態 | 游標閃爍（1s `steps(1)`）、hover 換底色 120ms、指令列 Collapse；不做打字機、數字跳動、霓虹、hover 位移或放大；`prefers-reduced-motion` 時全部關閉、游標常亮 |

元件的深色覆寫（輸入框、checkbox、下拉、對話框、Offcanvas、Accordion、分頁、Tooltip、表格、進度條、關閉鈕）都在 `_variables.scss`；不要用 Bootstrap 預設的 `-subtle` 淺色淡底。

完整規範請看 `guideline.html`（12 節：色彩、字級、長文排版、間距、圓角陰影、元件狀態、內文元素、主題專屬元件、數據圖表、S01–S22 狀態文案、RWD、Do／Don't）。

### 換色時同步檢查

色票的唯一來源是 `_variables.scss`，但下面幾處把數值寫成文字或寫死，改色時要一起檢查：

- [ ] `scss/_variables.scss`：色票（面、線、文字、`$volt`、`$sky`、狀態色與 `-tint`）、`$theme-colors`、權限色與分支色（`$perm-*`、`$branch-*`）、語意變數（`$body-*`、`$input-*`、`$focus-ring-double`、`$link-*`、`$code-color`、`$mark-bg`…）、淺色圖表色 `$chart-*-on-light`。
- [ ] `guideline.html`：色票的 hex、對比度與等級（AAA／AA／≥ 3:1）、用途文字，Bootstrap 主題色與語意變數的對應表；色塊本身的顏色由 `_guideline.scss` 的 `$gl-swatches` 從變數取，不用改。
- [ ] 漏斗圖與其他 inline SVG：顏色請用 CSS class 或 `currentColor` 控制，不要在 SVG 裡寫死 hex。插入選單的區塊縮圖 `.blk-thumb`（`.t-frame`、`.t-volt`、`.t-sky`、`.t-admin`、`.t-str`…）在 `_editor.scss` 上色；Guideline 的淺色漏斗 `.gl-funnel-light` 的次要字與格線由 `$chart-text-on-light`、`$chart-bg-on-light` 混出來，改了要重算對比（目前次要字 5.84）。
- [ ] 節點外圈 `--node-ring`：預設是 `$editor`，窗格、側欄面板與 `.on-panel` 裡是 `$panel`，比較矩陣用該欄淡底；底色改了要確認節點和背景之間那一圈還對得上。
- [ ] 程式碼區塊的語法色 `.tok-*`（`_markdown.scss`）：`$branch-admin`、`$syntax-string`、`$sky`、`$fg-dim` 在 `$rail` 底上的對比。
- [ ] 風格自己的 `README.md`：Design token 摘要。
- [ ] 改了頂端列高度（`$topbar-height` 56px）時：文章內頁閱讀進度條 < 992 的 sticky `top`、Guideline 目錄列 < 992 的 `top`、`$scroll-pad-mobile`（72px＝56＋16），以及 Guideline「間距與格線」寫的數字；改了活動列寬度（`$activity-bar-width` 96px）時，Guideline 的 IDE 示意也要改。
- [ ] `scripts/generate-images.mjs` 的 `STYLE`：整組圖片的色調，換色後重新生圖。
- [ ] `templates/page.html` 與每一頁的 `theme-color`（目前 `#181818`，＝`$rail`），以及 `images/favicon.svg` 裡的色碼（`$rail`、`$line-strong`、`$volt`）。

## 圖片

`images/` 的 17 張圖片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名與同主題其他風格相同（清單見主題的 `IMAGES.md`）：作者頭像 8 張（600 × 600）、文章封面 8 張（1200 × 630）、內文配圖 1 張（1536 × 864）。調性是低光、冷調的紀實攝影：炭灰陰影、石板灰、深青與青藍為主，實用光源帶一點柔和的綠，像深色介面裡的照片；不要霓虹、不要賽博龐克；餐廳與廚房兩張允許一點暖色的實用光源，但整體仍偏冷。頭像是平視、50mm、臉部柔和的中性光（膚色自然，不偏綠或青），背景沉進冷灰陰影。封面與內文配圖不拍清楚的臉，只拍手、背影或遠處模糊的人（場景在台灣，prompt 註明人物是台灣人）。畫面裡沒有可讀的文字與品牌標誌。沒有照片的人（作者牆後 4 位、留言讀者、申請者、使用者表格）用 CSS 的字首頭像（`.avatar-initial`）。替換時保持相同檔名即可，不需改程式。

`favicon.svg` 是手繪向量：`$rail` 底的圓角方塊上一個電光綠 `#` 記號＋方塊游標。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`（先依原圖實際尺寸置中裁切成目標比例，再縮放、轉 JPEG 品質 80）：

```bash
npm run images                                              # 產生缺少的圖片
node scripts/generate-images.mjs --only avatar-chen,cover-caseload   # 只重做指定的圖
node scripts/generate-images.mjs --force                    # 全部重做
CONC=1 node scripts/generate-images.mjs                     # 一次只跑一張
```

換成其他風格時，改腳本裡的 `STYLE`（整組圖的共同調性）與各張描述即可。
