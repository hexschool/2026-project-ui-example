# 03｜AI 賽博學院：Craftory 手感工藝線上學院

> 深色系＋高對比（深靛藍、賽博紫、電光粉）｜播放進度條呈漸層能量光束，程式碼筆記支援終端機螢光高亮，科技感十足

概念是「深夜 AI 實驗室的主控台」：底是帶紫的深靛藍，面板是切角的 HUD 視窗，所有「進度」都是一道從賽博紫流到電光粉的能量光束。大膽只花在三個地方：**能量光束**（播放進度、學習進度、付款進度、首頁銀幕底緣）、**終端機筆記**（學習頁的單元重點，等寬字＋行號＋薄荷螢光標記）、**左側 App 導覽軌**（992px 以上，6 套裡唯一的側邊導覽）。其他地方保持克制：發光只給焦點、播放中與主要按鈕 hover；背景網格只鋪在首頁 Hero、內頁標題區與底部 CTA；掃描線只在播放器與首頁銀幕。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（與 `01-dark-theater-style` 相同架構）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。這是**單一深色主題**：直接把 Bootstrap 原本給淺色用的變數設成深色，不使用 `data-bs-theme`。
- **JS**：互動都交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的七個小功能。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西。

**要修改樣式**：

```bash
npm install        # 安裝 bootstrap、bootstrap-icons、sass，並把 Bootstrap JS 與圖示字型複製進專案
npm run watch      # 開發時：監看 scss/，存檔就重新編譯 css/style.css
npm run css        # 編譯一次
npm run build      # 交付前：重新複製 vendor 檔案＋編譯一次 CSS
npm run check      # 檢查各頁的 head、頁首、頁尾、搜尋抽屜與登入對話框是否與範本一致
npm run vendor     # 只重新複製 Bootstrap JS 與圖示字型（npm install 時會自動執行）
npm run images     # 重新生成圖片（需要已登入的 codex CLI，換圖時才用）
```

## 頁面

| 頁面 | 檔案 | 樣式 | 狀態 |
|---|---|---|---|
| 首頁 | `index.html` | `scss/pages/_home.scss` | 完成 |
| 課程列表 | `courses.html` | `scss/pages/_courses.scss`、`components/_course-row.scss` | 完成 |
| 課程詳情（以「從零開始的手捏陶」示範，含試看） | `course.html` | `scss/pages/_course.scss`、`components/_player.scss`、`components/_curriculum.scss`、`components/_purchase-card.scss`、`components/_rating.scss` | 完成 |
| 課程播放／學習頁（手捏陶 3-2） | `learn.html` | `scss/pages/_learn.scss`、`components/_player.scss`、`components/_curriculum.scss`、`components/_terminal.scss` | 完成 |
| 註冊 | `register.html` | `scss/pages/_register.scss`、`components/_form-fields.scss`、`components/_hud-parts.scss` | 完成 |
| 購買課程（只做手捏陶） | `checkout.html` | `scss/pages/_checkout.scss`、`components/_course-summary.scss`、`components/_form-fields.scss`、`components/_hud-parts.scss`、`components/_purchase-card.scss` | 完成 |
| 付款結果 | `order-result.html` | `scss/pages/_order-result.scss`、`components/_course-summary.scss`、`components/_hud-parts.scss` | 完成 |
| 我的課程 | `my-courses.html` | `scss/pages/_my-courses.scss`、`components/_beam.scss` | 完成 |
| 購買紀錄 | `orders.html` | `scss/pages/_orders.scss`、`components/_chips.scss` | 完成 |
| 設計 Guideline | `guideline.html` | `scss/pages/_guideline.scss` | 完成 |

「樣式」欄是預定的檔名，做頁面時照這個命名，並在 `scss/main.scss` 加 `@import`。頁面上沒有列出所有頁面的導覽：依學生流程從首頁點進各頁（首頁 → 課程列表 → 課程詳情 →「立即購買，開始上課」→ 登入對話框（或「立即註冊」→ 註冊）→ 購買課程 → 付款結果 →「前往我的課程」→ 我的課程 →「繼續上課」→ 學習頁；我的課程的「購買紀錄」→ 購買紀錄）。Guideline 直接開 `guideline.html`。

### 各頁構圖原則

每一頁的構圖都要和 01 極致暗黑劇院、02 北歐、04～06 拉開，不能只換配色。下面是這一套各頁的骨架，做頁面時照這個排：

