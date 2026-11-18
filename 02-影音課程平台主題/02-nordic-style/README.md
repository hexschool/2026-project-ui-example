# 02｜北歐明亮課室：Craftory 手感工藝線上學院

> 淺色系＋冷色系（雪白、冰河藍、低飽和灰）。章節目錄與隨堂筆記側欄採用輕量卡片，留白寬裕，適合長時間白天學習。

概念是「北歐大窗邊的白色書桌」：雪白頁面底、白色輕卡片浮在上面，冰河藍點綴，白天看一整個下午也不累。大膽只花在兩處：**主圖像一扇窗**（首頁首屏的高大圓角窗、課程詳情與學習頁的播放器卡框），以及**輕卡片側欄**（學習頁的進度卡與章節卡是一疊分開的白卡）。其他地方極度克制：不用分隔線、不用裝飾色帶，層級只靠留白，以及白卡浮在雪白底上的那一點點高度（髮絲線＋很淡的雙層陰影）。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（與 `01-電商主題` 各風格相同架構）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。這是**單一淺色主題**（`$enable-dark-mode: false`），作業系統切到深色模式時畫面不會跟著變。
- **JS**：互動都交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的六個小功能。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西。

**要修改樣式**：

```bash
npm install        # 安裝 bootstrap、bootstrap-icons、sass，並把 Bootstrap JS 與圖示字型複製進專案
npm run watch      # 開發時：監看 scss/，存檔就重新編譯 css/style.css
npm run css        # 編譯一次
npm run build      # 交付前：重新複製 vendor 檔案＋編譯一次 CSS
npm run check      # 檢查 10 個頁面的 head、頁首、頁尾（與登入對話框）是否與範本一致
npm run vendor     # 只重新複製 Bootstrap JS 與圖示字型（npm install 時會自動執行）
npm run images     # 重新生成圖片（需要已登入的 codex CLI，換圖時才用）
```

## 頁面

| 頁面 | 檔案 | 樣式 | 狀態 |
|---|---|---|---|
| 設計 Guideline | `guideline.html` | `scss/pages/_guideline.scss` | 完成 |
| 首頁 | `index.html` | `scss/pages/_home.scss` | 完成 |
| 課程列表 | `courses.html` | `scss/pages/_courses.scss` | 完成 |
| 課程詳情（以「從零開始的手捏陶」示範） | `course.html` | `scss/pages/_course.scss` | 完成 |
| 課程播放／學習頁（手捏陶 3-2） | `learn.html` | `scss/pages/_learn.scss` | 完成 |
| 註冊 | `register.html` | `scss/pages/_register.scss` | 完成 |
| 購買課程 | `checkout.html` | `scss/pages/_checkout.scss` | 完成 |
| 付款結果（付款成功） | `order-result.html` | `scss/pages/_order-result.scss` | 完成 |
| 我的課程 | `my-courses.html` | `scss/pages/_my-courses.scss` | 完成 |
| 購買紀錄 | `orders.html` | `scss/pages/_orders.scss` | 完成 |

10 頁都已完成。註冊、購買課程、付款結果三個流程頁共用 `components/_flow.scss`（窄單欄卡片疊），註冊的欄位錯誤樣式在 `components/_auth-form.scss`。

頁面上沒有列出所有頁面的導覽：從首頁依學生流程點進各頁即可，Guideline 直接開 `guideline.html`。

- 購買：首頁 → 課程列表 → 課程詳情 →「立即購買，開始上課」→ 登入對話框（未登入提示）→ 購買課程 →「確認付款」→ 付款結果 →「前往我的課程」或「開始上課」（學習頁）。
- 註冊：登入對話框的「立即註冊」→ 註冊 →「完成註冊」→ 購買課程；註冊頁的「登入」再開回登入對話框。
- 回來上課：頁首「我的課程」→ 我的課程 →「繼續上課」（學習頁）；我的課程的「購買紀錄」→ 購買紀錄。
- 課程詳情只做一頁靜態示範，所有課程卡都連到 `course.html`，「免費試看」連到 `course.html#trial`。
- 首頁的工藝情境卡連到 `courses.html?craft=pottery` 這類網址，課程列表會預先選中該分類（`js/main.js` 找 `input[name="craft"][value="…"]`，課程卡不會跟著變）。

## 檔案結構

```
02-nordic-style/
├─ *.html                    ← 10 個頁面，每頁完整包含頁首、頁尾與登入對話框
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製（開頭註解有目前頁規則）
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的六個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 23 張 AI 生成的照片（北歐大窗的白天）＋ favicon.svg（冰河藍方塊裡的碗與太陽）
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫＋本風格的 token
│  ├─ _base.scss             ← 全站基礎、字級階層、按鈕、標籤、狀態示意，以及招牌語彙 .lite-card、.window
│  ├─ components/            ← 頁首、頁尾、課程卡、對話框、播放器、章節清單、購買卡、篩選膠囊、流程頁卡片疊、表單錯誤
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾是否與範本一致，以及頁首的目前頁標示
   └─ generate-images.mjs    ← 生圖腳本（所有圖片的 prompt、裁切比例與輸出尺寸）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾、登入對話框每頁一份**：先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check`。每頁只有一處不同：頁首的目前頁標示（`active` 與 `aria-current="page"`）：首頁 → 首頁、課程列表 → 探索課程、課程詳情 → 探索課程（只加 `active`）、我的課程 → 我的課程、學習頁與購買紀錄 → 我的課程（只加 `active`）；Guideline、註冊、購買課程、付款結果不標示。`check-layout.mjs` 也會檢查這一點。
- **新增頁面**：複製範本成新頁，改 `<title>`（`{頁面名稱}｜Craftory 手感工藝線上學院`）、description（結尾一律是「設計稿 02｜北歐明亮課室。」）與頁首的目前頁標示。
- **假資料直接寫在 HTML**：課程、單元、進度的數字都寫死在頁面裡，來源是主題層的 `CONTENT.md`（§1～§8 Notion 原文、§9 補充資料）。
- **JS**：`js/main.js` 只做六件事，選擇器都寫在各段註解裡：登入對話框依觸發按鈕（`data-auth-context="purchase"`）顯示 `[data-auth-notice]`、切換 `[data-auth-label]`，並把送出目的地換成 `checkout.html`；關閉鎖定提示後捲到購買卡（`data-dismiss-to="#purchase"`）；啟用 `data-bs-toggle="tooltip"`（播放器進度條上的「上次看到 07:18」）；學習頁側欄「全部收合」（`data-collapse-all="#容器"`）；課程列表依 `?craft=` 預先選中 `input[name="craft"]`（手機時把那顆分類膠囊捲到這一列的中間，不動整頁）；我的課程依學習狀態篩選（`data-filter-list`／`data-filter`／`data-status`，按鈕切換 `.active` 與 `aria-pressed`）。Guideline 的目錄標示目前章節用 Bootstrap ScrollSpy 的 `data-bs-spy`／`data-bs-target`／`data-bs-root-margin`／`data-bs-threshold`，沒有另寫 JS。
- **換行與空白**：課程名稱的「｜」前半段包在 `.text-nowrap` 裡、後面接 `<wbr>`；短標題用 `.text-phrase`（`word-break: keep-all`）＋ `<wbr>` 標出詞組斷點；數字與單位之間用 `&nbsp;`（`4&nbsp;小時&nbsp;20&nbsp;分`、`NT$&nbsp;2,480`）。
- **表單**：設計稿用 GET 送到下一頁。登入對話框 `<form action="learn.html">`，從「立即購買」開啟時改送到 `checkout.html`；註冊送到購買課程、購買課程送到付款結果。電子郵件、密碼、卡號欄位不加 `name`（避免出現在網址），只有付款方式的 radio 有 `name="payment"`；每個欄位都要有 `id`＋`<label for>`＋`autocomplete`。

