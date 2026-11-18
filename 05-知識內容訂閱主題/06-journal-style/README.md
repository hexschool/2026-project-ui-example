# 06｜手帳筆記插畫：現場筆記 FieldNotes

> 淺色系 ＋ 暖色調（淺奶油、柔和珊瑚橘、抹茶綠）。編輯器工具列帶有手繪風標籤，訂閱方案按鈕圓潤可愛，營造輕負擔氛圍。

| # | 風格 | 色系 | 重點 |
|---|---|---|---|
| 06 | 手帳筆記插畫 | 淺色系 ＋ 暖色調（淺奶油、柔和珊瑚橘、抹茶綠） | 編輯器工具列帶有手繪風標籤，訂閱方案按鈕圓潤可愛，營造輕負擔氛圍。 |

概念是**一本隨身手帳**：桌面色的頁面上放著一張淺奶油色的點格紙，用珊瑚橘螢光筆畫重點、用抹茶綠紙膠帶貼住剪下來的文章，讀起來沒有負擔。

- **實物外皮**：紙張、便利貼、紙膠帶、拍立得、圓形貼紙、票券、對話泡泡、橫線紙。這些都是 CSS 或 inline SVG 畫的，照片仍然是照片。
- **插畫的落實方式是手繪向量塗鴉**（螢光筆畫線、波浪底線、手繪圈、箭頭、星星、圓章），全部 `aria-hidden`、不取代文案。依主題層 `IMAGES.md`，不加 Hero 大圖、主題插圖或空狀態插畫，所以不生成插畫圖片。
- **資料區一律端正**：只有裝飾性的容器可以傾斜。表單、表格、長文、文章卡、方案卡、按鈕不傾斜，也不加塗鴉。每頁塗鴉控制在 3 到 5 個。
- **字是藍黑墨水**：珊瑚與抹茶只當填色，上面放 `$pen` 藍黑字。需要珊瑚色的字用 `$coral-ink`，需要綠色的字用 `$success`。這是和 04 溫暖心靈慢讀（米色底、棕色字）拉開的關鍵，畫面不要往「米色底＋棕字＋圓角卡」走。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。單一淺色主題，不跟著作業系統切換深色模式。
- **JS**：互動交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js`（設計稿切換器、閱讀進度、字級、月／年切換、作者文章篩選，加上幾個選用的小互動）。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西（字體由 Google Fonts 載入，需要網路）。

**要修改樣式**：

```bash
npm install        # 安裝 bootstrap、bootstrap-icons、sass，並把 Bootstrap JS 與圖示字型複製進專案
npm run watch      # 開發時：監看 scss/，存檔就重新編譯 css/style.css
npm run css        # 編譯一次
npm run build      # 交付前：重新複製 vendor 檔案＋編譯一次 CSS
npm run check      # 檢查各頁的 head、頁首、頁尾是否與範本一致
npm run vendor     # 只重新複製 Bootstrap JS 與圖示字型（npm install 時會自動執行）
npm run images     # 重新生成圖片（需要已登入的 codex CLI，換圖時才用）
```

## 頁面

| 頁面 | 檔案 | 樣式 | 狀態 |
|---|---|---|---|
| 設計 Guideline | `guideline.html` | `scss/pages/_guideline.scss` | 完成 |
| 首頁 | `index.html` | `scss/pages/_home.scss` | 完成 |
| 文章列表 | `articles.html` | `scss/pages/_articles.scss` | 完成 |
| 文章內頁（以〈一間餐廳的成本結構〉示範，含付費預覽牆） | `article.html` | `scss/pages/_article.scss` | 完成 |
| 訂閱方案（方案卡、比較矩陣、結帳確認、FAQ） | `pricing.html` | `scss/pages/_pricing.scss` | 完成 |
| 個人頁面「我的現場筆記」（讀者／作者／管理員） | `account.html` | `scss/pages/_account.scss` | 完成 |
| 登入 | `login.html` | `scss/pages/_auth.scss` | 完成 |
| 免費註冊 | `register.html` | `scss/pages/_auth.scss` | 完成 |
| 作者個人頁（以陳柏諺示範） | `author.html` | `scss/pages/_author.scss` | 完成 |
| 忘記密碼 | `forgot-password.html` | `scss/pages/_auth.scss` | 完成 |

頁面上沒有列出所有頁面的導覽：從首頁依讀者流程點進各頁即可，Guideline 直接開 `guideline.html`。所有文章卡都連到 `article.html`（只做一篇文章頁）。首頁「申請成為作者」連到 `account.html?role=reader#apply`。

兩個頁面有「設計稿切換器」（虛線框＋斜線底紋，和產品介面區隔），切換時網址會同步：

```
article.html                    ← 未訂閱（免費段結尾是付費牆）
article.html?view=subscribed    ← 已訂閱
account.html                    ← 讀者
account.html?role=author        ← 作者
account.html?role=admin         ← 管理員
```

## 排版語言

這一節是 6 套風格裡 06 和其他套拉開差距的地方，後續頁面請照這裡的構圖原則做，不要只換顏色。

### 網格與版心：桌面上的一張手帳紙

- `<main>` 裡的內容一律放在 `.container > .sheet` 上。`.sheet` 是一張淺奶油色點格紙（1.2px 圓點、間距 22px）、28px 圓角（< 768 為 20px）、紙張陰影，內距 56px（≥ 992）／24px（以下）。
- 紙張寬度由 container 決定：≥ 1200 為 1200px、≥ 1400 為 1240px，兩側露出桌面色 `$desk`。< 768 紙張滿寬、左右留 12px 桌面邊。
- `.sheet` 用 `overflow-x: clip`（不是 `hidden`，否則裡面的 sticky 會失效）收住超出紙張的紙膠帶、貼紙。`overflow-clip-margin: .5rem`，所以便利貼最多可以超出紙緣 8px（文章內頁的目錄便利貼會用到）。
- 紙張內用 Bootstrap 12 欄，卡片間距 24px。區塊上下 72px（< 992 為 52px），由 `.section` 控制。
- **長文、表單、表格底下不放點格紋**：用 `.sheet-plain`（純 `$sheet`）或白底元件蓋掉，避免干擾閱讀。
- 拼貼錯落用 `margin-top` 位移（例如首頁主題卡中間欄下移 32px），不用 `transform`，不影響閱讀順序。
- sticky 元素一律 `top: $sticky-top-offset`（100px＝頁首 12＋64＋24 呼吸），`html` 已設 `scroll-padding-top: 100px`。

