# 02｜日系無印風：NestCraft 原創生活家居選物

> 淺色系＋暖大地（米白、淺原木、亞麻灰）。極簡清爽的商品結帳清單，大面積留白，減少填寫付款資訊時的焦慮感。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（與 03 街頭機能風相同架構）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。
- **JS**：互動都交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的四個小功能。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西。

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

改完 SCSS 後重新整理瀏覽器即可。建議用 VS Code 的 Live Server 之類的擴充功能開啟，存檔會自動重新整理；直接雙擊 HTML 也可以。

## 頁面

| 頁面 | 檔案 | 樣式 |
|---|---|---|
| 設計 Guideline | `guideline.html` | `scss/pages/_guideline.scss` |
| 首頁 | `index.html` | `scss/pages/_home.scss` |
| 商品一覽 | `products.html` | `scss/pages/_products.scss` |
| 商品詳情（以橡木餐桌示範） | `product.html` | `scss/pages/_product-detail.scss` |
| 購物車 | `cart.html` | `scss/pages/_cart.scss` |
| 結帳 | `checkout.html` | `scss/pages/_checkout.scss` |
| 付款結果 | `order-result.html` | `scss/pages/_order-result.scss` |
| 登入 | `login.html` | `scss/pages/_auth.scss` |
| 註冊 | `register.html` | `scss/pages/_auth.scss` |
| 我的訂單 | `orders.html` | `scss/pages/_orders.scss` |

頁面上沒有列出所有頁面的導覽：從首頁依購物流程點進各頁即可，Guideline 直接開 `guideline.html`。

商品詳情只做一頁靜態示範（橡木餐桌），所有商品卡都連到 `product.html`。已售完、低庫存、多尺寸模式（沙發床）等變化，放在該頁底部的「設計稿狀態示意」。

我的訂單上方的狀態列（全部、待付款、已付款、出貨中、已完成、已取消）可以實際切換，點了只顯示該狀態的訂單，方便逐一檢視 5 種狀態的訂單畫面。

## 檔案結構

```
02-muji-style/
├─ *.html                    ← 10 個頁面，每頁完整包含公告列、頁首與頁尾
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的四個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 商品照、空間情境圖（AI 生成）、favicon
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫
│  ├─ _base.scss             ← 全站基礎與共用小工具
│  ├─ components/            ← 頁首、頁尾、商品卡、結帳步驟、訂單摘要
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾是否與範本一致
   └─ generate-images.mjs    ← 生圖腳本（所有圖片的 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾每頁一份**：沒有元件系統，所以 10 個頁面各自完整寫一份。要改頁首或頁尾時，先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check` 確認全部一致。每頁只有一處不同：頁首導覽的目前頁（`active` 與 `aria-current="page"`；商品詳情標「商品一覽」但不加 `aria-current`）。
- **新增頁面**：複製範本成新頁，改 `<title>`、description 與頁首的目前頁標示，並在要連進來的地方補上連結。最後在 `scss/pages/` 新增 partial、在 `scss/main.scss` 加一行 `@import`，執行 `npm run check`。
- **假資料直接寫在 HTML**：商品、購物車與訂單的數字都寫死在頁面裡（Notion 文案；購物車 4 件、NT$ 20,250，滿 NT$ 3,000 免運），同一件商品會出現在商品卡、商品詳情、購物車與訂單，改動時要多頁同步。03 的頁面用的是同一組資料。
- **JS**：`js/main.js` 只做四件事：手機搜尋列展開後自動聚焦、`data-toggle-password` 顯示／隱藏密碼、分頁籤用方向鍵切換時把目前項目捲進畫面、我的訂單的狀態篩選（`data-filter` 按鈕對應每筆訂單的 `data-status`）。其他互動（選單、分頁、輪播、下拉、側邊抽屜）都靠 Bootstrap 的 `data-bs-*` 屬性。
- **換行與空白**：品名的詞組斷點用 `<wbr>` 標出，搭配 `.text-phrase`，只在詞組之間換行；數字與單位之間用 `&nbsp;`，W × D × H 也用 `&nbsp;` 串起來，不會被拆成兩行。
- **表單**：設計稿沒有後端。登入、註冊用 `<form action="orders.html">` 直接前往下一頁；結帳的「確認付款」是連到 `order-result.html` 的連結。各頁表單上方的註解寫了串接後端時要怎麼改。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、字體、間距、圓角、元件）
3. `bootstrap/scss/bootstrap`：用上面的變數編譯出整套 Bootstrap
4. `bootstrap-icons`：圖示字型與 class（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字距、換行規則、焦點樣式、區塊與頁首節奏，以及下表的共用類別
6. `components/*`：頁首、頁尾、商品卡、結帳步驟、訂單摘要（`_order-summary.scss`）
7. `pages/*`：各頁專屬樣式，class 一律加頁面前綴

原則是**先用 Bootstrap 的變數與工具類別**，真的做不到才寫自訂 CSS，而且自訂 CSS 也只引用變數，不寫死色碼。想換風格，主要改 `_variables.scss`。

### 共用類別

下面這些類別跨頁共用，新頁面直接套用，不要在 `pages/*` 另寫一份。用法與示範都在 `guideline.html`。

