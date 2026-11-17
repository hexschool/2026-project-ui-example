# 03｜高端政經智庫：現場筆記 FieldNotes

> 淺色系＋冷色調（牛津深藍、石板灰、純白底）。採用權威報刊排版架構，方案矩陣採細線分隔，強調數據圖表與專家權威。

概念是「現場筆記研究季刊」：把知識訂閱平台做成一份政經智庫的研究刊物，每篇第一線長文是一份具名的現場報告。權威感來自報刊的排版語彙：報頭與報耳、粗細雙線、12 欄格線與欄線、襯線大標，以及每張圖表都寫清楚編號、單位、軸線與資料來源。顏色只有牛津深藍、石板灰與純白；大膽只花在兩個招牌元素：

- **報頭雙線**（`@include rule-double`）：頁首底部一組 2px 粗線＋1px 細線。同一組雙線也用在每個區塊的欄目標頭、數據框、圖表頂端、方案矩陣表頭、付費牆卡、訂閱狀態卡與頁尾，整站像同一份刊物。
- **圖表（Exhibit，`.exhibit`）**：損益表、閱讀漏斗、轉換率、數據表一律是「雙線 → 圖 1／表 1 編號＋標題 → 單位 → 圖或表 → 資料來源」，漏斗是等比例、同色的橫條，附數據表。

專家權威則落在作者署名：一律附職稱與年資，頭像用方形（像研究員名錄），首頁作者群是一份「撰稿人名錄」。

整站的版面是一份報紙：分區靠線（報頭雙線、粗線、髮絲線、欄線），不靠卡片框、底色與陰影；標題分頭條、次條、短訊三級；數字放進數據框。細節見下方「排版語言」。

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
npm run check      # 檢查 10 個頁面的 head、頁首（報頭列＋導覽列）、頁尾是否與範本一致
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
| 訂閱方案（價目表、比較矩陣、結帳、FAQ） | `pricing.html` | `scss/pages/_pricing.scss` |
| 個人頁面「我的現場筆記」（讀者／作者／管理員） | `account.html` | `scss/pages/_account.scss` |
| 登入（2026-11 補） | `login.html` | `scss/pages/_auth.scss` |
| 免費註冊（2026-11 補） | `register.html` | `scss/pages/_auth.scss` |
| 作者個人頁（以陳柏諺示範，2026-11 補） | `author.html` | `scss/pages/_author.scss` |
| 忘記密碼（2026-11 補） | `forgot-password.html` | `scss/pages/_auth.scss` |

頁面上沒有列出所有頁面的導覽：從首頁依讀者流程點進各頁即可；Guideline 不從頁首、頁尾連結，直接開 `guideline.html`。

2026-11 補的 4 頁從這裡進去（示意使用者陳柏諺已登入，所以頁首沒有登入／註冊按鈕）：

- 文章付費牆的「已經是訂閱者了？登入」→ `login.html` → 送出到 `article.html?view=subscribed`；「忘記密碼？」→ `forgot-password.html`（送出後捲到本頁的「重設信已寄出」示意 `#reset-sent`）。
- 方案頁免費方案的「免費註冊」、登入頁的「免費註冊」→ `register.html` → 送出到 `account.html`。
- 文章內頁作者卡的「查看全部文章」→ `author.html`（作者的文章列同樣連到 `article.html`，分類連到 `articles.html`）。

兩個頁面有**設計稿切換器**（頁面右上角的虛線框「設計稿狀態示意（非產品介面）」），也可以直接用網址參數開啟：

```
article.html                    ← 未訂閱（漸層淡出＋付費牆卡、目錄後 3 節上鎖、留言框停用）
article.html?view=subscribed    ← 已訂閱（沒有付費牆與任何提示，內文接續 3 個章節，留言框可用）
account.html                    ← 讀者（閱讀＋帳號，成為作者的申請表與申請狀態）
account.html?role=author        ← 作者（多「創作」：我的文章、撰寫新文章、內容數據）
account.html?role=admin         ← 管理員（再多「平台管理」：作者申請審核、使用者管理、文章管理）
```

一頁只能呈現一種狀態，其他狀態放在相關區塊下方的「設計稿狀態示意」（虛線框，標題寫明情境）：文章列表的篩選／搜尋無結果、文章已下架、付款三態、其他訂閱狀態與提醒、取消確認對話框、收藏與閱讀紀錄為空、作者尚無文章、編輯器的發布前檢查未通過（發布鈕停用）／草稿未完成／自動儲存失敗／空白新文章、審核佇列為空、讀者進入作者後台、申請狀態，以及 2026-11 補頁的登入沒有成功、還沒登入就按了訂閱（S01）、註冊欄位錯誤、重設信已寄出、設定新密碼、重設連結已失效、作者還沒有發表文章。

## 檔案結構

```
03-thinktank-style/
├─ *.html                    ← 10 個頁面，每頁完整包含頁首（報頭列＋導覽列）與頁尾
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
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫＋本風格變數（含報刊排版的 token）
│  ├─ _base.scss             ← 全站基礎、報頭雙線 mixin 與共用類別
│  ├─ components/            ← 報刊排版（_newsprint）、頁首、頁尾、徽章、頭像、文章卡、長文、圖表、付費牆、方案、個人頁元件、編輯器、設計稿示意
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查 10 頁的 head、頁首、頁尾是否與範本一致，以及目前頁標示
   └─ generate-images.mjs    ← 生圖腳本（17 張圖的 prompt 與裁切）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾每頁一份**：沒有元件系統，所以 10 個頁面各自完整寫一份。要改頁首或頁尾時，先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check`。每頁只有一處不同，就是目前頁的標示：首頁、文章列表、訂閱方案加 `active`＋`aria-current="page"`；文章內頁與作者個人頁標「文章列表」只加 `active`，不加 `aria-current`；個人頁面標會員入口（選單內與桌機各一個）；Guideline、登入、註冊、忘記密碼不標示。