## 排版語言

和同主題另外 5 套比，02 的差別不只在配色：**文字永遠不壓在圖上，圖放在圓角的「窗」或白卡裡；每個區塊是一張張分開的白卡浮在雪白底上，卡片之間 24px、區塊之間 120px；不用分隔線、色帶與裝飾線，層級只靠留白與卡片的高度差。** 01／04／05 的首屏都是滿版圖疊字，02 是左文右窗；列表沒有側欄；表單頁是單欄窄卡片疊。

不要用：黑色或深色外框、位移的硬陰影、膠囊大按鈕（按鈕是 10px 圓角）、高飽和色塊（那是 06 童心的語言）；襯線字、點線、雙框（那是 04 書院）；0 圓角與只靠線分層（那是 05 瑞士）。

### 網格與版心

- Bootstrap 12 欄；`$grid-gutter-width: 2rem`、`$container-padding-x: 2.5rem`（左右各 20px）。
- 版心 `.container`：lg 960、xl 1140、xxl **1200**。全站同一種容器，學習頁也一樣。1920 寬時，頁面上方的窗光漸層、首頁熱門課程的霜藍色帶滿版，內容留在 1200 版心。
- 區塊留白：`.section` 上下 72px（< 992）／**120px**（≥ 992）。兩個雪白底的 `.section` 相鄰時，後一個不加上方留白（區塊間距就是 120，不會變成 240）；霜藍色帶 `.section-frost` 自己有上下留白。
- 內頁：`<main>` 裡第一個容器加 `.page-top`（上方 48px），最後一段內容加 `.page-bottom`（到頁尾 72／120px），或最後一個區塊用 `.section`。
- 卡片之間 24px（`.g-4`）；卡片內距 24px（手機 20px）。
- sticky 位移：頁首佔 **88px**（12＋64＋12），CSS 變數 `--header-offset`；sticky 元素（購買卡、學習頁側欄）用 `top: var(--sticky-top)`（96px）；`html` 的 `scroll-padding-top` 也是 96px，錨點不用另外處理。

### 頁首（浮起的白色卡片列）

- `<header class="site-header">` 是 sticky（`top: 12px`，上下各留 12px），裡面 `.container` > `nav.site-header-card`：白底、16px 圓角、1px `$line` 髮絲線、淡陰影、高 64px。卡片外圍透明，捲動時內容從卡片四周經過。
- ≥ 992px：品牌（32px 冰河藍圓角方塊標誌＋Manrope 700「Craftory」）→ 主導覽（膠囊；目前頁＝`$ice` 底＋`$glacier-deep` 字）→ 右側搜尋（輸入框寬 224，≥ 1200 寬 240）→「我的課程」（文字連結＋圖示，目前頁同樣是冰底膠囊）→「登入／註冊」（冰河藍實心 10px 圓角）。
- < 992px：品牌靠左，右側「登入／註冊」小按鈕與選單按鈕；選單在白卡裡往下展開：主導覽、搜尋、我的課程。「我的課程」全站只有一個連結（桌機與選單共用）。
- hover：只換字色與底色（`$frost`），不改尺寸。

### 頁尾（霜藍面板）

- `.site-footer` > `.container` > `.site-footer-panel`：`$frost` 底、24px 圓角，內縮在版心、下方留 24px，和頁首卡片成對。≥ 992px 左 5 欄品牌與一句說明、右 7 欄 3 欄連結；底下一條髮絲線＋版權。淺色頁尾在 6 套裡只有 02 與 06。

### 卡片造型：輕卡片

- `.lite-card`：白底、1px `$line`、16px 圓角、陰影 `0 1px 2px rgba(ink,.04), 0 8px 24px rgba(ink,.06)`，內距 24（手機 20）。**髮絲線與陰影兩個都要有**，少一個在雪白底上就看不出卡片。
- 變體：`.is-snug`（內距 12，圖片「裱」在卡片裡，圖片 12px 圓角：工藝卡、課程卡、作品照、播放器卡框）、`.is-flush`（無內距）、`.is-frost`（霜藍底、無陰影：總金額、退費說明這類「次要面板」）、`.is-link`（整張可點：hover／focus-within 只把陰影加深一階、框線換淡冰河藍，不位移、不放大）。
- 浮在圖上或 sticky 的卡片（正在播放、購買卡）陰影用深一階的 `$shadow-float`。
- 圓角：卡片 16、窗 24、圖片 12、按鈕與輸入框 10、chip／分段控制膠囊、頭像與播放鈕圓形。

### 標題階層

| 層級 | 寫法 | 字級（桌機 → 手機） |
|---|---|---|
| 首頁 H1（Display） | `h1.display-home` | 56／1.25（≥ 1400；1200–1399 為 52、992–1199 為 44）→ 36／1.3，Noto Sans TC 500 |
| 各頁 H1 | `h1` | 40／1.3 → 30／1.35，500 |
| H2 | `h2` | 30／1.4 → 24，500；一律靠左，標題列右側放連結（`.section-head`） |
| H3（卡片標題、章節名） | `h3` | 20／1.5 → 18，**700** |
| 內文 | `p` | 17／1.9（≥ 992）→ 16／1.85；段落最長約 36em（`.measure`） |
| 小字 | `.text-note`、`small` | 14／1.7 |
| 價格 | `.price`（＋`.price-lg` 28 → 26） | Manrope 600 tabular-nums |
| 數字、時間碼 | `.num` | Manrope 500 tabular-nums |

- 不用眉標、編號、裝飾線。每頁只有一個 H1。內頁頁首用 `.page-header`（麵包屑 → H1 → `.page-lead`）。

### 招牌元素