### 頁首：浮起的膠囊列

- `.site-header` 是 `position: sticky; top: 12px`，外層透明。內層 `.site-capsule` 是 64px 高、`$sheet` 底、999px 圓角、陰影，內側 5px 處一圈虛線縫線（`::before`）。
- 品牌靠左（手繪小筆記本 SVG＋「現場筆記」Huninn＋「FieldNotes」Fredoka），主導覽**絕對置中**，搜尋圓鈕與會員膠囊（`$matcha-tint` 底）靠右。
- 目前頁是**一筆手繪珊瑚螢光筆**（SVG 背景，`background-size` 固定，不改尺寸）；hover 是淡一階的螢光筆。
- < 992：膠囊只留品牌＋三個 44px 圓鈕（搜尋、會員頭像、選單）；選單展開成膠囊正下方的一張圓角紙卡。搜尋列展開在膠囊正下方，是一張圓角紙條。
- 目前頁標示規則寫在 `templates/page.html` 開頭的註解：首頁、文章列表、訂閱方案加 `active`＋`aria-current="page"`；文章內頁與作者頁標「文章列表」只加 `active`；個人頁面標手機選單的「我的現場筆記」（`active`＋`aria-current`）與桌機的 `.site-member.is-active`（＋`aria-current`）；Guideline、登入、註冊、忘記密碼不標示。

### 頁尾：封底

- 桌面色區塊上方一條手繪波浪邊 → 容器內一張 `$matcha-tint` 圓角紙（28px）。左邊品牌＋品牌說明寫在一張黃便利貼上（不傾斜）；右邊 3 欄連結（讀者、作者、平台），欄名 Huninn＋手繪珊瑚底線，連結前是手繪小圓點。版權列在紙的下緣，上方一條抹茶虛線。

### 卡片造型（實物外皮）

| 外皮 | 類別 | 用在 |
|---|---|---|
| 紙卡 | `.note-card`（`.is-white`） | 主題卡、保障卡、表單索引卡、方案卡底 |
| 便利貼 | `.sticky-note.is-butter／.is-coral／.is-matcha／.is-blue` | 引文、為什麼值得訂、篩選、目錄、洞察、設計稿示意 |
| 紙膠帶 | `.tape.tape-coral／.tape-matcha／.tape-butter` | 壓在卡片上緣中央（父層要 `position: relative`） |
| 拍立得 | `.polaroid`（`--ratio`、`.is-square`） | 文章封面、作者牆、作者頁頭像 |
| 圓形貼紙 | `.sticker.is-*`（`--sticker-size`） | 數字、圖示、「★ 最多人選」、勾選 |
| 票券 | `.ticket-wrap > .ticket（.is-coral／.is-white）> .ticket-stub` | CTA、付費牆 RadioCard、付款方式 |
| 對話泡泡 | `.speech`（`.is-coral`、`.is-butter`） | 讀者評價、留言 |
| 橫線紙 | `.ruled`（`--rule`） | 首頁精選右頁、編輯器寫作區 |
| 吊牌標籤 | `.tag` | 全站 `#標籤` |
| 手繪框 | `.hand-frame` | 編輯器的吊牌工具 |

便利貼、拍立得、票券的陰影是 `filter: drop-shadow`（跟著摺角與缺口），其他紙卡用 `$box-shadow`。

### 標題階層

- **H1**：Huninn 400＋**珊瑚螢光筆畫線** `.hl`，只畫在最重要的那半句，不畫整句。首頁 hero、作者頁、登入頁的大標置中或放大（首頁用 `.display-2`，表單頁用 `.display-1`）；其他頁 H1 靠左。
- **H2**：Huninn 400＋`.title-wave`（下方一條 64px 的抹茶手繪波浪底線；置中標題用 `.text-center` 版）。
- **H3**：Huninn 400，沒有裝飾。
- Huninn 只有 400 一個字重：標題不加粗，強調用螢光筆或顏色。

### 招牌元素

1. **手繪風標籤的編輯器工具列** `.doodle-toolbar`（主角在 `account.html#editor`，另在 Guideline）：浮動膠囊，每個工具是手繪框小吊牌（圖示在上、文字在下），保留 `aria-label`。免費預覽分隔線是一條橫跨紙面的珊瑚紙膠帶。
2. **圓潤可愛的胖按鈕** `.btn-plump`：56px 高、膠囊、底部一道「厚度」陰影，`:active` 往下壓 3px（transform）。用在方案卡、付費牆主按鈕、確認付款、首頁 CTA。計費切換是 72px 膠囊軌道＋珊瑚圓鈕的滑動開關 `.billing-switch`，底層仍是兩個 `.btn-check` radio。
3. **輕負擔**：大量留白、便利貼、柔和陰影，沒有警告式的紅色大塊；取消、退費、到期等資訊照樣寫在看得到的地方。

### 各頁構圖原則

和其他 5 套的差別都在構圖，不只是顏色。下面是每頁要守住的結構（細節見方向說明 §4.6）。

