# 04｜溫暖心靈慢讀：現場筆記 FieldNotes

> 淺色系＋暖色系（燕麥灰白、焦糖駝色、柔暖灰）｜柔光護眼色調，文字行距寬鬆，會員管理訂閱週期與取消路徑溫和而清晰。

概念是「一盞午後閱讀燈」：把知識訂閱平台想成只開一盞暖燈的閱讀室。燕麥色的紙、可可色的字、焦糖色的書籤；畫面對比柔和但足夠（長文內文 8.8:1），行距寬，每個需要做決定的地方（付費牆、訂閱、取消）都把「之後會發生什麼」寫在看得到的位置。大膽只花在兩件事：

- **訂閱週期尺 `.cycle`**：把「訂閱期間 2026/10/03 – 2027/10/02」畫成一段看得見的時間（已過的焦糖實線 → 今天 → 剩下的駝色、12 個月刻度 → 終點的自動續訂圖示），已取消待到期時終點換成停止圖示、終點之後是虛線（回到免費會員）。
- **溫和而清晰的取消路徑**：「變更方案」「取消自動續訂」同樣大小並排；取消只有一層確認，兩顆按鈕一樣大、「先不要」是主要；取消後保留什麼寫在按鈕下方；已取消的卡片把「恢復自動續訂」放成主要動作。

其他保持克制：標題與長文用芫荽楷體（不加粗）、書籤形狀只用在「讀到哪裡」（品牌標誌、引文卡、閱讀進度），陰影只給付費牆卡與對話框這類浮起的層。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（與 01 電商主題的 `01-luxury-style` 相同架構）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。單一淺色主題，不跟著作業系統切換深色模式。
- **JS**：互動大多交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的幾個小功能（見下方）。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西（字體從 Google Fonts 載入，需要網路）。

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

頁首與頁尾沒有列出所有頁面的導覽，也不連 Guideline：從首頁依讀者流程點進各頁即可，Guideline 直接開 `guideline.html`。所有文章卡都連到同一篇 `article.html`。

兩個頁面有**設計稿切換器**（頁面頂部暮藍虛線框，標示「設計稿狀態示意（非產品介面）」），切換時會更新網址參數，重新整理後停在同一個狀態：

```
article.html                    ← 未訂閱：殘句＋漸層淡出＋付費牆卡、目錄後 3 節上鎖、留言框停用
article.html?view=subscribed    ← 已訂閱：沒有付費牆也沒有任何「已訂閱」提示，接續 3 個章節、留言可用
account.html                    ← 讀者：閱讀＋帳號，側欄下方有「申請成為作者」，成為作者區是申請表
account.html?role=author        ← 作者：多「創作」群組（我的文章、撰寫新文章、內容數據）
account.html?role=admin         ← 管理員：再多「平台管理」（作者申請審核、使用者管理、文章管理）
```

其他狀態放在相關區塊下方的「設計稿狀態示意」（暮藍虛線分隔）：訂閱的其他 3 態與 2 種提醒、取消對話框的靜態版、付款三態與卡號錯誤、作者申請 4 態、編輯器的發布前檢查未通過／草稿未完成／自動儲存失敗／空白新文章、各種空狀態（S09–S22）。

## 檔案結構

```
04-slow-reading-style/
├─ *.html                    ← 6 個頁面，每頁完整包含頁首與頁尾
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 設計稿切換器、閱讀進度、字級、月／年切換、文章篩選等小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 作者頭像 8、文章封面 8、內文配圖 1（AI 生成，柔光暖調）、favicon.svg
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫
│  ├─ _base.scss             ← 全站基礎、共用小工具、設計稿切換器與狀態示意
│  ├─ components/            ← 頁首、頁尾、徽章、頭像、卡片、閱讀進度、長文、提示框、付費牆、方案、訂閱狀態、編輯器、數據
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾是否與範本一致，以及頁首目前頁標示
   └─ generate-images.mjs    ← 生圖腳本（STYLE 與 17 張圖的 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾每頁一份**：沒有元件系統，所以 6 個頁面各自完整寫一份。要改頁首或頁尾時，先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check`。每頁只有一處不同：頁首的目前頁（`active` 與 `aria-current="page"`）。`article.html` 標示「文章列表」但只加 `active`；`account.html` 標示會員入口（桌機的 `.site-member` 與選單裡的「我的現場筆記」）；`guideline.html` 不標示。
