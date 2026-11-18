# 06｜嘉年華主題樂園：StageOne 城市現場

> 繽紛暖色＋淺色底（奶油底、糖果紅、海軍藍、鮮黃）。票券自帶立體微陰影（Soft Shadow），入場驗證章呈現蓋印回彈微互動。（Notion 風格表原文）

概念是「遊樂園的入場閘門」：奶油色的園區裡，每一張票都是有厚度、帶柔軟陰影的實體票，驗票時入場章「啪」地蓋下去再彈一下。頁首掛著紅白條紋的遮陽棚、最上緣一排燈泡，區塊標題放在緞帶上，鮮黃只給代幣、星芒與數字磚。內容（午夜噪音祭等 8 場活動）照 Notion 不改。大膽只花在兩個招牌元素：

- **四角內凹的立體入場票**（`.admit`）：四角是內凹的四分之一圓（mask），外層用三層海軍藍帶色的 `drop-shadow` 做出柔和陰影，票內側上緣一道高光、下緣一道厚度，再加一圈 8px 內縮的糖果紅虛線框。首頁倒數票與熱門卡、活動列表卡、票種卡、已選票券、電子票券、票券卡、下一場小票、註冊頁的保障票根都是它。
- **入場驗證章**（`.stamp`）：96px 雙圈圓章、`rotate(-12deg)`、印泥不均的雜訊邊，出現時從 1.8 倍落下、壓扁、回彈（0.55 秒）。結帳 `#result`、我的票券、電子票券詳情、Guideline 會用到。純 CSS，不加 JS。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（架構同 `../02-salon-style/`）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。單一淺色主題，不使用 `data-bs-theme`。
- **JS**：互動交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的 10 個小功能（必做的是活動列表的「活動類型」篩選）。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西（字體從 Google Fonts 載入，離線時會退回系統的圓體或黑體）。

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

| 頁面 | 檔案 | 樣式 | 頁首目前頁 | 進度 |
|---|---|---|---|---|
| 設計 Guideline | `guideline.html` | `scss/pages/_guideline.scss` | 無 | 完成 |
| 首頁 | `index.html` | `scss/pages/_home.scss` | 首頁 | 完成 |
| 活動列表 | `events.html` | `scss/pages/_events.scss` | 活動列表 | 完成 |
| 活動細節（含票種選擇與選位；以「午夜噪音祭 Vol.7」示範） | `event.html` | `scss/pages/_event.scss` | 活動列表（不加 `aria-current`） | 完成 |
| 購票確認與快速支付（含付款結果與電子票券，頁內 `#result`） | `checkout.html` | `scss/pages/_checkout.scss` | 無 | 完成 |
| 註冊 | `register.html` | `scss/pages/_register.scss` | 無 | 完成 |
| 我的票券 | `tickets.html` | `scss/pages/_tickets.scss` | 無 | 完成 |
| 電子票券詳情（以「午夜噪音祭 Vol.7」的 3 張票示範） | `ticket.html` | `scss/pages/_ticket-detail.scss` | 無 | 完成 |
| 購票紀錄（含申請退票） | `orders.html` | `scss/pages/_orders.scss` | 無 | 完成 |
| 追蹤的主辦方 | `follows.html` | `scss/pages/_follows.scss` | 無 | 完成 |

頁面上沒有列出所有頁面的導覽：依購票流程點進各頁（首頁 → 活動列表 → 活動細節 →「下一步：確認訂單」→ 結帳 →「確認付款」→ `#result`），Guideline 直接開 `guideline.html`。首頁的情境卡、熱門卡都連到 `events.html`／`event.html`。其他頁的入口：

- 頁首「登入／註冊」開啟登入 Modal →「註冊新帳號」→ `register.html`；首頁主辦方帶的「免費開賣我的第一場」也開啟登入 Modal（主辦方流程的第一步是註冊登入）。
- 頁尾「購票者」欄：探索活動 → `events.html`、我的票券 → `tickets.html`、購票紀錄 → `orders.html`、追蹤的主辦方 → `follows.html`。「主辦方」欄的「我要辦活動」→ `index.html#organizer`，其他 3 項是沒有 `href` 的示意連結。「服務」欄的購票須知、退票規則、常見問題 → `event.html#faq`。

動態功能（票價調漲倒數、鎖位倒數、結帳保留倒數、動態 QR Code、付款中、付款結果）都是**固定的 Notion 數字＋靜態畫面**，不用 JS 跑倒數。其他狀態放在各頁底部的「設計稿狀態示意」（`.demo-state`）。

## 排版語言

可愛只放在**形狀與色塊**，版面骨架要嚴謹：12 欄、對齊、一致的間距。內文 16px、靠左、海軍藍。

### 格線與節奏

- 容器 xl 1140px、**xxl 1280px**；左右 24px（≥ 992px 32px），欄距 28px。
- 區塊上下 56px（手機）／104px（≥ 992px），`.section`；較緊的用 `.section-tight`。
- **整區置中是本風格的骨幹**：區塊標題、頁首區（`.page-head`）、跑馬燈招牌、代幣列、FAQ 欄、電子票券詳情整欄都置中。**長文、表單、明細仍靠左**，不要整段置中。
- 1920px 寬時背景（Hero 照片、色帶、扇形、條紋、星點）滿版，內容一律對齊容器。扇形與條紋用重複背景，半徑固定不隨寬度縮放。

### 頁首與頁尾（每頁一樣，從 `templates/page.html` 複製）

- 頁首總高 88px（`$site-header-height`）＝最上方 10px 海軍藍燈泡列（鮮黃圓點）＋ 60px 奶油主列＋ 18px 遮陽棚（紅白條紋扇形，扇形之間透明）。sticky 元件的位移用 `$sticky-top-offset` 108px。
- 主列：左品牌（摩天輪徽章＋「StageOne」＋海軍藍小膠囊「城市現場」）；中間香草**膠囊托盤**裝「首頁」「活動列表」，目前頁是糖果紅膠囊白字；右側「搜尋」（海軍藍框膠囊）、「登入／註冊」（文字按鈕）、「我要辦活動」（糖果紅小膠囊）。< 992px：品牌＋搜尋圓鈕＋選單圓鈕，選單是香草圓角面板（2px 海軍藍框）。
- 頁尾：海軍藍底＋疏落的鮮黃星點，上緣奶油扇形；4 欄（品牌與介紹、購票者、主辦方、服務）；欄標題鮮黃 900，連結奶油色，hover 鮮黃 3px 底線。
- 頁面的第一個區塊如果是滿版照片或色帶，可以用 `margin-top: -18px`（`-$site-awning-height`）滑到遮陽棚下面，讓扇形之間透出內容（首頁 Hero 這樣做）。

### 標題層級

- **滿寬區塊的 H2**：置中放在緞帶上（`.section-head > h2.ribbon > span.ribbon-text`，糖果紅緞帶、兩端燕尾）；海軍藍帶上用 `.ribbon-sunny`（鮮黃底海軍藍字）。副標是 `.section-head` 裡的 `<p>`，置中 `$navy-muted`。
- **欄內的 H2**（8 欄、7 欄、4 欄裡、卡片裡）：左對齊、不加緞帶，只在字下加鮮黃螢光筆：`<h2><span class="marker">活動介紹</span></h2>`。
- **頁面 H1**：置中、海軍藍，字後一塊鮮黃圓角色塊（像貼紙）：`<h1><span class="sticker">探索活動</span></h1>`。頁首區用 `.page-head`（置中的麵包屑 → H1 → `.page-lead`）。首頁 H1 在跑馬燈招牌裡（`.home-marquee-title`），結帳頁 H1 視覺隱藏。
- h3 是卡片標題（GoRound 900），h2／h1 在 Baloo 2（英數）＋ GoRound（中文）。

### 色彩用量

