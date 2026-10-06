# 03｜高端政經智庫：現場筆記 FieldNotes

> 淺色系＋冷色調（牛津深藍、石板灰、純白底）。採用權威報刊排版架構，方案矩陣採細線分隔，強調數據圖表與專家權威。

概念是「現場筆記研究季刊」：把知識訂閱平台做成一份政經智庫的研究刊物，每篇第一線長文是一份具名的現場報告。權威感來自報刊的排版語彙——報頭與日期列、粗細雙線、多欄格線與欄線、襯線大標，以及每張圖表都寫清楚編號、單位、軸線與資料來源。顏色只有牛津深藍、石板灰與純白；大膽只花在兩個招牌元素：

- **報頭雙線**（`@include rule-double`）：頁首底部一組 2px 粗線＋1px 細線。同一組雙線也用在圖表頂端、方案矩陣表頭、付費牆卡、訂閱狀態卡與頁尾，整站像同一份刊物。
- **圖表（Exhibit，`.exhibit`）**：損益表、閱讀漏斗、轉換率、數據表一律是「雙線 → 圖 1／表 1 編號＋標題 → 單位 → 圖或表 → 資料來源」，漏斗是等比例、同色的橫條，附數據表。

專家權威則落在作者署名：一律附職稱與年資，頭像用方形（像研究員名錄），首頁作者群是一份「撰稿人名錄」。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（與 01 電商主題的 `01-luxury-style` 相同架構）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。單一淺色主題，`$enable-dark-mode: false`，作業系統切深色模式時畫面不變。
- **JS**：互動都交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡規格列出的 5 件事（設計稿切換器、閱讀進度條、字級調整、月／年切換、作者文章篩選）與收藏／追蹤／閱讀模式的 `aria-pressed`。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西（字體從 Google Fonts 載入，離線時會退回系統字體）。

**要修改樣式**：

```bash
npm install        # 安裝 bootstrap、bootstrap-icons、sass，並把 Bootstrap JS 與圖示字型複製進專案
npm run watch      # 開發時：監看 scss/，存檔就重新編譯 css/style.css
npm run css        # 編譯一次
npm run build      # 交付前：重新複製 vendor 檔案＋編譯一次 CSS
npm run check      # 檢查 6 個頁面的 head、日期列＋頁首、頁尾是否與範本一致
npm run vendor     # 只重新複製 Bootstrap JS 與圖示字型（npm install 時會自動執行）
npm run images     # 重新生成圖片（需要已登入的 codex CLI，換圖時才用）
```

## 頁面

| 頁面 | 檔案 | 樣式 |
|---|---|---|
| 設計 Guideline | `guideline.html` | `scss/pages/_guideline.scss` |
| 首頁 | `index.html` | `scss/pages/_home.scss` |
| 文章列表 | `articles.html` | `scss/pages/_articles.scss` |
| 文章內頁（以〈一間餐廳的成本結構〉示範，含付費預覽牆） | `article.html` | `scss/pages/_article.scss` |
| 訂閱方案（方案卡、比較矩陣、結帳、FAQ） | `pricing.html` | `scss/pages/_pricing.scss` |
| 個人頁面「我的現場筆記」（讀者／作者／管理員） | `account.html` | `scss/pages/_account.scss` |

頁面上沒有列出所有頁面的導覽：從首頁依讀者流程點進各頁即可；Guideline 不從頁首、頁尾連結，直接開 `guideline.html`。

兩個頁面有**設計稿切換器**（頁面右上角的虛線框「設計稿狀態示意（非產品介面）」），也可以直接用網址參數開啟：

```
article.html                    ← 未訂閱（漸層淡出＋付費牆卡、目錄後 3 節上鎖、留言框停用）
article.html?view=subscribed    ← 已訂閱（沒有付費牆與任何提示，內文接續 3 個章節，留言框可用）
account.html                    ← 讀者（閱讀＋帳號，成為作者的申請表與申請狀態）
account.html?role=author        ← 作者（多「創作」：我的文章、撰寫新文章、內容數據）
account.html?role=admin         ← 管理員（再多「平台管理」：作者申請審核、使用者管理、文章管理）
```

