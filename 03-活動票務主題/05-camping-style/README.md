# 05｜戶外露營音樂節：StageOne 城市現場

> 淺色系＋暖大地（泥灰灰白、野營橘、橄欖綠）。結合手繪地圖圖標、露營風票券卡片，購票步驟像打包裝備般親切流暢。

概念是「StageOne 是一場週末的戶外音樂節，網站是營地的手冊」：頁面是泥灰色的紙，卡片是帆布，票券是掛在背包上的**行李吊牌**，區塊之間用**手繪山稜線**和**波浪線**接起來，像翻一本田野筆記。照片一律是黃昏的暖金色底片感。大膽只花在三件事上：

1. **行李吊牌**（`.tag-card`）：頂端一個鉚釘孔、上段牛皮紙、下段帆布，必要時掛一條麻繩。倒數、熱門活動、購票卡、電子票券都是吊牌。
2. **手繪圖示與地圖**：`images/hand-*.svg` 一組 22 個手繪線條圖示（樹皮色線＋一點橘色），用在導覽、區塊標題、價值主張；區塊底的等高線、山稜線、波浪線也都是手繪 SVG。
3. **打包清單**：購票步驟、票種、已選票券都用「打勾」的語言（`.check-mark` 手繪勾選圈、`.pack-list` 背包清單），讓買票像在打包裝備。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（架構同 `../04-biennale-style/`）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。單一淺色主題，不使用 `data-bs-theme`。
- **JS**：互動都交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的 8 個小功能。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西（字體從 Google Fonts 載入，離線時會退回系統字體）。

**要修改樣式**：

```bash
npm install        # 安裝 bootstrap、bootstrap-icons、sass，並把 Bootstrap JS 與圖示字型複製進專案
npm run watch      # 開發時：監看 scss/，存檔就重新編譯 css/style.css
npm run css        # 編譯一次
npm run build      # 交付前：重新複製 vendor 檔案＋編譯一次 CSS
npm run check      # 檢查各頁的 head、頁首、頁尾與登入 Modal 是否與範本一致
npm run vendor     # 只重新複製 Bootstrap JS 與圖示字型（npm install 時會自動執行）
npm run images     # 重新生成圖片（需要已登入的 codex CLI，換圖時才用）
```

## 頁面

| 頁面 | 檔案 | 樣式 | 狀態 |
|---|---|---|---|
| 設計 Guideline | `guideline.html` | `scss/pages/_guideline.scss` | 完成 |
| 首頁 | `index.html` | `scss/pages/_home.scss` | 完成 |
| 活動列表 | `events.html` | `scss/pages/_events.scss` | 完成 |
| 活動細節（含票種選擇與選位；以「午夜噪音祭 Vol.7」示範） | `event.html` | `scss/pages/_event.scss` | 完成 |
| 購票確認與快速支付（含付款結果與電子票券，在頁內 `#result`） | `checkout.html` | `scss/pages/_checkout.scss` | 完成 |
| 註冊 | `register.html` | `scss/pages/_register.scss` | 完成 |
| 我的票券 | `tickets.html` | `scss/pages/_tickets.scss` | 完成 |
| 電子票券詳情（午夜噪音祭 Vol.7 的 3 張票） | `ticket.html` | `scss/pages/_ticket.scss` | 完成 |
| 購票紀錄 | `orders.html` | `scss/pages/_orders.scss` | 完成 |
| 追蹤的主辦方 | `follows.html` | `scss/pages/_follows.scss` | 完成 |

頁面上沒有列出所有頁面的導覽：從首頁依購票流程點進各頁即可（首頁 → 活動列表 → 活動細節 →「下一步：確認訂單」→ 結帳 →「確認付款」→ `#result`），Guideline 直接開 `guideline.html`。會員中心 5 頁的入口在頁尾與流程裡（登入 Modal 的「註冊新帳號」→ `register.html`；頁尾的我的票券、購票紀錄、追蹤的主辦方）。

- 活動細節只做一頁靜態示範（午夜噪音祭 Vol.7），首頁與活動列表的每張活動卡都連到 `event.html`。
- 倒數、鎖位、付款中、付款結果都是**靜態畫面**，數字固定用 Notion 的值（05 時 12 分 48 秒、09:58、09:12）；其他狀態放在各頁底部的「設計稿狀態示意」（`.demo-state`）。
- 文案逐字取自主題層的 `CONTENT.md`，顯示欄位照 `_wireframe/WIREFRAME_SPEC.md`；星期幾照 Notion 原文，不修正。

## 排版語言

和同主題其他風格的差別：01 地下電音是全黑底霓虹與幾何切角票券、02 古典沙龍是打孔票根（半圓缺口＋撕線點）、03 電競是 HUD 括角面板、04 雙年展是黑白直角量體。這一套是**圓角、紙張、手繪線、斜一點點**：沒有直角的黑色量體，也不用撕線缺口。

### 網格與節奏

- 版心 1140（≥ 1200）／1240（≥ 1400），左右留白 24px（≥ 992 為 32px），欄距 32px。
- 區塊上下留白手機 64、桌機 120px（`.section`），比其他風格寬鬆，像翻手冊；緊一點的用 `.section-tight`。
- **區塊底色的節奏**：泥灰（頁面）→ 帆布色帶（`.band-canvas`，上下緣手繪波浪）→ 鼠尾草＋等高線（`.bg-sage.bg-contours`）→ 泥灰。照片區塊的上下緣一律接**手繪山稜線**（`.ridge`），不要用直線切。
- 常用比例：首頁評價與保障 7 : 5、活動細節 8 : 4、結帳 7 : 5、票種與選位 6 : 6、電子票券詳情 5 : 7。
- **微斜**只用在「貼上去的紙」：拍立得（±1.5° 以內）、索引卡（±1° 以內）、首頁倒數吊牌（−3°）。手機一律擺正；表單、按鈕、價格永遠不斜。

### 頁首與頁尾

- **頁首**：帆布白通欄、sticky、高 76px，底緣一條 10px 的手繪波浪（蓋在下一區上面）。左邊圓形營地徽章＋StageOne（Zilla Slab）＋城市現場（芫荽）；中間「首頁」「活動列表」前面各一個手繪小圖示，目前頁＝粗體＋文字下方一條橘色手繪劃線；右邊搜尋、登入／註冊（文字按鈕）、我要辦活動（小號橘色按鈕）。< 992px 收進 Collapse，展開後是一張帆布底＋縫線框的卡。
- **sticky 位移**：頁首 76＋波浪 10＋留白 22 ＝ `$sticky-top-offset` 108px（購票卡、篩選側欄、訂單明細、結帳步驟列都用這個）。
- **頁尾**：夜營綠底＋淡等高線，上緣是一排夜營綠的手繪山稜線（畫在頁尾上方 48px 的留白裡，所以頁尾前一個區塊和頁尾之間永遠有一段泥灰）。品牌＋一句話在左，3 欄連結在右（購票者、主辦方、服務）；欄標題用芫荽；最下面一條淡波浪線上是版權。

