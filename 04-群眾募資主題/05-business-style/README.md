# 05｜現代商務創新：島造 ISLANDMAKE 在地製造提案平台

> 淺色系＋冷色系（純白、企業深藍、科技冰灰）。投資回報與專案進度以專業金融級圖表呈現，資訊透明且高度結構化。

概念是「**上市公司年報＋基金月報（factsheet）合在一起的投資人資訊站**」：每個提案是一檔可以查核的標的，平台是一份隨時更新的公開說明書。質感來自財報設計，不是後台範本：純白紙面、企業深藍色帶、整齊的表格與指標列，每張圖都有直接標註，**全站數字等寬**（`tabular-nums`），欄位上下對齊。

- **「投資回報」的解讀**：島造是回饋型募資，不是股權投資。這套把 Notion 的「投資回報」呈現為「贊助換回的回饋內容與交付進度」，**不新增**報酬率、ROI、年化、收益、股權、配息等字眼或數字，只呈現 `CONTENT.md` 已有的數字。
- **克制原則**：不用插畫、不用漸層、不用發光、不用深色面板。深藍只出現在四個地方：頁首上層、首頁 Hero 色帶、登入左面板、頁尾。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（架構同 [`../../01-電商主題/01-luxury-style/`](../../01-電商主題/01-luxury-style/)）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。這是**單一淺色主題**：不使用 `data-bs-theme`，作業系統切成深色時畫面維持白底深字。
- **JS**：互動交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的五個小功能；頁面不寫 `<script>`。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西（字體從 Google Fonts 載入，離線時會退回系統字體）。

**要修改樣式**：

```bash
npm install        # 安裝 bootstrap、bootstrap-icons、sass，並把 Bootstrap JS 與圖示字型複製進專案
npm run watch      # 開發時：監看 scss/，存檔就重新編譯 css/style.css
npm run css        # 編譯一次
npm run build      # 交付前：重新複製 vendor 檔案＋編譯一次 CSS
npm run check      # 檢查 10 個頁面的 head、頁首、頁尾是否與範本一致，以及頁首的目前頁標示
npm run vendor     # 只重新複製 Bootstrap JS 與圖示字型（npm install 時會自動執行）
npm run images     # 重新生成圖片（需要已登入的 codex CLI，換圖時才用）
```

## 頁面

| 頁面 | 檔案 | 樣式 | 狀態 |
|---|---|---|---|
| 設計 Guideline | `guideline.html` | `scss/pages/_guideline.scss` | 完成（左 3 sticky 目錄 ScrollSpy、< 992 改成頁首下方可橫捲的章節列；0 概覽＋9 章，token 全部表格化、< 768 每列變卡片；元件的 hover 與 focus 用 `.is-hover`／`.is-focus` 固定顯示；同一張圖的白底與深色底對照；18 則狀態文案總表；10 組 Do／Don't；S11～S13、S18 只出現在這頁） |
| 首頁 | `index.html` | `scss/pages/_home.scss` | 完成（「正在發生的提案」4 個分頁可切換，每個分頁是領先專案卡＋排行表） |
| 專案列表 | `projects.html` | `scss/pages/_projects.scss` | 完成（篩選器表格＋右側篩選欄，篩選標籤與排序可點選，視窗高度放得下整個面板時才 sticky；狀態示意 S6） |
| 專案細節與贊助方案選擇（以「一只走十年的台南帆布包」示範） | `project.html` | `scss/pages/_project.scss` | 完成（標題帶下緣的全寬募資行情列＋右側 sticky 條款表；方案矩陣可選、贊助小計即時計算、故事目錄 ScrollSpy、留言篩選；狀態示意 S1、S3～S5、S9、S10、S16） |
| 個人頁面「我的島造」 | `account.html` | `scss/pages/_account.scss` | 完成（贊助紀錄篩選、提案者／贊助者切換 `?role=backer`、側欄 ScrollSpy；狀態示意 S7、S8、S14、S15、S17） |
| 登入 | `login.html` | `scss/pages/_auth.scss` | 完成（全出血雙面板 5：7；狀態示意：帳號或密碼錯誤） |
| 註冊 | `register.html` | `scss/pages/_auth.scss` | 完成（同登入的雙面板；狀態示意：欄位有錯誤時） |
| 贊助結帳 | `checkout.html` | `scss/pages/_checkout.scss` | 完成（地址與付款方式是可點選的選擇卡，選「行動支付」時信用卡欄位收起，用 `:has()` 不寫 JS；狀態示意：欄位有錯誤時） |
| 贊助成功 | `order-result.html` | `scss/pages/_checkout.scss` | 完成（步驟條全完成＋對帳單文件） |
| 贊助紀錄詳情（以帆布包這筆募資中的贊助示範） | `backing.html` | `scss/pages/_backing.scss` | 完成（修改收件資訊用 Collapse、取消贊助用 Modal；狀態示意：已達標待生產、生產中、已出貨、募資失敗 ‧ 已退款、確認對話框的靜態樣子） |

- 頁面上沒有列出所有頁面的導覽：從首頁依流程點進各頁即可，Guideline 直接開 `guideline.html`。
- 專案細節只做一頁靜態示範，首頁與列表的所有專案卡都連到 `project.html`。
- 全站維持登入中的提案者「陳柏宇」，登入、註冊、結帳頁的頁首也一樣（頁首不因流程頁改變）。

## 排版語言

這一節是給接手做其他頁的人看的：**共用的是內容，構圖由這一節決定**。同主題的 02、03、04 都是「頂部橫條頁首＋左文右卡首屏＋左篩選列表＋內容左、sticky 儀表板右」，01 是深色左側控制欄與置中主控台，06 是漂浮膠囊與鏡像首屏。這一套要一眼看出是「財報」：深藍雙層頁首、深藍色帶＋跨界事實卡、KPI 列（專案頁是跨在標題帶下緣的行情列）、迷你走勢、排行表、比較矩陣、表格對齊。

### 網格與版心

- 12 欄、gutter 24px、容器最大 1320px（Bootstrap 預設的 540／720／960／1140／1320）；左右留白 16px，≥ 992px 24px。
- 常用比例：**8：4、9：3、6：6、全寬表格**。不用 7：5、5：7。
- 個人頁是「應用程式版面」：左側導覽貼齊頁面左緣（全高 240px），內容區 fluid、最大 1080px。
- 區塊上下留白 48px（手機）／80px（≥ 992px）；區塊之間不用粗線、不用雙線，靠白／冰灰交替與 1px 線分段。白底區塊不要連續太多，否則整頁像一張空白表單。

### 頁首與頁尾