一頁只能呈現一種狀態，其他狀態放在相關區塊下方的「設計稿狀態示意」（虛線框，標題寫明情境）：文章列表的篩選／搜尋無結果、文章已下架、付款三態、其他訂閱狀態與提醒、取消確認對話框、收藏與閱讀紀錄為空、作者尚無文章、編輯器的發布前檢查未通過（發布鈕停用）／草稿未完成／自動儲存失敗／空白新文章、審核佇列為空、讀者進入作者後台、申請狀態。

## 檔案結構

```
03-thinktank-style/
├─ *.html                    ← 6 個頁面，每頁完整包含日期列、頁首與頁尾
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的少量互動
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 作者頭像 8、文章封面 8、內文配圖 1（AI 生成，冷調報導攝影）、favicon.svg
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫＋本風格變數
│  ├─ _base.scss             ← 全站基礎、報頭雙線 mixin 與共用類別
│  ├─ components/            ← 頁首、頁尾、徽章、頭像、文章卡、長文、圖表、付費牆、方案、個人頁元件、編輯器、設計稿示意
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、日期列＋頁首、頁尾是否與範本一致，以及目前頁標示
   └─ generate-images.mjs    ← 生圖腳本（17 張圖的 prompt 與裁切）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾每頁一份**：沒有元件系統，所以 6 個頁面各自完整寫一份。要改頁首或頁尾時，先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check`。每頁只有一處不同：目前頁標示（`active` 與 `aria-current="page"`）。`article.html` 標「文章列表」但不加 `aria-current`；`account.html` 標會員入口（選單內與桌機各一個）；`guideline.html` 不標示。
- **狀態切換**：`<body data-view="unsubscribed|subscribed">`、`<body data-role="reader|author|admin">`；元素用 `data-show-view="subscribed"`、`data-show-role="author admin"` 標記，CSS（`components/_demo.scss`）依 body 屬性隱藏不屬於目前狀態的元素。沒有 JS 時以 HTML 寫的預設值（未訂閱、讀者）呈現。網址有 `#錨點` 時，套用狀態後再捲過去。
- **假資料直接寫在 HTML**：文章、作者、方案與數據的文案逐字取自主題的 `CONTENT.md`。跨頁要一致的數字（438／127／142 篇位、NT$ 180／1,800／150／360、6,800／2,200／4,600 字與 32%、2027/10/02、收藏 38、已發布 18、漏斗 18,420 → 6,208 → 892 → 214）在多頁出現，改動時要一起改。
- **圖表**：漏斗與轉換率用 HTML／CSS 畫（`.hbar-chart`），每一列用 `style="--value: 73.68%"` 指定長度（＝數值 ÷ 刻度最大值 25,000），格線間距是 `--grid`。不用圖表套件；每張圖都附數據表。
- **編輯器**：靜態的介面設計，不用 `contenteditable`。浮動工具列、插入選單、免費預覽分隔線同時畫在畫面上只是為了一次看完（Guideline 有註明）。
- **換行與空白**：標題用 `.text-phrase`＋`<wbr>` 標出詞組斷點；數字與單位之間用 `&nbsp;`。
- **表單**：設計稿沒有後端，「確認付款」「送出申請」都是 `type="button"`；各表單上方的註解寫了串接後端時要改的地方。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、字體、長文字級、間距、圓角、元件、報頭雙線與圖表色）
3. `bootstrap/scss/bootstrap`
4. `bootstrap-icons`：圖示字型（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字體、區塊節奏、按鈕、表單、分段控制、標籤、提示框、空狀態、資料表、焦點，以及 `rule-double` mixin
6. `components/*`：頁首、頁尾、徽章、頭像、文章卡、長文、圖表、付費牆、方案、個人頁元件、編輯器、設計稿示意
7. `pages/*`：各頁專屬樣式，class 一律加頁面前綴（`home-`、`articles-`、`article-`、`pricing-`、`acct-`、`gl-`）

原則是**先用 Bootstrap 的變數與工具類別**，做不到才寫自訂 CSS，而且自訂 CSS 只引用變數，不寫死色碼。

### 共用類別