### 卡片

| 卡片 | 長相 | 用在 |
|---|---|---|
| 營地卡 `.camp-card` | 帆布、1.5px 樹皮框、圓角 14px，內縮一圈 2px 橄欖虛線（`.stitch`） | 一般內容卡、收納袋卡、主辦方卡 |
| 行李吊牌 `.tag-card` | 頂端鉚釘孔（`::before`），`.tag-card-head` 牛皮紙＋虛線分隔，`.tag-card-body` 帆布；`.tag-card-strip` 只留一條牛皮紙窄帶；`.tag-card-h` 橫式（孔在左）；`.has-rope` 掛麻繩 | 倒數、熱門活動、活動列表、購票卡、電子票券 |
| 拍立得 `.polaroid` | 帆布相框、上緣一片紙膠帶、照片 4:5，文字寫在照片下方的白邊上 | 首頁情境入口 |
| 索引卡 `.index-card` | 牛皮紙、上緣一條橘線＋一枚手繪圖釘 | 首頁評價 |
| 夾板 `.clipboard` | 帆布板＋頂端金屬夾 | 首頁入場保障、活動列表篩選、購票紀錄退票單 |
| 布標 `.cloth-label` | 卡片左上一片牛皮紙布標，標題寫在上面 | 結帳的收納袋卡 |

- 卡片之間只用**一種陰影**（`$shadow-paper`，紙張微微浮起），hover 時換成炭橘框＋同一種陰影；不放大、不位移、不浮現隱藏資訊。
- 吊牌孔的顏色要等於所在區塊的底色：在鼠尾草帶上的吊牌寫 `--hole-bg: #E1E4D3`（首頁 `.home-featured .featured-tag` 已設好）。
- **不要用半圓缺口與撕線點**（那是 02 沙龍的語言）；票券的「撕下來」感改用吊牌的虛線分隔與鉚釘孔。

### 標題層級

| 層級 | 字體 | 大小（桌機／手機） | 用法 |
|---|---|---|---|
| Display | 芫荽 Iansui 400 | 76／44px | 只有首頁 H1 |
| H1 | 芫荽 400 | 52／34px | 各頁頁首 |
| H2 | 芫荽 400 | 38／28px | 區塊標題 `.hand-title`：前面一個 32px 手繪圖示、文字下方一條 120px 橘色手繪劃線 |
| H3 | Noto Sans TC 700 | 20／18px | 卡片標題、價值主張標題 |
| 內文 | Noto Sans TC 400 | 16px、行高 1.85 | |
| 數字 | Zilla Slab 600／700 | 依位置 | 價格、日期、倒數、票號（`.num`、`.price`） |

芫荽只有 400 一個字重，**不要加粗**（`font-synthesis: none` 已關掉假粗體）。H3 以下回到 Noto Sans TC，避免整頁都是手寫字。

### 招牌元素

- **手繪圖示**：`<img class="hand-icon" src="images/hand-*.svg" alt="" width="32" height="32">`，大小用 `--hand-size` 或 width／height 控制；放進帆布圓裡用 `.hand-badge`（116px 圓、72px 圖示）。圖示一律是裝飾（`alt=""`），旁邊要有文字。
- **山稜線** `.ridge`：照片區塊底緣用 `.ridge.ridge-bottom`（泥灰山壓在照片上）、頂緣用 `.ridge.ridge-top`（照片的上緣變成一排山）。
- **波浪線**：頁首底緣、帆布色帶上下緣、卡片內的分隔（`.wave-rule`、`.wave-rule-faint`），是 240 × 10 的無縫圖塊用 `repeat-x` 平鋪，所以寬螢幕不會被拉平。
- **步道虛線** `.trail`：一條直向橘色虛線＋插在線上的牛皮紙日期旗 `.date-flag`；首頁價值主張是同一條步道的橫向版。
- **勾選圈** `.check-mark`：空心（未到）、`is-current`（目前，橘框）、`is-done`（橘底打勾）、`is-soldout`（虛線＋斜線）、`is-pending`。打包清單步驟、票種卡、背包清單都用它。
- **動態**：首頁倒數吊牌載入時以鉚釘孔為軸搖兩下就停（3 秒 × 2 次）；`.draw-check` 打勾筆畫跑一次；`prefers-reduced-motion: reduce` 時全部關閉。倒數數字不跑、不閃爍。

### 各頁構圖原則（接手的人照這個方向排）