- **窗 `.window`**：24px 圓角、`overflow: hidden`，內緣 8px 一條 `$glacier-mid` 1px 細線（`::after`，只是裝飾）。首頁首屏的主圖就是一扇窗；課程詳情、學習頁的播放器卡框 `.player-frame` 沿用這個語彙：白卡（內距 8／12px）裡放 10px 圓角的 `$night` 播放器，卡框內緣 4／6px 一條 `$glacier-mid` 細線。
- **輕卡片側欄**（學習頁）：側欄不是一塊面板，而是一疊分開的 `.lite-card`（進度卡、每章一張可收合的章節卡），卡與卡之間 10～12px（進度卡到章節標題 12px、章節卡之間 10px）。目前單元＝`$ice` 底＋左側 3px `$glacier` 條。
- **橫線筆記紙 `.paper-lines`**（學習頁單元重點、課程問答輸入框）：一張不重複、鋪滿內容框的 `repeating-linear-gradient`，線距＝`--paper-line-height` × 1em（手機 16px × 1.85，≥ 992px 17px × 1.9，字級與線距在同一個斷點一起換），第一條線在第一行底部，所以字一定落在線上。`background-attachment: local`：輸入框捲動時線跟著字走。只放 `CONTENT.md` 的原文，不新增「隨堂筆記」字樣。
- 頁面上方的**窗光**：`body` 背景最上方 960px 是 `linear-gradient(160deg, #FFFFFF, $snow 45%)`，滿版。

### 各頁構圖（≥ 992px，做其他頁時照這份）

| 頁面 | 構圖 | 和既有 3 套的差別 |
|---|---|---|
| 首頁（完成） | 首屏左 5 欄文字（雪白底）＋右 7 欄高大的圓角窗，正在播放卡跨在窗的右下緣 → `#why` 左 4 欄 H2、右 8 欄 2×2 白卡 → `#crafts` 4 欄白卡（4:5 圖裱在卡裡，文字在圖下方、資訊常駐）→ `#featured` 霜藍色帶裡 2×2 橫式課程卡 → `#guarantee` 左 7 欄兩張作品照白卡、右 5 欄一張保障卡 → 版心內霜藍 CTA 面板（文字左、按鈕右） | 唯一文字不壓在圖上的首屏 |
| 課程列表（完成） | 頁首區靠左；下面一張全寬白色篩選卡：第一列工藝分類膠囊（含數量，單選，`.btn-check`＋label，選中＝冰底＋冰河藍框與字＋勾），第二列左邊難度（2 個 checkbox 膠囊）與價格（3 個 checkbox 膠囊），右邊「共 52 門課程」、排序 select；「清除篩選」在卡片右上角，和「工藝分類」同一行 → 3 欄直式 `.course-card`（8 門＝3＋3＋2）→ 分頁置中（44px、10px 圓角方塊）→ 狀態示意：篩選無結果（可移除的條件標籤＋共 0 門＋空狀態卡）。手機：可橫向捲動的分類膠囊＋「篩選」按鈕與結果數，按鈕開 Offcanvas（從右邊）。`?craft=` 對到分類 radio 的 `value` | 沒有側欄，3 欄 |
| 課程詳情（完成） | 8：4（CSS Grid）。左：白卡框裡的試看播放器（未播放、載入 1-2，覆蓋文字在左上，大圓播放鈕白底冰河藍圖示）→ 分類、H1、副標、meta 膠囊列（星等連到 `#reviews`）→「你會做出」一張卡（左 4:5 成品圖、右三組條列）→ 課程章節（Accordion 的**每一章是一張分開的白卡**，章與章之間 12px；標題列＝「第 N 章」小字＋章名＋單元數與時長；單元列用圖示＋「試看」「播放中」標籤，1-2＝冰底＋左側 3px 冰河藍條）→ 講師一張卡（左工作室照拉滿高度、右頭像＋簡介＋經歷＋3 張作品）→ 評價（≥ 1200 左總覽卡、右評價卡＋排序分段控制）→ FAQ（每題一張卡）。右：sticky 白色購買卡（`top: var(--sticky-top)`、`$shadow-float`，視窗高 700 以下不 sticky）。手機：播放器卡 → 課程資訊 → 購買卡 → 其餘。狀態示意：鎖定提示、已購買（章節全解鎖＋「繼續上課」購買卡） | 章節是一張張分開的卡；播放器有白卡框 |
| 學習頁（完成） | 8：4。左：麵包屑＋右側「回到課程介紹」→ 播放器白卡框（播放中 07:18／11:24，進度條上冰色的已觀看標記，tooltip「上次看到 07:18」；續看 Toast 疊在左上）→ 單元標題（冰底「3-2」方塊＋單元名＋片長）→ 操作列（一張細長白卡：上一單元｜標記完成並繼續｜下一單元）→ 底線式分頁（`nav-underline`，冰河藍 2px）→ 面板：單元重點＝橫線筆記紙、課程問答（textarea 同樣橫線底＋白卡空狀態）、附件下載（一張白卡裡的檔案列）。右：sticky 側欄是一疊分開的輕卡片（進度卡 →「課程章節」＋「全部收合」→ 每章一張可收合的章節卡，狀態圖示＋完成數；目前單元＝冰底＋左側 3px 冰河藍條），比視窗高時側欄內部捲動、底部 1.5rem 淡出。手機：側欄變成底部抽屜，開啟按鈕「課程章節 50%」貼在視窗底部（sticky） | 側欄是一疊分開的卡；筆記紙底 |
| 註冊（完成） | 單欄 560 寬置中（`.flow-stack.is-narrow`），所有寬度同一疊：H1 與說明 →「註冊後，接著完成購買」小摘要卡（霜藍 `.lite-card.is-frost`、沒有陰影與按鈕，層級低於表單；96px 方形縮圖〔手機 72px〕、課名、講師、價格、安心提示）→ 表單白卡（顯示名稱、電子郵件、密碼、同意條款、全寬「完成註冊」、卡片底部置中的「已經有帳號？登入」）→ 狀態示意：欄位有錯誤時（同寬的霜藍面板裡重畫一張表單白卡，3 則錯誤＝鐵鏽紅框＋圖示＋文字） | 窄單欄卡片疊，摘要在表單上面 |
| 購買課程（完成） | 單欄 720 寬置中的一疊白卡（`.flow-stack`），所有寬度同一疊：「回到課程介紹」＋H1＋說明 → 購買的課程（`#summary`：160px 4:3 縮圖＋課名＋講師＋課程資訊膠囊 → 購買包含 2×2 → 霜藍小框裡的「購買後可以看多久？」問答）→ 購買帳號 → 付款方式（3 張整張可點的 radio 卡，選中＝冰底＋冰河藍 2px 框〔內側陰影補 1px，不改尺寸〕＋實心 radio；信用卡欄位在信用卡那張卡裡，選其他方式時用 `:has()` 收起）→ 發票 → 霜藍總金額卡（應付金額 Manrope 28px＋安心提示）緊貼在全寬「確認付款 NT$ 2,480」前（間距 12px）→ 狀態示意：付款處理中、付款失敗 | 唯一完全單欄的結帳 |
| 付款結果（完成） | 720 寬單欄（`.flow-stack`）：成功卡（64px 松綠圓底勾在左、H1 與說明在右；< 576 上下排）→ 一列 3 張小卡（訂單資訊、購買內容、發票；≥ 992 三欄，768–991 訂單資訊＋購買內容兩欄、發票橫跨一列且標籤與值左右排，以下單欄；購買內容 ≥ 768 封面 16:9 在上，以下 72px 縮圖在課名左側）→「接下來」卡（`<ol>` 3 步驟，冰圓底 Manrope 數字）→ 按鈕列（≥ 576 各半並排）→ 退費提醒（安心提示＋「查看購買紀錄」）→ 狀態示意：付款沒有完成時（鐵鏽紅圓底驚嘆號、應付金額霜藍列、你可以這樣做、重新付款／回到課程介紹） | 三張並排的小卡 |
| 我的課程（完成） | 標題區 ≥ 992 左邊麵包屑、H1、說明，右邊 3 張小統計卡（Manrope 28px 數字＋單位，標籤在數字下方）＋「購買紀錄」連結，底部對齊；以下統計卡在標題下方並排（390 寬也是 3 張一列）→ `.segmented` 分段控制（全部 3／學習中 2／已完成 1，`aria-pressed`，真的篩選）→ 直式白卡 1 → 2（768）→ 3 欄（992）：封面 16:9 → 狀態標籤 → 課名 → 講師 → 進度條＋進度文字 → 霜藍小框「上次看到＋單元＋時間」或「完課日期」（常駐）→ 貼齊卡片底部的按鈕。已完課的卡降一階：封面淡一點、進度條改松綠 → 狀態示意：還沒有任何課程時 | 卡片格，不是一門一列 |
| 購買紀錄（完成） | 麵包屑、H1、說明 → 霜藍退費說明卡（白底圖示圈＋「7 天不滿意退費」＋規則＋補充）→「共 5 筆訂單」→ 直向時間軸：≥ 768 左欄日期（Manrope，靠右）→ 2px `$track` 細線上的冰河藍圓點 → 右側白色訂單卡；< 768 細線貼左 12px、日期在卡片上方。訂單卡：上＝訂單編號＋狀態 `.tag-*`；≥ 992 下面一列排「縮圖＋課名｜金額、付款方式、備註｜動作（固定 120px 欄，5 張卡的欄位對齊）」，以下依序上下排 → 狀態示意：退費處理中（`#refund-pending`，同樣的時間軸畫藤編那一筆）、沒有購買紀錄時 | 時間軸，退費說明在最上方 |
| Guideline（完成） | 頁首區（麵包屑、H1、說明、版本 chip）→ 左 3 欄 sticky 目錄白卡（`top: var(--sticky-top)`，11 章，目前章節＝冰底膠囊，Bootstrap ScrollSpy 標示）＋右 9 欄。章節標題（H2＋說明）直接放在雪白底上，下面接白卡：概覽（設計原則、10 頁清單）→ 色彩（比例條、6 組色票附 hex、對比度與用途、Bootstrap 主題色對應）→ 字級階層（兩套字體、用頁面真的 class 排的字級表）→ 間距（`$spacers` 長條、固定用法表）→ 圓角與陰影（含焦點環）→ 招牌元素（窗、輕卡片、輕卡片側欄、橫線筆記紙、窗光）→ 元件狀態規範（**每組元件一張白卡**：按鈕、表單、分頁籤與切換、課程卡、工藝情境卡、單元列與章節卡、狀態標籤、進度與評價、購買卡、播放器、對話框與空狀態與提示框、講師課程狀態卡；元件放在霜藍示範台 `.gl-stage` 上，hover 與 focus 用 `.gl-hover`／`.gl-focus` 固定顯示）→ 狀態與空畫面文案（Notion 7 則各一張：元件、文案、出現在哪一頁，另一張其他動態文案）→ 動態與 hover → RWD 斷點（斷點卡＋13 列各頁收合）→ Do／Don't 9 組（左做、右避免）。< 992 目錄改成內容上方可橫向捲動的膠囊列；< 576 示範台貼齊白卡內緣，三欄表格改成一列一塊 | 章節標題在卡外、每組元件一張卡 |