- **狀態切換**：`<body data-view="unsubscribed|subscribed">`、`<body data-role="reader|author|admin">`；元素用 `data-show-view="subscribed"`、`data-show-role="author admin"` 標記，CSS（`components/_demo.scss`）依 body 屬性隱藏不屬於目前狀態的元素。沒有 JS 時以 HTML 寫的預設值（未訂閱、讀者）呈現。網址有 `#錨點` 時，套用狀態後再捲過去。
- **假資料直接寫在 HTML**：文章、作者、方案與數據的文案逐字取自主題的 `CONTENT.md`。跨頁要一致的數字（438／127／142 篇位、NT$ 180／1,800／150／360、6,800／2,200／4,600 字與 32%、2027/10/02、收藏 38、已發布 18、漏斗 18,420 → 6,208 → 892 → 214）在多頁出現，改動時要一起改。
- **圖表**：漏斗與轉換率用 HTML／CSS 畫（`.hbar-chart`），每一列用 `style="--value: 73.68%"` 指定長度（＝數值 ÷ 刻度最大值 25,000），格線間距是 `--grid`。不用圖表套件；每張圖都附數據表。
- **編輯器**：靜態的介面設計，不用 `contenteditable`。浮動工具列、插入選單、免費預覽分隔線同時畫在畫面上只是為了一次看完（Guideline 有註明）。
- **換行與空白**：標題用 `.text-phrase`＋`<wbr>` 標出詞組斷點；數字與單位之間用 `&nbsp;`。
- **表單**：設計稿沒有後端，原有 6 頁的表單都不送出（「確認付款」「送出申請」都是 `type="button"`）；各表單上方的註解寫了串接後端時要改的地方。2026-11 補的登入、註冊、忘記密碼用 `<form action="目的頁">` 以 GET 換頁：密碼欄一律不加 `name`，密碼才不會出現在網址列；登入表單只有 hidden 的 `view=subscribed` 有 `name`，送出後是 `article.html?view=subscribed`。串接後端時改用 POST 並補上 `name`。這 4 頁沒有新增 JS，作者頁的追蹤按鈕沿用 `data-toggle-pressed`。

## 排版語言

和同主題的 01 打字機風、04 雙年展風比，03 的差別不只在配色，而是整套版面照報紙的方式組：**分區靠線，不靠卡片框、底色與陰影；標題分頭條、次條、短訊三級；數字放進數據框。** 共用的樣式在 `scss/components/_newsprint.scss`，token 在 `_variables.scss` 第 6 節之後。

### 網格

- **12 欄 CSS grid**（`.np-grid`，或各頁 partial 自己寫 `grid-template-columns: repeat(12, minmax(0, 1fr))`）：≥ 992px 啟用，欄距 `$np-col-gap`＝32px。容器沿用 Bootstrap（≥ 1400px 是 1296px），不改 `$container-max-widths`。
- **欄的位置寫在各頁 partial**（`grid-column`），不做 `.np-span-*` 工具類別。並排時 HTML 的先後＝閱讀與 Tab 順序，排在前面的區塊放左邊或上面；只有純裝飾、`tabindex="-1"`＋`aria-hidden` 的圖片連結可以用 `order` 換位置。
- **欄線**有兩種畫法：
  - `@include np-col-rule`（`.np-col-rule`）：畫在某一欄的 `::before`，位置在左側欄距正中央；992px 以下堆疊時改成上方髮絲線。欄的高度就是線的長度。
  - `@include np-col-line($n)`（2026-11 補頁新增）：畫在外層 12 欄 grid 上，位置是第 `$n` 欄之後那個欄距的正中央，從外層頂端貫通到底端，欄比較短時線也不會斷。登入、註冊、忘記密碼、作者頁用這一種。`np-col-line-x($n)` 回傳同一個位置，給斷點改位置時用。
- **子網格**：首頁「為什麼值得訂｜主題索引」的兩個欄目標頭、方案頁價目表的方案列、登入與忘記密碼的表單列，都用 `grid-template-columns: subgrid` 對齊外層的欄。

### 報頭與版權頁

- **頁首（≥ 992px 兩層）**：報頭列 96px（`$masthead-height`）＝左報耳（日期）｜置中大字品牌（現場筆記＋FieldNotes）｜右報耳（第一線工作者的知識訂閱）→ 1px 髮絲線 → 導覽列 68px（導覽置中，搜尋與會員入口靠右；目前頁是文字下方 2px 深藍線）→ 報頭雙線 5px。整個頁首 `position: sticky`，`top` 是負的報頭列高度，捲動 97px 後報頭列收起，只剩導覽列＋雙線 73px（`$site-header-height`），所以所有 sticky 元素、閱讀進度條與 `scroll-padding-top` 都不用改。不寫 JS。
- **頁首（< 992px）**：報耳與報頭列隱藏，單列（品牌靠左，搜尋、頭像、選單靠右）。
- **頁尾**是刊物的版權頁，全部置中對稱：報頭雙線 → 品牌（比報頭小一號）→ 說明 → 讀者｜作者｜平台三欄等寬、欄線分隔 → 版權列。768px 以下讀者、作者兩欄並排，平台在下方一整列。