- **index.html（完成）**：置中的手帳扉頁（H1 兩行置中、第二行螢光筆 → 副標 → 兩顆胖按鈕 → 3 枚傾斜的數字貼紙 → 傾斜的黃便利貼引文）→ 為什麼值得訂（4 張四色便利貼，≥ 1200 一排四張，768 到 1199 兩欄，手機單欄不傾斜）→ 主題分類（3 × 2 紙卡，≥ 992 中間欄下移 32px）→ 本週精選（**攤開的手帳**：左頁主推拍立得、右頁橫線紙寫 3 篇；< 992 變成上下兩頁）→ 作者群（拍立得作者牆＋對話泡泡｜白紙卡＋手繪圓章的 3 項保障）→ 兩張票券 CTA。
- **articles.html（完成）**：版頭（麵包屑、H1 螢光筆畫在「現場筆記」、說明、56px 白底膠囊搜尋）→ 3 : 9。左側是**一疊 4 張便利貼**當篩選（不傾斜；視窗高到放得下整疊才 sticky）；右側是**兩欄拍立得文章卡**（≥ 1200；992 到 1199 單欄），縮圖在上。手機用 Offcanvas（bottom）放 4 張便利貼。
- **article.html（完成）**：整張紙是純紙色（不放點格紋）→ 兩欄（長文 680＋左側珊瑚筆記本邊線｜間距 64｜右欄 280）。右欄 sticky 是 3 張**貼在頁緣的便利貼**（目錄、閱讀進度、字級），可以超出紙緣 8px。付費牆是「封口的信」：白色紙卡＋上緣中央一段珊瑚紙膠帶當封條。992 到 1199 右欄隱藏，目錄變成標題區下方可展開的便利貼。文末依序是作者名片、本篇標籤、3 張延伸閱讀小便利貼、對話泡泡留言。手機底部是一條浮起的膠囊行動列（離底 12px）。
- **pricing.html（完成）**：版頭兩欄（左 7 欄黃便利貼寫 H1｜右 5 欄滑動開關＋手繪箭頭指向省錢提示泡泡）→ 3 張**活頁紙方案卡**（頂端一排 7 個活頁孔）→ 方格紙比較矩陣 → 結帳 7 : 5（表單紙卡＋4 張圓角票券付款方式｜下緣鋸齒的**收據**，≥ 992 sticky）→ FAQ 單欄置中，每題一張圓角紙卡。
- **account.html（完成）**：版頭 → **上方一排便利貼索引板**（個人白紙卡｜閱讀黃、創作珊瑚、平台管理抹茶、帳號藍、讀者另有虛線框申請便利貼；不 sticky，看不到的群組整張不渲染；目前位置由 ScrollSpy 畫珊瑚螢光筆）→ 下方全寬內容：「月計畫頁」訂閱卡（黃色方格頁上手繪珊瑚圈圈住到期日）→ 收藏紙卡 → 追蹤作者空狀態便利貼 → 索引卡數據＋方格紙表格 → 撰寫新文章（≥ 1400 為 8 : 4）的寫作區是**橫線筆記紙**＋手繪標籤工具列＋珊瑚紙膠帶分隔線，設定是一疊便利貼 → 漏斗 4 條藍黑圓頭橫條＋黃便利貼洞察 → 平台管理、成為作者（申請狀態 3 張便利貼）、帳號設定。< 992 個人便利貼縮成一列，群組收進「目前位置」膠囊按鈕（Collapse），展開後是同樣的便利貼。
- **login.html／register.html／forgot-password.html（完成）**：不放麵包屑，大字 H1（`.display-1` 64px，螢光筆）＋說明靠左在上（登入頁說明右邊一支珊瑚手繪箭頭往下彎進表單）→ ≥ 1200 是 6 欄｜空 1 欄｜5 欄：左邊**橫線索引卡**表單（白紙卡、上緣兩段紙膠帶、只有上緣裝飾帶是淡藍橫線＋珊瑚抬頭線，底部點線撕線下面是切換連結）｜右邊設計稿狀態示意（虛線框）。註冊頁右欄是免費會員權益卡（紙色底＋點格色細框，沒有膠帶與陰影，層級低於表單），欄位錯誤示意排在表單下方、和表單同寬。忘記密碼的 3 張示意照發生順序由上而下，用手繪小箭頭串起來，表單卡 sticky，右邊一支抹茶手繪箭頭從表單指向第一張示意。992 到 1199：註冊頁 7 : 5；登入與忘記密碼改成上下排（索引卡最寬 544）。手機單欄：H1 → 索引卡 →（權益）→ 示意。
- **author.html（完成）**：麵包屑靠左 → **置中的扉頁**（最寬 640：96px 拍立得頭像傾斜 -2° 加紙膠帶、H1 44px 螢光筆、抹茶圓形貼紙「認證作者」傾斜 -8°、職稱、簡介、追蹤胖膠囊）→ 手繪波浪分隔 → 880 單欄：標題列 → 一張純紙色的**活頁**（≥ 768 左側珊瑚筆記本邊線、右上一段紙膠帶）寫 6 篇，不放縮圖，篇與篇之間手繪波浪虛線 → 圓形分頁泡泡 → 空狀態示意（藍便利貼）。< 768 拍立得 64px 與姓名、貼紙、職稱橫排靠左，簡介與追蹤在下方。
- **guideline.html（完成）**：版頭（麵包屑、H1 螢光筆、說明｜藍便利貼的版本資訊）→ 3 : 9。左 3 欄 sticky 的**手帳側邊索引**（00 概覽＋12 節，四色輪替的小索引標，目前節由 ScrollSpy 畫珊瑚螢光筆，比視窗高時在索引內捲動）｜右 9 欄是一張純紙色的規範頁（蓋掉點格紋）。每節標題左邊一枚傾斜的編號貼紙、下面一張便利貼寫「這一節的原則」；節與節之間是手繪波浪虛線。色票是一排「顏料試色」圓形貼紙（不規則圓＋白描邊、奇偶交錯微微傾斜），旁邊寫 hex、用途與對比等級。示範都用頁面真的在用的 class，hover／focus 用 `.gl-is-hover`、`.gl-is-focus` 靜態畫出來；付費牆未訂閱／已訂閱在 ≥ 1400 左右並排；Do／Don't 是上緣抹茶實線（Do）與覆盆子虛線（Don't）的兩張紙卡，≥ 768 並排。< 992 索引改成標題下方貼齊紙緣的橫向捲動標籤列。

### 動態

- 只有：H1 螢光筆「畫上去」（`background-size` 0% 到 100%，600ms，只跑一次）、胖按鈕 `:active` 下壓、計費旋鈕滑動、紙卡與便利貼 hover 換底色且紙膠帶變深（120ms）、編輯器空行的游標閃爍。
- 不做：hover 上移、hover 旋轉、搖晃、彈跳。**hover 不改尺寸、不展開隱藏內容**，資訊常駐顯示。傾斜是固定值，不隨 hover 改變。
- `prefers-reduced-motion: reduce`：螢光筆直接完整顯示、拿掉按鈕下壓與旋鈕滑動動畫、所有 transition 與平滑捲動關閉（`_base.scss` 的「減少動態」段落）。

## 檔案結構

```
06-journal-style/
├─ *.html                    ← 10 個頁面，每頁完整包含頁首與頁尾
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製（開頭註解寫了目前頁標示規則）
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）＋ Huninn 字形修正用的子集字型
├─ js/
│  ├─ main.js                ← 設計稿切換器、閱讀進度、字級、月／年切換、文章篩選
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 作者頭像、文章封面、內文配圖（AI 生成）、favicon.svg
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫
│  ├─ _base.scss             ← 全站基礎與共用小工具（螢光筆、波浪底線、按鈕、吊牌標籤、表格、提示框…）
│  ├─ components/            ← 紙張外皮、頁首、頁尾、切換器、徽章、頭像、進度、文章卡、長文、付費牆、方案、訂閱狀態、編輯器、數據
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾是否與範本一致
   └─ generate-images.mjs    ← 生圖腳本（所有圖片的 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾每頁一份**：先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check`。`check-layout.mjs` 比對時會忽略目前頁標示（`.nav-link.active`、`.site-member.is-active` 與 `aria-current`）。