| 頁面 | 構圖 |
|---|---|
| 首頁 | 置中標題與兩顆按鈕在上，下面一面寬銀幕（992px 以上 21:9、768～991px 16:9、以下 4:3），HUD「正在播放」小卡壓在銀幕左下內側（768～991px 跨在銀幕左下緣、575px 以下置中跨在下緣）。學得完的理由是 4 個節點串成的水平光束管線（以下直向）；工藝入口是便當格（左 1 大跨 2 列、右上 2 小、右下 1 寬）；熱門課程 4 欄；作品牆＋一塊 HUD 狀態面板（3 項保障，左側薄荷細條）；CTA 是放大網格＋一道橫向光束＋一塊切角面板 |
| 課程列表 | 篩選放在**右側**（3 欄，sticky 的 HUD 面板），左側 9 欄是**單欄清單列**（240px 16:9 縮圖＋資訊＋Oxanium 價格與「免費試看」），工具列（結果數、排序）在清單上方。992px 以下篩選改成從左滑出的 offcanvas，清單列變成上下堆疊的卡片 |
| 課程詳情 | 8：4。左邊播放器（screen 底、切角框、6px 能量光束進度、發光播放頭、等寬時間碼、掃描線）→ 課程資訊 → 章節。章節 Accordion 做成檔案樹（`bi-folder2`／`bi-folder2-open`、等寬單元編號「1-1」、試看用薄荷、鎖定用鎖頭圖示）。講師不做圖左文右：一塊橫向 HUD 名牌（漸層外圈頭像＋姓名職稱｜經歷）→ 介紹 → 作品帶（工作室實景 3:2＋3 件作品排成同高一列）。評價不做摘要左、列表右：頂端一條計數列（768px 以上分數在左、五段分佈橫排成 5 格），排序與評價卡在下面。右邊 sticky 的切角購買卡：Oxanium 32px 價格、漸層主要鈕、violet 外框次要鈕。手機順序：播放器 → H1 → 購買卡 → 其他 |
| 學習頁 | 8：4（992～1199px 改 7：5，側欄 4 欄放不下章名）。分頁籤做成終端機視窗（三個點 `aria-hidden`、等寬標籤、選中＝deck-2＋粉色底線，已寫在 `_base.scss` 的 `.nav-tabs`）。「單元重點」是**終端機筆記**：screen 底、JetBrains Mono、CSS counter 行號；文案「本段重點是拇指下壓時維持約 45 度，底部厚度保留 0.8cm。壓太快會讓底部變薄，入窯容易裂。」在句號處分兩行、字不改，「45 度」「0.8cm」用 `<mark>`（薄荷底＋void 字），前面一個粉色 `>` 提示符號 `aria-hidden`。課程問答的輸入框是 screen 底等寬字；附件下載是 `ls` 風格的清單。右側 sticky HUD 側欄：Oxanium 50%、「已完成 14／28 單元 ‧ 50%」、光束；目前單元用 pink-veil 底＋粉色左條。手機：底部固定「課程章節 14／28」按鈕開 offcanvas-bottom |
| 註冊 | 左 5 欄是一張「全像課程卡」（漸層細框），右 7 欄表單。手機表單在前 |
| 購買課程 | 左 5 欄 sticky 主控台（課程、包含內容、總計、漸層「確認付款 NT$ 2,480」），右 7 欄帳號、付款方式（3 塊切角 radio 面板，選中＝粉框＋紫光，用 `.hud.is-active` 的同一組變數）、發票。手機順序：摘要 → 表單 → 總計＋按鈕（用 `display: contents`＋`order`） |
| 付款結果 | 上方一整列 HUD 狀態（薄荷勾、H1、100% 光束、等寬「100%」）；下方左 5 欄等寬字收據（key：value），右 7 欄已購課程卡＋「接下來」3 節點水平管線（沿用首頁 `.home-pipeline` 的畫法，另寫 `or-` 前綴）＋按鈕 |
| 我的課程 | 標題區：H1 在左、3 個 HUD 計數器在右；等寬篩選分頁籤；2 欄便當格，學習中的手捏陶以 `.is-featured` 跨整列；已完課用薄荷光束（`.beam-done`）＋「再看一次」 |
| 購買紀錄 | 上方系統通知樣式的退費說明（`.notice.is-info`：deck-2＋violet 資訊圖示，不用琥珀）；一塊 HUD「系統日誌」面板，每筆一列（左邊等寬日期／訂單編號、縮圖＋課名、Oxanium 金額、付款方式、狀態徽章＋動作）。不做整排的欄名表頭（會像表格），金額與付款方式每一筆都帶自己的等寬小標籤 |
| Guideline | 標題區（背景網格）右側一塊 HUD 規格面板；下面一條 sticky 的水平等寬錨點列（01～10，992px 以下橫向捲動、停在頂欄下方）；10 節單欄、滿版心寬，每節是 H2＋一塊 HUD 面板，面板裡用等寬小標＋短光束分段（不做 01 的左側目錄）。色票標 hex、角色與對比度；示範哪些光束軌道色可以用（`$beam-track`、`$beam-track-deck` 可以，`$line` 不行） |

## 排版語言

### 格線與版心

- `.container` 最大 1280px（xxl），左右內距 1.25rem（手機）；格線間距 2rem。
- 992px 以上 `body` 左邊留 88px 給導覽軌，版心在剩下的寬度裡置中。
- 區塊節奏：`.section` 上下 56px（手機）／88px（992px 以上）；相鄰區塊之間一條 1px `$line` 分隔線。
- 背景網格（`.grid-bg`，48px）只鋪在首頁 Hero、內頁標題區（`.page-header`）與底部 CTA，長文字下面不鋪。

### 頁首與頁尾

- **同一份** `header.site-header`，只靠 CSS 在 992px 切換：
  - **992px 以上：左側固定導覽軌**。寬 88px、全高、deck 底，右緣 1px 線＋一道直向光束。每項是 64×64 的方塊（圖示＋12px 小字）：首頁、探索課程 → 短光束分隔 → 我的課程、搜尋 → 最下方登入／註冊。目前頁＝deck-2 底＋左側 3px 粉條＋粉字。
  - **992px 以下：頂欄**。高 64px＋底緣 2px 光束（共 66px），品牌、搜尋、登入／註冊（576px 以下換成人像圖示）、選單鈕；選單展開是直向清單。