- 大面積是奶油（頁面底）與香草（卡片、票券、輸入框）；交替區塊用奶油黃帶（`.section-butter`）、票種區用糖粉帶（`.section-candy`），深色帶只有首頁「本週熱門」（`.section-navy`）與頁尾。
- **糖果紅**只給主要按鈕、緞帶與重點；一個視窗裡實心糖果紅色塊不超過 3 處。奶油黃底上的紅字改用 `$candy-deep`（糖果紅只有 4.33）。表單不要放在奶油黃底上（框線對比不足）。
- **鮮黃**只給代幣、星芒、數字磚、深色帶上的主要按鈕。鮮黃在奶油底上看不見（1.43）：鮮黃色塊一律加 2px 海軍藍框，或放在海軍藍上。
- **糖果紅在海軍藍上只有 2.60**：海軍藍帶、頁尾、浮動底部列上的主要按鈕一律用 `.btn-sunny`（鮮黃底海軍藍字）。
- 錯誤一律莓果紅（`$berry`，比糖果紅暗、偏紫）＋ ✕ 圖示＋淡底＋文字，不只靠顏色。
- 直接放在海軍藍上的內容加 `.on-dark`（標題變奶油色、焦點環換鮮黃）；放在海軍藍帶裡的 `.admit-paper`、`.card-soft` 會自己把標題換回海軍藍。

### 形狀

- 圓角：卡片 24px、大面板 28px、按鈕與搜尋列膠囊、輸入框 16px、照片 20px（`.img-frame`）。
- 照片框：`.img-frame`＋比例（`.ratio-16x9`、`16x10`、`4x3`、`4x5`、`1x1`、`21x9`）；`.is-arch` 是上緣整個半圓的**拱窗**（情境卡、票券卡、交通卡的場地照、收據縮圖）。
- 陰影三階，全部用海軍藍帶色、低透明度，不用黑：`$shadow-soft`（一般卡）、`$shadow-ticket`（票券，`drop-shadow` 三層）、`$shadow-float`（購票亭、底部固定列、Modal、搜尋列）。**陰影只在淺底上成立**：深色帶上的票用 `.admit.is-flat`。
- 裝飾形：扇形邊（`@include scallop(top|bottom, $color, $r)`）用在 Hero 底緣、主辦方帶上緣、頁尾上緣、售票亭與步驟列下緣；遮陽棚條紋（`@include awning-stripes`）與條紋扇形（`@include awning-valance`）；燈泡點（`bulb-dot()`，靜態不閃）；星芒（`.starburst`，24 點多邊形）；代幣（`.token`，實心圓＋內圈細環）；海軍藍星點（`@include navy-stars`）。
- 不要做：側邊半圓缺口與撕線圓點（那是 02 古典藝文沙龍）、灰黑的重陰影、燈泡追逐閃爍、hover 抬升或放大。

### 逐頁構圖

**index.html**（`pages/_home.scss`）：Hero 滿版照片（高 `min(100svh − 88px, 780px)`）＋中央**跑馬燈招牌**（香草、3px 海軍藍框、一圈鮮黃燈泡點，H1 置中、兩顆膠囊）＋倒數票（≥ 1200px 在招牌右側的欄、靠下、斜 3°；以下在招牌下方不旋轉），底緣奶油扇形 → 置中大膠囊搜尋列往上壓住扇形 → 價值主張 4 顆 96px 設施代幣 → 奶油黃帶的 4 張拱窗情境卡＋「瀏覽全部活動」＋城市膠囊 → 海軍藍帶的熱門入場票軌道 → 評價（對話泡泡）7 : 保障卡 5 → 照片＋75% 海軍藍遮罩的主辦方帶（上緣奶油扇形、內容置中；下緣直接接頁尾，頁尾上緣那排奶油扇形掛在照片帶下面，兩片深色之間只有一道扇形布幔，不留奶油空隙）。

**events.html**（`pages/_events.scss`）
- 頁首區奶油黃帶（`.section-butter`）、**全部置中**：麵包屑、H1「探索活動」（`.sticker`）、膠囊搜尋列（`.search-bar`）。
- **設施代幣列**（活動類型）：8 顆 72px 圓代幣（圖示＋下方標籤；未選＝香草＋2px 海軍藍框、選中＝糖果紅實心＋白圖示＋右上小勾），一列置中；JS #2 的 `data-type-filter`／`data-filter`／`aria-pressed` 綁在這裡。手機在自己的容器內橫向捲動。
- 工具列（不 sticky）：左「共 **8** 場活動」（Baloo 2）＋已套用標籤；右海軍藍框膠囊「篩選與排序」（`bi-sliders`）→ **Offcanvas 由右滑出，所有寬度都用**：標題「篩選」＋「清除全部」→ 日期、地區、票價、狀態（膠囊）、排序（select）→ 底部固定糖果紅「套用篩選（顯示 8 場）」。
- 結果：≥ 1200px 每列 3 張、768～1199px 2 張、手機 1 張直式 `.admit`：上段 4:3 照片（內縮、圓角 16px）→ 標籤列 → 名稱 h2（GoRound 900 22px）→ 主辦、時間、地點（圖示）→ 票價（`.price`）→ 介紹全文 → 票種清單 → `.admit-divider` → 票根：`.remain`＋追蹤（愛心膠囊，JS #6）＋主按鈕。
- DemoState（篩選後沒有活動時）在結果下方。

**event.html**（`pages/_event.scss`）
- 麵包屑 → **置中標題區**（標籤列 → H1 置中 56px → 副標）→ 8 : 4。手機順序是主視覺 → 標題區（靠左）→ 售票亭 → 活動介紹。
- 左：主視覺 16:9（圓角 28px、`$shadow-soft`）→ 活動介紹（欄內 H2＋`.marker`；雙舞台 21:9；演出陣容是 8 顆糖果紅框膠囊；時間流程 4 列，每列一顆鮮黃代幣裝時間）。
- 右：sticky `top: 108px` 的**售票亭**購票卡（`components/_booth.scss`）：頂部遮陽棚條紋＋扇形下緣，香草亭身（`$shadow-float`）：倒數數字磚（`.countdown`、`.tile-lg`）→ 票價 → `.remain` → 糖果紅「選擇票種」→ 追蹤／分享（海軍藍框膠囊）→ 購票包含 → 安心提示（盾牌）。下接快速資訊卡（每列一顆小代幣圖示）。
- 票種與選位 `#tickets`：**糖粉帶**（`.section-candy`，不要用海軍藍帶，陰影看不到）；緞帶 H2 置中＋下方一顆香草小膠囊「每筆訂單最多 4 張」。8 : 4：左 4 張 `.admit` 票種卡直列（選中＝3px 海軍藍框＋右上鮮黃代幣勾、即將完售＝鮮黃星芒、售罄＝灰化＋刪除線＋虛線、尚未開賣＝虛線框）＋座位圖卡（香草、圓角 28px；舞台是紅白條紋**帳篷頂**＋「舞台」；座位是 30px **圓形**（`$seat-size`）：可選＝香草＋2px 海軍藍框、已選＝糖果紅實心＋白勾、已售出＝`$seat-sold` 底＋✕、不可選＝點點紋；鎖位倒數是鮮黃膠囊＋時鐘）；右 4 已選票券是一張 sticky 的 `.admit`。
- 場地 7 : 5：左**樂園導覽圖**風格 SVG 地圖（viewBox 800 × 800、`slice` 裁邊：手機 3:4、平板 16:10、桌機與交通卡同高；標註都在中央安全範圍；奶油底、圓角粗線道路＋海軍藍描邊、捷運站與宏匯廣場是圓角色塊圖示、場地是糖果紅氣球圖釘、步行路線糖果紅虛線）；右交通卡（場地照 `.is-arch`、`$shadow-soft`）。
- 主辦方卡 5 : 7；NC 字母章是鮮黃代幣；3 張數據是三顆大代幣（Baloo 2 數字）；歷史縮圖 1:1 圓角 20px。
- FAQ `#faq`：**置中單欄**（最寬 840px），緞帶 H2 在上；Accordion 每題是獨立的香草圓角卡（`$shadow-soft`、題間距 12px），退票題糖粉底＋左側糖果紅條＋盾牌。
- DemoState：3～4 座迷你售票亭。手機的底部購票列是**浮動膠囊**（左右下各內縮 12px、海軍藍底、`$shadow-float`；左價格與倒數短版奶油字、右鮮黃「選擇票種」），`<body class="has-bottom-bar">`。