### 標題階層

`$h1`～`$h6` 與 `$display-font-sizes` 不改，另外加報刊標題的 token 與類別，只改外觀，標籤層級照原本。頁面上的頁面標題、文章列表標題、精簡卡標題改用下表的頭條、次條、短訊，所以 Guideline 字級表的這三列已跟著改（見本節最後的修正清單第 19 項）。

| 級 | 類別／mixin | 字 | 992px 以上 | 以下 | 用在 |
|---|---|---|---|---|---|
| 通欄大標 | `.home-hero-title` | Noto Serif TC 900，行高 1.22 | 3 → 3.25 → 3.75rem（≥ 1200px 一行） | 1.95 → 2.5 → 2.75rem | 首頁 H1（`$np-banner-sizes`） |
| 表單頁大標 | `.auth-title` | 900，行高 1.25 | 3rem，≥ 1400px 3.5rem（註冊頁的窄標題欄固定 3rem） | 1.75rem | 登入、註冊、忘記密碼的 H1 |
| 頭條 | `.np-hl-1`、`@include np-hl-1` | 900，行高 1.3 | 2.25rem | 1.75rem | 首頁主推標題、各頁 H1（列表、方案、個人頁、作者頁） |
| 次條 | `.np-hl-2`、`@include np-hl-2` | 700，行高 1.45 | 1.375rem（768px 起） | 1.25rem | 首頁次條、文章列表與作者頁的文章標題 |
| 短訊 | `.np-hl-3`、`@include np-hl-3` | 700，行高 1.55 | 1.0625rem | 1.0625rem | 首頁短訊、延伸閱讀 |
| 欄目標頭 | `.section-head`、`@include np-flag` | 沿用 `$h2-font-size` | | | 每個區塊的 H2 |
| 眉標 | `.kicker` | Noto Sans TC 700，12px | | | 權限徽章＋分類 |

`.np-hl-*` 類別寫成 `:is(h1, h2, h3, h4, h5, h6, p).np-hl-*`，可以蓋過元件自己的標題字級（例如 `.story-title`）。文章內頁的 H1 仍在 700px 閱讀欄內，用 `.article-title` 原本的大小，不套通欄。

### 線條系統

| 線 | 規格 | 用在 |
|---|---|---|
| 報頭雙線 | 2px 深藍＋2px 白隙＋1px 深藍（`@include rule-double`） | 頁首底、頁尾頂、欄目標頭頂端、數據框、圖表、價目表頂端、比較矩陣表頭、付費牆卡、文章列表的篩選橫列、個人頁索引列、992px 以下註冊頁的權益摘要與作者頁的文章欄名 |
| 粗線 | 2px `$oxford` | 各頁版頭（麵包屑下方、H1 上方）、表單頁與作者頁的版面頂端、文章副標上方、帳號設定、作者申請表與「下次扣款」的頂線、內文 h2 與表單頁說明上方的 3rem 短線 |
| 髮絲線 | 1px `$rule` | 列與列之間、標頭與內容之間、欄堆疊時取代欄線、表單頁的切換連結上方與示意區上方 |
| 欄線 | 1px `$rule` 直線，畫在欄距正中央 | ≥ 992px 並排的欄之間 |
| 深藍帶欄線 | 1px `$on-oxford-rule` | 首頁撰稿人名錄的深藍帶 |

- 不再用「整塊色帶交替」分區，只留首頁撰稿人名錄的深藍帶（03 的辨識色帶）與頁尾霧白紙。
- 卡片外框只留給真的是「卡」的東西：付費牆卡、對話框、表單示意、設計稿狀態示意（虛線）。文章、主題、方案、收藏、表單頁都改成「欄＋線」。

### 數據框與頁邊註

- **數據框** `.np-databox`（`@include np-databox`）：頂端報頭雙線 → 小字標籤＋Newsreader 大數字（`.figure-num`）＋單位，項目之間 1px 髮絲線，沒有外框與底色。`np-databox-rows` 是「標籤左、數字右」的逐列排法，`np-databox-cols($n)` 是橫排 n 格。首頁 438／127／142 直接用這組 mixin；文章內頁的閱讀進度（`.aside-databox`，32% 放大）與個人頁數據卡列（`.stat-strip`）是同一個做法，寫在各自的檔案裡；方案頁訂閱摘要的「下次扣款」用 2px 深藍頂線＋大日期（摘要卡頂端已經有一組雙線）。標籤都用頁面上原本就有的字，不另外加標題。
- **頁邊註** `.np-margin-note`：≥ 1400px 時，文章內頁照片的圖說移到閱讀欄右側的頁邊，和圖片底部對齊；以下回到圖片下方。圖表的資料來源不搬（圖表結構是 03 的招牌，維持）。

### 各頁構圖（≥ 992px）

