# 06｜童心啟蒙樂園：Craftory 手感工藝線上學院

> 淺色系＋繽紛暖色（向日葵黃、天空藍、珊瑚橘）｜大圓角播放按鈕、闖關地圖式章節清單，進度完成時帶有可愛勳章動畫

概念是「一本會動的闖關繪本」：向日葵黃與天空藍的貼紙卡片、大大的圓形播放鈕，每完成一關就拿到一枚勳章，讓「把作品做完」變成一路蓋章的冒險。學員是上班族成人，CONTENT.md 的人物與文案一字不改，「童心」只是語氣與視覺的輕鬆：不加卡通角色、不加注音、不加語助詞。價格、表單、付款結果的排法和其他風格一樣嚴謹，可愛只放在裝飾與動畫。

大膽只花在三處：**大圓播放鈕**（`.play-orb`）、**闖關小徑**（課程大綱、學習頁側欄、付款結果的接下來）、**通關勳章動畫**（`.medal`）。其他地方用同一種**貼紙語彙**維持一致：白底、2px 墨框、28px 圓角、`4px 4px 0` 墨色硬陰影，沒有任何模糊陰影。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（與 `04-scholar-style` 相同架構）：

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
| 課程播放／學習頁 | `learn.html` | `scss/pages/_learn.scss` | 完成 |
| 註冊 | `register.html` | `scss/pages/_register.scss` | 完成 |
| 購買課程 | `checkout.html` | `scss/pages/_checkout.scss` | 完成 |
| 付款結果（付款成功） | `order-result.html` | `scss/pages/_order-result.scss` | 完成 |
| 我的課程 | `my-courses.html` | `scss/pages/_my-courses.scss` | 完成 |
| 購買紀錄 | `orders.html` | `scss/pages/_orders.scss` | 完成 |

頁面流程與動態狀態的呈現方式和其他風格相同：

- 購買：首頁 → 課程列表 → 課程詳情 →「立即購買，開始上課」→ 登入對話框（未登入提示）→ 購買課程 →「確認付款」→ 付款結果 →「前往我的課程」或「開始上課」（學習頁）。
- 註冊：登入對話框的「立即註冊」→ 註冊 →「完成註冊」→ 購買課程；註冊頁的「登入」再開回登入對話框。
- 回來上課：頁首「我的課程」→ 我的課程 →「繼續上課」（學習頁）；我的課程的「購買紀錄」→ 購買紀錄。
- 課程詳情只做一頁靜態示範，所有課程卡都連到 `course.html`，「免費試看」連到 `course.html#trial`。
- 看不到的狀態放在該頁 `<main>` 最後的「設計稿狀態示意」（`.demo-state`），清單照主題層規格。
- 首頁的工藝舷窗連到 `courses.html?craft=pottery` 這類網址，課程列表會預先選中該分類（`js/main.js` 比對 `input[name="craft"]` 的 value）。

## 排版語言

給後續補頁的人：**共用規格只管內容，構圖由這一節決定**。每頁都要看得出是 06（墨框、硬陰影、膠囊、圓形），也要和其他 5 套的同一頁構圖不同。

### 網格與節奏

- 12 欄 Bootstrap 網格；`$grid-gutter-width: 2rem`、`$container-padding-x: 2.5rem`（手機兩側各 20px）；版心最大 1240（xxl）。
- 區塊上下留白：桌機 96、手機 64（`.section`）。區塊標題列下方 40／32。
- 內頁 `<main>` 加 `.page-top`：上方 48，再加頁首波浪的 12。首頁不加。
- sticky 元素（購買卡、學習側欄、Guideline 目錄）：`top: var(--sticky-top)`（104px＝頁首 76＋波浪 12＋16）；錨點位移是 `html` 的 `scroll-padding-top`（同值），點錨點不會被頁首蓋住。
- 1920 寬時頁首色帶、首頁色帶、熱門課程色帶、CTA 色帶、頁尾都滿版，內容留在版心。
- **間距尺度改過**：`$spacers` 是 1＝.25rem、2＝.5rem、3＝1rem、4＝1.5rem、**5＝2rem、6＝3rem、7＝4rem、8＝6rem**（Bootstrap 預設的 5 是 3rem）。所以 `.mb-5` 是 32px，要 48px 用 `.mb-6`。

### 頁首與頁尾

- 頁首：向日葵黃全寬色帶，高 76、`sticky top: 0`，底緣 12px 墨色描邊的圓弧波浪（`::after`，不佔版面高度）。左邊品牌（墨框圓形太陽貼紙＋Baloo 2「Craftory」），導覽是白底墨框膠囊（目前頁＝墨底白字），右側膠囊搜尋框、我的課程、登入／註冊（珊瑚底墨字＋3px 硬陰影）。992px 以下品牌靠左，右側「登入／註冊」＋圓形選單鈕，選單展開在色帶裡。
- 頁尾：淡天空藍底，頂緣是墨色描邊的雲朵波浪；品牌＋一句說明，3 欄粗字連結（欄名前有向日葵、珊瑚、葉綠小圓點），版權在最下方虛線之後。
- 頁首、頁尾、登入對話框每頁一份，從 `templates/page.html` 複製，範本開頭的註解寫了目前頁標示規則。

### 卡片

- 基本卡＝`.sticker`（白底、2px 墨框、28px 圓角、4px 硬陰影）。同一區塊的卡片可以輪流加 `.sticker-strip.is-sun／.is-sky／.is-coral`（頂部 12px 淡色條＋墨色下邊線），正文一律在白底上。
- 亮色（sunflower、sky、coral、leaf）**只當填色**，上面一律墨字，外面一律墨框；亮色本身在奶油底上都不到 3:1，拿掉墨框就看不出邊界。
- **珊瑚底不能放白字**（2.31:1 不及格）。`.btn-primary` 就是珊瑚底墨字。
- 小貼紙可以轉 ±2°（`.tilt-l`、`.tilt-r`）或 ±1.5°（`.tilt-l-sm`、`.tilt-r-sm`）：正在播放、課程票、勳章、拍立得、收據。**含表單或長文字的卡片不轉**。576px 以下一律不轉。唯一的大卡例外是我的課程的 3 張課程卡：≥ 992px 左右兩張轉 ∓1.5°、中間那張往下錯開（招牌，寫在 `pages/_my-courses.scss`）。
- hover／focus 只換底色、外框色或加底線，不位移、不放大、不展開、不顯示隱藏內容。按鈕 `:active` 往右下沉 3px、硬陰影變 0（只是位移，不改尺寸）。

