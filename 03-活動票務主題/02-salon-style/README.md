# 02｜古典藝文沙龍：StageOne 城市現場

> 淺色系＋暖色調（米卡其、復古赭紅、青銅綠）。擬真古典打孔票根造型，座位圖採用細線工筆感設計，適合交響樂與歌劇。（Notion 風格表原文）

概念是「音樂廳的演出季節目冊」：把售票平台排成一本節目冊。米白紙張、墨褐鉛字、雕版細線分隔，赭紅是蓋在節目冊上的重點印記，青銅綠是鋪在桌上的綠絨。內容（午夜噪音祭等 8 場活動）照 Notion 不改，只是用節目冊的語言印出來。大膽只花在兩個招牌元素：

- **打孔票根**（`.ticket`）：半圓缺口＋撕線圓點＋票根，外框是沿著挖過的形狀描出來的細線。電子票券、票種卡、首頁熱門卡、購票卡、已選票券、訂單明細、Hero 倒數小卡都是同一個元件；票券「已使用」時票根會被打一個孔、蓋上戳記。
- **工筆座位圖**（`.seatmap`）：雙細線的舞台弧＋斜線陰影，座位是 1px 細線畫的椅子，每排沿著舞台排成弧形、椅子微微轉向舞台。4 種座位狀態各有符號（勾、叉、斜線紋），不只靠顏色。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（架構同 `../../01-電商主題/01-luxury-style/`）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。單一淺色主題，不使用 `data-bs-theme`。
- **JS**：互動交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的 10 個小功能（必做的是活動列表的「活動類型」篩選）。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西（字體從 Google Fonts 載入，離線時會退回系統的襯線字）。

**要修改樣式**：

```bash
npm install        # 安裝 bootstrap、bootstrap-icons、sass，並把 Bootstrap JS 與圖示字型複製進專案
npm run watch      # 開發時：監看 scss/，存檔就重新編譯 css/style.css
npm run css        # 編譯一次
npm run build      # 交付前：重新複製 vendor 檔案＋編譯一次 CSS
npm run check      # 檢查 10 個頁面的 head、頁首、頁尾、登入 Modal 是否與範本一致
npm run vendor     # 只重新複製 Bootstrap JS 與圖示字型（npm install 時會自動執行）
npm run images     # 重新生成圖片（需要已登入的 codex CLI，換圖時才用）
```

## 頁面

| 頁面 | 檔案 | 樣式 | 頁首目前頁 |
|---|---|---|---|
| 設計 Guideline | `guideline.html` | `scss/pages/_guideline.scss` | 無 |
| 首頁 | `index.html` | `scss/pages/_home.scss` | 首頁 |
| 活動列表 | `events.html` | `scss/pages/_events.scss` | 活動列表 |
| 活動細節（含票種選擇與選位；以「午夜噪音祭 Vol.7」示範） | `event.html` | `scss/pages/_event.scss` | 活動列表（不加 `aria-current`） |
| 購票確認與快速支付（含付款結果與電子票券，頁內 `#result`） | `checkout.html` | `scss/pages/_checkout.scss` | 無 |
| 註冊（2026-11 補） | `register.html` | `scss/pages/_register.scss` | 無 |
| 我的票券（2026-11 補） | `tickets.html` | `scss/pages/_member.scss`＋`_tickets.scss` | 無 |
| 電子票券詳情（以「午夜噪音祭 Vol.7」的 3 張票示範，2026-11 補） | `ticket.html` | `scss/pages/_ticket-detail.scss` | 無 |
| 購票紀錄（含申請退票，2026-11 補） | `orders.html` | `scss/pages/_member.scss`＋`_orders.scss` | 無 |
| 追蹤的主辦方（2026-11 補） | `follows.html` | `scss/pages/_member.scss`＋`_follows.scss` | 無 |

頁面上沒有列出所有頁面的導覽：依購票流程點進各頁（首頁 → 活動列表 → 活動細節 →「下一步：確認訂單」→ 結帳 →「確認付款」→ `#result`），Guideline 直接開 `guideline.html`。首頁與活動列表的每張活動卡都連到 `event.html`。

2026-11 補的 5 頁從這裡進去（頁首沒有對應項目，所以都不標目前頁）：

