# 02｜綠色永續生活：島造 ISLANDMAKE 在地製造提案平台

> 淺色系＋暖綠調（初生綠、森林墨綠、原木褐）。溫和的圓角進度條，贊助方案卡片留白舒適，專案圖文區易於 SEO 爬蟲索引。

概念是「**苗圃**」：每個提案是一株正在長的苗，平台要做的是把「長到哪裡了」清楚寫在標示牌上。畫面是明亮的再生紙底和大量留白，綠色只用來說「正在長」與「已經長到」，原木褐是工坊與材料的溫度。語氣溫和、不催促：不用促銷紅、不用倒數閃爍，急迫感只留給剩 7 天內的時間警示。

Notion 的三個視覺特點，各對應一個招牌元素：

1. **生長條**（溫和的圓角進度條）：粗的全圓角進度條。達成的部分是森林墨綠；超過目標後「新長出來」的部分換成初生綠，兩段之間一道刻痕＝目標 100%。
2. **留白舒適的方案卡**：全站留白最多的元件，28px 圓角、桌機 36／40px 內距；選取時 2px 森林墨綠框＋淡初生綠底＋實心勾。
3. **易於索引的圖文區**：專案故事用 `article`、5 個 `h2`、`figure`＋`figcaption`、HTML 表格；儀表板的數字用 `dl`＋`data`＋`time`；麵包屑加 BreadcrumbList 微資料。Guideline 第 03 章畫出 `project.html` 的文件大綱。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。這是**單一淺色主題**：不使用 `data-bs-theme`，作業系統切成深色模式時畫面維持淺色。
- **JS**：互動都交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的五個小功能。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西（字體從 Google Fonts 載入，離線時會退回系統字體）。

**要修改樣式**：

```bash
npm install        # 安裝 bootstrap、bootstrap-icons、sass，並把 Bootstrap JS 與圖示字型複製進專案
npm run watch      # 開發時：監看 scss/，存檔就重新編譯 css/style.css
npm run css        # 編譯一次
npm run build      # 交付前：重新複製 vendor 檔案＋編譯一次 CSS
npm run check      # 檢查 5 個頁面的 head、頁首、頁尾是否與範本一致
npm run vendor     # 只重新複製 Bootstrap JS 與圖示字型（npm install 時會自動執行）
npm run images     # 重新生成圖片（需要已登入的 codex CLI，換圖時才用）
```

改完 SCSS 後重新整理瀏覽器即可。建議用 VS Code 的 Live Server 之類的擴充功能開啟，存檔會自動重新整理；直接雙擊 HTML 也可以。

## 頁面

| 頁面 | 檔案 | 樣式 | 設計稿狀態示意（頁面底部） |
|---|---|---|---|
| 設計 Guideline | `guideline.html` | `scss/pages/_guideline.scss` | 頁首未登入、權限狀態兩種側邊導覽、18 則狀態文案、S18 管理員佇列為空 |
| 首頁 | `index.html` | `scss/pages/_home.scss` | —（「正在發生的提案」4 個分頁可以切換） |
| 專案列表 | `projects.html` | `scss/pages/_projects.scss` | S6 篩選無結果 |
| 專案細節與贊助方案選擇（以帆布包示範） | `project.html` | `scss/pages/_project.scss` | 即將開始、已結束（成功）、已結束（失敗）、未登入點擊贊助、付款失敗、未選擇方案、里程碑逾期、留言區為空；生產排程下方另有「延遲狀態範例」 |
| 個人頁面「我的島造」 | `account.html` | `scss/pages/_account.scss` | 5 種贊助徽章、贊助紀錄為空、追蹤清單為空、提案募資失敗、提案已下架、提案者尚無專案 |

- 頁面上沒有列出所有頁面的導覽：從首頁依流程點進各頁即可，Guideline 直接開 `guideline.html`。
- 專案細節只做一頁（P1 一只走十年的台南帆布包），首頁與列表的專案卡都連到 `project.html`。
- **角色切換**：`account.html` 預設是提案者畫面；頁面標題區右側的「以提案者檢視／以贊助者檢視」可以切換，或直接開 `account.html?role=backer` 看贊助者畫面（沒有「提案」群組、有角色升級入口、`#my-projects` 位置顯示「這個區域需要提案者身分。」）。
- 可以實際操作的：首頁分頁、專案列表的篩選浮層（< 992px）、回饋方案選取（小計與最低金額即時更新、低於最低金額顯示錯誤）、生產排程照片展開、FAQ、個人頁贊助紀錄分頁篩選、圖表的表格檢視、專案主視覺圖庫（縮圖切換）。