- 「我的課程」有兩個連結：選單裡的（`li.d-lg-none`）與導覽軌工具區的（`.site-nav-tools`，992px 以下隱藏）。目前頁標示兩個都要加。
- CSS 變數：`--header-offset`（992px 以下 66px、以上 0）；`--sticky-top`（992px 以下 offset＋16px、以上 24px）。sticky 側欄一律寫 `top: var(--sticky-top)`，`html` 的 `scroll-padding-top` 也用它。
- 搜尋抽屜（`#siteSearch`，offcanvas-start）放在頁尾後面、外層 wrapper 之外，不能放進 header 裡，否則會被背景遮罩蓋住。
- 頁尾：deck 底、頂端 2px 光束；品牌＋一句說明（4 欄）、探索課程（7 個分類）、學習保障、關於 Craftory；最下方等寬字版權列。

### 形狀

- **切角**：右上與左下切掉，面板 12px、按鈕與輸入框 8px、標籤 5px。頭像、節點、播放頭是圓形。不用膠囊按鈕，不用一般圓角。
- 切角面板用 mixin `cut-frame`（外形畫在 `::before`、框線畫在 `::after`，元素本身沒有 clip-path），所以焦點外框與 `filter: drop-shadow` 的光不會被切掉。**用了 `cut-frame` 的元素兩個偽元素都被佔用**，要加裝飾請用子元素。
- 狀態只改變數：`--cut-line`（框線色）、`--cut-fill`（底）、`--cut-bw`（框線粗細）、`--cut`（切角大小）。

### 標題階層

| 層級 | 桌機 | 手機 | 字 |
|---|---|---|---|
| Display（首頁 H1） | 72px（1200px 起；992～1199px 56px） | 40px（768px 起 56px） | Noto Sans TC 900，第二行 `.text-beam` 漸層字 |
| H1 | 44px | 32px | Noto Sans TC 700 |
| H2 | 32px | 26px | Noto Sans TC 700，`.section-title` 前面一個 8px 粉色方塊 |
| H3 | 19px | 18px | Noto Sans TC 700 |
| 內文 | 16px／1.8 | 同左 | Noto Sans TC 400 |
| 終端機 | 15px | 14px | JetBrains Mono 400 |
| 價格、統計 | 32px | 28px | Oxanium 700（`.stat`）；卡片價格 20px（`.price`） |

區塊標題列的右側連結用 `.btn-text`（violet-text 底線）。

### 卡片

- 課程卡 `.course-card`：切角面板，封面 16:9（右上跟著切角），封面底緣一道 2px 光束，右下等寬時長標籤；分類＋難度標籤 → 課名（`｜` 後 `<wbr>`）→ 講師 → 評分與人數 → 分隔線 → Oxanium 價格＋「免費試看」。hover＝紫框＋紫光；鍵盤聚焦＝粉框＋粉色外框。
- 工藝情境卡 `.craft-card`：整張是連結；課程數與最短完課時間（等寬 violet 字）常駐顯示，hover／focus 只換框線與光。
- 不做 hover 撐開：hover 不改尺寸、不浮現隱藏資訊，只改顏色、底線、框線、底色或克制的光。

### 招牌元素

| 元素 | 規則 |
|---|---|
| 能量光束 `.beam` | 4px（播放器 `.beam-lg` 6px），軌道 `$beam-track`（放在 deck 面板上用 `.beam-deck`），已填滿部分是紫到粉漸層，前端一顆 10px 粉色發光點（呼吸 3 次後停）。已完課用 `.beam-done`（薄荷）。**一個畫面只有一道在流動**（`.beam-flow`，跑 2 次就停），首頁給了銀幕底緣，學習頁給了播放器進度（`.player-progress.is-flow`）；課程列表、課程詳情沒有流動的光束 |
| 終端機筆記 | 只在學習頁的單元重點與 Guideline 示範出現。提示符號與行號是裝飾（`aria-hidden` 或 CSS counter），不寫 `SYS ONLINE`、`$ run` 這類假指令。游標閃 5 次後停（`components/_terminal.scss`） |
| 導覽軌 | 見上方頁首 |
| HUD 面板 `.hud` | 所有面板與卡片的外框；等寬小標 `.hud-label` 只用既有文字（單元編號、訂單編號、日期），不另編英文標籤 |

### 狀態色

- 成功、已付款、已完課：薄荷 `$mint`。警示、退費處理中：琥珀 `$amber`（虛線框）。錯誤：`$flare`（偏橘），一律加 `bi-x-octagon` 圖示＋虛線框。**電光粉不出現在錯誤情境**。資訊：violet-text。
- 狀態不只靠顏色：標籤有圖示，錯誤與處理中的外框是虛線、不切角。

### 動態

- 只有三種：光束流動（`background-position`，2 次）、光束前端的點呼吸（opacity，3 次）、終端機游標閃爍（5 次）。轉場 .2s，只改顏色與框線。
- Bootstrap 的轉圈（付款處理中、Guideline 的影片載入中）也不無限轉：`.spinner-border` 轉 6 圈（約 4.5 秒）後停（`_base.scss`）。
- `prefers-reduced-motion: reduce` 時全部關閉（`_base.scss` 統一處理），光束顯示靜態漸層。