- 頁首「登入／註冊」開啟登入 Modal →「註冊新帳號」→ `register.html` →「完成註冊」回首頁；註冊頁的「已經有帳號？登入」再開啟登入 Modal。
- 頁尾「購票者」欄的「我的票券」→ `tickets.html`、「購票紀錄」→ `orders.html`、「追蹤的主辦方」→ `follows.html`；付款結果（`checkout.html#result`）的「查看我的票券」→ `tickets.html`。
- 我的票券的「查看票券」→ `ticket.html`（4 張都連到午夜噪音祭這一頁）；購票紀錄的「查看票券」→ `tickets.html`、「申請退票」→ 本頁 `#refund`；電子票券詳情的「申請退票」→ `orders.html#refund`。追蹤的主辦方的「下一場」小票券整張連到 `event.html`。

動態功能（票價調漲倒數、鎖位倒數、結帳保留倒數、動態 QR Code、付款中、付款結果）都是**固定的 Notion 數字＋靜態畫面**，不用 JS 跑倒數。其他狀態放在各頁底部虛線框的「設計稿狀態示意」：

| 頁面 | 設計稿狀態示意 |
|---|---|
| 活動列表 | 篩選後沒有活動時 |
| 活動細節 | 有人先付款時（選位衝突）、其他場次會出現的購票卡狀態（全部售罄、尚未開賣、活動取消、無劃位的活動） |
| 結帳 | 保留時間剩 2 分鐘時、保留時間到了時、實名制活動、按下確認付款等待回應時（付款中）、按下確認付款之後（付款成功＋電子票券輪播、付款失敗） |
| 註冊 | 欄位有錯誤時（手機號碼、Email 已註冊、密碼、同意條款 4 則錯誤同時出現） |
| 我的票券 | 還沒有任何票券時、主辦方取消活動時（「已使用」「已過期」兩組是真的分頁，點分頁就看得到） |
| 電子票券詳情 | 入場驗票之後、活動結束、沒有入場時、主辦方取消活動時（3 欄並排） |
| 購票紀錄 | 還沒有購票紀錄時、主辦方取消活動、退款處理中時 |
| 追蹤的主辦方 | 還沒有追蹤任何主辦方時 |

## 檔案結構

```
02-salon-style/
├─ *.html                    ← 10 個頁面（2026-11 補了 5 頁），每頁完整包含頁首、頁尾與登入 Modal
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的 10 個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 22 張活動照片（AI 生成，節目冊劇照調性）、favicon.svg
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫＋票務語意色＋招牌元素尺寸
│  ├─ _base.scss             ← 全站基礎與票務共用小元件（狀態標籤、剩餘條、倒數、加減器…）
│  ├─ components/            ← 頁首、頁尾、★打孔票根、★座位圖、搜尋列、活動卡、票種卡、購票卡、結帳元件
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴：home-、events-、ev-、co-、gl-；2026-11 補的頁：reg-、tkt-、ord-，會員頁共用 mc-）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾＋登入 Modal 是否與範本一致、目前頁標示是否正確
   └─ generate-images.mjs    ← 生圖腳本（所有圖片的 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾、登入 Modal 每頁一份**：沒有元件系統，所以 10 個頁面各自完整寫一份。要改時先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check`。它比對三段：`<head>`、頁首（跳至主要內容 → `</header>`）、頁尾之後到 `</html>`（含登入 Modal 與 script），並檢查目前頁：`index.html`、`events.html` 標自己（加 `aria-current="page"`）；`event.html` 標「活動列表」但不加 `aria-current`；`checkout.html`、`guideline.html` 與 2026-11 補的 5 頁（`register.html`、`tickets.html`、`ticket.html`、`orders.html`、`follows.html`）不標。