### 標題層級

| 層級 | 寫法 | 桌機 | 手機 |
|---|---|---|---|
| Display（只有首頁 H1） | `.display-title`，Chiron GoRound TC 900 | 60 | 38 |
| H1（內頁） | `<h1>`，800 | 44 | 32 |
| H2 | `.section-head` 裡的 `.section-title`，800，前面 40px 圓形色塊徽章 | 34 | 26 |
| H3 | `<h3>`，700 | 21 | 19 |
| 內文 | 500，行高 1.8 | 17 | 16 |
| 小字 | `$font-size-sm` | 15（下限） | 15 |
| 價格 | `.price`（24）、`.price-lg`（28／30），Baloo 2 800、珊瑚深 | | |

- H2 一律靠左，前面一個 `.section-badge`（裝飾 icon，墨框圓形，依區塊輪流 `.is-sun`、`.is-sky`、`.is-coral`、`.is-leaf`），右側「看更多」用 `.link-more`（深天空藍、3px 底線）。
- 中文標題換行：`.section-title` 已經是 `word-break: keep-all`，在想斷的地方放 `<wbr>`（例如 `為什麼在 Craftory <wbr>學得完？`）；其他短標題用 `.text-phrase`＋`<wbr>`。課程名稱的「｜」前半段包 `.text-nowrap`、後面接 `<wbr>`。數字與單位之間用 `&nbsp;`。
- 小徑的章名（`.trail-chapter-title`）也是 `word-break: keep-all`，HTML 在「：」「、」後面放 `<wbr>`（`第 3 章　手捏成形：<wbr>從土球到碗`）；單元名（`.trail-unit-name`）用 `text-wrap: balance`，名稱和後面的 chip／圖示是兩個 flex 項目，最後一行不會只剩一個字，也不會出現「一個字＋chip」。

### 每頁招牌元素

| 頁面 | 招牌 |
|---|---|
| 首頁 | 拱門主圖＋跨在拱門底緣的 120px 大圓播放鈕、正在播放貼紙（完成） |
| 課程列表 | 「選關卡」色板：8 個分類大方塊 |
| 課程詳情 | 電視機播放器（`.player`）＋闖關小徑大綱（`.trail-accordion`） |
| 學習頁 | 電視機播放器＋闖關小徑側欄＋56px 圓形上一個／下一個（`.round-btn`） |
| 註冊 | 貼在表單卡右上角的「課程票」貼紙 |
| 購買課程 | 3 張大付款選項卡 |
| 付款結果 | 通關勳章（載入時 pop）＋3 站迷你地圖 |
| 我的課程 | 3 張錯落、微轉的貼紙卡（≥ 992px）＋甜甜圈進度（12px 粗環）＋已完課的勳章 |
| 購買紀錄 | 鋸齒邊收據貼紙 |
| Guideline | 小徑目錄 |

### 各頁構圖原則

照美術方向說明 §4.6，摘要如下；class 一律加頁面前綴（`courses-`、`course-`、`learn-`…），寫在各自的 `scss/pages/_*.scss`。

