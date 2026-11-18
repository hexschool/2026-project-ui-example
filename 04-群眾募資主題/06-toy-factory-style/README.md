# 06｜童話玩具工場：島造 ISLANDMAKE 在地製造提案平台

> 淺色系＋暖色系（櫻花粉、馬卡龍紫、檸檬黃）。募資進度以「小球滾動／積木堆疊」視覺化呈現，回饋卡片軟萌且親和力高。

概念是「**繪本裡的玩具工坊**」：每個提案是一盒正在組裝的玩具，贊助者一起把積木疊上去、把小球推到終點。畫面是奶油白底、粉彩色面、圓滾滾的粉圓字與帶紫色的柔陰影；裝飾是散落的積木、小球、斜放的彩色疊板與洞洞板圓點。

可愛只放在進度、方案卡、空狀態與裝飾。**金額、日期、退款、失敗、延遲、錯誤、取消贊助、條款一律清楚平實**：不加表情、不加擬人插畫、不放裝飾積木，金額與日期不為了可愛縮小。

Notion 的視覺特點對應到招牌元素：

1. **小球滾動**：滾球軌道 `.rollway`（首頁 Hero 卡、專案遊戲墊、底部托盤的迷你版）：圓角軌道＋葡萄紫小球，小球停在達成位置，超額時滾到最右端；目標處插一面檸檬旗。
2. **積木堆疊**：積木條 `.blocks`（專案卡、列表、贊助紀錄、提案管理、限量名額）把進度切成 12 格積木；首頁 Hero 卡另有積木塔 `.tower`，每 100% 疊一層（247%＝兩層滿＋第三層 47%）。
3. **軟萌的回饋卡片**：玩具盒卡（白底、24px 圓角、盒窗圖片、微斜的分類貼紙、帶色柔陰影）；回饋方案卡加檸檬黃價格吊牌與彩色圓點清單（專案細節頁實作）。

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
npm run check      # 檢查 10 個頁面的 head、頁首、頁尾是否與範本一致
npm run vendor     # 只重新複製 Bootstrap JS 與圖示字型（npm install 時會自動執行）
npm run images     # 重新生成圖片（需要已登入的 codex CLI，換圖時才用）
```

## 頁面

| 頁面 | 檔案 | 樣式 | 狀態 | 構圖（本風格） |
|---|---|---|---|---|
| 設計 Guideline | `guideline.html` | `scss/pages/_guideline.scss` | 完成 | 9：3，**目錄在右**（sticky 的積木導覽＋ScrollSpy；< 992px 變頂部橫捲的糖果膠囊列）；00–09 章每章一張疊疊卡，色票做成「顏料罐」圓形色塊 |
| 首頁 | `index.html` | `scss/pages/_home.scss` | 完成 | **鏡像 6：6（卡左文右）**，放在不滿版的圓角洞洞板面板裡 |
| 專案列表 | `projects.html` | `scss/pages/_projects.scss` | 完成 | 左 3「玩具箱」篩選欄＋右 9 **兩欄直式玩具盒卡** |
| 專案細節與贊助方案選擇（以帆布包示範） | `project.html` | `scss/pages/_project.scss` | 完成 | **置中繪本長頁**：故事上方全寬「遊戲墊」儀表板（不 sticky）＋所有寬度都有的底部玩具托盤；方案 2 欄卡格＋右側 sticky 禮物盒；排程是之字形路線圖 |
| 個人頁面「我的島造」 | `account.html` | `scss/pages/_account.scss` | 完成 | 「玩具間名牌」標題面板 → 左 3 積木導覽＋右 9；贊助紀錄 2 欄玩具盒卡 |
| 登入 | `login.html` | `scss/pages/_auth.scss` | 完成 | 櫻花粉洞洞板面板裡置中疊疊樂：卡外大 H1，480px 表單卡後面疊兩塊斜放的彩色板；面板下方是登入失敗的狀態示意 |
| 註冊 | `register.html` | `scss/pages/_auth.scss` | 完成 | 同登入（疊板顏色順序對調、散落積木換位置）；面板下方是 4 個欄位錯誤的狀態示意 |
| 贊助結帳 | `checkout.html` | `scss/pages/_checkout.scss` | 完成 | **置中窄版單欄 760px**：積木步驟條 → 置中標題 → 櫻花粉收件卡 → 淡紫付款卡（選行動支付時用 `:has()` 收起卡號欄）→ 最後的「禮物盒」摘要卡（不 sticky）；所有寬度同一個順序 |
| 贊助成功 | `order-result.html` | `scss/pages/_checkout.scss` | 完成 | 淡紫洞洞板上掛著一張置中 640px 的吊牌形卡片（頂部打孔、細繩繞過掛鉤、下緣扇貝邊）；卡內點線分段：贊助明細 → 收件資訊 → 預計出貨 → 提醒 → 兩顆等寬按鈕 |
| 贊助紀錄詳情（以帆布包這筆募資中的贊助示範） | `backing.html` | `scss/pages/_backing.scss` | 完成 | 櫻花粉標題面板 → 專案摘要「玩具盒」大卡（置中 10 欄）→ 彩色卡片牆（≥ 992px：我的方案跨 2 欄 → 付款｜收件 → 生產與交付進度跨 2 欄、之字形路線圖）→ 全寬取消贊助卡（平實）→ 其他 4 種狀態與對話框的示意 |

- 頁面上沒有列出所有頁面的導覽：從首頁依流程點進各頁即可，Guideline 直接開 `guideline.html`。
- 專案細節只做一頁（P1 一只走十年的台南帆布包），首頁與列表的專案卡都連到 `project.html`。
- 首頁可以實際操作的：「正在發生的提案」4 個分頁（Bootstrap Tab）。

## 排版語言

這一套和同主題其他 5 套的構圖刻意不同（對照表在主題層的方向說明）。之後做其他頁面時照下面的規則，**不要回到「頂部橫條頁首＋左文右卡」「左篩選＋左圖右文列」「內容左、sticky 儀表板右」的骨架**。

### 網格與版心

- 12 欄、gutter 32px；容器最大 **1240px**（`sm 540／md 720／lg 960／xl 1140／xxl 1240`），比其他套窄，像繪本版心。容器左右留白 20px，≥ 992px 時 32px。
- 常用兩種格：置中單欄（680–880px：專案故事、結帳、成功頁）與兩欄卡片格（列表、贊助紀錄、方案卡、詳情卡片牆）。
- 區塊上下留白 64px（手機）／104px（≥ 992px）。間距尺度 4／8／16／24／32／48／64／104。
- 1920 寬：洞洞板面板、遊戲墊、頁尾的底色滿版或在容器內，內容對齊版心。

### 頁首：漂浮膠囊

- `<header class="site-header">` 本身透明、`position: sticky; top: 12px`；內層 `.site-capsule`（`.navbar`）是左右對齊容器的白色膠囊：高 64px、柔陰影、2px 淡紫外框。
- Logo＝`images/favicon.svg`（三塊積木疊成的小島＋葡萄紫小球）＋「島造」（粉圓）＋ ISLANDMAKE（Fredoka 小字）。
- 主導覽 3 項是小膠囊；**目前頁＝檸檬黃底＋深字＋左側小圓點**（不只靠顏色）；hover 淡紫底。
- 右側：淡紫膠囊搜尋框 → 「我要提案」葡萄紫膠囊（`.btn-primary.btn-sm`）→ 頭像（櫻花粉外圈）。
- < 992px：膠囊內 Logo＋搜尋鈕＋頭像＋漢堡；漢堡展開時膠囊變成 28px 圓角的面板往下長（`:has(.navbar-collapse.show)`）；放大鏡展開的搜尋列是膠囊下方另一塊白色圓角面板。
- sticky 位移 `$sticky-offset`＝12＋64＋16＝**92px**，`html { scroll-padding-top }` 已設好。sticky 的側欄、禮物盒、目錄一律用 `top: $sticky-offset`。
- `check-layout.mjs` 的限制：`<a class="skip-link">` 到 `</header>` 整段、`<footer class="site-footer">` 到 `</html>` 整段要和範本一字不差；導覽連結的開始標籤是 `<a class="nav-link" href="…">`，目前頁 `<a class="nav-link active" href="…" aria-current="page">`；`<header class="site-header">` 不能再加 class。

### 頁尾：托盤

- `$lilac-100` 淡紫底，上緣一排扇貝半圓（`::before` 的 `radial-gradient`）。4 欄：品牌（Logo＋介紹）｜贊助者｜提案者｜平台，欄標題前一顆小積木（櫻、紫、黃）。連結葡萄墨，hover 葡萄紫＋底線。版權列上方一條虛線。
- 頁尾有 64／104px 的上外距；頁面最後一個區塊不用再加很大的下留白（首頁 `.home-proof` 的 `padding-bottom: 0`）。

### 卡片：玩具盒卡

- `.toybox`：白底、**24px 圓角**、2px `$lilac-100` 淡框、12px 內距形成「盒窗」，圖片放在 20px 圓角的 `.img-frame` 裡；陰影 `0 10px 24px rgba(108,67,198,.10)`。
- 盒窗左上貼**分類貼紙** `.sticker`（膠囊、分類色底＋深字、-3°）；剩 ≤ 7 天時右上加 `warn` 時間警示（狀態不旋轉）。
- hover／focus-within：框線變 `$lilac-300`、陰影加深一階。**尺寸不變、不彈跳、不出現隱藏資訊**。
- 分類色（只當色面，不當狀態）：設計生活＝櫻 `sticker-sakura`、科技硬體＝紫 `sticker-lilac`、出版與影像＝黃 `sticker-lemon`、社會設計＝桃 `sticker-peach`；遊戲桌遊、食品飲料等其他分類用白底 `.sticker`。
- **不用黑色或深色粗框，不用 0 模糊的位移硬陰影**（和 03 分開）；陰影一律帶葡萄紫、有模糊。

### 標題階層

- 區塊 h2 **置中**，上方一排 3 顆小積木 `.title-blocks`（櫻、紫、黃，裝飾）＋副標，用 `.section-title` 包起來；「看全部」這類連結放在區塊內容的下方置中，不放在標題右側。
- 頁面標題區**不是滿版色帶**：容器內 40px 圓角的 `$sakura-50` 洞洞板面板 `.page-panel`（麵包屑 → H1 → 說明，左對齊）。個人頁的「玩具間名牌」用 `.page-panel.page-panel-lilac`。
- 字級：首頁 H1 粉圓 `clamp(2.75rem, 1.8rem + 3.4vw, 4.5rem)`／1.15（≥ 992px 依半欄寬固定為 3.5／4.125／4.5rem，讓「等大公司做。」整行放得下）；H1 2.75rem／1.25；h2 2rem／1.3；h3 1.375rem／1.3；內文 Noto Sans TC 1rem／1.8；長文 1.0625rem／1.95、最大 680px。
- 數字一律 Fredoka 600：儀表板金額 3rem、達成率泡泡 2.75rem、卡片達成率 1.75rem。表格與要上下對齊的數字用 `.num`（Noto Sans TC 的 `tabular-nums`）。

### 招牌元素

| 元素 | 用在 | 說明 |
|---|---|---|
| 積木條 `.blocks`（M、S） | 專案卡、列表、贊助紀錄、提案管理、限量名額 | 12 格圓角積木。未達標＝`$lilac-500` 填到達成率；剛好達標＝滿格；超額＝滿格，目標前紫、目標後 `$sakura-600`；M 尺寸超額時目標處插一面檸檬旗（旗桿 `$ink`） |
| 滾球軌道 `.rollway`（L、`.rollway-mini`） | 首頁 Hero 卡、專案遊戲墊、底部托盤 | 14px 軌道＋28px 小球；目標旗＋「目標」小字插在 `--target`；小球停在達成位置（超額時在最右端） |
| 積木塔 `.tower` | 只在首頁 Hero 卡 | 每 100% 一層；旁邊標 100%、200% 刻度；達成率數字在旁邊的檸檬泡泡 `.rate-bubble` |
| 軟萌方案卡 `.reward-card` | 專案細節回饋方案、Guideline | 檸檬黃價格吊牌（圓角牌＋打孔圓點）、彩色圓點清單；選中＝`$lemon-100` 底＋3px 葡萄紫框＋右上葡萄紫圓形勾貼紙＋較深陰影；旁邊是「禮物盒」小計卡 `.giftbox` |
| 之字形路線圖 `.route` | 專案細節生產排程 | ≥ 992px 中央踏石小路、4 站左右交錯；< 992px 改成左側垂直路線（`.route-vertical` 任何寬度都是垂直） |
| 底部玩具托盤 `.toy-tray` | 專案細節（所有寬度） | 桌機是置中、最大 880px 的白色膠囊托盤（離底 16px）；手機就是 MobileActionBar（`.toy-tray`，`body.has-tray` 留出托盤高度） |
| 洞洞板 `@include pegboard`／`.pegboard` | Hero 面板、頁面標題區面板、空狀態、遊戲墊 | 2px 圓點、24px 間距、`$lilac-300` 半透明 |
| 斜放疊板 `.has-plate`（`.has-plate-2`） | Hero 卡、登入／註冊卡 | 包在卡片外層，後面露出旋轉 4° 的紫板（＋ -3° 的黃板）；卡片與文字本身不旋轉 |
| 散落積木與小球 `.deco` | Hero 面板、登入面板、空狀態周圍 | `aria-hidden`、`pointer-events: none`、位置固定；每個畫面最多 6 個；< 992px 縮小，會擋字的加 `.deco-hide-sm` |

進度的資料介面和 02 相同：未達標 `style="--value: 68%"`、剛好達標 `.is-full`、超額 `.is-over`＋`style="--target: 40.5%"`（目標 ÷ 已募，CONTENT 附錄 B.5）。進度圖形都是裝飾（`aria-hidden="true"`），數字一定以文字出現在旁邊。

### 動態

| 動態 | 做法 |
|---|---|
| 積木放上去 | 積木條的填色層 `scaleX` 0 → 1、800ms（遮罩在外層，看起來一格格出現），只跑一次 |
| 小球滾到定位 | `.rollway-run` 從起點 `translateX` 滑到位置、小球同時旋轉，1.1s 輕微回彈，只跑一次 |
| 積木塔疊上去 | 三層由下往上依序落下（`translateY`＋淡入），只跑一次 |
| 按下按鈕 | `:active` 時 `translateY(1px)`＋陰影變淺 |
| hover | 卡片陰影加深＋框線變 `$lilac-300`、按鈕變深、連結底線；不彈跳、不放大、不搖晃 |

`prefers-reduced-motion: reduce` 時全部關閉（`_base.scss`）：小球直接在定位、積木直接顯示。

### 各頁構圖原則（之後的頁面照這裡做）

- **projects**：`.page-panel` → 左 3「玩具箱篩選欄」（`$lilac-50`、32px 圓角、sticky 92px；群組標題粉圓；`.chip` 糖果膠囊，選中＝葡萄紫底白字＋勾）｜右 9：工具列 → **2 欄玩具盒卡**（盒窗 4:3 → h2 → 提案者全稱 → 介紹全文 → 達成率＋金額 → M 積木條 → 「目標」「N 人贊助」「剩 N 天」`.pill` → 底部標籤列）。同一列兩張卡等高、資料列貼底（`.project-card-data` 的 `margin-top: auto`）。分頁是圓形糖果按鈕。< 992px 篩選是 `.offcanvas-lg` 全螢幕浮層（32px 上圓角）。
- **project**：麵包屑 → 置中 10 欄主視覺（32px 圓角；≥ 992px 寬度跟著視窗高度縮，最窄 36rem，讓 H1 與說明在首屏露出、不被底部托盤蓋住）＋下緣疊一排 5 顆圓角縮圖 → 置中標題區 → **遊戲墊儀表板**（置中 10 欄、`$lilac-50` 洞洞板、不 sticky：左半目前募得＋滾球軌道 L＋達成率泡泡、右半兩顆 `.num-block`）→ 頁內導覽糖果膠囊 → 故事置中 680px。回饋方案 8：4：左 2 欄方案卡格（方案 1 跨 2 欄），右 4 sticky「禮物盒」小計卡（`$lilac-100`、卡頂 CSS 緞帶蝴蝶結）。排程之字形；延遲範例是一張平實的 `err` 卡。關於提案者置中大頭像 `.avatar-xl.avatar-ring`。留言是對話泡泡（同首頁評價的泡泡造型）。底部玩具托盤：`body` 底部要留出托盤高度＋16px，`scroll-padding-bottom` 同值，`z-index` 低於 Modal 與 Offcanvas。
- **account**：`.page-panel.page-panel-lilac` 名牌 → 左 3 sticky 積木導覽（每項一塊不同淡色底的圓角積木按鈕，目前項＝葡萄紫底白字＋左側小球）｜右 9。贊助紀錄 2 欄玩具盒卡（募資中加 S 積木條，卡 4 降一階）；提案 5 張全寬圓角列卡；數據是 `.num-block`＋圖表卡（32px 圓角白底、線 `$grape`、面積 `$lilac-500` 20%、目標虛線 `$ink-muted`）。
- **login／register**：整塊 `$sakura-50` 洞洞板面板（容器內、40px 圓角）裡置中：卡外大 H1（`.display-2` 粉圓 3.5rem）→ 480px 白色表單卡（32px 圓角、不旋轉）包在 `.has-plate.has-plate-2` 裡；註冊加 `.plates-swap`。手機去掉疊板與陰影。
- **checkout／order-result**：置中 760px 單欄；步驟條＝3 塊積木（已完成 `$lilac-300` 積木＋白色圓點裡的葡萄紫勾、目前 `$lemon-400` 底深字、未到白底虛線框）；收件、付款、禮物盒摘要一張張往下堆。成功頁是淡紫洞洞板上的 640px 吊牌卡。
  - 已完成原本寫 `$lilac-500` 底白勾，但白字在 `$lilac-500` 只有 3.3：1，所以改成 `$lilac-300` 積木（墨色字 7.8：1）、勾放在白色圓點裡（葡萄紫 6.45：1）。
- **backing**：`.page-panel` → 專案摘要玩具盒大卡（置中 10 欄）→ 2 欄彩色卡片牆 → 全寬取消贊助卡（白底、`.btn-danger-text`、不加裝飾）。
  - 卡片牆原本是 2×2（方案｜付款、收件｜進度），但 4 張卡高度差太多，改成「我的方案」與「生產與交付進度」各跨 2 欄、中間付款｜收件並排；進度卡寬度夠，≥ 992px 用之字形路線圖，< 992px 垂直。
- **guideline**：`.page-panel` → 9：3、目錄在右（`.block-nav` 積木導覽＋章節編號、sticky 92px、ScrollSpy；< 992px 變頂部可橫捲的 `.candy-tabs`）。00 概念與頁面 → 01 色彩 → 02 字級 → 03 間距 → 04 圓角陰影 → 05 元件狀態 → 06 圖表 → 07 文案 → 08 RWD → 09 Do／Don't，每章一張 `.stack-card`（色帶輪替）。
  - 色票是「顏料罐」圓形色塊，分成粉彩、品牌、面文字與線、深色底四組，每罐寫 hex、變數名、用途與對比小膠囊；不當文字的顏色標「不當文字」。
  - 元件示範一律用頁面上的真實 class（`.toybox`、`.reward-card`、`.route`、`.toy-tray`、`.comment`、`.chart-card`…），示範框是 `.gl-stage`；頁首膠囊縮圖只在視窗 ≥ 1400px 時畫出完整導覽，其他寬度畫成漢堡版。
  - Guideline 的表單欄位不加 `name`；回饋方案與篩選標籤的 radio 用 `name="glReward"`、`name="glChip"` 只為了分組，不會碰到 `main.js` 的 `name="reward"`。

## 檔案結構

```
06-toy-factory-style/
├─ *.html                    ← 10 個頁面（含 guideline.html），每頁完整包含頁首與頁尾
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製（開頭註解寫了目前頁規則）
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
│  ├─ components/            ← 頁首、頁尾、進度（積木條、滾球軌道、積木塔、達成率泡泡）、玩具盒卡、裝飾、方案卡與禮物盒、路線圖、留言、底部托盤、積木導覽、圖表、流程頁（步驟條、疊疊卡、選擇卡、明細清單）
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾是否與範本一致、目前頁標示是否正確
   └─ generate-images.mjs    ← 生圖腳本（STYLE 與 23 張 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾每頁一份**：改頁首或頁尾時，先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check`。每頁只有一處不同：頁首導覽的目前頁（首頁標「首頁」、專案列表標「探索專案」、**專案細節也標「探索專案」但只加 `active`**、個人頁標「我的島造」、**贊助紀錄詳情也標「我的島造」但只加 `active`**、Guideline 與流程頁不標示）。`check-layout.mjs` 會檢查這個對應；頁面還沒全部建立時，它只檢查已存在的 `.html`。
- **`<body>` 的屬性每頁不同**：ScrollSpy 寫在 `<body>` 上；專案細節的底部托盤留白也寫在 `<body>` 的 class。
- **新增頁面**：複製範本成新頁，改 `<title>`、description 與頁首的目前頁標示；頁面樣式寫在 `scss/pages/` 對應的 partial（已經 `@import`）；新的共用元件放 `scss/components/`，在 `main.scss` 加一行 `@import`，並補進下方「共用類別」表。
- **假資料直接寫在 HTML**：數字照 `../CONTENT.md`，同一個專案在每一頁都相同（帆布包 NT$ 1,235,600／目標 NT$ 500,000／247%／1,042 人／剩 12 天）。
- **JS**（`js/main.js`，和 02 相同的五件事）：
  1. 手機搜尋列 `#siteSearchMobile` 展開後自動聚焦。
  2. 可橫捲的分頁列（`.nav`、`[role="tablist"]`、`[data-filter-list]`）切換時把目前項目捲進畫面。
  3. 回饋方案選取：`<input type="radio" name="reward" value="2280" data-reward-name="標準單入組">`（已額滿加 `disabled`）、自訂金額 `#pledgeAmount`、快捷鈕 `data-add-amount="500"`、要跟著更新的文字 `data-summary="name|price|extra|total|min"`（禮物盒小計卡與底部托盤可以各放一份，同名的會一起更新）。
  4. 贊助紀錄分頁篩選：按鈕群組 `data-filter-list="#backingList"`、按鈕 `data-filter="funding"`（多個狀態用空白分隔）、清單項目 `data-status`；空狀態 `[data-filter-empty]` 緊接在清單後面。
  5. 角色切換：外層 `data-role="proposer|backer"`、按鈕 `data-role-switch`，網址 `account.html?role=backer` 直接開贊助者畫面。