- **底部固定列**：活動細節的購票列與結帳的付款列（992px 以下）放在 `<main>` 的最後面，不要放在頁尾之後（否則 `npm run check` 會判定與範本不同）。有固定列的頁面在 `<body>` 加 `class="has-bottom-bar"`，補上底部留白。
- **假資料直接寫在 HTML**：數字照主題的 `WIREFRAME_SPEC.md` §2.8～§2.9。活動細節的「已選 2 張 ‧ 小計 NT$ 3,000」與結帳的「3 張、NT$ 5,974」是 Notion 的兩個獨立範例，不要改數字湊成一致；星期幾照 Notion 原文（2025 年的日曆），不修正。結帳頁的訂單明細寫了兩份（992px 以上的右欄、以下的「查看明細」），改數字時兩份要一起改。
- **JS（`js/main.js`）**：①頁首搜尋列展開後聚焦 ②**活動類型篩選**（`data-type-filter`、`data-filter`、`data-category`，更新「共 N 場活動」與已套用標籤）③其他篩選群組只切換選中樣式 ④票種數量加減與「已選票券」小計（整筆最多 4 張）⑤座位點選 ⑥「追蹤」切換 ⑦熱門列左右箭頭 ⑧選「信用卡付款」才展開卡號表單 ⑨**我的票券的分頁**（`data-ticket-tabs`、`data-filter`、`data-status`：切換 `aria-pressed`，只顯示該組票券；沒有 JS 時全部票券都看得到）⑩「取消追蹤」切換成「追蹤」（`data-unfollow`，只換文字與圖示，不移除這一列）。選單、搜尋列、篩選抽屜、登入 Modal、FAQ、電子票券輪播、電子票券詳情的 3 張票切換（Bootstrap pill）都靠 Bootstrap 的 `data-bs-*`。
- **QR Code**：`checkout.html` 與 `guideline.html` 的 QR Code 是用 `qrcode` 套件產生的真實 25 × 25（Version 2）圖形，內容就是票號（`T-4471-01`～`03`），轉成 SVG 路徑寫在 HTML 裡；顏色由 `.qr-bg`、`.qr-modules` 控制，一律深色模組＋淺色底。
- **換行與空白**：活動名與短標題用 `.text-phrase`＋`<wbr>`，只在詞組之間換行；倒數數字整組放在 `.countdown-digits`（不換行）。
- **表單**：設計稿沒有後端。登入 Modal 的「登入」只關閉 Modal，「註冊新帳號」連到 `register.html`；結帳的「確認付款」是連到 `#result` 的連結。註冊頁用 `<form action="index.html">` 以 GET 回首頁，所有欄位都不加 `name`（網址不會出現密碼與個資）；退票申請的「送出退票申請」是 `type="button"`（第二階段）。各頁表單上方的註解寫了串接後端時要怎麼改。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、字體、間距、圓角、元件、票務語意色、招牌元素尺寸）
3. `bootstrap/scss/bootstrap`：用上面的變數編譯出整套 Bootstrap
4. `bootstrap-icons`：圖示字型與 class（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字體與數字、區塊節奏、按鈕、焦點，以及票務共用小元件
6. `components/*`：頁首、頁尾、打孔票根（`_ticket.scss`）、座位圖（`_seatmap.scss`）、搜尋列、活動卡、票種卡、購票卡、結帳元件
7. `pages/*`：各頁專屬樣式

原則是**先用 Bootstrap 的變數與工具類別**，做不到才寫自訂 CSS，而且自訂 CSS 只引用變數，不寫死色碼。想換風格，主要改 `_variables.scss`。

### 共用類別