- **首頁**（完成）：桌機左 5 欄拱門主圖、右 7 欄淡向日葵色帶（下緣天空與葉綠兩座小山丘）放 H1 與按鈕；手機主圖在上、文字在下。之後依序是 `#why` 4 個高低錯落的色塊泡泡、`#crafts` 4 個圓形舷窗（576px 以下兩欄，舷窗卡左右內距歸零、時數 chip 改 14px，375 寬以上維持一行膠囊）、`#featured` 淡天空色帶上的 4 張直式課程卡、`#guarantee` 拍立得＋保障清單卡、向日葵 CTA 色帶＋勳章。
- **課程列表**（完成）：標題區下面一塊淡向日葵底、墨框、28px 圓角的「選關卡」色板：左 8 欄是 8 個分類大方塊（4×2；每個是 icon、名稱、Baloo 2 數量；`.btn-check` 的 radio，`name="craft"`，選中＝向日葵底＋硬陰影＋勾），右 4 欄是難度（2 個粗膠囊 checkbox）、價格（3 個）、排序 select、清除篩選。下面工具列「共 52 門課程」，再下面 2 欄**橫式**貼紙卡（`.course-card-row`：封面 5/12、文字 7/12），分頁是大圓鈕。手機：分類方塊改成橫向捲動的一列（每個 120 寬），「篩選」（照 CONTENT.md §9.6 的按鈕文字）開 Offcanvas bottom；課程卡變直式單欄。**沒有左側欄**。實作細節：色板裡是 CSS Grid（8fr／4fr），右欄就是 `.offcanvas-lg.offcanvas-bottom`，所以色板不能加 `z-index`、`transform`、`isolation`（抽屜會被壓在遮罩底下）；≥ 992px 分類方塊兩列等高、撐滿右欄高度。橫式卡在 768～1199px 是 1 欄、≥ 1200px 才 2 欄（8 欄寬放 2 張橫式卡太擠）。
- **課程詳情**（完成）：桌機 8：4。左欄 `.player.is-paused`（`id="trial"`）、H1、meta chip（照規格的區塊順序與「先看到影片」，播放器在 H1 上面），下方課程介紹、你會做出、**課程大綱用 `.accordion.trail.trail-accordion`**（已完成站＝`.trail-sign.is-done`、試看站＝`.is-trial`），講師、評價、FAQ 是貼紙卡。右欄 sticky 貼紙購買卡：頂端一條珊瑚價格緞帶（墨字 Baloo 2 30），主要按鈕珊瑚、次要白底墨框、願望清單是白底次要按鈕前面一顆淡珊瑚愛心圓章（`.course-wish`，`data-bs-toggle="button"`，按下後實心愛心＋「已加入願望清單」）。手機：播放器 → H1 → 購買卡 → 小徑大綱。大綱的小徑是直線，**不做蜿蜒**（Accordion 高度會變）。實作細節：版面是 CSS Grid（`top`、`aside`、`rest` 三區），手機順序就是 HTML 順序；購買卡在 ≥ 992px 且視窗高 ≥ 680px 才 sticky；價格緞帶左右凸出卡片 12px，所以購買卡不能 `overflow: hidden`。單元列是 `.trail-unit`（試看＝連到 `#trial` 的連結、鎖定＝開 `#lockedModal` 的按鈕）。
- **學習頁**（完成）：桌機 8：4（992～1199px 是 7：5，側欄才放得下章節名稱）。左：`.player.is-playing`（≥ 768px 續看提示 toast 貼在電視畫面左上）→ 單元標題 → 淡天空操作列（上一個／下一個是 56px `.round-btn`，下面整列珊瑚「標記完成並繼續」；576px 以下上一／下一只留圓鈕）→ 粗膠囊分頁（`.nav-pills-bold`，選中＝天空底墨字）→ 面板：單元重點是淡向日葵底的大圓角便條、課程問答（墨框 textarea＋問答貼紙卡）、附件下載（每個檔案一張小貼紙方塊）。右側 sticky 側欄：進度卡（Baloo 2「50%」、「已完成 14／28 單元 ‧ 50%」、`.progress`、上次看到）→「全部收合」→ `.trail-accordion` 章節清單（拿掉 `data-bs-parent`，已完成的章用 `.trail-sign.is-medal`，目前單元用 `.trail-stone.is-playing`＋`.chip-playing`）。側欄比視窗高時，進度貼紙固定、章節貼紙框裡面捲動；章節清單用 `.trail-accordion.is-compact`（小石頭落在小徑上，狀態圖示只留給螢幕報讀器），第 5、6 章完成一半用 `.trail-sign.is-partial`。手機：底部固定珊瑚膠囊「課程章節 50%」（CONTENT.md §9.6 的文字）開 Offcanvas bottom。狀態示意的「完成一章」「全課完成」在首屏以下，用 `.medal.medal-animate-view`（捲進畫面才播）。
- **註冊**（完成）：版心內一張 760 寬的白色貼紙表單卡置中（CSS Grid）。≥ 768px 上半兩欄：左 H1 與說明，右邊一張「課程票」貼紙（向日葵票頭「註冊後，接著完成購買」→ 方形小封面、課名、講師 → 虛線撕口與兩側半圓缺口 → 淡向日葵票根：價格與 7 天退費），轉 3°、用負邊距往右上跨出卡片 24px（卡片內距 40／44 改了要一起改）。下半是欄位：顯示名稱與電子郵件並排，密碼整列，同意條款（還沒有頁面的「服務條款」「隱私權政策」是不帶 href 的佔位連結，樣式補成連結色），珊瑚全寬「完成註冊」；卡片底部一條淡天空帶「已經有帳號？登入」（以購買情境開登入對話框）。手機：課程票不轉、排在 H1 上方，欄位單欄。表單卡本身不轉；≥ 992px 卡片兩側有圓形色塊。狀態示意「欄位有錯誤時」把欄位重畫一份（id 加 `Demo`），3 則錯誤同時出現，電子郵件錯誤裡的「登入」是 `.link-inline` 按鈕。
- **購買課程**（完成）：返回「回到課程介紹」→ H1 → 說明。最上方一條全寬橫向課程貼紙（`.checkout-course`）：≥ 992px 是「封面｜課名、講師、2 個 chip、購買包含 4 項｜價格＋『購買後可以看多久？』問答框」三欄，封面跨兩列撐滿高度（直式裁切）；手機封面縮成 88px 小圖、其他直排。下面 7／5：左是購買帳號卡、付款方式 `fieldset`（`legend` 用 `.flow-title`）裡的 **3 張大選項卡**（`.pay-tile`，`btn-check` radio `name="payment"`；≥ 768px 一列 3 張、直式，手機是橫式一列一張；選中＝天空底＋硬陰影＋右上角勾）。信用卡欄位是一張天空色條小貼紙，上緣三角形指向信用卡那張，只在選信用卡時出現（`.pay-grid:has(#payCard:not(:checked))`，≥ 768px 排在第二列、手機緊接在信用卡下面）。右欄：發票卡 → 向日葵總金額貼紙 → 7 天退費提示（沿用課程詳情的 `.course-buy-note`）→ 珊瑚「確認付款 NT$ 2,480」；≥ 992px 且視窗高 ≥ 720px 才 sticky。手機依序直排。狀態示意：付款處理中（停用按鈕＋轉圈）、付款失敗（`.flow-alert` 出現在付款方式上方）。
- **付款結果**（完成）：「通關畫面」。這頁的 `<main>` **不加 `.page-top`**：頁首波浪下面直接接一條滿版淡向日葵色帶（下緣是首頁同款的天空與葉綠小山丘，沿用 `$hills-svg`），中央 120px `.medal.medal-animate`＋12 條放射線（靜態 SVG）→ H1 → 說明。下面 CSS Grid：≥ 992px 左 7 欄收據貼紙（`.receipt.is-both`：上下緣鋸齒，轉 -1°，往上壓在小山丘上；訂單資訊、購買內容、發票三段以虛線分隔），右 5 欄「接下來」**3 站迷你地圖**（固定 120×336 的蜿蜒虛線 SVG＋3 個 `.trail-sign`，第 2 站往右 72px；改站距要和 SVG 路徑一起改）→ 按鈕列 → 退費提醒與「查看購買紀錄」。手機（grid-template-areas）：勳章 → H1 → 迷你地圖改成直線小徑（`.trail` 一般清單版）→ 收據（不轉）→ 按鈕；HTML 順序是收據在前，收據裡沒有可聚焦元素，所以 Tab 順序不受影響。狀態示意「付款沒有完成時」是一張貼紙：淡番茄圓章警示圖示（形狀與顏色都和勳章不同）、應付金額（尚未扣款）、3 個建議、重新付款與回到課程介紹。
- **我的課程**（完成）：標題區左 H1 與說明，右邊 3 個色塊泡泡統計（向日葵、天空、珊瑚；`dl`，Baloo 2 大數字在上、標籤在下）＋購買紀錄連結（< 992px 排在說明下方）。粗膠囊篩選（`.nav-pills-bold`＋`data-filter-list`，按鈕帶數量小圓章與 `aria-pressed`）。3 張貼紙卡（`.sticker-strip`，向日葵、天空、珊瑚色條）：< 768px 1 欄、768～991px 2 欄、≥ 992px 3 欄，**錯落貼在桌上**：卡片高度各自依內容，第 1 張左轉 1.5°、第 2 張往下 64px、第 3 張右轉 1.5° 並往下 24px（靜態的 `rotate`／`translate`，用 `:nth-child(n of :not([hidden]))`，篩選後照顯示順序算），和 02 北歐整齊的 3 欄輕卡區隔。576px 以下篩選膠囊不換行、平分整列（360 寬也排得下）。圓角封面右下緣疊一個 96px **甜甜圈進度**（白底墨框、淡天空軌道上的深天空弧、12px 粗，中間 Baloo 2 百分比，`role="progressbar"`；旁邊仍有「已完成 14／28 單元 ‧ 50%」文字），下面是狀態 chip、課名、講師、淡天空「上次看到」小框、貼齊卡片底部的主要按鈕。已完課那張換成 `.medal.medal-md.medal-animate-view`（首屏以下時捲進畫面才播）＋淡葉綠完課日期＋次要「再看一次」。甜甜圈寫在 `pages/_my-courses.scss`（Guideline 要用時再搬到 components）。狀態示意「還沒有任何課程時」：標題、說明、購買紀錄連結＋空狀態。
- **購買紀錄**（完成）：麵包屑「首頁／我的課程／購買紀錄」→ H1 → 說明 → 淡向日葵「共 5 筆訂單」膠囊。5 張收據貼紙（`.receipt`，底緣鋸齒）：≥ 768px 2 欄（同列等高，動作按鈕貼齊底部）、手機單欄。每張由上而下是淡向日葵票頭（訂單編號 Baloo 2＋狀態 chip，狀態字樣只給螢幕報讀器）→ 小封面＋課名（h3）→ 金額、付款方式、日期（`.kv-list`）→ 備註（可申請退費＝淡向日葵、付款失敗＝淡番茄、退費處理中＝虛線）→ 動作。「申請退費」只有藤編那筆，連到本頁狀態示意 `#refund-pending`。最下方一塊淡向日葵提示卡放 7 天不滿意退費說明（左邊向日葵太陽圓章，白圈墨框）。狀態示意：退費處理中（同一張收據換狀態）、沒有購買紀錄時（空狀態）。
- **Guideline**（完成）：標題區左 H1、說明與 3 個資訊 chip，右邊斜貼一張淡向日葵風格貼紙（72px `.medal.medal-sm.medal-animate`，載入時 pop 一次）。≥ 992px 左 3 欄 sticky「小徑目錄」（`.sticker.gl-map` 裡的 `.trail` 一般清單版，11 站都是錨點連結；右欄加 `data-bs-spy="scroll"`、`data-bs-root-margin="-104px 0px -70% 0px"`，Bootstrap ScrollSpy 替目前章節加 `.active`：站牌換天空、站名淡天空底），右 9 欄每節一張 `.sticker.gl-card`，H2 沿用 `.section-head`＋編號徽章。手機：目錄改成頂端一列橫向捲動的站牌列（不 sticky），章節卡全寬。11 節照規格順序：概覽（含 10 頁清單與各自的招牌）、色彩、字級階層、間距、圓角與陰影、招牌元素（播放鈕、小徑、勳章動畫示範區與 reduced-motion 說明、貼紙語彙）、元件狀態規範（按鈕旁寫明「珊瑚底一律墨字」）、狀態與空畫面文案（Notion 7 則，含只在本頁的講師課程狀態卡）、動態與 hover、RWD 斷點、Do／Don't。hover、focus、按下用 `.gl-hover`／`.gl-focus`／`.gl-press`／`.gl-focus-within` 固定畫出來；分頁籤、切換、手風琴、單元列、播放器選單與對話框都可以實際操作（本頁另有一份 `#glLockedModal`，按鈕只關閉對話框）。示範直接用各頁的 class（`.courses-tile`、`.course-buy`、`.learn-progress`…），不另寫一份。

