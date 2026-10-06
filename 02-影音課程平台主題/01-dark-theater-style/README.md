# 01｜極致暗黑劇院：Craftory 手感工藝線上學院

> 深色系＋冷色系（深空黑、微光冷藍、純白）。95% 暗底專注介面，播放控制器僅在滑鼠懸停時發出柔光，降低視覺干擾。

概念是「熄燈後的放映廳」：每一頁的 95% 是深空黑，只有「你正在看的東西」會亮。播放器是比頁面再暗一階的純黑銀幕；控制列平常是低調的銀幕灰，滑鼠移上去或用鍵盤聚焦時，才從底部浮起一層微光冷藍。同一套「亮燈」語言延伸到課程卡與工藝情境卡：平常略暗，hover／focus 時亮起。大膽只花在**柔光控制列**這一個招牌，其他保持克制。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（與 `01-電商主題` 各風格相同架構）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。這是**單一深色主題**：直接把 Bootstrap 原本給淺色用的變數設成深色，不使用 `data-bs-theme`。
- **JS**：互動都交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的六個小功能。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西。

**要修改樣式**：

```bash
npm install        # 安裝 bootstrap、bootstrap-icons、sass，並把 Bootstrap JS 與圖示字型複製進專案
npm run watch      # 開發時：監看 scss/，存檔就重新編譯 css/style.css
npm run css        # 編譯一次
npm run build      # 交付前：重新複製 vendor 檔案＋編譯一次 CSS
npm run check      # 檢查 5 個頁面的 head、頁首、頁尾與登入對話框是否與範本一致
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
| 課程詳情（以「從零開始的手捏陶」示範，含試看） | `course.html` | `scss/pages/_course.scss` |
| 課程播放／學習頁（手捏陶 3-2） | `learn.html` | `scss/pages/_learn.scss` |

頁面上沒有列出所有頁面的導覽：依學生流程從首頁點進各頁即可（首頁 → 課程列表 → 課程詳情 →「立即購買，開始上課」→ 登入對話框 → 學習頁；頁首「我的課程」也連到學習頁）。Guideline 直接開 `guideline.html`。

課程詳情只做一頁靜態示範（從零開始的手捏陶），所有課程卡都連到 `course.html`，「免費試看」連到 `course.html#trial`。播放、續看、試看／鎖定、未登入、篩選結果這些動態功能用靜態畫面呈現，其他狀態放在各頁底部的「設計稿狀態示意」：

| 頁面 | 狀態示意 |
|---|---|
| `courses.html` | 篩選沒有結果時 |
| `course.html` | 點了鎖定單元時、已購買時（購買卡改「繼續上課」、第 1 章打勾）、未登入點擊購買時 |
| `learn.html` | 完成一章時、全課完成時、影片載入失敗時、還沒有任何課程時 |

可以實際操作的：課程章節的鎖定單元（開啟鎖定提示，「看看課程包含什麼」捲到購買卡）、「立即購買，開始上課」（開啟登入對話框並顯示未登入提示）、篩選與排序的選中狀態、評價排序切換、FAQ 與章節的展開收合、願望清單切換、學習頁分頁、續看提示的關閉、播放速度與字幕的下拉選單、手機版的篩選抽屜與章節底部抽屜。

## 檔案結構

```
01-dark-theater-style/
├─ *.html                    ← 5 個頁面，每頁完整包含頁首、頁尾與登入對話框
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的六個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 23 張課程照片（AI 生成，暗場冷光調性）、favicon.svg
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫
│  ├─ _base.scss             ← 全站基礎與共用小工具
│  ├─ components/            ← 頁首、頁尾、標籤、課程卡、工藝卡、正在播放小卡、播放器、章節清單、購買卡、評價、對話框
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾、登入對話框是否與範本一致
   └─ generate-images.mjs    ← 生圖腳本（所有圖片的 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾、登入對話框每頁一份**：沒有元件系統，所以 5 個頁面各自完整寫一份。要改時先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check`。每頁只有一處不同：頁首的目前頁（`active` 與 `aria-current="page"`）。首頁標「首頁」、課程列表標「探索課程」、課程詳情標「探索課程」但不加 `aria-current`、學習頁標「我的課程」（選單裡與桌機右側各一個）、Guideline 不標示。