| 類別 | 用途 | 位置 |
|---|---|---|
| `@include rule-double`、`.rule-double` | 報頭雙線（2px 粗線＋2px 白隙＋1px 細線），本風格的招牌 | `_base.scss` |
| `.section`、`.section-alt`、`.section-dark`、`.section-head`、`.section-sub` | 區塊上下留白 52／72px、霧白紙底、深藍帶；區塊標題列（左標題＋副標、右動作） | `_base.scss`、`pages/_home.scss` |
| `.page-header`、`.page-lead` | 文章列表、方案、個人頁的頁面標題區：麵包屑 → H1 → 說明 | `_base.scss` |
| `.figure-num`、`.num`、`.meta` | Newsreader 大數字（價格、到期日、數據卡）；等寬數字；「字數 ‧ 閱讀時間 ‧ 日期」中繼資料列 | `_base.scss` |
| `.text-phrase` | 標題只在空白與 `<wbr>` 處換行 | `_base.scss` |
| `.btn-primary`／`.btn-outline-primary`／`.btn-text`／`.btn-light`／`.btn-outline-light` | 主要、次要、文字連結、深藍帶上的主要與次要；停用保留原尺寸 | `_base.scss` |
| `.segmented`（`.segmented-sm`） | 分段控制：月／年、字級、付費層級、統計期間 | `_base.scss` |
| `.tag`（`.is-selected`、`.is-zero`）、`.tag-list` | `#標籤` 小框：一般、選中、0 篇 | `_base.scss` |
| `.callout`（`-success`、`-warning`、`-danger`、`-brand`） | 提示框：左側色條＋圖示＋文字（＋一個按鈕） | `_base.scss` |
| `.empty-state` | 空狀態：圖示＋一句說明＋一個下一步按鈕 | `_base.scss` |
| `.table-data` | 資料表：外框、表頭霧白紙底、數字欄靠右、外層 `.table-responsive` | `_base.scss` |
| `.perm`（`-premium`、`-free`、`-draft`、`-removed`）、`.kicker` | 權限徽章（放在標題前）與分類列 | `components/_badges.scss` |
| `.status`（`.is-success`、`-warning`、`-danger`、`-info`、`-brand`、`-neutral`）、`.role-chip` | 狀態徽章（圖示＋文字＋顏色）；設計稿用的角色標記 | `components/_badges.scss` |
| `.avatar`（`.avatar-24`～`-96`、`.avatar-initial`）、`.author-line` | 方形頭像（照片／字首）、作者列 | `components/_avatar.scss` |
| `.article-item`、`.article-list`、`.story`（`.story-with-thumb`） | 文章列表的一列；精簡文章卡（首頁次要精選、延伸閱讀） | `components/_article-card.scss` |
| `.prose`（`.prose-sm`、`.prose-lg`）、`.pull-quote`、`.lede` | 長文排版（最大寬 700px、行高 1.9）、引言區塊、導言 | `components/_prose.scss` |
| `.exhibit`（`-head`、`-label`、`-title`、`-unit`、`-source`、`.exhibit-dark`）、`.exhibit-table`、`.hbar-chart`、`.stat-strip` | 圖表、圖表內的表格、橫條圖、數據卡列 | `components/_exhibit.scss` |
| `.paywall`、`.paywall-tail`、`.paywall-fade`、`.radio-card`、`.save-tag` | 付費預覽牆（漸層 140px＋訂閱卡）、選項卡 | `components/_paywall.scss` |
| `.plan-grid`、`.plan-card`（`.is-featured`）、`.plan-flag`、`.benefit-list`、`.compare`、`.compare-table`、`.mark-yes`／`.mark-no`／`.mark-na` | 方案卡、推薦標籤、權益清單、細線比較矩陣與 ✓／✗／— | `components/_plans.scss` |
| `.sub-card`、`.sub-mini`、`.library-card`、`.cancel-modal`、`.review-card`、`.reject-quote` | 訂閱狀態卡、其他訂閱狀態小卡、收藏卡、取消對話框、申請審核卡 | `components/_account-ui.scss` |
| `.editor-sheet`、`.bubble-toolbar`、`.preview-divider`、`.insert-menu`、`.editor-panel`、`.check-list` | 編輯器元件 | `components/_editor.scss` |
| `.demo-switch`、`.demo-state`（`-title`、`-note`）、`.demo-stage`、`.demo-caption`、`[data-show-view]`、`[data-show-role]` | 設計稿切換器、設計稿狀態示意、依狀態顯示／隱藏 | `components/_demo.scss` |

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 面 | 純白 `$paper #FFFFFF`（頁面底、卡片）、霧白紙 `$mist #F3F5F8`（交替區塊、表頭、推薦欄淡底、頁尾）、深藍淡底 `$oxford-tint #E8EDF4`（選中、目前項目、洞察） |
| 深藍 | 牛津深藍 `$oxford #002147`（品牌、標題、主要按鈕、報頭雙線、訂閱限定、圖表主系列，16.05:1）、深藍 hover `#0B3A6E` |
| 文字 | 墨色 `$ink #1B2430`（內文 15.65:1）、石板灰 `$slate #4A5868`（次要 7.27:1）、淡石板 `$slate-light #5F6C7B`（placeholder、圖說 5.36:1） |
| 線 | 髮絲線 `$rule #D5DBE3`（分隔、欄線，裝飾）、深髮絲線 `$rule-strong #AEB8C5`、表單框線 `$control #8792A2`（3.15:1） |
| 第二冷色 | 天青藍 `$cerulean #1D64A8`：只給「免費」權限、資訊提示與圖表第二系列（6.10:1） |
| 狀態色 | 綠 `#1C7547`、琥珀 `#8A5300`、緋紅 `#B3261E`，各有淡底（狀態字在淡底上 ≥ 5:1）；一律搭配圖示與文字 |
| 深藍帶 | 白字（16.05:1）、淡藍灰 `#C9D3E0`（10.61:1）、欄線 `#33507A` |
| 字體 | Newsreader（英數、大數字）＋ Noto Serif TC 400／700／900（中文標題、長文）＋ Noto Sans TC 400／500／700（介面） |
| 長文 | 最大寬 700px；內文 18px／1.9；Aa 三段 17／18／20px，行高 1.95／1.9／1.85（手機不下調）；導言 20px／1.85 |
| 圓角 | 全部 0（報刊直角），頭像也是方形；只有 radio、開關是圓的 |
| 陰影 | 只給蓋在內容上的層：付費牆卡與對話框 `$box-shadow-lg`；下拉選單、浮動工具列、插入選單、訂閱摘要 `$box-shadow` |
| 焦點 | 2px 白隙＋2px 深藍外圈（`$focus-ring-double`） |
| 版面 | 容器最大 1296px（內距 20／32px）；頁首 73px（主列 68px＋雙線 5px）；sticky 偏移 97px |

