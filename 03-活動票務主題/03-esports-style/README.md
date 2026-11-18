# 03｜電競競技場：StageOne 城市現場

> 深色系 ＋ 冷色系（曜石灰、碳纖維紋、炫光金屬藍）。支援即時選位倒數、高能動態發光按鈕，支付流程如戰術任務般俐落。（Notion 風格表原文）

| 編號 | 風格 | 色系搭配 | UI 視覺特點 |
|---|---|---|---|
| 03 | 電競競技場 | 深色系 ＋ 冷色系（曜石灰、碳纖維紋、炫光金屬藍） | 支援即時選位倒數、高能動態發光按鈕，支付流程如戰術任務般俐落。 |

概念是「電競聯賽的選手入場系統」：整個網站是一台碳纖維機殼，上面只亮一種光，就是**炫光金屬藍**的 HUD。頁首是浮在畫面上方的 HUD 列，卡片四角有 L 形括角，按鈕、標籤、分頁都是往右斜的平行四邊形，數字一律用方角的 Oxanium 讀數。Notion 的三個特點各有落點：選位有**環形倒數**與**耗盡計時條**，主流程按鈕會**定時掃過一道光**，結帳是一條**三段式任務進度條**。琥珀只在「快沒了」時出現（即將完售、倒數警示），薄荷代表成功。

和同主題其他 5 套的分界：底色是曜石灰 `#0B0E13`（不是 rave 的純黑），全站只有一種品牌光（沒有綠、沒有粉），形狀是括角＋平行四邊形（沒有切角），字是 Oxanium 方角＋Noto Sans TC 700（不用 Unbounded、不用 900）。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（架構同 `../01-rave-style/`）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。這是**單一深色主題**：直接把 Bootstrap 原本給淺色用的變數設成深色，不使用 `data-bs-theme`。
- **JS**：互動都交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的 10 個小功能（必做的是活動類型篩選與我的票券的分頁）。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西（字體從 Google Fonts 載入，離線時會退回系統字體）。

**要修改樣式**：

```bash
npm install        # 安裝 bootstrap、bootstrap-icons、sass，並把 Bootstrap JS 與圖示字型複製進專案
npm run watch      # 開發時：監看 scss/，存檔就重新編譯 css/style.css
npm run css        # 編譯一次
npm run build      # 交付前：重新複製 vendor 檔案＋編譯一次 CSS
npm run check      # 檢查 10 個頁面的 head、頁首、頁尾＋登入 Modal 是否與範本一致
npm run vendor     # 只重新複製 Bootstrap JS 與圖示字型（npm install 時會自動執行）
npm run images     # 重新生成圖片（需要已登入的 codex CLI，換圖時才用）
```

## 頁面

| 頁面 | 檔案 | 樣式 | 狀態 |
|---|---|---|---|
| 設計 Guideline | `guideline.html` | `scss/pages/_guideline.scss` | 完成 |
| 首頁 | `index.html` | `scss/pages/_home.scss` | 完成 |
| 活動列表 | `events.html` | `scss/pages/_events.scss` | 完成 |
| 活動細節（含票種選擇與選位；以「午夜噪音祭 Vol.7」示範） | `event.html` | `scss/pages/_event.scss` | 完成 |
| 購票確認與快速支付（含付款結果與電子票券，在頁內 `#result`） | `checkout.html` | `scss/pages/_checkout.scss` | 完成 |
| 註冊 | `register.html` | `scss/pages/_register.scss` | 完成 |
| 我的票券 | `tickets.html` | `scss/pages/_tickets.scss` | 完成 |
| 電子票券詳情（午夜噪音祭 Vol.7 的 3 張票） | `ticket.html` | `scss/pages/_ticket.scss` | 完成 |
| 購票紀錄（含退票申請，在頁內 `#refund`） | `orders.html` | `scss/pages/_orders.scss` | 完成 |
| 追蹤的主辦方 | `follows.html` | `scss/pages/_follows.scss` | 完成 |

頁面上沒有列出所有頁面的導覽：依流程點進去即可，Guideline 直接開 `guideline.html`。

- 購票：首頁 → 活動列表 → 活動細節 →「下一步：確認訂單」→ 結帳 →「確認付款」→ `#result` →「查看我的票券」→ 我的票券。
- 註冊：登入 Modal 的「註冊新帳號」→ 註冊 →「完成註冊」回首頁；註冊頁的「登入」再開回登入 Modal。
- 會員中心：頁尾「購票者」欄的「我的票券」「購票紀錄」「追蹤的主辦方」（頁首導覽沒有這幾項）。

## Design token 摘要

全部在 `scss/_variables.scss`，對比度以 WCAG 2.x 公式計算。

| Token | Hex | 用途 | 關鍵對比 |
|---|---|---|---|
| `$obsidian` 曜石灰 | `#0B0E13` | 頁面底、`theme-color` | 鋼白 16.38 |
| `$carbon` 碳纖維 | `#12171E` | 卡片、面板、頁首、頁尾、交替區塊 `.section-alt` | 鋼白 15.25、次要 8.25 |
| `$carbon-hi` | `#1A212A` | 輸入框、hover 底、血條軌道 | 鋼白 13.74、faint 5.24 |
| `$gunmetal` 槍灰 | `#253040` | 分隔線、碳纖維亮絲 | 只當裝飾，不承載資訊 |
| `$control` | `#5E7088` | 表單框線、膠囊與次要按鈕框 | 非文字 3.20～3.82 |
| `$text` 鋼白 | `#E6EDF5` | 內文、標題、QR 淺底 | 16.38 |
| `$text-muted` | `#A3B1C2` | 次要文字 | 8.86 |
| `$text-faint` | `#8494A8` | placeholder、停用、最小說明 | 6.24 |
| `$arc` 炫光金屬藍 | `#3D9BFF` | 主色：連結、目前頁、選中、HUD 英文標 | 當字 6.75 |
| `$arc-hi` | `#8CCBFF` | 按鈕漸層亮端、焦點外框、hover | 11.14 |
| `$arc-deep` | `#2F80F0` | 按鈕漸層暗端 | 上放 `$void` 4.94 |
| `$void` | `#05111F` | 藍、琥珀、薄荷、紅實心上的字；QR 模組 | `$arc` 上 6.63 |
| `$amber` 警示琥珀 | `#FFB224` | 即將完售（低血量）、倒數警示 | 當字 9.98；實心上放 `#1A1200` 10.30 |
| `$mint` 薄荷 | `#34D9A5` | 成功、有效票、已付款、驗票成功 | 9.95；實心上放 `#03140E` 10.46 |
| `$alert` 警報紅／`$alert-text` | `#FF5468`／`#FF6B7C` | 錯誤（實心／文字） | 實心上放 `#1A0006` 6.42；文字 6.55 |