## 檔案結構

```
06-kids-style/
├─ *.html                    ← 10 個頁面，每頁完整包含頁首、頁尾與登入對話框
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的六個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 23 張 AI 生成的照片（晴朗早晨）＋ favicon.svg（墨框太陽貼紙）
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫
│  ├─ _base.scss             ← 全站基礎、按鈕、chip、貼紙語彙、區塊標題、狀態示意與共用小工具
│  ├─ components/            ← 頁首、頁尾、課程卡、播放器、闖關小徑、勳章、對話框、流程頁共用
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾是否與範本一致，以及頁首的目前頁標示
   └─ generate-images.mjs    ← 生圖腳本（所有圖片的 prompt、裁切比例與輸出尺寸）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾、登入對話框每頁一份**：要改的時候先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check`。每頁只有一處不同：頁首的目前頁標示。首頁 → 首頁、課程列表 → 探索課程、課程詳情 → 探索課程（只加 `active`）、我的課程 → 我的課程、學習頁與購買紀錄 → 我的課程（只加 `active`，寫成 `class="nav-link site-mycourses active"`）；Guideline、註冊、購買課程、付款結果不標示。
- **新增頁面**：複製範本，改 `<title>`（`頁面名稱｜Craftory 手感工藝線上學院`）、description（結尾一律「設計稿 06｜童心啟蒙樂園。」）與目前頁標示；內頁的 `<main>` 加 `.page-top`。
- **假資料直接寫在 HTML**：來源是主題層的 `../CONTENT.md`，文案一字不改。同一份資料會出現在多頁（手捏陶的單元、學習進度 14／28），改動時要多頁同步。
- **JS**：`js/main.js` 只做六件事：登入對話框依觸發按鈕（`data-auth-context="purchase"`）顯示未登入提示、換主要按鈕文字並把送出目的地換成 `checkout.html`；關閉鎖定提示後捲到購買卡（`data-dismiss-to`）；啟用 `data-bs-toggle="tooltip"`（進度條上的「上次看到 07:18」）；學習頁側欄「全部收合」（`data-collapse-all`）；課程列表依 `?craft=` 預先選中 `input[name="craft"]`；我的課程依學習狀態篩選（`data-filter-list`／`data-filter`）。其他互動都靠 Bootstrap 的 `data-bs-*`。不要為動畫新增 JS。
- **表單**：設計稿沒有後端，表單用 GET 送到下一頁（登入對話框 → `learn.html`；註冊 → `checkout.html`；購買課程 → `order-result.html`）。密碼、Email、卡號欄位**不加 `name`**；每個欄位都要有 `id`、`<label for>` 與 `autocomplete`。錯誤狀態用 `.is-invalid`＋`.invalid-feedback.has-icon`（番茄紅字、淡番茄底、前面一個驚嘆號圖示），並以 `aria-describedby` 連起來。付款方式的 radio 用 `name="payment"`（值不是個資，留在網址列沒關係）。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：色彩、字體、間距、圓角、元件變數
3. `bootstrap/scss/bootstrap`
4. `bootstrap-icons`（字型路徑指向 `css/fonts/`）
5. `_base.scss`
6. `components/`：`_header`、`_footer`、`_course-card`、`_player`、`_trail`、`_medal`、`_modal`、`_flow`
7. `pages/`：`_guideline`、`_home`、`_courses`、`_course`、`_learn`、`_register`、`_checkout`、`_order-result`、`_my-courses`、`_orders`