### 首頁在各寬度怎麼收合（已實作）

- 首屏：≥ 992px 高度 `max(600px, 100svh − 88px)`，窗高＝首屏扣掉上 24、下 48（下方 48 給跨出窗緣 24px 的正在播放卡），圖片 `object-position: 80% 40%`；< 992px 文字在上、窗在下（4:3、20px 圓角、`object-position: 75% 35%`），正在播放卡寬度 100% 減 24，往上疊住窗的下緣 24px。
- `#why`：< 576 單欄 → 576 起 2 欄（右 8 欄裡 2×2）。`#crafts`：< 992 兩欄 → 4 欄；< 576 時「瀏覽全部工藝分類」移到卡片下方。`#featured`：< 992 是橫向捲動的直式卡（卡寬 80%／45%，`.bleed-x` 在手機貼齊螢幕兩側）→ ≥ 992 2×2 橫式卡（封面 5/12）。`#guarantee`：< 992 上下排（作品牆在上）。

### 課程列表、課程詳情、學習頁在各寬度怎麼收合（已實作）

- 課程列表：篩選卡 ≥ 1200「清除篩選」在卡片右上角，第二列一行排完難度、價格、結果數、排序；992–1199 難度與價格一行，結果數、排序、清除篩選換到下一行靠右（`.filter-bar::before` 當換行點）；< 992 分類膠囊橫向捲動（捲動區延伸到卡片邊緣），下面是「篩選」按鈕＋結果數，其餘控制項在 Offcanvas（`display: contents` 讓同一份 HTML 在桌機直接排進篩選卡）。課程卡 1 → 2（576）→ 3 欄（992）。
- 課程詳情：< 992 單欄，依 HTML 順序是播放器 → 課程資訊 → 購買卡 → 區塊二～六；章節的單元列 < 576 把「試看／播放中」標籤換到第二行；評價 < 1200 總覽卡在上（≥ 576 分數在左、長條在右）；講師 < 768 工作室照在上。
- 學習頁：< 992 單欄，側欄是 `.offcanvas-lg.offcanvas-bottom` 抽屜；續看 Toast < 768 移到播放器下方（還在卡框裡）；操作列 < 576 上一／下一只留箭頭（`aria-label` 有完整文字）；播放器的音量與速度 < 576 收起，只留播放、時間、字幕、全螢幕。

### 和方向說明的差異