## 檔案結構

```
03-cyber-style/
├─ *.html                    ← 10 個頁面，每頁完整包含頁首、頁尾、搜尋抽屜與登入對話框
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製（裡面的註解寫了目前頁的標示規則）
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的七個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 23 張課程照片（AI 生成，深夜工藝實驗室調性）、favicon.svg
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫＋切角、光束、網格 token
│  ├─ _mixins.scss           ← 切角（cut-frame、cut-media-top、cut-input）、網格、掃描線、光束線
│  ├─ _base.scss             ← 全站基礎與共用小工具（HUD 面板、按鈕、表單、分頁籤、提示訊息…）
│  ├─ components/            ← 頁首、頁尾、光束、標籤、課程卡、課程列、工藝卡、正在播放小卡、對話框、播放器、章節檔案樹、購買卡、評價、終端機、HUD 小零件、課程摘要、表單欄位
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾、搜尋抽屜、登入對話框是否與範本一致
   └─ generate-images.mjs    ← 生圖腳本（所有圖片的 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾、搜尋抽屜、登入對話框每頁一份**：要改時先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check`。每頁只有一處不同：頁首的目前頁（`active` 與 `aria-current="page"`）：
  - `index.html` → 首頁
  - `courses.html` → 探索課程
  - `course.html` → 探索課程（只加 `active`，不加 `aria-current`）
  - `my-courses.html` → 我的課程（選單裡與導覽軌各一個，兩個都加 `active` 與 `aria-current`）
  - `learn.html`、`orders.html` → 我的課程（兩個都只加 `active`）
  - `guideline.html`、`register.html`、`checkout.html`、`order-result.html` → 不標示
- **新增頁面**：複製範本，改 `<title>`（「頁面名稱｜Craftory 手感工藝線上學院」）、description（結尾一律加「設計稿 03｜AI 賽博學院。」）與頁首的目前頁標示，`<main>` 裡放內容。在 `scss/pages/` 新增 partial、在 `scss/main.scss` 加 `@import`，執行 `npm run check`（目前頁對照表已在 `scripts/check-layout.mjs` 寫好 10 頁）。
- **假資料直接寫在 HTML**：文案照上一層 `../CONTENT.md`，一字不改。同一門課出現在多頁時要同步。
- **JS**：`js/main.js` 只做七件事：搜尋抽屜打開後自動聚焦輸入框、登入對話框依觸發按鈕顯示未登入提示並切換送出目的地（`data-auth-context="purchase"`：送出到 `checkout.html`；其他情境送出到 `learn.html`）、鎖定提示的按鈕關閉對話框後捲到購買卡（`data-scroll-after-dismiss`）、課程列表依網址 `?craft=` 預先選好工藝分類、學習頁側欄「全部收合」（`data-collapse-all`）、分頁籤用方向鍵切換時把目前項目捲進畫面、我的課程的篩選按鈕（`data-filter-list`＋`data-filter`，清單項目寫 `data-status`，切換 `aria-pressed`）。其他互動都靠 Bootstrap 的 `data-bs-*`。
- **換行與空白**：課程名稱在「｜」之後用 `<wbr>` 標出斷點，搭配 `.text-phrase`；數字與單位之間用 `&nbsp;`（`4&nbsp;小時 20&nbsp;分`、`NT$&nbsp;2,480`）。
- **表單**：一律 GET。登入對話框 `action="learn.html"`，欄位沒有 `name`。電子郵件、密碼、卡號、有效期限、安全碼不加 `name`；每個欄位都要有 `id`、`<label for>` 與 `autocomplete`。串接後端時改用 POST 並補上 `name`。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：色彩、字體、間距、切角、光束、元件變數
3. `bootstrap/scss/bootstrap`
4. `bootstrap-icons`（字型路徑指向 `css/fonts/`）
5. `_mixins.scss`
6. `_base.scss`
7. `components/*`：`_header`、`_footer`、`_beam`、`_chips`、`_course-card`、`_craft-card`、`_now-playing`、`_dialogs`、`_course-row`、`_player`、`_curriculum`、`_purchase-card`、`_rating`、`_terminal`、`_hud-parts`、`_course-summary`、`_form-fields`
8. `pages/*`：class 一律加頁面前綴（`home-`、`courses-`、`cd-`、`learn-`、`reg-`、`co-`、`or-`、`mc-`、`orders-`、`gl-`）

原則是**先用 Bootstrap 的變數與工具類別**，真的做不到才寫自訂 CSS，自訂 CSS 只引用變數，不寫死色碼。不要把 `aspect-ratio` 和 `max-height` 寫在同一個元素上。

### 共用類別

下面這些類別跨頁共用，新頁面直接套用，不要在 `pages/*` 另寫一份。

