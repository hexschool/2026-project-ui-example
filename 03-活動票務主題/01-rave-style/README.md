# 01｜地下電音派對：StageOne 城市現場

> 高對比＋深色（全黑底、極光綠、霓虹粉）。粗暴幾何切角票券，QR Code 覆蓋全息防偽動態線條，次文化張力強烈。（Notion 風格表原文）

概念是「凌晨兩點的入場口」：把 StageOne 想成地下派對門口那張入場清單。整個網站是一間關了燈的倉庫，只有兩種光源——冷的**極光綠**雷射代表「可以走、已確認」，熱的**霓虹粉**燈管代表「快沒了、要快」，兩種光永遠成對出現、互相拉扯。所有拿在手上的東西（票券、票種卡、活動卡、按鈕）都是被美工刀切掉一角的幾何片。大膽只花在一個地方：結帳頁付款成功後長出來的**切角全息電子票券**，QR Code 外框與覆蓋線條是全息防偽，全站只有這裡用全息。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（架構同 `../../01-電商主題/01-luxury-style/`）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。這是**單一深色主題**：直接把 Bootstrap 原本給淺色用的變數設成深色，不使用 `data-bs-theme`。
- **JS**：互動都交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的 8 個小功能（必做的只有活動類型篩選）。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西（字體從 Google Fonts 載入，離線時會退回系統字體）。

**要修改樣式**：

```bash
npm install        # 安裝 bootstrap、bootstrap-icons、sass，並把 Bootstrap JS 與圖示字型複製進專案
npm run watch      # 開發時：監看 scss/，存檔就重新編譯 css/style.css
npm run css        # 編譯一次
npm run build      # 交付前：重新複製 vendor 檔案＋編譯一次 CSS
npm run check      # 檢查 5 個頁面的 head、頁首、頁尾＋登入 Modal 是否與範本一致
npm run vendor     # 只重新複製 Bootstrap JS 與圖示字型（npm install 時會自動執行）
npm run images     # 重新生成圖片（需要已登入的 codex CLI，換圖時才用）
```

## 頁面

| 頁面 | 檔案 | 樣式 |
|---|---|---|
| 設計 Guideline | `guideline.html` | `scss/pages/_guideline.scss` |
| 首頁 | `index.html` | `scss/pages/_home.scss` |
| 活動列表 | `events.html` | `scss/pages/_events.scss` |
| 活動細節（含票種選擇與選位；以「午夜噪音祭 Vol.7」示範） | `event.html` | `scss/pages/_event.scss` |
| 購票確認與快速支付（含付款結果與電子票券，在頁內 `#result`） | `checkout.html` | `scss/pages/_checkout.scss` |

頁面上沒有列出所有頁面的導覽：依購票流程點進去即可（首頁 → 活動列表 → 活動細節 →「下一步：確認訂單」→ 結帳 →「確認付款」→ `#result`），Guideline 直接開 `guideline.html`。

- 活動細節只做一頁靜態示範，首頁與活動列表的每張活動卡都連到 `event.html`。
- 倒數、動態 QR Code、鎖位、付款中、付款結果都是**固定的 Notion 數字＋靜態畫面**，不用 JS 跑倒數。其他狀態放在頁面上虛線框的「設計稿狀態示意」：活動列表（篩選無結果）、活動細節（選位衝突、全部售罄、尚未開賣、活動取消、無劃位的活動）、結帳（剩 2 分鐘、逾時、實名制、付款中、付款成功、付款失敗）。
- 活動細節的票種數量與座位可以實際點選，「已選票券」的張數與小計會跟著變；結帳頁是另一個獨立範例（3 張、NT$ 5,974），兩頁的數字照 Notion，不互相同步。

## 檔案結構

```
01-rave-style/
├─ *.html                    ← 5 個頁面，每頁完整包含頁首、頁尾與登入 Modal
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的 8 個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 活動照片（AI 生成）、QR Code、示意地圖、Logo（SVG）
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫＋票務語意色
│  ├─ _base.scss             ← 全站基礎、切角（bevel、.cut、.cut-panel）、全息（.holo）、共用類別
│  ├─ components/            ← 頁首、頁尾、狀態小元件、搜尋列、活動卡、票種卡、座位圖、購票卡、結帳元件、電子票券、驗票畫面
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴：home-、events-、ev-、co-、gl-）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾＋登入 Modal 是否與範本一致
   └─ generate-images.mjs    ← 生圖腳本（STYLE 與 22 張圖的 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾、登入 Modal 每頁一份**：沒有元件系統，所以 5 個頁面各自完整寫一份。要改的時候先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check`。比對範圍從 `<footer>` 一路到 `</html>`，所以頁尾後面的登入 Modal 也會一起比對。每頁只有一處不同：頁首導覽的目前頁（`active`＋`aria-current="page"`）。活動細節標「活動列表」但不加 `aria-current`；結帳與 Guideline 不標目前頁。