- Bootstrap 對應：`$primary: $arc`、`$secondary: $text-muted`、`$success: $mint`、`$warning: $amber`、`$danger: $alert`、`$info: $arc-hi`、`$light: $carbon-hi`、`$dark: $obsidian`；`$color-contrast-dark: $void`，所以藍、琥珀、薄荷、紅上都自動用深色字。
- 淡底：選中 `$arc-tint #1A2F46`、琥珀 `$amber-tint #2E2A1F`、薄荷 `$mint-tint #162E2E`、紅 `$alert-tint #2E1E27`。
- 票務語意：即將完售＝琥珀實心標籤＋火焰圖示＋文字＋琥珀血條；售罄＝槍灰底＋斜線紋＋刪除線＋「已售完」；選中＝金屬藍框＋`$arc-tint` 底＋勾＋光暈；倒數警示＝整組琥珀框＋三角圖示；逾時＝faint 字＋斜線紋＋✕。**琥珀、紅、薄荷、藍一律配圖示與文字**。
- 字體：**Oxanium** 500～800（英數、品牌字、價格、倒數、票號、HUD 英文標；數字本身就等寬）＋**Noto Sans TC** 400／500／700（中文標題 700、內文 400、強調 500）。不用 900，所以字體網址只載入 400、500、700（方向說明原本列了 900，沒有地方用到，拿掉）。不用斜體、不把中文做斜切。
- 字級：Display 72／40px（`clamp`）、H1 52、H2 34、H3 20（手機由 Bootstrap RFS 縮小）、Lead 18、Body 16（行高 1.75）、Caption 13、價格 Oxanium 700（卡片 20、購票卡 28、應付總額 44）、倒數 Oxanium 700（首頁數字框 28、參戰面板數字框 26、座位圖環形 28（< 576px 22）、任務進度條與鎖位提示 18）、票號 Oxanium 700、18px、字距 .06em。
- 圓角 2px（卡片、輸入框），HUD 框與面板 0；沒有切角。
- 陰影：不用灰黑陰影分層，只有光暈（`$glow-btn`、`$glow-btn-hover`、`$glow-selected`），對話框與底部固定列用 `$shadow-float`。
- 焦點：2px `$arc-hi` 外框、外推 2px＋一圈 35% 金屬藍光暈。

### 換色時同步檢查

色票的唯一來源是 `scss/_variables.scss`，但下面幾處把數值寫成文字或寫死，改色（或改頁首高度）時要一起檢查：

- [ ] `scss/_variables.scss`：色票、`$theme-colors` 對應、語意變數（`$body-*`、`$input-*`、`$focus-ring-color`…）、淡底 `-tint`、實心上的深色字（`$void`、`$amber-ink`、`$mint-ink`、`$alert-ink`）、碳纖維紋 `$weave-1`～`$weave-6`，以及註解裡寫的對比度。
- [ ] `scss/_base.scss`：碳纖維紋註解裡的對比度（最亮一條 `$weave-2` 上放鋼白、次要文字）。
- [ ] `scss/components/_eticket.scss`：寫死的 QR 淺底 `$qr-light #E6EDF5`、掃描線 `$qr-scan #BFE0FF`、金屬箔條漸層的 `#C9D4E0`、`#8E9FB4`、橫式票券帶的 `#2E3A4C`。
- [ ] `scss/components/_validation.scss`：開頭註解的對比度（薄荷上 `$mint-ink`、警報紅斜線處約 `#ED4D60` 上 `$alert-ink`）。
- [ ] `guideline.html`：01 色彩每張色票的 inline 底色、hex、對比度與用途文字；01-F Bootstrap 主題色對應表；01-G 票務語意；08 Do／Don't 文字裡寫出的 QR 色碼。
- [ ] 這份 `README.md`：Design token 摘要的表格與對比度。
- [ ] 改了頁首高度時：`_variables.scss` 的 `$site-header-*`、`$sticky-*`，`components/_checkout-parts.scss` 的 `$mission-height`，`pages/_checkout.scss` 的 `$co-mission-h-*`；確認活動細節的情報分頁列（84px）、參戰面板（148px）、FAQ 標題（152px）、`.ev-anchor` 補差額（52px），結帳的任務進度條（84px）、戰利品面板（168／204px）、`.co-anchor` 與 `#result` 補差額（72／108／128px），`html { scroll-padding-top }` 與 Guideline 目錄（96px）；Guideline 03-D 的 sticky 表與下方「頁首與頁尾」的數字。
- [ ] SVG：`images/qr-t-4471-01.svg`～`-03.svg`（淺底＋模組）、`venue-map.svg`、`logo.svg`、`favicon.svg` 裡寫死的色碼；結帳與票券詳情 QR 旁的 HTML 註解也寫了這兩個色碼。
- [ ] `scripts/generate-images.mjs` 的 `STYLE`：換色後重新生圖（`npm run images`）。
- [ ] `templates/page.html` 與每一頁的 `<meta name="theme-color" content="#0B0E13">`，改完執行 `npm run check`。

## 排版語言

給接手做其他頁的人：先讀這一節，再看 `index.html` 與 `scss/_base.scss`。

### 格線與節奏

- 12 欄；全站用 `.container-xl`：< 1200 滿寬、xl 1140、**xxl 1400**（比既有 3 套的 1320 寬，像寬螢幕 HUD）。左右留白 24px，≥ lg 32px；欄距 24px。
- 區塊上下 56px（手機）／88px（桌機），用 `.section`。相鄰兩個曜石灰區塊之間加 `.section-rule`（1px 槍灰線）；要分開的帶用 `.section-alt`（`$carbon` 滿寬帶）。
- 密度緊湊：基準 8px，卡片內距 20～24px。