| 類別 | 用途 | 位置 |
|---|---|---|
| `.hud`（`.hud-raised`、`.hud-screen`、`.is-active`）、`.hud-pad`、`.hud-label` | 切角面板：deck 底＋1px 框；`-raised` deck-2 底、`-screen` 播放器黑底；`.is-active` 粉色 2px 框＋紫光（選中的付款方式、目前項目）。`-pad` 面板內距（20／28px），`-label` 等寬小標 | `_base.scss` |
| mixin `cut-frame($cut, $line, $fill)` | 任何要切角外框的元件都用它，狀態改 `--cut-line`／`--cut-fill`／`--cut-bw`；光用 `filter: $glow-filter` | `_mixins.scss` |
| mixin `cut-media-top` | 切角面板裡最上面的圖片，右上跟著切 | `_mixins.scss` |
| mixin `cut-input($c)` | 輸入框的切角（已套在 `.form-control`、`.form-select`）；焦點用內側框線，不用外框 | `_mixins.scss` |
| mixin `grid-bg`、`scanlines`、`beam-line($h)` | 背景網格、掃描線疊層（`::after`）、靜態光束細線 | `_mixins.scss` |
| `.beam`（`-lg`、`-deck`、`-done`、`-nohead`、`-flow`） | 能量光束進度條，寫在 Bootstrap `.progress` 上：`<div class="progress beam" role="progressbar" aria-label="…" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width: 25%"></div></div>` | `components/_beam.scss` |
| `.beam-line` | 裝飾用的 2px 靜態光束線 | `components/_beam.scss` |
| `.chip`（`-cat`、`-level`（`.is-advanced` 粉）、`-duration`、`-trial`、`-lock`、`-playing`、`-done`、`-live`、`-paid`、`-progress`、`-off`、`-refunded`、`-draft`、`-refunding`、`-failed`） | 標籤：5px 切角。草稿、退費處理中、付款失敗不切角、改虛線框，形狀也和其他狀態不同 | `components/_chips.scss` |
| `.course-card`（`-media`、`-body`、`-tags`、`-title`、`-teacher`、`-stats`、`-foot`、`-trial`） | 課程卡（markup 照首頁 `#featured`） | `components/_course-card.scss` |
| `.course-rail` | 課程卡列：992px 以下橫向捲動（卡寬 80%／45%，scroll-snap），以上 4 欄；搭配 `.bleed-x` | `components/_course-card.scss` |
| `.craft-card`（`-media`、`-body`、`-title`、`-craft`、`-meta`） | 工藝情境卡 | `components/_craft-card.scss` |
| `.now-playing`（`-label`、`-signal`、`-body`、`-thumb`、`-course`、`-unit`、`-foot`） | 首頁的「正在播放」HUD 小卡 | `components/_now-playing.scss` |
| `.auth-hint`、`.auth-modal-footer` | 登入對話框的未登入提示與底部 | `components/_dialogs.scss` |
| `.modal-content`、`.offcanvas-start`、`.offcanvas-bottom` | 對話框是切角面板＋標題列下的短光束；左抽屜右緣一條線；底部抽屜頂端一道光束 | `components/_dialogs.scss` |
| `.btn-primary` | 漸層主要鈕（8px 切角，hover 深一階＋紫光）。同一組動作只放一個 | `_base.scss` |
| `.btn-outline-primary`、`.btn-outline-light` | violet 外框（低門檻動作，如「免費試看」）；表單框線色外框（次要） | `_base.scss` |
| `.btn-text` | 文字連結型按鈕，violet-text 底線，44px 觸控高度 | `_base.scss` |
| `.nav-tabs` | 終端機視窗風格的分頁籤（等寬字、選中 deck-2＋粉色底線） | `_base.scss` |
| `.notice`（`.is-info`／`.is-success`／`.is-warning`／`.is-error`） | 系統通知：左側 3px 色條＋圖示；錯誤是 flare 虛線框 | `_base.scss` |
| `.section`、`.section-heading`、`.section-heading-link`、`.section-title` | 區塊留白、標題列（左標題＋說明、右連結）、H2 前的粉色方塊 | `_base.scss` |
| `.grid-bg` | 48px 背景網格 | `_base.scss` |
| `.page-header`（`.is-compact`）、`.page-lead` | 內頁標題區（加 `.grid-bg`）：麵包屑 → H1 → 一句說明；課程詳情、學習頁用 `.is-compact`。麵包屑的「／」畫在前一項的後面（`::after`），手機換行時不會出現在下一行開頭 | `_base.scss` |
| `.mono`、`.timecode`、`.num`、`.price`、`.stat`、`.font-display`、`.text-note` | 等寬字（13px）、時間碼、等寬數字、Oxanium 價格／統計、小字說明 | `_base.scss` |
| `.text-beam` | 紫到粉的漸層字（只用在 Display 與大字；不支援 `background-clip: text` 或強制色彩模式時退回 `$text`） | `_base.scss` |
| `.text-phrase` | 只在空白、標點與 `<wbr>` 處換行；不要用在長段落 | `_base.scss` |
| `.avatar-text` | 講師的文字頭像（姓，圓形 deck-2） | `_base.scss` |
| `.stars`、`.rating` | 星等（琥珀） | `_base.scss` |
| `.meta-list` | 拆開排的多項資訊 | `_base.scss` |
| `.bleed-x` | 576px 以下讓橫向捲動列貼齊螢幕兩側 | `_base.scss` |
| `.img-cover` | 圖片框（`object-fit: cover`） | `_base.scss` |
| `.demo-state`（`-tag`、`-heading`、`-item`、`-title`、`-stage`） | 頁面底部的「設計稿狀態示意」，等寬虛線標籤＋虛線框，和正式內容分開 | `_base.scss` |
| `.empty-state`、`.empty-state-icon` | 空狀態：圖示＋一句說明＋一個動作 | `_base.scss` |
| `.site-header`、`.site-rail`、`.site-nav`、`.site-nav-tools`、`.site-rail-btn`、`.site-rail-foot`、`.site-icon-btn` | 頁首（不要在頁面裡改） | `components/_header.scss` |
| `--header-offset`、`--sticky-top` | 頁首高度與 sticky 位置（見上方「頁首與頁尾」） | `_base.scss` |
| `.course-row`（`-media`、`-body`、`-title`、`-meta`、`-foot`、`-trial`） | 課程清單列：768px 起左縮圖右資訊，1200px 起價格與「免費試看」獨立成右欄；整列可點（標題的 `.stretched-link`），「免費試看」浮在上層。資訊列沿用 `.course-card-tags`、`.course-card-teacher` | `components/_course-row.scss` |
| `.player`（`.is-paused`、`.is-loading`、`.is-error`）、`-screen`、`-media`、`-caption`、`-bigplay`、`-controls`、`-progress`（`.is-flow`；`-buffered`、`-played`、`-head`、`-mark`、`-tip`）、`-bar`、`-btn`、`-btn-text`、`-time`、`-spacer`、`-volume`、`-volume-track`、`-speed`、`-message`、`-toast` | 影片播放器：screen 底切角框、掃描線、6px 光束進度（`--played`、`--buffered`）、發光播放頭、「上次看到」常駐標記、等寬時間碼、速度與字幕用 Bootstrap Dropdown（`dropup`）。只有 `.player-media` 套切角裁切，控制列與選單不會被切掉。續看 Toast 放在 `.player` 後面（外層要 `position: relative`），768px 以上浮在播放器左上。`.is-loading`（Guideline 示範）：畫面壓暗、`.player-message` 裡放 `.spinner-border`＋視覺隱藏的「影片載入中」，控制鈕加 `disabled`（`.player-btn:disabled` 換 text-3、不顯示 hover 底） | `components/_player.scss` |
| `.hud-clip` | 切角面板裡的 Accordion 等有底色的內容：子元素沿切角裁切，背景不會蓋到斜角外 | `components/_curriculum.scss` |
| `.hud-accordion` | 面板內的 Accordion（課程章節、常見問題）：項目之間細線、hover deck-2、焦點內側粉框 | `components/_curriculum.scss` |
| `.curriculum-folder`（`.is-open`、`.is-closed`）、`.curriculum-chapter`、`-chapter-no`、`-chapter-name`、`-chapter-meta` | 章節檔案樹的章標題列：資料夾圖示依展開狀態切換，等寬「N 單元 ‧ M 分」 | `components/_curriculum.scss` |
| `.unit-list`、`.unit`（`.is-trial`、`.is-playing`、`.is-locked`、`.is-done`、`.is-todo`）、`-icon`、`-text`、`-no`、`-meta`、`-time` | 樹狀線上的單元列；每種狀態都有圖示＋視覺隱藏文字，播放中 pink-veil 底＋粉色左條＋`aria-current` | `components/_curriculum.scss` |
| `.chapter`、`-heading`、`-toggle`（`.is-static`）、`-state`（`.is-done`、`.is-current`、`.is-partial`、`.is-todo`）、`-name`、`-no`、`-title`、`-count` | 學習頁側欄的章節（Bootstrap Collapse，可多章同時展開） | `components/_curriculum.scss` |
| `.purchase-card`、`-beam`、`-price`、`-actions`、`-title`、`-includes`、`-note`、`-progress` | 切角購買卡；已購買示意換成學習進度光束＋「繼續上課」 | `components/_purchase-card.scss` |
| `.btn-wish`（`.is-on`、`.is-off`） | 願望清單切換鈕（`data-bs-toggle="button"`，文字與愛心由 CSS 依 `.active` 切換） | `components/_purchase-card.scss` |
| `.locked-dialog`、`-icon`、`-static` | 鎖定單元提示的內容；`-static` 是狀態示意用的靜態版 | `components/_purchase-card.scss` |
| `.rating-summary`（`.is-strip`；`-head`、`-score`、`-count`）、`.rating-bars` | 評價總覽：Oxanium 大分數＋五段分佈（`.progress`）。`.is-strip` 是課程詳情的頂端計數列：768px 以上分數在左，五段分佈橫排成 5 格（星數、Oxanium 則數、細長條） | `components/_rating.scss` |
| `.review-card`（`-text`、`-author`）、`.stars-empty` | 評價卡 | `components/_rating.scss` |
| `.segmented` | 等寬的分段切換（`.btn-check`＋`label.btn`，選中 deck-2＋粉色底線） | `components/_rating.scss` |
| `.terminal`、`.terminal-line`、`.terminal-prompt`、`.terminal-cursor` | 終端機筆記：CSS counter 行號、`<mark>` 薄荷螢光、游標閃 5 次 | `components/_terminal.scss` |
| `.terminal-window`、`-bar`、`.terminal-dots` | 終端機視窗外框（分頁籤放在 `-bar` 裡，三個圓點 `aria-hidden`） | `components/_terminal.scss` |
| `.hud-title` | 面板裡的小標題：等寬 14px＋後面一段 3rem 短光束；可以用在 `<h2>`、`<h3>` 或 `<legend>`（`legend` 保留 Bootstrap 的 `float: left`，不壓在 fieldset 框線上） | `components/_hud-parts.scss` |
| `.kv-list` | 等寬的 key：value 清單（`<dl>` 裡每組包一個 `<div>`），key text-3、value text，列與列之間虛線；值可以斷行（電子郵件）。付款結果的收據 | `components/_hud-parts.scss` |
| `.status-ring`（`.is-error`） | 結果訊息的圓形圖示框：成功＝薄荷實線雙圈，`.is-error`＝flare 虛線圈（搭配 `bi-x-octagon`） | `components/_hud-parts.scss` |
| `.course-summary`（`.is-wide`）、`-media`、`-body`、`-title`、`-meta` | 課程摘要：左邊切角小封面（4:3，底緣 2px 光束）、右邊課名 → 講師 → 拆開排的課程資訊。`.is-wide` 在 768px 以上封面改 13rem、16:9。購買課程的主控台、付款結果的購買內容 | `components/_course-summary.scss` |
| `.field`、`.field-check`、`.field-error`、`.terms-link`、`.btn-text.is-inline` | 表單欄位：標籤 → 輸入框 → 說明或錯誤，欄位間 20px；勾選框對齊第一行文字；錯誤文字（flare＋`bi-x-octagon`，放在 `.is-invalid` 欄位後面）；沒有頁面的條款連結（不帶 `href`）；句子裡的文字按鈕 | `components/_form-fields.scss` |
| `.spinner-border` | Bootstrap 的轉圈，轉 6 圈後停（和其他動態一樣不無限動）。付款處理中的按鈕、播放器載入中 | `_base.scss` |
| `.gl-*`（只在 Guideline） | Guideline 自己的排版（錨點列、色票、規格清單、Do／Don't…），不要拿到其他頁用。`.gl-hover`、`.gl-focus` 把 hover 與鍵盤焦點「固定出來」示範，數值和真正的狀態相同：改了按鈕、課程卡、工藝卡、輸入框、分頁籤、單元列、播放器按鈕的 hover／focus 時，`pages/_guideline.scss` 的這兩組也要一起改 | `pages/_guideline.scss` |