- **新增頁面**：複製範本成新頁，改 `<title>`、description 與目前頁標示，內容放在 `<main>` 裡的 `.container > .sheet`。partial 已經在 `scss/pages/` 並且 `@import` 了。
- **假資料直接寫在 HTML**：文案全部取自主題層的 `CONTENT.md`（Notion 原文）。跨頁要一致的數字：付費 438 篇／免費 127 篇／作者 142 位；月費 NT$ 180、年費 NT$ 1,800（省 NT$ 360）；〈一間餐廳的成本結構〉約 6,800 字、免費預覽前 2,200 字、已免費讀完 32%；到期日 2027/10/02、剩餘 364 天。
- **設計稿狀態**：`<body data-view="unsubscribed|subscribed">`、`<body data-role="reader|author|admin">`；元素用 `data-show-view`、`data-show-role` 標記，CSS（`components/_switcher.scss`）依 body 屬性隱藏。沒有 JS 時停在預設狀態。
- **JS 的掛勾**（`js/main.js`，selector 要和 HTML 一致）：切換器 `[data-set-view]`、`[data-set-role]`；閱讀進度 `[data-reading-progress]`、`#article-body[data-free-ratio]`、`[data-progress-card]`、`[data-progress-card-text]`；字級 `[data-font-size]` radio＋`[data-prose]`（`.is-size-sm／-md／-lg`）；月／年 `[data-billing]` radio、`[data-billing-hint]`（加 `.is-visible`，提示要預留高度、用 `visibility` 切換）、`[data-plan-cta]`（強調的那顆 `.btn-primary`、另一顆 `.btn-paper`，JS 會交換）；作者文章篩選 `[data-filter-list]`、`[data-filter]`、`[data-status]`；搜尋列展開後聚焦 `#siteSearch`；選用 `[data-toggle-pressed]`、`[data-reading-mode]`、`[data-pay]`／`[data-pay-status]`。
- **換行與空白**：標題、短說明用 `.text-phrase`（`word-break: keep-all`）＋`<wbr>` 標出詞組斷點；數字與單位之間用 `&nbsp;`。資訊列（文章卡的職稱與「字數 ‧ 閱讀時間 ‧ 發布於」、精簡卡與收藏卡署名、審核與下架列、內頁作者列與側欄字數）也是 `keep-all`：短項包 `.text-nowrap`，分隔符號「‧」「｜」跟前一項包在一起或用 `&nbsp;` 黏住，所以不會斷在「年資」「發布於」中間，也不會有落單的分隔符號。
- **表單**：Email、密碼、卡號欄位不加 `name`；每個欄位都要有 `id`、`<label for>` 與 `autocomplete`。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、字體、長文、間距、圓角、陰影、元件）
3. `bootstrap/scss/bootstrap`
4. `bootstrap-icons`（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字體與字形修正、數字、螢光筆、波浪底線、區塊節奏、按鈕、分段控制、吊牌標籤、表單、分頁籤、焦點、減少動態、提示框、表格、設計稿示意、空狀態、資訊列
6. `components/*`：紙張外皮（`_paper`）、頁首、頁尾、切換器、徽章、頭像、閱讀進度、文章卡、長文、付費牆、方案、訂閱狀態、編輯器、數據
7. `pages/*`：各頁專屬樣式，class 一律加頁面前綴（首頁 `.home-*`、`.topic-*`、`.spread-*`、`.author-wall`）

原則是**先用 Bootstrap 的變數與工具類別**，真的做不到才寫自訂 CSS，而且自訂 CSS 只引用變數，不寫死色碼。手繪 SVG 背景用 Sass 變數組字串、再用 Bootstrap 的 `escape-svg()` 輸出，所以 SVG 裡的顏色也跟著 token 走（例如 `$marker-stroke`、`$wave-line`、`$hand-circle`、`$tab-scribble`）。

### 共用類別

下面這些類別跨頁共用，新頁面直接套用，不要在 `pages/*` 另寫一份。

