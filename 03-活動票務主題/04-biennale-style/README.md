# 04｜當代雙年展：StageOne 城市現場

> 黑白色系（極致純黑、純白、中灰階）。俐落無襯線字體、巨型條碼與高反差幾何方塊，展現頂級藝術策展冷靜感。

概念是「StageOne 是一座城市雙年展」：每一場活動是一件展出作品，網站是展覽的導覽系統與圖錄。白牆（純白頁面）上掛著黑色量體，照片一律黑白。大膽只花在兩件事上：**巨型條碼**（電子票券底部、全站頁尾，都是真的 Code 128）與**黑色量體**（首頁 Hero 的白色量體與票券小卡、已選票券、應付總額）。其他地方保持安靜：直角、不用陰影、不用漸層。

這一套**沒有任何彩色**，連「成功」「錯誤」都不用紅綠。所有狀態改用一套**黑白狀態語法**：

| 手法 | 意思 | 用在 |
|---|---|---|
| 反白（黑底白字） | 現在、這一個 | 目前頁、已選的膠囊與座位、目前步驟、已選票券、倒數警示、驗票成功、選中的分頁、有效與已付款的票券和訂單、已購票 |
| 斜線紋 | 不能用 | 已售罄、不可選座位、停用按鈕、逾時、付款失敗、驗票失敗、即將完售的進度條軌道、已過期與活動已取消的票券 |
| 粗框（3px） | 看這裡 | 已選票種卡、購票卡、訂單明細、搜尋列、退票規則、註冊表單卡、退票申請 |
| 虛線 | 還沒到 | 尚未開賣、結帳步驟裡還沒到的步驟、退款處理中 |

每一種狀態再加上圖示（✓、✕、！、火焰、沙漏）與文字，所以任何狀態都不只靠單一手法。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（架構同 `../../01-電商主題/01-luxury-style/`）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。單一淺色主題，不使用 `data-bs-theme`。
- **JS**：互動都交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的 8 個小功能。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西（字體從 Google Fonts 載入，離線時會退回系統字體）。

**要修改樣式**：

```bash
npm install        # 安裝 bootstrap、bootstrap-icons、sass，並把 Bootstrap JS 與圖示字型複製進專案
npm run watch      # 開發時：監看 scss/，存檔就重新編譯 css/style.css
npm run css        # 編譯一次
npm run build      # 交付前：重新複製 vendor 檔案＋編譯一次 CSS
npm run check      # 檢查 10 個頁面的 head、頁首、頁尾與登入 Modal 是否與範本一致
npm run vendor     # 只重新複製 Bootstrap JS 與圖示字型（npm install 時會自動執行）
npm run images     # 重新生成圖片（需要已登入的 codex CLI，換圖時才用）
node scripts/make-barcode.mjs T-4471-01   # 產生 Code 128 條碼的 SVG（貼進 HTML）
```

## 頁面

| 頁面 | 檔案 | 樣式 |
|---|---|---|
| 設計 Guideline | `guideline.html` | `scss/pages/_guideline.scss` |
| 首頁 | `index.html` | `scss/pages/_home.scss` |
| 活動列表 | `events.html` | `scss/pages/_events.scss` |
| 活動細節（含票種選擇與選位；以「午夜噪音祭 Vol.7」示範） | `event.html` | `scss/pages/_event.scss` |
| 購票確認與快速支付（含付款結果與電子票券，在頁內 `#result`） | `checkout.html` | `scss/pages/_checkout.scss` |
| 註冊（2026-11 補） | `register.html` | `scss/pages/_register.scss` |
| 我的票券（2026-11 補） | `tickets.html` | `scss/pages/_tickets.scss`、`scss/components/_member.scss` |
| 電子票券詳情（2026-11 補；午夜噪音祭 Vol.7 的 3 張票） | `ticket.html` | `scss/pages/_ticket.scss` |
| 購票紀錄（2026-11 補） | `orders.html` | `scss/pages/_orders.scss` |
| 追蹤的主辦方（2026-11 補） | `follows.html` | `scss/pages/_follows.scss` |

頁面上沒有列出所有頁面的導覽：從首頁依購票流程點進各頁即可（首頁 → 活動列表 → 活動細節 →「下一步：確認訂單」→ 結帳 →「確認付款」→ `#result`），Guideline 直接開 `guideline.html`。

2026-11 補的 5 頁是購票者會員中心，頁首沒有對應項目，入口在頁尾與流程裡：