- **換行與空白**：專案名稱用 `.text-phrase`＋`<wbr>` 標出詞組斷點，數字與單位之間用 `&nbsp;`。在 `word-break: keep-all` 的容器裡 `&nbsp;` 會失效，數字＋單位要再包一層 `.text-nowrap`（例：個人頁數字積木的 `<span class="text-nowrap"><strong class="figure-num">1,840</strong>&nbsp;人</span>`）。
- **沒有目的頁的按鈕**（了解如何提案、取消贊助、編輯…）用 `<button type="button">`；連結（忘記密碼？、服務條款…）用不帶 `href` 的 `<a>`。
- **表單**：`<form action="目的頁">` GET 換頁；密碼、Email、姓名、手機、地址、卡號欄位不加 `name`；欄位一律有 `id`、`<label for>`、`autocomplete`；錯誤＝`.is-invalid`＋`aria-invalid="true"`＋`aria-describedby`＋`.invalid-feedback`（前面放 `bi-exclamation-circle`）。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、6 種語意色調、分類色、字體、間距、圓角、陰影、元件、招牌元素尺寸）
3. `bootstrap/scss/bootstrap`
4. `bootstrap-icons`：圖示字型與 class（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字體、區塊節奏、焦點、按鈕、狀態徽章、提示框、貼紙、膠囊、篩選標籤、分頁、數字積木、狀態示意、空狀態
6. `components/*`：頁首、頁尾、進度、玩具盒卡、裝飾、方案卡與禮物盒、路線圖、留言、底部托盤、積木導覽、圖表、流程頁
7. `pages/*`：各頁專屬樣式，class 加頁面前綴（`home-`、`plist-`、`pd-`、`acct-`、`gl-`、`auth-`、`co-`／`or-`、`bk-`）