| 類別 | 用途 | 位置 |
|---|---|---|
| `.sheet`、`.sheet-plain` | 桌面上的點格紙（每頁 `<main>` 的內容都放在上面）；長文、表單、表格底下的純紙色區塊 | `components/_paper.scss` |
| `.note-card`、`.sticky-note`、`.tape`、`.polaroid`、`.sticker`、`.ticket-wrap`／`.ticket`／`.ticket-stub`、`.speech`、`.ruled`、`.hand-frame` | 實物外皮（見上方「卡片造型」表） | `components/_paper.scss` |
| `.doodle`（`.doodle-coral`／`-matcha`／`-pen`） | inline SVG 手繪塗鴉（絕對定位、`aria-hidden`、`pointer-events: none`） | `components/_paper.scss` |
| `.hl`、`.hl-matcha` | 手繪螢光筆畫線（H1 重點半句；載入時畫上去，`box-decoration-break: clone`） | `_base.scss` |
| `.title-wave`、`.hr-wave` | H2 下方的抹茶波浪底線；手繪波浪虛線分隔 | `_base.scss` |
| `.section`、`.section-heading`（`.text-center`） | 區塊上下留白 72／52px；標題列（左 H2＋副標、右動作） | `_base.scss` |
| `.page-header`、`.page-lead` | 首頁以外各頁的頁首：麵包屑 → H1 → 說明 | `_base.scss` |
| `.btn-primary`／`.btn-matcha`／`.btn-paper`／`.btn-text`、`.btn-plump`、`.btn-round` | 按鈕層級：主要（珊瑚底藍黑字，hover 變淺）、抹茶、次要（紙底藍黑框）、文字連結；胖按鈕（56px＋厚度、`:active` 下壓）；圓鈕 | `_base.scss` |
| `.follow-btn`（搭配 `data-toggle-pressed`） | 追蹤作者按鈕：固定最小寬度，「追蹤作者」與「已追蹤」兩個狀態一樣寬；已追蹤時抹茶底（文章內頁作者名片、作者個人頁共用） | `_base.scss` |
| `.segmented`（`.segmented-sm`） | 分段控制（`.btn-group`＋`.btn-check`，白色膠囊軌道、選中珊瑚） | `_base.scss` |
| `.tag`（`.is-selected`、`.is-empty`）、`.tag-list` | 行李吊牌 `#標籤`（左端小圓孔）：一般、選中（珊瑚）、0 篇（虛線） | `_base.scss` |
| `.form-check-row`、`.field-error`、`.form-label-optional`、`.form-count` | 表單列與錯誤訊息 | `_base.scss` |
| `.nav-underline`、`.tab-count` | 分頁籤：選中項下方一筆手繪珊瑚底線 | `_base.scss` |
| `.callout`（`.is-ok`／`.is-warn`／`.is-error`／`.is-brand`） | 提示框：圓角淡底＋圓形圖示貼紙＋文字（＋按鈕） | `_base.scss` |
| `.table-scroll`＋`.table-data`、`.table-wide` | 方格紙表格（白底、20px 圓角、細格線 `$dot`、表頭 `$butter`）；放不下時在外框內橫向捲動 | `_base.scss` |
| `.demo-state`（`-tag`、`-title`、`-stage`、`-label`） | 設計稿狀態示意：故意用直角虛線框，和產品外皮區隔 | `_base.scss` |
| `.empty-state` | 空狀態：手繪圈裡的圖示＋一句說明＋一個下一步 | `_base.scss` |
| `.info-list` | 點線引導的資訊列（標籤 ⋯⋯ 值）：訂閱摘要、收據 | `_base.scss` |
| `.figure-num`、`.figure-unit`、`.num-round`、`.num`、`.text-note` | Fredoka 大數字與單位、內文裡的 Fredoka 數字、表格等寬數字、小字 | `_base.scss` |
| `.text-phrase`、`.bleed-x`（mixin `bleed-x`）、`.scroll-x` | 詞組換行；< 992 貼齊紙張邊緣；隱藏捲軸的橫向捲動 | `_base.scss` |
| `.design-switch`、`.role-chip`、`data-show-view`／`data-show-role` | 設計稿切換器與角色標記（虛線框＋斜線底紋） | `components/_switcher.scss` |
| `.badge-access`（`.is-locked`／`.is-free`／`.is-draft`／`.is-removed`） | 權限徽章：訂閱限定＝珊瑚淡底＋`$coral-ink`＋`lock-fill`；免費＝藍淡底＋`$info`＋`unlock` | `components/_badges.scss` |
| `.badge-state`（`.is-ok`／`-warn`／`-error`／`-neutral`／`-progress`／`-ink`、`.badge-state-lg`）、`.meta-line`、`.meta-category` | 狀態徽章；分類與文章資訊列 | `components/_badges.scss` |
| `.avatar`（`-xs` 24／`-sm` 32／`-md` 40／`-lg` 64／`-xl` 96）、`.avatar-initial`（`.is-coral`／`.is-butter`／`.is-blue`）、`.author-line` | 圓形頭像（白描邊）、字首頭像、作者列 | `components/_avatar.scss` |
| `.reading-progress`、`.progress`（`.is-done`／`.is-empty`）、`.progress-labeled` | 閱讀進度條（視窗頂 4px 珊瑚）；鉛筆斜紋進度條 | `components/_progress.scss` |
| `.pager` | 分頁：44px 圓形泡泡、Fredoka 數字，目前頁珊瑚底＋厚度；文章列表在 < 576 收掉第 3 頁，整排留在同一行 | `_base.scss` |
| `.article-card`（`-thumb`、`-body`、`-title`、`-author`、`-job`、`-lede`、`-stats`、`-preview`）、`.article-mini` | 拍立得文章卡（紙卡＋縮圖拍立得＋紙膠帶；< 768 與 ≥ 1200 縮圖在上，768 到 1199 縮圖在左 240px）；精簡文章卡（首頁精選右頁、延伸閱讀） | `components/_article-card.scss` |
| `.prose`（`.is-size-sm／-md／-lg`）、`.prose-table`、`.paywall-teaser`、`.pull-quote`；mixin `pull-quote-type`、`sticky-note-skin` | 長文 680px（h2 珊瑚螢光筆、引言區塊是黃便利貼、圖片是不傾斜的拍立得）；方格紙損益表（外框即捲動容器、合計列珊瑚淡底）；殘句上的 140px 淡出；引言字型；不加 class 也能長成便利貼的外皮 | `components/_prose.scss`、`components/_paper.scss` |
| `.paywall`（`-seal`、`-progress`、`-title`、`-lead`、`-cta`、`-login`、`-foot`）、`.ticket-options`＋`.ticket-option`＞`.btn-check`＋`.ticket-radio`＋`.ticket-radio-check` | 「封口的信」付費牆；票券狀 RadioCard（mask 挖缺口、選中 2px `$coral-ink` 框＋右上勾貼紙） | `components/_paywall.scss` |
| `.save-tag` | 抹茶省錢吊牌（「省下兩個月」「省 NT$ 360」） | `components/_badges.scss` |
| `.speech-up`、`.speech.is-white` | 對話泡泡尾巴朝上（署名在泡泡上方，例如留言）；白色泡泡 | `components/_paper.scss` |
| `.plan-card`（`.is-recommended`、`.is-matcha`、`-name`、`-price`、`-flag`…）、`.check-list`、`.billing-switch`（`-label`、`-track`、`-hit`、`-knob`）、`.compare-table`、`.compare-mark`、`.mark-dot` | 活頁紙方案卡（頂端 7 個活頁孔）；✓／✗ 權益清單；72px 滑動旋鈕開關（底層兩個 radio，軌道左右兩半各是一個 label）；比較矩陣（首欄凍結、月費欄淡珊瑚底、小圓貼紙 ✓／✗） | `components/_plans.scss` |
| `.sub-card`（`-main`、`-date`、`-detail`、`-actions`…）、`.sub-state`、`.cancel-dialog`、`.cancel-dialog-static` | 「月計畫頁」訂閱卡（`$hand-ellipse` 手繪珊瑚圈）；其他訂閱狀態卡；取消確認對話框（兩顆按鈕一樣大） | `components/_subscription.scss` |
| `.editor`（`-head`、`-body`、`-title`、`-lede`、`-selection`、`-actions`、`-settings`…）、`.doodle-toolbar`＋`.doodle-tool`＋`.doodle-tool-sep`、`.preview-tape`、`.editor-plus`、`.editor-insert-menu`＋`.insert-item`（`.is-paywall`）、`.setting-note`、`.tag-removable`、`.caret.is-blinking`、`.publish-check` | 橫線筆記紙編輯器；手繪標籤工具列；珊瑚紙膠帶的免費預覽分隔線；空行＋插入選單（吊牌項目）；設定便利貼；可移除吊牌；閃爍游標；發布前檢查 | `components/_editor.scss` |
| `.stat-card`（`.is-key`、`-label`、`-value`、`-sticker`）、`.chart-card`、`.chart-head`、`.funnel`（`-row`、`-bar`、`-value`、`-rate`） | 索引卡數據（上緣珊瑚線＋淡藍橫線）；圖表紙卡；閱讀漏斗（`--value-num` 比例、藍黑圓頭橫條） | `components/_stats.scss` |

