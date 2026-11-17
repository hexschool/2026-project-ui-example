# 05｜瑞士國際排版：Craftory 手感工藝線上學院

> 黑白色系＋亮紅點綴（純白底、深黑文字、瑞士紅）。嚴格的網格對齊，播放清單去除多餘裝飾，以純粹的排版字級架構層級。

概念是「課表即海報」：把 Craftory 當成一張 1960 年代蘇黎世的課程海報來排。白紙、黑字、一點紅；版面全部由 12 欄網格決定，資訊的層級只靠字級、字重、對齊與留白，不靠卡片、陰影、圓角或色塊。照片一律是明亮、方正的黑白「客觀攝影」，讓瑞士紅成為畫面上唯一的顏色，而且只回答兩件事：**你現在在哪裡**（播放中的單元、學習進度、播放進度）、**下一步按哪裡**（每個區塊唯一的主要按鈕）。

大膽只花在兩個地方：**無裝飾的播放清單**（章節與單元只用線、字級與欄位對齊分層）與**看得見的網格**（標題區與頁尾背景畫出 12 條欄線）。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（與 `01-電商主題` 各風格相同架構）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。這是**單一淺色主題**，不使用 `data-bs-theme`，作業系統切到深色模式也不會變色。
- **JS**：互動都交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的六個小功能。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西。

**要修改樣式**：

```bash
npm install        # 安裝 bootstrap、bootstrap-icons、sass，並把 Bootstrap JS 與圖示字型複製進專案
npm run watch      # 開發時：監看 scss/，存檔就重新編譯 css/style.css
npm run css        # 編譯一次
npm run build      # 交付前：重新複製 vendor 檔案＋編譯一次 CSS
npm run check      # 檢查 10 個頁面的 head、頁首、頁尾與登入對話框是否與範本一致
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
| 註冊 | `register.html` | `scss/pages/_flow.scss` |
| 購買課程 | `checkout.html` | `scss/pages/_flow.scss` |
| 付款結果（付款成功） | `order-result.html` | `scss/pages/_flow.scss` |
| 我的課程 | `my-courses.html` | `scss/pages/_member.scss` |
| 購買紀錄 | `orders.html` | `scss/pages/_member.scss` |

後 5 頁的樣式分成兩個 partial：流程頁（註冊、購買課程、付款結果）在 `_flow.scss`，會員頁（我的課程、購買紀錄）與 5 頁共用的海報式頁首 `.member-head` 在 `_member.scss`。

頁面上沒有列出所有頁面的導覽：依學生流程點進各頁即可，Guideline 直接開 `guideline.html`。

- 購買：首頁 →「探索全部課程」→ 課程列表 → 課程卡 → 課程詳情 →「立即購買，開始上課」→ 登入對話框（未登入提示）→「登入並開始上課」→ 購買課程 →「確認付款」→ 付款結果 →「前往我的課程」或「開始上課」（學習頁）。
- 註冊：登入對話框的「立即註冊」→ 註冊 →「完成註冊」→ 購買課程；註冊頁的「登入」再開回登入對話框（購買情境）。
- 回來上課：頁首「我的課程」→ 我的課程 →「繼續上課」（學習頁）；我的課程的「購買紀錄」→ 購買紀錄。

課程詳情只做一頁靜態示範（手捏陶），所有課程卡都連到 `course.html`，「▶ 免費試看」連到 `course.html#trial`。看不到的狀態放在各頁底部的「設計稿狀態示意」：

| 頁面 | 狀態示意 |
|---|---|
| `courses.html` | 篩選沒有結果時 |
| `course.html` | 點了鎖定單元時、已購買時、未登入點擊購買時 |
| `learn.html` | 完成一章時、全課完成時、影片載入失敗時、還沒有任何課程時 |
| `register.html` | 欄位有錯誤時 |
| `checkout.html` | 付款處理中、付款失敗 |
| `order-result.html` | 付款沒有完成時 |
| `my-courses.html` | 還沒有任何課程時 |
| `orders.html` | 退費處理中、沒有購買紀錄時 |

可以實際操作的互動：頁首選單與登入對話框、課程列表的篩選（992px 以下是抽屜）與排序、課程詳情的章節與 FAQ 收合、鎖定單元提示、願望清單切換、評價排序切換、學習頁的分頁、播放速度與字幕選單、續看提示關閉、章節側欄收合（992px 以下是底部抽屜）、購買課程的付款方式切換（選 LINE Pay 或 Apple Pay 時收起信用卡欄位，純 CSS）、我的課程的學習狀態分頁籤（真的會篩選）。