### 頁首與頁尾

- **頁首＝懸浮 HUD 列**：sticky、離視窗上緣 12px、高 64px、收在版心內（1920 寬時左右露出曜石灰）；碳纖維紋玻璃底＋四角括角。左品牌（六角徽章＋StageOne＋城市現場）、中間**兩格分段控制鈕**「首頁｜活動列表」（目前頁是金屬藍實心段）、右側搜尋、登入／註冊、我要辦活動。< 992px 只留品牌、搜尋圖示、選單鈕，選單是由右滑出的 Offcanvas（`#siteNav`，同一份 DOM 在 ≥ 992px 由 `.navbar-expand-lg` 變回頁首內容）。搜尋列 `#siteSearch` 接在 HUD 列正下方、同寬。
- 頁首在版面上佔 88px（12＋64＋12）：`$site-header-space`。
- **sticky 位移**（都在 `_variables.scss`）：
  - `$sticky-top-offset` 96px（12＋64＋20）：`html { scroll-padding-top }` 與 Guideline 左側目錄（`top: 96px`）。活動細節的 FAQ 標題是 `top: 152px`（96＋56，接在情報分頁列下方）。首頁、活動列表、註冊與 2026-11 補的 5 頁除了頁首沒有 sticky 元素。
  - 活動細節的情報分頁列、結帳的任務進度條：`top: $sticky-bar-top`（84px），分頁列高 `$sticky-bar-height`（48px）；該頁參戰面板 `top: 148px`。
  - 結帳的任務進度條高 68px（≥ 1200px 一列）、104px（992–1199px 兩列）、124px（390px 寬，倒數文字換成兩行），戰利品面板 `top` 是 168px（≥ 1200）／204px（992–1199）。
  - **錨點的 `scroll-margin-top` 只補差額**：`html` 的 `scroll-padding-top`（96px）會和 `scroll-margin-top` 相加，所以活動細節 `.ev-anchor` 補 52px（148 − 96），結帳 `.co-anchor`、`#result` 補 72／108／128px。
- **頁尾**：碳纖維紋底，上緣 2px 金屬藍光線（中間亮、兩端淡出）；≥ 992px 品牌 4 欄＋3 個連結欄，欄與欄之間 1px 槍灰直線，欄標題前 Oxanium 小編號「01」「02」「03」（`aria-hidden`）；版權列另起一行。

### 卡片與面板

- **括角矩形**：`.hud-panel` 是全站的卡片底（碳纖維底＋1px 金屬漸層框＋四角 12px L 形括角）。括角平常 50% 透明，滑過或鍵盤進入（`:focus-within`）時 100%；只改顏色。放在 `.section-alt` 裡會自動改成曜石灰底。
- 只要括角、不要底與框時用 `.hud-frame`；元素的 `::after` 另有用途時用 mixin `brackets-on(before)`。
- 照片：一律有由上往下的曜石灰漸層壓底；文字壓在圖上的位置至少 70% 曜石灰（次要文字 85%）。照片的亮部用 `object-position` 移到文字的另一側。
- **平行四邊形**（−12°）：按鈕、狀態標籤、篩選膠囊、分頁、步驟段。只斜 `::before` 的底與框，文字不斜；焦點環畫在元素本身（矩形）。新元件用 mixin `parallelogram($inset)`，顏色改 `--para-bg`、`--para-border`、`--para-shadow`。高 44～48px 的元素 `$inset` 用預設 5px，高 56px 用 6px；左右內距至少 20px。
- **六角徽章** `.hex`：品牌、價值主張圖示、頭像（`.hex-photo`）、主辦方字母章、空狀態、驗票 ✓／✕（`.hex-mint`、`.hex-alert`）。
- 卡片平常不發光；光暈只給主要按鈕、選中、焦點與倒數框。

### 標題階層

- 區塊標題用 `.hud-heading`：上方一行 **HUD 英文標** `.hud-label`（Oxanium 600、12px、大寫、字距 .16em，`aria-hidden="true"`）→ H2 `.hud-title`（左側 4px 金屬藍短條，右側 1px 槍灰線延伸到容器邊或右側動作）→ 選用的副標 `.hud-sub`。右側連結或箭頭放 `.hud-heading-actions`。
- **英文標只能用 Notion 區塊名括號裡的原文**：首頁 Value Proposition、Browse by Category、Featured Events、Social Proof & Guarantee；活動細節 About the Event、Ticket Types & Seat Selection、Venue & Directions、Organizer、FAQ & Notice；結帳 Stepper、Attendee Info、Fast Payment、Order Summary、Result & E-Ticket。**活動列表與 2026-11 補的 5 頁 Notion 沒有英文名，不放英文標**，改用 `.hud-index`（Oxanium 編號「01」「02」，前面自動加 `// `）。
- 每頁一個 H1；頁首區（活動列表、會員中心、Guideline）用 `.page-header`：麵包屑 → H1 → `.page-lead`。

### 招牌元素（Notion 三個特點）

| 特點 | 做法 | 頁面 |
|---|---|---|
| 即時選位倒數 | 首頁倒數卡把「05 時 12 分 48 秒」的三組數字各放進 HUD 數字框（`.countdown-hud`、`.countdown-box`，字照 Notion，只是分格）。座位圖右上是 SVG **環形倒數**（09:58／10:00，環外 12 格刻度 24 秒轉一圈）；結帳步驟列右側是 **10 格耗盡計時條**（09:12 亮 9 格又 2/10、警示 01:58 剩 2 格整列琥珀、逾時 0 格＋斜線紋）。倒數數字一律不動、不閃爍 | index、event、checkout、guideline |
| 高能動態發光按鈕 | `.btn-primary` 是金屬藍漸層平行四邊形＋光暈；加 `.btn-sweep` 後每 4 秒有一道斜向光帶從左掃到右（0.9 秒走完、停 3.1 秒）。只給主流程按鈕：首頁「找本週活動」與倒數卡「立即購票」、活動細節「選擇票種」與出擊列「下一步：確認訂單」、結帳「確認付款 NT$ 5,974」、註冊「完成註冊」。同一屏有兩顆時第二顆加 `.btn-sweep-late`（延後 2 秒），所以同一時間只有一顆在掃；其他主要按鈕只有靜態光暈 | index、event、checkout、register、guideline |
| 支付流程如戰術任務 | 結帳步驟列＝任務進度條（3 段平行四邊形：已完成薄荷＋勾、目前金屬藍外框發光＋粗體、未到槍灰）；左欄每段面板左上一個 HUD 標（Attendee Info、Fast Payment）＋Oxanium 段號「02-A」「02-B」（`aria-hidden`）；付款成功時電子票券由上往下「掃描顯影」 | checkout、guideline |