頁面專屬的類別留在 `pages/*`：文章內頁的目錄 `.toc`／`.toc-num`、字級圓鈕 `.size-picker`、工具列 `.tool-chip`／`.tool-round`、作者名片 `.author-card`、留言 `.comment-*`、手機行動列 `.article-actionbar` 在 `pages/_article.scss`；方案頁的 `.billing-panel`／`.billing-hint`、付款票券 `.pay-ticket`、收據 `.receipt-*`、FAQ `.faq-list` 在 `pages/_pricing.scss`；個人頁的索引板 `.index-*`、`.library-card`、`.row-actions`、`.review-card`、`.admin-article`、`.apply-*`、`.settings-card` 在 `pages/_account.scss`；登入、註冊、忘記密碼共用的 `.auth-sheet`、`.auth-head`／`.auth-title`／`.auth-lead`／`.auth-arrow`、橫線索引卡 `.auth-card`（`.is-sticky`）、`.auth-label-row`、`.auth-terms`、`.auth-switch`、免費會員權益 `.auth-plan`、示意 `.auth-demos`（`.is-chain`）／`.auth-demo`（`.is-form`）／`.auth-demo-form`、`.auth-chain-arrow`、`.auth-next-arrow`、`.auth-stage-card` 在 `pages/_auth.scss`；作者個人頁的扉頁 `.author-cover-*`、`.author-verified`、活頁列表 `.author-page`／`.author-entries`／`.author-entry`、`.author-empty` 在 `pages/_author.scss`；Guideline 的版面 `.gl-header-row`、`.gl-meta`、側邊索引 `.gl-index`（`-title`、`-list`、`-link`、`-tab`、`-text`）、`.gl-main`、`.gl-section`（`-head`、`-title`）、`.gl-num`、`.gl-principle`（`-label`）、`.gl-block`（`-title`）、`.gl-demo`（`-label`）、`.gl-note`、`.gl-stack`、`.gl-row`、`.gl-list`，色票 `.gl-swatches`／`.gl-swatch`（`-chip`、`-name`、`-hex`、`-role`、`-ratio`）、`.gl-chip-*`、`.gl-grade`（`.is-aaa`／`.is-aa`／`.is-large`／`.is-deco`），字級 `.gl-font-sample`、`.gl-type-list`／`.gl-type-row`／`.gl-type-spec`／`.gl-type-sample`、`.gl-aa`，間距與造型 `.gl-scale`（`-row`、`-bar`、`-use`）、`.gl-radius-grid`／`.gl-radius-box`、`.gl-shadow-grid`／`.gl-shadow-box`，靜態狀態 `.gl-is-hover`／`.gl-is-focus`、`.gl-state-table`，主題元件 `.gl-paywall-pair`／`.gl-paywall-col`／`.gl-paywall-guest`、`.gl-progress-top`（搭配 `.reading-progress`）、`.gl-roles`／`.gl-role-head`、`.gl-settings-title`、閱讀模式示意 `.gl-mini-page`（`-head`、`-body`、`-text`、`-aside`），圖表 `.gl-dark-card`、`.gl-trapezoid`，Do／Don't `.gl-dodont`、`.gl-do`、`.gl-dont`、`.gl-verdict`、`.gl-dodont-title`／`-demo`／`-why`、`.gl-fade-demo` 與故意做錯的 `.gl-bad-*` 在 `pages/_guideline.scss`。Guideline 要示範時直接沿用這些類別，不要另寫一份。

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 桌面與紙 | 桌面 `$desk #F7EEDC`（頁面底、頁尾區）、手帳紙 `$sheet #FFFBF2`（紙張、紙卡）、白 `$white`（輸入框、拍立得框）、點格 `$dot #E7DCC6`、紙的厚度 `$paper-edge #D8CCB6`（裝飾） |
| 墨水 | 藍黑 `$pen #2F3B52`（對紙 10.88，標題與介面字）、內文 `$pen-body #3E4A60`（8.64）、次要 `$pen-muted #5F6878`（5.44；珊瑚淡底只有 4.58，該處小字盡量用 `$pen`）、控件框線 `$control #8C7F6A`（3.79） |
| 珊瑚（主色） | `$coral #F29C82`（主要按鈕底、貼紙，**不當字**）、hover 變淺 `$coral-light #F6AE97`、胖按鈕厚度 `$coral-press #D9775C`、螢光筆 `$coral-marker #F8C4B2`、淡底 `$coral-tint #FCE3D8`、珊瑚色字 `$coral-ink #A3412A`（6.08） |
| 抹茶 | `$matcha #9BBF8A`（紙膠帶、波浪底線，**不當字**）、`$matcha-deep #6F9A5E`（抹茶按鈕框與厚度、圓章線條）、淡底 `$matcha-tint #E8F0DF` |
| 便利貼 | 黃 `$butter #FFF1C2`、藍 `$blue-tint #E3EEF7`，加上珊瑚淡底、抹茶淡底共四色 |
| 狀態色 | 資訊 `$info #2F5E8C`、成功 `$success #3F6B33`、提醒 `$warning #8A5A00`（淡底 `#FFF3D1`）、錯誤 `$danger #B0264E` 覆盆子紅（淡底 `#FBE3EA`） |
| Bootstrap 對應 | `$primary: $coral`、`$secondary: $matcha`、`$color-contrast-dark: $pen`（按鈕字是藍黑）、`$body-bg: $desk`、`$link-color: $coral-ink`、`$enable-dark-mode: false` |
| 字體 | 標題與引言 Huninn 400（`$font-family-hand`，`font-synthesis: none`）；介面與長文 Chiron GoRound TC 400／500／700；數字 Fredoka 500／600（`$font-family-num`） |
| 字級 | 首頁 H1 56 → 46 → 34（`.display-2`）、表單頁 H1 64 → 52 → 36（`.display-1`）、各頁 H1 40 → 34 → 28、H2 30 → 26、H3 21、介面 16／1.75 |
| 長文 | 最大寬 680px（`$prose-max-width`）；Aa 三段 16／2.0、17／1.95、19／1.9；引言 20／1.8 |
| 間距 | 卡片間距 24px、紙張內距 56／24px、區塊 72／52px；spacer 4＝24、5＝36、6＝52、7＝72、8＝96 |
| 圓角 | 紙張與攤開的手帳 28px、紙卡與便利貼 20px、輸入框 14px、按鈕／標籤／徽章 999px、拍立得 6px、貼紙正圓 |
| 陰影 | 紙張 `$box-shadow`（`0 1px 0` 加 `0 10px 24px`，8% 藍黑）、浮起層 `$box-shadow-lg`、頁首膠囊 `$shadow-capsule`、胖按鈕是 4px 實色厚度 |
| 焦點 | 2px `$coral-ink` 外框＋2px 白隙（傾斜元素的焦點框跟著傾斜） |
| 動態 | 螢光筆畫上去 600ms、hover 換底色 120ms、胖按鈕下壓；`prefers-reduced-motion` 全部關閉 |