- **`<body>` 的屬性不在比對範圍**：活動細節與結帳加了 `class="has-bottom-bar"`（< 992px 有底部固定列，要補 `padding-bottom`）；Guideline 加了 Bootstrap ScrollSpy 的 `data-bs-spy="scroll"`。
- **假資料直接寫在 HTML**：8 場活動、票種、座位、訂單都寫死在頁面裡（Notion 原文；Notion 沒寫的起價、狀態標籤、排序、座位、訂單、票號照 `../_wireframe/WIREFRAME_SPEC.md` §2.8～§2.9）。星期幾照 Notion 原文，沒有改成 2026 年的日曆。
- **JS**：`js/main.js` 的 8 件事：
  1. 頁首搜尋列展開後自動聚焦
  2. **活動列表「活動類型」篩選**（必做）：膠囊 `data-filter`、卡片 `data-category`，更新「共 N 場活動」與已套用標籤
  3. 其他篩選群組（日期、地區、票價、狀態）只切換選中樣式；「自訂日期區間」展開日期欄位
  4. 票種數量加減：更新「已選票券」、小計，處理 0 與上限（剩餘張數、每筆 4 張）的停用
  5. 座位點選：可選 ↔ 已選，更新 `aria-pressed`、`aria-label` 與「已選座位」
  6. 「加入追蹤」↔「已追蹤」
  7. 首頁熱門列的左右箭頭
  8. 電子票券輪播切換時更新「第 N 張，共 3 張」
  其餘（選單、搜尋列、登入 Modal、篩選 Offcanvas、FAQ Accordion、付款方式收合、查看明細、票券輪播、Guideline 目錄）都靠 Bootstrap 的 `data-bs-*` 屬性。
- **換行與空白**：活動名、短標題用 `.text-phrase`＋`<wbr>` 只在詞組之間換行；「島嶼獨白｜」這類名稱前半段用 `.text-nowrap` 包起來，`｜` 不會掉到下一行開頭。
- **表單**：設計稿沒有後端。搜尋列是 `<form action="events.html">`；結帳的「確認付款」是連到 `#result` 的連結，串接金流時改成送出，並在送出時把整個 `<fieldset>` 停用（見結帳頁的「付款中」狀態示意）。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、字體、間距、切角、元件）
3. `bootstrap/scss/bootstrap`：用上面的變數編譯出整套 Bootstrap
4. `bootstrap-icons`：圖示字型與 class（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字距、換行、焦點、區塊節奏、切角與全息，以及下表的共用類別
6. `components/*`：跨頁共用的元件
7. `pages/*`：各頁專屬樣式，class 一律加頁面前綴

原則是**先用 Bootstrap 的變數與工具類別**，真的做不到才寫自訂 CSS，而且自訂 CSS 只引用變數，不寫死色碼（SVG 檔與 Guideline 的色票示範例外）。想換風格，主要改 `_variables.scss`。

### 本風格的兩個形狀語言

- **切角（45°，右上＋左下對角）**：三階 `$cut-sm` 6px、`$cut-md` 14px、`$cut-lg` 28px。
  - 小控制項（按鈕、輸入框、標籤、膠囊、座位）用 `bevel()` mixin：CSS 的 `corner-shape: bevel`，框線與焦點環會跟著斜邊走；不支援的瀏覽器（目前 Safari、Firefox）退回直角，不會變成圓角。
  - 大面積（票券、票種卡、活動卡、面板、圖片）用 `clip-path`，所有瀏覽器都一樣：`.cut` 直接切元素；`.cut-panel` 用兩層偽元素畫出「斜邊也有框線」的切角，狀態只改 `--cut-line`、`--cut-fill`、`--cut-line-width`。clip-path 會切掉焦點環，所以可聚焦的元素放在裡面，不切 `<a>`、`<button>` 本身。
- **全息（只用在電子票券）**：`$holo-gradient`（綠 → 青 → 紫 → 粉）。QR 外框 18 秒來回流動、QR 覆蓋細斜線 24 秒緩慢平移，用 mask 挖掉三個定位方塊、`mix-blend-mode: multiply` 讓深色模組維持全黑。`prefers-reduced-motion: reduce` 時全部停住，變成靜態紋理。