- **血條**（剩餘票數）：Bootstrap `.progress` 用 mask 切成 10 格；一般金屬藍、≤ 25% 琥珀、0% 只剩槍灰格＋斜線紋。上方文字列照 SPEC，顏色＋文字＋血條三者並用。
- **碳纖維紋**（mixin `carbon-weave()`、類別 `.carbon-weave`）只鋪大面積：頁首、頁尾、Hero 左半遮罩、指令列、註冊右側面板、票券詳情的票券帶、追蹤的主辦方選手卡卡頭（只放字母章與名稱 h2）。不放在小字底下。
- **掃描線**（`$scanlines`）：3px 間距、4% 透明，疊在 Hero、主辦方轉換帶、票券帶。

### 動態

| 動態 | 做法 | reduced motion |
|---|---|---|
| 主要按鈕掃光 | `.btn-sweep::after` 是一塊和按鈕同樣 −12° 斜切的光帶層，只動背景位置（`background-position`），所以光帶不會跑出平行四邊形，也不影響版面。方向說明原本寫「只動 transform」，但平移整個偽元素會讓光帶跑到斜邊外的三角形空白，改成動背景位置 | 不掃光，只留靜態光暈 |
| 主要按鈕 hover | 漸層整體變亮、光暈 alpha 變高；不改尺寸、不位移 | 照常（transition 全部 0.01ms） |
| 座位圖環形倒數刻度、QR 掃描線、付款成功的票券顯影 | 見方向說明；都在固定尺寸的框內。票券顯影延後 0.4 秒開始，等「確認付款」平滑捲動到 `#result` 再播 | 停住或直接顯示 |

- 不做：卡片或圖片 hover 位移、放大，任何 hover 才出現的資訊，霓虹閃爍、粒子。`transition` 只寫 color、background-color、border-color、box-shadow、opacity。
- 分段列（`.seg`）與篩選膠囊（`.chip`）的文字顏色與底色**不轉場**，選中與取消同時切換：選中的底是漸層（背景圖不能轉場），如果只讓文字慢慢變色，切換的那一瞬間會出現深字配透明底、淺字配亮藍底的低對比。這兩個元件只有框線與光暈有 0.15 秒轉場。
- 全站在 `@media (prefers-reduced-motion: reduce)` 把動畫與轉場關掉（`_base.scss` 最後）。

### 各頁構圖原則

Notion 寫死、6 套都一樣的只有 4 件事：首頁 Hero 滿版＋倒數小卡右下（< xl 移到文字下方）＋搜尋列緊接 Hero；活動細節主視覺＋右側 sticky 購票卡（最上方是倒數）、手機底部購票列、票種卡直列；結帳步驟列＋保留倒數固定在上方、桌機 7 : 5、手機底部總額＋付款；付款結果把電子票券「長出來」放在中央。其餘照下面做，**不要做成既有 3 套的「3 : 9 左側欄＋每列 1 張橫式卡」**：

- **index**（完成）：Hero 文字在左側 6 欄**垂直置中**、外面套四角括角 HUD 框；倒數是「對戰卡」（三格數字框＋琥珀血條＋掃光「立即購票」）；搜尋列是 Hero 底部 96px 的**指令列**（不浮出）；價值主張是 4 欄狀態格（1px 線分隔、六角圖示，不包卡片）；情境卡是 4 張**平行四邊形選角卡**；本週熱門是碳纖維帶上的對戰卡軌道（≥ 1400px 4 張一列）；評價與保障 7 : 5（玩家留言＋入場保障面板）；主辦方轉換帶。
- **events**（完成）：**頂部篩選控制台**（滿寬兩層：第一層「活動類型」8 格分段列，綁 JS 篩選；第二層日期、地區、票價、狀態、排序 5 欄），**不用側欄**；結果 ≥ lg **每列 2 張直式對戰卡**。< lg 控制台只留分段列（橫向捲動）＋「篩選與排序」鈕開 Offcanvas（由下滑出）。
- **event**（完成）：麵包屑下一條 sticky **情報分頁列**（錨點到各區 H2，ScrollSpy；分頁列的 5 個字就是各區 H2，是補的介面字，Notion 沒有）；8 : 4（主視覺＋介紹｜sticky「參戰面板」購票卡）；票種與選位是 `$carbon` 滿寬帶 **5 : 7**（左 4 張「裝備欄位」票種卡直列｜右座位圖：**六角磚座位**、發光舞台條、右上環形倒數），區塊底部 sticky 的**出擊列**＝已選票券；場地 7 : 5 的戰術地圖 SVG。和方向說明不同的地方：
  - 只有參戰面板 sticky，快速資訊卡照常捲動、滑進參戰面板下面：兩張一起約 800px 高，1440 × 900 的視窗扣掉 148px 放不下，最後一列會被蓋住看不到。
  - 場地照片從交通卡頂端移到戰術地圖右上角（≥ 768px 疊在地圖上，像偵察視窗；< 768px 接在地圖下方）：照片放卡頂時交通卡比地圖高 300px 以上，地圖下面空一大塊。地圖 SVG 改成 4 : 3，右上角只有街廓。
  - 座位圖 992–1199px 欄寬只有約 470px：座位間距 3px、排號欄 36px、不錯開；≥ 1200px 才錯開半格成蜂巢。< 768px 在卡片內橫向捲動。
  - 出擊列外面包一層 `.ev-sortie-range`（只包票種卡、座位圖與出擊列），sticky 的範圍從這裡開始，不會蓋住區塊標題。整頁截圖（視窗停在頁首）時出擊列會畫在這一層的頂端，實際捲動時是貼在視窗底部。