**checkout.html**（`pages/_checkout.scss`）
- H1 視覺隱藏。**棋盤路徑步驟列**（`components/_board-steps.scss`；≥ 768px sticky，外層奶油帶從頁首下緣 88px 開始、步驟列落在 108px；香草、下緣小扇形）：三顆 40px 圓代幣以點點軌道相連（已完成＝遊樂綠＋白勾、目前＝糖果紅＋白數字＋粗標籤、未到＝香草＋虛線框；< 768px 只留目前步驟的文字）；右側保留倒數 `.board-hold`（鮮黃膠囊＋時鐘＋Notion 全文，09:12 是海軍藍數字磚）。步驟不被擠壓（`flex: 1 0 auto`），同一列放不下時倒數膠囊換到第二行：768–991px 兩行，≥ 992px 一列 76px 高，鋸齒收據的 sticky 位移照這個高度算。警示 `.board-bar.is-warn`、逾時 `.board-bar.is-expired`。< 992px 步驟列下方是「查看明細」膠囊（Collapse 展開收據）。
- 主體 7 : 5：左香草圓角卡（欄內 H2＋`.marker`）；快速支付 3 顆大膠囊（海軍藍框、品牌圖示）；信用卡、ATM 是圓角 radio 卡＋收合（JS #8）；確認付款糖果紅 56px 膠囊。右 sticky **鋸齒收據**（`components/_receipt.scss`，sticky 在步驟列下方）：香草紙、下緣鋸齒（mask 重複三角）、`drop-shadow`；應付總額 `.price-xl` 海軍藍＋下方 `.marker`。
- `#result`：`.demo-state`；成功 7 : 失敗 5。成功：遊樂綠大代幣勾 → 標題 → 說明 → 3 張電子票券 Carousel（左右箭頭在下方，不壓票面）＋**入場章「有效」**（`.stamp.is-valid.eticket-stamp` 在票身右側、QR 框旁邊，一半壓出票緣；手機改到右下角票號旁；`#result:target` 時重新蓋章）→ 3 顆膠囊；失敗：莓果紅大代幣 ✕。
- 電子票券（`components/_eticket.scss`）：直式 `.admit`，最寬 380px；`.admit-paper.has-band`：上段 `.admit-band`（活動名奶油字、票種｜入場時間、日期場地＋一排鮮黃小星）→ `.admit-body` 白底 QR（圓角 16px 白框、四角四顆小代幣）→ 說明與票號。4 態：有效（綠章）、已使用（海軍藍章＋QR 上 60% 香草遮罩）、已過期（灰章＋`.admit-paper.is-faded`、QR 模糊）、活動已取消（莓果紅章＋提示框）。章不能蓋住 QR 的定位方塊。
- 手機底部是浮動膠囊（`components/_float-bar.scss`；海軍藍、鮮黃「確認付款」）。

**register.html**（`pages/_register.scss`）
- 表單頁不放麵包屑，H1 在表單卡裡。奶油底，背景正中一組很淡的放射光芒（`repeating-conic-gradient` 奶油／淡奶油黃、外圈淡出，只是氛圍）。≥ 992px 7 : 5（版面最寬 1056px）。
- 左 7：**園區大門**表單卡（最寬 560px）：上緣是半橢圓的條紋拱頂（糖果紅亮／香草放射條紋，像旋轉木馬的頂棚）＋海軍藍門楣與一排鮮黃燈泡，門楣正中一顆香草圓徽章放品牌摩天輪（裝飾）；香草卡身、`$shadow-float`；H1「註冊新帳號」與說明置中 → 5 欄位（姓名、手機、Email、密碼，各自說明小字；個資欄位不加 `name`）→ 同意勾選 → 糖果紅「完成註冊」→「已經有帳號？登入」（開啟登入 Modal）。
- 右 5：小標「入場保障」（海軍藍小代幣）＋ **3 張各自獨立的小票根**（`.admit.is-sm`，陰影比表單低一階），≥ 992px 靜態微斜 −1.5°、1°、−0.5° 並左右錯開；每張：鮮黃代幣圖示 → h3 → 說明。< 992px 在表單下方、不旋轉。
- DemoState「欄位有錯誤時」在下方，寬度同表單卡：4 個錯誤（手機格式、Email 已註冊＋登入連結、密碼太短、未勾同意），已填的資料保留。

**tickets.html**（`pages/_tickets.scss`）
- 會員頁頁首區（`components/_member-head.scss`）：奶油黃帶、下緣奶油扇形，麵包屑、H1 貼紙、說明置中；分頁是置中的**膠囊托盤**（`.tray`，香草＋`$shadow-float`），一半壓在扇形上；3 段（選中＝糖果紅白字），段內一顆鮮黃小代幣放數字。JS #9：`data-ticket-tabs`、`data-filter`、`aria-pressed`、`data-status`。
- 列表最寬 1056px，≥ 768px 每列 2 張直式 `.admit` 票券卡：16:10 拱頂照片、日期代幣壓在照片左下 → 狀態標籤 → 活動名 h2 → 日期、場地、票種張數（糖果紅小圖示）→「訂單 #SO-…」→ 附註 → 糖果紅虛線 → 糖果紅框膠囊「查看票券」（推到卡片最下面）。已使用、已過期：照片 `grayscale(.7)`、`.admit-paper.is-faded`，右上壓一枚入場章（已使用＝海軍藍、已過期＝灰）；切到該分頁時章會重新蓋一次（從 `hidden` 切回顯示）。
- DemoState 2 個（≥ 992px 並排、同高）：空狀態（大代幣裡 `bi-ticket-perforated`＋「探索活動」）；活動已取消（同一張票卡＋莓果紅章「活動已取消」＋提示框＋「查看退款進度」→ `orders.html`）。

**ticket.html**（`pages/_ticket-detail.scss`）
- **置中單欄**（最寬 880px）：麵包屑（靠左）→ 眉標「電子票券」（糖果紅小膠囊）→ H1 貼紙置中（連到 `event.html`）→ 訂單編號（連到 `orders.html`）與張數 → 3 顆代幣切換鈕（Bootstrap pill，票號＋票種，選中糖果紅；手機在自己的容器內橫向捲動）→ 電子票券置中（400px，最大的視覺），後面一圈**奶油黃轉盤**（圓心對準票券、內圈一圈點點，整個圓留在這一區裡）；`.tab-pane.active .stamp` 切換時重新蓋章 → 票券資訊 `<dl>` 2 × 2（香草小卡，代幣放在 `<dt>` 裡、值往右縮排對齊）→ 操作 3 顆膠囊置中（手機上下排）＋退票規則小字。
- `#entry` 緞帶 H2「入場資訊」→ 3 張往下的香草圓角卡：①日期、時間、地點（≥ 768px 三欄，欄間糖果紅虛線）②「怎麼去？」＋樂園導覽圖風格的示意地圖（與活動細節同一張 SVG，`components/_park-map.scss`）＋大眾運輸、開車＋「開啟導航」③「入場須知」6 項（≥ 768px 兩欄，每項一顆鮮黃號碼代幣）。
- DemoState 3 個（< 992px 一個一列、992–1399px 兩欄且第 3 個占滿一列、≥ 1400px 三欄並排；三欄只在 ≥ 1400px，再窄的話票面不到 200px，活動名與票號會被擠斷）：入場驗票之後（海軍藍章「已使用」＋QR 遮罩）、活動結束沒有入場（灰章「已過期」＋整張褪色、QR 模糊）、主辦方取消活動（莓果紅章＋提示框＋3 顆停用的操作鈕＋「查看退款進度」；占滿一列時 4 顆膠囊排成一列置中）。手機上入場章移到票的右下角、一半壓出下緣，不蓋到「每 60 秒自動更新」那行。沒有側欄。