完整規範請看 `guideline.html`。改色時，Guideline 的色票 hex、對比度與其他寫死色碼的地方也要一起改，清單見上一層 [`../README.md`](../README.md) 的「換色時同步檢查」。

## 圖片

`images/` 的 17 張圖片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名與同主題其他風格相同（清單見主題的 `IMAGES.md`）：作者頭像 8 張（600 × 600）、文章封面 8 張（1200 × 630）、內文配圖 1 張（1536 × 864）。調性是政經週刊的冷調報導攝影：中性偏冷的自然光、低彩度（石板灰、深藍、乾淨的白）、構圖安靜、不戲劇化；畫面裡沒有可讀的文字與品牌標誌。沒有照片的人（作者牆後 4 位、留言讀者、申請者、使用者表格）用 CSS 的字首頭像。替換時保持相同檔名即可，不需改程式。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`（先依原圖實際尺寸置中裁切成目標比例，再縮放、轉 JPEG 品質 80）：

```bash
npm run images                                              # 產生缺少的圖片
node scripts/generate-images.mjs --only avatar-chen,cover-caseload   # 只重做指定的圖
node scripts/generate-images.mjs --force                    # 全部重做
CONC=1 node scripts/generate-images.mjs                     # 一次只跑一張
```

換成其他風格時，改腳本裡的 `STYLE`（整組圖的共同調性）與各張描述即可。