- **頁首（雙層）**：上層 56px `$navy-900`（Logo｜寬搜尋 480px｜我要提案（白框）｜頭像），下層 48px 白底＋底部 1px 線（主導覽 3 項做成底線分頁，目前頁 3px `$blue-600` 底線＋`$ink` 字）。≥ 992px 整個 `header` 用 `position: sticky; top: -56px`，捲動後只剩下層黏住。
- **< 992px**：單層 56px 深藍列（Logo、放大鏡、頭像、選單按鈕）；選單展開成白色面板（主導覽一列 52px、目前頁左側 3px 藍條＋「我要提案」）；放大鏡展開白色搜尋列。
- **sticky 位移**一律用 `$sticky-offset`（72px：≥ 992 是 48＋24，< 992 是 56＋16）。錨點 `scroll-padding-top` 已寫在 `_base.scss`（≥ 992 64px、< 992 72px）。
- `check-layout.mjs` 的限制：保留 `<a class="skip-link"`、`<header class="site-header">`（header 標籤不加 class）、`<footer class="site-footer">`（footer 標籤不加 class）；導覽連結的開始標籤一字不改：`<a class="nav-link" href="…">`，目前頁 `<a class="nav-link active" href="…" aria-current="page">`。
- **頁尾**：`$navy-900`；上方 4 欄（品牌＋贊助者／提案者／平台三組連結，連結 `#AFC0D6`、hover 白字＋底線）、下方 1px 白 12% 線＋版權列。

### 卡片造型（數據卡）

- 白底、1px `$line` 框、6px 圓角、極淡陰影 `0 1px 2px rgba(14,26,43,.05)`；hover／focus 只換框線（`$line-strong`）與陰影加深一階，**尺寸與位置不變**，也不靠 hover 顯示資訊。
- 圖片 4:3 在卡片上緣（上方兩角跟著卡片圓角），圖片下緣 1px 線。分類與時間警示放在**圖片下方**的一列（不疊在圖上）；分類前面一個 6px 深藍方點，像年報的圖例。
- 數字一律「**標籤在上（13px、`$ink-muted`）、數字在下（Plex 600、等寬）**」，兩格之間 1px 直立線（`.kpi-pair`、`.kpi-ribbon`）。
- 面板（條款表、明細、篩選欄）同卡片造型；浮起層（sticky 條款表、下拉、Modal、手機底部行動列）用 `$box-shadow`（`0 8px 24px rgba(14,26,43,.12)`）。不用硬陰影、不用發光、不用深色面板。

### 標題階層

- 字級階差小（約 1.2 倍）、靠字重與位置分層：Display 56px／H1 36px／h2 24px／h3 18px／內文 16px／表格 15px／標籤與註腳 13px。標題一律 Noto Sans TC 700。
- **h2 一律靠左**，下方一行 14px `$ink-muted` 副標（期間 ‧ 單位或一句說明，`.section-sub`；Notion 沒有副標的就不加），右側放輔助動作（`.link-arrow` 連結、匯出按鈕）。全站沒有置中的區塊標題。
- **頁面標題區**（首頁以外）：`$ice-50` 帶＋底部 1px 線 → 麵包屑（分隔 `/`）→ H1 → 一句說明，左對齊（`.page-head`、`.page-lead`）。
- 表格的表頭、KPI 的標籤是 13px／500／`$ink-muted`；不用全大寫英文眉標、不用編號眉標。

### 招牌元素（落實「專業金融級圖表、資訊透明且高度結構化」）

1. **KPI 指標列 `.kpi-ribbon`**：4～5 格橫排、格間 1px 直立線，每格「標籤 → 大數字 → 補充（↑ 今日 +37 用 `.kpi-note.is-up`，`ok` 字色＋`bi-arrow-up-right`）」。原文是一句話的（「共贊助 14 件專案」）只放大數字，其他字用 `.kpi-text` 維持原文。用在：首頁事實卡、專案細節的募資行情列（`.pd-quote`）、個人頁統計列與募資數據、贊助紀錄詳情的專案摘要帶。
2. **累積走勢迷你圖 `.sparkline`**：SPEC §3.04 圖 2 的 20 天累積資料縮放到 `viewBox 0 0 240 96`（座標寫在 `components/_sparkline.scss` 開頭與 `index.html`），面積＋折線（`$blue-600`）、目標虛線（`$ink-muted`，全圖唯一的虛線）、端點圓點；`aria-hidden="true"`，旁邊一定有文字數字，**不加新的標題文案**，標註只用 wireframe 的直接標註（「目標」「09/17 達標」、起訖日期）：「目標」放在目標線**左端上方**（那一段折線還在目標線下面，不會和數據線打架），「09/17 達標」在達標點右下方離虛線 7px，兩者都加白色描邊。載入時描線一次（700ms）。用在：首頁事實卡、專案細節的條款表（240×130 大版）、贊助紀錄詳情的專案摘要帶。
3. **子彈圖式進度條 `.meter`**：L 10px／M 6px／S 4px、2px 圓角；目標前 `$navy-800`、目標後 `$blue-600`、目標處 2px 白縫；L 尺寸用 `.meter-scale` 加刻度字「0」「目標」「247%」。未達標＝深藍填到達成率；剛好達標＝滿格＋末端深色刻度（`.is-full`）。不做動畫。
4. **結構化表格 `.data-table`**：只畫橫線不畫直線、表頭冰灰底 13px、數字欄靠右（`.is-num`）、整列 hover 冰灰底；< 768px 加 `.is-stack` 變成「標籤：值」的卡片。專案列表的**篩選器表格**、首頁的**排行表**（`.lb`：名次｜縮圖｜名稱，下一行「達成率＋共用刻度長條（整條 600%，虛線刻度＝目標 100%）｜目前募得｜贊助人數｜剩餘天數」）、回饋方案的**5 欄比較矩陣**、生產排程的**里程碑追蹤表**、個人頁的**持有明細表**都從這裡延伸；結帳、成功與贊助紀錄頁的「左標籤｜右值」明細改用 `.detail-list`（`components/_detail-list.scss`），同樣只畫橫線、數字等寬。
5. **圖表語法**：標題 h3＋副標（期間 ‧ 單位）＋右上「切換表格檢視」；格線 1px 實線淡色；目標虛線唯一；直接標註；端點圓點；表格檢視的數字右對齊。單一數據色 `$blue-600`，深色底（Guideline）用 `$data-dark #7EB0FF`。

### 各頁構圖原則