- **註冊**：登入 Modal 的「註冊新帳號」→ `register.html`，送出後回首頁；註冊頁的「登入」打開同一個 Modal（不另做登入頁）。
- **我的票券**：頁尾「我的票券」或付款結果的「查看我的票券」→ `tickets.html` →「查看票券」→ `ticket.html`（電子票券詳情只做午夜噪音祭這一頁，4 張票券卡都連到它）。
- **購票紀錄**：頁尾「購票紀錄」→ `orders.html`；電子票券詳情的訂單編號、「申請退票」也連到這裡（`#refund`）。
- **追蹤的主辦方**：頁尾「追蹤的主辦方」→ `follows.html`，下一場小卡連到 `event.html`。
- 5 頁的排法和 01、02 風格刻意不同：註冊整頁是一面展牆、表單卡 7 : 5 掛在牆上；我的票券是展牆灰頁首＋分段分頁，票券卡每列 2 張（圖錄式）；電子票券詳情把票券放在展牆中央，左邊是「01／03」大編號、右邊是作品說明牌式的票券資訊；購票紀錄同活動細節的主欄＋側欄（訂單｜退票申請，≥ 1200px 才並排，側欄固定 26rem，約 8 : 4）；追蹤的主辦方是每列 2 位的參展單位名冊（上方 3px 黑線、不加外框）。購票紀錄與追蹤的主辦方的頁首右側有一個大數字（共 6 筆訂單、追蹤中 4 個主辦方）。

- 活動細節只做一頁靜態示範（午夜噪音祭 Vol.7），首頁與活動列表的每張活動卡都連到 `event.html`。
- 倒數、鎖位、付款中、付款結果都是**靜態畫面**，數字固定用 Notion 的值（05 時 12 分 48 秒、09:58、09:12）；其他狀態放在各頁底部的「設計稿狀態示意」（點狀框線＋灰色標籤）。
- 活動細節選 2 張（NT$ 3,000）、結帳 3 張（NT$ 5,974）是 Notion 的兩個獨立範例，各自照抄、不湊成一致。
- 星期幾照 Notion 原文（例如「2026/10/18 (六)」），不修正。

## 檔案結構

```
04-biennale-style/
├─ *.html                    ← 10 個頁面，每頁完整包含頁首、頁尾與登入 Modal
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的 8 個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 22 張黑白活動照片（AI 生成）、favicon.svg
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫＋票務語意（斜線紋、警示帶、座位尺寸）
│  ├─ _base.scss             ← 全站基礎＋黑白狀態語法的共用類別
│  ├─ components/            ← 頁首、頁尾、搜尋列、活動卡、購票卡、票種與座位、步驟列、訂單明細、電子票券、篩選、會員頁共用
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾＋登入 Modal 是否與範本一致、目前頁是否正確
   ├─ make-barcode.mjs       ← Code 128 條碼產生器（巨型條碼的來源）
   └─ generate-images.mjs    ← 生圖腳本（所有圖片的 prompt，輸出轉成灰階）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾、登入 Modal 每頁一份**：沒有元件系統，所以 10 個頁面各自完整寫一份。要改時先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check`。每頁只有一處不同：頁首導覽的目前頁（`active`＋`aria-current="page"`）。活動細節標示「活動列表」但不加 `aria-current`；結帳、Guideline 與 2026-11 補的 5 頁（註冊、我的票券、電子票券詳情、購票紀錄、追蹤的主辦方）不標示。`check-layout.mjs` 會檢查這些規則，比對範圍包含頁尾之後的登入 Modal。