完整規範請看 `guideline.html`（00 概覽＋12 節：色彩、字級、長文排版、間距、圓角陰影、元件狀態、內文元素、主題專屬元件、數據圖表、S01–S22 狀態文案、RWD、Do／Don't）。

### 換色時同步檢查

色票的唯一來源是 `_variables.scss`，但下面幾處把數值寫成文字或寫死，改色時要一起檢查：

- [ ] `scss/_variables.scss`：色票（桌面與紙、墨水三階＋`$control`、珊瑚 6 階、抹茶 3 階、便利貼、狀態色與 `$warning-tint`／`$danger-tint`）、`$theme-colors`、語意變數（`$body-*`、`$link-*`、`$input-*`、`$focus-ring-color`、`$focus-ring-double`、`$mark-bg`、`$hr-color`、`$component-active-*`…）、陰影 `$box-shadow`／`$box-shadow-lg`／`$shadow-capsule`。
- [ ] `components/_plans.scss`：比較矩陣月費欄寫死的淡珊瑚底 `#FDF0EA`（`$pen` 在上面 10.08）。
- [ ] 手繪 SVG 字串：`$marker-stroke`、`$wave-line`、`$wave-dash`、`$tab-scribble`、`$hand-circle`（`_base.scss`）、`$hand-ellipse`（`components/_subscription.scss`）都是用變數組出來的，改色後確認顏色仍然對；頁面上的 inline SVG（品牌記號、塗鴉、手繪箭頭）用 class 或 `currentColor` 上色，不要在 SVG 裡寫死 hex。
- [ ] `guideline.html`：色票的 hex、對比度與等級（AAA／AA／大字與圖形／裝飾）、用途文字，權限與狀態徽章的對比表，Bootstrap 主題色與語意變數的對應表；色塊本身的顏色由 `_guideline.scss` 的 `$gl-swatches` 從變數取，不用改。深色底漏斗示範 `.gl-dark-card`（`$pen` 底、`$coral` 橫條 5.27、`$sheet` 字 10.88、`$dot` 次要字 8.27）也要重算。
- [ ] 風格自己的 `README.md`：Design token 摘要。
- [ ] 改了頁首高度（`$site-header-gap` 12px＋`$site-header-height` 64px）時：`$sticky-top-offset`（100px）與 `html` 的 `scroll-padding-top`，以及用到它的 sticky 元素（文章列表的便利貼篩選（另有 `_articles.scss` 的 `$filter-sticky-min-h-*` 視窗高度門檻）、文章內頁右欄便利貼、方案頁收據、編輯器設定便利貼、忘記密碼表單卡、Guideline 側邊索引）和 Guideline「間距與格線」寫的數字。閱讀進度細條固定在視窗最上緣，不受影響。
- [ ] `scripts/generate-images.mjs` 的 `STYLE`：整組圖片的色調，換色後重新生圖。
- [ ] `templates/page.html` 與每一頁的 `theme-color`（目前 `#F7EEDC`，＝`$desk`），以及 `images/favicon.svg` 裡的色碼（`$desk`、`$sheet`、`$pen`、`$coral`、`$coral-press`、`$matcha-deep`）。

### 字體實測與和方向說明不同的地方

