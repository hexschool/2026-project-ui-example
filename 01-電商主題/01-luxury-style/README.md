# 01｜輕奢高定風：NestCraft 原創生活家居選物

> 深色系＋暖金黑（曜石黑、香檳金、暖白）。結帳卡片金屬反光質感，金流付款按鈕帶燙金邊框。

概念是「NestCraft 夜間展間」：把家具店想成打烊後只為你開燈的精品展間。每件商品像展品，被一盞暖光聚焦；文字像展品旁的展示牌。整體安靜、留白多、細線分隔，金色只留給少數重點，大膽只花在結帳頁的**香檳拉絲金屬卡**與**燙金邊框的付款選項**。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（與 02、03 相同架構）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。這是**單一深色主題**：直接把 Bootstrap 原本給淺色用的變數設成深色，不使用 `data-bs-theme`。
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
01-luxury-style/
├─ *.html                    ← 10 個頁面，每頁完整包含公告列、頁首與頁尾
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的四個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 商品照、空間情境圖（AI 生成，深色展間風）、favicon
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫
│  ├─ _base.scss             ← 全站基礎與共用小工具
│  ├─ components/            ← 頁首、頁尾、商品卡、結帳步驟、訂單摘要（含金屬卡）
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾是否與範本一致
   └─ generate-images.mjs    ← 生圖腳本（所有圖片的 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾每頁一份**：沒有元件系統，所以 10 個頁面各自完整寫一份。要改頁首或頁尾時，先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check` 確認全部一致。每頁只有一處不同：頁首導覽的目前頁（`active` 與 `aria-current="page"`；商品詳情標「商品一覽」但不加 `aria-current`）。
- **新增頁面**：複製範本成新頁，改 `<title>`、description 與頁首的目前頁標示，並在要連進來的地方補上連結。最後在 `scss/pages/` 新增 partial、在 `scss/main.scss` 加一行 `@import`，執行 `npm run check`。
- **假資料直接寫在 HTML**：商品、購物車與訂單的數字都寫死在頁面裡（Notion 文案；購物車 4 件、NT$ 20,250，滿 NT$ 3,000 免運），同一件商品會出現在商品卡、商品詳情、購物車與訂單，改動時要多頁同步。02、03 的頁面用的是同一組資料。
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
| `.section`、`.section-alt`、`.section-heading` | 區塊上下留白 64／96／128px、燻木底色區塊、區塊標題＋說明；相鄰區塊之間有古銅髮絲線 | `_base.scss` |
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
| `.font-serif`、`.amount` | 非標題的襯線文字；大金額（Bodoni Moda，固定光學尺寸 18，逗號才不會像句點） | `_base.scss` |
| `.arch` | 拱門圖框（上緣半圓），只用在首頁 Hero 與登入／註冊頁的圖片 | `_base.scss` |
| `.placard`（`-title`、`-text`） | 展示牌：細香檳線＋襯線標題＋小字，例如 Hero 的「5 坪小套房」說明 | `_base.scss` |
| `.foil` | 燙金漸層邊框：結帳的付款方式選項、「確認付款」按鈕 | `_base.scss` |
| `.product-card`（`.is-sold-out`、`.is-express`） | 展示牌式商品卡；售完、首頁閃電結帳兩種變化 | `components/_product-card.scss` |
| `.order-summary`（`-title`、`-items`、`-rows`、`-row`、`-total`、`.is-sticky`、`.is-metal`） | 購物車、結帳、付款結果共用的訂單摘要；預設是安靜的深色版，`.is-metal` 是香檳拉絲金屬卡（只用在結帳頁），載入時有一道反光掃過，`prefers-reduced-motion` 時不播 | `components/_order-summary.scss` |

金額、件數與運費在各頁寫死，數字要一致：購物車 4 件、商品小計與應付總額 NT$ 20,250（免運）；低庫存的門檻是 10 件。

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 面 | 曜石黑 `$obsidian #16130F`（頁面底）、胡桃墨 `$walnut #201B15`（卡片、輸入框、頁首、頁尾）、燻木 `$smoke #2A241D`（區塊底、hover）。都帶一點暖褐，不用中性的 #111 |
| 線 | 古銅線 `$line #3D352B`（髮絲分隔，裝飾用）、深古銅 `$line-strong #5A4E3F`（虛線框、停用框）、表單框線 `$control #7A6C58`（非文字 3:1） |
| 文字 | 暖白 `$ivory #F1EADC`（15.5:1）、霧白 `$ivory-muted #B9AE99`（8.4:1）、淡霧白 `$ivory-faint #948A78`（placeholder，5.4:1） |
| 金 | 香檳金 `$champagne #D3B98B`（主要按鈕底、目前頁、焦點環、強調文字，9.8:1）、淺香檳 `$champagne-light #E6D3AE`（hover、金屬高光）、古金 `$champagne-deep #A88C5C`（裝飾線、金屬暗部）。金色只用在少數重點 |
| 狀態色 | 翡翠 `$jade #9CC3A4`（成功）、石榴 `$garnet #E8998C`（錯誤）、銅橘 `$copper #DFA274`（提醒、低庫存）、鋼藍 `$steel #A3B8CC`（資訊）；在深色底上都達 AA，可直接當文字 |
| 按鈕 | 主要：香檳金底＋曜石黑字（同一組動作只放一個）；次要：暖白細框；金色細框 `.btn-outline-primary`：首頁閃電結帳等需要一點金色的次要動作；商品卡「加入購物車」用暖白細框 |
| 字體 | 襯線：Bodoni Moda（英數、品牌字、大金額）＋ Noto Serif TC（中文標題）；無襯線：Noto Sans TC（內文、表單、按鈕，行高 1.85）。不用全大寫標籤 |
| 圓角 | 0（剪裁俐落）；只有拱門圖框、狀態圓點、radio 是圓的 |
| 陰影 | 只用在浮起的面（下拉選單、對話框、金屬卡） |
| 焦點 | 曜石黑 2px 間隙＋香檳金 2px 外圈，深色底與金屬卡上都看得見 |
| 動態 | 只有金屬卡的一次性反光；不做進場動畫 |

完整規範請看 `guideline.html`。改色時，Guideline 的色票 hex、對比度與其他寫死色碼的地方也要一起改，清單見上一層 [`../README.md`](../README.md) 的「換色時同步檢查」。

## 圖片

`images/` 的圖片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名與 02、03 相同。調性是深色展間：暖色聚光、香檳金與黃銅點綴；空間情境圖換掉後，要重新校正 `index.html` 熱點的 `left`／`top` 百分比。替換時保持相同檔名即可，不需改程式。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`：

```bash
npm run images                                   # 產生缺少的圖片
node scripts/generate-images.mjs --only hero,cta # 只重做指定的圖
node scripts/generate-images.mjs --force         # 全部重做
```

換成其他風格時，改腳本裡的 `STYLE`（整組圖的共同調性）與各張描述即可。