| 頁面 | 構圖 |
|---|---|
| 首頁 | Hero 滿版照片、主標在左上（天空的位置）、倒數吊牌在右下斜掛 → 山稜線 → 步道指示牌搜尋列 → 價值主張橫向步道 → 帆布色帶拍立得 → 鼠尾草吊牌軌道 → 索引卡＋夾板 7 : 5 → 照片轉換帶（上緣山稜線） |
| 活動列表 | 頁首區（泥灰＋等高線）＋步道指示牌搜尋列；≥ 992px 左 8 欄**步道時間軸**（`.trail`＋每張橫式吊牌 `.tag-card.tag-card-h` 左側插一面日期旗，圖 5 : 文 7），右 4 欄**夾板篩選**（DOM 順序篩選在前，用 `order-lg-*` 放右邊；夾板一律完整展開，不在裡面捲動，視窗高到放得下整塊才 sticky）；< 992px 步道線移到左邊、日期旗改到卡片上方，「篩選與排序」Offcanvas 由下滑出 |
| 活動細節 | 8 : 4；左邊標題在主視覺上方、主視覺 16:9、活動介紹；右邊 sticky **吊牌購票卡**（牛皮紙段放倒數）。票種與選位放在鼠尾草＋等高線帶，6 : 6：左邊「裝備清單」票種卡（每張前面一個 `.check-mark`），右邊營位圖＋背包清單 `.pack-list`。場地 7 : 5（手繪場地地圖 SVG）、主辦方 5 : 7、FAQ 4 : 8 |
| 結帳 | 頂端 sticky **打包清單步驟列**（三個 `.check-mark` 串在橘色虛線上，終點是背包圖示）；7 : 5，左邊兩個收納袋卡（`.camp-card.stitch`＋`.cloth-label`），右邊 sticky 牛皮紙裝箱單（訂單明細，鉚釘孔＋麻繩）；`#result` 成功時是一張直式吊牌電子票券（最寬 380px），背包圖示換成 `hand-backpack-full.svg` |
| 註冊 | 一張攤開的**摺頁地圖**大卡（最寬 1040px、帆布、圓角 20px、中線摺痕）：左半表單、右半入場保障路線圖（3 支編號圖釘 `.route-pin`，≥ 992px 之間是 S 形虛線、手機是直線）；不放麵包屑，H1 在表單裡；狀態示意在大卡下方、寬度同左半 |
| 我的票券 | 牛皮紙資料夾**索引標籤** `.index-tabs` 當分頁＋帆布抽屜面板；每列一條麻繩，直式吊牌 `.ticket-tag` 用一小段繩子穿過鉚釘孔掛在繩上（≥ 1200 三張、768～1199 兩張、手機一張，手機只在列表頂端一條繩） |
| 電子票券詳情 | 一整塊**紙地圖面板**（帆布＋等高線、圓角 20px、四角圖釘）5 : 7；左邊 3 片索引標籤（Bootstrap pill）切換票券，吊牌電子票券被大夾子 `hand-clip.svg` 夾在地圖上，下面是牛皮紙「吊牌背面」票券資訊與操作；右邊大幅手繪路線圖＋日期時間地點＋怎麼去；入場須知（每項前一個手繪勾選框 `.check-box`）放在面板下段橫跨兩欄，992～1199px 排 2 欄、≥ 1200px 排 3 欄，左右兩欄高度接近 |
| 購票紀錄 | ≥ 1200px 約 8 : 4（退票單固定 24rem、≥ 1400px 25.5rem，訂單下拉的選項整串放得下）；左邊「旅程日誌」（`.trail`：起點腳印＋「共 6 筆訂單」→ 每筆訂單插一面下單日旗 `.trail-flag` → 跨年處「2025」里程牌 → 終點營火；訂單卡右側一段牛皮紙收據票根），右邊夾板退票單（視窗夠高才 sticky），狀態示意接在日誌下方 |
| 追蹤的主辦方 | ≥ 1200px 每列 3 張營地卡（4 個主辦方排成 3＋1，第 4 張靠左，像一格一格的營位）、768～1199px 每列 2 張、手機一張；≥ 768px 上緣正中一枚 72px 縫線圓形布章 `.org-badge`（字母章）一半壓出卡片上緣，手機改成 56px 布章與名稱橫排；下一場是一張橫式小吊牌（整張連到活動細節） |
| Guideline | 「營地手冊」：頁首區左邊 H1（山的手繪圖示）＋說明＋10 頁編號清單，右邊一張橫式吊牌寫手冊資訊（品牌、風格、頁數、技術、字體）；下面 3 : 9，左邊 sticky 目錄是一條直向步道（`.trail`，起點腳印、終點帳篷，每章一個路標點，Bootstrap ScrollSpy 標出目前章節），< 992px 改成頁首下方的章節膠囊橫向捲動列；右邊 9 章，章節之間用淡波浪線分開，小標前面一個手繪勾選方框。色票做成帶鉚釘孔的吊牌色卡（上段色塊＋Aa、下段名稱、hex、用途與對比度），Do／Don't 左邊實線卡、右邊虛線卡，招牌元素一章拆解行李吊牌的 6 個部位 |

## 檔案結構

```
05-camping-style/
├─ *.html                    ← 頁面，每頁完整包含頁首、頁尾與登入 Modal（10 頁全部完成：guideline、index、events、event、checkout、register、tickets、ticket、orders、follows）
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製（開頭註解寫了目前頁規則）
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的 8 個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 22 張暖色底片照片（AI 生成）、22 個手繪圖示 hand-*.svg、favicon.svg
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫＋票務語意＋手繪 SVG（等高線、波浪、山稜線、劃線）
│  ├─ _base.scss             ← 全站基礎：字級、數字、區塊節奏、按鈕、焦點、表單、減少動態
│  ├─ components/            ← 手繪元素、卡片、狀態、頁首、頁尾、搜尋列、活動卡、背包清單、篩選膠囊、票種卡、營位圖、購票卡、場地地圖、步驟列、裝箱單、電子票券、付款結果、索引標籤、票券吊牌
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾＋登入 Modal 是否與範本一致、目前頁是否正確
   └─ generate-images.mjs    ← 生圖腳本（所有圖片的 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾、登入 Modal 每頁一份**：要改時先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check`。每頁只有一處不同：頁首導覽的目前頁。首頁標 `首頁`（`class="nav-link active" aria-current="page"`）；活動列表標 `活動列表`（`active`＋`aria-current="page"`）；活動細節標 `活動列表` 但只加 `active`、不加 `aria-current`；其他 7 頁都不標。`check-layout.mjs` 會檢查這些規則（還沒建立的頁面會列為缺檔）。
- **新增頁面**：複製範本成新頁，改 `<title>`（「頁面名稱｜StageOne 城市現場」）、description（句末接「設計稿 05｜戶外露營音樂節。」）與目前頁標示，把內容寫在 `<main>` 的兩行註解之間。頁面樣式寫進 `scss/pages/` 裡已經準備好的 partial。
- **假資料直接寫在 HTML**：活動、票種、座位、訂單都寫死在頁面裡，和其他風格用同一組資料。
- **登入 Modal**：Email、密碼欄位沒有 `name`（設計稿不送出資料），每個欄位都有 `id`、`<label for>` 與 `autocomplete`。新頁面的表單照同樣的規則（密碼、Email、信用卡欄位不加 `name`）。
- **JS**：`js/main.js` 做 8 件事，選擇器都是 `data-*` 屬性，HTML 照下面的掛法就會動：

| # | 功能 | HTML 掛法 |
|---|---|---|
| 1 | 頁首搜尋列展開後自動聚焦 | `#siteSearch`（範本已有） |
| 2 | 活動列表「活動類型」篩選（必做） | 按鈕群組 `data-filter-group="#eventList"`，按鈕 `data-filter="音樂演出" aria-pressed="false"`（`all` 為全部）；卡片 `<li data-category="音樂演出">`；「共 N 場」`data-result-count`；已套用標籤容器 `data-applied`（產生 `.tag.applied-chip`）；清除 `data-filter-reset` |
| 3 | 其他篩選膠囊切換選中 | `<button data-toggle-pressed aria-pressed="false">` |
| 4 | 票種數量加減 | 外層 `data-order-max="4"`；票種卡 `<article class="ticket-type" data-ticket="預售全票" data-price="1500" data-stock="112">`，裡面 `.qty` 的 `<button data-qty-step="-1">`、`<output>`、`<button data-qty-step="1">`；選中時卡片加 `.is-selected`、卡片裡的 `.check-mark` 切換 `is-done`、`.ticket-type-picked` 顯示並更新 `[data-picked-count]`；背包清單 `data-selection-summary`＞`data-summary-lines`（列結構見 `components/_pack-list.scss` 開頭註解）、`data-summary-count`、`data-summary-subtotal`；底部固定列的張數 `data-bar-count` |
| 5 | 座位點選 | 座位圖 `data-seat-map`，座位 `<button class="seat" aria-pressed="false" aria-label="…">`；「已選座位」文字 `data-seat-output` |
| 6 | 追蹤切換 | `<button data-follow aria-pressed="false" data-follow-on="已追蹤" data-follow-off="加入追蹤"><i class="bi bi-heart"></i><span>加入追蹤</span></button>` |
| 7 | 首頁熱門列的左右箭頭 | `data-scroll-track="#featuredTrack" data-scroll-dir="-1／1"`；捲動距離＝卡寬＋24px（`.featured-track` 的 gap） |
| 8 | 我的票券的分頁 | 分頁容器 `data-filter-list="#ticketList"`，按鈕 `data-filter="upcoming" aria-pressed="true"`；票券卡 `<li data-status="upcoming">` |

  其他互動（選單、搜尋列、Modal、Offcanvas、Accordion、Tab）都靠 Bootstrap 的 `data-bs-*`。