**orders.html**（`pages/_orders.scss`）
- 會員頁頁首區置中＋「共 6 筆訂單」數量貼紙（香草膠囊、數字在斜貼的鮮黃貼紙上）。
- `#orders`：≥ 992px 每列 2 張**鋸齒收據**（`.receipt.has-top-teeth`：香草紙、上下緣鋸齒、`drop-shadow`；同一列等高；< 992px 一欄、最寬 640px 置中）：卡頭（「訂單編號」小字＋編號 Baloo 2＋下單時間｜狀態膠囊）→ 活動（奶油底小檯面：拱頂 1:1 縮圖、名稱、日期場地）→ 票種明細與平台服務費（點點引導線）→ 總額（收據最大的數字＋`.marker`）→ 付款方式、電子發票（號碼＋「下載」文字鈕）→ 說明或提示框 → 按鈕（推到收據最下面）。6 筆照 SPEC §2.9.2：已付款 4 筆、付款失敗（提示框＋「重新選票」）、已退款（發票作廢、說明列）。
- `#refund`：奶油黃帶（上下緣奶油扇形）＋緞帶 H2「申請退票」＋副標 →**售票亭窗口**（`components/_booth.scss`，置中最寬 960px）。亭身 6 : 6，中間糖果紅虛線：左表單（訂單下拉、退票規則糖粉底＋左側糖果紅條、要退的票券整列可點（勾選＝糖粉底＋海軍藍框）、退票原因），右退款試算（奶油底小窗：票價、手續費、預估退款 Baloo 2 40px 遊樂綠）＋糖果紅「送出退票申請」（`type="button"`）＋「主辦方取消或延期…」。< 992px 試算在表單下方。
- DemoState 2 個在最下方（≥ 992px 並排、同高）：還沒有購票紀錄（空狀態）；主辦方取消活動、退款處理中（O1 的收據換成「退款處理中」膠囊、退款金額列、警示提示框，沒有按鈕）。

**follows.html**（`pages/_follows.scss`）
- 會員頁頁首區置中＋「追蹤中 4 個主辦方」數量貼紙。
- `#follows`（最寬 1056px）：≥ 768px 每列 2 座**攤位卡**（重用售票亭 `.booth`，亭身陰影降一階 `$shadow-soft`）：每座頂著一片扇形遮陽棚，4 座顏色不同（糖果紅、鮮黃（條紋間的海軍藍細線加深）、海軍藍、糖果紅亮；`booth-awning($h, $stripe, $seam)` 產生），字母章是鮮黃 48px 代幣、壓在遮陽棚下緣正中；名稱 h2 置中 → 簡介 →「即將舉辦 1 場活動」→ 奶油底**櫃台**：「下一場」小標＋橫式迷你入場票（`.admit.is-link`，左 1:1 縮圖、右名稱、日期、場地、票價與「已購票」遊樂綠膠囊；整張連到 `event.html`，hover 只加深陰影＋名稱底線）→「取消追蹤」海軍藍框膠囊（JS #10，推到攤位最下面，手機滿寬）。< 992px 迷你票縮圖 64px、內距收小。
- DemoState「還沒有追蹤任何主辦方時」在下方。

**guideline.html**（`pages/_guideline.scss`，自訂 class 一律 `gl-` 前綴）
- 奶油黃頁首區：麵包屑 → 眉標「設計稿 06｜嘉年華主題樂園」→ H1 貼紙 → 說明；< 992px 下方是 9 顆章節膠囊（在自己的容器內橫向捲動），取代左目錄。
- 3 : 9；左目錄 sticky 108px，是直排的糖果紅框膠囊，每顆前一顆編號小代幣，Bootstrap ScrollSpy 標出目前章節（糖果紅實心白字）。章節之間用糖果紅虛線分隔。
- 9 章：00 招牌元素（Notion 原文、`.admit` 構造圖＋5 個標註、`.stamp` 回彈的 4 個關鍵影格、4 種章用 pill 切換重新蓋章、10 頁用到招牌的對照表）→ 01 色彩（26 枚**圓形色票代幣**：hex、變數、用途、對比度；Bootstrap 主題色與語意變數對應；票務專用語意 6 張卡）→ 02 字級階層（Display 用首頁招牌主標 `.home-marquee-title` 的實際尺寸 42 → 56 → 64 → 72px，一路到票號共 10 列）→ 03 間距與格線（spacer 1～7、容器、欄距、區塊節奏、10 頁的欄比例示意、sticky 與錨點位移）→ 04 圓角與陰影（8 種圓角；三階陰影與 `.admit` 四角內凹並排；海軍藍帶上的 `.admit.is-flat`）→ 05 元件狀態規範（按鈕 6 態、輸入框 5 態、勾選、篩選膠囊、票種卡 5 態、數量加減器、剩餘票數、倒數、圓形座位 4 態與選位衝突、有劃位／無劃位、棋盤步驟列 3 態、付款按鈕、電子票券 4 態（各自的章）、驗票回饋、FAQ、頁首導覽）→ 06 空畫面與狀態文案（Notion 16 條逐字＋各自出現的位置，另示範空狀態與 3 種提示框）→ 07 RWD 斷點（原有 4 頁＋Guideline、2026-11 補的 5 頁兩張表）→ 08 Do／Don't（7 組全站購票規則＋7 組本風格的用法）。
- 示範都用頁面上同一組 class。hover、focus 為了並排比較，用 Guideline 專用的 `.is-hover`、`.is-focus` 固定外觀（寫在 `_guideline.scss`，頁面上不用）。驗票回饋是 pill 切換的兩支手機畫面（遊樂綠／莓果紅滿版＋白色 `.stamp-lg.on-color`「驗票成功」「無效票券」），切換時章會重新蓋下。Do／Don't 的示意圖只是畫面（`aria-hidden="true"`，按鈕用 `span.btn`），不能操作。

## 檔案結構