- 首頁 H1 字級改成 ≥ 1400 為 56、1200–1399 為 52、992–1199 為 44：5 欄寬度放 56px 只有在 1400 以上才放得下「變成手上的作品。」一行；斷行固定是「把想學很久的／那件事，／變成手上的作品。」（`<wbr>`＋`keep-all`）。
- 頁首搜尋在 992–1199 也直接顯示輸入框（寬 224），不做「點圖示展開」，省掉一段 JS；992 以下收進選單。
- 手機的正在播放卡依方向說明疊住窗的下緣 24px（規格 §3.01 寫 < lg「移到大圖下方」：卡片本體都在圖的下方，只有上緣 24px 疊在圖片下緣的留白區）。
- 星等的星星用 `$amber`（方向說明沒有指定；白底 5.52:1）。
- `$spacers` 的 0～5 維持 Bootstrap 預設（4／8／16／24／48），另外加 6＝72、7＝96、8＝120。
- 課程列表：方向說明的「清除篩選」排在第二列最右邊；1200–1399 第二列放不下，改放卡片右上角（≥ 1400 也放右上角，1200 以上位置一致；992–1199 和結果數、排序一起換到第三行）。
- 課程詳情：方向說明寫桌機「麵包屑、H1、meta 膠囊列」在播放器上面；這裡照規格與 Notion「先看到影片再看到價格」，所有寬度都是播放器在最上面、標題在播放器下方。購買卡照 `CONTENT.md` 只有兩顆按鈕（立即購買、加入願望清單），沒有方向說明的次要「免費試看」：試看就是左邊的播放器。
- 學習頁：方向說明的「單元標題列右側上一個／下一個」改成規格的操作列（上一單元｜標記完成並繼續｜下一單元，放在單元標題下方、分頁之前），做成一張細長白卡；進度卡不放「上次看到」（`CONTENT.md` 沒有這行，07:18 已經在播放器的已觀看標記 tooltip 與續看 Toast 裡）；手機的抽屜按鈕用 `CONTENT.md` 的「課程章節＋50%」，不是方向說明的「章節 14／28」，並且是 sticky（捲到學習內容最後就停在原位，不會蓋住狀態示意與頁尾）。
- 新增 `$player-warn #F0B7AE`：深色播放器上「影片載入失敗」的圖示色（對 `$night-soft` 7.96:1）。
- 註冊：方向說明的「小摘要卡」做成霜藍的 `.lite-card.is-frost`（沒有陰影、沒有按鈕），因為規格要求接續購買提示的層級低於表單；方形縮圖在手機縮成 72px。
- 購買課程：「購買的課程」卡不重複放價格，應付金額只出現在按鈕前的霜藍總金額卡；總金額卡與按鈕之間收成 12px（其他卡片之間 24px）。
- 付款結果：方向說明寫 H1「付款成功，可以開始上課」，照 `CONTENT.md` 是「付款成功，可以開始上課了」。
- 我的課程：已完課那張卡的進度條用 `$pine`（對軌道 4.54:1），和「已完課」標籤同色；方向說明沒有指定已完課的樣子，規格建議「降一階」，所以封面另外淡到 82%。
- Guideline：方向說明寫「右 9 欄每章一張白卡」，實作改成章節標題（H2＋說明）放在雪白底上、**每組元件一張白卡**：「元件狀態規範」一章有 12 組元件，塞進同一張卡會長到好幾個螢幕，看不出分組。Notion 的 7 則狀態文案獨立成「狀態與空畫面文案」一章（元件、文案、出現在哪一頁），元件的樣子在「元件狀態規範」。目錄的目前章節用 Bootstrap ScrollSpy（章節很長，觀察範圍是視窗頂端扣掉頁首 96px 後的一條帶狀區：`data-bs-root-margin="-96px 0px -70% 0px"`、`data-bs-threshold="0,1"`）。
- Guideline：講師課程狀態卡（草稿、已上架、已下架）與篩選膠囊的停用樣式只在 Guideline 示範；登入與鎖定提示對話框靜態畫一份（`.modal.gl-modal-static`），旁邊的按鈕會開啟真的對話框。
- 購買紀錄：「共 5 筆訂單」放在退費說明卡與時間軸之間（規格的標題區是建議位置），讓結果數貼著它描述的列表；≥ 992 訂單卡夠寬，縮圖與課名、金額與付款方式、動作排成同一列，動作欄固定 120px，5 張卡的欄位上下對齊。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、字體、間距、圓角、陰影、元件）
3. `bootstrap/scss/bootstrap`
4. `bootstrap-icons`（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字級階層、版心與區塊節奏、焦點、按鈕、chip、狀態標籤、空狀態、提示框、設計稿狀態示意，以及招牌語彙 `.lite-card`、`.window`
6. `components/*`：頁首、頁尾、課程卡、對話框、播放器、章節清單、購買卡、篩選膠囊、流程頁卡片疊、表單錯誤（新的共用元件也放這裡，並在 `main.scss` 加 `@import`）
7. `pages/*`：各頁專屬樣式，class 一律加頁面前綴

原則是**先用 Bootstrap 的變數與工具類別**，真的做不到才寫自訂 CSS，而且只引用 `_variables.scss` 的變數，不寫死色碼。

### 共用類別

下面這些類別跨頁共用，新頁面直接套用，不要在 `pages/*` 另寫一份。HTML 範例寫在各類別上方的註解裡。