- **checkout**（完成）：H1 視覺隱藏；sticky **任務進度條**＋10 格耗盡計時條；7 : 5（左任務面板 Attendee Info、Fast Payment｜右 sticky「戰利品面板」訂單明細，應付總額 44px）；`#result` 7 : 5 成功｜失敗。電子票券 `.eticket` 是**直式通行證**（最寬 380px，上方金屬藍漸層帶、左緣 6px 金屬箔條、QR 在 `#E6EDF5` 淺底方框裡），`.is-landscape` 修飾類別給票券詳情用。< 576px 時，狀態示意裡單獨擺的任務進度條（`.mission-boxed`）倒數文字獨佔一行、耗盡計時條換到下方撐滿寬；「付款處理中，請勿關閉或重新整理頁面…」按鈕用 `text-wrap: balance` 並縮小字級與左右內距，「請勿關閉」包在 `.text-nowrap` 裡，平均分成兩行。
- **register**（完成）：**分割畫面延伸到視窗邊緣**，像遊戲登入畫面：≥ 992px 左 7 欄表單面板（最寬 520px、括角，置中）｜右 5 欄碳纖維入場保障面板一路延伸到視窗右緣，至少一屏高（扣掉頁首 88px），角落一個 40% 透明的巨大六角徽章（裝飾）。和方向說明不同的地方：
  - 右側面板的底往上延伸 88px、鋪到懸浮 HUD 頁首後面（頁首是懸浮的，不延伸會在頁首下方露出一條曜石灰）。
  - 欄位錯誤的狀態示意放在分割畫面下方、對齊左側表單欄，寬度同表單面板。
  - < 992px：表單 → 入場保障（和表單同寬、置中的面板）→ 狀態示意。
- **tickets**（完成）：3 格 HUD 分段列分頁（JS 第 9 項）；照片是整張卡的底（`.photo-veil`），最近一場是**滿寬聚光橫幅**（右側括角讀數盒：Oxanium「×3 張」＋「查看票券」），其餘照片底橫幅 ≥ 992px 每列 2 張。和方向說明不同的地方：
  - 列表用 flex-wrap，不用 2 欄格線：分頁切換後一列只剩 1 張時（例如「即將到來」的第 2 張），那張撐滿整列，不留半列空白。
  - 文字暗區寬度：≥ 768px 曜石灰 94% → 90% 到卡寬 55%（992–1199px 卡片較窄，延到 68%）才開始變淡；< 768px 照片只露出卡片上緣 7rem，文字區 92% 以上。
  - 狀態示意 5 : 7：還沒有任何票券（重畫一份不能按的分段列＋六角空狀態）｜主辦方取消活動（聚光橫幅的取消版：照片去色、上緣 2px 警報紅、「查看退款進度」）。
- **ticket**（完成）：碳纖維票券帶上左 3 欄**直排票券插槽**（Bootstrap pill，選中是金屬藍框＋光暈＋左側亮條）｜右 9 欄**橫式通行證**＋票券資訊 2 × 2 讀數格；下方入場資訊 3 欄簡報格，左上角簡報代號 02-A～C（`aria-hidden`）。和方向說明不同的地方：
  - 「加入行事曆」「轉贈」「申請退票」與退票規則小字放在左欄插槽下方（直排），右側 9 欄只放票券與資訊，通行證撐滿 9 欄。
  - < 992px 插槽在自己的捲動容器內橫向排（不撐開頁面），順序：插槽 → 票券（< 768px 直式）→ 票券資訊 → 操作。
  - 狀態示意 3 個並排：已使用、已過期、活動已取消（印章帶圖示：`.eticket-stamp`）。3 欄各自依內容高度、頂端對齊，不拉成等高（第 3 欄多了操作按鈕，等高會讓前兩欄下方空一大塊）。
  - 入場資訊 02-B 的「開啟導航」直接接在開車說明下方，不推到格子底。
- **orders**（完成）：**戰績列表**（滿寬一筆一列，明細用 Collapse 收合，第一筆預設展開；訂單編號、狀態、總額常駐；列左側 3px 狀態色條，滑過整列只換底色）；退票申請是下方滿寬面板，≥ 1200px 5 : 7（992–1199px 1 : 1，左欄才放得下訂單下拉的完整文字），預估退款 Oxanium 40px 薄荷色，「送出退票申請」只有靜態光暈、不掃光。和方向說明不同的地方：
  - 列的版面依列表本身的寬度切換（container query），所以狀態示意裡比較窄的列表也會自動換版：寬 ≥ 80rem（1440px 以上）一層 5 欄，每欄固定寬，6 列的狀態、總額上下對齊；48–80rem 兩層（狀態在訂單編號下方、按鈕在活動下方）；< 48rem 卡片式（編號＋狀態 → 活動 → 總額靠右 → 按鈕滿寬 → 查看明細）。
  - 退款試算是 3 列讀數（左標籤、右數字），不是 3 格並排：3 格並排時右欄下半空太多。最下方小字「主辦方取消或延期…」直接接在「送出退票申請」下方，不推到欄底。
- **follows**（完成）：≥ 1200px **每列 4 張選手卡**（768–1199px 2 張、< 768px 1 張）：碳纖維卡頭（六角字母章＋右上 Oxanium 編號 #01～#04）→ 名稱 h2 → 簡介 →「即將舉辦 1 場活動」讀數條 → 下一場小卡（16:9 縮圖在上，整張是連結，hover 只亮括角）→「取消追蹤」次要小鈕（JS 第 10 項）。同一列的卡用 subgrid 共用橫向軌道，簡介長短不同，下一場小卡與按鈕仍然對齊。576–767px 卡片滿寬，下一場小卡改成縮圖在左。
- **guideline**（完成）：照 SPEC §3.00 的 8 章與 3 : 9；左側 sticky 目錄是 `.hud-panel` 清單（Oxanium 編號 01～08，ScrollSpy 目前章節是 `$arc-tint` 底＋金屬藍左條），< 992px 目錄收起，改成頁首區下方一排平行四邊形章節膠囊（橫向捲動）。和其他 5 套的 Guideline 不同的地方：
  - 頁首區下方一條 3 格「裝備欄」（`.gl-loadout`）：Notion 的三個特點各一格，連到該特點的狀態示範（05-F 倒數、05-A 發光按鈕、05-I 任務進度條）。
  - 每章的小節像任務簡報一樣加 Oxanium 代號（01-A、05-G…），元件狀態每一節是一塊 `.hud-panel`，Notion 特點相關的小節標題旁掛一枚小標籤。
  - 狀態示範用頁面上真的在用的 class；hover、focus、active 用 `.is-hover`、`.is-focus`、`.is-active` 模擬（只在 `_guideline.scss`，數值與元件本身的 `:hover`、`:focus-visible`、`:active` 相同）。
  - 「10 個頁面的格線比例」用色塊畫出每頁實際的欄數，sticky 位移整理成一張表（03-D）；RWD 斷點分成原有 5 頁＋Guideline（07-B）與 2026-11 補的 5 頁（07-C）兩張表。
  - 驗票畫面（05-K）只出現在 Guideline：行動驗票工具是第二階段，用 `components/_validation.scss` 的手機機殼示範成功／失敗兩態。2026-11 新增的元件（票券卡、分頁、訂單列、退票表單、主辦方卡）照 SPEC 不加進元件狀態，只在狀態文案（06-B）註明出現在哪一頁。
  - Do／Don't 前 7 組照 SPEC（08-A），後 4 組是這一套自己的規則（08-B：文字不跟著斜切、同一屏只有一顆掃光、QR 不反白、卡片平常不發光）；錯誤示範都是靜態的畫，不會真的閃爍或掃光。

