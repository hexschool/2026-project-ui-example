# 04｜獨立出版文藝：島造 ISLANDMAKE 在地製造提案平台

> 淺色系＋冷色調（鉛字黑、霧灰藍、象牙白）。像翻閱雜誌般的專案介紹頁面，階層標題鮮明，交付時間軸呈現精緻刻度感。

概念是「《島造》，一本每週出刊的在地製造誌」：每個提案是一篇專題報導，首頁是封面與目次，專案細節是攤開的跨頁專題，個人頁是讀者自己的帳本。視覺取自活版印刷：象牙白的紙、鉛字黑的墨、製版用的霧灰藍線。分層靠**版線**（髮絲線、2px 粗線、粗細雙線、欄線），不靠陰影；明體只用 400／700／900 三個字重，標題與內文的字重差拉到最大。

大膽只花在兩處：

1. **精緻刻度的交付時間軸**：排程尺（一個月一道長刻度、一週一道短刻度，里程碑標在所在月份）、帶細刻度的垂直時間軸、延遲範例的迷你尺，以及儀表板「剩餘天數」下方一天一格的募資倒數刻度。
2. **雜誌專題式的專案故事**：特粗明體大標＋明體導言、第一段首字放大、h2 上方短粗線、全欄寬圖片配圖說、摘錄原文的引文、雜誌規格欄式的規格表。首頁大標在桌機改成直排，像書封。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（架構同 [`../../01-電商主題/01-luxury-style/`](../../01-電商主題/01-luxury-style/)）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。這是**單一淺色主題**：不使用 `data-bs-theme`，作業系統切成深色時畫面維持象牙白紙＋鉛字黑字。
- **JS**：互動都交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的五個小功能；頁面不寫 `<script>`。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西（字體從 Google Fonts 載入，離線時會退回系統字體）。

**要修改樣式**：

```bash
npm install        # 安裝 bootstrap、bootstrap-icons、sass，並把 Bootstrap JS 與圖示字型複製進專案
npm run watch      # 開發時：監看 scss/，存檔就重新編譯 css/style.css
npm run css        # 編譯一次
npm run build      # 交付前：重新複製 vendor 檔案＋編譯一次 CSS
npm run check      # 檢查 5 個頁面的 head、頁首、頁尾是否與範本一致，以及頁首的目前頁標示
npm run vendor     # 只重新複製 Bootstrap JS 與圖示字型（npm install 時會自動執行）
npm run images     # 重新生成圖片（需要已登入的 codex CLI，換圖時才用）
```

## 頁面

| 頁面 | 檔案 | 樣式 | 設計稿狀態示意（頁面底部） |
|---|---|---|---|
| 設計 Guideline | `guideline.html` | `scss/pages/_guideline.scss` | 本身就是狀態總覽：18 則狀態文案、全部狀態徽章、兩種角色的側邊導覽並排、頁首登入／未登入、同一張圖的淺色底與深色底 |
| 首頁 | `index.html` | `scss/pages/_home.scss` | —（「正在發生的提案」4 個分頁可切換） |
| 專案列表 | `projects.html` | `scss/pages/_projects.scss` | S6 篩選無結果 |
| 專案細節與贊助方案選擇（以「一只走十年的台南帆布包」示範） | `project.html` | `scss/pages/_project.scss` | 即將開始（S3）、已結束成功（S4）、已結束失敗（S5）、未登入點擊贊助（S1）、付款失敗（S10）、未選擇方案、里程碑逾期（S16）、留言區為空（S9）；生產排程區內另有「里程碑延遲時」 |
| 個人頁面「我的島造」 | `account.html` | `scss/pages/_account.scss` | 5 種贊助徽章總覽（含已達標待生產）、S7、S8、提案募資失敗（S5）、已下架（S14）、S15 |

- 頁面上沒有列出所有頁面的導覽：從首頁依流程點進各頁即可，Guideline 直接開 `guideline.html`。
- 專案細節只做一頁靜態示範，首頁與列表的所有專案卡都連到 `project.html`。
- 個人頁預設是**提案者**畫面；頁首右側的「以提案者檢視／以贊助者檢視」可以切換角色，`account.html?role=backer` 直接開贊助者畫面（沒有提案群組、多一張升級入口卡、提案區塊改成 S17 權限提示）。
- 會真的動的互動：回饋方案選取與小計（換方案、快捷加碼、低於方案金額時顯示錯誤並停用下一步）、贊助紀錄與留言的篩選、角色切換、首頁分頁、主視覺輪播、里程碑照片展開、FAQ、追蹤按鈕、手機的篩選浮層與個人頁下拉導覽。