| 頁面 | 構圖 | 992px 以下 |
|---|---|---|
| 首頁 | 頭版頭條：通欄大標在粗線與髮絲線之間 → 副標＋按鈕 5｜數據框 3｜引文 4 → 社論欄「為什麼值得訂」4｜主題索引 8（篇數與最新更新一直顯示）→ 本週精選 頭條 6｜次條 3｜短訊 3（992～1399px 為 7｜5）→ 深藍帶：版名置中、撰稿人名錄一整排、讀者來函 8｜訂閱保障 4、CTA 8｜4 | 單欄；數據框 3 格橫排（768px 起改逐列，和引文並排）；名錄橫向捲動 |
| 文章列表 | 分類版頭（麵包屑 → 粗線 → H1＋說明 7｜搜尋列 5）→ 篩選橫列（雙線 → 「篩選｜清除篩選」→ 4 組並排、欄線分隔，992px 5｜3｜2｜2、1200px 4｜4｜2｜2，不 sticky）→ 排序分頁籤 → 帳冊列 眉標 2｜主文 7｜縮圖 3（主文兩側欄線）→ 分頁對齊主文欄 | 篩選收進「篩選條件（3）」抽屜；768～991px 眉標一列在上、主文 2｜縮圖 1；767px 以下不放縮圖 |
| 文章內頁 | 左欄（13 → 15 → 16rem，sticky：編號目錄 → 閱讀進度數據框 → 字級）｜貫通全文的欄線｜閱讀欄 700px；≥ 1400px 右側頁邊註。標題區：眉標列（上下髮絲線）→ 大標題 → 副標（上方粗線）→ 作者權威列＋工具 → 雙線。內文第一段首字放大 2 行、h2 上方 3rem 短線（只在 `#article-body`） | 左欄隱藏，目錄在標題區下方展開，工具改成底部行動列 |
| 訂閱方案 | 麵包屑 → 雙線 → 價目表 標題欄｜免費｜月費｜年費 4 欄等寬、欄線分隔（方案列用 subgrid 對齊）→ 比較矩陣 4 欄，欄線和價目表上下對齊 → 結帳 3 欄（付款方式｜信用卡欄位＋同意｜訂閱摘要 sticky；992～1199px 3：4：5，≥ 1200px 4：4：4）→ FAQ 標題全寬、問答兩欄 | 方案上下堆疊、各自細框；矩陣橫向捲動、首欄凍結；FAQ 從 768px 起兩欄 |
| 個人頁面 | 版頭（H1｜角色切換器）→ 索引列（雙線 → 個人卡｜閱讀｜創作｜平台管理｜帳號｜申請入口，欄線分隔；被角色隱藏的群組不佔欄；有權限的群組色條在頂端）→ 全寬內容，每個區塊用欄目標頭起頭；訂閱卡 4｜8 不加框；我的收藏是帳冊列（眉標 2｜標題 5｜進度與按鈕 3｜封面 2，欄線分隔）；數據卡 4 欄；提醒兩則並排（768px 起）；作者申請表是帳冊式表單（2px 深藍頂線、不加框，每個欄位一列「標籤 3｜欄位 9」、髮絲線分列），申請狀態放在右側頁邊欄（欄線分隔，≥ 1200px 8｜4，992～1199px 7｜5）；帳號設定兩欄 | 索引收成內容上方的下拉；收藏列 768～991px 眉標在上、標題與進度 2｜封面 1，767px 以下封面縮成小圖放在標題右側；申請表 768px 起「標籤｜欄位」，以下標籤在欄位上方，申請狀態排在表單下方 |
| 登入 | 粗線 → 表單列：左 H1「登入」＋說明（說明上方 3rem 短線）｜欄線｜右 表單 → 切換連結（992～1199px 6｜6，≥ 1200px 7｜5，欄線只畫在這一列）→ 髮絲線 → 設計稿狀態示意橫排（帳號或密碼錯誤、S01） | 單欄：標題 → 表單 → 示意，內容最寬 34rem、靠左 |
| 免費註冊 | ≥ 1200px 三欄：標題 3｜表單 5｜免費會員權益摘要 4（兩條貫通的欄線）；992～1199px 標題＋表單 7｜摘要 5。欄位錯誤示意在表單欄下方。權益摘要沿用方案頁價目欄的內容樣式，不加框、不加底色、沒有按鈕 | 標題 → 表單 → 摘要（雙線起頭）→ 示意 |
| 作者個人頁 | 麵包屑 → 粗線 → 專欄作家版 3｜9、貫通欄線：左欄作者資訊（方形頭像 96 → H1 頭條字級 → 認證作者 → 職稱 → 髮絲線 → 簡介 → 追蹤，sticky）｜右欄 欄名「陳柏諺的文章」＋筆數 → 帳冊列（沒有縮圖、沒有作者列：992～1199px 眉標 3｜主文 9，≥ 1200px 眉標 2｜主文 10）→ 分頁對齊主文欄 → 空狀態示意 | 768～991px 頭像｜文字兩欄、文章在下方（欄名用雙線起頭）；767px 以下頭像 64 和姓名、徽章、職稱橫排，簡介與追蹤在下方 |
| 忘記密碼 | 和登入同一套：左 H1「忘記密碼」＋說明｜右 表單 → 返回登入 → 髮絲線 → 3 個示意照發生順序排（重設信已寄出 → 設定新密碼 → 連結已失效）：≥ 1200px 一列三格；992～1199px 兩欄，「設定新密碼」在右欄跨兩列 | 單欄，示意由上而下 |
| Guideline | 只同步頁首頁尾，內文做最小修正（清單見本節最後）；2026-11-17 另把列舉頁面的地方補上新頁 | |

### 各寬度怎麼收合