### 共用類別

用法與示範都在 `guideline.html`。

| 類別 | 用途 | 位置 |
|---|---|---|
| `.cut`（`.cut-sm`、`.cut-lg`）、`.cut-panel`、mixin `cut-panel`、mixin `bevel()` | 切角（見上方） | `_base.scss` |
| `.holo` | 全息漸層底（緩慢流動，減少動態時靜止） | `_base.scss` |
| `.section`、`.section-alt`、`.section-heading` | 區塊上下留白 64／96px、機櫃黑底色區塊（裡面的 `.cut-panel` 自動改全黑底）、標題列（左標題＋右連結） | `_base.scss` |
| `.page-header`、`.page-lead` | 活動列表、Guideline 的頁首區：麵包屑 → h1 → 說明 | `_base.scss` |
| `.text-phrase` | 只在空白、標點與 `<wbr>` 處換行 | `_base.scss` |
| `.price`、`.num`、`.font-display` | 價格（Unbounded 等寬數字）、小數字（等寬）、英數大字 | `_base.scss` |
| `.btn-text`、`.btn-icon`、`.btn.is-loading` | 文字按鈕（44px 觸控高度）、方形圖示按鈕、載入中（鎖定） | `_base.scss` |
| `.alert-action` | 圖示＋說明＋按鈕的提示框（選位衝突、逾時、付款失敗） | `_base.scss` |
| `.demo-state`（`-tag`、`-title`、`-label`） | 設計稿狀態示意：虛線框＋淡斜紋＋標籤 | `_base.scss` |
| `.empty-state` | 空狀態：圖示＋標題＋說明＋動作 | `_base.scss` |
| `.tag`（`.tag-hot`、`.tag-free`、`.tag-scarce`、`.tag-soon`）、`.tag-list` | 狀態標籤：類別、熱賣中、含免費票種、即將完售（粉色實心＋火焰）、即將開賣／已售罄（虛線框） | `components/_status.scss` |
| `.remain`（`.is-scarce`、`.is-sold-out`） | 剩餘票數進度條：文字＋進度條＋顏色三者並用 | `components/_status.scss` |
| `.countdown`、`.countdown-box`（`.is-warn`、`.is-expired`）、`.countdown-num` | 倒數 3 態，不閃爍 | `components/_status.scss` |
| `.date-chip`、`.qty`、`.chip`（`aria-pressed`） | 日期方塊、數量加減器、篩選膠囊 | `components/_status.scss` |
| `.search-bar` | 搜尋列（首頁、活動列表） | `components/_search-bar.scss` |
| `.scene-card`、`.feat-card`、`.event-card` | 情境卡、熱門卡、活動列表卡 | `components/_event-card.scss` |
| `.ticket-type`（`.is-selected`、`.is-scarce`、`.is-sold-out`、`.is-upcoming`）、`.selection` | 票種卡 5 態、已選票券 | `components/_ticket-type.scss` |
| `.seat-map`、`.seat`（`aria-pressed`、`.is-sold`、`.is-blocked`） | 座位圖與座位 4 態 | `components/_seat-map.scss` |
| `.buy-card`、`.info-list`、`.bottom-bar`、`.has-bottom-bar` | 購票卡、快速資訊、底部固定列 | `components/_buy-card.scss` |
| `.stepper`、`.order-summary`、`.pay-quick`、`.pay-methods`、`.result-panel` | 結帳步驟列、訂單明細、付款方式、付款結果 | `components/_checkout-parts.scss` |
| `.eticket`（`.is-used`、`.is-expired`、`.is-cancelled`）、`.qr`、`.qr-holo` | 招牌：切角全息電子票券與 QR Code | `components/_eticket.scss` |
| `.scan-screen`（`.is-ok`、`.is-fail`） | 驗票回饋畫面（主辦方端，Guideline 示範） | `components/_validation.scss` |

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 面 | 全黑 `$blackout #000000`（頁面底，真正的黑）、機櫃黑 `$rack #111114`（卡片、輸入框、頁尾、交替區塊）、舞池灰 `$floor #1D1D22`（hover、浮起的面、進度條軌道） |
| 線 | 掃描線 `$line #2E2E36`（裝飾）、深掃描線 `$line-strong #4A4A55`（虛線框、停用）、控制項框線 `$control #74747F`（4.6:1，非文字 3:1） |
| 文字 | 頻閃白 `$strobe #F4F4F6`（19.1:1）、煙霧灰 `$haze #A8A8B3`（8.9:1）、暗場灰 `$dim #7E7E8A`（placeholder、停用，5.2:1） |
| 兩種光 | 極光綠 `$aurora #4DFF88`（主要按鈕、選中、成功、焦點環；上放全黑字 16.0:1）、霓虹粉 `$neon #FF3D9E`（稀缺、倒數警示；6.4:1，粉底上只放全黑字） |
| 其他 | 紫外青 `$uv #3DE6FF`（資訊）、紫外紫 `$violet #A07CFF`（只在全息漸層）、雷射紅 `$laser #FF5B3A`（錯誤、付款失敗、驗票失敗；6.8:1） |
| 票務語意 | 即將完售＝霓虹粉＋火焰＋文字＋粗進度條；售罄＝暗場灰＋斜線紋＋刪除線；選中＝極光綠 2px 框＋勾；倒數警示＝整列霓虹粉框＋警示圖示；驗票成功／失敗＝極光綠／雷射紅大面積＋全黑字＋✓／✕ |
| 字體 | Unbounded（品牌字、英數大字、價格、倒數、票號；等寬數字）＋ Noto Sans TC（中文標題 900、內文 400、行高 1.75）。不用襯線、不用全大寫英文眉標 |
| 切角 | 6／14／28px，固定右上＋左下；沒有圓角（只有狀態圓點、radio、主辦方 Logo 是圓的） |
| 陰影 | 黑底上不靠陰影分層，用 1px 掃描線＋底色差；只有對話框與底部固定列有深陰影；選中的票種卡有淡淡的極光綠光暈 |
| 焦點 | 2px 黑色間隙＋2px 極光綠外圈 |
| 動態 | 只有全息票券的緩慢流動與情境卡 hover；`prefers-reduced-motion` 時全部停止。Hero 主標與活動 H1 的綠／粉色散陰影是靜態的 |
| 頁首 | 高 72px（`$site-header-height`）；sticky 元素 top 96px（`$sticky-top-offset`） |