- **`<body>` 的屬性**：`article.html` 是 `data-view="unsubscribed"`，`account.html` 是 `data-role="reader"`；元素寫 `data-show-view="subscribed"`、`data-show-role="author admin"`，CSS（`_base.scss`）依 body 屬性隱藏不屬於目前狀態的元素。`account.html` 與 `guideline.html` 的 body 另有 Bootstrap ScrollSpy 設定（`data-bs-spy`，`data-bs-threshold="0,0.25"` 讓很長的區塊也標得到）。
- **假資料直接寫在 HTML**：文章、作者、價格與數據都寫死在頁面裡（文案全部逐字取自主題層的 `CONTENT.md`），跨頁要一致的數字見 `_wireframe/WIREFRAME_SPEC.md` §2.9（438／127／142 篇、NT$ 180／1,800／150／360、6,800／2,200／4,600 字／32%、到期日 2027/10/02…）。
- **JS**（`js/main.js`）：
  1. 設計稿切換器：讀網址參數 → 設定 `body` 的 `data-view`／`data-role` → 更新 `aria-pressed` → `history.replaceState`；有 `#錨點` 時套用後再捲過去；切換後重新整理側欄的 ScrollSpy。
  2. 閱讀進度：捲動時更新頂端細條（`--p` 與 `aria-valuenow`），並標出文章目錄的目前章節（沒有 JS 時是靜態 32%）。
  3. 字級 Aa：三段切換 `.prose-sm／md／lg`，選擇存在 `localStorage`（try/catch 包起來），工具列與手機行動列兩組選項互相同步。
  4. 月／年切換：年繳時顯示省錢提示，並交換月費卡與年費卡按鈕的強調樣式（「★ 最多人選」固定在月費卡）。
  5. 作者文章狀態篩選：分頁籤 `data-filter` 對應資料列 `data-status`。
  6. 其他小工具：搜尋列展開後聚焦、分頁籤橫向捲動時把目前項目捲進畫面、收藏／追蹤的 `aria-pressed` 切換、閱讀模式（`body.is-reading-mode`）。
  其餘互動（選單、搜尋列、Offcanvas 篩選、下拉、分頁、Accordion、取消對話框、設定面板收合）都是 Bootstrap 的 `data-bs-*`。
- **換行與空白**：標題的詞組斷點用 `<wbr>` 標出並加 `.text-phrase`；數字與單位之間用 `&nbsp;`。
- **表單**：設計稿沒有後端。搜尋用 `<form action="articles.html">`；「確認付款」「送出申請」都是 `type="button"`，不換頁。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、字體、長文字級與行高、間距、圓角、陰影、元件）
3. `bootstrap/scss/bootstrap`
4. `bootstrap-icons`（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字體、區塊節奏、按鈕與表單微調、分頁籤、分段控制、radio 卡、標籤、焦點、空狀態、設計稿切換器與狀態示意
6. `components/*`：頁首、頁尾、徽章、頭像、卡片、閱讀進度、長文、提示框、付費牆、方案、訂閱狀態（招牌）、編輯器、數據
7. `pages/*`：各頁專屬樣式，class 一律加頁面前綴

原則是**先用 Bootstrap 的變數與工具類別**，做不到才寫自訂 CSS，自訂 CSS 只引用變數，不寫死色碼。付費牆的方案卡與漏斗圖用 container query（依元件本身的寬度排版），所以同一個元件放在文章頁、手機或 Guideline 的窄欄裡都能正確排版。

### 共用類別

