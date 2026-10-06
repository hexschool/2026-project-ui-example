# 04｜人文書院風：Craftory 手感工藝線上學院

> 淺色系＋暖色系（竹青綠、杏仁黃、深墨色）。章節名稱使用典雅宋體，進度圓環細緻，適合文學、哲學或美學生活講堂。

概念是「一座線上書院」：每門課是一冊線裝書，課程詳情是扉頁與目錄，學習頁是攤開的書與書案上的進度羅盤。宣紙底、深墨字，竹青是唯一的動作色，杏仁黃是重點與色帶，播放器是夜墨。大膽只花在兩處：**明體（宋體）的章節名稱**，與**細緻的進度圓環**（1px 軌道＋2px 弧線，外圈 28 格單元刻度）。其他地方只用書冊的小語彙點到為止：目錄點線、文武邊雙框、界欄直線、「工」字白文方印、文楷批註。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（與 `01-電商主題` 各風格相同架構）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。這是**單一淺色主題**（`$enable-dark-mode: false`），作業系統切到深色模式時畫面不會跟著變。
- **JS**：互動都交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的五個小功能。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西。

**要修改樣式**：

```bash
npm install        # 安裝 bootstrap、bootstrap-icons、sass，並把 Bootstrap JS 與圖示字型複製進專案
npm run watch      # 開發時：監看 scss/，存檔就重新編譯 css/style.css
npm run css        # 編譯一次
npm run build      # 交付前：重新複製 vendor 檔案＋編譯一次 CSS
npm run check      # 檢查 5 個頁面的 head、頁首、頁尾（與登入對話框）是否與範本一致
npm run vendor     # 只重新複製 Bootstrap JS 與圖示字型（npm install 時會自動執行）
npm run images     # 重新生成圖片（需要已登入的 codex CLI，換圖時才用）
```

改完 SCSS 後重新整理瀏覽器即可。建議用 VS Code 的 Live Server 之類的擴充功能開啟，存檔會自動重新整理；直接雙擊 HTML 也可以。

## 頁面

| 頁面 | 檔案 | 樣式 |
|---|---|---|
| 設計 Guideline | `guideline.html` | `scss/pages/_guideline.scss` |
| 首頁 | `index.html` | `scss/pages/_home.scss` |
| 課程列表 | `courses.html` | `scss/pages/_courses.scss` |
| 課程詳情（以「從零開始的手捏陶」示範） | `course.html` | `scss/pages/_course.scss` |
| 課程播放／學習頁（手捏陶 3-2） | `learn.html` | `scss/pages/_learn.scss` |

頁面上沒有列出所有頁面的導覽：從首頁依學生流程點進各頁即可（首頁 → 課程列表 → 課程詳情 →「立即購買，開始上課」→ 登入對話框 → 學習頁；頁首「我的課程」→ 學習頁），Guideline 直接開 `guideline.html`。

- 課程詳情只做一頁靜態示範，所有課程卡都連到 `course.html`，「免費試看」連到 `course.html#trial`。
- 播放器、續看、試看／鎖定、未登入、篩選結果等動態功能用靜態畫面呈現；看不到的狀態放在該頁底部的「設計稿狀態示意」：課程列表（篩選沒有結果）、課程詳情（點了鎖定單元、已購買）、學習頁（完成一章、全課完成、影片載入失敗、還沒有任何課程）。
- 首頁的工藝情境卡連到 `courses.html?craft=pottery` 這類網址，課程列表會預先選中該分類（課程卡不會跟著變）。

## 檔案結構