- **換行與空白**：標題、活動名、區塊說明的詞組斷點用 `<wbr>` 標出，搭配 `.text-phrase`；「從零開始的攝影構圖｜」這種含全形分隔符號的片段用 `<span class="text-nowrap">` 包起來，避免「｜」被擠到下一行開頭。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、字體、間距、圓角、元件、票務語意、手繪 SVG）
3. `bootstrap/scss/bootstrap`：用上面的變數編譯出整套 Bootstrap
4. `bootstrap-icons`：圖示字型與 class（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字體、數字、區塊節奏、按鈕、焦點、表單
6. `components/*`：`_hand`（手繪元素）→ `_cards` → `_status` → `_header` → `_footer` → `_search-bar` → `_event-cards` → `_pack-list` → `_filter` → `_ticket-type` → `_seat-map` → `_buy-card` → `_venue-map` → `_pack-steps` → `_order-summary` → `_eticket` → `_result` → `_index-tabs` → `_ticket-tag`
7. `pages/*`：guideline、home、events、event、checkout、register、tickets、ticket、orders、follows

原則是**先用 Bootstrap 的變數與工具類別**，真的做不到才寫自訂 CSS，而且自訂 CSS 只引用變數，不寫死色碼。新增的共用元件寫成新的 `components/_*.scss`，在 `main.scss` 的 components 區加一行。

### 共用類別