| 類別 | 用途 | 位置 |
|---|---|---|
| `.page-header`、`.page-lead`、`.page-body` | 首頁以外各頁的頁首（麵包屑 → h1 → 說明）；頁面主體底部留白 | `_base.scss` |
| `.section`、`.section-sm`、`.section-alt`、`.section-heading` | 區塊上下留白 56／88px、燕麥殼底色區塊、標題列（左標題＋副標、右動作） | `_base.scss` |
| `.font-reading`、`.figure-num`、`.num`、`.text-note`、`.text-phrase` | 閱讀字體；Literata 大數字；等寬數字；小字；詞組換行 | `_base.scss` |
| `.btn-outline-secondary`、`.btn-outline-primary`、`.btn-text` | 次要按鈕（燕麥奶底＋細框）、強調框、文字按鈕（44px 觸控高度） | `_base.scss` |
| `.segmented`（`.segmented-sm`） | 分段控制（月／年、字級、付費層級、數據期間），內放 `.btn-check`＋`.btn` | `_base.scss` |
| `.radio-card` | 整張可點的 radio 卡（付費牆方案、付款方式），選中有焦糖框＋右上勾勾 | `_base.scss` |
| `.tag`、`.tag-list` | `#標籤` 膠囊：一般、選中（`.is-active` 或 `.btn-check:checked`）、0 篇（`.is-empty`） | `_base.scss` |
| `.empty-state` | 空狀態：圖示＋一句說明＋一個下一步按鈕 | `_base.scss` |
| `.design-switcher`、`.role-chip`、`.demo-state`（`-tag`、`-title`、`-stage`） | 設計稿專用：切換器、「作者可見」標記、狀態示意區塊（暮藍虛線，和產品元件區隔） | `_base.scss` |
| `.perm-badge`（`.is-locked`、`.is-free`、`.is-draft`、`.is-removed`） | 權限徽章：方角小牌，放在標題前 | `components/_badges.scss` |
| `.status-badge`（`.is-success`、`.is-warning`、`.is-danger`、`.is-info`、`.is-brand`、`.is-neutral`、`.is-muted`） | 狀態徽章：膠囊＋圖示＋文字 | `components/_badges.scss` |
| `.avatar`（`-xs`～`-xl`）、`.avatar-initial`、`.author-line` | 頭像（照片／字首）、作者列 | `components/_avatar.scss` |
| `.article-list`、`.article-item`、`.article-mini`、`.topic-card`、`.library-card`、`.card-kicker`、`.meta-line` | 文章卡（列表、精簡）、主題卡、收藏卡、「權限徽章＋分類」列、「‧」資訊列 | `components/_cards.scss` |
| `.reading-bar`、`.read-progress`（`.is-reading`、`.is-done`、`.is-unstarted`、`.is-lg`） | 閱讀進度三種尺寸 × 三種狀態；進行中掛書籤記號 | `components/_progress.scss` |
| `.prose`（`.prose-sm／md／lg`）、`.lede`、`.prose-table` | 長文排版（700px、18px／2.0）、導言、閱讀欄內的數據表格 | `components/_prose.scss` |
| `.callout`（`.is-info／success／warning／danger／brand`） | 提示框：左側色條＋圖示＋文字＋（選用）按鈕 | `components/_callout.scss` |
| `.paywall-teaser`、`.paywall`（`-plans`、`-login`、`-trust`、`-alt`）、`.save-tag` | 付費牆：140px 漸層淡出＋訂閱卡 | `components/_paywall.scss` |
| `.plan-card`（`.is-recommended`）、`.plan-price`、`.billing-note`、`.compare-table` | 方案卡、價格、省錢提示、比較矩陣 | `components/_plans.scss` |
| `.sub-card`（`.is-active`、`.is-ending`、`.is-compact`）、`.cycle`（`.is-ending`、`.has-left-label`）、`.equal-actions`、`.cancel-dialog` | ★ 訂閱狀態卡、訂閱週期尺、等寬按鈕組、取消對話框 | `components/_subscription.scss` |
| `.editor`、`.bubble-toolbar`、`.preview-divider`、`.insert-menu`、`.editor-settings`、`.publish-check`、`.autosave` | 編輯器元件集 | `components/_editor.scss` |
| `.stat-tile`、`.data-table`、`.funnel-card`（`.is-dark`）、`.funnel` | 數據卡、資料表、閱讀漏斗圖（HTML＋CSS 等比例橫條） | `components/_data.scss` |

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 面 | 燕麥灰白 `$oat #F1ECE4`（頁面底）、燕麥奶 `$oat-milk #FAF7F2`（卡片、輸入框、付費牆卡、對話框）、燕麥殼 `$oat-husk #E8E1D6`（交替區塊、頁尾、進度軌）。不用純白 |
| 線 | 柔暖灰細線 `$hairline #DDD3C6`、深一階 `$hairline-strong #C7BAA9`（虛線框、次要按鈕框）、表單框線 `$control #8C7D6C`（非文字 3.4:1） |
| 文字 | 可可 `$cocoa #3A2F27`（標題，11.1:1）、墨褐 `$ink #4A3E35`（長文內文，8.8:1）、柔暖灰 `$warm-gray #6B5E54`（次要，5.3:1）、淡柔暖灰 `$warm-gray-light #73665A`（placeholder，4.7:1）。不用純黑 |
| 焦糖駝色 | 焦糖 `$caramel #8F5A2E`（主要按鈕、連結、焦點環、進度，4.9:1；按鈕字 5.4:1）、深焦糖 `$caramel-deep #74441E`（hover、強調字，6.9:1）、駝色 `$camel #C9A27A`（裝飾）、駝色奶霧 `$camel-mist #F1E3D0`（選中、推薦、免費預覽分隔線） |
| 狀態色 | 鼠尾草綠 `$sage #4A6641`（成功）、琥珀 `$amber #7E5A14`（提醒）、陶土紅 `$clay #9E4436`（錯誤）、暮藍 `$dusk #476073`（資訊、免費權限）；各配一個淡底，字對淡底都 ≥ 5:1 |
| 字體 | 芫荽 Iansui 400（標題、長文、引言；以台灣教育部標準字形為準，只有一個字重，不合成粗體）、Literata（英數與大數字）、Noto Sans TC 400／500／700（介面） |
| 長文 | 欄寬 700px、18px／2.0、段距 1.3em；Aa 三段 17／18／20px（行高 2.0／2.0／1.9）；手機不下調 |
| 圓角 | 6px（權限徽章）、10px（按鈕、輸入框）、16px（卡片）、20px（付費牆卡、對話框、狀態卡）、膠囊（狀態徽章、頭像、分段控制） |
| 陰影 | 可可色柔光陰影，只給浮起的層：`$box-shadow`（選單、工具列、訂閱摘要）、`$box-shadow-lg`（付費牆卡、取消對話框） |
| 焦點 | 內圈燕麥奶 2px＋外圈焦糖 2px；一般元素焦糖 2px outline、外推 2px |
| 動態 | 主題卡 hover 上移與展開、編輯器游標閃爍；`prefers-reduced-motion` 時關閉 |