## 檔案結構

```
05-swiss-style/
├─ *.html                    ← 10 個頁面，每頁完整包含頁首、頁尾與登入對話框
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的六個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 課程照片（AI 生成，黑白客觀攝影）、favicon
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫
│  ├─ _base.scss             ← 全站基礎與共用類別（含可見網格 .grid-guides）
│  ├─ components/            ← 頁首、頁尾、課程卡、播放器、章節清單（招牌）、購買卡
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾、登入對話框是否與範本一致
   └─ generate-images.mjs    ← 生圖腳本（所有圖片的 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾、登入對話框每頁一份**：沒有元件系統，所以 10 個頁面各自完整寫一份。要改的時候先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check` 確認全部一致。每頁只有一處不同：頁首導覽的目前頁（`active` 與 `aria-current="page"`）：首頁 → 首頁、課程列表 → 探索課程、我的課程 → 我的課程；課程詳情標「探索課程」、學習頁與購買紀錄標「我的課程」，這三頁只加 `active` 不加 `aria-current`；Guideline、註冊、購買課程、付款結果不標示。`check-layout.mjs` 也會檢查這一點。
- **新增頁面**：複製範本成新頁，改 `<title>`、description 與頁首的目前頁標示，並在要連進來的地方補上連結。最後在 `scss/pages/` 新增 partial、在 `scss/main.scss` 加一行 `@import`，並把頁面加進 `scripts/check-layout.mjs` 的 `expectedNav`，執行 `npm run check`。
- **假資料直接寫在 HTML**：8 門課的名稱、講師、價格、星等與學習人數（主題層 `CONTENT.md` §4、§9.1），手捏陶的 28 個單元與片長（§9.3），學習頁的進度 14／28（§9.5），以及後 5 頁的訂單、學習進度與表單文案（§9.9～§9.14）都寫死在頁面裡。同一門課會出現在首頁、課程列表與 Guideline，手捏陶的進度在學習頁與我的課程，訂單 CR-20261116-027 在付款結果與購買紀錄，改動時要多頁同步。
- **JS**：`js/main.js` 只做六件事：
  1. 登入對話框從「立即購買，開始上課」或註冊頁的「登入」開啟時（按鈕有 `data-auth-intent="purchase"`），顯示未登入提示、把按鈕改成「登入並開始上課」，並把送出目的地換成 `checkout.html`。
  2. 關閉對話框後捲到指定位置（鎖定提示的「看看課程包含什麼」→ 購買卡，`data-scroll-to="#purchase"`）。
  3. 「全部收合」：把學習頁側欄展開中的章節都收起來（`data-collapse-all`）。
  4. 首頁工藝情境卡連到 `courses.html?craft=pottery` 時，預先選中該分類（課程卡不會變）。
  5. Guideline 的「顯示網格」：在 `<html>` 切換 `.show-grid`，把 12 欄覆蓋在整頁上。
  6. 我的課程的分頁籤：依學習狀態篩選（`data-filter-list` 指向清單、按鈕的 `data-filter` 對照項目的 `data-status`），切換 `.active` 與 `aria-pressed`，不符合的項目加 `hidden`。
