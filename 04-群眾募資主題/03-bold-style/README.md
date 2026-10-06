# 03｜大膽新潮酷品：島造 ISLANDMAKE 在地製造提案平台

> 高對比＋鮮豔單色（亮黃、深黑、奶白）。達成率以超大 Bold 數字直擊眼球，回饋選項採粗黑厚邊框（Neo-brutalism）。

概念是「募資告示板」：把島造想成貼滿提案海報的社區告示板。奶白是紙、深黑是墨、亮黃是螢光貼紙；所有東西都有 3px 深黑粗框，浮起來的面帶一道 0 模糊的硬陰影。大膽只花在兩件事——**黑底黃字的超大達成率**，和**像票券一樣的粗框回饋方案**（選中時塗滿亮黃、被「按下去」並蓋上勾勾章）；超額的進度條在目標之後疊上斜線網紋。其他地方保持安靜：內文用穩定的 Noto Sans TC、大量留白，狀態色只出現在徽章與提示框。

和 01 電商的街頭機能風（水泥灰＋螢光青綠、直角細框）刻意分開：這套是奶白紙面、14px 圓角、亮黃大色塊（每頁的頁面標題區、首頁 Hero 面板、「正在發生的提案」整區）與超大窄體數字。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（架構同 `../../01-電商主題/01-luxury-style/`）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。只有一套淺色主題，不使用 `data-bs-theme`；作業系統切成深色模式時畫面維持原樣（`color-scheme: light`）。
- **JS**：互動都交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的六個小功能。圖表是 inline SVG 與 HTML／CSS，沒有圖表套件。

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

| 頁面 | 檔案 | 樣式 | 頁面底部的「設計稿狀態示意」 |
|---|---|---|---|
| 設計 Guideline | `guideline.html` | `scss/pages/_guideline.scss` | （本身就是元件與狀態總覽：招牌元素＋9 章） |
| 首頁 | `index.html` | `scss/pages/_home.scss` | — |
| 專案列表 | `projects.html` | `scss/pages/_projects.scss` | S6 篩選無結果 |
| 專案細節與贊助方案選擇（以「一只走十年的台南帆布包」示範） | `project.html` | `scss/pages/_project.scss` | 募資尚未開始（S3）、已結束成功（S4）、已結束失敗（S5）、未登入點擊贊助（S1）、付款失敗（S10）、未選擇方案、里程碑逾期（S16）、留言區為空（S9）；生產排程區內另有 Notion 的「延遲狀態範例」 |
| 個人頁面「我的島造」 | `account.html` | `scss/pages/_account.scss` | 5 種贊助狀態徽章、贊助紀錄為空（S7）、追蹤清單為空（S8）、提案募資失敗、已下架（S14）、提案者尚無專案（S15） |

頁面上沒有列出所有頁面的導覽：從首頁依流程點進各頁即可，Guideline 直接開 `guideline.html`。

- **專案細節只做一頁**：首頁與列表的所有專案卡都連到 `project.html`。
- **回饋方案真的可以選**：預設選「標準單入組」；換方案時贊助小計與自訂金額的最低金額會更新，＋500／＋1,000／＋2,000 會加到金額上，低於方案金額時顯示錯誤並停用「下一步」。已額滿的「早鳥單入組」留在頁面上但不能選。
- **個人頁的兩種角色**：預設是提案者（所有區塊都看得到）；頁面標題區右側的「以贊助者檢視」，或直接開 `account.html?role=backer`，會切到一般會員的畫面（沒有提案群組、有「申請成為提案者」入口，「我的提案」位置改成權限提示 S17）。
- **贊助紀錄的分頁真的會篩選**：全部／募資中／等待出貨（已達標待生產＋生產中）／已完成／已退款。

## 檔案結構

```
03-bold-style/
├─ *.html                    ← 5 個頁面，每頁完整包含頁首與頁尾
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的六個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 23 張 AI 生成圖（檔名同主題的 IMAGES.md）＋ favicon.svg
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫
│  ├─ _base.scss             ← 全站基礎與共用類別（數字、進度條、徽章、提示框…）
│  ├─ components/            ← 頁首、頁尾、專案卡、回饋方案、時間軸、圖表、留言、個人頁導覽
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾是否與範本一致
   └─ generate-images.mjs    ← 生圖腳本（STYLE 與 23 張圖的 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾每頁一份**：沒有元件系統，所以 5 個頁面各自完整寫一份。要改頁首或頁尾時，先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check`。每頁只有一處不同：頁首導覽的目前頁（`active` 與 `aria-current="page"`）。專案細節標「探索專案」但不加 `aria-current`；Guideline 不標示。`npm run check` 會一起檢查這兩條規則。