- **新增頁面**：複製範本成新頁，改 `<title>`、description 與目前頁標示；在 `scss/pages/` 新增 partial、在 `scss/main.scss` 加一行 `@import`；在 `check-layout.mjs` 的 `expectedCurrent` 補上這一頁的目前頁規則。
- **假資料直接寫在 HTML**：8 場活動、票種、座位、訂單都寫死在頁面裡（文案逐字取自主題層的 `CONTENT.md`，顯示欄位照 `_wireframe/WIREFRAME_SPEC.md` §2.8～§2.9）。01、02 風格用的是同一組資料。
- **條碼與 QR Code**：條碼用 `node scripts/make-barcode.mjs <文字>` 產生後貼進 HTML（真的 Code 128）。電子票券的 QR Code 是真的 QR（版本 2、25 × 25 模組、容錯 M，內容是票號），用 `qrcode` 套件離線產生一次後貼成 SVG path，專案本身不依賴這個套件。
- **JS**：`js/main.js` 做 8 件事：①頁首搜尋列展開後自動聚焦；②活動列表「活動類型」篩選（必做，更新「共 N 場活動」與已套用標籤）；③其他篩選膠囊切換選中樣式；④票種數量加減（更新小計、處理 0 與每筆 4 張上限）；⑤座位點選；⑥「追蹤」切換（追蹤的主辦方的「取消追蹤」↔「追蹤」也用這一段，卡片不移除）；⑦首頁熱門列的左右箭頭；⑧我的票券的分頁（即將到來／已使用／已過期，沒有 JS 時 4 張票券卡全部顯示）。電子票券詳情的 3 張切換用 Bootstrap 的 `data-bs-toggle="pill"`，不另寫 JS。其他互動（選單、搜尋列、Modal、Offcanvas、Accordion、Carousel）都靠 Bootstrap 的 `data-bs-*`。
- **換行與空白**：活動名與標題的詞組斷點用 `<wbr>` 標出，搭配 `.text-phrase`；`NT$` 與金額、數字與單位之間用 `&nbsp;`。
- **Notion 沒寫、本風格自訂的介面字**：「快速資訊」（購票卡下方的小標）、「座位圖可以左右滑動」（手機版座位圖提示）、「已選 2 張」（已選票種卡的標記）、設計稿狀態示意的說明句與 Guideline 的說明文字。其餘介面字沿用 `WIREFRAME_SPEC.md` 的用詞。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、字體、間距、圓角、元件、票務語意）
3. `bootstrap/scss/bootstrap`：用上面的變數編譯出整套 Bootstrap
4. `bootstrap-icons`：圖示字型與 class（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字體、焦點、按鈕、區塊節奏，以及黑白狀態語法的共用類別
6. `components/*`：頁首、頁尾、搜尋列、活動卡、購票卡、票種與座位、步驟列、訂單明細、電子票券、篩選、會員頁共用（頁首大數字、狀態標籤、分段分頁）
7. `pages/*`：各頁專屬樣式，class 一律加頁面前綴

原則是**先用 Bootstrap 的變數與工具類別**，真的做不到才寫自訂 CSS，而且自訂 CSS 只引用變數，不寫死色碼（示意地圖的 SVG 也由 CSS 上色）。

### 共用類別