## 檔案結構

```
02-green-style/
├─ *.html                    ← 5 個頁面，每頁完整包含頁首與頁尾
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的五個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 23 張 AI 生成照片（檔名照 ../IMAGES.md）＋ favicon.svg（也是 Logo 標誌）
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫
│  ├─ _base.scss             ← 全站基礎與共用類別
│  ├─ components/            ← 頁首、頁尾、生長條、專案卡、方案卡、時間軸、數據卡、圖表、留言
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾是否與範本一致、目前頁標示是否正確
   └─ generate-images.mjs    ← 生圖腳本（STYLE 與 23 張 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾每頁一份**：沒有元件系統，所以 5 個頁面各自完整寫一份。要改頁首或頁尾時，先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check` 確認全部一致。每頁只有一處不同：頁首導覽的目前頁——首頁標「首頁」、專案列表標「探索專案」、**專案細節也標「探索專案」但只加 `active`、不加 `aria-current`**、個人頁標「我的島造」、Guideline 不標示（`check-layout.mjs` 會檢查這個對應）。
- **`<body>` 的屬性每頁不同**：ScrollSpy 寫在 `<body>` 上（專案細節對應故事目錄 `#storyToc`、個人頁對應側邊導覽 `#acctNav`、Guideline 對應目錄 `#glToc`），專案細節另有 `has-actionbar`（手機底部行動列的留白）。
- **新增頁面**：複製範本成新頁，改 `<title>`、description 與頁首的目前頁標示；在 `scss/pages/` 新增 partial、在 `scss/main.scss` 加一行 `@import`；在 `check-layout.mjs` 的 `expectedNav` 加上這一頁，執行 `npm run check`。
- **假資料直接寫在 HTML**：數字照 `../CONTENT.md`，同一個專案在每一頁都相同（帆布包 NT$ 1,235,600／目標 NT$ 500,000／247%／1,042 人／剩 12 天），改動時要多頁同步。進度條的刻痕位置照 `CONTENT.md` 附錄 B.5，寫在 `style="--target: 40.5%"`。
- **JS**：`js/main.js` 只做五件事——手機搜尋列展開後自動聚焦、分頁籤切換時把目前項目捲進畫面、回饋方案選取與自訂金額、贊助紀錄分頁篩選（`data-filter` 對應 `data-status`，「等待出貨」＝已達標待生產＋生產中）、角色切換（外層 `data-role`＋網址 `?role=backer`）。
- **圖表**：每日趨勢與累積 vs. 目標是 inline SVG（座標照 `WIREFRAME_SPEC.md` §3.04），方案分佈是 HTML／CSS 橫條；顏色全部走 CSS 變數，加 `.chart-dark` 就是深色底版本。每張圖都有「切換表格檢視」。
- **換行與空白**：專案名稱用 `.text-phrase`＋`<wbr>` 標出詞組斷點，數字與單位之間用 `&nbsp;`，「帆布包」「量產備料」不會被拆成兩行。
- **沒有目的頁的按鈕**（了解如何提案、取消贊助、編輯…）：按鈕用 `<button type="button">`，連結用不帶 `href` 的 `<a>`，樣式照常。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、6 種語意色調、字體、間距、圓角、元件）
3. `bootstrap/scss/bootstrap`：用上面的變數編譯出整套 Bootstrap
4. `bootstrap-icons`：圖示字型與 class（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字體、區塊節奏、焦點、按鈕、狀態徽章、提示框與共用小工具
6. `components/*`：頁首、頁尾、生長條、專案卡、方案卡、時間軸、數據卡、圖表、留言
7. `pages/*`：各頁專屬樣式，class 一律加頁面前綴（`home-`、`plist-`、`pd-`、`acct-`、`gl-`）

原則是**先用 Bootstrap 的變數與工具類別**，真的做不到才寫自訂 CSS，而且自訂 CSS 也只引用變數，不寫死色碼。想換風格，主要改 `_variables.scss`。