| 類別 | 用途 | 位置 |
|---|---|---|
| `.lite-card`（`.is-snug`、`.is-flush`、`.is-frost`、`.is-link`） | ★ 輕卡片：白底＋髮絲線＋淡雙層陰影；可點的卡 hover 只換陰影與框色 | `_base.scss` |
| `.window` | ★ 窗框：24px 圓角＋內緣 8px 的冰河藍細線（裝飾） | `_base.scss` |
| `.img-frame` | 卡片裡的圖片框（12px 圓角、`object-fit: cover`），比例用 `aspect-ratio` 或 `.ratio` | `_base.scss` |
| `.section`、`.section-frost`、`.page-top`、`.page-bottom` | 區塊留白 72／120px、霜藍滿版色帶、內頁上方 48px、內頁最後一段到頁尾 | `_base.scss` |
| `.section-head`、`.section-lead` | 標題列：左 H2（＋說明）、右連結，≥ 576 底部對齊 | `_base.scss` |
| `.page-header`、`.page-lead` | 內頁頁首：麵包屑 → H1 → 一句說明 | `_base.scss` |
| `.display-home` | 首頁 H1 | `_base.scss`、`pages/_home.scss` |
| `.num`、`.price`、`.price-lg` | Manrope 等寬數字；價格（`.price-lg` 28／26px） | `_base.scss` |
| `.text-note`、`.text-phrase`、`.measure` | 14px 說明；詞組換行；段落最長 36em | `_base.scss` |
| `.btn-primary`、`.btn-outline-primary`、`.btn-outline-secondary`、`.btn-text` | 主要（冰河藍底白字）、次要（白底冰河藍框）、低強調（白底灰框）、文字連結（44px 觸控高度）；全部 10px 圓角 | `_base.scss` |
| `.chip-list`、`.chip` | 霜藍膠囊：課程卡的分類與難度、meta 膠囊列 | `_base.scss` |
| `.segmented` | 霜藍軌道上的分段控制（`.btn-check`＋label 或 `<button aria-pressed>`）：我的課程篩選、評價排序 | `_base.scss` |
| `.tag`＋`.tag-trial`／`-lock`／`-playing`／`-done`／`-learning`／`-progress`／`-draft`／`-live`／`-off`／`-paid`／`-refunding`／`-failed`／`-refunded` | 狀態膠囊（圖示＋文字，不只靠顏色）：已付款＝實線框＋勾、退費處理中＝虛線框＋沙漏、付款失敗＝實線框＋叉、已退費＝灰框＋回轉箭頭 | `_base.scss` |
| `.icon-circle`（`.is-sm`、`.is-success`、`.is-danger`） | 冰圓底＋冰河藍圖示：價值主張、保障、步驟、空狀態；`.is-success` 松綠（付款成功）、`.is-danger` 鐵鏽紅（付款沒有完成） | `_base.scss` |
| `.avatar-text`、`.stars`、`.rating` | 講師文字頭像（冰底）、星等、「★ 4.9」 | `_base.scss` |
| `.empty-state`、`.empty-state-text` | 空狀態：圖示圈 → 一句說明 → 一個動作，置中 | `_base.scss` |
| `.note-box`＋`.note-info`／`-success`／`-warning`／`-danger` | 提示框：圖示＋文字（錯誤有 1px 鐵鏽紅框） | `_base.scss` |
| `.demo-state`（`-panel`、`-tag`、`-item`、`-title`） | 頁面底部的「設計稿狀態示意」：霜藍底＋1px 虛線框的 24px 圓角面板，裡面的畫面用白卡 | `_base.scss` |
| `.progress`（Bootstrap）、`.progress-text` | 6px 膠囊進度條（軌道 `$track`、填色冰河藍）；載入時用 `scaleX` 從 0 長到目前值一次，`prefers-reduced-motion` 時直接到位 | `_base.scss`、`_variables.scss` |
| `.bleed-x` | 576px 以下讓橫向捲動列貼齊螢幕兩側 | `_base.scss` |
| `.site-header`、`.site-header-card`、`.site-brand`、`.brand-mark`、`.site-nav`、`.site-search`、`.site-mycourses` | 頁首 | `components/_header.scss` |
| `.site-footer`、`.site-footer-panel`、`.site-footer-*` | 頁尾 | `components/_footer.scss` |
| `.course-card`（`.course-card-h`）、`.course-scroller` | 課程卡（直式；`-h` 在 ≥ 992 變橫式 5/12＋7/12）；首頁熱門課程的橫向捲動列（≥ 992 變 2×2） | `components/_course-card.scss` |
| `.auth-modal`、`.auth-notice`、`.auth-link`、`.auth-footer`、`.locked-dialog`、`.locked-icon`、`.locked-text` | 登入對話框、未登入提示；鎖定單元提示（課程詳情用） | `components/_modal.scss` |
| `.paper-lines` | ★ 橫線筆記紙：線距跟著行高（`--paper-line-height`），可用在白卡或 textarea | `_base.scss` |
| `.player-frame`、`.player`（`.is-paused`、`.is-playing`）、`.player-media`、`.player-ui`、`.player-caption`、`.player-bigplay`、`.player-controls`、`.player-btn`、`.player-time`、`.player-volume`、`.player-speed`、`.player-progress`（`--played`、`--buffered`、`--mark`）＋`-buffer`／`-played`／`-mark`／`-head` | ★ 白卡框裡的深色播放器：覆蓋文字、大圓播放鈕、控制列、進度條（已觀看標記比播放頭高，重疊時也看得到） | `components/_player.scss` |
| `.player-toast`、`.player-error-box`、`.player-error`、`.player-error-icon`、`.btn-on-dark` | 續看提示（≥ 768 疊在播放器左上，以下在播放器下方）；影片載入失敗畫面；深色底上的白色按鈕 | `components/_player.scss` |
| `.accordion-cards`（`.is-compact`）、`.chapter-btn`、`.chapter-title`、`.chapter-no`、`.chapter-name`、`.chapter-meta`、`.chapter-state`（`.is-done`／`-current`／`-partial`／`-todo`） | ★ 每一章（或每一題 FAQ）是一張分開的白卡；`.is-compact` 是學習頁側欄的窄版，章名前多一個狀態圖示 | `components/_curriculum.scss` |
| `.unit-list`（`.has-state`）、`.unit`（`.is-trial`／`-locked`／`-playing`／`-done`／`-current`／`-todo`／`-open`）、`.unit-icon`、`.unit-no`、`.unit-name`、`.unit-state`、`.unit-time` | 單元列：圖示＋編號＋名稱＋（標籤）＋片長；播放中／目前單元＝冰底＋左側 3px 冰河藍條＋粗體 | `components/_curriculum.scss` |
| `.purchase-card`、`.purchase-price`、`.purchase-actions`、`.wishlist-btn`（`.is-off`／`.is-on`）、`.purchase-includes-title`、`.purchase-includes`、`.purchase-note` | 購買卡：價格、按鈕、購買包含、霜藍安心提示；願望清單用 `data-bs-toggle="button"` 切換文字 | `components/_purchase-card.scss` |
| `.filter-pill`、`.filter-pill-count`、`.filter-pill-check`、`.filter-chips`、`.filter-chip` | 篩選膠囊（`.btn-check`＋label，選中＝冰底＋冰河藍框＋勾；`.btn-check:disabled + .filter-pill` 停用＝白底＋虛線框＋placeholder 字，目前只有 Guideline 示範）；已選條件的可移除標籤 | `components/_filter-pill.scss` |
| `.flow-stack`（`.is-narrow`）、`.flow-group`、`.flow-head`、`.flow-back`、`.flow-title`、`.flow-subtitle` | ★ 流程頁的窄單欄卡片疊：版心裡置中 720px（`.is-narrow` 560px）、卡片之間 24px；標題區（回到課程介紹 → H1 → 說明）；卡片裡的小標（H2 或 legend，字級同 H3）與第二層小標。註冊、購買課程、付款結果，以及這三頁的狀態示意面板 | `components/_flow.scss` |
| `.course-mini`（`.is-lg`）、`.course-mini-cover`、`.course-mini-name`、`.course-mini-teacher`、`.course-mini-price`、`.course-mini-facts` | 課程摘要列：縮圖（96px 方形，手機 72px；`.is-lg` 160px 4:3、頂端對齊）＋課名＋講師（＋價格、課程資訊膠囊）。縮圖是裝飾，`alt` 留空 | `components/_flow.scss` |
| `.info-list`（`.is-row`） | 鍵值清單 `<dl>`：預設標籤小字在上、值在下；`.is-row` 左右排、值靠右（訂單資訊、發票、應付金額） | `components/_flow.scss` |
| `.purchase-note.is-plain` | 安心提示放在霜藍卡片裡時，拿掉自己的霜藍底與內距 | `components/_flow.scss` |
| `.field-error`、`.field-error-link`、`.form-check-aligned` | 表單錯誤（Bootstrap `.is-invalid` 的鐵鏽紅框＋欄位下方圖示＋文字，`aria-invalid`、`aria-describedby`）；錯誤文字裡開啟登入對話框的文字按鈕；勾選框方框和第一行文字對齊（條款連結是不帶 `href` 的連結樣式） | `components/_auth-form.scss` |