| 類別 | 用途 | 位置 |
|---|---|---|
| `.on-ink` | 黑底區塊：文字變白、次要文字霧灰、焦點環自動換成白色 | `_base.scss` |
| `.section`、`.section-wall`、`.section-heading` | 區塊上下留白 64／96px、展牆灰底、區塊標題（左標題右連結） | `_base.scss` |
| `.page-header`、`.page-lead` | 活動列表與 Guideline 的頁首：麵包屑 → H1 → 說明 | `_base.scss` |
| `.text-phrase` | 標題與活動名只在空白與 `<wbr>` 處換行 | `_base.scss` |
| `.num`、`.price`、`.amount` | 等寬數字；價格（粗體不換行）；大數字（Archivo 加寬 112%） | `_base.scss` |
| `.btn-primary`、`.btn-outline-dark`、`.btn-light`、`.btn-outline-light`、`.btn-text`、`.btn-icon`、`.is-loading` | 按鈕：hover 一律反白；停用是斜線紋；黑底用 light 兩種；文字按鈕 44px 高；付款中 | `_base.scss` |
| `.hatch` | 斜線紋（狀態語法：不能用） | `_base.scss` |
| `.tag`、`.tag-fill`、`.tag-scarce`、`.tag-list` | 狀態標籤：狀態詞（黑框）、類別（展牆灰）、即將完售（反白＋火焰） | `_base.scss` |
| `.remaining`（`.is-scarce`、`.is-soldout`） | 剩餘票數：文字＋Bootstrap `.progress`；即將完售與已完售換斜線紋軌道 | `_base.scss` |
| `.countdown`（`.is-warning`、`.is-expired`、`.is-upcoming`） | 倒數：一般黑框／警示反白／逾時斜線紋／尚未開賣虛線；`role="timer"` | `_base.scss`、`components/_buy-card.scss` |
| `.alert-info`、`.alert-warning`、`.alert-danger`、`.alert-success` | 提示框：資訊黑框、警示反白、錯誤粗框＋斜線紋條、成功反白 | `_base.scss` |
| `.barcode` | 條碼 SVG：寬度跟容器、高度 `--barcode-height`、顏色 `currentColor` | `_base.scss` |
| `.qr` | QR Code SVG：白底深色模組 | `_base.scss` |
| `.icon-block`、`.icon-block-outline` | 黑色方形圖示塊（價值主張、空狀態） | `_base.scss` |
| `.demo-state`（`-tag`、`-title`、`-stage`、`-label`） | 設計稿狀態示意：點狀框線＋灰色標籤 | `_base.scss` |
| `.empty-state` | 空狀態：方形圖示 → 標題 → 說明 → 一個動作 | `_base.scss` |
| `.mobile-bar` | 992px 以下的底部固定列（購票列、付款列），`<body>` 自動補下內距 | `_base.scss` |
| `.search-bar` | 搜尋列（首頁、活動列表）：3px 粗框，桌機 5:2:2:3 | `components/_search-bar.scss` |
| `.scene-card`、`.date-chip`、`.featured-card`、`.event-card` | 情境卡、日期方塊、熱門活動卡、活動列表卡 | `components/_event-cards.scss` |
| `.buy-card`（`.is-compact`、`.is-cancelled`）、`.info-list` | 購票卡、快速資訊 | `components/_buy-card.scss` |
| `.ticket-type`（`.is-selected`、`.is-sold-out`、`.is-upcoming`）、`.qty`、`.seat`（`.is-sold`、`.is-blocked`、`aria-pressed`）、`.selection-summary` | 票種卡 5 態、數量加減器、座位 4 態、已選票券 | `components/_tickets.scss` |
| `.checkout-stepper`、`.steps`、`.step` | 結帳步驟列（已完成、目前、未到；整列一般、警示、逾時） | `components/_checkout-stepper.scss` |
| `.order-summary`、`.summary-toggle` | 訂單明細與 992px 以下的「查看明細」列 | `components/_order-summary.scss` |
| `.eticket`（`.is-used`、`.is-expired`、`.is-cancelled`）、`.result-panel`、`.validation-screen` | 電子票券 4 態、付款結果、驗票回饋 | `components/_eticket.scss` |
| `.filter-group`、`.filter-chip`、`.applied-chip` | 篩選群組、篩選膠囊（已選反白＋勾）、已套用標籤 | `components/_filters.scss` |
| `.member-header.has-count`、`.member-count`、`.member-body` | 會員頁頁首的兩欄排法（放在 `.section-wall` 裡，同活動列表）、頁首右側的大數字（共 6 筆訂單）、頁首下方的內容區留白；內容區裡的 `.btn-sm` 補到 44px 高（觸控目標） | `components/_member.scss` |
| `.state-tag`（`.is-on`、`.is-void`、`.is-pending`） | 票券、訂單、主辦方的狀態標籤：反白（有效、已付款、已購票）、黑框（已使用、已退款）、斜線紋條（已過期、付款失敗、活動已取消）、虛線（退款處理中）；一律圖示＋文字 | `components/_member.scss` |
| `.seg-tabs`、`.seg-tab`（`-label`、`-sub`、`-count`） | 分段分頁（TicketTabs、電子票券的 3 張切換）：等寬方格一列，選中反白（`aria-pressed` 或 `.active`），hover 只加底線 | `components/_member.scss` |
| `.tickets-card`（`.is-used`、`.is-expired`、`.is-cancelled`） | 我的票券的票券卡（TicketCard）：16:9 縮圖＋日期方塊 → 狀態 → 活動名 → 資訊 → 訂單｜查看票券 | `pages/_tickets.scss` |
| `.ticket-plate`、`.ticket-label`、`.ticket-facts`、`.ticket-rules` | 電子票券詳情：展牆上的票券（大編號＋票券＋說明牌）、入場資訊三格大字、入場須知 01～06；票券本身沿用 `.eticket` 4 態，地圖沿用活動細節的 `.venue-map` | `pages/_ticket.scss` |
| `.orders-card`（`-head`、`-event`、`-body`、`-sum`、`-pay`、`-foot`） | 購票紀錄的訂單卡（OrderCard）：卡頭 → 活動 → 票種明細｜總額、付款方式、電子發票 → 說明與按鈕；票種明細沿用 `.order-summary-rows` | `pages/_orders.scss` |
| `.orders-refund-card`（`-rule`、`-tickets`、`-calc`） | 退票申請（RefundForm）：3px 粗框卡，預估退款沿用 `.order-summary-total` 的黑色量體；≥ 1200px 寬且視窗 ≥ 1280px 高（整張放得下）時才 sticky | `pages/_orders.scss` |
| `.follows-card`、`.follows-next` | 追蹤的主辦方（OrganizerCard）：3px 上框線＋圓形字母章（沿用 `.organizer-logo`）；下一場小卡（NextEventCard）整張連到活動細節，hover 疊一層框線不改尺寸 | `pages/_follows.scss` |
| `.register-card`、`.register-guarantee` | 註冊表單卡（3px 粗框）、寫在展牆上的入場保障 | `pages/_register.scss` |

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 色票 | 純黑 `$ink #000000`（文字、量體、主要按鈕）、純白 `$paper #FFFFFF`（頁面底）、展牆灰 `$wall #EDEDED`（區塊底、已售出座位）、石墨灰 `$graphite #5C5C5C`（次要文字 6.7:1）、水泥灰 `$concrete #808080`（框線、斜線紋 4.0:1）、霧灰 `$fog #A3A3A3`（黑底上的次要文字 8.3:1）、髮絲灰 `$line #D4D4D4`、碳灰 `$carbon #333333`（裝飾線） |
| 主題色 | `$primary`、`$success`、`$warning`、`$danger`、`$dark` 都是純黑；`$secondary`、`$info` 是石墨灰；`$light` 是展牆灰。沒有任何彩色，狀態差別由狀態語法決定 |
| 票務語意 | `$hatch`（斜線紋）、`$hatch-dense`（進度條軌道）、`$hazard`（黑白警示斜紋，驗票失敗、付款失敗）、`$scarce-threshold 25%`、座位 36／30／28px、`$mobile-bar-height 72px` |
| 字體 | 單一堆疊 `"Archivo", "Noto Sans TC"`：英數 Archivo（可變字寬，大數字加寬 112%）、中文 Noto Sans TC；H1、H2、Display 900，內文 400、行高 1.75。不用襯線、不用等寬字、不用全大寫標籤 |
| 字級 | Display 44→104px、H1 40→72px、H2 36px、H3 22px、Lead 20px、Body 16px、Caption 13px |
| 間距 | 16px 基準，擴充 6（64px）、7（96px）、8（128px）；區塊留白手機 64、桌機 96 |
| 版心 | 1140（≥ 1200）／1320（≥ 1400）；左右 24px（≥ 992 為 32px）；欄距 32px |
| 圓角 | 全部 0；只有主辦方 Logo、radio、付款方式選鈕是圓的 |
| 陰影 | 不用陰影分層，改用 1px 黑框／3px 粗框／反白量體；陰影只給 Modal、抽屜、底部固定列 |
| 按鈕 | 主要純黑底白字，次要白底 2px 黑框；hover 一律反白；停用斜線紋；高 48px（小 41、大 56；2026-11 補的會員頁把小按鈕補到 44） |
| 焦點 | 3px 純黑實線＋2px 白色間隙；黑底區塊自動換成白色（`--focus-color`） |
| 頁首 | 72px，sticky；sticky 位移 104px；結帳步驟列 sticky 在頁首下方 |
| 動態 | 只有情境卡圖片 hover 的微縮放與「查看明細」箭頭旋轉；`prefers-reduced-motion` 時全部關閉；倒數不跑、不閃爍 |

完整規範請看 `guideline.html`。改色時，Guideline 的色票 hex、對比度與其他寫死數值的地方也要一起改，清單見上一層 [`../README.md`](../README.md) 的「換色時同步檢查」。

## 圖片

`images/` 的 22 張照片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名與 01、02 風格相同（清單見主題層的 `IMAGES.md`）。調性是當代藝術圖錄的黑白攝影：純黑、純白與完整灰階、高反差、嚴謹的幾何構圖。生圖腳本會把輸出轉成真正的灰階 JPEG（macOS `sips` 套用 Generic Gray Gamma 2.2），就算 AI 帶了一點色偏，成品也只有黑白灰。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`：

```bash
npm run images                                                   # 產生缺少的圖片
node scripts/generate-images.mjs --only hero-live-crowd,scene-music  # 只重做指定的圖
node scripts/generate-images.mjs --force                          # 全部重做
```

QR Code、條碼、座位圖、示意地圖、Logo、favicon 都用 SVG／CSS 畫，不是圖片。