## 檔案結構

```
03-esports-style/
├─ *.html                    ← 10 個頁面，每頁完整包含頁首、頁尾與登入 Modal
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製（開頭註解寫目前頁規則）
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的 10 個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 活動照片（Codex 生成）、logo.svg、favicon.svg
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫＋票務語意色＋招牌（碳纖維、括角、光暈）
│  ├─ _base.scss             ← 全站基礎與形狀語言（碳纖維紋、括角、平行四邊形、六角徽章、HUD 標題）、共用類別
│  ├─ components/            ← 按鈕、頁首、頁尾、登入 Modal、狀態小元件、搜尋列、活動卡、分段列、購票卡、票種卡、座位圖、結帳元件、電子票券、會員中心、驗票畫面
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴：home-、events-、ev-、co-、gl-、reg-、tk-、tkd-、od-、fl-）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾＋登入 Modal 是否與範本一致
   └─ generate-images.mjs    ← 生圖腳本（STYLE 與 22 張圖的 prompt）
```

`scss/main.scss` 的載入順序：Bootstrap 函式 → `_variables.scss` → Bootstrap 本體 → Bootstrap Icons → `_base.scss` → `components/*` → `pages/*`。票種卡、座位圖、購票卡、結帳元件、電子票券、會員中心（`_member.scss`）、驗票畫面（`_validation.scss`，目前只在 Guideline 示範）都在 `components/`；新的共用元件也放在這裡，並加進 `main.scss`。原則是先用 Bootstrap 的變數與工具類別，自訂 CSS 只引用變數，不寫死色碼（SVG 檔與 Guideline 的色票示範例外）。

## 沒有打包工具時的工作方式

- **頁首、頁尾、登入 Modal 每頁一份**：要改的時候先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check`。比對範圍從 `<footer>` 一路到 `</html>`，所以頁尾後面的登入 Modal 也會一起比對。每頁只有一處不同：頁首導覽的目前頁（`active`＋`aria-current="page"`）。首頁標「首頁」、活動列表標「活動列表」；活動細節標「活動列表」但不加 `aria-current`；結帳、Guideline 與後 5 頁不標目前頁。
- **`<body>` 的屬性不在比對範圍**：有底部固定列的頁面加 `class="has-bottom-bar"`；Guideline、活動細節加 ScrollSpy 的 `data-bs-spy`。
- **假資料直接寫在 HTML**：8 場活動、票種、座位、訂單都寫死在頁面裡（Notion 原文；Notion 沒寫的照 `../_wireframe/WIREFRAME_SPEC.md` §2.8～§2.9）。星期幾照 Notion 原文。
- **JS**：`js/main.js` 的 10 件事：
  1. 頁首搜尋列展開後自動聚焦
  2. **活動列表「活動類型」篩選**（必做）：`[data-filter-group="category"]` 裡的 `data-filter`＋`aria-pressed`、卡片 `#eventList > [data-category]`，更新 `[data-filter-count]` 與 `[data-filter-applied]`
  3. 其他篩選群組（`[data-chip-group] .chip`）只切換選中樣式；有 `data-reveal` 的膠囊（「自訂日期區間」）展開日期欄位
  4. 票種數量加減（`[data-order-max]`、`[data-ticket]`、`.qty-value`、`[data-qty-step]`、`[data-selection-*]`）
  5. 座位點選（`.seat-map .seat[data-seat]`、`[data-seat-selected]`）
  6. 「加入追蹤」↔「已追蹤」（`.btn-follow`、`[data-follow-text]`）
  7. 首頁熱門列的左右箭頭（`[data-rail-prev]`、`[data-rail-next]`）
  8. 電子票券切換時更新「第 N 張，共 3 張」：Carousel 用 `[data-carousel-index]`；票券插槽（Bootstrap pill）在插槽按鈕加 `data-ticket-index`，顯示處放 `[data-ticket-index-label]`
  9. **我的票券的分頁**（必做）：`[data-filter-list="#ticketList"]` 裡的 `data-filter`＋`aria-pressed`、票券 `#ticketList > [data-status]`
  10. 追蹤的主辦方「取消追蹤」↔「追蹤」（`[data-unfollow]`、`[data-unfollow-label]`；狀態記在 `data-following`，不加 `aria-pressed`，卡片不移除）
  其餘（選單 Offcanvas、搜尋列、登入 Modal、篩選 Offcanvas、FAQ Accordion、付款方式收合、查看明細、票券插槽、情報分頁列與 Guideline 目錄的 ScrollSpy）都靠 Bootstrap 的 `data-bs-*` 屬性。
- **換行**：活動名、短標題用 `.text-phrase`＋`<wbr>`；「島嶼獨白｜」這類名稱前半段用 `.text-nowrap` 包起來。
- **表單**：搜尋列是 `<form action="events.html">`，註冊是 `<form action="index.html">`（GET）。註冊、結帳、登入 Modal 的姓名、手機、Email、密碼、卡號都不加 `name`（GET 送出時不會出現在網址），只有 `id`、`<label for>` 與 `autocomplete`。購票紀錄的退票申請只有外觀：「送出退票申請」是 `type="button"`，欄位不加 `name`，勾選框與下拉是 `autocomplete="off"`。