先用 Bootstrap 的變數與工具類別，做不到才寫自訂 CSS，自訂 CSS 也只引用變數，不寫死色碼。

### 粉圓的字重

粉圓（Huninn）只有 400 一個字重。`$headings-font-weight`、`$btn-font-weight`、`$nav-link-font-weight` 都是 400，`html { font-synthesis: none }` 關掉瀏覽器的假粗體；標題、按鈕、導覽裡的 `<strong>` 也維持 400。要強調時用顏色、字級，或改用 Noto Sans TC 700（`.status`、`.callout-title` 就是 Noto Sans TC）。

### 共用類別

下面這些類別跨頁共用，新頁面直接套用，不要在 `pages/*` 另寫一份。

| 類別 | 用途 | 位置 |
|---|---|---|
| `.page-panel-wrap`＋`.page-panel`（`.page-panel-lilac`、`.page-panel-crumb`）、`.page-lead` | 首頁以外各頁的頁面標題區：容器內 40px 圓角的櫻花粉洞洞板面板，麵包屑 → H1 → 說明 | `_base.scss` |
| `.section`、`.section-tight`、`.section-sakura`／`-lilac`／`-card`、`.section-mat` | 區塊上下留白 64／104px、背景色；`.section-mat` 是淡紫洞洞板「遊戲墊」區塊（上緣 48px 圓角） | `_base.scss` |
| `.section-title`（`.section-title-start`）、`.title-blocks` | 置中區塊標題：上方 3 顆小積木＋h2＋副標 | `_base.scss` |
| `@include pegboard`、`.pegboard` | 洞洞板圓點紋理 | `_base.scss` |
| `@include meta-dots` | meta 列（`<p><span>…</span><span>…</span></p>`）欄位之間的小圓點；換行時行首那顆被裁掉，不會變成清單符號。用在贊助紀錄卡、提案列卡、統計期間、圖表副標、底部托盤 | `_base.scss` |
| `.figure-num`、`.num`、`.latin`、`.font-round` | Fredoka 大數字；等寬數字；Fredoka 英文字標；粉圓 | `_base.scss` |
| `.text-phrase`、`.text-note` | 詞組換行；次要小字 | `_base.scss` |
| `.btn-primary`、`.btn-lemon`、`.btn-outline-primary`、`.btn-on-grape`、`.btn-danger-text`、`.btn-icon`、`.btn-text` | 主要（葡萄紫塑膠按鍵）、強調（檸檬黃深字）、次要（白底淡紫框）、葡萄紫面上的按鈕、危險文字按鈕（取消贊助）、圓形圖示鈕、文字連結 | `_base.scss` |
| `.status` ＋ `.status-live`／`-info`／`-warn`／`-ok`／`-err`／`-idle`（`.has-dot`、`.status-dashed`、`.status-on-photo`） | 6 種語意的狀態徽章：膠囊、圖示（或圓點）＋文字；err 另加框線；已下架加虛線 | `_base.scss` |
| `.callout` ＋ `.callout-ok`／`-warn`／`-err`／`-info`／`-idle`／`-live`（`.callout-icon`、`.callout-body`、`.callout-title`） | 圓角淡底提示框（不放關閉鈕）；err 加框線 | `_base.scss` |
| `.sticker`（`.sticker-sakura`／`-lilac`／`-lemon`／`-peach`、`.sticker-flat`） | 分類貼紙：膠囊、分類色底＋深字、-3°；`.sticker-flat` 不旋轉 | `_base.scss` |
| `.pill`（`.pill-white`、`.pill-warn`）、`.pill-list` | 資訊小膠囊（目標、贊助人數、剩餘天數、回饋門檻、預計出貨）；`.pill-warn` 是剩 ≤ 7 天的時間警示 | `_base.scss` |
| `.chip`（`.chip-count`、`.chip-applied`、`.chip-remove`） | 篩選標籤（搭配 `.btn-check`）：選中＝葡萄紫底白字＋勾 | `_base.scss` |
| `.candy-tabs`（`.candy-tabs-start`、`.tab-count`） | 糖果膠囊分頁（Bootstrap Tab 或篩選按鈕）：選中＝葡萄紫底白字；手機在自己的容器內橫捲 | `_base.scss` |
| `.img-frame`、`.ratio-4x5`、`.ratio-3x2` | 20px 圓角圖片盒窗、補 Bootstrap 沒有的比例 | `_base.scss` |
| `.avatar`（`-sm`、`-lg`、`-xl`、`.avatar-ring`、`.avatar-text`、`.avatar-sakura`／`-lemon`／`-peach`） | 照片頭像（櫻花粉外圈）、糖果色文字頭像 | `_base.scss` |
| `.num-block`（`-label`、`-value`、`-note`；`.num-block-sakura`／`-lilac`／`-lemon`／`-peach`、`.is-ok`） | 數字積木（StatTile）：小標籤 → Fredoka 大數字 → 一行補充 | `_base.scss` |
| `.stat-list` | 標籤在上、數字在下的 `<dl>` | `_base.scss` |
| `.table-frame` | 24px 圓角外框表格（窄螢幕在框內橫捲） | `_base.scss` |
| `.demo-state`（`-tag`、`-title`、`-grid`、`-grid-3`、`-stage`、`-label`） | 頁面底部的「設計稿狀態示意」，以虛線和正式內容分開 | `_base.scss` |
| `.empty-state`（`.empty-state-plain`）、`.empty-state-icon` | 空畫面：洞洞板圓角面板＋白色圓形圖示；失敗、退款類用 `.empty-state-plain`（白底、不用洞洞板） | `_base.scss` |
| `.for-proposer`、`.for-backer` | 依外層 `data-role` 顯示或隱藏 | `_base.scss` |
| `.form-control-pill`、`.invalid-feedback`（前面放 `.bi`） | 膠囊輸入框（自訂金額）；錯誤文字＝圖示＋文字 | `_base.scss` |
| `.site-header`、`.site-capsule`、`.site-brand`、`.site-nav`、`.site-search`、`.site-avatar`、`.site-icon-link`、`.site-search-mobile` | 漂浮膠囊頁首（只在範本裡用） | `components/_header.scss` |
| `.site-footer`、`.site-footer-title`、`.site-footer-links`、`.site-footer-copy` | 托盤頁尾（只在範本裡用） | `components/_footer.scss` |
| `.blocks`（`.blocks-md`、`.blocks-sm`、`.is-full`、`.is-over`） | ★ 積木條：`<div class="blocks blocks-md is-over" style="--target: 40.5%" aria-hidden="true"><span></span></div>` | `components/_progress.scss` |
| `.rollway`（`.rollway-mini`、`.is-full`、`.is-over`）、`.rollway-track`、`.rollway-flag`、`.rollway-run`、`.rollway-ball` | ★ 滾球軌道（HTML 結構見檔頭註解） | `components/_progress.scss` |
| `.tower`、`.tower-layer`（`.is-over`、`--fill`、`data-tick`） | ★ 積木塔（只在首頁 Hero 卡） | `components/_progress.scss` |
| `.rate-bubble` | 檸檬黃達成率泡泡（首頁 Hero 卡、專案細節遊戲墊） | `components/_progress.scss` |
| `.toybox`（`.toybox-window`、`.toybox-sticker`、`.toybox-alert`、`.toybox-body`） | ★ 玩具盒卡：白底、24px 圓角、盒窗圖片、貼紙、柔陰影 | `components/_toybox.scss` |
| `.project-card-title`、`.project-card-maker`、`.project-card-data`、`.project-figures`（`-rate`、`-amount`）、`.project-meta`（`-urgent`） | 專案卡內容：名稱（`stretched-link` 的焦點框畫在整張卡上）、提案者、達成率＋金額、積木條、贊助人數＋剩餘天數（資料區貼底）。卡片本身寫 `<article class="toybox project-card">`，`.project-card` 只是辨識用的掛鉤，沒有樣式 | `components/_toybox.scss` |
| `.deco`（`.deco-block`、`.deco-ball`、`.deco-ball-sakura`、`.deco-long`、`.deco-sm`／`-lg`、`.deco-sakura`／`-lilac`／`-lemon`／`-peach`、`.deco-hide-sm`） | 散落的積木與小球：`style="--x: 4%; --y: 12%; --r: -12deg"`，放在 `overflow: clip` 的面板裡 | `components/_deco.scss` |
| `.has-plate`、`.has-plate-2`、`.plates-swap`（`--plate-radius`） | 卡片後面斜放的彩色疊板（包在卡片外層） | `components/_deco.scss` |
| `.reward-grid`、`.reward`（`.reward-wide`）、`.reward-card`、`.reward-tag`、`.reward-name`、`.reward-items`、`.reward-facts`、`.reward-stock`、`.reward-cta`、`.reward-check` | ★ 軟萌方案卡：`<input class="btn-check" type="radio" name="reward">`＋`<label class="reward-card">`，整張卡可點；選中、已額滿的樣式跟著 radio 狀態（結構見檔頭註解） | `components/_reward.scss` |
| `.giftbox`（`-bow`、`-title`、`-amount`、`-min`、`-quick`、`-rows`、`-total`、`-note`、`.giftbox-mini`） | 「禮物盒」小計卡：`$lilac-100`、卡頂緞帶與蝴蝶結；自訂金額、快捷鈕、`data-summary` 小計 | `components/_reward.scss` |
| `.route`（`.route-vertical`、`--route-bg`）、`.route-stop`、`.route-node`（`.is-done`／`.is-live`／`.is-todo`）、`.route-card`、`.route-head`、`.route-title`、`.route-date`、`.route-update`、`.route-photos`、`.route-toggle` | ★ 之字形路線圖（專案細節的生產排程；要一直維持垂直時加 `.route-vertical`）；`--route-bg` 要設成所在區塊的底色，最後一站下方的小路才會被蓋掉 | `components/_route.scss` |
| `.comment`、`.comment-main`、`.comment-head`、`.comment-author`、`.comment-time`、`.comment-bubble`、`.comment-reply`、`.comment-compose`、`.comment-more` | 留言對話泡泡（白底 24px 圓角＋小尾巴）、提案者回覆（淡紫泡泡）、留言輸入框 | `components/_comment.scss` |
| `.toy-tray`（`-inner`、`-info`、`-amount`、`-meta`、`-rollway`、`-cta`）、`body.has-tray` | ★ 底部玩具托盤：手機貼底、≥ 992px 置中膠囊；`body` 加 `.has-tray` 才會在頁尾與 `scroll-padding-bottom` 留出托盤高度 | `components/_tray.scss` |
| `.block-nav`、`.block-nav-group`、`.block-nav-count`、`.block-nav-unread` | 積木導覽（個人頁側欄、可給 Guideline 目錄用）：每項一塊輪替淡色的積木按鈕，目前項＝葡萄紫底白字＋檸檬小球；搭配 ScrollSpy | `components/_block-nav.scss` |
| `.chart-card`、`.chart-card-head`、`.chart-title`、`.chart-sub`、`.chart-scroll`、`.chart-svg`、`.chart-grid`／`-axis`／`-area`／`-line`／`-target`／`-dot`／`-ball`、`.chart-table` | 圖表卡：32px 圓角白底、線 `$grape`、面積 `$lilac-500` 20%、目標虛線；< 768px SVG 只在卡內橫捲 | `components/_chart.scss` |
| `.bar-list`、`.bar-row`（`style="--bar: 86.7%"`）、`.bar-label`、`.bar-track`、`.bar-fill`、`.bar-value`、`.bar-note`、`.bar-flag` | 積木長條（各回饋方案銷售分佈）：同一個數據色，數值標在尖端 | `components/_chart.scss` |
| `.chart-tooltip`、`.chart-tooltip-guide` | 圖表提示框：SVG 裡的 `<g>`，葡萄墨底淡紫字＋一條細的垂直指引線；設計稿畫成固定顯示的一個例子（09/24 當日募資） | `components/_chart.scss` |
| `.chart-dark` | 深色底圖表卡：加在 `.chart-card` 上，底 `$plum-900`、線與面積 `$on-plum-data`（8.4）、文字 `$on-plum`／`$on-plum-muted`，提示框反成白底；積木長條 `.bar-list` 放進去也會跟著換色。目前只在 Guideline 06 章示範 | `components/_chart.scss` |
| `.brick-steps`、`.brick-step`、`.brick-step-node`、`.brick-step-label`（`li` 加 `.is-done`／`.is-current`／`.is-todo`） | ★ 積木步驟條（結帳、贊助成功）：3 塊上緣有凸點的積木一列；可點回上一步時 `.brick-step` 寫成 `<a>`；目前那一步在 `li` 加 `aria-current="step"` | `components/_flow.scss` |
| `.stack-card`（`-sakura`／`-lilac`／`-lemon`／`-peach`／`-plain`）、`.stack-card-head`、`.stack-card-icon`、`.stack-card-title`、`.stack-card-lead`、`.stack-card-body` | 疊疊卡：白底 32px 圓角，卡頂一條淡色帶＋一塊有凸點的圖示積木；`-plain` 是平實的白卡（取消贊助） | `components/_flow.scss` |
| `.option-grid`（`.option-grid-stack`）、`.option`、`.option-card`（`.option-card-static`）、`.option-mark`、`.option-head`、`.option-name`、`.option-line`、`.option-icon` | 選擇卡：`<input class="btn-check" type="radio">`＋`<label class="option-card">`，整張卡可點；選中＝檸檬淡底＋葡萄紫框＋右上角葡萄紫勾貼紙（收件地址、付款方式） | `components/_flow.scss` |
| `.detail-list`（`.is-total`） | 明細清單：`<dl>` 每列一個 `<div>`、點線分隔；≥ 576px 標籤左、值靠右；總額那列 Fredoka 大一號 | `components/_flow.scss` |
| `.pledge-project`（`-thumb`、`-name`、`-maker`）、`.pledge-plan-head`、`.pledge-label`、`.pledge-plan-name`、`.pledge-items`、`.pledge-note`、`.pledge-note-label`、`.pledge-rows`（`-tint`）、`.pledge-total`、`.pledge-fineprint` | 贊助摘要零件（結帳的禮物盒摘要、贊助紀錄詳情的我的方案）：方案名是打了洞的檸檬吊牌、回饋內容彩色圓點清單、金額小白卡 | `components/_flow.scss` |
| `.btn-danger` | 確認取消的危險按鈕（加上本風格的塑膠內陰影） | `components/_flow.scss` |