### 共用類別

下面這些類別跨頁共用，新頁面直接套用，不要在 `pages/*` 另寫一份。用法與示範都在 `guideline.html`。

| 類別 | 用途 | 位置 |
|---|---|---|
| `.page-head`（`.page-head-crumb`）、`.page-lead` | 首頁以外各頁的頁面標題區：葉影色帶＋底線，麵包屑 → h1 → 一句說明 | `_base.scss` |
| `.section`、`.section-tight`、`.section-leaf`／`-kraft`／`-surface`、`.section-heading` | 區塊上下留白 64／96px、背景色、區塊標題（右側可放「看全部」連結） | `_base.scss` |
| `.figure-num`、`.num` | 單獨出現的大數字（圓體、比例字寬）；要上下對齊的數字（`tabular-nums`） | `_base.scss` |
| `.text-phrase` | 專案名稱、短標題只在空白與 `<wbr>` 處換行 | `_base.scss` |
| `.btn-sprout`、`.btn-on-dark`、`.btn-icon`、`.btn-text` | 強調按鈕（初生綠）、深色底按鈕、圓形圖示鈕、文字連結型按鈕（44px 觸控高度） | `_base.scss` |
| `.status` ＋ `.status-live`／`-info`／`-warn`／`-ok`／`-err`／`-idle`（`.status-dashed`、`.has-dot`） | 6 種語意的狀態徽章：圖示＋文字；live 是實心、其他是淡底；已下架加虛線 | `_base.scss` |
| `.callout` ＋ `.callout-ok`／`-warn`／`-err`／`-info`／`-idle` | 左側粗線提示框（不放關閉鈕） | `_base.scss` |
| `.tag`、`.tag-plain` | 分類、地點、限量等標籤 | `_base.scss` |
| `.chip`（`.chip-applied`、`.chip-remove`、`.chip-count`） | 篩選標籤（搭配 `.btn-check`）、已套用的可移除標籤 | `_base.scss` |
| `.nav-underline`＋`.tab-count` | 底線分頁籤（3px 圓頭底線）與數量 | `_base.scss` |
| `.img-frame`、`.ratio-4x5`、`.ratio-3x2` | 圓角圖片框、補 Bootstrap 沒有的比例 | `_base.scss` |
| `.avatar`（`-sm`、`-lg`、`.avatar-text`） | 照片頭像、文字頭像 | `_base.scss` |
| `.table-frame` | 圓角外框的表格（窄螢幕在框內橫向捲動） | `_base.scss` |
| `.demo-state`（`-tag`、`-title`、`-grid`、`-stage`、`-label`） | 頁面底部的「設計稿狀態示意」，以虛線和正式內容分開 | `_base.scss` |
| `.empty-state`、`.empty-state-icon` | 空畫面：線性圖示 → 文案 → 一個行動，置中 | `_base.scss` |
| `.for-proposer`、`.for-backer` | 依外層 `data-role` 顯示或隱藏 | `_base.scss` |
| `.growth`（`-lg`／`-md`／`-sm`、`.is-over`、`.is-full`）、`.growth-mark` | ★ 生長條：未達標 `style="--value: 68%"`、超額 `style="--target: 40.5%"` | `components/_growth.scss` |
| `.project-card`、`.project-row`、`.project-figures`、`.project-meta` | 專案卡（首頁）、專案列（列表 5：7） | `components/_project-card.scss` |
| `.reward`、`.reward-card`（`.is-limited`） | ★ 回饋方案卡：radio＋label，4 種狀態 | `components/_reward.scss` |
| `.timeline`、`.timeline-item`（`.is-done`／`.is-live`／`.is-todo`／`.is-delayed`） | 生產排程時間軸 | `components/_timeline.scss` |
| `.stat-grid`、`.stat-tile`（`.is-ok`）、`.stat-strip` | 數據卡（葉影色塊）、統計列（文字照原文、只放大數字） | `components/_stat.scss` |
| `.chart-card`（`.chart-dark`）、`.chart-svg`、`.bar-list` | 圖表卡、SVG 圖表、HTML 橫條圖 | `components/_chart.scss` |
| `.comment`、`.comment-reply`、`.comment-form` | 留言與提案者回覆 | `components/_comment.scss` |

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 面 | 再生紙 `$paper #F7F6F0`（頁面）、白 `$surface #FFFFFF`（卡片、輸入框、頁首）、葉影 `$leaf #EAF0E0`（交替區塊、頁面標題區、數據卡）、牛皮紙 `$kraft #F1E8DA`（評價、提案者介紹與回覆） |
| 線 | 細線 `$line #DEE2D5`、粗一階 `$line-strong #C3CAB7`（裝飾）、表單框線 `$control #7D877A`（對白 3.7:1）、生長條軌道 `$track #DDE5D0` |
| 文字 | 墨土 `$ink #1F2A22`（13.7:1）、苔灰 `$ink-muted #4E5A51`（6.7:1）、淡苔灰 `$ink-faint #666F67`（4.8:1，不放在葉影上） |
| 品牌 | 森林墨綠 `$forest #24503A`（主要按鈕、連結、焦點環、live；8.5:1、白字 9.2:1）、深林 `$forest-deep #1C3D2C`（頁尾、深色圖表）、初生綠 `$sprout #A9D474`（生長條超額部分、強調按鈕；墨土字 8.8:1，不當淺底文字）、原木褐 `$wood #8A5A36`（分類標籤、引號、目標線；5.4:1） |
| 語意 6 色 | live 森林墨綠實心／info 湖藍 #2C5288／warn 稻穗黃 #7A4A00／ok 青瓷 #12615A／err 赤陶 #A1361F／idle 石灰 #555B54，文字對自己的淡底都 ≥ 5.5:1 |
| 字體 | 圓體 Chiron GoRound TC（500／700：標題、數字、按鈕、標籤）＋黑體 Noto Sans TC（400／500：內文、長文、表單）；內文行高 1.8、長文 17px／1.95 |
| 間距 | 9 階（4、8、16、24、**32**、48、64、96、128px）；容器 1280px、左右 20／32px；區塊上下 64／96px；頁首 72px、sticky 位移 96px |
| 圓角 | 8／12／20／28／40px＋全圓（按鈕、徽章、生長條、篩選標籤） |
| 陰影 | 卡片不加陰影；只給 sticky 儀表板、小計卡、下拉選單、手機底部行動列，顏色是深林的透明版 |
| 焦點 | 森林墨綠 2px 實線＋2px 間隙；深色底換成初生綠 |
| 動態 | 生長條載入時長出一次、進行中里程碑脈動、卡片 hover 微浮；`prefers-reduced-motion` 時全部關閉 |