- **新增頁面**：複製範本成新頁，改 `<title>`、description 與頁首的目前頁標示，並在要連進來的地方補上連結。最後在 `scss/pages/` 新增 partial、在 `scss/main.scss` 加一行 `@import`，並把頁面加進 `scripts/check-layout.mjs` 的目前頁對照表，執行 `npm run check`。
- **假資料直接寫在 HTML**：課程、講師、星等、學習人數與 28 個單元都寫死在頁面裡（`../CONTENT.md` 的 Notion 文案與 §9 補充資料）。同一門課會出現在首頁、課程列表與 Guideline 的課程卡，手捏陶的單元同時出現在課程詳情與學習頁，改資料時要多頁同步。
- **JS**：`js/main.js` 只做六件事：手機搜尋列展開後自動聚焦、登入對話框依觸發按鈕顯示未登入提示（`data-auth-context="purchase"`）、鎖定提示的按鈕關閉對話框後捲到購買卡（`data-scroll-after-dismiss`）、課程列表依網址 `?craft=` 預先選好工藝分類、學習頁側欄「全部收合」（`data-collapse-all`）、分頁籤用方向鍵切換時把目前項目捲進畫面。其他互動（選單、分頁、下拉、抽屜、對話框、Toast、Accordion）都靠 Bootstrap 的 `data-bs-*` 屬性。
- **換行與空白**：課程名稱在「｜」之後用 `<wbr>` 標出斷點，搭配 `.text-phrase`，只在詞組之間換行；數字與單位之間用 `&nbsp;`（`4&nbsp;小時 20&nbsp;分`、`NT$&nbsp;2,480`）。
- **表單**：設計稿沒有後端。登入對話框的表單 `action="learn.html"`（視為登入成功），欄位沒有 `name`，送出時網址不會帶上帳號密碼；課程問答送出後回到本頁。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、字體、間距、圓角、元件、柔光 token）
3. `bootstrap/scss/bootstrap`：用上面的變數編譯出整套 Bootstrap
4. `bootstrap-icons`：圖示字型與 class（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字距、換行規則、焦點樣式、區塊與頁首節奏，以及下表的共用類別
6. `components/*`：頁首、頁尾、標籤、課程卡、工藝卡、正在播放小卡、播放器、章節清單、購買卡、評價、對話框
7. `pages/*`：各頁專屬樣式，class 一律加頁面前綴（`home-`、`courses-`、`cd-`、`learn-`、`gl-`）

原則是**先用 Bootstrap 的變數與工具類別**，真的做不到才寫自訂 CSS，而且自訂 CSS 也只引用變數，不寫死色碼。想換風格，主要改 `_variables.scss`。

### 共用類別

下面這些類別跨頁共用，新頁面直接套用，不要在 `pages/*` 另寫一份。用法與示範都在 `guideline.html`。