首頁專屬類別（不跨頁共用）：`.home-hero-panel`、`.home-hero-*`、`.hero-toy-*`、`.value-block*`、`.gacha-*`、`.home-featured-*`、`.home-review-*`（對話泡泡）、`.home-guarantee*`、`.home-propose*`，都在 `pages/_home.scss`。留言的對話泡泡已另寫成共用的 `.comment-bubble`（`components/_comment.scss`）。

其他頁的專屬類別也都加頁面前綴，不跨頁共用：專案列表 `.plist-*`（`pages/_projects.scss`）；專案細節 `.pd-*` 與長文 `.story`、`.story-*`（`pages/_project.scss`）；個人頁 `.acct-*`、`.backing-card*`、`.address-card*`、`.settings-*`（`pages/_account.scss`）；登入與註冊 `.auth-*`（`pages/_auth.scss`）；結帳 `.co-*`、贊助成功 `.or-*`，兩頁共用 `.flow-top`、`.flow-col`（`pages/_checkout.scss`）；贊助紀錄詳情 `.bk-*`（`pages/_backing.scss`）；Guideline `.gl-*`（顏料罐、版面示意圖、示範框 `.gl-stage`、Do／Don't 對照…，`pages/_guideline.scss`），只給 `guideline.html` 用。

- 專案故事的小標 `.story h3`（粉圓 1.3125rem／1.45，上距 2rem、下距 .5rem）寫在 `pages/_project.scss`。Notion 的故事沒有小標，所以 `project.html` 沒用到，示範放在 Guideline 02 字級章。