- **播放器**：沒有真的影片。`<img>` 當畫面，播放鈕、控制列、進度條都是 HTML／CSS；播放速度、字幕是 Bootstrap Dropdown，點了不會改變畫面。進度條用 CSS 變數 `--played`、`--buffered`、`--mark` 設定位置。
- **換行與空白**：課程名稱、標題用 `.text-phrase`＋`<wbr>` 標出詞組斷點（課程名稱在「｜」之後），中文詞不會被拆開；數字與單位之間用 `&nbsp;`（「4&nbsp;小時 20&nbsp;分」）。
- **表單**：設計稿沒有後端，表單用 GET 送到下一頁。登入對話框用 `<form action="learn.html">` 直接前往學習頁，從購買情境開啟時改送到 `checkout.html`；註冊送到購買課程、購買課程送到付款結果；課程問答送出後回到本頁；篩選只改變選中狀態。新頁的密碼、Email、卡號欄位不加 `name`（避免出現在網址），只有付款方式的 radio 有 `name="payment"`。登入對話框的電子郵件、密碼欄位原本帶 `name="email"`、`name="password"`，補頁時列為已知例外；2026-11-17 已拿掉（使用者同意，規格 §2.4），改在 `templates/page.html` 再同步到 10 頁，送出後網址不會帶上帳號密碼。串接後端時改用 `method="post"` 並補上 `name`。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、字體、間距、圓角、元件）
3. `bootstrap/scss/bootstrap`：用上面的變數編譯出整套 Bootstrap
4. `bootstrap-icons`：圖示字型與 class（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字體與數字、結構線、區塊節奏、焦點、按鈕、標籤，以及下表的共用類別
6. `components/*`：頁首、頁尾、課程卡、播放器、章節清單、購買卡
7. `pages/*`：各頁專屬樣式，class 一律加頁面前綴；Guideline 會借用各頁的 class 做示範，所以最後載入

原則是**先用 Bootstrap 的變數與工具類別**，真的做不到才寫自訂 CSS，而且自訂 CSS 也只引用變數，不寫死色碼。想換風格，主要改 `_variables.scss`。例外是註冊（`.register-layout`）、購買課程（`.checkout-layout`）、我的課程的課程列（`.mycourse`）與 768～1199px 的訂單列：用 CSS Grid 的 12 欄（欄寬與 `.col-lg-*` 相同），才能讓同一份 HTML 依寬度換位置，例如購買課程的課程摘要在手機排在最上面、桌機跨到右欄。

### 共用類別

下面這些類別跨頁共用，新頁面直接套用，不要在 `pages/*` 另寫一份。用法與示範都在 `guideline.html`。

| 類別 | 用途 | 位置 |
|---|---|---|
| `.grid-guides`、`.grid-guides-dark` | **可見的網格**：加在 `.container` 上，背景畫出 12 條欄線（768px 以上）；用在各頁的頁首（課程列表、註冊、購買課程、付款結果、我的課程、購買紀錄）、首頁學得完的理由、Guideline、頁尾 | `_base.scss` |
| `.section`、`.section-head`（`-lead`、`-aside`） | 區塊上下留白 64／96px；區塊標題列（上緣 2px 墨黑線，左標題、右說明或連結） | `_base.scss` |
| `.page-header`、`.page-lead` | 內頁頁首：麵包屑 →（標題）→ 一句說明 | `_base.scss` |
| `.rule-heavy`、`.rule-thin` | 2px 墨黑結構線、1px 細線 | `_base.scss` |
| `.text-phrase` | 課程名稱與短標題只在空白、標點與 `<wbr>` 處換行；不要用在長段落 | `_base.scss` |
| `.num`、`.price`、`.numeral` | 等寬數字；價格；大數字（評價 4.9、進度 50%、售價） | `_base.scss` |
| `.btn-text`、`.btn-paper` | 文字連結型按鈕（內建 44px 觸控高度）；紅色色帶上的白底按鈕 | `_base.scss` |
| `.tag`（`.is-plain`、`.is-solid`、`.is-red`、`.is-dashed`、`.is-muted`） | 方框小標籤：難度、分類、時長、已完課、學習進度、試看、正在播放、講師課程狀態 | `_base.scss` |
| `.avatar-text` | 圓形文字頭像（講師的姓） | `_base.scss` |
| `.stars`、`.bar`、`.icon-list` | 星等；評價分佈長條；圖示清單（購買包含） | `_base.scss` |
| `.demo-state`（`-tag`、`-item`、`-title`、`-stage`）、`.demo-modal` | 頁面底部的「設計稿狀態示意」，以虛線和正式內容分開；示意用的靜態對話框 | `_base.scss`、`pages/_course.scss` |
| `.empty-state` | 空狀態：圖示 → 一句說明 → 一個動作，靠左、不加框 | `_base.scss` |
| `.bleed-x` | 576px 以下讓橫向捲動列貼齊螢幕兩側 | `_base.scss` |
| `.course-card`、`.course-scroller` | 課程卡（沒有框與陰影，價格列貼齊底部）；992px 以下的橫向捲動列 | `components/_course-card.scss` |
| `.player`（`.is-paused`、`.is-playing`、`.is-loading`、`.is-error`）、`.player-toast` | 播放器與四種狀態；續看提示 | `components/_player.scss` |
| `.curriculum`（`.is-compact`） | **無裝飾播放清單**：課程詳情的章節 Accordion 與學習頁側欄；單元列 `.is-trial`、`.is-current`、`.is-locked`、`.is-done`、`.is-todo` | `components/_curriculum.scss` |
| `.purchase`、`.btn-wishlist` | 購買卡（6px 上緣的方形模組）；願望清單切換 | `components/_purchase-card.scss` |