| 類別 | 用途 | 位置 |
|---|---|---|
| `.section`、`.section-tight` | 區塊上下留白 64／120px、較緊的 48／64px | `_base.scss` |
| `.bg-canvas`、`.bg-sage`、`.bg-kraft` | 帆布、鼠尾草、牛皮紙底 | `_base.scss` |
| `.on-night` | 夜營綠區塊：帆布字、次要字淡帆布、焦點環換淺橘 | `_base.scss` |
| `.page-header`、`.page-lead`、`.eyebrow` | 內頁頁首區（泥灰＋等高線；麵包屑 → H1 → 說明）、頁首說明、小標 | `_base.scss` |
| `.text-phrase` | 只在空白與 `<wbr>` 處換行 | `_base.scss` |
| `.num`、`.slab`、`.price`（`-md`、`-lg`、`-xl`） | Zilla Slab 等寬數字；價格（粗、不換行；卡片 20、購票卡 30、應付總額 44px） | `_base.scss` |
| `.text-note`、`.text-ember`、`.text-olive` | 次要說明、炭橘字（橘色文字一律用它，野營橘當字對比不夠）、橄欖字 | `_base.scss` |
| `.btn-primary`、`.btn-secondary`、`.btn-outline-dark`、`.btn-outline-light`、`.btn-canvas`、`.btn-text`、`.btn-icon`、`.is-loading` | 按鈕：野營橘底深色字＋樹皮框＋下方 2px 實心影；橄欖底白字；帆布底樹皮框（hover 橘淡底）；夜營綠上用；照片上用的帆布實心；文字按鈕（44px 高）；44px 圓形圖示按鈕；付款中。停用＝牛皮紙底＋虛線框 | `_base.scss` |
| `.bleed-x` | 手機時橫向捲動列伸到螢幕邊緣 | `_base.scss` |
| `.hand-icon`、`.hand-badge` | 手繪圖示（`--hand-size`）、帆布圓＋縫線裡的 72px 圖示 | `components/_hand.scss` |
| `.section-heading`、`.section-heading-main`、`.hand-title`、`.hand-title-plain` | 區塊標題列（左標題＋說明、右連結或箭頭）；H2 前面手繪圖示、下方橘色手繪劃線；不要劃線的版本 | `components/_hand.scss` |
| `.hand-underline` | 任意文字下方的橘色手繪劃線 | `components/_hand.scss` |
| `.bg-contours`、`.bg-contours-light` | 等高線底紋（淺底用、深底用） | `components/_hand.scss` |
| `.wave-rule`、`.wave-rule-faint` | 手繪波浪分隔線（樹皮、淡石色） | `components/_hand.scss` |
| `.band-canvas` | 帆布色帶，上下緣手繪波浪 | `components/_hand.scss` |
| `.ridge`（`.ridge-bottom`、`.ridge-top`） | 照片區塊的手繪山稜線（底緣泥灰山、頂緣泥灰天空），`aria-hidden` | `components/_hand.scss` |
| `.trail` | 直向步道虛線（`--trail-x` 調位置；每一站是一般的 `<li>`，不另加 class）：活動列表時間軸、活動細節節目表、購票紀錄旅程日誌、Guideline 目錄 | `components/_hand.scss` |
| `.date-flag` | 插在步道上的牛皮紙燕尾日期旗（裝飾，`aria-hidden`，日期要另外寫在卡片裡） | `components/_hand.scss` |
| `.check-mark`（`.is-done`、`.is-current`、`.is-soldout`、`.is-pending`）、`.draw-check` | 手繪勾選圈 5 態、打勾動畫 | `components/_hand.scss` |
| `.trail-flag` | 插在步道上的旗竿＋日期旗（購票紀錄）：父層設 `--trail-x`、`--trail-pad`；≥ 768px 旗竿立在步道線上，手機旗子移到卡片上方；裝飾 `aria-hidden` | `components/_hand.scss` |
| `.check-box` | 手繪勾選方框（入場須知的清單符號，只是圖示不是 checkbox，`--check-size`） | `components/_hand.scss` |
| `.route-pin` | 路線圖上的編號圖釘（野營橘水滴＋帆布圓裡 Zilla Slab 數字；註冊頁入場保障，`aria-hidden`） | `components/_hand.scss` |
| `.stitch` | 內縮一圈 2px 橄欖虛線（縫線）；焦點時改畫焦點環 | `components/_cards.scss` |
| `.camp-card`、`.camp-card-link` | 營地卡、整張是連結的營地卡 | `components/_cards.scss` |
| `.tag-card`（`-head`、`-body`、`-strip`、`-h`、`.has-rope`） | 行李吊牌（`--hole-bg` 孔色＝區塊底色） | `components/_cards.scss` |
| `.paper-lift`、`.inset-photo` | 紙張浮起陰影、卡片內縮的照片（圓角 10px＋樹皮框） | `components/_cards.scss` |
| `.postmark`（`-month`、`-day`） | 牛皮紙圓形日期章 | `components/_cards.scss` |
| `.polaroid`、`.polaroid-caption` | 田野筆記拍立得（`--tilt` 在 ≥ 768px 生效） | `components/_cards.scss` |
| `.index-card`、`.clipboard`、`.cloth-label` | 索引卡（圖釘）、夾板（金屬夾）、布標 | `components/_cards.scss` |
| `.org-badge` | 縫線圓形布章（主辦方字母章，`--badge-size`、`--badge-font` 調大小；活動細節 96px、追蹤的主辦方 72／56px） | `components/_cards.scss`（原本在 `pages/_event.scss`，2026-11 移過來共用） |
| `.tag`（`-hot`、`-scarce`、`-free`、`-soldout`、`-success`、`-danger`、`-info`、`-warning`、`-muted`）、`.tag-list` | 狀態標籤：不規則手繪圓角小膠囊，一律圖示＋文字 | `components/_status.scss` |
| `.remaining`（`.is-scarce`、`.is-soldout`）、`.remaining-head` | 剩餘票數：文字＋Bootstrap `.progress`；即將完售換火光橘條、已售完換虛線牛皮紙軌道 | `components/_status.scss` |
| `.countdown`（`.is-warning`、`.is-expired`）、`.countdown-boxes`（`-label`、`-row`）、`.countdown-box` | 一行式倒數（牛皮紙；警示芥末黃；逾時虛線）、方格式倒數（首頁吊牌、購票卡）；`role="timer"` | `components/_status.scss` |
| `.alert-*` | 提示框：帆布底＋左側色條＋圖示 | `components/_status.scss` |
| `.demo-state`（`-tag`、`-title`、`-stage`） | 設計稿狀態示意：虛線框＋牛皮紙標籤（鉛筆圖示） | `components/_status.scss` |
| `.empty-state`、`.empty-state-icon`、`.empty-state-title` | 空狀態：手繪圓圈圖示 → 標題 → 說明 → 一個動作 | `components/_status.scss` |
| `.qr` | QR Code SVG：白底深色模組 | `components/_status.scss` |
| `.site-header`、`.site-brand`、`.site-nav`、`.site-icon-btn`、`.site-search`、`.login-modal` | 頁首、品牌、主導覽（`.nav-icon`＋`.nav-text`）、圓形圖示按鈕、展開搜尋列、登入 Modal | `components/_header.scss` |
| `.site-footer`、`.site-footer-title`、`.site-footer-links`、`.site-footer-copy` | 頁尾 | `components/_footer.scss` |
| `.trail-sign`（`-post`、`-fields`、`-keyword`、`-submit`） | 步道指示牌搜尋列（首頁、活動列表）：≥ 992px 一列 5 : 2 : 2 : 3；左邊牛皮紙路標只在 ≥ 1200px 出現 | `components/_search-bar.scss` |
| `.featured-tag`（`-media`、`-title`、`-meta`、`-foot`） | 首頁熱門的直式吊牌卡 | `components/_event-cards.scss` |
| `.event-tag`（`-media`、`-head`、`-title`、`-meta`、`-price`、`-intro`、`-types`、`-foot`） | 活動列表的橫式吊牌卡：≥ 768px 圖 5 : 文 7、鉚釘孔在左（接步道麻繩）；992～1199px 欄窄時改上下排；hover 換炭橘框＋紙張陰影 | `components/_event-cards.scss` |
| `.pack-list`（`-title`、`-items`、`-total`）、`.pack-row`、`.pack-row-empty` | 背包清單（已選票券）：手繪勾＋票種 × 張數＋金額 | `components/_pack-list.scss` |
| `.filter-group`（`-title`）、`.filter-chips`、`.filter-chip`（`-count`）、`.applied-chip` | 篩選膠囊：前面一個手繪小圈，選中（`aria-pressed`／`aria-expanded="true"`）＝野營橘底＋樹皮框＋打勾；已套用標籤 | `components/_filter.scss` |
| `.ticket-types`、`.ticket-type`（`.is-selected`、`.is-sold-out`、`.is-upcoming`；`-main`、`-name`、`-price`、`-note`、`-status`、`-control`、`-picked`）、`.qty`（`-btn`、`-value`） | 票種卡＝裝備清單一列（前面 `.check-mark`）；選中橘淡底、已售完牛皮紙＋虛線、尚未開賣虛線；數量加減器 44px | `components/_ticket-type.scss` |
| `.seat-map`（`-head`、`-title`、`-hint`、`-swipe`、`-scroll`、`-canvas`）、`.seat-stage`、`.seat-zone`、`.seat-row`（`-label`）、`.seat`（`.is-picked`、`.is-sold`、`.is-blocked`）、`.seat-legend`、`.seat-picked` | 營位圖：手繪舞台棚、座位 4 態（可選／已選＝野營橘＋勾／已售出＝牛皮紙＋✕／不可選＝虛線斜紋）、圖例；欄窄時橫向捲動 | `components/_seat-map.scss` |
| `.buy-tag`（`.is-compact`；`-label`、`-price`、`-actions`、`-includes`、`-assure`、`-message`）、`.info-card-title`、`.info-card-list` | 吊牌購票卡（牛皮紙段放倒數）、精簡版（狀態示意用）、快速資訊卡（手繪圖示＋波浪分隔） | `components/_buy-card.scss` |
| `.mobile-bar` | < 992px 底部固定列：帆布底、上緣反向手繪波浪；有它時 `body` 自動留出底部空間 | `components/_buy-card.scss` |
| `.venue-map-frame`、`.venue-map`、`.venue-map-route`、`.venue-map-legend`（`.venue-legend-route`、`-exit`、`-bus`） | 手繪場地地圖 16:10（內嵌 SVG，步行路線虛線慢慢流動，減少動態時停止）＋圖例 | `components/_venue-map.scss` |
| `.pack-steps-bar`（`.is-warning`、`.is-expired`）、`.pack-steps`、`.pack-step`（`.is-done`、`.is-current`；`-box`、`-mark`）、`.pack-steps-bag`（`-icon`） | 結帳步驟列＝打包清單：手繪方框串在火光橘虛線上，終點背包；警示整列芥末黃、逾時牛皮紙＋虛線＋✕；< 768px 只留目前步驟的文字 | `components/_pack-steps.scss` |
| `.packing-slip`（`-title`、`-event`、`-label`、`-rows`、`-total`、`-note`） | 訂單明細＝牛皮紙裝箱單（鉚釘孔＋麻繩），應付總額放在帆布虛線框 | `components/_order-summary.scss` |
| `.eticket`（`.is-used`、`.is-expired`、`.is-cancelled`；`-head`、`-brand`、`-title`、`-type`、`-seat`、`-date`、`-body`、`-qr`、`-note`、`-no`、`-stamp`） | 直式吊牌電子票券（最寬 380px）；窄於 272px 時票種與入場時間自動上下排（container query） | `components/_eticket.scss` |
| `.result-panel`（`.is-failed`）、`.result-icon`、`.result-title`、`.result-text`、`.result-timer`、`.result-actions`、`.eticket-carousel`、`.eticket-pager`、`.eticket-count` | 付款結果（成功／失敗）、多張票左右切換（Bootstrap Carousel） | `components/_result.scss` |
| `.demo-state-label` | 狀態示意裡每個小狀態的標題（前面一小段短線） | `components/_status.scss` |
| `.index-tabs`（`.index-tabs-line`）、`.index-tab`、`.index-tab-label`、`.index-tab-count`、`.index-tab-sub` | 牛皮紙資料夾索引標籤：選中（`aria-pressed="true"` 或 Bootstrap 的 `.active`）換帆布底、下框和下面的面板接成一片，尺寸不變；`.index-tabs-line` 自己畫底線、各片平分寬度（電子票券詳情） | `components/_index-tabs.scss` |
| `.ticket-tag`（`.is-used`、`.is-expired`、`.is-cancelled`；`-media`、`-state`、`-title`、`-meta`、`-foot`、`-order`、`-note`、`-btn`） | 我的票券的直式吊牌票券卡（搭配 `.tag-card.tag-card-strip.stitch`）：縮圖左上蓋郵戳日期、活動名 `.stretched-link`、「查看票券」疊在上面；已使用／已過期換牛皮紙底＋石色窄條＋照片去色，已取消改虛線框 | `components/_ticket-tag.scss` |
| `.gl-head`、`.gl-title`、`.gl-pages`、`.gl-meta`（`-title`）、`.gl-chips` | Guideline 頁首區：H1、10 頁編號清單（目前頁的編號換野營橘）、手冊資訊吊牌、< 992px 的章節膠囊列 | `pages/_guideline.scss` |
| `.gl-body`、`.gl-toc`（`-title`、`-end`、`-link`）、`.gl-section`（`-head`）、`.gl-lead`、`.gl-sub`、`.gl-note`、`.gl-rule` | Guideline 步道目錄（sticky 108px，`.active` 換野營橘點＋粗體）、章節、章節說明、小標（前面手繪勾選方框）、附註、規則提示框 | `pages/_guideline.scss` |
| `.gl-swatches`、`.gl-swatch`（`-chip`、`-name`、`-hex`、`-use`、`-ratio`）、`.gl-swatch-{色名}` | 吊牌色卡；色名 class 由 `$gl-swatches` map 產生（`--swatch` 底色、`--swatch-on` 上面的字色） | `pages/_guideline.scss` |
| `.gl-table`（`-wide`、`-rwd`、`-states`）、`.gl-demo-cell`、`.gl-type`、`.gl-fonts`、`.gl-spacers`、`.gl-grids`、`.gl-grid-demo`、`.gl-radius`、`.gl-lines`、`.gl-layers` | 規格表（手機時表格在卡片內橫向捲動）、字級、間距、格線比例、圓角、框線、分層示範 | `pages/_guideline.scss` |
| `.gl-states`、`.gl-state`、`.gl-state-title`、`.is-hover`、`.is-focus` | 元件狀態並排；`.is-hover`、`.is-focus` 只在 Guideline 的 `.gl-section` 裡生效，把 hover 與焦點畫成靜態 | `pages/_guideline.scss` |
| `.gl-validate`（`-screen`、`-title`、`-meta`）、`.gl-tickets`、`.gl-empty-grid`、`.gl-steps-card` | 驗票成功／失敗的手機示範畫面（圖示用 `currentColor`）、電子票券 4 態、空畫面示範、步驟列示範卡 | `pages/_guideline.scss` |
| `.gl-dos`、`.gl-do`、`.gl-dont`、`.gl-do-label`、`.gl-do-stage` | Do／Don't 對照（Do 帆布實線卡、Don't 透明虛線卡；Don't 的錯誤示範只畫形狀，不放真的低對比文字） | `pages/_guideline.scss` |
| `.gl-anatomy`（`-tag`、`-list`）、`.gl-callout`、`.gl-icons`、`.gl-ridge-demo`、`.gl-band-demo`、`.gl-motion` | 招牌元素：吊牌構造圖（編號 1～6）、22 個手繪圖示、山稜線與波浪示範、動態清單 | `pages/_guideline.scss` |