首頁專用（`pages/_home.scss`）：`.home-hero`、`.home-window`、`.now-playing`（正在播放卡）、`.home-why-card`、`.craft-card`、`.ugc-card`、`.guarantee-card`、`.guarantee-list`、`.home-cta`。

課程列表專用（`pages/_courses.scss`）：`.courses-filter`、`.filter-group`、`.filter-label`、`.filter-pills`（`.is-scroll`）、`.filter-bar`、`.filter-more`、`.filter-level`、`.filter-price`、`.filter-clear`、`.courses-count`、`.courses-sort`、`.courses-grid`、`.courses-pagination`、`.courses-empty-head`。

課程詳情專用（`pages/_course.scss`）：`.course-crumb`、`.course-layout`（`.course-top`、`.course-aside`、`.course-rest`）、`.course-intro`、`.course-category`、`.course-title`、`.course-lead`、`.course-facts`、`.course-section`、`.course-section-head`、`.course-section-sum`、`.outcome-card`、`.outcome-photo`、`.outcome-list`、`.outcome-learn`、`.instructor-card`、`.instructor-studio`、`.instructor-head`、`.instructor-avatar`、`.instructor-name`、`.instructor-role`、`.instructor-bio`、`.instructor-cv`、`.instructor-works`、`.rating-summary`、`.rating-score`、`.rating-count`、`.rating-bars`、`.review-toolbar`、`.review-list`、`.review-card`、`.review-author`、`.faq`、`.course-demo-locked`、`.course-demo-owned`。

註冊專用（`pages/_register.scss`）：`.register-next`、`.register-next-title`、`.register-card`、`.register-submit`、`.register-switch`、`.register-demo`。

購買課程專用（`pages/_checkout.scss`）：`.checkout-includes`、`.checkout-faq`、`.checkout-account`、`.pay-options`、`.pay-option`、`.pay-option-label`、`.pay-option-name`、`.pay-option-note`、`.pay-option-icon`、`.pay-card-fields`、`.checkout-total`、`.checkout-submit`、`.checkout-demo-pay`、`.checkout-demo-hint`、`.checkout-demo-error`。

付款結果專用（`pages/_order-result.scss`）：`.result-hero`、`.result-icon`、`.result-email`、`.result-cards`、`.result-course`、`.result-invoice`、`.result-steps`、`.result-actions`、`.result-refund`、`.result-failed`、`.result-failed-head`、`.result-failed-title`、`.result-failed-amount`、`.result-failed-list`。

我的課程專用（`pages/_my-courses.scss`）：`.mc-head`、`.mc-head-text`、`.mc-head-side`、`.mc-stats`、`.mc-stat`、`.mc-filter`、`.mc-card`（`.is-done`）、`.mc-card-cover`、`.mc-card-body`、`.mc-card-status`、`.mc-card-title`、`.mc-card-progress`、`.mc-card-last`、`.mc-card-btn`、`.mc-demo-head`。課程卡的講師列沿用 `.course-card-teacher`。

購買紀錄專用（`pages/_orders.scss`）：`.orders-refund`（`-rule`、`-more`）、`.orders-count`、`.order-timeline`、`.order-entry`、`.order-date`、`.order-card`、`.order-card-head`、`.order-card-body`、`.order-no`、`.order-label`、`.order-course`、`.order-thumb`、`.order-course-title`、`.order-meta`、`.order-note`、`.order-actions`、`.orders-demo-timeline`。

學習頁專用（`pages/_learn.scss`）：`.learn-top`、`.learn-back`、`.learn-head`、`.learn-title`、`.learn-title-no`、`.learn-duration`、`.learn-actions`、`.learn-nav`（`.learn-nav-next`）、`.learn-nav-text`、`.learn-nav-label`、`.learn-nav-title`、`.learn-complete`、`.learn-tabs`、`.learn-paper`、`.learn-qa`、`.learn-qa-empty`、`.file-list`、`.file-info`、`.file-name`、`.file-size`、`.learn-sidebar`、`.learn-progress`、`.learn-progress-head`、`.learn-progress-value`、`.learn-progress-text`、`.learn-side-title`、`.learn-chapters-head`、`.learn-dock`、`.learn-dock-btn`、`.learn-dock-bar`、`.chapter-done-note`、`.course-complete`、`.course-complete-text`、`.course-complete-btn`。

Guideline 專用（`pages/_guideline.scss`）：`.gl-*` 只給 Guideline 排版用，其他頁不要套。版面：`.gl-meta`、`.gl-toc`（`-title`、`-nav`、`-mobile`、`-chips`）、`.gl-section`、`.gl-section-head`、`.gl-card`、`.gl-block`、`.gl-block-title`、`.gl-note`、`.gl-caption`、`.gl-stage`（示範台）、`.gl-state`（`.is-dark`）、`.gl-states`、`.gl-sub`、`.gl-spec`、`.gl-quote`、`.gl-list`、`.gl-principles`、`.gl-pages`、`.gl-page`（`.is-current`）、`.gl-page-head`、`.gl-page-desc`、`.gl-table`（`.is-stack`：< 768 一列一塊）。色彩：`.gl-c-*`（由 `$gl-colors` 產生）、`.gl-proportion`、`.gl-swatches`、`.gl-swatch`（`-chip`〔`.is-info`〕、`-name`、`-code`、`-use`、`-ratio`、`-flag`）、`.gl-rows`、`.gl-dot`（`.is-dashed`）、`.gl-dot-buffer`。字級、間距、圓角：`.gl-fonts`、`.gl-font`、`.gl-font-sample`（`.is-latin`）、`.gl-type-row`、`.gl-type-meta`、`.gl-space`、`.gl-space-bar`、`.gl-shapes`、`.gl-shape`（`.is-frost`）、`.gl-r-*`、`.gl-sh-*`、`.gl-window`、`.gl-window-light`、`.gl-lite-demo`、`.gl-paper`。固定顯示狀態：`.gl-hover`、`.gl-focus`、`.gl-focus-within`、`.gl-static`、`.gl-player-strip`、`.gl-player-loading`、`.gl-dropdown-open`、`.gl-modal-static`（靜態畫出來的對話框，保留 `--bs-modal-*` 變數）。文案、RWD、Do／Don't：`.gl-notion`（`-title`、`-no`、`-copy`）、`.gl-motion`、`.gl-bp`、`.gl-rwd`、`.gl-rwd-row`、`.gl-rwd-name`、`.gl-rwd-cell`（`.is-wide`）、`.gl-rwd-label`、`.gl-dodont`、`.gl-do`、`.gl-dont`、`.gl-verdict`、`.gl-good-title`、`.gl-bad-*`（錯誤示範，只在 Don't 裡）。