完整規範請看 `guideline.html`（12 節：色彩、字級、長文排版、間距、圓角陰影、元件狀態、內文元素、主題專屬元件、數據圖表、S01–S22 狀態文案、RWD、Do／Don't）。改色時，Guideline 的色票 hex、對比度與 `images/favicon.svg` 的色碼也要一起改，清單見上一層 [`../README.md`](../README.md) 的「換色時同步檢查」。

## 圖片

`images/` 的 17 張圖（作者頭像 8、文章封面 8、內文配圖 1）以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名與主題層 [`../IMAGES.md`](../IMAGES.md) 一致，3 套風格共用同一組檔名。調性是午後窗光般的柔和散射光、低對比、燕麥與焦糖色的暖調。沒有照片的人（作者牆後 4 位、讀者、申請者、@deal_hunter_99）用 CSS 字首頭像。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`（頭像 1024 → 600 × 600；封面 1536 × 1024 → 中央裁成 1536 × 806 → 1200 × 630；配圖中央裁成 1536 × 864）：

```bash
npm run images                                                  # 產生缺少的圖片
node scripts/generate-images.mjs --only avatar-chen,cover-caseload  # 只重做指定的圖
node scripts/generate-images.mjs --force                        # 全部重做
```

換成其他風格時，改腳本裡的 `STYLE`（整組圖的共同調性）即可，檔名與構圖描述維持不變。