| 頁面 | 構圖（和既有 3 套、01、06 都不同的地方） |
|---|---|
| 首頁 | **深藍色帶＋跨界事實卡**：色帶（`$navy-800`＋白 6% 48px 格線）內左 8 欄 H1（≥ 1200 一行）＋副標、右 4 欄按鈕直排靠底；Hero 專案卡是全寬 4 段事實卡，一半壓在色帶上（①16:9 圖｜②分類、提案者、名稱、看這個專案＋追蹤｜③KPI：目前募得（附目標）＋達成率、贊助人數、剩餘天數｜④累積走勢），底部一整條 L 進度條。品牌核心痛點是 4 欄「條款格」（上緣 2px 深藍線）；分類是**類別表**（左 4 標題、右 8 清單，< 768 才變 2 欄小卡）；正在發生的提案是冰灰區塊＋**領先專案卡＋排行表**：每個分頁第 1 件是數據卡（圖片左上角深藍「01」），其餘是排行表 `<ol start="2">`；≥ 1200 且排行表 3 列以上時 4：8 並排、卡片圖片拉高到和排行表同高，排行表只有 2 列的分頁（即將結束、最新上架）與 768–1199 改成橫式卡片 4：8 在上、排行表在下；< 768 卡片直式、排行表每列變小卡；評價＋「保障條款表」6：6；轉換帶 `$ice-100` |
| 專案列表 | 頁面標題區 → 主體 **9：3，篩選欄在右**（992–1199 是 8：4，關鍵字欄才放得下「搜尋專案或提案者」；DOM 順序篩選在前，桌機用 `order-lg-last` 放右邊；面板不在內部捲動，視窗高度放得下整個面板時才 sticky top 72px，三個寬度區間的 min-height 寫在 `_projects.scss`）；左 9 欄「篩選器表格」：工具列（已套用、共 92 件）→ sticky 表頭列（專案｜達成率｜募得金額｜贊助人數｜剩餘天數；純視覺 `aria-hidden`）→ 8 列，每列一個 `<article>`，數字欄右對齊、每格數字前有視覺隱藏的標籤 → 分頁 → S6。< 992 篩選用 `.offcanvas-lg`；< 768 表格列變卡片（縮圖＋名稱，下方 KPI 2×2，介紹截 3 行） |
| 專案細節 | 像股票報價頁：Grid `8fr 4fr`、`grid-template-areas: "crumb crumb" "head who" "quote quote" "media aside" "story aside"`：**麵包屑＋標題區在冰灰帶裡、主視覺上方**，提案者小卡放在色帶右側（和條款表同一欄）；冰灰帶下緣是全寬**募資行情列** `.pd-quote`（目前募得 44px＋目標金額｜達成率＋超額達成｜贊助人數＋今日 +37｜剩餘天數＋截止，1.7：1：1：1，往上壓進冰灰帶 40px，不 sticky）；右 4「條款表」sticky 只放進度與行動（L 進度條＋刻度字 → 募資期間 → 240×130 累積走勢 → 主要按鈕 → 追蹤｜分享 → 安心提示）。回饋方案是**5 欄比較矩陣**（≥ 1200，`subgrid` 讓列對齊）＋矩陣下方**全寬贊助小計列**（不 sticky）；< 1200 改直列卡。生產排程是**里程碑追蹤表**（里程碑｜狀態｜時間｜最新更新，第一欄有垂直連接線與節點）。提案者 4：8、留言 4：8、風險＋FAQ 6：6。手機 areas `"crumb" "media" "head" "quote" "aside" "who" "story"`（行情列 < 768 是 2 欄、目前募得與剩餘天數各占一列；768–991 條款表內左右兩欄：進度｜按鈕），底部固定行動列 |
| 個人頁 | **應用程式版面**：左側導覽貼齊頁面左緣（240px、`$ice-50`、右側 1px 線、sticky top 72px，目前項目左側 3px 深藍條＋白底）；贊助紀錄是**持有明細表**（`<tbody id="backingList">` 的 `<tr data-status>`），提案也是表格（退件原因是緊接的一列跨欄 `err`）；表格放不下時（持有明細 768–1399、提案 768–1199）每列改成兩行的格狀列。募資數據 KPI 列＋圖表 6：6（≥ 1400；更窄時兩張折線圖上下排）＋全寬橫條圖；收件資訊＋帳號設定 8：4 |
| 登入、註冊 | **全出血雙面板 5：7**：左 5 欄滿高到視窗左緣的 `$navy-800` 面板（白色 Logo → H1 → 說明 → 只有線與格線的裝飾折線圖 SVG），右 7 欄白底，表單在 max 440px 欄裡靠左（不包卡片）；手機左面板變成一條深藍帶 |
| 贊助結帳 | 步驟條是**全寬 3 等寬分段追蹤器**（上緣 4px 條：已完成 `$navy-800`＋勾、目前 `$blue-600`、未到 `$line`）→ H1 → **收件｜付款兩張面板並排 6：6**（≥ 1200）→ 摘要是頁面底部**全寬「結帳明細列」**（左 7 方案內容｜右 5 金額 `<dl>`＋按鈕，不 sticky），像一張訂購單 |
| 贊助成功 | 步驟條（全完成）→ **對帳單文件**：880px、靠左對齊的白色文件面板，標頭列（`ok` 圓形勾＋H1）、內部 1px 線分段的明細表 |
| 贊助紀錄詳情 | 頁面標題區 → 全寬**專案摘要 KPI 帶**（≥ 1200 一列：縮圖＋名稱＋提案者＋`live`｜目前達成｜剩幾天｜M 進度條＋迷你走勢｜查看專案；768–1199 兩列；< 768 直排）→ 主體 8：4（左：我的方案「規格表｜金額」、收件資訊、精簡里程碑追蹤表、取消贊助；右：sticky 付款資訊明細表）。每個區塊都是「h2 在框外 → 白色數據框」；DOM 裡付款資訊排在左欄前面，手機順序是摘要 → 付款 → 方案 → 收件 → 進度 → 取消 |
| Guideline | 左 3 sticky 目錄（像文件網站：章節號＋名稱，目前章節左 3px 深藍條）＋右 9 內容；標題帶是「H1＋說明｜文件摘要明細」8：4＋下方 4 格 KPI 列；token 全部表格化（色票、徽章、字級、間距都是財報式表格或規格列）；圖表章白底與 `$navy-900` 深色底同一張圖對照（折線圖 ≥ 1200 並排、橫條圖上下排）；Do／Don't 是上緣 4px ok／err 色線的成對卡片 |

## 檔案結構