講師課程狀態卡 `.instructor-status`（`-name`、`-meta`、`-msg`；`.is-draft` 虛線框、`.is-off` 霜藍底不浮起）也寫在 `pages/_guideline.scss`：設計稿沒有講師頁，只在 Guideline 示範 Notion 的「講師課程草稿未完成」「講師課程已下架」。

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 底與面 | 雪白 `$snow #F6F8FA`（頁面底，ink 13.72）、白 `$white #FFFFFF`（卡片、輸入框、頁首、對話框）、霜藍 `$frost #EAF0F5`（頁尾、chip、CTA、分段控制軌道、熱門課程色帶；slate 4.97）、冰 `$ice #DCEBF5`（選中的底；glacier 4.80） |
| 文字 | 墨 `$ink #1F2A33`（白 14.61）、石板灰 `$slate #5B6874`（說明、meta；白 5.71、snow 5.36、frost 4.97）、placeholder `#66727D`（白 4.92） |
| 冰河藍 | `$glacier #2E6A92`（唯一的動作色：主要按鈕、連結、焦點環、進度；白字在上 5.84、snow 上 5.49）、`$glacier-deep #245878`（hover；白字 7.66）、`$glacier-mid #6FA3C7`（**只做裝飾**：窗框細線、光暈，2.71） |
| 線與控制項 | 髮絲線 `$line #E1E7ED`（裝飾）、控制項框 `$control #7F8C98`（白 3.44）、進度軌道 `$track #E3EAF0`（glacier 4.81） |
| 狀態色 | 松綠 `$pine #2F7559`／`#E4F1EA`（成功、已付款、已完課）、琥珀 `$amber #8A6116`／`#FBF1DC`（警示、草稿、退費處理中）、鐵鏽紅 `$rust #B4382F`／`#FBE9E7`（錯誤、付款失敗）；資訊＝glacier 字在 ice 上 |
| 播放器 | `$night #16202A`（底）、`$night-soft #222E39`、`$player-text #D5E3EE`（12.60）、`$player-icon #9DC4E2`（控制圖示、已播進度、深色底的焦點環，8.97）、`$player-track #3A444D`（已播對軌道 5.41）、`$player-warn #F0B7AE`（影片載入失敗的圖示，對 `$night-soft` 7.96） |
| 字體 | Noto Sans TC 400／500／700（標題 500、H3 700、內文 400）；Manrope 500／600／700（品牌、價格、時間碼、人數、訂單編號，一律 tabular-nums） |
| 圓角 | 6（時長標籤）／10（按鈕、輸入框、播放器、頁碼）／12（卡片裡的圖片）／16（卡片、頁首、對話框）／24（窗、頁尾面板、CTA 面板、狀態示意面板）；膠囊給 chip、分段控制、狀態標籤 |
| 陰影 | 卡片 `$shadow-card`、可點卡片 hover `$shadow-card-hover`、浮在圖上或 sticky `$shadow-float`、對話框 `$box-shadow-lg` |
| 焦點 | 2px 白色間隙＋2px 冰河藍（`$focus-ring-double`）；播放器上外圈改 `$player-icon` |
| 頁首 | 高 64、距頂 12；`--header-offset` 88px、`--sticky-top` 96px |
| 動態 | 只有顏色／邊框／陰影的轉場（.2s）、進度條載入時長一次（.6s）、Bootstrap 原本的 Offcanvas／Modal 轉場與錨點平滑捲動（reboot 的 `scroll-behavior: smooth`）；`prefers-reduced-motion: reduce` 時全部關閉 |

完整規範請看 `guideline.html`。

### 換色時同步檢查

色票的唯一來源是 `_variables.scss`，但下面幾處把數值寫成文字或寫死，改色（或改頁首高度）時要一起檢查：

- [ ] `scss/_variables.scss`：色票、`$theme-colors` 與語意變數（`$body-*`、`$input-*`、`$focus-ring-color`、`$link-*`、`$form-feedback-*`），以及 `$shadow-card`／`$shadow-card-hover`／`$shadow-float` 裡的 ink 色。
- [ ] `guideline.html`「色彩」：6 組色票的 hex、對比度與用途文字，「Bootstrap 主題色對應」表；新增或刪除色票時，同步 `scss/pages/_guideline.scss` 的 `$gl-colors`。
- [ ] `guideline.html` 其他章節寫到的對比度：「圓角與陰影」的焦點環（雪白上 5.49:1、播放器上 8.97:1）、「招牌元素」窗框細線（2.71:1）、「元件狀態規範」的表單控制項框（3.44:1）、進度條（4.81:1、已完課 4.54:1）、星等（5.52:1），以及「招牌元素」窗光的 `linear-gradient(160deg, #FFFFFF, $snow 45%)`。
- [ ] 本檔的「Design token 摘要」：底與面、文字、冰河藍、線與控制項、狀態色、播放器。
- [ ] 改了頁首高度（`$site-header-height` 64px、`$site-header-gap` 12px，`--header-offset` 88px、`--sticky-top` 96px）時：Guideline「間距」固定用法表的頁首數值、購買卡與學習頁側欄的 sticky `top`、`scroll-padding-top`、Guideline 目錄的 sticky `top` 與 ScrollSpy 的 `data-bs-root-margin`（`-96px`），以及本檔「網格與版心」「頁首」兩段。
- [ ] `scripts/generate-images.mjs` 的 `STYLE`：整組圖片的光線、木色與冰河藍點綴，換色後重新生圖。
- [ ] `templates/page.html` 與 10 頁的 `theme-color`（雪白 `#F6F8FA`）。改完跑 `npm run check`。
- [ ] `images/favicon.svg` 寫死的冰河藍 `#2E6A92`：頁首 `.brand-mark` 的顏色來自 `components/_header.scss` 的變數，會跟著換，favicon 要手動改成一樣。

## 圖片

`images/` 的 23 張圖片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名、比例與主體照主題層的 [`../IMAGES.md`](../IMAGES.md)。調性是「北歐大窗邊的白天」：朝北大窗的散射光、冷白平衡、高調曝光、淺樺木桌、白牆、淺灰亞麻，只在陶瓷與布料上帶一點冰河藍；職人的手部特寫穿同一件灰藍襯衫與淺灰亞麻圍裙，講師林子謙的頭像與工作室照是同一人（工作室照生成時附上頭像當參考圖，見 `JOBS` 第 5 欄），作品照是同一組白釉帶冰河藍的器物。替換時保持相同檔名即可，不需改程式。`favicon.svg` 是手繪向量（冰河藍圓角方塊裡的碗與太陽，同頁首品牌標誌）。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`（原始 PNG 暫存在系統暫存資料夾的 `craftory-nordic-raw-images/`；codex 只產 3:2、2:3、1:1，腳本會用 `sips` 從中央裁成 16:9、4:5、3:2、1:1 並縮放成 IMAGES.md 的輸出尺寸）：

```bash
npm run images                                       # 產生缺少的圖片
node scripts/generate-images.mjs --only hero,craft-bowl # 只重做指定的圖
node scripts/generate-images.mjs --force             # 全部重做
CONC=1 node scripts/generate-images.mjs              # 並行數（預設 2）
```