### 和方向文件不同的地方

- 首頁「正在播放」小卡：方向寫壓在銀幕右下內側。主圖照 `IMAGES.md` 把手與碗放在右側、左半部留白，小卡 22rem 在 992px 時約佔銀幕寬 41%、高 65%，放右下會蓋住碗，所以改壓在左下內側 24px（768～991px 跨在左下緣）。底緣光束照銀幕的切角（右上、左下）從左下斜邊的盡頭畫到右下直角。
- 首頁學習保障（作品牆在左、3 項保障在右）是方向指定的構圖，和其他套的兩欄排法相近；這一套用 HUD 狀態列（左側薄荷細條）和作品牆的切角拉開，構圖本身照方向保留。
- 首頁銀幕：方向寫「寬度跟內容欄」，但 21:9 在 1240px 寬時會讓 Hero 超出 900px 高的視窗。992px 以上改成 `width: clamp(min(100%, 44rem), (100svh - 頁首 - 26rem) × 21/9, 100%)`，高度跟著視窗，1440×900 時銀幕約 1127×483，Hero 剛好一屏。
- 搜尋鈕在導覽軌與頂欄各一個，兩個都開同一個 `#siteSearch`。
- 註冊：方向要全像課程卡「視覺上醒目」，SPEC 要購買情境提示「層級低於表單」。兩邊都顧到的做法是：全像卡用漸層細框與大圖吸引目光，但卡上沒有按鈕、價格只有 24px；整頁唯一的漸層主要鈕是表單的「完成註冊」。1200px 以上表單固定 38rem 寬，全像卡吃剩下的寬度。
- 錯誤一律用 `bi-x-octagon`（SPEC 寫 `bi-exclamation-circle`），跟這一套的狀態色規則一致：錯誤＝flare＋叉叉＋虛線框。
- 付款結果：「接下來」的 3 節點管線在 1200px 以上才橫排；992～1199px 右欄不到 520px，三欄說明會擠成很窄的直條，所以維持直向（和首頁管線 992px 以下的直向畫法相同）。頂端 100% 光束是裝飾（`aria-hidden`），付款成功的訊息已經寫在 H1。
- 購買課程：992～1199px 主控台比較窄，課程封面縮回 5.5rem、「購買包含」改一欄，課名才不會擠出面板。
- 購買紀錄：1200px 以上的「系統日誌」右欄（`.orders-state`）把狀態徽章和動作疊在一起，跨兩行；1200px 以下 `.orders-state` 是 `display: contents`，徽章在卡片右上、動作在卡片最下面。
- Guideline 的播放器「載入中」：規格只要求在 Guideline 示範，頁面上沒有這個狀態，所以 `.player.is-loading` 只出現在 `guideline.html`；轉圈和光束一樣會停（6 圈）。
- Guideline 的「講師課程狀態卡」（草稿、已下架、已上架對照）是 `pages/_guideline.scss` 的 `.gl-instructor-card`，不做講師後台，所以沒有放進共用元件。
- `_variables.scss` 的 `$btn-grad-hover` 註解原本寫白字 9.03～5.97:1，實算起點 `#6023BF` 是 8.43:1，已更正（數值本身沒改）。

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 面 | 深靛藍 `$void #0B0D2A`（頁面底，不用純黑）、面板 `$deck #13163D`、浮起 `$deck-2 #1B1F52`、銀幕 `$screen #070818`（只給播放器與首頁銀幕） |
| 文字 | `$text #F2F0FF`（標題，16.9:1）、`$text-2 #B9B6E6`（內文，9.86:1）、`$text-3 #9A97D0`（說明、placeholder，6.98:1） |
| 紫 | `$violet #8B5CFF`（光束起點、圖形、大字，4.59:1）、`$violet-text #A98BFF`（連結、資訊、小字，7.08:1） |
| 粉 | `$pink #FF3D9A`（光束終點、色塊）、`$pink-text #FF5CAD`（焦點環、目前導覽、播放中，6.68:1）、`$pink-veil #2B1240`（播放中列的底）。白字不放在粉上 |
| 主要按鈕 | `$btn-grad`：`#6D28D9` → `#D61F7D`（白字全段 ≥ 4.83:1）；hover `#6023BF` → `#BC1B6E`（白字 8.43～5.97:1） |
| 光束 | `$beam`：violet → pink；軌道 `$beam-track #1E2150`、deck 面板上 `$beam-track-deck #22265A` |
| 線 | `$line #2A2F6E`（裝飾框線）、`$grid #1A1D4A`（背景網格）、`$control #6A70C2`（表單框線，非文字 ≥ 3:1） |
| 狀態 | 薄荷 `$mint #45E6A8`、琥珀 `$amber #FFC857`、錯誤 `$flare #FF7A66`，各有 `-veil` 底色；資訊底 `$violet-veil #1E1A4E` |
| 字體 | Noto Sans TC 400／700／900（中文）、Oxanium 600／700（品牌、價格、統計）、JetBrains Mono 400／600（時間碼、編號、標籤、終端機） |
| 切角 | 面板 12px、按鈕與輸入框 8px、標籤 5px；圓角一律 0～2px；頭像與節點圓形 |
| 光 | `$glow-filter`（`drop-shadow(0 0 .75rem rgba(violet, .45))`）只給焦點、播放中、主要鈕 hover |
| 焦點 | void 2px 間隙＋pink-text 2px 外圈；切角元素用 `outline`（粉 2px，offset 2px），輸入框用內側框線 |
| 版心 | `.container` 最大 1280px；導覽軌 88px；頂欄 64＋2px |
| 動態 | 光束流動 2 次、光束點呼吸 3 次、終端機游標 5 次；`prefers-reduced-motion` 時全部關閉 |