- `.page-panel` 裡的直接子元素都會疊在 `.deco` 上面（`position: relative; z-index: 1`），面板裡可以放散落的積木。
- `.candy-tabs` 的項目不會被擠扁，放不下時在自己的容器內橫捲。

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 面 | 奶油白 `$page #FFFAF7`（頁面、theme-color）、白 `$card #FFFFFF`（卡片、輸入框、頁首膠囊） |
| 櫻花粉 | `$sakura-50 #FFF1F5`（面板）、`-100 #FFE3EC`（標籤、泡泡）、**`-300 #F7B8CB`**（色面、貼紙、裝飾積木；墨 8.4）、`-600 #D9578A`（超額積木；對白 3.7，不當文字） |
| 馬卡龍紫 | `$lilac-50 #F4ECFF`（遊戲墊）、`-100 #ECE3FF`（頁尾、淡框）、**`-300 #CDB8F6`**（疊板、hover 框）、`-500 #9B7BE0`（目標內積木、圖表面積；對白 3.3） |
| 檸檬黃、桃 | `$lemon-100 #FFF6CC`（選中底）、**`$lemon-400 #FFE45E`**（強調按鈕、目標旗、達成率泡泡、目前頁；墨 10.9；對白 1.3，不當圖形）、`$peach-200 #FFD9C4`（第 4 個分類色） |
| 品牌 | 葡萄紫 `$grape #6C43C6`（主要按鈕、連結、選中、焦點、小球；白字 6.45、對頁面 6.2）、`$grape-700 #5A35AD`（hover；白字 8.2） |
| 文字與線 | 葡萄墨 `$ink #3B2347`（13.4）、次要 `$ink-muted #6A5476`（6.5；所有 -50／-100 色面上 ≥ 5.0）、表單框線 `$control #7F6A8C`（對白 4.8）、軌道 `$track #EDE4F7`、空積木虛線 `$track-dash #9A86AD`（3.3）、深色底 `$plum-900 #2E1A38` |
| 語意 6 色 | live `#5B33B0`／`#EFE7FF`（6.9）、info `#1D5C9E`／`#E2EFFC`（5.9）、warn `#874700`／`#FFF0BF`（6.3）、ok `#1C6D43`／`#DFF5E7`（5.5）、err `#AE1E3D`／`#FFE1E7`（5.6，另加框線）、idle `#5D5466`／`#F1EDF3`（6.2） |
| 字體 | 粉圓 Huninn 400（標題、按鈕、導覽、貼紙）、Noto Sans TC 400／500／700（內文、表單、狀態）、Fredoka 500／600（數字與英文） |
| 間距 | 4、8、16、24、32、48、64、104px；容器 1240px、左右 20／32px；gutter 32px；區塊上下 64／104px；頁首膠囊離頂 12px、高 64px、sticky 位移 92px |
| 圓角 | 積木 6px、輸入框 16px、圖片 20px、卡片 24px、大卡與面板 32px、Hero 與標題面板 40px、按鈕與徽章全圓 |
| 陰影 | 果凍柔陰影，一律帶葡萄紫：卡片 `0 10px 24px rgba(108,67,198,.10)`、浮起與選中 `0 12px 28px rgba(108,67,198,.20)`；按鈕加下緣 3px 內陰影（塑膠按鍵厚度）。不用 0 模糊的位移硬陰影 |
| 焦點 | 3px 葡萄紫＋2px 白色間隙；葡萄紫面上換成檸檬黃外圈 |
| 動態 | 積木一格格放上、小球滾到定位、積木塔疊上去（都只跑一次）；按下 1px；`prefers-reduced-motion` 時全部關閉 |