| 類別 | 用途 | 位置 |
|---|---|---|
| `.page-header`、`.page-lead` | 首頁以外各頁的頁首：麵包屑（或結帳步驟 `.checkout-steps`）→ h1 → 一句說明，間距固定 | `_base.scss` |
| `.section`、`.section-alt`、`.section-heading` | 區塊上下留白 64／96px、生成底色區塊、區塊標題＋說明 | `_base.scss` |
| `.text-phrase` | 品名與短標題只在空白與 `<wbr>` 處換行，詞組不被拆開；不要用在長段落 | `_base.scss` |
| `.btn-text` | 文字連結型按鈕，內建 `inline-flex` 與 44px 觸控高度，不要再加 `py-*` | `_base.scss` |
| `.form-label-optional` | 標籤後的「選填」 | `_base.scss` |
| `.bleed-x`（mixin `bleed-x`） | 576px 以下讓橫向捲動列貼齊螢幕兩側，第一項仍對齊版心 | `_base.scss` |
| `.badge-status` ＋ `.is-pending`／`.is-paid`／`.is-shipping`／`.is-done`／`.is-cancel` | 5 種訂單狀態標籤（待付款、已付款、出貨中、已完成、已取消） | `_base.scss` |
| `.dim`、`.dim-line` | 尺寸線；文字寫成 `W160&nbsp;×&nbsp;D80&nbsp;×&nbsp;H75&nbsp;cm` 這種形式，之間是不換行空白 | `_base.scss` |
| `.num`、`.price` | 價格、尺寸、訂單編號的等寬數字 | `_base.scss` |
| `.qty` | 數量增減，加減鍵 44 × 44px | `_base.scss` |
| `.nav-underline`（Bootstrap）＋ `.tab-count` | 底線分頁籤（最小寬 44px）；分頁文字後面的數量 | `_base.scss` |
| `.demo-state`、`.demo-state-tag`、`.demo-state-title` | 頁面底部的「設計稿狀態示意」，以虛線和正式內容分開 | `_base.scss` |
| `.empty-state` | 空狀態：一句說明＋一個動作，靠左、不加框 | `_base.scss` |
| `.text-vertical` | 首頁直書主標（全站唯一的招牌元素） | `_base.scss` |
| `.order-summary`（`-title`、`-items`、`-rows`、`-row`、`-total`、`.is-sticky`） | 購物車、結帳、付款結果共用的訂單摘要 | `components/_order-summary.scss` |

金額、件數與運費在各頁寫死，數字要一致：購物車 4 件、商品小計與應付總額 NT$ 20,250（免運）；低庫存的門檻是 10 件。

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 色彩 | 紙白 `$paper #F6F3EE`（頁面底）、生成 `$kinari #ECE6DC`（區塊底）、暖白 `$white-warm #FFFDF9`（卡片、輸入框）、髮絲線 `$hairline #E3DDD3`（預設邊框）、亞麻灰 `$linen #C9C2B6`（裝飾線、選項卡與次要按鈕外框）、鈍亞麻 `$linen-dark #8E8679`（表單控制項邊框）、深亞麻 `$linen-deep #6A635A`（次要文字、placeholder）、淺原木 `$oak-light #E4D6C1`（選取底、標記）、原木 `$oak #B89A72`（裝飾點綴，不作文字）、深原木 `$oak-deep #7A6040`（點綴文字、焦點環）、墨 `$sumi #3E3A35`（主文字、主按鈕）、深墨 `$sumi-deep #2F2C28`（強調文字、主按鈕 hover） |
| 狀態色 | 苔色 `$moss #5C6B4C`（成功）、弁柄 `$bengara #A4493D`（錯誤）、芥子 `$karashi #C39A45`（提醒底色）／深芥子 `$karashi-deep #7A5A1C`（提醒文字）、藍鼠 `$ai-nezumi #56697A`（資訊） |
| 表單 | 邊框 `$input-border-color`＝鈍亞麻；placeholder `$input-placeholder-color`＝深亞麻 `$linen-deep`（對暖白 5.8:1）；焦點時邊框換成深原木再外加 1px，合成 2px 實線 |
| 無障礙 | 文字（含 placeholder）對紙白與生成底皆達 AA 4.5:1，原木 `$oak` 與芥子 `$karashi` 不作文字。表單控制項邊框（鈍亞麻 3.3:1）與焦點環達非文字 3:1：焦點一律是實色深原木 2px，按鈕與核取方塊是紙白間隙＋深原木外圈。`html` 設 `scroll-padding-top`，焦點不會被 sticky 頁首擋住；同頁錨點會把焦點移到目標區塊。按鈕、文字按鈕、數量鍵、麵包屑、分頁籤、結帳步驟、頁尾連結的觸控範圍都 ≥ 44px |
| 字體 | Jost（英數、價格、尺寸）＋ Noto Sans TC（中文）；標題字重 400、字距 .12em |
| 間距 | Bootstrap spacer 擴充到 8 階（`py-6` 64px、`py-7` 96px、`py-8` 128px） |
| 圓角 | 2px，近乎直角 |
| 陰影 | 預設不用；只有下拉選單、對話框使用極淡陰影 |

完整規範請看 `guideline.html`。改色時，Guideline 的色票 hex、對比度與其他寫死色碼的地方也要一起改，清單見上一層 [`../README.md`](../README.md) 的「換色時同步檢查」。

## 圖片

`images/` 的圖片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意。替換時保持相同檔名即可，不需改程式。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`：

```bash
npm run images                                   # 產生缺少的圖片
node scripts/generate-images.mjs --only hero,cta # 只重做指定的圖
node scripts/generate-images.mjs --force         # 全部重做
```

換成其他風格時，改腳本裡的 `STYLE`（整組圖的共同調性）與各張描述即可。