### 換色時同步檢查

色票的唯一來源是 `scss/_variables.scss`，但下面幾處把數值寫成文字或寫死，改色（或改頁首高度）時要一起檢查（格式同上一層 [`../README.md`](../README.md) 的「換色時同步檢查」）：

- [ ] `scss/_variables.scss`：色票、`$theme-colors` 與語意變數（`$body-*`、`$input-*`、`$focus-ring-*`、`$btn-grad`、`$beam`、`$beam-track*`、`$glow-*`），以及變數旁註解裡的對比度。
- [ ] `guideline.html`：〈色彩〉色票的 hex、對比度與用途文字，〈Bootstrap 主題色對應〉表格，〈招牌〉三種軌道色的 hex 與對比度，〈Do／Don't〉裡寫出來的色碼與比值（白字放在電光粉上 3.29:1、`$line` 軌道 2.93:1）。色塊本身由 `scss/pages/_guideline.scss` 的 `$gl-swatches` 從變數產生，不用手改。
- [ ] 本檔：「Design token 摘要」的 hex 與對比度。
- [ ] 改了頁首高度（導覽軌 88px、頂欄 64＋2px）時：`_base.scss` 的 `--header-offset`、`--sticky-top`（購買卡、學習頁側欄、課程列表篩選、購買課程主控台的 sticky `top` 與 `scroll-padding-top` 都用它），Guideline〈間距〉的頁首高度文字，以及 Guideline 錨點列與各節的 `scroll-margin-top`（`pages/_guideline.scss`）。
- [ ] `scripts/generate-images.mjs` 的 `STYLE`：整組圖片的色調（深靛藍暗場、紫與洋紅輪廓光），換色後重新生圖。
- [ ] `templates/page.html` 與每一頁的 `<meta name="theme-color" content="#0B0D2A">`，以及 `images/favicon.svg` 裡的色碼。

## 圖片

`images/` 的 23 張圖片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名照上一層的 [`../IMAGES.md`](../IMAGES.md)。調性是「深夜的工藝實驗室紀錄片」：深靛藍的暗場，一盞主光落在手與材料上，兩側帶一點紫與洋紅的輪廓光；畫面裡沒有螢幕、全像、霓虹招牌或文字，科技感只交給介面。學員作品牆的兩張是夜裡在家用手機拍的質感。替換時保持相同檔名即可，不需改程式。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`：

```bash
npm run images                                            # 產生缺少的圖片
node scripts/generate-images.mjs --only hero,player-learn # 只重做指定的圖
node scripts/generate-images.mjs --force                  # 全部重做
```

codex 只輸出 3:2、2:3、1:1 三種比例，腳本會把 16:9 與 4:5 的圖置中裁切後縮放成 `IMAGES.md` 的輸出尺寸。