```
06-carnival-style/
├─ *.html                    ← 10 個頁面，每頁完整包含頁首、頁尾與登入 Modal
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製（開頭註解寫了目前頁的規則）
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的 10 個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 22 張活動照片（AI 生成，遊樂園節慶指南調性）、favicon.svg
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫＋陰影三階＋頁首高度＋招牌元素尺寸
│  ├─ _base.scss             ← 全站基礎、裝飾 mixin（扇形、條紋、燈泡、星點）與票務共用小元件
│  ├─ components/            ← 頁首、頁尾、★入場票（_admit）、★入場章（_stamp）、搜尋列，以及兩頁以上共用的票務元件
│  │                            （切換鈕、售票亭、鋸齒收據、票種卡、座位圖、步驟列、電子票券、浮動膠囊、導覽地圖、會員頁頁首區）
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴：home-、ev-list-、ev-、co-、reg-、tkt-list-、tkt-、ord-、fol-、gl-）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾＋登入 Modal 是否與範本一致、目前頁標示是否正確
   └─ generate-images.mjs    ← 生圖腳本（所有圖片的 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾、登入 Modal 每頁一份**：沒有元件系統，所以 10 個頁面各自完整寫一份。新頁從 `templates/page.html` 複製，改 `<title>`、`description`（結尾保留「設計稿 06｜嘉年華主題樂園。」）與目前頁；要改共用區塊時先改範本，再同步到每一頁，最後執行 `npm run check`。它比對三段：`<head>`（title、description 除外）、頁首（跳至主要內容 → `</header>`）、頁尾之後到 `</html>`（含登入 Modal 與 script），並檢查目前頁：`index.html`、`events.html` 標自己（`class="nav-link active" aria-current="page"`）；`event.html` 標「活動列表」但不加 `aria-current`；其他頁不標。
- **底部固定列**：活動細節的購票列與結帳的付款列（992px 以下的浮動膠囊）放在 `<main>` 的最後面，不要放在頁尾之後（否則 `npm run check` 會判定與範本不同）。有固定列的頁面在 `<body>` 加 `class="has-bottom-bar"`（< 992px 在頁尾下緣多留 96px＋iOS 安全區，捲到最底時膠囊停在頁尾的海軍藍上）。
- **假資料直接寫在 HTML**：數字照主題的 `WIREFRAME_SPEC.md` 與 `CONTENT.md`，文字逐字照抄。星期幾照 Notion 原文，不修正。
- **JS（`js/main.js`）**：①頁首搜尋列展開後聚焦 ②**活動類型篩選**（`data-type-filter`、`data-filter`、`data-category`、`data-result-count`、`data-applied-filters`）③其他篩選群組只切換選中樣式 ④票種數量加減與「已選票券」小計（`data-order`、`data-qty`、`data-qty-step`、`data-summary-row`、`data-total-qty`、`data-total-amount`、`data-order-next`；整筆最多 4 張）⑤座位點選（`.seat[data-seat]`、`data-seat-picked`）⑥「追蹤」切換（`data-follow`）⑦熱門列左右箭頭（`data-scroll-target`、`data-scroll-dir`）⑧選「信用卡付款」才展開卡號表單（`name="payMethod"`＋`data-pay-target`）⑨我的票券的分頁（`data-ticket-tabs`、`data-filter`、`data-status`）⑩「取消追蹤」切換（`data-unfollow`、`data-unfollow-label`）。每個功能的 HTML 寫法寫在 `main.js` 各段的註解。選單、搜尋列、篩選 Offcanvas、登入 Modal、FAQ、電子票券輪播、3 張票切換都靠 Bootstrap 的 `data-bs-*`。
  - 和 02 沙龍不同的一處：#4 的「已選」狀態加在**最近的 `[data-ticket-type]`** 上（`closest('[data-ticket-type]')`），票種卡最外層要加 `data-ticket-type`，選中時會得到 `.is-selected`。
- **入場章不需要 JS**：頁面載入時播一次；`#result:target`、`.tab-pane.active` 與從 `hidden` 切回顯示的卡片會自動重播。
- **換行**：活動名與短標題用 `.text-phrase`＋`<wbr>`，只在詞組之間換行（電子票券的活動名 `.eticket-title` 與「每 60 秒自動更新，請勿截圖轉傳」也加）；含「｜」的活動名寫成 `島嶼獨白&#8288;｜<wbr>現代舞獨舞展`（「｜」不會落到行首）。狀態示意的標題 `.demo-state-title` 已內建同樣的規則；票號 `.eticket-no .num`、收據的「品名 × 數量」不換行。
- **對齊**：標題、代幣、按鈕可以置中；會換成兩行以上的內文靠左（追蹤的主辦方攤位簡介、結帳付款結果的說明都是靠左）。區塊副標 `.section-head > p` 置中但加了 `text-wrap: balance`，換成兩行時兩行等長。
- **表單**：設計稿沒有後端，一律 GET。搜尋表單 `action="events.html"`，欄位帶 `name`；密碼、Email、卡號等個資欄位**不加 `name`**（網址不會出現個資）。每個欄位都有 `id`＋`<label for>`＋`autocomplete`。登入 Modal 的「登入」只關閉 Modal，「註冊新帳號」連到 `register.html`。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、字體、間距、圓角、陰影、元件、頁首高度、招牌元素尺寸）
3. `bootstrap/scss/bootstrap`：用上面的變數編譯出整套 Bootstrap
4. `bootstrap-icons`：圖示字型與 class（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字體與數字、區塊與標題、裝飾 mixin、按鈕、表單、焦點，以及票務共用小元件
6. `components/*`：頁首、頁尾、入場票（`_admit.scss`）、入場章（`_stamp.scss`）、搜尋列、切換鈕（`_toggles.scss`）、售票亭（`_booth.scss`）、鋸齒收據（`_receipt.scss`）、票種卡（`_ticket-type.scss`）、座位圖（`_seatmap.scss`）、步驟列（`_board-steps.scss`）、電子票券（`_eticket.scss`）、浮動膠囊（`_float-bar.scss`）、導覽地圖（`_park-map.scss`）、會員頁頁首區（`_member-head.scss`）
7. `pages/*`：各頁專屬樣式

原則是**先用 Bootstrap 的變數與工具類別**，做不到才寫自訂 CSS，而且自訂 CSS 只引用變數，不寫死色碼。想換風格，主要改 `_variables.scss`。只在某一頁用到的元件寫在該頁的 partial，兩頁以上共用的才放進 `components/`（新增時記得加進 `main.scss`）。

### 共用類別