- **新增頁面**：複製範本成新頁，改 `<title>`、description 與頁首的目前頁標示；在 `scss/pages/` 新增 partial、在 `scss/main.scss` 加一行 `@import`，執行 `npm run check`。
- **假資料直接寫在 HTML**：文案逐字取自主題的 `../CONTENT.md`（Notion），Notion 沒有的數字用它的附錄 B（三套風格一致）。同一個專案會出現在首頁、列表、專案細節與個人頁，帆布包的數字（NT$ 1,235,600／目標 NT$ 500,000／247%／1,042 人／剩 12 天）改動時要多頁同步。
- **JS**：`js/main.js` 只做六件事：手機搜尋列展開後自動聚焦、分頁籤切換時把目前項目捲進畫面、追蹤按鈕切換 `aria-pressed`、回饋方案選取與贊助小計（只在 `#rewardForm` 存在時執行）、贊助紀錄篩選（`data-filter` 按鈕對應卡片的 `data-status`）、個人頁角色切換（`data-role`＋`?role=backer`）。其他互動（選單、分頁、輪播、下拉、側邊浮層、ScrollSpy、FAQ）都靠 Bootstrap 的 `data-bs-*`。
- **換行與空白**：專案名稱、標題用 `.text-phrase`＋`<wbr>` 標出詞組斷點；數字與單位之間用 `&nbsp;`（`1,042&nbsp;人`、`12&nbsp;天`）。
- **語意化數字**：金額、達成率、人數用 `<data value>`，募資期間與日期用 `<time datetime>`。
- **表單**：設計稿沒有後端。「下一步：填寫收件資訊」不換頁（`main.js` 攔下 submit）；沒有目的頁的按鈕用 `<button type="button">`，連結用不帶 `href` 的 `<a>`。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、語意色調、字體、間距、框線、圓角、硬陰影、元件）
3. `bootstrap/scss/bootstrap`：用上面的變數編譯出整套 Bootstrap
4. `bootstrap-icons`：圖示字型與 class（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字體、區塊節奏、按鈕、焦點，以及下表的共用類別
6. `components/*`：頁首、頁尾、專案卡、回饋方案、時間軸、圖表、留言、個人頁導覽
7. `pages/*`：各頁專屬樣式，class 一律加頁面前綴

原則是**先用 Bootstrap 的變數與工具類別**，真的做不到才寫自訂 CSS，而且自訂 CSS 也只引用變數，不寫死色碼（SVG 圖表也一樣：顏色由 class 與 CSS 變數決定）。

### 共用類別