後 5 頁（註冊、購買課程、付款結果、我的課程、購買紀錄）另外用到下面這些類別。Guideline 沒有示範，用法寫在各 partial 開頭與頁面開頭的註解：

| 類別 | 用途 | 位置 |
|---|---|---|
| `.member-head`、`.member-title`（`.is-sentence`）、`.member-head-link` | 5 頁共用的海報式頁首：超大標題壓在 12 條欄線上、2px 墨黑線收尾。`.member-head`、`.member-title` 用 `@extend` 沿用課程列表的 `.courses-header`、`.courses-title`，改課程列表的大標題時會一起變；`.is-sentence` 是一整句的標題（付款結果）；頁首右側的文字連結 | `pages/_member.scss` |
| `.member-stats` | 我的課程的統計：大數字＋單位，上緣 1px 墨黑線 | `pages/_member.scss` |
| `.member-tabs`、`.member-count`、`.member-demo-head`、`.member-demo-title` | 學習狀態分頁籤（搭配 `.nav-underline`）；「共 5 筆訂單」；空狀態示意裡的縮小版頁首 | `pages/_member.scss` |
| `.mycourse-list`、`.mycourse`（`.is-done`）與 `-img`、`-main`、`-title`、`-progress`、`-figure`、`-resume`、`-unit`、`-time`、`-done` | 我的課程「一列一門」：992px 以上封面｜課名｜進度｜上次看到四段各 3 欄；已完課降一階（封面淡一點、進度條墨黑） | `pages/_member.scss` |
| `.orders-table`、`.orders-course`、`.orders-thumb`、`.orders-amount`、`.orders-actions`（`.is-empty`） | 購買紀錄：1200px 以上是表格；768～1199px 封面在左 4 欄、「欄名｜值」在右 8 欄；768px 以下直排。欄名寫在 td 的 `data-label` | `pages/_member.scss` |
| `.order-status`（`.is-failed`）、`.order-note`、`.orders-status-wide` | 訂單狀態標籤（搭配 `.tag`；付款失敗是瑞士紅框）；狀態下方的小字說明（1200px 以上最寬 16em）；`.orders-status-wide` 加在狀態欄的 td 上，備註比較長、右邊沒有按鈕時把說明放寬到 20em（狀態示意「退費處理中」） | `pages/_member.scss` |
| `.orders-refund`（`-title`、`-rule`、`-more`） | 退費說明：區塊標題列的寫法，規則用大字 | `pages/_member.scss` |
| `.register-layout`、`.register-head`、`.register-form`、`.register-terms`、`.register-next`（`-title`、`-course`、`-img`、`-name`、`-price`） | 註冊：左標題、右表單（2px 墨黑線開頭）、左下接續購買提示；`.register-terms` 是同意條款那一列，加在 `.form-check` 上，整列 44px 高都能點 | `pages/_flow.scss` |
| `.checkout-layout`、`.checkout-step`（`-head`、`-no`、`-title`、`-body`）、`.checkout-course`、`.checkout-facts`、`.checkout-total`、`.checkout-amount` | 購買課程：01／02／03 步驟列像課表一樣對齊欄位；右欄是課程摘要與應付金額（沿用 `.purchase`） | `pages/_flow.scss` |
| `.pay-options`、`.pay-option`（`-label`、`-name`、`-help`）、`.pay-card` | 付款方式：選中的一列左側 3px 墨黑線＋粗體；信用卡欄位只在選信用卡時出現（`:has()`） | `pages/_flow.scss` |
| `.flow-alert`、`.flow-alert-title`、`.flow-link-btn` | 錯誤提示框（瑞士紅框＋左側 4px＋圖示）；句子裡的連結型按鈕（「可以直接登入」） | `pages/_flow.scss` |
| `.result-head`、`.result-icon`（`.is-error`）、`.result-block`（`.is-under-head`）、`.result-dl`、`.result-course`、`.result-steps`、`.result-actions`、`.result-todo` | 付款結果：「標籤｜值」對齊的資料表、編號清單「接下來」、按鈕列（576px 以下滿版直排）；`.is-under-head` 是緊接在頁首下方的第一個區塊，992px 以下上緣改 1px，不和頁首的 2px 底線疊成雙線（購買課程的 `.checkout-side-title` 同樣處理） | `pages/_flow.scss` |

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 面 | 純白 `$paper #FFFFFF`（頁面底）、霧面 `$fog #F2F2F2`（進度軌道、提示底）、放映黑 `$screen #0A0A0A`（播放器、頁尾、「正在播放」方塊） |
| 文字 | 墨黑 `$ink #111111`（18.9:1）、石墨灰 `$graphite #595959`（7.0:1）、中灰 `$ash #767676`（placeholder，4.54:1）、放映灰 `$screen-muted #A6A6A6`（深色底上 8.1:1） |
| 紅 | 瑞士紅 `$swiss-red #E30613`（主要按鈕、目前單元、進度條、焦點環；紅字對白 4.88:1、白字在紅底 4.88:1）、深紅 `$swiss-red-deep #B8000F`（hover，6.9:1）。全站唯一的彩色 |
| 線 | 墨黑 2px（區塊與章節開頭）、墨黑 1px（表單、工具列）、細線灰 `$hairline #D9D9D9`（清單之間，裝飾）、欄線 `$grid-line #EBEBEB` |
| 狀態 | 不另加綠、藍、橘：已完成＝墨黑 ✓、播放中＝瑞士紅 ▶＋粗體、未開始＝石墨灰 ○、錯誤＝瑞士紅＋警示圖示；一律圖示＋文字 |
| 按鈕 | 主要：瑞士紅底＋白字（一個區塊只放一個）；次要：墨黑細框（課程卡的「免費試看」）；深色：墨黑底（頁首登入）；文字連結 `.btn-text` |
| 字體 | Inter Tight（英數、價格、時間、大數字，tabular-nums）＋ Noto Sans TC（中文）。字重 400／500／700，900 只給首頁主標、頁面大標與課程名稱。左齊不齊右 |
| 字級 | 頁面大標 120 → 首頁主標 68 → 課程名稱 52 → H2 40 → H3 20 → 內文 16／28 → 輔助 14、13 |
| 網格與間距 | 12 欄、欄間距 32px、容器最大 1320px；8px 間距單位、4px 基線；區塊留白 64／96px |
| 圓角 | 0；只有頭像與 radio 是圓的 |
| 陰影 | 無（`$enable-shadows: false`、`$box-shadow: none`）；浮層用墨黑框線 |
| 焦點 | 瑞士紅 2px 外框＋2px 底色間隙，白底與放映黑上都看得見 |
| 頁首 | 高 73px；sticky 位移 97px（購買卡、學習頁側欄、篩選側欄、錨點） |
| 動態 | 只有課程卡封面微放大（情境卡的資訊色帶常駐顯示，不在 hover 時升起）；`prefers-reduced-motion` 時關閉 |

完整規範請看 `guideline.html`。改色時，Guideline 的色票 hex、對比度與其他寫死色碼的地方也要一起改，清單見上一層 [`../README.md`](../README.md) 的「換色時同步檢查」。

## 圖片

`images/` 的 23 張圖片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名、比例與主體照主題層的 [`../IMAGES.md`](../IMAGES.md)。調性是 1960 年代瑞士「客觀攝影」：**真正的黑白照**（輸出時轉成灰階）、明亮、構圖方正、背景乾淨，手部特寫為主。替換時保持相同檔名即可，不需改程式。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`：先依 prompt 生成 3:2、2:3 或 1:1 的原圖，再從中央裁成 IMAGES.md 的比例（16:9、4:5、3:2、1:1）並縮到指定尺寸，最後轉成灰階 JPEG。

```bash
npm run images                                         # 產生缺少的圖片
node scripts/generate-images.mjs --only hero,craft-bowl # 只重做指定的圖
node scripts/generate-images.mjs --force               # 全部重做
```

換成其他風格時，改腳本裡的 `STYLE`（整組圖的共同調性）與各張描述即可；不想要灰階時，拿掉 `finish()` 裡的 `-m` 色彩描述檔參數。