完整規範請看 `guideline.html`。改色時，Guideline 的色票 hex、對比度、`images/` 裡 SVG（Logo、favicon、QR Code、示意地圖）的色碼也要一起改，清單見上一層 [`../README.md`](../README.md) 的「換色時同步檢查」。

## Notion 沒寫、本風格自訂的介面文字

依 `WIREFRAME_SPEC.md` §0.2，下列是介面需要但 Notion 沒有的字（多數沿用 wireframe 的用詞）：

- 頁首與搜尋：「搜尋」「關鍵字」「日期」「地區」「選擇日期」「全部地區」「搜尋活動」、登入 Modal 的「Email」「密碼」「登入」「註冊新帳號」
- 活動列表：「探索活動」「篩選」「篩選與排序」「清除全部」「共 8 場活動」「套用篩選（顯示 8 場）」「票價」「票種」「追蹤／已追蹤」「立即報名」（城市夜跑）、「開始日期」「結束日期」
- 活動細節：「選擇座位」「舞台」「A 區」「11 排」「可選／已選／已售出／不可選」「已選座位」「已選票券」「已完售」「重新選位」、示意地圖上的「步行 8 分鐘」「公車宏匯廣場站」「北」
- 結帳：「查看明細」「應付總額」「票種明細」「票券小計」「平台服務費」、信用卡欄位 placeholder、ATM 展開後的「確認付款後顯示轉帳帳號與繳費期限。」、「第 1 張，共 3 張」
- Guideline 的說明文字與「設計稿狀態示意」的情境說明

## 圖片

`images/` 的 22 張照片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名與 02、04 相同（清單見 [`../IMAGES.md`](../IMAGES.md)）。調性是同一位夜間攝影師：只用現場的光，畫面大部分是真正的黑，顏色只出現在光源與反光（極光綠對霓虹粉），沒有可辨識的臉、沒有文字與招牌。替換時保持相同檔名即可。

不是照片的圖形都是手寫的 SVG：`logo.svg`／`favicon.svg`（切角票券標誌）、`qr-t-4471-01～03.svg`（真的 QR Code，內容 `STAGEONE:T-4471-0N`，25×25 模組、深色模組＋淺色底）、`venue-map.svg`（場地示意地圖）。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`：

```bash
npm run images                                                      # 產生缺少的圖片
node scripts/generate-images.mjs --only hero-live-crowd,scene-music # 只重做指定的圖
node scripts/generate-images.mjs --force                            # 全部重做
```

換成其他風格時，改腳本裡的 `STYLE`（整組圖的共同調性）與各張描述即可。