色票與對比依藝術總監的方向說明實算，沒有調整；另外加了兩個衍生色：`$grape-light #7B52D3`（主要按鈕漸層上緣，白字 5.3）、`$lemon-500 #FFD93A`（強調按鈕 hover，墨 10.0）。改色時照下面的清單一起改。

### 換色時同步檢查

色票的唯一來源是 `scss/_variables.scss`，但下面幾處把數值寫成文字或寫死，改色時要一起檢查：

- [ ] `scss/_variables.scss`：色票、`$theme-colors`、6 種語意色調、分類色 `$category-colors`、深色底 `$plum-900`／`$on-plum*`，以及 Bootstrap 語意變數（`$body-*`、`$input-*`、`$focus-ring-color`…）；註解裡的對比度要重算。
- [ ] `guideline.html`：01 色彩章的顏料罐（hex、變數名、用途、對比小膠囊）、語意色調表與狀態徽章總表，04 章的陰影色碼字串；這些數字是照 `_variables.scss` 的註解手寫的。
- [ ] 圖表：`account.html` 與 Guideline 的 inline SVG 都用 class 上色（`.chart-line`、`.chart-area`、`.chart-tooltip`…），沒有寫死色碼；改色後確認淺色卡與 `.chart-dark` 深色卡的線、面積、提示框對比，Guideline 06 章的規則文字一起改。
- [ ] 本檔的「Design token 摘要」、招牌元素表與排版語言裡寫到的色名和對比。
- [ ] 改了頁首膠囊的高度或離頂距離時：`$sticky-offset`（目前 12＋64＋16＝92px）、各頁 sticky 的側欄／禮物盒／目錄，以及 Guideline 03 間距章、08 RWD 章的數字一起改。
- [ ] `scripts/generate-images.mjs` 的 `STYLE`、`PROPS`／`PAPER`：整組圖片的背景紙與道具顏色，換色後重新生圖。
- [ ] `templates/page.html` 與每一頁的 `<meta name="theme-color" content="#FFFAF7">`，以及 `images/favicon.svg`（也是頁首、頁尾的 Logo）裡的色碼；改完頁首頁尾執行 `npm run check`。