```
04-scholar-style/
├─ *.html                    ← 5 個頁面，每頁完整包含頁首、頁尾與登入對話框
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的五個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 23 張 AI 生成的照片（書齋午後光）＋ favicon.svg（「工」字方印）
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫
│  ├─ _base.scss             ← 全站基礎、按鈕、標籤、書冊語彙與共用小工具
│  ├─ components/            ← 頁首、頁尾、進度圓環、播放器、課程卡、章節清單、購買卡、對話框
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾是否與範本一致，以及頁首的目前頁標示
   └─ generate-images.mjs    ← 生圖腳本（所有圖片的 prompt、裁切比例與輸出尺寸）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾、登入對話框每頁一份**：沒有元件系統，所以 5 個頁面各自完整寫一份。要改的時候先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check` 確認全部一致。每頁只有一處不同：頁首的目前頁標示（`active` 與 `aria-current="page"`）：首頁 → 首頁、課程列表 → 探索課程、課程詳情 → 探索課程（只加 `active`）、學習頁 → 我的課程、Guideline 不標示。`check-layout.mjs` 也會檢查這一點。
- **新增頁面**：複製範本成新頁，改 `<title>`、description 與頁首的目前頁標示，並在要連進來的地方補上連結。最後在 `scss/pages/` 新增 partial、在 `scss/main.scss` 加一行 `@import`，並把檔名加進 `scripts/check-layout.mjs` 的頁面清單。
- **假資料直接寫在 HTML**：課程、單元、進度的數字都寫死在頁面裡，來源是主題層的 `CONTENT.md`（§1～§8 Notion 原文、§9 補充資料）。同一份資料會出現在多頁，例如手捏陶的 28 個單元同時在課程詳情（未購買與已購買兩份）與學習頁側欄，學習進度 14／28 在學習頁側欄、手機抽屜按鈕與 Guideline，改動時要多頁同步。
- **JS**：`js/main.js` 只做五件事：登入對話框依觸發按鈕（`data-auth-context="purchase"`）顯示未登入提示並換主要按鈕文字、關閉鎖定提示後捲到購買卡（`data-dismiss-to`）、啟用進度條上「上次看到 07:18」的 tooltip、學習頁側欄「全部收合」（`data-collapse-all`）、課程列表依 `?craft=` 預先選中分類。其他互動（選單、分頁、Accordion、下拉、Offcanvas、Modal、Toast、願望清單切換）都靠 Bootstrap 的 `data-bs-*`。
- **換行與空白**：課程名稱的「｜」前半段包在 `.text-nowrap` 裡、後面接 `<wbr>`，只會在「｜」之後換行；短標題用 `.text-phrase`（`word-break: keep-all`）＋ `<wbr>` 標出詞組斷點；數字與單位之間用 `&nbsp;`（`4&nbsp;小時&nbsp;20&nbsp;分`、`NT$&nbsp;2,480`）。章名「第 1 章」與章名之間是 Notion 原文的全形空白，不要刪。
- **表單**：設計稿沒有後端。登入對話框用 `<form action="learn.html">` 直接前往學習頁（視為登入成功）；課程問答送出回到本頁。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、字體、間距、圓角、元件）
3. `bootstrap/scss/bootstrap`：用上面的變數編譯出整套 Bootstrap
4. `bootstrap-icons`：圖示字型與 class（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字距、換行規則、焦點樣式、按鈕、標籤、區塊與頁首節奏、書冊語彙
6. `components/*`：頁首、頁尾、進度圓環、播放器、課程卡、章節清單、購買卡、對話框
7. `pages/*`：各頁專屬樣式，class 一律加頁面前綴

原則是**先用 Bootstrap 的變數與工具類別**，真的做不到才寫自訂 CSS，而且自訂 CSS 也只引用變數，不寫死色碼。想換風格，主要改 `_variables.scss`。唯一的例外是課程詳情的 8：4 版面用 CSS Grid（`.course-layout`）：右側購買卡要跨過左欄的兩段內容才能 sticky 陪著整頁，手機時又要插在兩段中間，Bootstrap 的 row 做不到。

### 共用類別

下面這些類別跨頁共用，新頁面直接套用，不要在 `pages/*` 另寫一份。用法與示範都在 `guideline.html`。