活動列表、活動細節、結帳三頁和規格不同的地方：

- 活動細節的場地地圖下方多一列圖例（路線、捷運出口、公車站、場地），手繪符號不靠圖例看不懂。
- 活動細節 ≥ 992px 時，票種清單與場地地圖這兩欄也 sticky（`$sticky-top-offset`＋16px），旁邊那欄比較長時不會留下一大片空白。
- 結帳的「其他付款方式」用 radio＋CSS `:has()` 展開面板，不用 JS；快速支付按鈕 hover 只換框色、底色與 .5px 外框。
- 結帳步驟列 sticky 在頁首本體正下方（`top: 76px`，上內距多留 10px 讓頁首波浪蓋住），不用 `$sticky-top-offset`，否則一載入就會和頁首之間空出一段；訂單明細改黏在步驟列下方（`$sticky-top-offset`＋104px）。
- 付款成功的背包換圖靠 `:root:has(#result:target)`：連到 `checkout.html#result` 時步驟列終點自動換成 `hand-backpack-full.svg`。

會員中心 5 頁（2026-11 補）和規格不同、或要注意的地方：

- 空狀態一律在第一個逗號拆成標題＋說明（同活動列表「篩選無結果」），標題不留逗號。
- 我的票券的分頁用 `js/main.js` 第 8 項（`data-filter-list`），HTML 先把 4 張票都顯示出來，沒有 JS 也看得到；電子票券詳情的 3 張票改用 Bootstrap 的 pill（`data-bs-toggle="pill"`，方向鍵可切換），不另寫 JS。
- sticky 只在整塊放得下時開啟（實測高度寫在 scss 註解裡）：活動列表的夾板篩選 992～1199px 寬且視窗 ≥ 1760px 高、≥ 1200px 寬且視窗 ≥ 1560px 高（含「自訂日期區間」展開後的高度）；購票紀錄的退票單 ≥ 1200px 寬且視窗 ≥ 1400px 高。其他情況照一般捲動，不在夾板裡捲動，膠囊與操作按鈕不會被截掉或卡住。
- 電子票券詳情的入場須知原本接在右欄最後，右欄比左欄長約 370px，一般桌機高度下左欄下方空一大塊；改放在紙地圖面板下段橫跨兩欄後，兩欄高度接近，左欄也不再需要 sticky。
- 追蹤的主辦方置中的簡介用 `text-wrap: balance`，詞組（「大型音樂祭」「七十分鐘的獨舞作品」「六十個手作攤位」等）用 `.text-nowrap` 包住，不會斷在詞中間、最後一行不會只剩兩個字。
- 購票紀錄的日期旗是下單日（裝飾，`aria-hidden`），年份另外寫在卡片的下單時間；收據票根在牛皮紙上，字只用樹皮與次要字，「下載」hover 只換底線顏色。
- 註冊頁的「服務條款」「隱私權政策」還沒有頁面，用不帶 `href` 的 `<a>`；「登入」打開全站共用的登入 Modal。