| 類別 | 用途 | 位置 |
|---|---|---|
| `.section`、`.section-tight`、`.section-butter`、`.section-candy`、`.section-navy` | 區塊上下留白 56／104px；奶油黃帶、糖粉帶（票種區）、海軍藍帶（鮮黃星點） | `_base.scss` |
| `.on-dark` | 直接放在海軍藍上的內容：標題奶油色、鮮黃焦點環、`.remain` 換淺色 | `_base.scss` |
| `.section-head`、`.ribbon`＞`.ribbon-text`、`.ribbon-sunny` | 置中的區塊標題：緞帶 H2（兩端燕尾）＋副標；海軍藍帶上換鮮黃緞帶 | `_base.scss` |
| `.marker` | 欄內 H2 的鮮黃螢光筆 | `_base.scss` |
| `.sticker`、`.page-head`、`.page-lead` | 頁面 H1 後的鮮黃貼紙；置中頁首區：麵包屑 → H1 → 說明 | `_base.scss` |
| `.text-phrase`、`.text-note`、`.text-caption`、`.font-display` | 只在空白與 `<wbr>` 換行；附註小字；說明小字；Baloo 2 字體 | `_base.scss` |
| `.num`、`.price`（`-sm`、`-md`、`-lg`、`-xl`） | Baloo 2 等寬數字：金額 18／22／32／48px（`-xl` 手機 36px）、倒數、票號、座位號 | `_base.scss` |
| `.img-frame`（`.is-arch`）＋ `.ratio-16x9`、`16x10`、`4x3`、`4x5`、`1x1`、`21x9` | 固定比例圖框（圓角 20px）；`.is-arch` 上緣半圓拱窗 | `_base.scss` |
| `.card-soft`（`.is-panel`） | 香草卡＋`$shadow-soft`，圓角 24px；`.is-panel` 是 28px 大面板 | `_base.scss` |
| `.btn-primary`、`.btn-sunny`、`.btn-navy` | 糖果紅、鮮黃（深色帶上的主要按鈕）、海軍藍實心膠囊；內側高光＋厚度，`:active` 像被按下去 | `_base.scss` |
| `.btn-outline-secondary`、`.btn-outline-primary`、`.btn-outline-cream`、`.btn-text`、`.btn-icon`、`.btn.is-loading` | 海軍藍框、糖果紅框、照片／深色帶上的奶油框、文字按鈕（44px 高）、圓形圖示按鈕、付款中鎖定；停用是虛線框 | `_base.scss` |
| `.token`（`.token-sm`、`-lg`、`-xl`；`.is-candy`、`-navy`、`-green`、`-berry`、`-vanilla`） | 代幣：實心圓＋內圈細環，預設鮮黃＋海軍藍框；32／48／72／96px | `_base.scss` |
| `.date-token`（`-month`、`-day`） | 鮮黃日期代幣「10月／18」 | `_base.scss` |
| `.starburst`＞`.starburst-inner` | 鮮黃 24 點星芒（即將完售「剩 8%」） | `_base.scss` |
| `.tag`（`.is-status`、`.is-scarce`、`.is-muted`、`.is-info`、`.is-valid`、`.is-danger`、`.is-warn`、`.is-owned`） | 狀態標籤膠囊（各狀態的意思寫在 `_base.scss` 的註解） | `_base.scss` |
| `.remain`（`.is-scarce`、`.is-soldout`）＋ `.remain-head`、`.remain-note` | 剩餘票數：文字＋進度條（12px，海軍藍；稀缺是糖果紅條紋） | `_base.scss` |
| `.countdown`（`.is-inline`、`.is-warn`、`.is-expired`、`.is-info`）＋ `.countdown-label`、`.countdown-tiles`、`.tile`（`.tile-lg`） | 倒數：鮮黃數字磚；只換數字不閃爍 | `_base.scss` |
| `.qty` | 數量加減器（膠囊＋兩顆 44px 圓鈕） | `_base.scss` |
| `.alert`、`.empty-state` | 提示框（左側 6px 色條＋圖示）、空狀態 | `_base.scss` |
| `.demo-state`（`-tag`、`-title`、`-stage`、`-label`） | 設計稿狀態示意：點點海軍藍框＋奶油黃淡底＋鮮黃緞帶標籤；< 576px 外框內距 16px、舞台 12px（購票紀錄的收據示意在手機上貼齊舞台左右） | `_base.scss` |
| `.has-bottom-bar`、`.bleed-x` | 有浮動底部列的頁面（頁尾下緣多留 96px）；橫向軌道左右延伸到容器內距外 | `_base.scss` |
| `@include scallop()`、`awning-stripes`、`awning-valance`、`navy-stars`、`bulb-dot()` | 扇形邊、紅白條紋、條紋扇形遮陽棚、海軍藍星點、燈泡點 | `_base.scss` |
| ★ `.admit`（`.is-flat`、`.is-sm`、`.is-link`）＞`.admit-paper`（`.is-faded`、`.no-frame`、`.has-band`） | 四角內凹立體入場票；外層管陰影、內層管形狀。深色帶上用 `.is-flat`；整張是連結用 `.is-link`（hover 只加深陰影） | `components/_admit.scss` |
| ★ `.admit-band`、`.admit-body`、`.admit-divider` | 上段海軍藍帶（奶油字＋一排鮮黃小星）、下段香草；票內 2px 糖果紅虛線分隔 | `components/_admit.scss` |
| ★ `.stamp`（`.is-valid`、`.is-success`、`.is-used`、`.is-expired`、`.is-cancelled`、`.is-invalid`；`.stamp-sm`、`.stamp-lg`）＋ `.stamp-text` | 入場章：放在 `.admit` 外層（不會被 mask 切掉），`aria-hidden="true"`；位置由使用處絕對定位 | `components/_stamp.scss` |
| `.search-bar`（`-field`、`.is-keyword`、`-control`、`-submit`） | 置中大膠囊搜尋列；< 992px 變成圓角 24px 卡片 | `components/_search-bar.scss` |
| `.btn-follow`、`.pill`＋`.pill-group`、`.applied-chip` | 追蹤（愛心膠囊，JS #6；已追蹤＝糖粉底）、篩選膠囊（`aria-pressed`；選中＝糖果紅白字，JS #3）、已套用的篩選標籤（鮮黃＋海軍藍框，✕ 在海軍藍小圓裡；JS #2 產生） | `components/_toggles.scss` |
| `.booth`（`.is-mini`）＞`.booth-roof`＋`.booth-body`、`.booth-divider`；`booth-awning($h, $stripe, $seam)` | 售票亭：海軍藍簷板＋鮮黃燈泡、紅白條紋扇形遮陽棚，香草亭身（`$shadow-float`）；`.is-mini` 是狀態示意的小亭。遮陽棚的 SVG 由 `booth-awning()` 產生，可換條紋顏色與條紋間細線的深淺（追蹤的主辦方 4 座攤位各一色） | `components/_booth.scss` |
| `.receipt`（`.is-flat`、`.has-top-teeth`）＞`.receipt-paper`＋`-title`、`-label`、`-cut`、`-items`、`-rows`、`-total`、`-note` | 鋸齒收據：香草紙、下緣鋸齒（`.has-top-teeth` 上緣也有）、`drop-shadow`；品項用點點引導線，總額下方 `.marker` | `components/_receipt.scss` |
| `.tt-list`、`.tt-card`（`.is-selected`、`.is-soldout`、`.is-upcoming`、`.is-compact`）＋ `.tt-head`、`-name`、`-price`、`-note`、`-control`、`-flag`、`-check` | 票種卡（`.admit` 的一種，最外層加 `data-ticket-type`）：選中＝3px 海軍藍框＋右上鮮黃勾、售罄＝灰化＋刪除線、尚未開賣＝天空藍虛線框、即將完售＝鮮黃星芒 | `components/_ticket-type.scss` |
| `.seatmap`（`-head`、`-hint`、`-scroll`、`-canvas`、`-stage`、`-zone`、`-picked`）、`.seat-lock`、`.seat-row`（`-label`）、`.seat-numbers`、`.seat`（`.is-selected`／`aria-pressed`、`.is-sold`、`.is-blocked`）、`.seat-legend` | 座位圖：紅白條紋帳篷頂舞台＋30px 圓形座位；放不下時在自己的容器內橫向捲動（JS #5） | `components/_seatmap.scss` |
| `.board-bar`（`.is-warn`、`.is-expired`）＞`.board-steps`（`li.is-done`、`.is-current`）＋ `.board-token`、`.board-label`、`.board-hold` | 棋盤路徑步驟列：40px 圓代幣以點點軌道相連，右側保留倒數膠囊；< 768px 只留目前步驟的文字 | `components/_board-steps.scss` |
| `.eticket`（`.is-used`、`.is-expired`）＋ `-band`、`-title`、`-meta`（`.is-plain`、`.eticket-sep`）、`-body`、`-note`、`-no`、`-stamp`、`.qr-frame`、`.qr` | 電子票券（`.admit` 的一種，最寬 380px）：海軍藍帶＋白底 QR 框（四角小代幣）；章在 QR 框旁邊，不蓋 QR | `components/_eticket.scss` |
| `.map-bg`、`.map-block`、`.map-tree`、`.map-road`（`-edge`）、`.map-mall`、`.map-route`、`.map-metro`、`.map-bus`、`.map-pin`、`.map-label`、`.map-walk`、`.map-compass` | 樂園導覽圖風格的示意地圖：SVG 各部位的顏色。外框與尺寸由各頁決定（活動細節 `.ev-map`、電子票券詳情 `.tkt-map`） | `components/_park-map.scss` |
| `.member-head`（`.has-tray`）、`.count-sticker`、`.tray-wrap`＞`.tray`＞`.tray-btn`＋`.tray-count`、`.member-body`、`.member-demos` | 會員頁（我的票券、購票紀錄、追蹤的主辦方）：奶油黃頁首區（下緣奶油扇形、全部置中）；數量貼紙（香草膠囊＋斜貼鮮黃數字）；膠囊托盤分頁（一半壓在扇形上，選中＝糖果紅白字，`aria-pressed`）；列表區留白；狀態示意並排同高 | `components/_member-head.scss` |
| `.float-bar`（`-info`、`-label`、`-note`） | < 992px 底部浮動膠囊（海軍藍、左右下內縮 12px）；放在 `<main>` 最後，`<body>` 加 `.has-bottom-bar` | `components/_float-bar.scss` |
| `.site-header`、`.site-nav`、`.site-awning`、`.site-icon-btn`、`.site-menu-panel`、`.login-modal`、`.site-footer` | 頁首、頁尾、登入 Modal（只在範本裡用，不要在頁面裡改） | `components/_header.scss`、`_footer.scss` |
| `.home-*`、`.scene-card`、`.featured-track`、`.featured-card`、`.bubble` | 首頁專用（跑馬燈招牌、倒數票、拱窗情境卡、熱門軌道、對話泡泡）。其他頁要用類似元件時另寫頁面前綴的版本或搬進 `components/` | `pages/_home.scss` |
| `.gl-*`；`.btn`、`.form-control`、`.form-check-input`、`.pill`、`.seat`、`.admit`、`.site-nav .nav-link` 加 `.is-hover`／`.is-focus` | Guideline 專用：示範框、色票代幣、字級表、目錄等；`.is-hover`、`.is-focus` 只在 Guideline 把 hover、焦點外觀固定下來並排比較，頁面上不用 | `pages/_guideline.scss` |