| 類別 | 用途 | 位置 |
|---|---|---|
| `.page-header`、`.page-lead` | 內頁頁首：麵包屑 → h1 → 一句說明 | `_base.scss` |
| `.section`、`.section-band`、`.section-heading`、`.section-heading-row` | 區塊上下留白 64／96px、杏仁黃色帶、明體 h2（左側竹青短線）＋說明、標題列（左標題右連結） | `_base.scss` |
| `.text-phrase` | 課程名稱與短標題只在空白與 `<wbr>` 處換行；不要用在長段落 | `_base.scss` |
| `.font-serif`、`.font-kai`、`.quote-kai` | 明體；文楷（只用在學員引言、評價、鼓勵文案） | `_base.scss` |
| `.num`、`.price` | 等寬數字；明體價格 | `_base.scss` |
| `.btn-text` | 文字連結型按鈕，內建 44px 觸控高度 | `_base.scss` |
| `.tag`＋`.tag-trial`／`-lock`／`-playing`／`-done`／`-progress`／`-draft`／`-live`／`-off` | 書籤式小標籤：分類、難度、試看、鎖定、播放中、已完課、學習進度、草稿／已上架／已下架 | `_base.scss`、`pages/_course.scss` |
| `.toc-row`（`-label`、`-fill`、`-value`） | 目錄點線：左文字＋點線導引＋右數字（篩選分類、章節列） | `_base.scss` |
| `.jielan`、`.jielan-sm／md／lg` | 界欄：指定斷點以上，欄與欄之間畫一條直線 | `_base.scss` |
| `.frame-wenwu` | 文武邊：外 2px 深墨＋內 1px 深界線的雙框，只用在購買卡 | `_base.scss` |
| `.seal` | 「工」字白文方印（品牌標誌） | `_base.scss` |
| `.avatar-text`、`.stars`、`.rating` | 講師文字頭像（明體的姓）、星等、「★ 4.9」 | `_base.scss` |
| `.segmented` | 切換鈕組（`btn-check`＋`btn-group`），例如「最有幫助／最新」 | `_base.scss` |
| `.demo-state`（`-tag`、`-item`、`-title`、`-stage`） | 頁面底部的「設計稿狀態示意」，以虛線和正式內容分開 | `_base.scss` |
| `.empty-state`、`.empty-state-icon` | 空狀態：細圓框圖示 → 一句說明（明體）→ 一個動作 | `_base.scss` |
| `.bleed-x`（mixin `bleed-x`） | 576px 以下讓橫向捲動列貼齊螢幕兩側 | `_base.scss` |
| `.progress-ring`（`-ticks`、`-track`、`-bar`、`-value`、`-group`、`-text`） | ★ 進度羅盤：細圓環＋28 格單元刻度，`--value` 控制百分比 | `components/_progress-ring.scss` |
| `.ring-mini`（`.is-empty`、`-check`、`-play`） | ★ 迷你圓環：章節進度、手機抽屜按鈕、評價的學習進度 | `components/_progress-ring.scss` |
| `.player`（`.is-paused`、`.is-playing`）＋ `-ui`、`-caption`、`-bigplay`、`-controls`、`-progress`、`-btn`、`-error`、`-spinner`、`.player-wrap`、`.player-toast`、`.btn-on-dark` | 播放器（夜墨）：未播放、播放中、載入中、載入失敗、續看 Toast | `components/_player.scss` |
| `.course-card`、`.course-scroller` | 課程卡；首頁熱門課程的橫向捲動列（≥ 992px 變 4 欄） | `components/_course-card.scss` |
| `.curriculum`、`.chapters`、`.chapter-title`、`.unit`（`.is-playing`、`.is-locked`、`.is-done`、`.is-todo`） | ★ 章節清單：課程詳情的目錄式 Accordion、學習頁側欄；章名用明體 | `components/_curriculum.scss` |
| `.purchase-card`、`.wishlist-btn` | 購買卡（搭配 `.frame-wenwu`）、願望清單切換 | `components/_purchase-card.scss` |
| `.auth-notice`、`.locked-dialog`、`.locked-icon`、`.locked-text` | 登入對話框的未登入提示、鎖定單元提示 | `components/_modal.scss` |

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 紙 | 宣紙 `$paper #F6F0E2`（頁面底）、素箋 `$sheet #FCF9F1`（卡片、輸入框、購買卡、側欄）、杏仁黃 `$almond-light #F1E5C8`（熱門課程色帶、目前單元底）、杏仁 `$almond #E6CF98`（試看徽章、播放器已播放、深色底焦點環）、熟杏 `$almond-deep #A97922`（星星、目前單元刻度，只作圖形 3.4:1） |
| 竹 | 竹青 `$bamboo #36694F`（主要按鈕、連結、圓環、成功，5.6:1）、深竹 `$bamboo-deep #2A5440`（hover、焦點環、CTA 色帶，7.6:1）、竹霜 `$bamboo-mist #E2EADF`（已完成淡底、文字頭像）、嫩竹 `$bamboo-light #8FB09A`（深色底上的圖形） |
| 墨 | 深墨 `$ink #1E2321`（主文字、頁尾，14.0:1）、淡墨 `$ink-muted #575D58`（次要文字，5.9:1）、淺墨 `$ink-faint #6A6F68`（placeholder，4.5:1）、夜墨 `$night #161A17`（播放器）、霧宣 `$paper-muted #B9B5A6`（深色底上的次要文字） |
| 線 | 界線 `$line #DCD2BE`、深界線 `$line-strong #BFB39B`（裝飾）、表單框線 `$control #8D8470`（非文字 3.3:1） |
| 語意色 | 成功＝竹青、提醒＝赭石 `$ochre #8A5A12`、錯誤＝朱砂 `$cinnabar #A8382B`、資訊＝黛藍 `$indigo #34557A`，都能直接當文字 |
| 字體 | Noto Serif TC 500／600（品牌、標題、課程名稱、章節名稱、價格）；Noto Sans TC 400／500／700（內文、介面，行高 1.8）；LXGW WenKai TC（學員引言、評價、鼓勵文案） |
| 圓角 | 2px（徽章、時長、圖片）／4px（按鈕、輸入框、卡片）／6px（播放器、對話框、購買卡）；圓形只給頭像、圓環、radio、播放鈕 |
| 陰影 | 兩階、帶一點墨色，只給浮起的東西（sticky 購買卡、下拉選單、正在播放小卡、Toast、對話框）；其他分層靠線 |
| 焦點 | 宣紙 2px 間隙＋深竹 2px；播放器（夜墨）與頁尾上改用杏仁 |
| 頁首 | 高 69px（`$site-header-height`）；sticky 位移 93px（`$sticky-top-offset`） |
| 動態 | 進度圓環載入時畫一次、正在播放的三根小直條、hover 的圖片微放大；`prefers-reduced-motion` 時全部關閉 |