## 共用類別

| 類別 | 用途 | 位置 |
|---|---|---|
| mixin `carbon-weave()`、`.carbon-weave` | 碳纖維紋（只鋪大面積） | `_base.scss` |
| mixin `scanlines-layer`、`$scanlines` | 掃描線 | `_base.scss`、`_variables.scss` |
| `.hud-frame`（`.is-lit`）、mixin `brackets-on($pseudo, $inset)`、mixin `bracket-layers($size, $w)` | 四角 L 形括角，`--bracket` 控制顏色 | `_base.scss` |
| `.hud-panel` | 卡片與面板的底：碳纖維＋金屬漸層框＋括角 | `_base.scss` |
| mixin `parallelogram($inset)` | 平行四邊形（`--para-bg`、`--para-border`、`--para-shadow`） | `_base.scss` |
| `.hex`（`.hex-sm`、`.hex-lg`、`.hex-solid`、`.hex-mint`、`.hex-alert`、`.hex-photo`） | 六角徽章 | `_base.scss` |
| `.hud-heading`、`.hud-heading-main`、`.hud-heading-actions`、`.hud-label`、`.hud-index`、`.hud-title`、`.hud-sub` | 區塊標題（英文標只用 Notion 區塊名） | `_base.scss` |
| `.section`、`.section-alt`、`.section-rule` | 區塊上下 56／88px、碳纖維滿寬帶、1px 分隔線 | `_base.scss` |
| `.page-header`、`.page-lead` | 頁首區：麵包屑 → H1 → 說明 | `_base.scss` |
| `.img-frame` | 照片框（1px 槍灰框，搭配 `.hud-frame` 與 `.ratio`） | `_base.scss` |
| `.price`、`.num`、`.font-display`、`.text-note`、`.text-phrase` | 價格讀數、等寬小數字、Oxanium、小字說明、詞組換行 | `_base.scss` |
| `.alert-action` | 圖示＋說明＋按鈕的提示框 | `_base.scss` |
| `.demo-state`（`-tag`、`-title`、`-label`）、`.empty-state`（`.empty-state-icon` 搭配 `.hex.hex-lg`） | 設計稿狀態示意、空狀態 | `_base.scss` |
| `.btn-primary`、`.btn-sweep`、`.btn-sweep-late`、`.btn-secondary`、`.btn-text`、`.btn-icon`、`.btn.is-loading` | 按鈕（見上方「招牌元素」） | `components/_buttons.scss` |
| `.site-header`、`.site-hud`、`.site-brand`、`.site-nav`、`.site-offcanvas`、`.site-search` | 懸浮 HUD 頁首 | `components/_header.scss` |
| `.site-footer`、`.site-footer-col`、`.site-footer-num` | 頁尾 | `components/_footer.scss` |
| `.login-modal` | 登入 Modal | `components/_modal.scss` |
| `.tag`（`.tag-hot`、`.tag-free`、`.tag-scarce`、`.tag-soon`、`.tag-sold-out`、`.tag-ok`、`.tag-danger`、`.tag-info`、`.tag-dim`）、`.tag-list` | 平行四邊形狀態標籤（一律圖示＋文字；`.tag-dim` 給已使用、已過期、已退款這類已結束的狀態） | `components/_status.scss` |
| `.remain`（`.is-scarce`、`.is-sold-out`） | 血條：剩餘票數 | `components/_status.scss` |
| `.countdown`、`.countdown-num`、`.countdown-hud`、`.countdown-box`（`.is-warn`、`.is-expired`） | 倒數（行內／三格數字框）3 態 | `components/_status.scss` |
| `.date-chip`、`.chip`（`aria-pressed`）、`.chip-list` | HUD 日期框、平行四邊形篩選膠囊 | `components/_status.scss` |
| `.search-bar`、`.search-bar-keyword` | 搜尋列（指令列） | `components/_search-bar.scss` |
| `.scene-card`、`.feat-card` | 選角卡、對戰卡（首頁） | `components/_event-card.scss` |
| `.match-card`（`-media`、`-img`、`-tags`、`-price`、`-price-label`、`-body`、`-title`、`-facts`、`-intro`、`-tickets`、`-ticket-name`、`-ticket-value`、`-label`、`-foot`、`-actions`） | 活動列表的直式對戰卡（16:9 圖＋價格讀數牌、主辦／時間／地點、介紹、票種清單、血條＋追蹤＋主按鈕） | `components/_event-card.scss` |
| `.seg-bar`、`.seg`（`aria-pressed`；狀態示意裡不能按的重畫用 `.is-current`）、`.seg-count` | 平行四邊形分段列（活動列表「活動類型」8 格、我的票券 3 格分頁；選中是金屬藍實心＋光暈） | `components/_segment.scss` |
| `.buy-card`（`-label`、`-price`、`-actions`、`-includes`、`-safe`；縮小版 `.buy-card-mini`、`-state`、`-onsale`、`-plain`、`.is-cancelled`） | 參戰面板（購票卡）與 4 種狀態示意 | `components/_buy-card.scss` |
| `.info-list`、`.info-list-row`、`.info-list-icon` | 快速資訊卡（`<dl>`，每列左側一個小圖示格） | `components/_buy-card.scss` |
| `.sortie`（`-title`、`-list`、`-total`）、`.selection-empty` | 出擊列＝已選票券（≥ 992px 在票種區底部 sticky） | `components/_buy-card.scss` |
| `.bottom-bar`（`-price`、`-sub`）、`.has-bottom-bar`（加在 `<body>`） | < 992px 底部固定列（活動細節購票、結帳付款） | `components/_buy-card.scss` |
| `.ticket-type`（`.is-selected`、`.is-scarce`、`.is-sold-out`、`.is-upcoming`；`-main`、`-head`、`-name`、`-price`、`-note`、`-status`、`-action`、`-check`）、`.ev-ticket-list`／`.ticket-type-list` | 票種卡＝裝備欄位（左側 4px 狀態色條） | `components/_ticket-type.scss` |
| `.qty`、`.qty-btn`、`.qty-value` | 分段式數量加減器（每格 44px） | `components/_ticket-type.scss` |
| `.seat-map`（`-head`、`-title`、`-lock`、`-hint`、`-scroll`、`-grid`）、`.seat-stage`、`.seat-zone`、`.seat-row`、`.seat-row-label`、`.seat-row-seats`、`.seat`（`aria-pressed`、`.is-selected`、`.is-sold`、`.is-blocked`）、`.seat-legend`、`.seat-selected` | 座位圖：藍圖格線底、發光舞台條、六角磚座位 4 態 | `components/_seat-map.scss` |
| `.ring-timer`（`-ticks`、`-track`、`-value`、`-num`） | 環形倒數（SVG，外圈 12 格刻度 24 秒轉一圈） | `components/_seat-map.scss` |
| `.mission-bar`、`.mission`（`.is-warn`、`.is-expired`、`.mission-boxed`）、`.mission-label`、`.mission-steps`、`.mission-num`、`.mission-text`、`.mission-timer` | 任務進度條（結帳 Stepper）3 態 | `components/_checkout-parts.scss` |
| `.drain`（`style="--drain: 92%"`） | 10 格耗盡計時條 | `components/_checkout-parts.scss` |
| `.task-panel`、`.task-panel-head`、`.task-panel-code`、`.task-panel-title`、`.task-panel-check`、`.task-panel-note` | 任務面板（HUD 標＋Oxanium 任務代號 02-A、02-B） | `components/_checkout-parts.scss` |
| `.order-summary`（`-title`、`-event`、`-thumb`、`-name`、`-label`、`-rows`、`-calc`、`-total`、`-note`、`-toggle`） | 戰利品面板＝訂單明細（應付總額 44px＋2px 金屬藍光線）、< 992px「查看明細」列 | `components/_checkout-parts.scss` |
| `.pay-quick`、`.pay-quick-title`、`.pay-quick-buttons`、`.pay-methods`、`.co-terms`、`.co-secure` | 快速支付、其他付款方式收合清單、同意條款、安全提示 | `components/_checkout-parts.scss` |
| `.result-panel`（`.result-panel-fail`）、`.result-icon`、`.result-title`、`.result-text`、`.result-order`、`.result-actions` | 付款結果（成功薄荷六角勾／失敗警報紅六角 ✕） | `components/_checkout-parts.scss` |
| `.eticket`（`.is-landscape`、`.is-used`、`.is-expired`、`.is-cancelled`；`-head`、`-type`、`-title`、`-facts`、`-body`、`-note`、`-no`、`-stamp`）、`.qr`、`.qr-code`、`.qr-scan`、`.eticket-carousel`、`.eticket-pager` | 電子票券＝直式通行證（QR 掃描線、`#result:target` 顯影）；`.is-landscape` ≥ 768px 橫式；`.eticket-stamp` 印章可以帶圖示（已使用、已過期、活動已取消） | `components/_eticket.scss` |
| `.member-header`、`.member-header-inner`、`.member-header-main`、`.member-readout`、`.member-readout-num` | 會員中心頁首區：麵包屑 → H1 → 說明，右側括角框裡的 Oxanium 大數字讀數（「共 6 筆訂單」「追蹤中 4 個主辦方」） | `components/_member.scss` |
| `.photo-veil`、`.photo-veil-img` | 照片當整張卡的底：曜石灰漸層（左 94% → 右 40%）＋掃描線，文字壓在左側暗區 | `components/_member.scss` |
| `.verify-device`、`.verify-device-bar`、`.verify-screen`（`.is-ok`、`.is-fail`）、`.verify-icon`、`.verify-title`、`.verify-detail`、`.verify-time` | 驗票畫面（主辦方端）：手機尺寸的 HUD 機殼，裡面整面結果色＋六角 ✓／✕＋文字；目前只在 Guideline 05-K 示範 | `components/_validation.scss` |
| `.gl-` 前綴（`.gl-toc`、`.gl-loadout`、`.gl-section`、`.gl-sub`、`.gl-swatch`、`.gl-state`、`.gl-dos`、錯誤示範 `.gl-bad-*`…）；`.is-hover`、`.is-focus`、`.is-active` 狀態模擬 | Guideline 專用：目錄、裝備欄、章節、色票、狀態格、Do／Don't。狀態模擬掛在真的元件上（`.btn-primary.is-hover`、`.seat.is-focus`…），數值與元件本身的 hover、focus、active 相同 | `pages/_guideline.scss` |