| 類別 | 用途 | 位置 |
|---|---|---|
| `.section`、`.section-alt`、`.section-dark`、`.section-heading`（`-split`） | 區塊上下留白 48／88px、米卡其底、綠絨底；區塊標題上方一道雕版雙線 | `_base.scss` |
| `.page-header`、`.page-lead` | 活動列表、Guideline 的頁首區：麵包屑 → H1 → 說明 | `_base.scss` |
| `.text-phrase` | 活動名與短標題只在空白與 `<wbr>` 處換行 | `_base.scss` |
| `.num`、`.price`、`.price-lg` | EB Garamond 的齊線等寬數字：金額、倒數、票號、座位號 | `_base.scss` |
| `.img-frame`（`.is-framed`）＋ `.ratio-16x9` 等 | 固定比例圖框；`.is-framed` 內側加一道裱框細線 | `_base.scss` |
| `.btn-outline-paper`、`.btn-text`、`.btn-icon`、`.btn.is-loading` | 照片／綠絨上的次要按鈕、文字按鈕（44px 高）、圖示按鈕、付款中鎖定 | `_base.scss` |
| `.tag`（`.is-status`、`.is-scarce`、`.is-muted`、`.is-info`） | 狀態標籤：類別、熱賣中、即將完售（赭紅實心＋火焰）、已售罄（虛線）、尚未開賣 | `_base.scss` |
| `.remain`（`.is-scarce`、`.is-soldout`） | 剩餘票數條：顏色＋文字＋進度條三者並用 | `_base.scss` |
| `.countdown`（`.is-warn`、`.is-expired`、`.is-info`）＋ `.countdown-digits` | 倒數：一般、警示、逾時；只換數字不閃爍 | `_base.scss` |
| `.qty` | 數量加減器（44 × 44） | `_base.scss` |
| `.date-chip`、`.seal` | 日期方塊、細線雙圈的圖示章 | `_base.scss` |
| `.demo-state`（`-tag`、`-title`、`-stage`、`-label`）、`.empty-state` | 設計稿狀態示意（虛線分隔）、空狀態 | `_base.scss` |
| ★ `.ticket`（`.is-vertical`、`.is-selected`、`.is-soldout`、`.is-upcoming`）＋ `.ticket-main`、`.ticket-stub`（`.is-tinted`） | 打孔票根；`@include ticket-horizontal`／`ticket-vertical` 切換方向 | `components/_ticket.scss` |
| ★ `.eticket`（`.is-used`、`.is-expired`、`.is-cancelled`）、`.ticket-stamp`、`.qr-frame`、`.qr` | 電子票券 4 態、戳記、QR Code | `components/_ticket.scss` |
| ★ `.seatmap`、`.seat`（`[aria-pressed="true"]`、`.is-sold`、`.is-blocked`）、`.seat-legend` | 工筆座位圖與座位 4 態 | `components/_seatmap.scss` |
| `.search-bar` | 首頁、活動列表的搜尋列 | `components/_search-bar.scss` |
| `.scene-card`、`.featured-card`、`.event-card`、`.btn-follow` | 情境卡、熱門卡、活動列表卡、追蹤按鈕 | `components/_event-card.scss` |
| `.ticket-type` | 票種卡 5 態（576px 以下票根換到下方） | `components/_ticket-type.scss` |
| `.buy-card`、`.info-card`、`.selection-summary`、`.mobile-buy-bar`、`.has-bottom-bar` | 購票卡、快速資訊、已選票券、底部固定列 | `components/_buy-card.scss` |
| `.co-stepper`、`.steps`、`.order-summary`、`.result-panel` | 結帳步驟列、訂單明細、付款結果 | `components/_checkout.scss` |
| `.mc-head`（`.has-tabs`）、`.mc-body`、`.mc-count` | 會員頁（我的票券、購票紀錄、追蹤的主辦方）的米卡其頁首區、內容區留白、「共 6 筆訂單」結果列（2026-11 補，Guideline 沒有） | `pages/_member.scss` |
| `.tag.is-valid`、`.tag.is-danger`、`.tag.is-warn`、`.tag.is-owned` | `.tag` 的補充變體：有效／已付款（青銅綠框）、活動已取消／付款失敗（胭脂框）、退款處理中（琥珀淡底）、已購票（赭紅淡底）；已使用用一般 `.tag`，已過期、已退款用 `.is-muted`（2026-11 補） | `pages/_member.scss` |
| `.reg-wrap`、`.reg-ticket`、`.reg-main`、`.reg-guarantee`（`-title`、`-list`）、`.reg-field`、`.reg-agree`、`.reg-terms`、`.reg-switch`、`.reg-inline-login`、`.reg-demo` | 註冊（2026-11 補）：置中 960px，整頁是一張橫式打孔票券，正券＝表單（7）、票根＝入場保障（5，米卡其淡底＋右下角防偽細紋）；< 992px 換成直式 | `pages/_register.scss` |
| `.ticket-tabs`、`.ticket-tab`（`[aria-pressed="true"]`）、`.ticket-tab-count` | 票券分頁 TicketTabs（2026-11 補）：像節目冊的索引標籤，貼在頁首區下緣；目前分頁＝米白紙底＋上緣赭紅線，和下方頁面接成一張紙 | `pages/_tickets.scss` |
| `.ticket-list`、`.ticket-card`（`.is-past`、`.is-used`、`.is-cancelled`）＋ `-media`、`-body`、`-tags`、`-title`、`-facts`、`-order`、`-note`、`-alert`、`-date`（`-ym`、`-day`、`-wd`）、`-btn` | 票券卡 TicketCard（2026-11 補）：一列一張橫式打孔票券，正券＝縮圖＋資訊（≥ 1200px 時間、地點、票種排成三格），票根＝日期（裝飾，`aria-hidden`）＋「查看票券」；`.is-past` 虛線框、不浮起、縮圖去色，`.is-used` 票根多打一個孔；< 768px 換成直式 | `pages/_tickets.scss` |
| `.tkt-head`、`.tkt-eyebrow`、`.tkt-title`、`.tkt-meta`、`.tkt-switch`／`.tkt-switch-btn`、`.tkt-info`、`.tkt-actions`、`.tkt-refund-note`、`.tkt-entry`（`-title`、`-facts`、`-address`、`-sub`）、`.tkt-route`、`.tkt-nav`、`.tkt-rules`、`.tkt-demos` | 電子票券詳情（2026-11 補）：米卡其滿寬底色 5 : 7，左＝3 張票切換（Bootstrap pill）＋電子票券（重用 `.eticket`，正券下半加票號、票種、座位、持票人四格）＋操作，右＝入場資訊（象牙紙＋雕版內框，像節目冊的「觀眾須知」頁，入場須知用 01～06 的曲目序號）；狀態示意裡已過期的票也蓋「已過期」戳記（`.eticket.is-expired .ticket-stamp`，Guideline 沒有）；「主辦方取消活動時」的內容寬度比照正式左欄 | `pages/_ticket-detail.scss` |
| `.order-list`、`.order-card`（`-head`、`-no`、`-caption`、`-time`、`-event`、`-name`、`-alert`、`-note`、`-total`、`-meta`、`-invoice`、`-actions`）、`.order-lines`（`.is-fee`）、`.order-lines-sub` | 訂單卡 OrderCard（2026-11 補）：一列一張橫式打孔票券，正券＝訂單編號＋狀態 → 活動 → 票種明細（點線引導），票根＝總額 → 付款方式、電子發票 → 按鈕；< 768px 換成直式 | `pages/_orders.scss` |
| `.ord-refund-title`、`.ord-refund-lead`、`.refund-form`、`.refund-field`、`.refund-rule`、`.refund-tickets`、`.refund-ticket`、`.refund-calc`（`.is-total`）、`.refund-calc-title`、`.refund-calc-note`、`.refund-foot` | 退票申請 RefundForm（2026-11 補）：米卡其滿寬區 4 : 8，表單是一張橫式打孔票券，正券＝訂單、這場的退票規則、要退的票券（整列可點，勾選後赭紅框）、原因，票根＝退款試算＋「送出退票申請」 | `pages/_orders.scss` |
| `.follow-list`、`.follow-item`、`.follow-id`、`.follow-logo`（`.is-cjk`）、`.follow-name`、`.follow-intro`、`.follow-foot`、`.follow-upcoming`、`.follow-btn`、`.follow-next-label` | 主辦方名冊 OrganizerCard（2026-11 補）：一列一位、列與列之間是雕版雙線（不包卡片框），≥ 992px 5 : 7；字母章沿用活動細節的 `.organizer-logo` 縮小一號；HTML 順序是主辦方 → 下一場 → `.follow-foot`（取消追蹤），≥ 992px 用 `grid-template-areas` 把取消追蹤放回左欄 | `pages/_follows.scss` |
| `.next-event`（`-media`、`-body`、`-name`、`-meta`、`-price`） | 下一場小票券 NextEventCard（2026-11 補）：整張是連到 `event.html` 的 `<a class="ticket">`，票根＝票價（＋已購票）；hover／focus 只換描邊顏色與名稱底線；< 576px 換成直式 | `pages/_follows.scss` |

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 紙 | 象牙紙 `$vellum #FBF8F1`（卡片、票券、輸入框）、米白紙 `$parchment #F3EDE0`（頁面底）、米卡其 `$khaki #E6DBC4`（交替區塊、票根）、綠絨 `$bronze-night #24372E`（本週熱門、頁尾） |
| 墨 | 墨褐 `$ink #2A211A`（13.5:1）、褪墨 `$ink-muted #66574A`（6.0:1）、淡墨 `$ink-faint #76665A`（placeholder，對象牙紙 5.2:1）、沙卡其 `$sand #E2C9A6`（綠絨上的小字，7.9:1） |
| 品牌 | 復古赭紅 `$ochre #9C3D24`（主要按鈕、選中、稀缺，5.8:1）、深赭 `$ochre-deep #7E2F1B`（hover）、青銅綠 `$verdigris #3B5A4A`（成功、熱賣中，6.6:1） |
| 狀態 | 琥珀 `$amber #7A4F08`（警示）、胭脂 `$carmine #8E2433`（錯誤）、石板藍 `$slate #3F5568`（資訊、尚未開賣） |
| 線 | 雕版細線 `$rule #CDBFA5`、深雕版線 `$rule-strong #B3A284`（裝飾）、表單框線 `$control #7F6E5A`（4.2:1） |
| 票務語意 | 稀缺＝赭紅實心標籤＋火焰；售罄＝褪墨＋刪除線＋虛線；選中＝赭紅實心＋勾；倒數警示＝琥珀＋淡琥珀底；驗票成功／失敗＝青銅綠／胭脂滿版＋大圖示＋文字 |
| 字體 | EB Garamond（英數、價格、倒數、票號；齊線＋等寬數字）＋ Noto Serif TC（中文標題與內文），全站襯線；字重 400／600。不用全大寫英文眉標 |
| 圓角 | 2px（標籤、座位）、3px（按鈕、輸入框）、4px（卡片、票券）、膠囊（篩選、狀態標籤） |
| 陰影 | 幾乎不用；票券是沿形狀描邊的 `drop-shadow`，浮起元件（搜尋列、底部固定列、對話框）用暖褐 `$box-shadow` |
| 按鈕 | 主要：赭紅底＋象牙紙字＋內側一道象牙細線（雕版雙線）；次要：墨褐細框；停用：米卡其底＋虛線框（不靠透明度） |
| 焦點 | 赭紅 2px 外框（按鈕是象牙紙間隙＋赭紅外圈）；綠絨與照片上改用沙卡其 |
| 頁首 | 72px（`$site-header-height`），sticky 位移 104px（`$sticky-top-offset`） |
| 招牌尺寸 | 缺口半徑 `$stub-notch` 10px、撕線間距 `$stub-perf-gap` 8px、座位 `$seat-size` 32px、弧高 `$seat-arc` 18px |
| 動態 | 情境卡 hover 圖片微放大（場次與票價常駐顯示，不在 hover 時浮現）；`prefers-reduced-motion` 時全部關閉。倒數不閃爍 |