Guideline 和規格不同、或要注意的地方：

- 規格要求的 8 章之後多一章「09 招牌元素」（吊牌構造、22 個手繪圖示、手繪場地地圖、山稜線與波浪、動態），目錄與 ScrollSpy 一起涵蓋。
- ScrollSpy 設定在 `<body>`：`data-bs-threshold="0,1"`（元件狀態一章很長，預設門檻 0.1 永遠達不到，目錄會沒有標示）、`data-bs-root-margin="-110px 0px -55%"`（扣掉 sticky 頁首，點目錄跳過去時不會標成上一章）。
- 元件狀態用 `.is-hover`、`.is-focus` 把 hover 與焦點畫成靜態，這兩個 class 只在 Guideline 的 `.gl-section` 裡生效。
- 「有劃位」示範的營位圖掛了 `data-seat-map`（`js/main.js` 第 5 項），可以實際點選；其他示範不掛 `data-*`，點了不會改變狀態。
- 頁面清單照實際做出來的版型寫：活動列表是 8 : 4（時間軸在左、篩選在右），追蹤的主辦方 ≥ 1200px 每列 3 張。2026-11 補頁的新元件（索引標籤、票券吊牌、布章、路線圖釘、日期旗）不放進 Guideline；小標前面的手繪勾選方框 `.check-box` 只當裝飾。
- 頁面沒有用到 `.btn-outline-light` 與可點的 `.btn-secondary`，所以不示範（`.btn-secondary` 只出現在停用的「已售完」）。

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 底色 | 泥灰 `$mud #ECE9E2`（頁面）、帆布白 `$canvas #FAF8F3`（卡片、頁首、輸入框）、鼠尾草 `$sage #E1E4D3`（交替區塊）、牛皮紙 `$kraft #E3CFA6`（吊牌、索引卡、日期章）、橘淡底 `$orange-soft #F8E4D5`（選中、稀缺淡底） |
| 文字與線 | 樹皮 `$bark #2B2A24`（內文、框線、手繪線）、次要 `$bark-muted #55544A`、placeholder `$bark-faint #66645A`、裝飾線 `$stone #C9C3B4`、表單框 `$control #7A7564`、深色字 `$ink-dark #1E1C17`（橘色與芥末黃上的字、照片遮罩） |
| 品牌色 | 野營橘 `$campfire #EE6A1F`（主要按鈕底，**上面只放深色字**，5.44:1）、炭橘 `$ember #A3420A`（橘色文字、連結、焦點環）、火光橘 `$flare #D45A12`（手繪圖示的橘色筆觸、稀缺進度條，不當文字）、橄欖 `$olive #5C6B2A`（次要按鈕、熱賣中、進度條）、深橄欖 `$olive-deep #4A5720`、夜營綠 `$olive-night #3D4719`（頁尾） |
| 狀態 | 成功 `$olive-deep`、錯誤 磚紅 `$brick #B3261E`、警示 芥末黃 `$mustard #F2C14E`（字 `$mustard-text #8A5A00`）、資訊與尚未開賣 湖水藍 `$lake #2F6274`；售罄 牛皮紙＋虛線 |
| Bootstrap 主題色 | `$primary` 野營橘、`$secondary` 橄欖、`$success` 深橄欖、`$info` 湖水藍、`$warning` 芥末黃、`$danger` 磚紅、`$light` 帆布、`$dark` 樹皮 |
| 字體 | 芫荽 Iansui（Display、H1、H2，只有 400）、Noto Sans TC（H3 700、內文 400）、Zilla Slab（數字、價格、票號，等寬數字） |
| 字級 | Display 44→76px、H1 34→52px、H2 28→38px、H3 18→20px、Lead 17→19px、Body 16px（行高 1.85）、Caption 13px |
| 間距 | 16px 基準，擴充到 spacer 8（120px）；區塊留白手機 64、桌機 120px |
| 版心 | 1140（≥ 1200）／1240（≥ 1400）；左右 24px（≥ 992 為 32px）；欄距 32px |
| 圓角 | 卡片 14px、按鈕與輸入框 12px、照片 10px、大面板 20px、小標籤 8px；不規則手繪圓角 `$radius-hand` 只給小膠囊（狀態標籤、城市膠囊） |
| 框線 | 卡片 1.5px 樹皮實線；縫線 2px 橄欖虛線內縮 8px（`$stitch-color`）；按鈕 2px |
| 陰影 | 只有一種「紙張浮起」`$shadow-paper`（大一號 `$shadow-paper-lg` 給浮層） |
| 按鈕 | 高 48px（小 44、大 56）；主要＝野營橘底＋深色字＋樹皮框＋下方 2px 實心影；停用＝牛皮紙底＋虛線框＋次要字 |
| 焦點 | 3px 炭橘實線、外推 3px；夜營綠與照片上換淺橘 `$ember-light #F3A266`（`--focus-color`） |
| 頁首 | 76px＋10px 波浪，sticky；sticky 位移 108px |
| 動態 | 倒數吊牌搖兩下、打勾筆畫、hover 只換框色與陰影；`prefers-reduced-motion` 時全部關閉 |

### 換色時同步檢查

色票的唯一來源是 `scss/_variables.scss`，但下面幾處把數值寫成文字或寫死，改色（或改頁首高度）時要一起檢查，改完 `npm run css`：