完整規範請看 `guideline.html`。改色時，Guideline 的色票 hex、對比度與其他寫死色碼的地方也要一起改，清單見上一層 [`../README.md`](../README.md) 的「換色時同步檢查」（本風格另外要檢查 `images/favicon.svg` 的竹青與素箋、`theme-color` 的宣紙）。

## 圖片

`images/` 的 23 張圖片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名、比例與主體照主題層的 [`../IMAGES.md`](../IMAGES.md)。調性是「書齋的午後」：側窗斜照的暖光、牆上的竹影、宣紙般的杏仁米色、深墨色的木桌、青瓷綠釉；人物以手部特寫為主，講師林子謙的頭像與工作室照是同一人。替換時保持相同檔名即可，不需改程式。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`（codex 只產 3:2、2:3、1:1，腳本會用 `sips` 從中央裁成 16:9、4:5、3:2、1:1 並縮放成 IMAGES.md 的輸出尺寸）：

```bash
npm run images                                       # 產生缺少的圖片
node scripts/generate-images.mjs --only hero,craft-bowl # 只重做指定的圖
node scripts/generate-images.mjs --force             # 全部重做
CONC=1 node scripts/generate-images.mjs              # 並行數（預設 2）
```

換成其他風格時，改腳本裡的 `STYLE`（整組圖的共同調性）與各張描述即可。