- **Huninn 的 3 個非台灣標準字形**：Huninn 把「真」畫成「眞」、「填」畫成「塡」，「突」的下半部畫成「大」。修正方式是在 `_base.scss` 用 `@font-face` 宣告一個 `"Huninn TW Fix"`，只含這 3 個字（`unicode-range: U+586B, U+771F, U+7A81`），字型檔是 Chiron GoRound TC 500 的 2 KB 子集（`css/fonts/chiron-goround-tc-500-tw-fix.woff2`，用 Google Fonts 的 `text=` 參數取得），並放在 `$font-family-hand` 的第一個。標題裡遇到這 3 個字會改用 Chiron GoRound TC 500，其餘字仍是 Huninn。之後若發現其他字形問題，重新下載子集時把字加進 `text=` 與 `unicode-range`。
- **Chiron GoRound TC 字形實測**：用「為、真、裡、說、着、著、麵、峰、起、骨」和 Noto Sans TC 並排比對，字形都符合台灣讀者的習慣，所以介面與長文維持使用 Chiron GoRound TC，不需要改回 Noto Sans TC。
- **螢光筆**：方向說明寫的是 `linear-gradient(transparent 58%, $coral-tint 58%)`。實作改成一筆略帶抖動的 SVG 筆畫（`$marker-stroke`），顏色加深一階為 `$coral-marker #F8C4B2`（`$pen` 在上面 7.24），因為 `$coral-tint` 在奶油色紙上幾乎看不出來。頁首目前頁、目錄目前項也用同一支筆；hover 用淡一階的 `$coral-tint`。
- **首頁作者牆**：方向說明寫 64px 照片，實作用 72px（白框 8px），職稱用 Huninn 13px，6 個字的職稱才不會擠成三行。
- **首頁「為什麼值得訂」**：992 到 1199 一排四張會讓 H3 只剩一個字落單，所以改成 ≥ 1200 才一排四張，768 到 1199 兩欄。
- **首頁 hero 的兩個塗鴉**：≥ 1200 才顯示，992 到 1199 紙張留白不夠，會壓到副標。
- **文章列表的文章卡**：方向說明寫「縮圖在上」。768 到 1199 是單欄，縮圖在上會讓一張卡太高，改成縮圖在左 240px、文字在右；< 768 與 ≥ 1200（兩欄）維持縮圖在上。
- **文章列表的便利貼篩選**：方向說明寫 sticky，但 4 張便利貼疊起來約 1,260px（992 到 1199 欄窄，約 1,480px），比多數視窗高。sticky＋`max-height` 會在面板裡再捲一層，1440×900 只看得到主題分類與熱門標籤，閱讀權限、閱讀時間藏在下面又沒有任何提示，所以改成和編輯器設定便利貼同一個做法：視窗高到放得下整疊（≥ 1200 寬時視窗高 ≥ 1380px；992 到 1199 時 ≥ 1600px）才 sticky，其他情況跟著頁面捲動，4 張一次全部看得到。
- **文章內頁右欄超出紙張 8px**：方向說明寫用 `overflow-clip-margin` 讓便利貼超出 `.sheet` 的 `overflow-x: clip`。Chrome 只在兩軸都是 `clip` 時才套用這個值，所以 ≥ 1200 改成這一頁的紙張 `overflow: visible`（這個寬度兩側都有桌面留白，不會出現水平捲軸）。
- **文章內頁的整張紙**：方向說明只寫長文底下是純 `$sheet`；實作是整張紙都不放點格紋（`.sheet-plain`），標題區與文末也不會被格點干擾。
- **方案頁的手繪箭頭**：只在 ≥ 992 顯示，而且和省錢提示一起出現（選月繳時兩者都用 `visibility` 隱藏、保留高度）；< 992 開關與提示上下緊貼，不畫箭頭。
- **個人頁的索引板**：便利貼高度跟著內容（不拉成等高），像隨手貼上去的；「閱讀紀錄」連到收藏區塊的分頁籤列（`#library-history`）。
- **編輯器的設定便利貼**：一疊約 1,000px 高，比 900px 的視窗還高，sticky 會變成面板裡再捲一層，所以只有 ≥ 1400 寬且視窗高度 ≥ 1180px 時才 sticky，其他情況跟著頁面捲動。
- **編輯器的手繪標籤工具列**：< 768 排成兩列（高度剛好三格橫線），工具名稱都看得到，不用橫向捲動。
- **登入、註冊、忘記密碼的設計稿狀態示意**：方向說明寫「示意便利貼」。實作用和其他頁一致的直角虛線框 `.demo-state`（不傾斜），讓示意和產品外皮（便利貼、紙卡）分得開；提示框本身沿用 `.callout`。手機上虛線框、提示框兩層內距疊起來太窄，提示框的圖示改成和標題同一列，內文用滿提示框寬度。
- **登入與忘記密碼在 992 到 1199**：右欄只剩 5 欄時，示意框裡的提示框一行不到 10 個字，所以這個寬度改成上下排（索引卡最寬 544、靠左），≥ 1200 才是左右兩欄；註冊頁右欄是內容短的權益卡，992 起就並排（7 : 5）。忘記密碼表單卡的 sticky 與指向示意的手繪箭頭也只在 ≥ 1200 出現。
- **作者個人頁的文章列表**：方向說明寫 880 單欄、篇與篇之間手繪虛線。實作把 6 篇寫在一張純紙色的活頁上（蓋掉點格紋，左側珊瑚筆記本邊線和文章內頁的長文同一條），文字底下才不會有格點；文章列不放縮圖、不重複作者列，標題是 h3。
- **Guideline 的付費牆兩態**：Guideline 的右欄比文章內頁窄，付費牆未訂閱／已訂閱要到 ≥ 1400 才左右並排（以下上下排），並排時一欄只有約 370px，月／年兩張票券照手機的排法上下堆疊。未登入的變化（主要按鈕改「登入後訂閱」＋S01 小字）只畫在 Guideline，文章內頁的設計稿切換器只有未訂閱／已訂閱。
- **Guideline 的頂端閱讀進度條示意**：真的進度條是 `position: fixed` 在視窗最上緣、沒有軌道；Guideline 用同一個 `.reading-progress` 加 `.gl-progress-top` 改回文件流並加上點格色軌道，0% 與 100% 才看得出差別。
- **追蹤作者按鈕**：「追蹤作者」與「已追蹤」字數不同，切換時按鈕會變寬或變窄，所以 `.follow-btn` 設了最小寬度，兩個狀態一樣大（文章內頁作者名片原本在 `_article.scss` 的規則一起移到 `_base.scss`）。

## 圖片

`images/` 的 17 張圖片（作者頭像 8、文章封面 8、內文配圖 1，檔名照主題層的 `IMAGES.md`）皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，人物與場景都是虛構的。調性是**早晨日光的明亮生活紀實攝影**：柔和擴散光、陰影提亮、低到中對比、乾淨的暖白高光（不偏黃、不偏棕，避免和 04 的午後窗光重疊），點綴色是自然出現的珊瑚桃色與抹茶綠，加一點點傻瓜相機的細顆粒。夜景類（`cover-game-launch` 深夜工作室、`cover-concert-pricing` 空場館）允許較暗，但 prompt 已排除藍紫霓虹與彩色舞台燈。尺寸：頭像 600 × 600、封面 1200 × 630、配圖 1600 × 900，品質 80 的 JPEG。

拍立得白框、紙膠帶、傾斜都是 CSS 做的，prompt 裡明確排除了拍立得、膠帶、邊框、文字與塗鴉。沒有照片的人（作者牆後 4 位、留言讀者、申請者、停用的使用者）用 CSS 的字首頭像 `.avatar-initial`。`favicon.svg` 是手寫的 SVG（桌面色圓角底、奶油色手帳、珊瑚書籤、抹茶橫線、藍黑活頁圈）。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`：

```bash
npm run images                                                       # 產生缺少的圖片
CONC=1 node scripts/generate-images.mjs --only avatar-chen,cover-caseload   # 只重做指定的圖
node scripts/generate-images.mjs --force                             # 全部重做
```

換成其他風格時，改腳本裡的 `STYLE`（整組圖的共同調性）與各張描述即可，檔名不變，HTML 不用改。