## 圖片

`images/` 的 23 張圖片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名、比例與畫面主體照上一層 [`../IMAGES.md`](../IMAGES.md)。調性是明亮柔和的高調攝影、手作玩具工坊的氣氛：產品照放在櫻花粉、馬卡龍紫或檸檬黃的無縫背景紙上，邊緣擺幾塊木頭積木與彩色小木球當道具（不碰到、不遮住產品），產品維持原本的顏色（原胚、墨綠、炭黑）。

- 玩具道具只用在產品照（`hero-canvas-bag`、`project-01/02/04/05/06/07`、`story-bag-details`、`story-fabric-colors`、`update-color-samples`）與 `category-design-living`、`category-hardware`。
- 紀實照片（`project-03-documentary`、`category-social-design`、`story-canvas-mill`、`story-sewing-artisan`、`proposer-workshop`、`update-fabric-rolls`）**不放任何玩具道具、花瓶或擺飾，不刻意粉彩**，只用柔和偏暖的光；粉色線軸、淡紫收納盒這類工坊裡本來就有的東西可以出現。
- P1 帆布包的每一張圖（主視覺、三色、細節、量產樣、贊助者實拍）都用同一段款式描述（圓頂拉鍊後背包、銅拉鍊、前袋、同色加厚肩帶），看得出是同一只包。
- `favicon.svg` 不是生成的：三塊積木（櫻、紫、黃）疊成小島、頂端一顆葡萄紫小球，同時當作頁首與頁尾的 Logo 標誌。

```bash
npm run images                                                # 產生缺少的圖片
node scripts/generate-images.mjs --only hero-canvas-bag --force  # 只重做指定的圖
CONC=1 node scripts/generate-images.mjs                       # 一次只跑一張（預設 2）
```

換風格時，改腳本裡的 `STYLE`、`PROPS`／`PAPER`／`REAL`（產品照、背景紙、紀實三種調性）與各張描述即可，檔名不用改。