| 寬度 | 頁首頁尾 | 網格與線 |
|---|---|---|
| 390 | 單列 sticky 頁首，沒有報耳；頁尾置中，連結 2＋1 欄 | 單欄；欄線改成上方髮絲線；欄目標頭的雙線保留；表單頁單欄 |
| 768 | 同 390；頁尾 3 欄連結一排（欄線） | 部分區塊 2 欄（首頁數據框＋引文、為什麼值得訂 2 × 2、評價、FAQ；列表主文 2｜縮圖 1；作者頁頭像｜文字） |
| 992 | 完整報頭（報頭列 96px＋導覽列 73px），捲動後只剩導覽列 | 12 欄網格＋欄線啟用；首頁大標兩行；登入 6｜6、註冊 7｜5、作者頁 3｜9 |
| 1440 | 同 992 | 首頁大標一行、精選 6｜3｜3、名錄 11 格一排；文章內頁出現頁邊註；登入 7｜5、註冊 3｜5｜4 |
| 1920 | 頁首、頁尾、深藍帶與報頭雙線滿版 | 容器停在 1296px 置中；長文仍 700px |

### Guideline 修正清單（2026-11-17 報刊排版）

Guideline 只改了和新版面矛盾的文字，元件示範的 HTML 一處都沒動（共用類別原地改樣式的部分，示範會跟著變，已截圖確認沒壞）。行號是修改當時的位置：

1. （約 179 行）頁首是報頭：日期列＋品牌字標 → 頁首是報頭：報頭列（左右報耳夾著置中的品牌字標）＋導覽列。
2. （352）Display：40 → 52 → 56px ‧ 行高 1.28 → 31 → 40 → 44 → 48 → 52 → 60px ‧ 行高 1.22（對照 `.home-hero-title`）。
3. （474）閱讀模式：隱藏日期列、目錄欄與設計稿切換器 → 隱藏報耳、左欄與設計稿切換器。
4. （520）寬窄層級：拿掉「＞ 方案頁首屏文字 640」（價目表標題欄已不設 640）。
5. （521）頁首高度：補上「；≥ 992px 上方另有報頭列 96px（＋1px 髮絲線），捲動後收起」。
6. （522）sticky 偏移的清單：篩選側欄、文章目錄、訂閱摘要、個人頁側欄、編輯器設定面板、本頁目錄 → 文章左欄、訂閱摘要、編輯器設定面板、本頁目錄。
7. （530～541）各頁欄數配置的比例條改成：首頁頭條 5｜3｜4、社論欄：主題索引 4｜8、精選 6｜3｜3（≥ 1400px）、深藍帶 8｜4；文章列表 2｜7｜3（篩選橫列在上）；文章內頁 左欄｜閱讀欄 ≤ 700px｜頁邊註；方案頁價目表 3｜3｜3｜3；結帳 4｜4｜4（992～1199px 為 3：4：5）；FAQ 6｜6；個人頁 12（索引列在上）；編輯器 8｜4；訂閱狀態卡 4｜8。
8. （556）平面：拿掉「收藏卡」。
9. （557）強調的平面：付款方式卡 → 帳號設定（結帳表單已不加框，帳號設定改成 2px 深藍頂線）。
10. （558）浮起（中）：拿掉「訂閱摘要（≥ 992px）」。
11. （730）主題卡說明：改成篇數與最新更新一直顯示；hover 或 focus 只換成霧白紙底、主題名加底線，不改變尺寸。
12. （774）主題卡 hover：霧白紙底＋頂端深藍線＋展開篇數 → 霧白紙底＋主題名底線。
13. （1102）申請表（側欄有「申請成為作者」入口）→ 申請表（個人頁導覽有「申請成為作者」入口）。
14. （1211）側欄群組 → 導覽群組。
15. （1494，md 列）「為什麼值得訂」與主題卡 2 欄 → 「為什麼值得訂」2 欄、主題索引的篇數移到右側。
16. （1495，lg 列）整句改成：頁首變成報頭列＋導覽列；篩選變成列表上方的篩選橫列；文章左欄（目錄）出現；結帳 3 欄、摘要 sticky；個人頁的下拉導覽變成標題下方的索引列；價目表 4 欄，與比較矩陣對齊；數據卡 4 欄。工具列、底部行動列、編輯器、矩陣不需捲動照舊；拿掉「主題卡 hover 展開」。
17. （1496，xl 列）拿掉「數據卡 4 欄」，改放在 lg 列。
18. （1497，xxl 列）Hero 大標 56px → 60px，並補上「文章圖說移到頁邊」。
19. （362、378、382）字級表三列改成頁面實際的字級：「H1 頁面標題」40px ‧ 1.4 → 28 → 36px ‧ 1.3 ‧ 頭條 `.np-hl-1`；「文章列表標題」22 → 24px ‧ `.article-item-title` → 20 → 22px ‧ 次條 `.np-hl-2`（帳冊列 `.article-list.is-ledger`）；「卡片標題（精簡卡、收藏卡）」18–19px ‧ 1.5 → 短訊與延伸閱讀 17px（`.np-hl-3`）／首頁次條 20 → 22px（`.np-hl-2`）／收藏卡 18px ‧ 行高 1.45–1.55。這三列示範字樣的 HTML 不動，改在 `pages/_guideline.scss` 讓它們套 `.np-hl-1`／`-2`／`-3`，示範和寫的數字一致。
20. （1505，lg 列）補上「我的收藏的帳冊列分成眉標｜標題｜進度｜封面四格」。
21. （1506，xl 列）拿掉「收藏卡 3 欄」（我的收藏改成帳冊列，不再分欄）。

2026-11-17 另依使用者決定，Guideline 列舉頁面的地方補上 2026-11 的新頁（和上面的報刊排版修正分開，其他內容不動）：