原則是**先用 Bootstrap 的變數與工具類別**，真的做不到才寫自訂 CSS，而且自訂 CSS 也只引用變數，不寫死色碼。

### 共用類別

下面這些類別跨頁共用，新頁面直接套用，不要在 `pages/*` 另寫一份。標記寫法在各檔開頭的註解裡。

| 類別 | 用途 | 位置 |
|---|---|---|
| `.page-top`、`.page-header`、`.page-lead` | 內頁 `<main>` 上方留白；內頁頁首：麵包屑 → h1 → 一句說明 | `_base.scss` |
| `.section` | 區塊上下留白 64／96 | `_base.scss` |
| `.section-head`、`.section-badge`（`.is-sun`／`-sky`／`-coral`／`-leaf`）、`.section-head-text`、`.section-title`、`.section-lead`、`.link-more` | 區塊標題列：40px 圓形徽章＋H2＋說明，右側「看更多」（576px 以下移到說明下方） | `_base.scss` |
| `.display-title`、`.text-phrase` | 首頁 Display 標題；短標題只在空白與 `<wbr>` 處換行 | `_base.scss` |
| `.num`、`.price`、`.price-lg`、`.text-ink-2` | Baloo 2 等寬數字；價格（珊瑚深）；次要文字色 | `_base.scss` |
| `.btn-primary` | 主要按鈕：珊瑚底墨字墨框＋3px 硬陰影（hover 珊瑚稍亮） | `_base.scss` |
| `.btn-secondary`（＝`.btn-outline-primary`） | 次要按鈕：白底墨框墨字（hover 淡向日葵） | `_base.scss` |
| `.btn-sun`、`.btn-sky` | 向日葵、天空底的按鈕（墨字；hover 是淡 30%／35% 的同色）。目前 9 個頁面沒有用到，Guideline 示範，保留給色帶或深色區塊 | `_base.scss` |
| `.btn-text` | 文字連結型按鈕，內建 44px 觸控高度 | `_base.scss` |
| `.round-btn`（`.is-sun`／`-sky`／`-coral`，`--size` 預設 56px） | 圓形 icon 鈕：上一個／下一個、願望清單、分頁 | `_base.scss` |
| `.play-orb`（`--orb` 預設 120px） | ★ 大圓播放鈕：向日葵＋墨框＋天空外圈＋硬陰影 | `_base.scss` |
| `.chip`＋`.chip-sun`／`-sky`／`-coral`／`-leaf`／`-sun-soft`／`-sky-soft`／`-coral-soft` | 膠囊小標籤（分類、難度、數量）。一般行內元素，裡面可以混文字與 `.num` | `_base.scss` |
| `.chip-trial`／`-lock`／`-playing`／`-done`／`-progress`／`-learning`／`-draft`／`-live`／`-off` | 試看、鎖定（虛線）、播放中、已完成、學習進度、學習中、草稿、已上架、已下架；一律搭配圖示 | `_base.scss` |
| `.chip-paid`／`-refunding`／`-failed`／`-refunded` | 已付款（勾）、退費處理中（虛線＋沙漏）、付款失敗（番茄框＋叉）、已退費 | `_base.scss` |
| `.sticker`、`.sticker-strip`（`.is-sun`／`-sky`／`-coral`） | 貼紙卡；頂部 12px 色條 | `_base.scss` |
| `.tilt-l`、`.tilt-r`、`.tilt-l-sm`、`.tilt-r-sm` | 小貼紙旋轉 ±2°、±1.5°（576px 以下取消） | `_base.scss` |
| `.avatar-text`、`.rating`、`.stars` | 講師文字頭像（姓）、「★ 4.9」、星等（向日葵星＋墨色描邊） | `_base.scss` |
| `.nav-pills-bold` | 粗膠囊分頁（學習頁的單元重點／課程問答／附件下載）：白底墨框，選中＝天空底墨字＋硬陰影；576px 以下拿掉圖示 | `_base.scss` |
| `.segmented` | 切換鈕組（`btn-check`），例如「最有幫助／最新」；選中＝天空底 | `_base.scss` |
| `.deco-dot`（`--d`、`--c`） | 區塊角落的圓形色塊裝飾（`aria-hidden`，放在 `overflow: hidden` 的區塊裡） | `_base.scss` |
| mixin `scallop($color, $side, $r)` | 色帶上下緣的墨色描邊圓弧波浪（頁首、首頁色帶） | `_base.scss` |
| `.demo-state`（`-tag`、`-item`、`-title`、`-stage`） | 頁面底部的「設計稿狀態示意」，虛線框和正式內容分開 | `_base.scss` |
| `.empty-state`、`.empty-state-icon` | 空狀態：88px 淡向日葵圓形圖示 → 一句說明 → 一個動作 | `_base.scss` |
| `.bleed-x`（mixin `bleed-x`） | 576px 以下讓橫向捲動列貼齊螢幕兩側 | `_base.scss` |
| `.course-card`（`-media`、`-duration`、`-body`、`-tags`、`-title`、`-teacher`、`-meta`、`-foot`、`-trial`）、`.course-scroller` | 直式課程卡；首頁熱門課程的橫向捲動列（≥ 992px 變 4 欄）。橫式卡 `.course-card-row` 由課程列表在 `pages/_courses.scss` 加 | `components/_course-card.scss` |
| `.player`（`.is-paused`、`.is-playing`）＋`-screen`、`-media`、`-caption`、`-bigplay`、`-controls`、`-progress`（`-buffer`、`-played`、`-mark`、`-head`）、`-bar`、`-btn`（`.is-primary`）、`-time`、`-spacer`、`-volume`、`-volume-bar`、`-speed-label`、`-speed-icon`、`-knobs`、`-spinner`、`-error`、`-error-icon` | ★ 電視機播放器：墨色機身、天線、喇叭孔與兩顆旋鈕；未播放、播放中、載入中、載入失敗（576px 以下音量整組隱藏、速度鈕的「1x」換成碼表圖示 `.player-speed-icon`，載入失敗的畫面跟著內容長高） | `components/_player.scss` |
| `.trail`（`--trail-x`）、`.trail-stop`、`.trail-sign`（`.is-done`／`-trial`／`-current`／`-medal`，`.trail-sign-sm`）、`.trail-units`、`.trail-stone`（`.is-done`／`-playing`／`-trial`／`-locked`） | ★ 闖關小徑：虛線小徑＋48px 圓形站牌＋單元小石頭 | `components/_trail.scss` |
| `.trail-accordion`、`.trail-chapter`、`.trail-chapter-title`、`.trail-chapter-meta` | 小徑套在 Bootstrap Accordion／Collapse 上（課程詳情大綱、學習頁側欄） | `components/_trail.scss` |
| `.trail-unit`（`-no`、`-name`、`-icon`（`.is-done`）、`-time`）、`.trail-sign.is-partial`、`.trail-accordion.is-compact` | 單元列的可點區（連結或按鈕；編號 → 名稱＋狀態 chip／圖示 → 片長，播放中的那列淡天空底＋墨框）；完成一半的章（站牌下半葉綠）；窄側欄版小徑（小石頭落在小徑上、狀態圖示只留給螢幕報讀器） | `components/_trail.scss` |
| `.medal`（`.medal-sm` 72、`.medal-md` 96、預設 120）＋`.medal-art`、`.medal-shine`、`.medal-spark.is-1～4`；`.medal-animate`、`.medal-animate-view` | ★ 通關勳章：載入時 pop 一次／捲進畫面才播（只動 transform，整枚進到畫面時已經播完，停在畫面下緣也不會半透明）／不加就是靜態 | `components/_medal.scss` |
| `.auth-notice`、`.auth-link`、`.locked-dialog`、`.locked-icon`、`.locked-text` | 登入對話框的未登入提示、鎖定單元提示 | `components/_modal.scss` |
| `.demo-state-note` | 狀態示意標題下的一句說明（這個狀態什麼時候出現） | `_base.scss` |
| `.invalid-feedback.has-icon`、`.link-inline` | 錯誤訊息前面加驚嘆號圖示（不只靠顏色）；錯誤訊息裡像連結的行內按鈕（例如「可以直接登入」開登入對話框） | `_base.scss` |
| `.flow-title`、`.flow-title-badge`（`.is-sky`／`-coral`／`-leaf`） | 流程頁的小標：32px 圓形色塊徽章＋粗字；也可以用在 `<legend>` | `components/_flow.scss` |
| `.mini-cover`（`--w` 預設 112px，`.is-square`） | 小封面：墨框圓角 16:9（或 1:1）縮圖 | `components/_flow.scss` |
| `.flow-teacher` | 講師列：32px 文字頭像＋名字 | `components/_flow.scss` |
| `.kv-list` | 鍵值清單（`dl` 裡每列一個 `div`）：左標籤、右值靠右，虛線分隔；值是 `.price` 時放大 | `components/_flow.scss` |
| `.receipt`（`.is-both`） | ★ 鋸齒邊收據貼紙：白底墨框、底緣鋸齒＋硬陰影（`filter: drop-shadow`，跟著鋸齒走）；`.is-both` 上緣也是鋸齒（付款結果）。購買紀錄的每筆訂單也是這張 | `components/_flow.scss` |
| `.flow-alert`、`.flow-alert-icon`、`.flow-alert-title` | 錯誤提示框：淡番茄底、番茄框與硬陰影、左側圓形警示圖示＋番茄粗標題（購買課程的付款失敗） | `components/_flow.scss` |
| `.course-buy-note`、`.course-buy-icon`（`.is-sky`／`-coral`／`-leaf`） | 淡葉綠的 7 天退費提示框；34px 圓形 icon（購買包含的項目）。寫在課程詳情，購買課程沿用同一個 class | `pages/_course.scss` |
| `.btn-check:disabled + .courses-tile`／`.courses-pill` | 分類方塊與粗膠囊的停用樣子（虛線淡墨框、奶油底、淡墨字、不能點）。課程列表目前沒有停用的選項，Guideline 示範 | `pages/_courses.scss` |
| `.gl-main`、`.gl-header`、`.gl-meta`、`.gl-hero-sticker` | Guideline 標題區：左 H1、說明與資訊 chip，右邊斜貼的風格貼紙 | `pages/_guideline.scss` |
| `.gl-map`（`-title`、`-list`、`-link`、`-label`）、`.gl-map-mobile`、`.gl-map-row` | 小徑目錄：≥ 992px sticky（ScrollSpy 加 `.active`）；手機是頂端橫向捲動的站牌列 | `pages/_guideline.scss` |
| `.gl-section`、`.gl-card`、`.gl-block`、`.gl-sub`、`.gl-note`、`.gl-caption`、`.gl-stage`、`.gl-states`、`.gl-state-label`、`.gl-list`、`.gl-rule`（`-icon`）、`.gl-table-wrap`、`.gl-table` | 章節骨架：章節貼紙卡、虛線分隔的小節、奶油底示範舞台、狀態標籤、規則提示框、表格（至少 34rem，手機在 `.table-responsive` 裡橫向捲動） | `pages/_guideline.scss` |
| `.gl-spec`、`.gl-quote`、`.gl-principles`、`.gl-principle-icon`、`.gl-pages`、`.gl-page`（`.is-current`）、`.gl-page-name`、`.gl-page-desc` | 概覽：風格規格、四個原則、10 頁清單（整格用 `.stretched-link` 可點，hover 淡向日葵＋頁名底線） | `pages/_guideline.scss` |
| `.gl-swatches`、`.gl-swatch`（`-chip`、`-name`、`-code`、`-use`、`-ratio`）、`.gl-c-*` | 色票：色塊由 `$gl-colors` 從變數產生；hex、用途與對比度是 HTML 文字 | `pages/_guideline.scss` |
| `.gl-fonts`、`.gl-font`（`-sample`、`-weights`、`-num`）、`.gl-type-row`、`.gl-type-meta`、`.gl-space-row`、`.gl-space-bar`（`--w`）、`.gl-shapes`、`.gl-shape`（`.r-*`、`.sh-*`、`.is-focus`、`.is-focus-dark`）、`.gl-focus-dark-stage` | 字級、間距、圓角陰影與焦點環的示範 | `pages/_guideline.scss` |
| `.gl-orbs`、`.gl-trail-demo`、`.gl-stop-title`、`.gl-stones`、`.gl-medals`、`.gl-medal-stage`、`.gl-medal-frames`、`.gl-medal-frame`（`.is-1`～`3`）、`.gl-stickers`、`.gl-receipt`、`.gl-wave`、`.gl-dots` | 招牌元素示範：播放鈕尺寸與狀態、站牌與小石頭、勳章尺寸與動畫示範區、貼紙語彙 | `pages/_guideline.scss` |
| `.gl-hover`、`.gl-focus`、`.gl-press`、`.gl-focus-within` | 把 hover、鍵盤焦點、按下固定畫出來，只在 Guideline。對應 `.btn`、`.btn-text`、`.round-btn`、`.play-orb`、`.player-btn`、`.nav-pills-bold .nav-link`、`.segmented .btn`、`.courses-tile`、`.courses-pill`、`.page-link`、`.trail-unit`、`.course-card`、`.craft-porthole` 與表單欄位；改了元件的 hover 要一起改 | `pages/_guideline.scss` |
| `.gl-buttons-row`、`.gl-player-strip`、`.gl-pills`、`.gl-tiles`、`.gl-chips`、`.gl-chip-group`、`.gl-sidebar-demo`、`.gl-learn-player` | 元件示範的排列容器（播放器控制鈕放在墨色色條上，焦點環一樣是向日葵） | `pages/_guideline.scss` |
| `.gl-instructor`（`.is-draft`、`.is-off`；`-name`、`-meta`、`-msg`） | 講師課程狀態卡：草稿（虛線、無陰影）、已上架、已下架（奶油底），只在 Guideline | `pages/_guideline.scss` |
| `.gl-notion`（`.is-wide`）、`-head`、`-title`、`-copy`、`-where`、`-sample` | Notion 狀態文案一則一列：說明在左、元件畫面在右（`.is-wide` 改上下排） | `pages/_guideline.scss` |
| `.gl-rwd-list`、`.gl-rwd-name`、`.gl-rwd-tag`（`.is-lg`） | 每頁的 RWD 版型變化 | `pages/_guideline.scss` |
| `.gl-dodont`、`.gl-dodont-title`、`.gl-do`、`.gl-dont`、`.gl-verdict`、`.gl-bad-*`、`.gl-good-title`、`.gl-eyebrow-bad`、`.gl-tilt-form`、`.gl-tilt-form-ok` | Do／Don't 對照；錯誤示範都是 `aria-hidden`、不能聚焦的靜態畫面 | `pages/_guideline.scss` |