完整規範請看 `guideline.html`。改色時，Guideline 的色票 hex、對比度與其他寫死色碼的地方（`images/favicon.svg`、`<meta name="theme-color">`）也要一起改，清單見上一層 [`../README.md`](../README.md) 的「換色時同步檢查」。

## 介面文字（Notion 沒寫、本風格補的）

照主題 `WIREFRAME_SPEC.md` 的用詞：「選擇座位」「舞台」「已選票券」「查看明細」「快速資訊」「篩選與排序」「套用篩選（顯示 8 場）」「清除全部」「清除篩選」「重新選位」「追蹤主辦方」「繼續編輯」。本風格另外補的：座位圖上方的「A 區」、熱門列箭頭的 `aria-label`「上一個／下一個」、電子票券輪播的「第 1 張，共 3 張」與「上一張票券／下一張票券」、結帳付款方式清單的小標「其他方式」（Notion 欄位名）。

2026-11 補的 5 頁用詞照 `WIREFRAME_SPEC.md` §2.9（註冊的欄位說明、「入場保障」3 項與錯誤訊息；「即將到來／已使用／已過期」「查看票券」；「加入行事曆」「轉贈」「申請退票」「怎麼去？」「開啟導航」「入場須知」；「票種明細」「總額」「付款方式」「電子發票」「下載」「退款試算」「預估退款」「送出退票申請」；「即將舉辦 1 場活動」「下一場」「取消追蹤」，以及各頁空狀態）。本風格另外補的：電子票券詳情的眉標「電子票券」與入場須知的序號 01～06（裝飾）、票券卡票根上的年月與星期（裝飾，`aria-hidden`）、票券分頁數字的螢幕閱讀器文字「（2 場）」、「取消追蹤」按鈕裡給螢幕閱讀器的主辦方名稱。

## 圖片

`images/` 的 22 張圖片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名照主題的 `IMAGES.md`（3 套風格相同）。調性是「音樂廳節目冊裡的劇照」：暖色鎢絲燈、低彩度、陰影偏暖棕而不是純黑、細緻底片顆粒。人物都是背影、剪影或逆光，沒有文字與招牌。替換時保持相同檔名即可，不需改程式。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`：

```bash
npm run images                                              # 產生缺少的圖片
node scripts/generate-images.mjs --only hero-live-crowd     # 只重做指定的圖
node scripts/generate-images.mjs --force                    # 全部重做
```

換成其他風格時，改腳本裡的 `STYLE`（整組圖的共同調性）與各張描述即可。