## 圖片

- 22 張照片照 `../IMAGES.md` 的檔名、比例與畫面主體，用 Codex CLI 生成（`scripts/generate-images.mjs`），原始 PNG 暫存在系統暫存資料夾的 `stageone-esports-raw-images/`。
- 攝影調性（`STYLE`）：電競聯賽官方攝影師。冷色溫約 7000K、曜石灰暗部保留細節（不壓成純黑）、金屬藍輪廓光與 LED 邊光、薄霧接住光束、對稱或硬斜線構圖；白天、戶外、市集、講座也調成冷藍的藍調時刻，暖色燈泡改成白藍 LED。不要霓虹粉、綠、暖鎢絲燈橘、底片顆粒。
- Hero 與 `organizer-cta` 的 prompt 另外要求左半暗而單純（壓碳纖維遮罩與文字）。
- `logo.svg`、`favicon.svg`：手繪向量，六角徽章裡一條方角 S 形折線（色碼對應 `$carbon`、`$arc-hi`、`$arc`、`$arc-deep`；`logo.svg` 另有一圈六角內框是 `$gunmetal`）。QR Code、示意地圖是手寫 SVG：
  - `qr-t-4471-01.svg`～`-03.svg`：3 張票的 QR（模組圖形沿用 01 的檔案，換成 `#E6EDF5` 淺底＋`#05111F` 模組；模組不能變藍）。結帳與票券詳情共用。
  - `venue-map.svg`：Zepp New Taipei 的戰術地圖（4 : 3，曜石灰底、藍圖格線、槍灰雙線道路、金屬藍虛線步行路線、六角場地標記；示意，不是真實比例）。右上角 x 460–800、y 0–200 只放街廓，活動細節把場地照片疊在這裡。