- 各頁欄數配置多 3 條比例條：登入、忘記密碼 7｜5（992～1199px 為 6：6）、註冊 3｜5｜4（992～1199px 為標題與表單 7：摘要 5）、作者個人頁 3｜9。
- 容器與區塊的 sticky 偏移清單加「作者個人頁左欄」。
- RWD 表：md 列加作者個人頁頭像 64 → 96px、頭像｜文字兩欄；lg 列加登入與忘記密碼 6｜6、註冊 7｜5（以下單欄、最寬 34rem）、作者個人頁 3｜9 與作者資訊 sticky；xl 列加登入與忘記密碼 7｜5、註冊三欄 3｜5｜4、忘記密碼的 3 個示意一列三格。
- 狀態文案表 S01 的出現位置加「登入頁（設計稿狀態示意）」。

Guideline 狀態表的「側邊導覽」列描述的是直排元件（Guideline 示範與 992px 以下的下拉仍是這樣）；個人頁 ≥ 992px 的索引列是同一組 `.acct-nav` 橫排，權限群組的色條改畫在頂端。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、字體、長文字級、間距、圓角、元件、報頭雙線與圖表色、報刊排版的 token）
3. `bootstrap/scss/bootstrap`
4. `bootstrap-icons`：圖示字型（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字體、區塊節奏、按鈕、表單、分段控制、標籤、提示框、空狀態、資料表、焦點，以及 `rule-double` mixin
6. `components/*`：報刊排版（`_newsprint`，需要 `rule-double`，所以放在 `_base` 之後、其他元件之前）、頁首、頁尾、徽章、頭像、文章卡、長文、圖表、付費牆、方案、個人頁元件、編輯器、設計稿示意
7. `pages/*`：各頁專屬樣式，class 一律加頁面前綴（`home-`、`articles-`、`article-`、`pricing-`、`acct-`、`gl-`、`auth-`、`author-`）

原則是**先用 Bootstrap 的變數與工具類別**，做不到才寫自訂 CSS，而且自訂 CSS 只引用變數，不寫死色碼。

### 共用類別