補頁時要注意：

- **`$primary` 是深天空藍 `#1F6FA8`**（連結、進度條、勾選框、焦點環、Bootstrap 元件選中狀態），但 `.btn-primary` 被改成珊瑚底墨字。`.text-primary`、`.bg-primary` 是深天空藍；白底按鈕用 `.btn-secondary`。
- **焦點環**：Bootstrap 的 `.nav-link`、`.accordion-button`、`.page-link` 在 `:focus` 寫了 `outline: 0`，`_base.scss` 已經補回 `:focus-visible` 外框（手風琴畫在內側）。`.btn-close` 改成 `box-sizing: border-box`，在對話框與抽屜標題列裡也維持 44px。
- **深色播放器上的焦點環**改成向日葵（深天空藍對墨色只有 2.7），已寫在 `.player` 裡；新的深色底元件比照辦理。
- **勳章**整枚 `aria-hidden`，意思靠旁邊的文字說明；SVG 標記照 `components/_medal.scss` 開頭的註解原樣複製。動畫只動 `transform` 與 `opacity`，盒子尺寸固定。
- **動畫**：`prefers-reduced-motion: reduce` 時 `_base.scss` 統一關掉所有 transition 與 animation（勳章直接顯示最終狀態、按鈕按下不位移）。新動畫不需要另寫關閉規則，但一定要確定「動畫關掉後的最終畫面」是對的。
- **鋸齒邊收據**已經是共用的 `.receipt`（付款結果、購買紀錄）。**甜甜圈進度、選關卡方塊、付款大選項卡、課程票**目前只有一頁用，寫在各頁的 partial（加頁面前綴）；之後第二頁要用時，先搬到 `components/` 並在這張表補一列，不要寫兩份。Guideline 示範這些元件時直接套用各頁的 class（同一份 `style.css`），不算第二頁。

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 底色 | 奶油 `$cream #FFFBEF`（頁面底）、白 `$white`（卡片、輸入框） |
| 淡色區塊 | 淡向日葵 `$sun-soft #FFF3C4`、淡天空 `$sky-soft #D9EEFC`（頁尾、進度軌道）、淡珊瑚 `$coral-soft #FFE3D8`（這個底上一律墨字）、淡葉綠 `$leaf-soft #E6F6E7`（成功）、淡番茄 `$tomato-soft #FFF0EA`（錯誤） |
| 墨 | 墨 `$ink #2D2440`（文字、所有外框、硬陰影，白底 14.60）、次墨 `$ink-2 #5E5470`（meta、說明，7.05）、`$placeholder #6E6580`（5.47） |
| 亮色（只當填色、上面放墨字） | 向日葵 `$sunflower #FFC93C`（頁首、勳章，9.51）、天空 `$sky #7CC6F2`（7.80）、珊瑚 `$coral #FF8A65`（主要按鈕，6.31；**白字 2.31 禁止**）、葉綠 `$leaf #8FD694`（已完成，8.49）；珊瑚 hover `$coral-hover #FFA285`（本風格新增） |
| 可當文字的深色 | 深天空 `$sky-deep #1F6FA8`（連結、進度、焦點，白底 5.39）、珊瑚深 `$coral-deep #B9431F`（價格，5.40）、葉綠深 `$leaf-deep #1E7041`（成功，6.09）、番茄 `$tomato #C0392B`（錯誤，5.44）、琥珀深 `$amber-deep #8A5A00`（警示、退費處理中，5.93） |
| 字體 | Chiron GoRound TC（圓體）500／700／800／900：所有中文；Baloo 2 600／800：品牌字、價格、百分比、時間碼（tnum） |
| 圓角 | 卡片 28、輸入框 20、圖片 20、對話框 28；按鈕與 chip 膠囊；播放鈕、站牌、頭像、徽章圓形；首頁主圖拱門 |
| 外框 | 2px 墨色，所有卡片、按鈕、輸入框、chip |
| 陰影 | 只有硬陰影：卡片 `4px 4px 0 $ink`、按鈕 `3px 3px 0 $ink`、對話框 `6px 6px 0 $ink`；沒有模糊陰影 |
| 焦點 | 3px 深天空外框、間隔 3px；播放器上改向日葵 |
| 頁首 | 高 76（`$site-header-height`）＋波浪 12；sticky 位移 104（`$sticky-top-offset`、`--sticky-top`） |
| 動態 | 只有勳章 pop（700ms、`$ease-pop`）＋光澤＋小星星各一次、播放器載入中的虛線圈、按鈕按下位移與 hover 換色；正在播放的三根小直條是靜態；`prefers-reduced-motion` 時全部關閉 |

