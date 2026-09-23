# 02｜日系無印風：NestCraft 原創生活家居選物

> 淺色系＋暖大地（米白、淺原木、亞麻灰）。極簡清爽的商品結帳清單，大面積留白，減少填寫付款資訊時的焦慮感。

Vite＋Vue 3（Composition API）＋ Bootstrap 5 的電商設計稿。Vue 只負責路由與把假資料帶進模板，**版型與樣式才是重點**。

## 快速開始

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # 輸出 dist/（base: './'，可放在任何子目錄）
npm run preview   # 預覽 build 結果
```

路由使用 hash 模式（`/#/products`），打包後直接放上 GitHub Pages 之類的靜態主機，重新整理也不會 404。

## 頁面

| 頁面 | 路由 | 檔案 |
|---|---|---|
| 設計 Guideline | `/#/guideline` | `src/views/GuidelineView.vue` |
| 首頁 | `/#/` | `src/views/HomeView.vue` |
| 商品列表 | `/#/products` | `src/views/ProductsView.vue` |
| 商品詳情 | `/#/product/p-1001` | `src/views/ProductDetailView.vue` |
| 購物車 | `/#/cart` | `src/views/CartView.vue` |
| 結帳 | `/#/checkout` | `src/views/CheckoutView.vue` |
| 付款結果 | `/#/order-result` | `src/views/OrderResultView.vue` |
| 登入 | `/#/login` | `src/views/LoginView.vue` |
| 註冊 | `/#/register` | `src/views/RegisterView.vue` |
| 我的訂單 | `/#/orders` | `src/views/OrdersView.vue` |

每一頁的頁尾都有「設計稿頁面」導覽，可以快速切換所有頁面。

## 檔案結構

```
02-muji-style/
├─ index.html                 ← 字體（Jost、Noto Sans TC）、favicon
├─ vite.config.js
├─ scripts/generate-images.mjs ← 生圖腳本（所有圖片的 prompt）
├─ public/images/             ← 商品照、空間情境圖（AI 生成，可替換）
└─ src/
   ├─ main.js                 ← 載入 Bootstrap（Sass）、Bootstrap Icons、Bootstrap JS
   ├─ App.vue                 ← 頁首＋<RouterView>＋頁尾
   ├─ router.js
   ├─ data/products.js        ← 假資料：商品（Notion 文案）、購物車、訂單、空間情境；格式化函式與常數
   ├─ components/             ← SiteHeader、SiteFooter、ProductCard、CheckoutSteps
   ├─ views/                  ← 每頁一個 .vue
   └─ scss/
      ├─ main.scss            ← 樣式進入點（載入順序見下方）
      ├─ _variables.scss      ← ★ Design token：Bootstrap 變數覆寫
      ├─ _base.scss           ← 全站基礎與共用小工具
      ├─ components/          ← 共用元件樣式：頁首、頁尾、商品卡、結帳步驟、訂單摘要
      └─ pages/               ← 各頁專屬樣式（class 加頁面前綴）
```

## 樣式架構

`main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、字體、間距、圓角、元件）
3. `bootstrap/scss/bootstrap`：用上面的變數編譯出整套 Bootstrap
4. `_base.scss`：字距、換行規則、焦點樣式、區塊與頁首節奏，以及下表的共用類別
5. `components/*`：頁首、頁尾、商品卡、結帳步驟、訂單摘要（`_order-summary.scss`）
6. `pages/*`：各頁專屬樣式，class 一律加頁面前綴

原則是**先用 Bootstrap 的變數與工具類別**，真的做不到才寫自訂 CSS，而且自訂 CSS 也只引用變數，不寫死色碼。想換風格，主要改 `_variables.scss`。

### 共用類別

下面這些類別跨頁共用，新頁面直接套用，不要在 `pages/*` 另寫一份。用法與示範都在 `/#/guideline`。

| 類別 | 用途 | 位置 |
|---|---|---|
| `.page-header`、`.page-lead` | 首頁以外各頁的頁首：麵包屑（或 CheckoutSteps）→ h1 → 一句說明，間距固定 | `_base.scss` |
| `.section`、`.section-alt`、`.section-heading` | 區塊上下留白 64／96px、生成底色區塊、區塊標題＋說明 | `_base.scss` |
| `.text-phrase` | 品名與短標題只在空白與資料裡的零寬空白（`\u200b`）處換行，詞組不被拆開；不要用在長段落 | `_base.scss` |
| `.btn-text` | 文字連結型按鈕，內建 `inline-flex` 與 44px 觸控高度，不要再加 `py-*` | `_base.scss` |
| `.form-label-optional` | 標籤後的「選填」 | `_base.scss` |
| `.bleed-x`（mixin `bleed-x`） | 576px 以下讓橫向捲動列貼齊螢幕兩側，第一項仍對齊版心 | `_base.scss` |
| `.badge-status` ＋ `.is-pending`／`.is-paid`／`.is-shipping`／`.is-done`／`.is-cancel` | 5 種訂單狀態標籤（對應表是 `data/products.js` 的 `statusClass`） | `_base.scss` |
| `.dim`、`.dim-line` | 尺寸線；文字一律用 `formatSize(size, note)` 輸出，W × D × H 之間是不換行空白 | `_base.scss`、`data/products.js` |
| `.num`、`.price` | 價格、尺寸、訂單編號的等寬數字 | `_base.scss` |
| `.qty` | 數量增減，加減鍵 44 × 44px | `_base.scss` |
| `.nav-underline`（Bootstrap）＋ `.tab-count` | 底線分頁籤（最小寬 44px）；分頁文字後面的數量 | `_base.scss` |
| `.demo-state`、`.demo-state-tag`、`.demo-state-title` | 頁面底部的「設計稿狀態示意」，以虛線和正式內容分開 | `_base.scss` |
| `.empty-state` | 空狀態：一句說明＋一個動作，靠左、不加框 | `_base.scss` |
| `.text-vertical` | 首頁直書主標（全站唯一的招牌元素） | `_base.scss` |
| `.order-summary`（`-title`、`-items`、`-rows`、`-row`、`-total`、`.is-sticky`） | 購物車、結帳、付款結果共用的訂單摘要 | `components/_order-summary.scss` |

金額、件數、運費與庫存門檻都從 `data/products.js` 匯入（`formatPrice`、`formatSize`、`cartQty`、`cartTotal`、`shippingText`、`LOW_STOCK` 等），各頁不自己計算，也不手組字串。

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

完整規範請看 `/#/guideline`。改色時，Guideline 的色票 hex、對比度與其他寫死色碼的地方也要一起改，清單見上一層 [`../README.md`](../README.md) 的「換色時同步檢查」。

## 圖片

`public/images/` 的圖片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意。替換時保持相同檔名即可，不需改程式。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`：

```bash
npm run images                                   # 產生缺少的圖片
node scripts/generate-images.mjs --only hero,cta # 只重做指定的圖
node scripts/generate-images.mjs --force         # 全部重做
```

換成其他風格時，改腳本裡的 `STYLE`（整組圖的共同調性）與各張描述即可。