入場票的寫法：

```html
<article class="admit">
  <div class="admit-paper">…票面內容…</div>
  <span class="stamp is-valid" aria-hidden="true"><i class="bi bi-check-lg"></i><span class="stamp-text">有效</span></span>
</article>

<!-- 上段海軍藍帶 -->
<article class="admit">
  <div class="admit-paper has-band">
    <div class="admit-band"><h2>午夜噪音祭 Vol.7</h2>…</div>
    <div class="admit-body">…</div>
  </div>
</article>
```

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 底色 | 奶油 `$cream #FFF5E1`（頁面底）、香草 `$vanilla #FFFCF5`（卡片、票券、輸入框）、奶油黃 `$butter #FFE7A3`（交替區塊）、糖粉 `$candy-wash #FFE9EC`（票種區、狀態淡底）、褪色票面 `$ticket-faded #F4EEE0` |
| 海軍藍 | `$navy #1C2A5A`（內文、標題、深色帶；奶油 12.69）、`$navy-muted #4A5680`（次要文字；香草 6.99）、`$navy-faint #5A6590`（placeholder、已過期）、表單框線 `$control #7D86A8`（香草 3.50） |
| 品牌 | 糖果紅 `$candy #CC2A40`（主要按鈕、緞帶；白字 5.29）、`$candy-deep #B31F35`（hover、奶油黃底上的紅字）、`$candy-bright #E5404F`（只當裝飾：條紋、扇形）、`$candy-light #FF8A9A`（海軍藍上的紅字）、鮮黃 `$sunny #FFC83D`（代幣、星芒、數字磚；海軍藍字 8.89）、`$sunny-hover #FFB915` |
| 狀態 | 遊樂綠 `$ride-green #186A46`（成功、有效）、莓果紅 `$berry #9E1B47`（錯誤、失敗）、`$amber-text #8F5A00`（警示文字）、`$sky #2F6FB5`（資訊）；淡底：成功 `#E3F2EA`、資訊 `#EEF4FB`、警示 `#FFF0C7`、錯誤 `#FBE4EA` |
| 票務語意 | 稀缺＝鮮黃星芒／鮮黃標籤＋海軍藍框＋火焰、糖果紅條紋進度條；售罄＝灰化＋刪除線＋虛線；選中＝3px 海軍藍框＋鮮黃代幣勾；驗票成功／失敗＝遊樂綠／莓果紅大面積＋章 |
| 字體 | Baloo 2（英數、價格、倒數、品牌字）＋ Chiron GoRound TC（中文圓體）；標題 700／900 |
| 字級 | h1 34→56px、h2 26→36px、h3 19→22px；首頁招牌 H1 42→72px |
| 圓角 | 10px（小）、16px（輸入框）、20px（照片）、24px（卡片）、28px（大面板）、32px（招牌）、膠囊（按鈕、搜尋列、標籤） |
| 陰影 | `$shadow-soft`、`$shadow-ticket`（`drop-shadow` 三層）、`$shadow-float`，全部海軍藍帶色；`$bevel`（內側高光＋厚度） |
| 焦點 | 雙環 `0 0 0 3px 香草, 0 0 0 6px 海軍藍`；深色帶上 `0 0 0 3px 海軍藍, 0 0 0 6px 鮮黃`；輸入框是海軍藍框＋鮮黃光暈 |
| 頁首 | 88px（10 燈泡列＋60 主列＋18 遮陽棚，`$site-header-height`），sticky 位移 108px（`$sticky-top-offset`） |
| 招牌尺寸 | 內凹半徑 `$admit-notch` 16px、虛線框內縮 `$admit-frame-inset` 8px、章 `$stamp-size` 96px、章角度 `$stamp-rotate` −12°、扇形半徑 24／16px、條紋寬 28px、座位 `$seat-size` 30px、代幣 `$token-size` 48px |

完整規範請看 `guideline.html`。

### 換色時同步檢查

色票的唯一來源是 `scss/_variables.scss`，但下面幾處把數值寫成文字或寫死，改色（或改頁首高度）時要一起檢查，改完 `npm run css`：

- [ ] `scss/_variables.scss`：色票、`$theme-colors`、語意變數（`$body-*`、`$input-*`、`$focus-ring-color`…）與淡底 `$*-bg-subtle`；註解裡的對比度。
- [ ] Sass 產生的 SVG（data URI，顏色在編譯時寫進 CSS，用 `svg-color()` 從變數取）：入場章的雙圈（`components/_stamp.scss`）、遮陽棚條紋扇形（`awning-valance`）、燈泡點（`bulb-dot()`）、售票亭遮陽棚（`booth-awning()`）。改變數後重新編譯就會跟著變；追蹤的主辦方 4 座攤位的條紋色與細線深淺在 `pages/_follows.scss` 的 `$fol-awnings`。
- [ ] `guideline.html`：「色彩」的 26 枚色票（hex、用途、對比度）、Bootstrap 主題色與語意變數的對應表、「票務專用語意」卡裡的對比度；「元件狀態規範」與 Do／Don't 文字裡寫出的對比度（鮮黃按鈕 8.89、海軍藍帶上糖果紅 2.60、奶油底上鮮黃 1.43、驗票畫面白字 6.59／7.77）。色票圓的底色由 `_guideline.scss` 的 `$gl-coins` 從變數產生，增減色票時要一起改這個 map。
- [ ] 這份 `README.md`：Design token 摘要的 hex 與對比度。
- [ ] 改了頁首高度（88px＝10 燈泡列＋60 主列＋18 遮陽棚）時：`$site-header-height`、`$sticky-top-offset`（108px）與各處 sticky 位移：活動細節的售票亭＋快速資訊與已選票券、結帳步驟列外層的奶油帶（88px）與步驟列（108px）、鋸齒收據 `calc(108px + 5.75rem)`（照 ≥ 992px 步驟列 76px 高算）、Guideline 目錄、`html { scroll-padding-top }`；以及 Guideline「間距與格線」的 sticky 清單與 RWD 表。註冊與 4 個會員頁沒有 sticky 元件。
- [ ] 寫死色碼的 SVG：`images/favicon.svg`（海軍藍 `#1C2A5A`、糖果紅 `#CC2A40`、鮮黃 `#FFC83D`、奶油 `#FFF5E1`）。頁首 Logo（`.site-brand-mark` 各部位）、QR Code（`.qr-bg`、`.qr-modules`）、示意地圖（`components/_park-map.scss`）的顏色都由 CSS 從變數來，改 token 會跟著變，只要確認 QR 對比仍夠掃描（白底海軍藍 13.74）。
- [ ] `scripts/generate-images.mjs` 的 `STYLE`：換色後重新生圖。
- [ ] `templates/page.html` 與 10 頁的 `<meta name="theme-color" content="#FFF5E1">`（奶油）。