完整規範請看 `guideline.html`。

### 換色時同步檢查

色票的唯一來源是 `scss/_variables.scss`，但下面幾處把數值寫成文字或寫死，改色（或改頁首高度）時要一起檢查（格式同上一層 [`../README.md`](../README.md) 的「換色時同步檢查」）：

- [ ] `scss/_variables.scss`：色票、`$primary` 等主題色與語意變數（`$body-*`、`$input-*`、`$focus-ring-*`、`$focus-outline`、`$modal-backdrop-bg`…），以及變數旁註解裡的對比度。`scss/components/_player.scss` 另有寫死的機身亮一階 `$tv-soft #43395A` 與畫面底色 `#000`。
- [ ] `guideline.html`：〈色彩〉色票的 hex、用途與對比度，〈語意色〉〈影音專用〉〈Bootstrap 變數對照〉三張表，〈元件狀態規範〉按鈕旁的「珊瑚底一律墨字」（6.31、2.31、`#FFA285` 7.48），〈動態與 hover〉表格裡的 `#FFA285`、`#43395A`，〈Do／Don't〉寫出來的比值（2.31、1.54、1.48）。色塊本身由 `scss/pages/_guideline.scss` 的 `$gl-colors` 從變數產生，不用手改。
- [ ] 本檔：「Design token 摘要」的 hex 與對比度，以及「卡片」一節的 2.31。
- [ ] 改了頁首高度（76＋波浪 12）時：`$site-header-height`、`$site-header-wave` 會帶動 `$sticky-top-offset`（104；`--sticky-top` 與 `html` 的 `scroll-padding-top` 都用它：購買卡、學習頁側欄、購買課程右欄、Guideline 小徑目錄），但 `guideline.html` ScrollSpy 的 `data-bs-root-margin="-104px …"` 與 Guideline〈間距〉表格裡的頁首高度、sticky 位移是文字，要手動改。
- [ ] `scripts/generate-images.mjs` 的 `STYLE`：整組圖片的色調（向日葵黃、天空藍、珊瑚橘的晴朗早晨），換色後重新生圖。
- [ ] `templates/page.html` 與每一頁的 `<meta name="theme-color" content="#FFC93C">`、頁首品牌太陽 SVG（白、墨、向日葵三色），以及 `images/favicon.svg` 裡的色碼。

## 圖片

`images/` 的 23 張圖片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名、比例與主體照主題層的 [`../IMAGES.md`](../IMAGES.md)。調性是「晴朗的早晨」：柔和的陽光、向日葵黃、天空藍、珊瑚橘的桌面、切割墊與牆面，場景乾淨、成人的手；講師林子謙的頭像、工作室照與作品是同一人、同一套天空藍襯衫與珊瑚圍裙。替換時保持相同檔名即可，不需改程式。

和 IMAGES.md 的一處差異：首頁 `#crafts` 把 `craft-*.jpg` 裁成圓形舷窗、文字放在圖片下方，所以這 4 張的 prompt 要求**主體置中**，而不是 IMAGES.md 說的「下方三分之一留白」。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`（codex 只產 3:2、2:3、1:1，腳本會用 `sips` 從中央裁切並縮放成 IMAGES.md 的輸出尺寸；原始檔放在系統暫存資料夾的 `craftory-kids-raw-images/`）：

```bash
npm run images                                          # 產生缺少的圖片
node scripts/generate-images.mjs --only hero,craft-bowl # 只重做指定的圖
node scripts/generate-images.mjs --force                # 全部重做
CONC=1 node scripts/generate-images.mjs                 # 並行數（預設 2）
```