```
05-business-style/
├─ *.html                    ← 10 個頁面，每頁完整包含頁首與頁尾
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的五個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 23 張專案與情境照（AI 生成，企業年報攝影調性）、favicon.svg
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫＋語意色調、KPI、長文、頁首高度、進度條的自訂變數
│  ├─ _base.scss             ← 全站基礎與共用類別（.section-heading、.page-head、.status、.callout、.chip…）
│  ├─ components/            ← 頁首、頁尾、進度條、KPI、迷你走勢、數據卡、表格、標籤、圖表、步驟條、明細清單、選擇卡、方案規格表
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾是否與範本一致，以及目前頁標示
   └─ generate-images.mjs    ← 生圖腳本（STYLE 與 23 張 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾每頁一份**：要改時先改 `templates/page.html`，再同步到 10 頁，最後執行 `npm run check`。每頁只有一處不同：下層導覽的目前頁（首頁→首頁、專案列表→探索專案、個人頁→我的島造，加 `active` 與 `aria-current="page"`；**子頁只加 `active`、不加 `aria-current`**：專案細節標「探索專案」、贊助紀錄詳情標「我的島造」；Guideline 與流程頁 `login.html`、`register.html`、`checkout.html`、`order-result.html` 不標示）。
- **新增頁面**：複製範本成新頁（範本開頭的大段骨架註解可以刪掉，`check-layout.mjs` 不比對它），改 `<title>`、description 與目前頁標示；樣式寫在 `scss/pages/` 對應的 partial（已經建好空檔並在 `main.scss` 載入）。
- **假資料直接寫在 HTML**：8 件專案的金額、達成率、人數、天數照主題的 `CONTENT.md`，同一個專案在每一頁的數字都相同（帆布包 NT$ 1,235,600／目標 NT$ 500,000／247%／1,042 人／剩 12 天）。
- **進度條的刻度位置**寫在 `style="--goal: 40.5%"`（目標 ÷ 已募），未達標的專案寫 `--fill`；數值見 `CONTENT.md` 附錄 B.5。
- **數字**：全站已經是等寬數字，不用另外加 class。金額前的「NT$」與數字後的「人」「天」「%」在大數字裡用 `.unit` 縮小一級（`<data value="1235600"><span class="unit">NT$</span> 1,235,600</data>`），文字內容不變；數字與單位之間用 `&nbsp;`。
- **JS**：`js/main.js` 只做五件事：手機搜尋列展開後自動聚焦、分頁籤用方向鍵切換時捲進畫面、回饋方案選取與贊助小計（`[data-pledge]`，矩陣與小計列包在同一個容器裡）、篩選按鈕（`data-filter-list`＋`data-filter` 對應 `data-status`，可以直接用在 `<tbody>` 的 `<tr>`）、角色切換（`data-role`＋`?role=backer`）。
- **「下一步：填寫收件資訊」是連到 `checkout.html` 的 `<a data-pledge-next>`**：沒選方案或金額低於方案時，`main.js` 加上 `.disabled`、`aria-disabled="true"` 與 `tabindex="-1"`。
- **表單**：用 `<form action="目的頁">`；密碼、Email、姓名、手機、地址、卡號欄位都**不加 `name`**；只有地址與付款方式的 radio 帶 `name`。欄位一律有 `id`、`<label for>` 與 `autocomplete`。
- **沒有目的頁的按鈕**（了解如何提案、編輯、更新進度…）用 `<button type="button">`；佔位連結（頁尾的關於島造、追蹤中的專案…）是不帶 `href` 的 `<a>`。注意 Bootstrap reboot 的 `a:not([href]):not([class])` 會把顏色改成 `inherit`，在頁面其他地方放佔位連結時，要在該元件的樣式裡再寫一次顏色（頁尾已經處理）。
- **圖片**：首屏以外的 `<img>` 加 `loading="lazy"` 與 `width`／`height`。工具的全頁截圖不會捲動，所以首屏以下的圖會是空白，這是截圖的限制，不是缺圖。
- **換行**：專案名、短標題加 `.text-phrase`，用 `<wbr>` 標出詞組斷點。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫
3. `bootstrap/scss/bootstrap`
4. `bootstrap-icons`（字型路徑指向 `css/fonts/`）
5. `_base.scss`：等寬數字、區塊節奏、焦點、共用類別
6. `components/*`：`_header`、`_footer`、`_meter`、`_kpi`、`_sparkline`、`_project-card`、`_data-table`、`_tag`、`_chart`、`_step-tracker`、`_detail-list`、`_choice`、`_spec-list`
7. `pages/*`：各頁專屬樣式（`home-`、`plist-`、`pd-`、`acct-`、`auth-`、`co-`、`bk-`、`gl-` 前綴）

原則是**先用 Bootstrap 的變數與工具類別**，做不到才寫自訂 CSS，自訂 CSS 也只引用變數、不寫死色碼。新增元件 partial 時，記得在 `main.scss` 的 components 區加一行 `@import`。

注意 `$spacers` 改成 8px 基準：`1`＝4px、`2`＝8px、`3`＝16px、`4`＝24px、**`5`＝32px**、`6`＝48px、`7`＝64px、`8`＝80px（Bootstrap 預設的 `5` 是 48px，這套要用 `6`）。

### 共用類別

| 類別 | 用途 | 位置 |
|---|---|---|
| `.site-header` 內的 `.site-bar`（上層）、`.site-tabs`（下層）、`.site-brand`、`.site-search`、`.site-avatar`、`.site-icon-btn` | 雙層頁首 | `components/_header.scss` |
| `.site-footer`、`.site-footer-title`、`.site-footer-links`、`.site-footer-copy` | 深藍頁尾 | `components/_footer.scss` |
| `.on-navy` | 深藍底的容器：裡面的焦點環改成 `$data-dark`（頁首上層、Hero 色帶、登入左面板；頁尾已內建） | `_base.scss` |
| `.section`、`.section-sm`、`.section-ice` | 區塊上下留白 48／80px、緊湊區塊、冰灰交替區塊 | `_base.scss` |
| `.section-heading`、`.section-sub`、`.link-arrow` | h2 靠左＋副標＋右側輔助；文字連結＋右箭頭（44px 觸控高度） | `_base.scss` |
| `.page-head`、`.page-lead` | 首頁以外的頁面標題區：冰灰帶＋麵包屑 → H1 → 說明 | `_base.scss` |
| `.label`、`.text-note`、`.num`、`.unit`、`.tnum` | 13px 標籤；註腳；Plex 600 數字；縮小的單位；等寬數字 | `_base.scss` |
| `.text-phrase` | 專案名與短標題只在空白與 `<wbr>` 處換行 | `_base.scss` |
| `.img-frame` ＋ `.ratio-16x9`／`4x3`／`4x5`／`1x1`（`.is-framed`） | 固定比例圖片框（產品照加 1px 框與 4px 圓角） | `_base.scss` |
| `.avatar`（`.avatar-text`、`-sm`、`-lg`、`-xl`） | 圓形頭像；留言者用名字第一個字的文字頭像 | `_base.scss` |
| `.btn-primary`、`.btn-outline-primary`、`.btn-outline-secondary`、`.btn-light`、`.btn-outline-light`、`.btn-text`（`.is-danger`）、`.btn-icon`、`.btn-follow` | 主要（深藍）、強調次要（深藍框）、次要（白底淺框）、深藍底上的主要／次要、文字按鈕、44px 圖示按鈕、追蹤（愛心空心／實心）。停用一律冰灰底＋淡字；焦點是科技藍 2px＋2px 白色間隙（覆寫 Bootstrap 的 `--bs-btn-focus-box-shadow`，預設的半透明光暈對比不足） | `_base.scss` |
| `.nav-underline`、`.tab-count` | 底線分頁籤（選中 3px 科技藍底線，字重不變）、分頁後的數量小灰底 | `_base.scss` |
| `.chip`（`.chip-count`、`.is-applied`、`.chip-remove`） | 篩選標籤（搭配 `.btn-check`），4px 方角；選中是深藍底白字＋勾 | `_base.scss` |
| `.status` ＋ `.is-live`／`info`／`warn`／`ok`／`err`／`idle`（`.is-dashed`）、`.status-dot` | 狀態徽章：4px 方角、淡底深字＋圖示或實心圓點，6 種由 `$tones` 產生；同一個圖示只代表一種意思（已額滿用 `bi-people`，不和募資失敗共用 `bi-slash-circle`），全部狀態見 Guideline 的狀態徽章總表 | `_base.scss` |
| `.callout` ＋ `.is-*`、`.callout-title` | 提示框：左側 4px 色線＋淡底＋圖示，不放關閉鈕 | `_base.scss` |
| `.demo-state`、`.demo-state-tag`、`.demo-state-title`、`.demo-case`、`.demo-state-stage` | 頁面底部的「設計稿狀態示意」，虛線與冰灰底和正式內容分開 | `_base.scss` |
| `.empty-state` | 空狀態：方框線性圖示 → 一句文案 → 一個動作，置中、最大寬 32em | `_base.scss` |
| `.meter`（`.meter-lg`、`.meter-sm`、`.is-full`、`.is-over`）、`.meter-scale`、`.meter-ticks`（`.meter-tick-goal`、`.meter-tick-end`） | 子彈圖式進度條與刻度字 | `components/_meter.scss` |
| `.kpi-ribbon`（`.is-inset`、`.is-ice`；`--kpi-cols`、`--kpi-cols-sm`）、`.kpi`（`.is-ok`）、`.kpi-label`、`.kpi-value`、`.kpi-text`、`.kpi-note`（`.is-up`） | KPI 指標列；格線用「容器底色＋1px gap」畫 | `components/_kpi.scss` |
| `.kpi-pair`（`.is-sm`） | 兩格一組的小 KPI（專案卡的達成率｜目前募得、贊助人數｜剩餘天數） | `components/_kpi.scss` |
| `.sparkline`、`.sparkline-plot`、`.sparkline-grid`／`-area`／`-line`／`-goal`／`-dot`（`.is-solid`）、`.sparkline-note`（`.is-goal`、`.is-cross`、`.is-end`）、`.sparkline-axis` | 累積走勢迷你圖與直接標註 | `components/_sparkline.scss` |
| `.project-card`、`.project-card-body`、`.project-card-meta`、`.project-card-cat`、`.project-card-title`、`.project-card-by`、`.project-card-data` | 數據卡（分類與時間警示在圖片下方、數據區貼底） | `components/_project-card.scss` |
| `.data-table`（`.is-stack`）、`.is-num`、`.is-total` | 財報表格：只畫橫線、表頭冰灰、數字靠右；手機改卡片 | `components/_data-table.scss` |
| `.tag-list`、`.tag`（資訊）、`.tag-link`（可點） | 標籤列：回饋門檻、預計出貨、尚缺項目等資訊標籤是冰灰底 4px 方角；分類標籤可點、白底淺框 | `components/_tag.scss` |
| `.chart-card`（`-head`、`-title`、`-sub`）、`.chart-toggle`、`.chart-scroll`、`.chart`（`.is-dark`）、`.chart-y`／`-plot`／`-x`、`.chart-grid`／`-area`／`-line`／`-target`／`-guide`、`.chart-series`、`.chart-dot`、`.chart-note`（`.is-right`／`-left`／`-above`／`-below`／`-end`／`-plain`）、`.bar-chart`（`-row`、`-label`、`-track`、`-bar`、`-value`、`-note`；`--r`）、`.chart-table-wrap`、`.chart-table`、`.chart-tip`（`-date`、`.is-left`）、`.chart-card.is-dark`（mixin `chart-dark-vars`） | 圖表語法：SVG 繪圖區（`preserveAspectRatio="none"`＋不縮放線寬）疊 HTML 座標字、圓點、直接標註（`--x`、`--y` 百分比）；橫條圖；「切換表格檢視」的數據表。手機圖卡內橫捲。`.chart-tip` 是固定顯示的兩行提示框（日期（星期）／數列＋金額，白底圖用 `$navy-900` 底，深色底圖用白底）；`.chart-card.is-dark` 是整張 `$navy-900` 深色圖卡（數據色換 `$data-dark`），目前只用在 Guideline | `components/_chart.scss` |
| `.home-hero`、`.home-hero-band`、`.fact-card`（`-media`、`-info`、`-kpi`、`-trend`、`-meter`、`-actions`）、`.clause`、`.cat-table`／`.cat-row`、`.home-board`（`-lead`、`-card`、`-rank`）、`.lb`（`-head`、`-head-rate`、`-head-bar`、`-head-goal`、`-list`、`-row`、`-rank`、`-thumb`、`-name`、`-title`、`-meta`、`-by`、`-label`、`-rate`、`-rate-value`、`-bar`、`-nums`）、`.review`、`.terms`、`.propose-band` | 首頁專屬：深藍色帶、跨界事實卡、條款格、類別表、領先專案卡＋排行表（長條寬度 `--w`＝max(達成率, 100%) ÷ 6，裡面的 `.meter` 沿用卡片的 `--goal`／`--fill`）、評價卡、保障條款表、轉換帶 | `pages/_home.scss` |
| `.plist-*`（篩選欄、篩選分組 `.plist-group`／`.plist-legend`、分頁 `.plist-pager`）、`.screener`（`-toolbar`、`-head`、`-list`、`-row`、`-cells`、`-cell`、`-label`、`-value`、`-desc`）、`.sort-list`／`.sort-option` | 專案列表：右側篩選欄（< 992 全螢幕浮層、≥ 992 白色面板整個展開，視窗高度放得下時才 sticky）、篩選器表格（≥ 1200 欄位表格；768–1199 縮圖＋4 格 KPI 列；< 768 卡片）、排序清單 | `pages/_projects.scss` |
| `.pd-layout`、`.pd-band`、`.pd-head`、`.pd-who`、`.pd-quote`（`-kpis`、`-raised`、`-rate`）、`.pd-media`／`.pd-thumbs`、`.pd-terms`（`-progress`、`-actions`、`-meter`、`-period`、`-trend`、`-cta`、`-secondary`、`-note`、`.is-mini`）、`.pd-pagenav`、`.story-toc`、`.story`（`-part`、`-list`、`-figure`、`-specs`）、`.pd-actionbar` | 專案細節：標題帶、提案者小卡、全寬募資行情列、主視覺與縮圖列、sticky 條款表（進度條、走勢、按鈕）、頁內分頁、故事目錄（ScrollSpy）與長文（`.story` 裡的 h2 是章節標題、h3 是段落小標 18px）、手機底部行動列 | `pages/_project.scss` |
| `.tier-matrix`、`.tier`（`.is-soldout`、`.is-low`；`-top`、`-title`、`-content`、`-stock`、`-ship`、`-action`、`-btn`）、`.capacity`、`.pledge-bar`（`-amount`、`-summary`、`-next`）、`.pledge-rows`、`.pledge-total` | 回饋方案 5 欄比較矩陣（≥ 1200 `subgrid` 列對齊；768–1199 橫向卡；選中靠 `:has(.btn-check:checked)`）＋全寬贊助小計列；`.pledge-rows` 是「方案、金額、額外支持、總計」的明細列，結帳與紀錄頁可以沿用 | `pages/_project.scss` |
| `.ms-table`（`-head`、`.ms-list`、`.ms-row` ＋ `.is-done`／`.is-live`／`.is-todo`、`.ms-node`、`.ms-status`、`.ms-when`、`.ms-update`、`.ms-toggle`、`.ms-photos`）、`.ms-summary`、`.ms-delay-demo` | 里程碑追蹤表：第一欄垂直連接線（已完成實線、進行中漸層、未開始虛線）與節點，進行中節點脈動；進度照片用 Collapse | `pages/_project.scss` |
| `.comment-form`、`.comment-list`、`.comment`、`.comment-reply` | 留言表單與留言串（提案者回覆縮排、左側深藍線） | `pages/_project.scss` |
| `.acct`、`.acct-side`／`.acct-nav`（`-group`、`-link`、`-count`）、`.acct-nav-mobile`、`.acct-head`、`.acct-role-switch`、`.acct-wrap`、`.acct-section`、`.acct-tally`、`.acct-table`、`.acct-holdings`、`.acct-proposals`、`.acct-proj`、`.acct-state`、`.acct-actions`、`.acct-figures`、`.acct-period`、`.acct-kpis`、`.acct-charts`、`.acct-address`、`.acct-card`、`.acct-switch`；`.for-proposer`／`.for-backer` | 個人頁：應用程式版面（左側導覽＋fluid 內容區）、統計句列、持有明細表與提案表（768–1399／768–1199 改兩行格狀列、< 768 卡片）、募資數據、收件地址卡、設定卡；`[data-role]` 決定哪些區塊顯示 | `pages/_account.scss` |
| `.step-tracker`、`.step`（`.is-done`、`.is-current`）、`.step-body`、`.step-mark`、`.step-name` | 結帳步驟條：全寬 3 等寬分段，上緣 4px 條＋方角號碼／勾＋步驟名；已完成可連回上一步；< 576 只顯示目前步驟的名稱 | `components/_step-tracker.scss` |
| `.detail-list`（`.is-plain`、`.is-left`、`.is-stack-xs`）、`.is-total`、`.detail-sub` | 對帳單式明細清單（`<dl>`）：左標籤｜右值、列間 1px 線、合計列上方深線＋加粗；放在有框的面板裡用 `.is-plain`，地址這類長文字用 `.is-left` | `components/_detail-list.scss` |
| `.choice-group`、`.choice`、`.choice-input`、`.choice-main`、`.choice-head`、`.choice-name`、`.choice-line`、`.choice-icon`、`.choice-extra` | 選擇卡（收件地址、付款方式）：radio 在 label 外、整張卡可點；選中＝科技藍框＋上緣 4px 深藍條＋深藍底白勾；`.choice-extra` 只在選中時顯示（`:has()`，不寫 JS） | `components/_choice.scss` |
| `.spec-list`、`.spec-list-strong`、`.reward-items` | 方案規格表（左標籤、右內容靠左）與回饋內容方點清單；結帳摘要與贊助紀錄的「我的方案」共用，金額那半邊用 `.pledge-rows` | `components/_spec-list.scss` |
| `.auth`、`.auth-aside`（`-inner`）、`.auth-brand`、`.auth-title`、`.auth-lead`、`.auth-chart`（`-grid`、`-area`、`-line`、`-goal`、`-dot`、`-base`）、`.auth-main`、`.auth-form-wrap`、`.auth-form`、`.auth-field`、`.auth-label-row`、`.auth-link`、`.auth-forgot`、`.auth-check`、`.auth-submit`、`.auth-switch`、`.auth-demo` | 登入、註冊：全出血雙面板（左深藍面板延伸到視窗左緣、≥ 992 sticky；右側 440px 表單欄）；`.auth-link` 是不帶 `href` 的佔位連結 | `pages/_auth.scss` |
| `.co-head`、`.co-body`、`.co-panel`（`-head`、`-title`）、`.co-add`、`.co-card-fields`、`.co-pay-note`、`.co-summary`（`-head`、`-grid`、`-items`、`-total`）、`.co-proj`（`-thumb`、`-name`、`-by`）、`.co-spec`、`.co-demo-stage`、`.co-demo-fields`；`.or-title`、`.or-check`；`.stmt`（`-row`、`-title`、`-eta`、`-eta-note`、`-foot`、`-actions`） | 贊助結帳：共用標題帶、收件｜付款兩張面板、全寬結帳明細列；贊助成功：標題帶裡的 ok 圓形勾、880px 對帳單文件 | `pages/_checkout.scss` |
| `.bk-head`（`-row`、`-meta`、`-sep`）、`.bk-back`、`.bk-body`、`.bk-summary`（`-main`、`-thumb`、`-id`、`-title`、`-by`、`-data`、`-trend`、`-action`）、`.bk-block`（`-head`）、`.bk-box`、`.bk-aside`、`.bk-plan`（`-eta`）、`.bk-address`、`.bk-ship-*`、`.bk-progress`（`-more`）、`.bk-cancel`、`.bk-dialog`（`-title`、`-static`、`-static-foot`）、`.bk-case`（`.is-muted`）、`.bk-mini`（`-thumb`、`-title`、`-by`、`-terms`、`-state`）、`.bk-demo-block`、`.bk-demo-label` | 贊助紀錄詳情：專案摘要 KPI 帶、「h2 在框外 → 白色數據框」的區塊、sticky 付款資訊、修改收件資訊的展開表單、精簡里程碑追蹤表（992–1399 改堆疊列）、取消贊助對話框；狀態示意的縮小版專案摘要 | `pages/_backing.scss` |
| `.gl-head-row`、`.gl-head-meta`、`.gl-head-kpis`、`.gl-body`、`.gl-toc`（`-title`、`-list`、`-num`、`-foot`）、`.gl-chapters`、`.gl-section`（`-title`）、`.gl-sec-num`、`.gl-block`（`-title`）、`.gl-note`、`.gl-panel`（`-body`）、`.gl-sheet`、`.gl-stage`（`.is-bleed`）、`.gl-demo-label`、`.gl-table`（`tr.gl-group`）、`.gl-cell-flex`、`.gl-mix`（`-seg`、`-legend`）、`.gl-swatch`、`.gl-font-sample`、`.gl-t-*`、`.gl-type-sample`、`.gl-pnum`、`.gl-num-col`、`.gl-story-demo`、`.gl-scale`（`-bar`、`-use`）、`.gl-layouts`／`.gl-layout`（`-name`、`-file`、`-figs`、`-note`）、`.gl-cols`、`.gl-radius-demo`、`.gl-shadow-grid`／`.gl-shadow`、`.gl-rule-demo`、`.gl-rows`／`.gl-row`（`.is-navy`；`-name`、`-meta`）、`.gl-samples`／`.gl-sample`、`.gl-state-label`、`.gl-form-grid`、`.gl-meter-cell`、`.gl-tier-matrix`、`.gl-ms`、`.gl-delay`、`.gl-chip-row`、`.gl-roles`、`.gl-nav-demo`、`.gl-header-demo`（`-bar`、`-actions`、`-tabs`）、`.gl-fake-search`、`.gl-callouts`、`.gl-actionbar-demo`、`.gl-chart-pair`、`.gl-chart-stack`、`.gl-dash`（`-trend`）、`.gl-copy-table`、`.gl-copy-text`、`.gl-copy-icon`、`.gl-empty-pair`、`.gl-dd`（`-title`、`-pair`、`-item` ＋ `.is-do`／`.is-dont`、`-tag`、`-stage`、`-why`）與錯誤示範用的 `.gl-dd-*`；固定顯示狀態用的 `.btn.is-hover`、`.btn.is-focus`、`.form-control.is-focus`、`.chip.is-hover` | Guideline 專屬：標題帶與文件摘要、左側 sticky 目錄（ScrollSpy）與手機章節列、token 表格（< 768 每列變卡片、標籤固定寬靠左）、規格列（左名稱＋右示範）、10 頁欄位示意、深淺圖表對照、Do／Don't 成對卡片。`.is-hover`／`.is-focus` 只在這頁用來把互動狀態畫出來，正式頁面不要用 | `pages/_guideline.scss` |

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 面 | 純白 `$white #FFFFFF`（頁面、卡片、輸入框）、科技冰灰 `$ice-50 #F4F6F9`（交替區塊、頁面標題區、側欄）、`$ice-100 #E9EEF3`（表頭、KPI 列底、轉換帶） |
| 字 | 主文字 `$ink #0E1A2B`（17.5:1）、次要 `$ink-muted #46566A`（7.5:1）、淡 `$ink-faint #5E6C7F`（5.35:1，只放白與 `$ice-50`） |
| 線 | `$line #DCE2EA`（分隔、軌道，裝飾）、`$line-strong #C3CDD8`（hover 框、次要按鈕框）、表單框線 `$control #7A8797`（3.7:1） |
| 企業深藍 | `$navy-900 #0A1F3C`（頁首上層、頁尾、`theme-color`）、`$navy-800 #0F2D57`（主要按鈕、Hero 色帶、進度條目標前段）；深藍底上的字：白、`#C9D6E8`（9.3:1）、連結 `#AFC0D6`（8.9:1）、次要 `#9FB3CF`（7.7:1） |
| 科技藍 | `$blue-600 #1F5FD1`（單一數據色、連結、進度條超額段，5.8:1）、`$blue-700 #1A4FB5`（live 文字、連結 hover，7.4:1）、`$blue-50 #E7EEFC`（選中淡底）、深色底數據 `$data-dark #7EB0FF`（對 navy-900 7.5:1） |
| 語意色調 | `live #1A4FB5／#E7EEFC`（6.4）、`info #5A3FB8／#EEEAFA`（6.3）、`warn #8A5200／#FFF2D4`（5.8）、`ok #0E6B47／#E2F3EB`（5.7）、`err #B3261E／#FCEAE8`（5.6）、`idle #4B5563／#EEF1F4`（6.7） |
| 字體 | Noto Sans TC 400／500／700（中文）；IBM Plex Sans 400／500／600／700（西文與數字）；**全站 `tabular-nums lining-nums`**；不用明體、圓體、等寬字體 |
| 字級 | Display 56px／1.15、H1 36px、h2 24px（＋14px 副標）、h3 18px、內文 16px／1.7、表格 15px、標籤 13px；KPI 32px、專案行情列目前募得 44px、達成率 36px；長文 17px／1.85、欄寬 680px |
| 圓角 | 卡片、面板、圖表卡 6px；按鈕、輸入框、徽章、篩選標籤 4px；進度條 2px；頭像圓形。沒有膠囊 |
| 陰影 | 卡片 `0 1px 2px rgba(14,26,43,.05)`；hover 加深一階；浮起層 `0 8px 24px rgba(14,26,43,.12)`；Modal `0 16px 40px rgba(14,26,43,.16)`。不用硬陰影、不用發光 |
| 焦點 | 科技藍 2px 外框（外推 2px 露出底色）；深藍底上改 `$data-dark` |
| 間距 | 8px 基準：4／8／16／24／32／48／64／80；區塊上下 48／80px；gutter 24px |
| 版面 | 容器最大 1320px、左右 16px（≥ 992px 24px）；頁首上層 56px＋下層 48px；`$sticky-offset` 72px |
| 動態 | 迷你走勢與折線圖載入時描線一次（700ms）；進行中里程碑的藍環脈動（2.4s）；進度條不動；`prefers-reduced-motion` 時全部關閉 |

完整規範請看 `guideline.html`。改色時照下面的清單一起改（主題共通的版本在上一層 [`../README.md`](../README.md) 的「換色時同步檢查」）。

### 換色時同步檢查

色票的唯一來源是 `scss/_variables.scss`，但下面幾處把數值寫成文字或寫死，改色時要一起檢查：

- [ ] `scss/_variables.scss`：色票、`$theme-colors`、6 種語意色調 `$tones`、深藍底上的字 `$on-navy-*` 與 `$data-dark`、焦點環 `$focus-ring-double` 與 `$focus-on-navy`，以及 Bootstrap 語意變數（`$body-*`、`$input-*`、`$focus-ring-color`…）；註解裡的對比度要重算。
- [ ] `guideline.html`：1 色彩章的色票表（hex、角色、對比）、用色比例、語意色調表與狀態徽章總表，6 圖表章的「圖表變數對照」表與深色底說明裡的色碼與對比；這些數字是照 `_variables.scss` 的註解手寫的。色塊本身由 `pages/_guideline.scss` 的 `$gl-swatches` 讀變數，新增或改名色票時要一起加。
- [ ] 圖表：各頁與 Guideline 的 inline SVG 都用 class 上色，沒有寫死色碼；深色底的線、面積、格線、座標字集中在 `components/_chart.scss` 的 `chart-dark-vars` mixin，改色後確認白底圖卡與 `.chart-card.is-dark` 的數據色、提示框 `.chart-tip` 對比。Guideline Do／Don't 的錯誤示範（`.gl-dd-glow` 的漸層）也從變數混色，不用另外改。
- [ ] 本檔的「Design token 摘要」、排版語言與招牌元素裡寫到的色名和對比。
- [ ] 改了頁首高度時：`$site-bar-height`、`$site-tabs-height`、`$sticky-offset`（目前 72px）、各頁 sticky 的條款表、故事目錄、篩選欄、側欄、付款資訊與 Guideline 目錄，以及 Guideline 3 間距章「版心與固定尺寸」、5 元件狀態章的頁首示範說明的數字一起改。
- [ ] `scripts/generate-images.mjs` 的 `STYLE`：整組圖片的光線與背景色調，換色後重新生圖。
- [ ] `templates/page.html` 與每一頁的 `<meta name="theme-color" content="#0A1F3C">`，以及 `images/favicon.svg`（`$navy-800` 方塊、`$data-dark` 小島）裡的色碼；改完頁首頁尾執行 `npm run check`。

### 和方向說明不同的地方

- **首頁事實卡的 KPI**：方向說明是 2×2（目前募得、達成率、贊助人數、剩餘天數）＋下方目標。實作時 3 欄寬只有約 300px，「NT$ 1,235,600」放進半格會被擠小，所以改成「目前募得跨整列（目標放在它的補充行）＋達成率｜贊助人數｜剩餘天數 3 格」，4 段的寬度比改成 3：2.5：3.7：2.8。
- **贊助成功的 ok 勾與 H1**：方向說明把「ok 圓形勾＋H1」放在對帳單文件的標頭列。實作時放在和結帳頁同一條冰灰標題帶裡（步驟條 → 勾＋H1 → 說明），兩頁的步驟條與 H1 位置、間距一致（SPEC §2.4）；對帳單文件從「贊助明細」開始。
- **結帳摘要的「預計出貨」**：放在左側方案規格表的最後一列（和方案、回饋內容、顏色同一張表），右側金額欄只放金額、按鈕與扣款說明。
- **「＋ 新增地址」**：用 `bi-plus-lg` 圖示＋「新增地址」文字，和個人頁收件資訊的按鈕一致。
- **贊助紀錄詳情「我的方案」**：≥ 1200 與 768–991 是「規格表｜金額」並排 7：5；992–1199 主欄只剩 8 欄寬，回饋內容的兩欄清單放不下，改成上下排。
- **首頁「正在發生的提案」**：方向說明是 3 欄數據卡。驗收時整頁縮圖的下半部和其他 5 套的「三欄卡片」骨架太像，改成**領先專案卡＋排行表**：每個分頁第 1 件仍是數據卡（SPEC 的 ProjectCard，內容與順序不變），其餘放進排行表，達成率用共用刻度的長條（整條 600%、虛線刻度＝目標 100%）比較，金額、人數、天數靠右對齊，像基金月報的持有明細。只有 3 件的分頁（即將結束、最新上架）在 ≥ 1200 也改成卡片橫式在上、排行表在下，避免右側大片留白。
- **專案細節的提案者小卡**：方向說明是 `"head head"` 標題區橫跨全寬、提案者小卡在 sticky 外（沒有指定位置）。實作把小卡放進冰灰標題帶右側（`"head who"`）：標題區只需要 8 欄，右側 4 欄剛好放發行人欄，像公開說明書封面的發行人資訊；這樣 sticky 條款表從主視覺那一列才開始，不會和標題並排。< 992 小卡接在條款表之後。
- **專案細節的儀表板拆成「行情列＋條款表」**：方向說明是右 4 sticky 條款表包含全部數字（目前募得、進度條、達成率｜目標、人數｜天數、期間、走勢、按鈕）。驗收時第一屏縮成縮圖仍像其他套的「左大圖、右 sticky 儀表板卡」，所以把四個數字移到冰灰帶下緣的**全寬募資行情列**（像股票報價頁的行情列，目標金額放在目前募得的補充行），右欄只留進度條＋刻度字、募資期間、放大的累積走勢、按鈕與安心提示。Notion 的儀表板順序改成「行情列由左到右 → 條款表由上到下」，四個數字仍一起出現（SPEC FundingDashboard）。取捨：桌機捲到故事以後，黏住的條款表只剩進度條的刻度字（247%）與走勢圖，沒有金額與人數；< 992 的底部行動列不受影響。
- **專案列表的篩選欄**：方向說明是 9：3、sticky top 72px。實作在 992–1199 改成 8：4（3 欄只有 210px，關鍵字欄的 placeholder「搜尋專案或提案者」會被截斷），而且面板不在內部捲動（內部捲動時「贊助門檻」「排序」會被切掉又看不出還能捲），只有視窗高度放得下整個面板時才 sticky。
- **favicon 小島的顏色**：方向說明是 `$blue-600`，但它疊在 `$navy-800` 方塊上只有約 2.4:1，16px 時會看不見，改用 `$data-dark #7EB0FF`。頁首與頁尾的標誌是白色方塊，小島維持 `$blue-600`。

## 圖片

`images/` 的 23 張圖片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名、比例與畫面主體照主題層的 [`../IMAGES.md`](../IMAGES.md)，與其他風格相同。調性是上市公司年報的企業編輯攝影：明亮均勻的日光（約 5200–5600K）、中性偏冷、構圖整齊（垂直線拉正）、產品照放在白到淡冷灰的無縫背景上、低到中等飽和度、不加底片顆粒。替換時保持相同檔名即可，不需改程式。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`：

```bash
npm run images                                              # 產生缺少的圖片
node scripts/generate-images.mjs --only hero-canvas-bag     # 只重做指定的圖（逗號分隔，不含 .jpg）
node scripts/generate-images.mjs --force                    # 全部重做
CONC=1 node scripts/generate-images.mjs                     # 並行數（預設 2）
```

換成其他風格時，改腳本裡的 `STYLE`（整組圖的共同調性）與各張描述即可。

帆布包要在每張圖裡是同一款（拉鍊開口、前方橫拉鍊口袋、兩側開放口袋、銅色拉鍊頭，顏色只有原胚、墨綠、炭黑）：`story-bag-details`、`ugc-canvas-bag`、`update-color-samples` 三張在 `JOBS` 的第 3 欄指定 `project-01-canvas-bag` 當參考圖（腳本用 `codex exec -i` 附上），prompt 共用 `BAG` 這段外型描述。贊助者實拍只拍在咖啡店椅子這類沒有站牌、地圖、招牌的地方，避免畫面出現真實機構的標誌。