## 動態

| 動態 | 做法 |
|---|---|
| 入場章回彈（招牌） | `stamp-in`：從 1.8 倍落下 → 0.88 → 1.06 → 1，0.55 秒 `cubic-bezier(.2, 1.4, .4, 1)`；落定瞬間外圈一道墨暈（只播 1 次）。只動 transform 與 opacity，不跳版 |
| 票券 hover | `.admit.is-link`：陰影加深一階（0.2 秒），不位移、不放大 |
| 按鈕 | hover 換深一階的底色＋陰影；`:active` 內側陰影加深（像被按下去），不用 translate |
| 情境卡 hover | 名牌陰影加深＋標題底線；場次與票價常駐顯示 |
| 不做 | 燈泡追逐閃爍、星星閃動、卡片抬升、圖片放大、hover 才出現的資訊 |

`prefers-reduced-motion: reduce` 時全部關閉；入場章不播動畫、直接顯示落定的章（不會消失）。

## 和方向說明不同的地方

- **頁首 88px**：方向說明寫 76px＋12px 扇形；實作拆成 10px 燈泡列＋60px 主列＋18px 遮陽棚，總高同樣是 88px，所以 Hero 高度 `min(100svh − 88px, 780px)` 不變。
- **首頁 Hero**：跑馬燈招牌如果照原寫最寬 760px 置中，≥ 1200px 時右下的倒數票會蓋到招牌。改成三欄格線：招牌在中間欄（540px，≥ 1400px 600px），倒數票在右欄、靠下、斜 3°（最寬 280／296px）。< 1200px 倒數票在招牌下方、不旋轉。
- **深色帶上的熱門票**：方向說明寫「改 2px 奶油框」。mask 造型加不了沿形狀的邊框，香草票面在海軍藍上本身就有 13.4:1 的對比，所以只用 `.admit.is-flat` 拿掉陰影，不加框。
- **資訊淡底**：改成 `#EEF4FB`（原本的淡藍上 `$sky` 字只有 4.45）。
- **結帳步驟列只在 ≥ 768px sticky**：手機上步驟列＋倒數膠囊有兩行高，一直黏在頁首下方會吃掉太多畫面；手機改由底部浮動膠囊放「確認付款」。≥ 768px 外層是一條滿寬奶油帶（從頁首下緣 88px 開始），步驟列本身落在 108px，捲上來的內容不會從兩者之間露出來。
- **結帳的保留倒數**用 `.board-hold`（步驟列專用的鮮黃膠囊），不用 `.countdown.is-inline`：要跟著步驟列的警示、逾時狀態一起換色與加刪除線。
- **電子票券的入場章**不放右上角（會壓到海軍藍帶的活動名、帶子換行時也會蓋到日期），改在票身右側、QR 框旁邊，從下緣量位置（`--eticket-stamp-bottom`，預設 6.5rem）；手機票面較窄，章移到右下角票號旁，票號往左讓位。Guideline 的 4 態票只有 272px，「每 60 秒自動更新」會換成兩行，章改用 7.5rem 落在 QR 框右側中段，不蓋到這行。
- **活動列表沒有左側篩選欄**：篩選在所有寬度都用 Offcanvas，活動類型改成置中的設施代幣列（01、02、04 都是側欄＋橫式卡）。
- **活動細節的 FAQ** 是置中單欄、每題一張獨立的圓角卡；**時間流程**的時間放在鮮黃膠囊代幣裡（4 碼時間放不進圓代幣）。
- **付款成功標題**保留 CONTENT 的 🎉，包在 `aria-hidden="true"` 裡，讀屏只讀文字。
- **入場章的圓圈**用 Sass 依顏色產生的 SVG 畫（外圈 3px、內圈 1px、24 顆小星點），雜訊 mask 只套在章面，墨暈不套。
- **「已購票」標籤**（`.tag.is-owned`）改成遊樂綠框＋成功淡底＋遊樂綠字，和方向說明「已購票＝遊樂綠膠囊」一致（原本是海軍藍）；追蹤的主辦方的下一場小票用它。
- **導覽地圖的顏色**從 `pages/_event.scss` 搬到 `components/_park-map.scss`：電子票券詳情也放同一張地圖（縮小版）。`.ev-map` 外框仍在活動細節的 partial。
- **空狀態文字**：CONTENT 的空狀態是一句話（例如「你還沒有任何票券，看看這週有什麼好去處。」），照活動列表的做法在第一個逗號拆成 h3 標題＋說明，字不改。
- **電子票券詳情的票券資訊**：方向說明寫「每格一顆小代幣標籤」；`<dl>` 的每組只能放 `<dt>`、`<dd>`，所以代幣放在 `<dt>` 裡、值往右縮排對齊標籤。入場章在手機上不放票號旁（會蓋到「每 60 秒自動更新」那行），改成一半壓出票的下緣。
- **「活動已取消」入場章**的字拆成兩行（「活動／已取消」），96px 的章放不下 5 個字一行。各章的圖示（已使用＝勾、已過期＝時鐘、已取消＝✕）是本風格選的。

## 介面文字（Notion 沒寫、本風格補的）

照主題 `WIREFRAME_SPEC.md` 與 `CONTENT.md` 的用詞（搜尋列的日期選項、7 個地區、城市列的小字「城市」都是 Notion 原文）。本風格另外補的：首頁熱門列箭頭的 `aria-label`「上一個／下一個」、剩餘票數進度條的 `aria-label`（「剩餘票數 8%」「工作坊名額剩 41%」）；活動列表代幣列的小標「活動類型」；活動細節的座位 `aria-label`（「A 區 12 排 7 號，已選」）、數量加減鈕（「增加 VIP 搖滾區數量」）、地圖的文字說明；結帳的「購票步驟」、電子票券輪播（「電子票券，共 3 張」「上一張票券／下一張票券」「第 1 張，共 3 張」）與 QR Code 的 `aria-label`（「入場 QR Code，票號 T-4471-01」）。我的票券分頁托盤的 `aria-label`「票券分類」；電子票券詳情的切換鈕群組「選擇票券」、每張票的 `aria-label`（「電子票券 T-4471-01」「電子票券 T-4471-01，已使用」）與地圖的文字說明；購票紀錄「下載」鈕的 `aria-label`（「下載電子發票 QK-27401836」）；追蹤的主辦方「取消追蹤」按鈕裡給讀屏的主辦方名稱。各頁「設計稿狀態示意」框裡的標題與說明也是本風格寫的。

## 圖片

`images/` 的 22 張圖片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名照主題的 `IMAGES.md`（每套風格相同）。調性是「遊樂園節慶指南的照片」：明亮的日光或傍晚、暖白燈泡串、糖果紅與鮮黃點綴在海軍藍的陰影與夜空裡、大顆的燈泡散景。Live House、劇場仍是 Live House 與劇場，只是燈光換成紅黃藍舞台光＋暖白燈泡，沒有畫成遊樂設施。人物都是背影、剪影或柔焦，沒有文字與招牌。本風格的照片大多放在拱窗與票券裡，主體都在中央安全範圍（拱頂會切掉上方兩角）。替換時保持相同檔名即可，不需改程式。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`：

```bash
npm run images                                              # 產生缺少的圖片
node scripts/generate-images.mjs --only hero-live-crowd     # 只重做指定的圖（先刪掉舊檔，或加 --force）
node scripts/generate-images.mjs --force                    # 全部重做
```

換成其他風格時，改腳本裡的 `STYLE`（整組圖的共同調性）與各張描述即可。