| 類別 | 用途 | 位置 |
|---|---|---|
| `.player`（`.is-paused`／`.is-playing`／`.is-loading`／`.is-error`／`.is-lit`） | ★ 招牌：柔光控制列的播放器。靜止時控制列銀幕灰；`:hover`、`:focus-within` 時亮起冷藍柔光；觸控裝置（`hover: none`）直接亮起；`.is-lit` 固定成亮起狀態（Guideline 用）。內含 `.player-caption`、`.player-bigplay`、`.player-controls`、`.player-progress`（`--played`、`--buffered`、`.player-progress-mark` 已觀看位置）、`.player-toast`（續看提示）、`.player-message`（載入中／失敗） | `components/_player.scss` |
| `.lit`、`.lit-media`（`.is-lit`） | 亮燈：卡片平常略暗，hover／focus 時亮起並浮出冷藍柔光 | `_base.scss` |
| `.course-card` | 課程卡：封面＋時長、分類與難度、課程名稱、講師文字頭像、星等與學習人數、價格＋「免費試看」 | `components/_course-card.scss` |
| `.craft-card` | 工藝情境卡：hover／focus 浮現課程數與最短完課時間，觸控裝置直接顯示 | `components/_craft-card.scss` |
| `.now-playing` | 首頁 Hero 右下的「正在播放」小卡 | `components/_now-playing.scss` |
| `.unit`（`.is-trial`／`.is-playing`／`.is-locked`／`.is-done`／`.is-todo`）、`.unit-list` | 單元列（課程詳情與學習頁共用），每一種狀態都有圖示＋視覺隱藏的狀態文字 | `components/_curriculum.scss` |
| `.curriculum`、`.chapter`、`.chapter-toggle`、`.chapter-state` | 課程詳情的章節 Accordion；學習頁側欄的章節清單（可多章展開） | `components/_curriculum.scss` |
| `.chip`（`-cat`、`-level`、`-duration`、`-trial`、`-lock`、`-playing`、`-done`、`-progress`、`-draft`、`-live`、`-off`） | 標籤：分類、難度、時長、試看、鎖定、播放中、已完課、學習進度、講師課程狀態 | `components/_chips.scss` |
| `.purchase-card`（`.is-owned`）、`.btn-wish` | 購買卡；願望清單按鈕（`data-bs-toggle="button"` 切換文字與愛心） | `components/_purchase-card.scss` |
| `.rating-summary`、`.rating-bars`、`.review-card`、`.stars`、`.rating` | 評價總覽、五段分佈、評價卡、星等 | `components/_rating.scss`、`_base.scss` |
| `.auth-hint`、`.locked-dialog` | 登入對話框的未登入提示、單元鎖定提示 | `components/_dialogs.scss` |
| `.page-header`（`.is-compact`）、`.page-lead` | 內頁的頁首：麵包屑 → h1 → 一句說明 | `_base.scss` |
| `.section`、`.section-alt`、`.section-heading`、`.section-heading-link` | 區塊上下留白 64／96／112px、放映室底色區塊、區塊標題＋右側連結 | `_base.scss` |
| `.text-phrase` | 課程名稱與短標題只在空白與 `<wbr>` 處換行；不要用在長段落 | `_base.scss` |
| `.meta-list` | 拆開排的多項資訊（課程資訊標籤列），768px 以上用細直線分隔 | `_base.scss` |
| `.avatar-text` | 講師的文字頭像（姓） | `_base.scss` |
| `.btn-text` | 文字連結型按鈕，內建 44px 觸控高度 | `_base.scss` |
| `.num`、`.price`、`.timecode`、`.font-display` | Jost 等寬數字：人數、價格、片長與時間碼 | `_base.scss` |
| `.demo-state`、`.demo-state-tag`、`.demo-state-item`、`.demo-state-title`、`.demo-state-stage` | 頁面底部的「設計稿狀態示意」，以虛線和正式內容分開 | `_base.scss` |
| `.empty-state`、`.empty-state-icon` | 空狀態：圖示＋一句說明＋一個動作 | `_base.scss` |
| `.bleed-x` | 576px 以下讓橫向捲動列貼齊螢幕兩側 | `_base.scss` |

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 面 | 深空黑 `$space #06080C`（頁面底，畫面的 95%）、放映室 `$booth #0C1016`（卡片、輸入框、頁首、頁尾、對話框）、走道 `$aisle #141A23`（hover、軌道）、銀幕黑 `$screen #000`（播放器）。都帶一點藍，不用中性的 #111 |
| 線 | 髮絲線 `$line #1E2631`、深線 `$line-strong #2C3644`（裝飾用）、表單框線 `$control #5A6A7E`（非文字 3.6:1） |
| 文字 | 純白 `$white #FFFFFF`（標題、價格、片長，20:1）、霧白 `$mist #D6DCE4`（內文，14.5:1）、銀幕灰 `$silver #AAB5C3`（說明、控制列靜止，9.6:1）、暗場灰 `$dim #7E8A9A`（placeholder，5.7:1） |
| 冷藍 | 微光冷藍 `$glow #7CC8FF`（主要按鈕底、焦點環、播放中、進度，11.0:1）、冷藍淡 `$glow-soft #B5E0FF`（hover、已觀看標記）、冷藍深 `$glow-deep #3F86C4`（裝飾線、圖示圈）、冷藍紗 `$glow-veil ≈ #192632`（選中列的底）。只在「被看著」的時候出現 |
| 狀態色 | 薄荷 `$mint #74DDB9`（已完成）、琥珀 `$amber #F0C36A`（草稿）、珊瑚 `$coral #FF8E8E`（載入失敗、錯誤）；資訊用冷藍。在深色底上都達 AA |
| 柔光 | `$glow-halo-sm`（進度條、播放頭）、`$glow-halo`（卡片亮燈）、`$glow-halo-lg`（大播放鈕、主要按鈕 hover）、`$glow-rise`（控制列底部的冷光）、`$glow-transition .35s` |
| 按鈕 | 膠囊形。主要：冷藍底＋深空黑字（同一組動作只放一個）；次要：`.btn-outline-light` 純白細框；低門檻動作（免費試看）：`.btn-outline-primary` 冷藍細框 |
| 字體 | Jost（品牌字、價格、片長、時間碼、評分）＋ Noto Sans TC（中文，Display／H1／H2 用 300 細字＋寬字距，H3 以下 500，內文 400、行高 1.8）。不用全大寫眉標、不用等寬字 |
| 圓角 | 卡片、播放器、對話框 12px；輸入框 8px；按鈕、標籤膠囊；頭像、播放鈕圓形 |
| 陰影 | 深色底上看不出陰影，層級改用光：互動時冷藍柔光，浮層（對話框、下拉）才有深陰影 |
| 焦點 | 深空黑 2px 間隙＋冷藍 2px 外圈（11.0:1），純黑播放器上也看得見 |
| 版心 | `.container` 最大 1280px；學習頁放映區 `.learn-stage` 最大 1680px；頁首高 69px，sticky 位移 93px |
| 動態 | 控制列與卡片的亮起／熄滅（.35s）、「正在播放」的訊號點；`prefers-reduced-motion` 時全部關閉 |