- [ ] `scss/_variables.scss`：色票、`$theme-colors`、語意變數（`$body-*`、`$input-*`、`$focus-ring-color`…）與票務語意色（`$scarce-*`、`$soldout-bg`、`$selected-*`、`$valid-bg`、`$invalid-bg`）；註解裡的對比度。手繪 SVG 是 data URI，顏色在編譯時寫死：波浪、山稜線、手繪劃線、手繪圓圈多數用變數組字串，`$contour-stroke` 與 `$contours-light`（直接寫了 `#FAF8F3`）要手改。
- [ ] `guideline.html`：色卡的 hex、對比度與用途文字，「票務專用語意」表，Bootstrap 主題色與語意變數的對應表；`scss/pages/_guideline.scss` 的 `$gl-swatches` map（色卡底色與字色）。
- [ ] 風格自己的 `README.md`：Design token 摘要。
- [ ] 改了頁首高度（76px＋10px 波浪）時：`$sticky-top-offset`（108px）與各處 sticky 位移：活動列表夾板篩選、活動細節吊牌購票卡與票種清單、場地地圖、FAQ 標題、結帳步驟列（`top: 76px`）與裝箱單、購票紀錄的退票單與 `#refund` 錨點位移、Guideline 目錄；以及 Guideline「間距與格線」的 sticky 表。
- [ ] SVG 裡寫死的色碼：
  - `images/hand-*.svg`：線 `#2B2A24`（樹皮）、橘色筆觸 `#D45A12`（火光橘）、填色 `#FAF8F3`、`#E3CFA6`。
  - QR Code：內嵌 SVG 用 `fill="currentColor"`，顏色來自 `.qr` 的 `$bark`＋`$white`，改 token 會跟著變，只要確認對比仍夠掃描（目前 14.39）。
  - 活動細節的手繪場地地圖、電子票券詳情的路線圖、Guideline 招牌元素裡的地圖（從活動細節複製）：`#D8D2C2`、`#F0EBDF`、`#FAF8F3`、`#2B2A24`、`#1E1C17`、`#EE6A1F`、`#D45A12`、`#5C6B2A`、`#E1E4D3`、`#E3CFA6`、`#55544A`、`#C9C3B4`。
  - `templates/page.html` 裡內嵌的營地徽章 Logo（頁首、頁尾各一份，改了要同步到每一頁）與 `images/favicon.svg`。
  - 結帳步驟列、付款結果裡的內嵌圖示：`#EE6A1F`、`#2B2A24`、`#1E1C17`、`#55544A`、`#FAF8F3`、`#5C6B2A`、`#B3261E`、`#FFFFFF`（Guideline 驗票畫面的圖示用 `currentColor`，不用改）。
  - 麻繩的深色紋路 `#8E7650`（`components/_cards.scss`、`pages/_home.scss`、`pages/_events.scss`、`pages/_tickets.scss`）、`pages/_tickets.scss` 麻繩亮面 `#CDB487`、`components/_cards.scss` 夾板金屬夾漸層 `#E4E0D6`／`#A9A291`、`pages/_home.scss` Hero 文字後方的暗色漸層 `#1E1C17`。
- [ ] `.tag-card` 的孔色：放在非泥灰區塊上的吊牌，HTML 或頁面樣式裡寫了 `--hole-bg`。
- [ ] `scripts/generate-images.mjs` 的 `STYLE`：換色後重新生圖。
- [ ] `templates/page.html` 與每一頁的 `<meta name="theme-color" content="#FAF8F3">`。

## 圖片

`images/` 的 22 張照片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名與其他風格相同（清單見主題層的 `IMAGES.md`）。調性是**黃昏的暖金色 35mm 底片**：低角度暖光、輕微顆粒、柔和光暈，場景帶一點戶外與野營感（樹、草地、帳篷、燈串），人物不露清楚的臉、畫面裡沒有文字。寬幅照片最長邊 1600px，情境卡、主辦方過往活動與評價頭像最長邊 1024px。

- Hero 照片是黃昏的戶外舞台（不是 Live House），所以 `alt` 改寫成「戶外舞台前，觀眾在逆光中舉起雙手」；其他照片的內容和 `IMAGES.md` 一致，`alt` 照抄。
- Hero 的左上方刻意留暗、留單純（壓主標），倒數吊牌壓在右下。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`（一次最多生 5 張比較穩）：

```bash
npm run images                                                       # 產生缺少的圖片
CONC=1 node scripts/generate-images.mjs --only hero-live-crowd,scene-music  # 只重做指定的圖
node scripts/generate-images.mjs --force                              # 全部重做
```

**手繪圖示**（`images/hand-*.svg`，viewBox 48、線寬 2.25、樹皮線＋火光橘點綴，一律 `<img alt="">` 引用）：

| 檔案 | 畫的是 | 目前用在 |
|---|---|---|
| `hand-tent.svg` | 帳篷 | 導覽「首頁」、登入 Modal 標題、首頁評價區標題、註冊 H1、追蹤的主辦方「即將舉辦 1 場活動」 |
| `hand-map-fold.svg` | 摺頁地圖 | 導覽「活動列表」 |
| `hand-trail-flags.svg` | 三面小旗串在步道上 | 價值主張「三步完成結帳」 |
| `hand-phone-pocket.svg` | 口袋裡的手機 | 價值主張「票券長在手機裡」 |
| `hand-lantern-shield.svg` | 營燈盾牌 | 價值主張「動態防偽驗票」 |
| `hand-map-pin.svg` | 地圖圖釘 | 價值主張「進場前都幫你想好」、城市膠囊、票券卡的地點、電子票券詳情「入場資訊」 |
| `hand-compass.svg` | 指南針 | 首頁價值主張標題、註冊頁入場保障（右上角）、電子票券詳情「怎麼去？」 |
| `hand-signpost.svg` | 路標 | 首頁情境入口標題、搜尋列的路標 |
| `hand-campfire.svg` | 營火 | 首頁熱門標題、購票紀錄步道終點 |
| `hand-check.svg` | 手繪勾 | 首頁入場保障 |
| `hand-pushpin.svg` | 圖釘 | 索引卡、電子票券詳情紙地圖面板的四角（CSS 引用） |
| `hand-backpack.svg`、`hand-backpack-full.svg` | 空背包、裝滿的背包 | 背包清單標題、結帳步驟終點、付款成功、電子票券詳情「入場須知」 |
| `hand-mountains.svg` | 山 | Guideline H1 |
| `hand-footprints.svg` | 腳印 | 活動列表步道起點、購票紀錄步道起點（CSS 引用） |
| `hand-calendar.svg`、`hand-clock.svg` | 日曆、時鐘 | 活動列表、活動細節、我的票券的日期、電子票券詳情的日期與時間 |
| `hand-id-card.svg` | 證件 | 活動細節、結帳 |
| `hand-tag.svg` | 行李吊牌（帶繩） | 我的票券 H1、票券卡的票種 |
| `hand-logbook.svg` | 旅程日誌本（虛線路線＋書籤） | 購票紀錄 H1 |
| `hand-binoculars.svg` | 望遠鏡 | 追蹤的主辦方 H1 |
| `hand-clip.svg` | 大夾子（viewBox 96 × 64，深色本體） | 電子票券詳情夾住票券的夾子（CSS 引用） |

Guideline 的「招牌元素」列出全部 22 個；目錄標題用摺頁地圖、步道起點腳印、終點帳篷；9 章的標題依序是營火（色彩）、旅程日誌（字級）、指南針（間距）、行李吊牌（圓角）、空背包（元件狀態）、望遠鏡（空畫面）、口袋手機（RWD）、手繪勾（Do／Don't）、步道小旗（招牌元素）。

QR Code、條碼、座位圖、場地地圖、Logo、favicon 都用 SVG／CSS 畫，不是圖片。
