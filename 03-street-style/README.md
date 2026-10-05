# 03｜街頭機能風：NestCraft 原創生活家居選物

> 高對比＋冷螢光（水泥灰、深炭、螢光青綠）。購物車採用粗黑外框與粗體標籤，按鈕反差極大。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。
- **JS**：互動都交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的四個小功能。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西。

**要修改樣式**：

```bash
npm install        # 安裝 bootstrap、bootstrap-icons、sass，並把 Bootstrap JS 與圖示字型複製進專案
npm run watch      # 開發時：監看 scss/，存檔就重新編譯 css/style.css（出錯時錯誤訊息會顯示在頁面最上方與終端機，修正存檔後自動恢復）
npm run css        # 編譯一次
npm run build      # 交付前：重新複製 vendor 檔案＋編譯一次 CSS
npm run check      # 檢查 10 個頁面的頁首、頁尾是否與範本一致
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

商品詳情只做一頁靜態示範（橡木餐桌），所有商品卡都連到 `product.html`。售完、低庫存、多尺寸模式（沙發床）等變化，放在該頁底部的「設計稿狀態示意」。

**與 wireframe 的刻意差異**：首頁 Hero 沒有照 wireframe 的「文字與圖片左右兩欄」，改成海報式版面（巨大主標橫跨整行、照片在下方整排），這是本風格的招牌。資訊架構（區塊、順序、文案、按鈕）與 wireframe 相同。

## 檔案結構

```
03-street-style/
├─ *.html                    ← 10 個頁面，每頁完整包含頁首與頁尾
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製（含商品卡 markup 範例）
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的四個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 商品照、空間情境圖（AI 生成）、favicon
├─ scss/
│  ├─ main.scss              ← 樣式進入點
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫
│  ├─ _base.scss             ← 全站基礎與共用工具
│  ├─ components/            ← 頁首（跑馬燈）、頁尾、商品卡、結帳步驟、訂單摘要
│  └─ pages/                 ← 各頁專屬樣式（class 一律加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的頁首頁尾是否與範本一致
   └─ generate-images.mjs    ← 生圖腳本（所有圖片的 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾每頁一份**：沒有元件系統，所以 10 個頁面各自完整寫一份。要改頁首或頁尾時，先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check` 確認全部一致。每頁只有一處不同：頁首導覽的目前頁（`active` 與 `aria-current="page"`；商品詳情標「商品一覽」但不加 `aria-current`）。
- **新增頁面**：複製範本成新頁，改 `<title>`、description 與頁首的目前頁標示，並在要連進來的地方（頁首導覽或其他頁的按鈕）補上連結；改到頁首或頁尾時，同樣先改範本再同步所有頁面。最後在 `scss/pages/` 新增 partial、在 `scss/main.scss` 加一行 `@import`，執行 `npm run check`。
- **假資料直接寫在 HTML**：商品、購物車與訂單的數字都寫死在頁面裡。它們與 02 的頁面一致（Notion 文案；購物車 4 件、NT$ 20,250），改動時要記得多頁同步。
- **JS**：`js/main.js` 只做四件事：手機搜尋列展開後自動聚焦、`data-toggle-password` 顯示／隱藏密碼、分頁籤與 Guideline 手機目錄切換時把目前項目捲進畫面、我的訂單的狀態篩選（`data-filter` 按鈕對應每筆訂單的 `data-status`，點了只顯示該狀態的訂單）。其他互動（選單、分頁、輪播、下拉、側邊抽屜）都靠 Bootstrap 的 `data-bs-*` 屬性。
- **品名換行**：長品名用 `<wbr>` 標出詞組斷點，搭配 `.text-phrase`，只在詞組之間換行。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫
3. `bootstrap/scss/bootstrap`：用上面的變數編譯出整套 Bootstrap
4. `bootstrap-icons`：圖示字型與 class（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字體、區塊節奏、共用工具
6. `components/*`：頁首、頁尾、商品卡、結帳步驟、訂單摘要
7. `pages/*`：各頁專屬樣式

原則：先用 Bootstrap 的變數與工具類別，做不到才寫自訂 CSS，而且只引用變數，不寫死色碼。

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 色彩 | 水泥灰 `#E3E3DF`（頁底）、淺水泥 `#F2F2EE`（卡片、輸入框）、中水泥 `#CFCFCB`（商品圖底）、鋼灰 `#8A8B87`（裝飾線）、深水泥 `#575854`（次要文字）、深炭 `#1C1D1F`（主文字、粗框、主按鈕、深色區塊） |
| 螢光 | 螢光青綠 `#2EF2B3`：只作底色，或放在深炭上當文字（11.6:1）；淺底上的強調文字改用深青綠 `#006B4B` |
| 狀態色 | 警示橘 `#FF6A13`（底色）／`#A64000`（文字）、訊號紅 `#B42318`、訊號藍 `#2451D6` |
| 字體 | Archivo（英數；價格、編號、尺寸用 75% 窄體）＋ Noto Sans TC（中文，標題 900） |
| 框線 | 預設 2px 深炭框，購物車、摘要等重點面板 3px |
| 圓角 | 0（全站直角） |
| 陰影 | 只有硬陰影 `4px 4px 0` 深炭，用在主要按鈕與重點面板 |
| 焦點 | 螢光內圈＋深炭外圈（淺底、深底都看得見） |

完整規範請看 `guideline.html`。

## 圖片

`images/` 的圖片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名與 02 相同。生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`：

```bash
npm run images                                   # 產生缺少的圖片
node scripts/generate-images.mjs --only hero,cta # 只重做指定的圖
```