## 檔案結構

```
04-indie-press-style/
├─ *.html                    ← 5 個頁面，每頁完整包含頁首與頁尾
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的五個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 23 張專案與情境照（AI 生成，獨立出版紀實攝影調性）、favicon.svg
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫＋語意色調、刻度、長文的自訂變數
│  ├─ _base.scss             ← 全站基礎與共用類別（.status、.callout、.chip、.section-heading…）
│  ├─ components/            ← 頁首、頁尾、募資數字、專案卡、方案卡、時間軸、長文、留言、圖表、個人頁導覽
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾是否與範本一致，以及目前頁標示
   └─ generate-images.mjs    ← 生圖腳本（STYLE 與 23 張 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾每頁一份**：要改時先改 `templates/page.html`，再同步到 5 頁，最後執行 `npm run check`。每頁只有一處不同：頁首導覽的目前頁（首頁→首頁、專案列表→探索專案、個人頁→我的島造，加 `active` 與 `aria-current="page"`；**專案細節標「探索專案」只加 `active`、不加 `aria-current`**；Guideline 不標示）。`check-layout.mjs` 會逐頁檢查這個對應。
- **新增頁面**：複製範本成新頁，改 `<title>`、description 與頁首的目前頁標示；在 `scss/pages/` 新增 partial、在 `scss/main.scss` 加一行 `@import`；若要標示目前頁，在 `check-layout.mjs` 的 `expectedNav` 加一筆。
- **假資料直接寫在 HTML**：8 件專案的金額、達成率、人數、天數照主題的 `CONTENT.md`，同一個專案在首頁、列表、專案細節、個人頁的數字都相同（帆布包 NT$ 1,235,600／目標 NT$ 500,000／247%／1,042 人／剩 12 天）。改資料時要多頁同步。Notion 原文本身對不上的數字（`CONTENT.md` 附錄 A）照原文，沒有「修正」。
- **進度條的刻度位置**寫在 `style="--goal: 40.5%"`（目標 ÷ 已募），未達標的專案寫 `--fill`；數值見 `CONTENT.md` 附錄 B.5。
- **圖表**：每日募資與累積金額是 inline SVG（`viewBox 0 0 640 186`，座標照 `WIREFRAME_SPEC.md` §3.04），SVG 裡不寫色碼，只寫 class；顏色由 `components/_chart.scss` 的 CSS 變數決定，外層加 `.is-dark` 就是深色底版本。方案分佈是 HTML／CSS 橫條（`style="--w: 86.7%"`）。每張圖都有可展開的數據表。
- **JS**：`js/main.js` 只做五件事：手機搜尋列展開後自動聚焦、分頁籤用方向鍵切換時捲進畫面、回饋方案選取與贊助小計（`[data-pledge]`）、篩選按鈕（`data-filter-list` ＋ `data-filter` 對應 `data-status`，贊助紀錄與留言共用）、角色切換（`data-role`＋`?role=backer`）。
- **換行與空白**：專案名、短標題加 `.text-phrase`，用 `<wbr>` 標出詞組斷點；數字與單位之間用 `&nbsp;`（`1,042&nbsp;人`、`剩 12&nbsp;天`）。
- **沒有目的頁的按鈕**（了解如何提案、下一步：填寫收件資訊、編輯、更新進度…）用 `<button type="button">`；佔位連結（頁尾的關於島造、追蹤中的專案…）是不帶 `href` 的 `<a>`。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、語意色調、字體、間距、圓角、元件、刻度與長文變數）
3. `bootstrap/scss/bootstrap`
4. `bootstrap-icons`：圖示字型與 class（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字距、換行、焦點、版線、區塊節奏與共用類別
6. `components/*`：`_header`、`_footer`、`_funding`、`_project-card`、`_tier`、`_timeline`、`_story`、`_comment`、`_chart`、`_account-nav`
7. `pages/*`：各頁專屬樣式（`home-`、`plist-`、`pd-`／`dash-`、`acct-`、`gl-` 前綴）

原則是**先用 Bootstrap 的變數與工具類別**，做不到才寫自訂 CSS，自訂 CSS 也只引用變數、不寫死色碼。想換風格，主要改 `_variables.scss`。

### 共用類別

| 類別 | 用途 | 位置 |
|---|---|---|
| `.page-head`、`.page-lead` | 首頁以外的頁面標題區：麵包屑 → H1 → 一句說明，底部髮絲線 | `_base.scss` |
| `.section`、`.section-sm`、`.section-mist` | 區塊上下留白 64／96／120px、緊湊區塊、霧面冷調區塊 | `_base.scss` |
| `.section-heading`（`.is-center`） | 區塊標題：上方 2px 鉛字黑粗線橫跨版心，右側可放連結；置中版改成標題下方短線 | `_base.scss` |
| `.rule`、`.rule-ink`、`.rule-double`、`.column-rules` | 髮絲線、墨線、粗細雙線；欄與欄之間的 1px 欄線（992px 以下改成每欄上方的橫線） | `_base.scss` |
| `.text-phrase` | 專案名與短標題只在空白與 `<wbr>` 處換行 | `_base.scss` |
| `.num`、`.tnum`、`.amount` | Newsreader 比例數字、等寬數字、大金額 | `_base.scss` |
| `.kicker`、`.lead` | 分類等小標籤（不用全大寫英文）；明體導言 | `_base.scss` |
| `.img-frame` ＋ `.ratio-16x9`／`4x3`／`4x5`／`1x1`、`.img-label`、`.img-badge` | 固定比例圖片框；圖上的分類標籤與右上徽章 | `_base.scss` |
| `.avatar`（`.avatar-text`、`-lg`、`-xl`） | 圓形頭像；留言者用名字第一個字的文字頭像 | `_base.scss` |
| `.btn-accent`、`.btn-text`（`.is-danger`）、`.btn-icon`、`.btn-follow` | 強調按鈕（深霧藍）、文字連結按鈕（44px 觸控高度）、44px 圖示按鈕、追蹤（愛心空心／實心） | `_base.scss` |
| `.status` ＋ `.is-live`／`info`／`warn`／`ok`／`err`／`idle`（`.is-dashed`）、`.status-dot` | 狀態徽章：圖示或圓點＋文字，6 種語意色調由 `$tones` 產生 | `_base.scss` |
| `.callout` ＋ `.is-*`、`.callout-title` | 提示框：左側 3px 色線＋淡底＋圖示，不放關閉鈕 | `_base.scss` |
| `.chip`（`.chip-count`、`.is-applied`、`.chip-remove`） | 篩選標籤（搭配 `.btn-check`）；選中是鉛字黑底＋勾 | `_base.scss` |
| `.demo-state`、`.demo-state-tag`、`.demo-state-title`、`.demo-case`、`.demo-state-stage` | 頁面底部的「設計稿狀態示意」，以虛線和正式內容分開 | `_base.scss` |
| `.empty-state` | 空狀態：線性圖示 → 一句明體文案 → 一個動作，置中、最大寬 32em | `_base.scss` |
| `.fund-bar`（`.is-full`、`.is-over`、`-lg`、`-sm`） | 募資進度條：未達標實心、剛好達標滿格＋刻度、超額滿格＋目標刻度＋深霧藍斜紋 | `components/_funding.scss` |
| `.day-ruler`、`.slot-bar` | 募資倒數刻度（一天一格）；限量格（一格一個名額） | `components/_funding.scss` |
| `.figures`、`.meta-line`、`.stat-row`／`.stat`／`.stat-value` | 標籤＋數字；以欄線分隔的一列小字資料；數據卡列（`.stat.is-ok` 強調） | `components/_funding.scss` |
| `.project-card`、`.project-row`、`.tag-list`／`.tag`、`.time-alert` | 首頁的格狀專案卡、列表的橫式專案列、細框小標籤、剩 ≤ 7 天的時間警示 | `components/_project-card.scss` |
| `.tier`（`.is-soldout`、`.is-low`）、`.tier-btn`、`.pledge-card`、`.pledge-rows` | 回饋方案卡 4 種狀態；自訂金額與贊助小計 | `components/_tier.scss` |
| `.sched-ruler`、`.timeline`（`.is-done`／`is-live`／`is-todo`／`is-delay`）、`.delay-ruler` | 招牌元素：排程尺、帶刻度的垂直時間軸、延遲的迷你尺 | `components/_timeline.scss` |
| `.story`、`.story-part`、`.story-dropcap`、`.story-pullquote`、`.story-figure`、`.story-specs` | 招牌元素：雜誌專題式長文（最大 720px） | `components/_story.scss` |
| `.comment-list`、`.comment`、`.comment-reply`、`.comment-form` | 兩層留言；提案者回覆縮排、淡霧藍底 | `components/_comment.scss` |
| `.chart-card`（`.is-dark`）、`.chart-scroll`、`.bar-chart`、`.chart-table` | 圖表卡（SVG 用 class 上色）、手機橫捲容器、HTML／CSS 橫條圖、數據表 | `components/_chart.scss` |
| `.account-nav`、`.account-nav-link`、`.account-nav-count`（`.is-unread`）、`.account-upgrade` | 個人頁側邊導覽（Guideline 的權限狀態也用） | `components/_account-nav.scss` |
| `.for-proposer`、`.for-backer` | 只在某一種角色顯示的元素（依外層 `data-role`） | `pages/_account.scss` |

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 紙與面 | 象牙白 `$ivory #F5F2EA`（頁面底、`theme-color`）、白報紙 `$paper #FBFAF6`（卡片、輸入框、儀表板、生產排程區塊）、霧面 `$mist #DFE5E9`（「正在發生的提案」、頁尾）。面與面只差一點明度，邊界交給版線 |
| 墨 | 鉛字黑 `$ink #1C1F23`（14.8:1）、鉛灰 `$ink-muted #555B62`（6.1:1）、淡鉛灰 `$ink-faint #5E646A`（placeholder、停用字，5.4:1） |
| 版線 | 版線 `$rule #CFD3D4`（裝飾）、深版線 `$rule-strong #A7AEB2`（虛線框、未開始刻度）、表單框線 `$control #788087`（3.6:1）；粗線 `$rule-heavy 2px`、雙線 `$rule-double 3px double` |
| 霧灰藍 | 霧灰藍 `$slate #71899A`（只當圖形，3.3:1）、深霧藍 `$slate-deep #36536A`（強調按鈕、選取框、焦點環、圖表數據，7.2:1）、淡霧藍 `$slate-tint #E1E9EF`（選取底）、亮霧藍 `$slate-light #A3B9C8`（深色底的圖表數據） |
| 語意色調 | `live #2F5470／#E1E9EF`、`info #5B4E85／#EAE6F2`、`warn #83560A／#F5EBD3`、`ok #2C6A4B／#DFEDE4`、`err #A2392A／#F6E1DC`（校對紅）、`idle #585E64／#E7E7E4`；文字對自己的底色都 ≥ 5.3:1 |
| 按鈕 | 主要：鉛字黑底＋象牙白字（一組動作只放一個）；強調 `.btn-accent`：深霧藍底；次要：鉛字黑細框；深色底 `.btn-light`；停用一律虛線框＋淡鉛灰字，不疊透明度 |
| 字體 | Noto Serif TC 400（長文、導言）／700（區塊標題）／900（H1、Display、專題 h2）；Noto Sans TC 400／500／700（介面）；Newsreader（英數、金額、刻度數字）。不用全大寫英文眉標 |
| 長文 | 最大寬 720px、明體 17px／行高 1.95、段距 24px、h2 28px（上 3.5rem／下 1rem）、h3 20px |
| 圓角 | 0（印刷品的裁切邊）；只有頭像、狀態圓點、radio、開關、時間軸節點是圓的 |
| 陰影 | 只給浮起來的層：sticky 儀表板、手機底部行動列、下拉選單、圖表提示框 |
| 焦點 | 深霧藍 2px 外框（外推 2px 露出底色）；深色底上改成象牙白 |
| 版面 | 容器最大 1320px、左右 20px（≥ 992px 32px）、gutter 32px；頁首 71px、sticky 位移 95px |
| 動態 | 只有進行中里程碑的脈動光暈與圖片 hover 微放大，`prefers-reduced-motion` 時停用 |

完整規範請看 `guideline.html`。改色時，Guideline 的色票 hex、對比度、深色底圖表的對照表，以及 `images/favicon.svg`、`templates/page.html` 與各頁的 `theme-color` 要一起改，清單見上一層 [`../README.md`](../README.md) 的「換色時同步檢查」。

## 圖片

`images/` 的 23 張圖片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名、比例與畫面主體照主題層的 [`../IMAGES.md`](../IMAGES.md)，與 02、03 相同。調性是獨立出版雜誌的紀實攝影：陰天北向窗光、低彩度冷調（象牙白、霧灰藍、鉛字黑）、細底片顆粒，物件保留原本的顏色（帆布的原胚、墨綠、炭黑）。替換時保持相同檔名即可，不需改程式。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`：

```bash
npm run images                                              # 產生缺少的圖片
node scripts/generate-images.mjs --only hero-canvas-bag     # 只重做指定的圖（逗號分隔，不含 .jpg）
node scripts/generate-images.mjs --force                    # 全部重做
CONC=1 node scripts/generate-images.mjs                     # 並行數（預設 2）
```

換成其他風格時，改腳本裡的 `STYLE`（整組圖的共同調性）與各張描述即可。