完整規範請看 `guideline.html`。改色時，Guideline 的色票 hex、對比度與其他寫死色碼的地方也要一起改，清單見上一層 [`../README.md`](../README.md) 的「換色時同步檢查」（Guideline 色票的 hex 與對比度寫在 `guideline.html`，色塊顏色由 `scss/pages/_guideline.scss` 的 `$gl-swatches` 產生）。

## 圖片

`images/` 的 23 張圖片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名照上一層的 [`../IMAGES.md`](../IMAGES.md)，與 04、05 相同。調性是「停格的工藝紀錄片」：大部分畫面沉入深空黑，一盞冷白主光落在手與材料上，陰影與輪廓帶一點微光冷藍；材料保留原本的顏色但彩度略降，不做暖金調色。學員作品牆的兩張是手機隨手拍的質感。替換時保持相同檔名即可，不需改程式。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`：

```bash
npm run images                                            # 產生缺少的圖片
node scripts/generate-images.mjs --only hero,player-learn # 只重做指定的圖
node scripts/generate-images.mjs --force                  # 全部重做
```

codex 只輸出 3:2、2:3、1:1 三種比例，腳本會把 16:9 與 4:5 的圖置中裁切後縮放成 `IMAGES.md` 的輸出尺寸。換成其他風格時，改腳本裡的 `STYLE`（整組圖的共同調性）與各張描述即可。