| 類別 | 用途 | 位置 |
|---|---|---|
| `.page-head`、`.page-title`、`.page-lead`（`.page-head-slim`） | 首頁以外各頁的亮黃頁面標題區：麵包屑 → h1 → 一句說明；專案細節只有麵包屑 | `_base.scss` |
| `.section`、`.section-tight`、`.section-yellow`、`.section-sand`、`.section-ink`、`.section-heading` | 區塊上下留白 48／72px（緊湊 32／48px）、三種色塊區塊（上下 3px 深黑線）、區塊標題＋副標＋右側連結 | `_base.scss` |
| `.mega-pct`（`.mega-pct-unit`） | ★ 超大達成率：Bricolage 窄體 800，字級用 `--mega-size` 調 | `_base.scss` |
| `.num-display`、`.amount`、`.num` | 獨立的大數字（比例字寬）、金額、需要上下對齊的數字（等寬） | `_base.scss` |
| `.fund-bar`（`.is-full`、`.is-over`、`-lg`、`-sm`）、`.fund-scale` | ★ 募資進度條：未達標 `style="--fund: 68%"`、剛好達標、超額 `style="--target: 40.5%"`（目標刻度＋斜線網紋）；三種尺寸 | `_base.scss` |
| `.badge-state.is-live／info／warn／ok／err／idle`（`.is-dashed`、`.is-lg`） | 狀態徽章：色塊底＋2px 深黑框＋圖示＋文字；`.text-ok` 等是淺底上的狀態文字色 | `_base.scss` |
| `.tag`、`.tag-ink` | 一般標籤（分類、地點）、疊在圖片上的深黑標籤 | `_base.scss` |
| `.callout.is-*`（`.callout-icon`、`.callout-title`） | 提示框：粗框＋語意底色＋左側圖示，不加關閉鈕 | `_base.scss` |
| `.stat-tile`（`.is-ok`）、`.stat-value`、`.stat-strip` | 數據卡、Notion 一行文字拆成的統計列 | `_base.scss` |
| `.chip`、`.chip-applied`、`.btn-check` | 篩選標籤（選中＝亮黃＋勾勾＋小硬陰影）、已套用標籤＋移除鈕 | `_base.scss` |
| `.btn-primary`、`.btn-dark`、`.btn-outline-dark`、`.btn-outline-light`、`.btn-text`、`.btn-icon`、`.btn-follow` | 主要（亮黃＋硬陰影）、強調（深黑）、次要（粗框）、深色底次要、文字連結、44px 圖示鈕、追蹤（`aria-pressed`） | `_base.scss` |
| `.pop` | 可點的卡片 hover／focus 時往左上浮起、出現 8px 硬陰影 | `_base.scss` |
| `.avatar`（`.avatar-letter`、`.avatar-lg`） | 照片頭像、名字第一個字的文字頭像 | `_base.scss` |
| `.empty-state`、`.demo-state`、`.demo-case` | 空狀態（icon → 一句話 → 一個動作）、頁面底部的「設計稿狀態示意」（3px 虛線分隔） | `_base.scss` |
| `.text-phrase`、`.bleed-x`、`.scroll-x`、`.table-bold` | 詞組不拆行、手機橫向捲動列貼齊螢幕、橫向捲動容器、粗框數據表 | `_base.scss` |
| `.project-card`、`.project-row`（`-media`、`-flags`、`-figures`…） | 首頁的格狀專案卡、列表的橫式專案列 | `components/_project-card.scss` |
| `.reward-tier`（`.is-low`、`.is-soldout`）、`.pledge-*` | ★ 回饋方案票券（可選、已選取、即將額滿、已額滿）、自訂金額與贊助小計 | `components/_reward-tier.scss` |
| `.milestones`、`.milestone.is-done／is-live／is-todo／is-late` | 垂直生產時間軸（進行中節點脈動，減少動態時停止） | `components/_milestone.scss` |
| `.chart-card`（`.is-dark`）、`.chart-svg`、`.hbar-*`、`.chart-table` | 圖表卡：inline SVG 折線／面積、HTML 橫條、表格檢視；`.is-dark` 換成深色底配色 | `components/_chart.scss` |
| `.comment`、`.comment-reply`、`.comment-composer` | 留言兩層結構、提案者回覆（淡黃底） | `components/_comment.scss` |
| `.account-nav`、`.upgrade-card`、`.for-proposer`／`.for-backer` | 個人頁側邊導覽、角色升級入口、依 `data-role` 顯示的區塊 | `components/_account-nav.scss` |

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 面 | 奶白 `$cream #FFF8E7`（頁面底）、紙白 `$paper #FFFDF6`（卡片、輸入框）、沙色 `$sand #F2EAD3`（交替區塊、數據卡、表頭） |
| 墨 | 深黑 `$ink #111111`（文字、粗框、硬陰影、頁尾，17.8:1）、淺黑 `$ink-soft #2A2A2A`、灰墨 `$ink-muted #5A5446`（次要文字 7.1:1）、細線 `$rule #CFC6AE`（裝飾） |
| 亮黃 | `$yellow #FFD60A`：大色塊、主要按鈕、選中、進行中（上面放深黑字 13.4:1）；淡黃 `$yellow-pale #FFF1B8`：hover、提案者回覆。亮黃不當文字色（在奶白上 1.3:1） |
| 語意色調 | 底色＋深黑字（皆 ≥ 7:1）／淺底文字色：live `#FFD60A`、info `#A9C8FF`／`#1747B5`、warn `#FFA24C`／`#8F4A00`、ok `#7FDB9B`／`#0F6B34`、err `#FF7A6B`／`#B42318`、idle `#E6DFCC`／`#5A5446` |
| 字體 | Noto Sans TC（標題 900、內文 400、強調 700）；Bricolage Grotesque（數字、英文副字標，窄體 75%／800）。不用全大寫英文小標 |
| 框線與圓角 | 主要元件 3px、小元件 2px，一律深黑；圓角 8／10／14／20px 與膠囊 |
| 陰影 | 只有 0 模糊的硬陰影：`$shadow-sm` 3px（按鈕、選中標籤）、`$shadow` 6px（Hero 卡、儀表板、選中的方案、小計）、`$shadow-lift` 8px（卡片 hover） |
| 版面 | 容器最大 1320px、左右留白 20／32px；區塊留白 48／72px；sticky 位移 96px（頁首 72px＋24px） |
| 焦點 | 亮黃 3px 內圈＋深黑外圈（深色底上反過來）；連結與卡片是 3px 深黑外框 |
| 動態 | 卡片浮起、里程碑進行中的脈動；`prefers-reduced-motion` 時全部關閉 |

完整規範請看 `guideline.html`。改色時，Guideline 的色票 hex、對比度、`images/favicon.svg` 與 `theme-color` 也要一起改，清單見上一層 [`../README.md`](../README.md) 的「換色時同步檢查」。

## 圖片

`images/` 的 23 張圖皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意；檔名、畫面主體與 alt 照主題的 [`../IMAGES.md`](../IMAGES.md)，三套風格相同。這一套的調性是「流行雜誌式的硬閃光攝影」：高對比、銳利的深色投影、奶白高光，只在自然出現的地方點一點亮黃（工具握柄、漁工雨衣）；產品照（帆布包、餐具、筆記本、咖啡渣杯、三色布料）放在亮黃無縫背景紙上，投影往右下，呼應介面的硬陰影。替換時保持相同檔名即可，不需改程式。

```bash
npm run images                                              # 產生缺少的圖片
node scripts/generate-images.mjs --only hero-canvas-bag    # 只產生指定的圖（不含 .jpg，逗號分隔）
node scripts/generate-images.mjs --only story-bag-details --force   # 重做指定的圖
CONC=1 npm run images                                       # 並行數（預設 2）
```

換成其他風格時，改腳本裡的 `STYLE`（整組圖的共同調性）、`PRODUCT`／`SCENE`／`CANDID` 三種拍法與各張描述即可。