完整規範請看 `guideline.html`。改色時，Guideline 的色票 hex、對比度與其他寫死色碼的地方（`templates/page.html` 與各頁的 `theme-color`、`images/favicon.svg`、`generate-images.mjs` 的 `STYLE`）也要一起改，清單見上一層 [`../README.md`](../README.md) 的「換色時同步檢查」。

## 圖片

`images/` 的 23 張圖片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名、比例與畫面主體照上一層 [`../IMAGES.md`](../IMAGES.md)（與 03、04 相同）。調性是明亮的自然光紀實攝影：低對比、柔和的散射光，暖綠與原木色，像在地工坊或小農的記錄照；贊助者實拍（`ugc-*`）刻意做成手機隨手拍。人物只拍手部、背影或遠景，只有 `proposer-avatar` 是虛構人物的正面肖像。

- `story-sewing-artisan` 第一次生成時拍到了車縫師的臉，已改 prompt（只拍手與前臂）重新生成；`proposer-avatar` 第一次的臉偏上方，已改成臉在正中央的胸像重新生成（裁成圓形頭像時不會只剩頭頂）。
- `favicon.svg` 不是生成的：森林墨綠圓角方塊＋島上長出的一株新芽，同時當作頁首與頁尾的 Logo 標誌。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`：

```bash
npm run images                                                # 產生缺少的圖片
node scripts/generate-images.mjs --only hero-canvas-bag,ugc-desk-light --force  # 只重做指定的圖
node scripts/generate-images.mjs --force                      # 全部重做
CONC=1 node scripts/generate-images.mjs                       # 一次只跑一張（預設 2）
```

換成其他風格時，改腳本裡的 `STYLE`（整組圖的共同調性）與各張描述即可，檔名不用改。