| 類別 | 用途 | 位置 |
|---|---|---|
| `@include rule-double`、`.rule-double` | 報頭雙線（2px 粗線＋2px 白隙＋1px 細線），本風格的招牌 | `_base.scss` |
| `.np-grid` | ≥ 992px 的 12 欄網格（欄距 `$np-col-gap` 32px） | `components/_newsprint.scss` |
| `@include np-col-rule`、`.np-col-rule` | 欄線：畫在某一欄左側欄距正中央；992px 以下改上方髮絲線（`$stacked: false` 時不加） | `components/_newsprint.scss` |
| `@include np-col-line($n)`、`np-col-line-x($n)` | 貫通外層 12 欄 grid 的欄線（第 `$n` 欄之後）；登入、註冊、忘記密碼、作者頁 | `components/_newsprint.scss` |
| `.section-head`、`@include np-flag`、`.section-sub` | 欄目標頭：頂端報頭雙線 → H2＋副標（同一列）→ 右側動作 → 髮絲線 | `components/_newsprint.scss`、`_base.scss` |
| `.np-hl-1`／`-2`／`-3`（同名 mixin） | 頭條／次條／短訊 | `components/_newsprint.scss` |
| `.np-databox`、`.np-databox-unit`、`@include np-databox`／`np-databox-rows`／`np-databox-cols($n)` | 數據框：頂端雙線、項目之間髮絲線，逐列或橫排 | `components/_newsprint.scss` |
| `.np-margin-note` | 頁邊註：≥ 1400px 圖說移到閱讀欄右側（所在的 figure 要是定位父層） | `components/_newsprint.scss` |
| `.section`、`.section-alt`、`.section-dark` | 區塊上下留白 52／72px、霧白紙底（目前頁面沒有使用，保留）、深藍帶 | `_base.scss`、`pages/_home.scss` |
| `.page-header`、`.page-lead` | 報刊版頭：麵包屑 → 2px 粗線 → H1（頭條字級）→ 說明；文章列表、個人頁共用 | `_base.scss` |
| `.figure-num`、`.num`、`.meta` | Newsreader 大數字（價格、到期日、數據卡）；等寬數字；「字數 ‧ 閱讀時間 ‧ 日期」中繼資料列（每一項前面畫固定寬度的「‧」，整列左移同樣寬度再用 `clip-path` 切掉，換行時「‧」不會留在行首） | `_base.scss` |
| `.text-phrase` | 標題只在空白與 `<wbr>` 處換行 | `_base.scss` |
| `.btn-primary`／`.btn-outline-primary`／`.btn-text`／`.btn-light`／`.btn-outline-light` | 主要、次要、文字連結、深藍帶上的主要與次要；停用保留原尺寸 | `_base.scss` |
| `.segmented`（`.segmented-sm`） | 分段控制：月／年、字級、付費層級、統計期間 | `_base.scss` |
| `.tag`（`.is-selected`、`.is-zero`）、`.tag-list` | `#標籤` 小框：一般、選中、0 篇 | `_base.scss` |
| `.callout`（`-success`、`-warning`、`-danger`、`-brand`）、`.callout-actions` | 提示框：左側色條＋圖示＋文字（＋一個按鈕） | `_base.scss`、`pages/_pricing.scss` |
| `.empty-state` | 空狀態：圖示＋一句說明＋一個下一步按鈕 | `_base.scss` |
| `.table-data` | 資料表：外框、表頭霧白紙底、數字欄靠右、外層 `.table-responsive` | `_base.scss` |
| `.perm`（`-premium`、`-free`、`-draft`、`-removed`）、`.kicker` | 權限徽章（放在標題前）與分類列 | `components/_badges.scss` |
| `.status`（`.is-success`、`-warning`、`-danger`、`-info`、`-brand`、`-neutral`）、`.role-chip` | 狀態徽章（圖示＋文字＋顏色）；設計稿用的角色標記 | `components/_badges.scss` |
| `.avatar`（`.avatar-24`～`-96`、`.avatar-initial`）、`.author-line` | 方形頭像（照片／字首）、作者列 | `components/_avatar.scss` |
| `.article-item`、`.article-list`、`.story`（`.story-with-thumb`） | 文章列表的一列；精簡文章卡（首頁次要精選、延伸閱讀） | `components/_article-card.scss` |
| `.byline-item`、`.byline-sep`（放在 `.story-byline` 裡） | 首頁次條、短訊的署名列：姓名｜職稱｜閱讀時間；每段前面的「｜」固定寬度，整列左移再用 `clip-path` 切掉，換行時「｜」不會留在行首 | `pages/_home.scss` |
| `.article-list.is-ledger` | 帳冊列：≥ 992px 眉標 2｜主文 7｜縮圖 3、主文兩側欄線；沒有 `.article-item-thumb` 時自動變成眉標 2｜主文 10；768～991px 眉標在上、主文 2｜縮圖 1；767px 以下單欄不放縮圖。12 欄相對於列表自己的寬度，放進 9 欄區塊也能用 | `components/_article-card.scss` |
| `.articles-masthead`（`-body`、`-title`）、`.articles-search` | 文章列表的分類版頭：H1＋說明｜搜尋列 | `pages/_articles.scss` |
| `.articles-filter`（`-head`、`-title`、`-actions`）、`.filter-group`、`.filter-options` | 篩選橫列（≥ 992px）／篩選抽屜（992px 以下，同一份 HTML） | `pages/_articles.scss` |
| `.articles-count`、`.articles-pagination` | 筆數、分頁（對齊帳冊列的主文欄；作者頁沿用） | `pages/_articles.scss` |
| `.article-layout`、`.article-aside`、`.aside-databox`、`.aside-size` | 文章內頁的左欄｜閱讀欄；左欄的閱讀進度數據框與字級切換 | `pages/_article.scss` |
| `#article-body` 首字放大與 h2 短線 | 第一段首字放大 2 行、h2 上方 3rem 深藍短線；只寫在 `#article-body` 底下，編輯器與 Guideline 的 `.prose` 不受影響 | `pages/_article.scss` |
| `.prose`（`.prose-sm`、`.prose-lg`）、`.pull-quote`、`.lede` | 長文排版（最大寬 700px、行高 1.9）、引言區塊、導言 | `components/_prose.scss` |
| `.exhibit`（`-head`、`-label`、`-title`、`-unit`、`-source`、`.exhibit-dark`）、`.exhibit-table`、`.hbar-chart`、`.stat-strip` | 圖表、圖表內的表格、橫條圖、數據卡列（≥ 992px 4 欄、頂端雙線） | `components/_exhibit.scss` |
| `.paywall`、`.paywall-tail`、`.paywall-fade`、`.radio-card`、`.save-tag` | 付費預覽牆（漸層 140px＋訂閱卡）、選項卡 | `components/_paywall.scss` |
| `.plan-grid`、`.plan-card`（`.is-featured`）、`.plan-flag`、`.benefit-list`、`.compare`、`.compare-table`、`.mark-yes`／`.mark-no`／`.mark-na` | 方案卡、推薦標籤、權益清單、細線比較矩陣與 ✓／✗／—（Guideline 也用這一組） | `components/_plans.scss` |
| `.pricing-ratecard`、`@mixin plan-col` | 價目表（≥ 992px 4 欄等寬、欄線，方案列用 subgrid 對齊）；`plan-col` 去掉方案卡的框、底色與陰影 | `components/_plans.scss` |
| `.pricing-crumb` | 方案頁的麵包屑（間距同 `.page-header`） | `pages/_pricing.scss` |
| `.checkout-grid`、`.checkout-pay`、`.checkout-summary` | 結帳 3 欄（付款方式｜信用卡欄位＋同意｜訂閱摘要 sticky） | `pages/_pricing.scss` |
| `.faq-col` | FAQ 的左右兩欄（都在 `#faqList.accordion` 裡，一次只開一題） | `pages/_pricing.scss` |
| `.sub-card`、`.sub-mini`、`.library-card`（`-main`、`-side`）、`.cancel-modal`、`.review-card`、`.reject-quote` | 訂閱狀態卡（4｜8、頂端雙線、不加框）、其他訂閱狀態小卡、收藏帳冊列（≥ 992px 眉標 2｜標題 5｜進度與按鈕 3｜封面 2，放在 `.library-list` 裡）、取消對話框、申請審核卡 | `components/_account-ui.scss` |
| `.apply-layout`、`.apply-form`、`.apply-row`、`.apply-field`、`.apply-submit`、`.apply-margin` | 成為作者：帳冊式申請表（每個欄位一列「標籤 3｜欄位 9」）＋右側頁邊欄的申請狀態示意 | `pages/_account.scss` |
| `.account-head-body`、`.acct-index`、`.acct-nav`（`-group`、`-title`、`-link`） | 個人頁版頭（H1｜角色切換器）；≥ 992px 索引列（`.acct-nav` 橫排只寫在 `.acct-index` 底下） | `pages/_account.scss` |
| `.acct-reminders`、`.acct-settings` | 提醒兩則並排（768px 起）；帳號設定兩欄、欄線分隔、2px 頂線 | `pages/_account.scss` |
| `.editor-sheet`、`.bubble-toolbar`、`.preview-divider`、`.insert-menu`、`.editor-panel`、`.check-list` | 編輯器元件 | `components/_editor.scss` |
| `.auth-page`、`.auth-sheet`（`.is-register`）、`.auth-card`、`.auth-head`、`.auth-body`、`.auth-title`、`.auth-lead` | 表單頁（2026-11 補，Guideline 沒有）：頂端粗線 → 左 H1＋說明｜欄線｜右 表單；`.is-register` 是註冊頁的三欄（標題｜表單｜權益摘要）。992px 以下單欄、最寬 34rem | `pages/_auth.scss`（登入、註冊、忘記密碼共用） |
| `.auth-label-row`／`.auth-forgot`、`.auth-terms`、`.auth-switch`、`.auth-resend` | 密碼標籤列右側的「忘記密碼？」（44px 點擊範圍、不撐高）、同意條款、切換連結（髮絲線下方）、句中的「重新寄送」 | `pages/_auth.scss` |
| `.auth-notes`（`.is-trio`）、`.auth-demo`、`.auth-stage-title`、`.auth-stage-lead` | 表單頁的設計稿狀態示意：髮絲線下方橫排（每格最窄 18rem）；`.is-trio` 是忘記密碼的 3 個示意；註冊頁欄位錯誤示意；設定新密碼示意的小標與說明 | `pages/_auth.scss` |
| `.auth-plan` | 註冊頁的免費會員權益摘要：沿用 `.plan-name`、`.plan-price`、`.plan-fit`、`.benefit-list`，不加框、不加底色、沒有按鈕 | `pages/_auth.scss` |
| `.author-crumb`、`.author-sheet`、`.author-profile`（`-avatar`、`-head`、`-title`、`-job`、`-body`、`-bio`、`-follow`） | 作者個人頁（2026-11 補，Guideline 沒有）：專欄作家版 3｜9；左欄作者資訊 sticky | `pages/_author.scss` |
| `.author-articles`、`.author-articles-head`、`.author-articles-count`、`.author-demo` | 作者頁右欄：欄名＋筆數 → 帳冊列（沿用 `.article-list.is-ledger`，不放縮圖與作者列，標題用 h3，分類連到文章列表）→ 分頁 → 空狀態示意 | `pages/_author.scss` |
| `.demo-switch`、`.demo-state`（`-title`、`-note`）、`.demo-stage`、`.demo-caption`、`[data-show-view]`、`[data-show-role]` | 設計稿切換器、設計稿狀態示意、依狀態顯示／隱藏；`.row` 的欄裡是「小標＋舞台」時，舞台填滿小標下方的高度（不凸出虛線框） | `components/_demo.scss` |

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 面 | 純白 `$paper #FFFFFF`（頁面底、卡片）、霧白紙 `$mist #F3F5F8`（表頭、推薦欄淡底、hover 底、頁尾）、深藍淡底 `$oxford-tint #E8EDF4`（選中、目前項目、洞察） |
| 深藍 | 牛津深藍 `$oxford #002147`（品牌、標題、主要按鈕、報頭雙線、訂閱限定、圖表主系列，16.05:1）、深藍 hover `#0B3A6E` |
| 文字 | 墨色 `$ink #1B2430`（內文 15.65:1）、石板灰 `$slate #4A5868`（次要 7.27:1）、淡石板 `$slate-light #5F6C7B`（placeholder、圖說 5.36:1） |
| 線 | 髮絲線 `$rule #D5DBE3`（分隔、欄線，裝飾）、深髮絲線 `$rule-strong #AEB8C5`、表單框線 `$control #8792A2`（3.15:1） |
| 第二冷色 | 天青藍 `$cerulean #1D64A8`：只給「免費」權限、資訊提示與圖表第二系列（6.10:1） |
| 狀態色 | 綠 `#1C7547`、琥珀 `#8A5300`、緋紅 `#B3261E`，各有淡底（狀態字在淡底上 ≥ 5:1）；一律搭配圖示與文字 |
| 深藍帶 | 白字（16.05:1）、淡藍灰 `#C9D3E0`（10.61:1）、欄線 `#33507A` |
| 字體 | Newsreader（英數、大數字）＋ Noto Serif TC 400／700／900（中文標題、長文）＋ Noto Sans TC 400／500／700（介面） |
| 長文 | 最大寬 700px；內文 18px／1.9；Aa 三段 17／18／20px，行高 1.95／1.9／1.85（手機不下調）；導言 20px／1.85 |
| 報刊排版 | 欄距 `$np-col-gap` 32px；頭條 2.25／1.75rem、次條 1.375／1.25rem、短訊 1.0625rem；通欄大標 `$np-banner-sizes` 1.95 → 3.75rem |
| 圓角 | 全部 0（報刊直角），頭像也是方形；只有 radio、開關是圓的 |
| 陰影 | 只給蓋在內容上的層：付費牆卡與對話框 `$box-shadow-lg`；下拉選單、浮動工具列、插入選單 `$box-shadow` |
| 焦點 | 2px 白隙＋2px 深藍外圈（`$focus-ring-double`） |
| 版面 | 容器最大 1296px（內距 20／32px）；頁首＝報頭列 96px（≥ 992px，捲動收起，`$masthead-height`）＋固定導覽列 73px（導覽列 68px＋雙線 5px）；sticky 偏移 97px |

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
