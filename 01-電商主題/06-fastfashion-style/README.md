# 06｜平價快時尚：NestCraft 原創生活家居選物

> 高飽和＋暖色系（電光亮黃、極致純黑、白底）。折價券倒數、大字號金額標籤，CTA 吸睛。

**概念：NestCraft 限時快閃。** 像週末快閃特賣會的入口：黃黑色塊、超大的價格牌、倒數中的折價券，一眼就知道多少錢、還剩多久、該按哪裡。價格是主角，按鈕是第二主角；購物車與結帳的所有動作都固定在視窗底部，不必找。

| Notion 風格列 | 色系搭配 | UI 視覺特點 |
|---|---|---|
| 06 平價快時尚 | 高飽和＋暖色系（電光亮黃、極致純黑、白底） | 折價券倒數、大字號金額標籤，CTA 吸睛 |

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。
- **JS**：互動都交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的六個小功能。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西。

**要修改樣式**：

```bash
npm install        # 安裝 bootstrap、bootstrap-icons、sass，並把 Bootstrap JS 與圖示字型複製進專案
npm run watch      # 開發時：監看 scss/，存檔就重新編譯 css/style.css
npm run css        # 編譯一次
npm run build      # 交付前：重新複製 vendor 檔案＋編譯一次 CSS
npm run check      # 檢查 10 個頁面的頁首、頁尾是否與範本一致
npm run vendor     # 只重新複製 Bootstrap JS 與圖示字型（npm install 時會自動執行）
npm run images     # 重新生成圖片（需要已登入的 codex CLI，換圖時才用）
```

## 頁面

| 頁面 | 檔案 | 樣式 | 狀態 |
|---|---|---|---|
| 設計 Guideline | `guideline.html` | `scss/pages/_guideline.scss` | 完成 |
| 首頁 | `index.html` | `scss/pages/_home.scss` | 完成 |
| 商品一覽 | `products.html` | `scss/pages/_products.scss` | 完成 |
| 商品詳情（以橡木餐桌示範） | `product.html` | `scss/pages/_product-detail.scss` | 完成 |
| 購物車 | `cart.html` | `scss/pages/_cart.scss` | 完成 |
| 結帳 | `checkout.html` | `scss/pages/_checkout.scss` | 完成 |
| 付款結果 | `order-result.html` | `scss/pages/_order-result.scss` | 完成 |
| 登入 | `login.html` | `scss/pages/_auth.scss`（與註冊共用） | 完成 |
| 註冊 | `register.html` | `scss/pages/_auth.scss`（與登入共用） | 完成 |
| 我的訂單 | `orders.html` | `scss/pages/_orders.scss` | 完成 |

頁面上沒有列出所有頁面的導覽：從首頁依購物流程點進各頁即可，Guideline 直接開 `guideline.html`。

商品詳情只做一頁靜態示範（橡木餐桌），所有商品卡都連到 `product.html`。售完、低庫存、多尺寸模式（沙發床）等變化，放在該頁底部的「設計稿狀態示意」。

資料與 02、03 一致：購物車 3 項 4 件、應付總計 NT$ 20,250（滿 NT$ 3,000 免運）；付款結果 NC-20260923-001；我的訂單 5 筆涵蓋 5 種狀態；售完是藤編收納櫃，低庫存門檻 10 件。**折價券「滿 NT$ 25,000 折 NT$ 1,000」只是活動示意，不套用在任何金額上**（購物車 NT$ 20,250 沒有達到門檻），所以總額、付款結果、訂單金額都和其他風格相同。倒數是真的算到「今天 23:59」，不做歸零就重來的假倒數。

### 與 wireframe 的刻意差異

資訊架構、區塊順序、文案、按鈕與狀態都和 wireframe 相同，只換構圖：

- **首頁 Hero**：不是容器內的「文字＋圖片兩欄」，而是左右半版滿版色塊（左半電光黃塊、右半照片出血到右緣），首屏就放折價券票券與倒數。
- **首頁空間靈感**：3 個情境同時攤開成 3 張 lookbook 卡（每張都有熱點與整套價），不用分頁切換。
- **商品列表**：沒有左側欄，改成黏性分類列（分類按鈕＋「篩選」＋排序）＋4 欄商品格，格子中插一張黃色票券方塊與一張黑色提示方塊；篩選條件收進右側 `offcanvas-end`，套用中的條件不另外列一排。
- **商品詳情**：不是主圖＋縮圖，改成快時尚常見的圖片直排長捲＋右側黏性資訊；價格是黃色吊牌（`.price-hangtag`），下方接小票券。三項服務在主區下方排成灰底一列。分頁改成滿寬，狀態示意每種一列（左說明、右舞台）。
- **購物車、結帳**：金額摘要不在頁面右欄，而是固定在視窗底部的黑色結帳列；購物車右欄只放折價券進度票券、折扣碼與服務說明。結帳的三個步驟（收件、配送、付款）在 1200px 以上三欄並排同時攤開，訂單摘要是表單上方一條灰底橫條。
- **付款結果**：不是置中的結果卡，而是版心內一條黑色成功帶（左邊黃方塊黑勾＋H1，右邊付款金額 64px 黃字），下面接四欄資訊格、購買品項、「接下來會發生什麼」三欄與兩顆等寬按鈕。訂單摘要的 5 項資料都在（付款金額在成功帶與品項下方的金額列）。
- **登入、註冊**：不是置中的窄卡片，而是滿版左右半：左半照片＋左下角票券，右半白底表單（最寬 440，垂直置中）。表單欄位、按鈕與連結和 wireframe 相同。
- **我的訂單**：沒有左側會員欄，會員資訊是分頁上方的一條黑色會員列；訂單卡的卡頭、卡身、卡尾改成票根式：狀態是左側 120px 整條色塊（手機是頂端色帶），編號、品項、配送在中段，金額與動作在右段。

## 排版語言

**核心規則：色塊、超大數字、固定行動。** 版面用滿版色塊切分（黃塊、黑帶、白底），每個畫面最大的字是價格或標題，購物車與結帳的行動固定在視窗底部。後面做頁面的人，請照這一節的規則構圖，不要套其他風格的版型。

### 網格與版心

- 12 欄，gutter 24px（商品格在手機用 12px）。`.container` 左右內距：手機各 16px、md 以上各 32px。
- 版心最寬 **1440px**（比其他 5 套寬，商品一次放得多）。購物車、結帳 1280（`.container.container-flow`）；我的訂單、付款結果 1080（`.container.container-narrow`）；登入、註冊是滿版左右半。
- 滿版左右半（首頁 Hero、底部 CTA、之後的登入頁）不放在 `.container` 裡：外層加 `.bleed-split`，文字欄用 `@include shell-start`（必要時 `shell-end`），內容左緣就會和頁首 logo 對齊；1920 寬時色塊滿版、文字仍對齊 1440 版心。
- 間距尺度改過（見 Design token），`mb-3` 是 12px、`mb-4` 是 16px、`gy-6` 是 40px（商品格列距）。區塊上下 48／64px（`.section`）。

### 頁首與頁尾

- **頁首兩段**，整個 `<header class="site-header">` 是 sticky，`top: -40px`：
  - 上：**黃色倒數條** 40px（折價券元件，不是公告列）：黑底黃字「限時券」＋「滿 NT$ 25,000 折 NT$ 1,000」＋「今日 23:59 截止」＋倒數 `HH:MM:SS`＋「登入領取」。992px 以下拿掉「今日 23:59 截止」、改用「｜」分隔，768px 以下拿掉「限時券」，576px 以下再拿掉「｜」，一直維持一行。
  - 下：**純黑主列** 64px：黃底黑字「N」方塊＋白字 NestCraft｜白字導覽（目前頁＝黃字＋4px 黃底線）｜白底大搜尋框（最寬 520）｜會員圖示｜黃色「購物車 4」。捲動後倒數條離開，黑列留在頂端；`html { scroll-padding-top: 72px }`。
  - 992px 以下：左漢堡、中 logo、右搜尋鈕＋黃色購物車方塊。選單是左側黑色抽屜（白色大字、目前頁黃字、搜尋框在最上方）。抽屜和桌機導覽是**同一份 markup**（`.offcanvas` 放在 `.navbar-expand-lg` 裡，992px 以上自動變成一般排版），所以導覽連結只寫一次。
  - 不做跑馬燈（那是 03 的語言）。
- **頁尾**：電光黃底黑字。上方一列三個服務（黑方塊白圖示＋粗字＋說明）、中間品牌＋三組連結四欄、底部 2px 黑線＋版權。加入購物車的 toast 也寫在頁尾區塊後面（每頁相同）。

### 色塊與面積

- 頁面底一律白色；黑帶（`.band-dark`）與黃塊（`.band-volt`）用來切分區塊，每個畫面黃色約佔 15～25%。黃塊上不放長段落。
- **白底上禁止黃字、黃線、黃圖示**（1.28:1）。黃色只能當「面」：按鈕底、價格吊牌、倒數條、標籤底、H2 螢光筆底、Hero 色塊、頁尾。
- 黑色面上的文字用白色，次要字 `#B3B3B3`，強調用黃字（16.46:1）；深色面加 `.band-dark` 或 `.on-dark`，連結、焦點環（改黃色）、`.btn-volt` 會自動切換。

### 卡片與形狀

- **0 圓角、不用陰影**。只有 radio 與熱點圓鈕是圓的；數量增減也是方塊。
- 線：黑 1px（輸入框、清單分隔）、黑 2px（按鈕框、選項卡、票券、訂單票卡、區塊上緣）。**不用 3px 以上的粗框盒、不用硬陰影、不用規格銘牌**（那是 03 的語言）。浮起的東西（下拉、熱點小卡、Modal、固定列、toast）用黑色實面或 1px 黑框區隔。
- **商品卡**：無框，灰底 1:1 圖，左上角矩形標籤（現貨＝黑底白字、僅剩 N 件＝黃底黑字、已售完＝灰底虛線）；品名（2 行）→ 分類 → 尺寸 → 價格牌 28px → 滿寬 48px 按鈕。hover 只讓圖底變深一點、品名加底線，不放大圖片、不浮出「快速加入」。

### 標題階層

- H1 44／32px 900；首頁 H1 72／40px（`.display-hero`）。
- H2 36／26px 900，靠左，文字背後是**黃色螢光筆底**（`<span class="marker">`，換行時每行都有）；黑帶上的 H2 改成黃字，不加螢光筆。
- 區塊標題列（`.section-head`）左右分開：左 H2＋一句說明，右側文字連結（粗體＋2px 黑底線）。
- 頁面 H1 旁可放黃底數字方塊 `.count-chip`（商品一覽「10 件」、購物車「4 件」）。
- 數字、價格、倒數、logo 用 Inter Tight 800／900；中文用 Noto Sans TC（標題 900、品名與按鈕 700、內文 400 15px）。

### 招牌元素

1. **折價券倒數 `.coupon`＋`.countdown`**：左右兩側中間各一個半圓缺口、票根與主體之間 2px 黑虛線。白面上是黃底＋2px 黑框；黃面上是白底不加框（`.coupon-on-volt`）。出現在：頁首倒數條（全站）、首頁 Hero、商品列表第 5 格、商品詳情價格下方、購物車右欄的進度票券、結帳摘要條的一行提示、登入與註冊頁照片上。付款結果與我的訂單不出現。倒數數字 `aria-hidden`，旁邊放 `visually-hidden`「活動今日 23:59 截止」，**不加 `aria-live`**。
2. **大字號金額標籤 `.price-tag`**：所有價格都用，`NT$` 縮成 0.42 倍、上緣對齊，數字原大。卡片 28、整套價 32、固定列總計 40（黑底黃字）、商品詳情與付款結果 64。
3. **吸睛 CTA**：`.btn-volt`（黃底、2px 黑框、黑字 900、56px）每張卡、每個區塊只給最重要的那一個行動；其他行動用 `.btn-dark`（黑底白字）或 `.btn-outline-dark`（白底黑框）。黃塊上的主要行動改用 `.btn-dark`。購物車、結帳再加上**固定在視窗底部的黑色結帳列 `.buybar`**。
4. **箭頭步驟 `.chevron-steps`**：三段箭頭色塊（已完成＝黑底白字＋勾、目前＝黃底黑字、未到＝灰底灰字），不是三格方框。

### 各頁構圖原則（給後續頁面）

- **首頁**：左右半版黃塊 Hero（H1、按鈕、白色票券）→ 黑帶四大價值（黃方塊黑圖示）→ 3 張 lookbook 同時攤開（4:5 情境圖＋熱點、商品清單、整套價 32px、滿寬黃按鈕；手機橫向捲動）→ 人氣嚴選 4 欄（手機 2 欄格）→ 見證（照片下緣壓黑色引言卡）＋承諾（黑方塊白圖示、1px 黑線分列）→ 黑帶左右半 CTA。
- **商品一覽**：頁首（麵包屑、H1＋「10 件」方塊、說明、右側「回到首頁看靈感」）→ 黏性分類列（`top: 64px`，白底下方 2px 黑線；分類按鈕選中＝黑底白字；右側「篩選」開 `offcanvas-end`、排序下拉）→ 4 欄商品格（md 3、手機 2），第 5 格黃色票券方塊、最後一格黑色「先量尺寸，再挑家具」方塊，共 12 格 3 列。
- **商品詳情**：左 7 欄圖片直排（4 張，間距 8px，沒有縮圖與輪播）；右 5 欄黏性資訊（`top: 88px`；資訊欄 1200px 以上約 660～685px 高、視窗高 800px 起 sticky，992～1199px 約 760px 高、視窗高 864px 起 sticky，視窗更矮時跟著頁面捲動，避免按鈕被切掉）：分類與編號 → H1 → **黃色價格吊牌 64px** → 庫存黑框標籤 → 小票券 → 尺寸（標籤＋大字數值一行）→ 介紹 → 數量 → 兩顆等寬按鈕（白底黑框「加入購物車」、`.btn-volt`「直接購買」）。主區下方是灰底三項服務一列（免工具組裝、14 天退換、48 小時出貨）。手機圖片橫向捲動，底部固定白色購買列（`.buybar.buybar-light`，body 加 `has-buybar-sm`）。
- **購物車**（1280）：箭頭步驟 → H1＋「4 件」→ 左 8 欄品項列（128px 灰底縮圖、品名、數量方鍵、小計 28px）＋右 4 欄白底直式折價券進度票券（票根放標籤與倒數，撕線下方是門檻、81% 黑色進度條、還差 NT$ 4,750、「去湊單」）、折扣碼、服務說明 → **固定底部黑色結帳列**（商品小計、運費、應付總計 40px 黃字、「前往結帳」）。992px 以下商品小計與運費改放在品項清單下方，固定列只留應付總計與按鈕。
- **結帳**（1280）：箭頭步驟 → H1 → 灰底訂單摘要條（三項商品橫排＋一行折價券提示）→ **收件｜配送｜付款三欄並排**，每欄頂端 64px 大數字 1／2／3（992～1199px 收件、配送並排，付款滿寬且選項與信用卡欄位左右兩欄；以下依序直排）→ 發票與備註 → 固定底部結帳列（「確認付款」）。選信用卡以外的付款方式時，信用卡欄位換成一句說明（CSS `:has()`，不寫 JS）。
- **付款結果**（1080）：箭頭步驟三段完成 → 黑色成功帶（黃方塊黑勾＋H1 白字、右側付款金額 64px 黃字）→ 四欄資訊格 → 品項 → 「接下來會發生什麼」三欄 → 兩顆等寬按鈕。失敗狀態改紅色帶。
- **登入、註冊**：滿版左右半（`.bleed-split`）：左照片＋左下角黃色票券、右白底表單（最寬 440，垂直置中）。
- **我的訂單**（1080）：黑色會員列 → 粗字底線狀態分頁（數量是小黑方塊）→ **票根式訂單卡**（2px 黑框、左側 120px 整條狀態色塊、2px 黑虛線撕線、中段編號與縮圖、右段價格牌與動作）。
- **Guideline**：滿版黃色海報封面（H1 72px「設計 Guideline」）→ 黏性黑色目錄列（停在黑列下方、12 節、手機橫向捲動，ScrollSpy 標出目前章節）→ 黃／黑／白三大色塊與完整色票。必含的 6 項依序是色彩、字級（用價格示範字級階梯）、間距、圓角與陰影、元件狀態、RWD 斷點與 Do／Don't；圓角陰影與元件狀態之間另加「價格牌」「折價券與倒數」「按鈕三階」「固定結帳列」四節元件規格。

## 檔案結構

```
06-fastfashion-style/
├─ *.html                    ← 10 個頁面，每頁完整包含頁首與頁尾
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製（含頁首、商品卡 markup 範例）
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的六個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 商品照、空間情境圖（AI 生成）、favicon.svg（手繪向量）
├─ scss/
│  ├─ main.scss              ← 樣式進入點
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫
│  ├─ _base.scss             ← 全站基礎與共用類別（版心、頁面下緣留白、小節標題、價格牌與價格吊牌、按鈕三階、標籤、表單、提示、狀態示意）
│  ├─ components/            ← 頁首（倒數條＋黑列）、頁尾、商品卡、折價券與倒數、箭頭步驟、固定結帳列
│  └─ pages/                 ← 各頁專屬樣式（class 一律加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的頁首頁尾是否與範本一致
   └─ generate-images.mjs    ← 生圖腳本（所有圖片的 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾每頁一份**：要改時先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check`（應輸出「全部 10 個頁面的共用區塊都與範本一致」）。比對範圍：`<head>`、從 skip-link 到頁首結束（倒數條在頁首裡）、從頁尾到檔案結尾（含 toast 與 script）。
- **目前頁標示**：導覽連結的 class 只寫 `nav-link`，目前頁改成 `nav-link active` 並加 `aria-current="page"`（首頁、商品一覽、我的訂單）。商品詳情標「商品一覽」但不加 `aria-current`；購物車、結帳、付款結果、登入、註冊、Guideline 不標示。不要在導覽連結上加其他 class，樣式從父層 `.site-nav` 選。
- **body 的 class**（不在比對範圍，每頁可不同）：購物車、結帳加 `has-buybar`；商品詳情加 `has-buybar-sm`（只在 992px 以下有固定列）。這會在**頁尾**的底部內距加上固定列的高度＋16px（不是加在 body，免得黃色頁尾和固定列之間露出一條白邊），`html` 的 `scroll-padding-bottom` 也同步，Tab 到的欄位與頁尾不會被蓋住。
- **頁面內容的外層**：頁首以下的主要內容外層加 `.page-body`，下緣留 48／64px，最後一個區塊（例如狀態示意）不會直接貼著頁尾。
- **JS**：`js/main.js` 做六件事：
  1. 手機放大鏡打開選單抽屜時，把焦點放進搜尋框（按鈕加 `data-menu-search`）。
  2. `data-toggle-password` 顯示／隱藏密碼。
  3. 分頁籤與 Guideline 目錄切換時，把目前項目捲進畫面。
  4. 我的訂單的狀態篩選（`data-filter-list` 指向清單，按鈕 `data-filter`，訂單 `data-status`）。
  5. 折價券倒數：每秒更新所有 `[data-countdown]` 為到今天 23:59:59 的 `HH:MM:SS`。
  6. 加入購物車示意：按鈕加 `data-add-cart="品名"`（整套另加 `data-add-qty="件數"`），會顯示黑底 toast，頁首購物車數量與 `aria-label` 跟著增加（只是示意，換頁後回到 4）。
- **品名換行**：長品名用 `<wbr>` 標出詞組斷點，搭配 `.text-phrase`；數字與單位之間用 `&nbsp;`。

## 樣式架構

`scss/main.scss` 的載入順序：Bootstrap 函式 → `_variables.scss` → Bootstrap 本體 → Bootstrap Icons → `_base.scss` → `components/*` → `pages/*`。先用 Bootstrap 的變數與工具類別，做不到才寫自訂 CSS，只引用變數，不寫死色碼。

### 共用類別

下面這些類別跨頁共用，新頁面直接套用，不要在 `pages/*` 另寫一份。markup 範例寫在各檔案開頭的註解與 `templates/page.html`，各元件的狀態（hover、焦點、停用、錯誤）畫在 `guideline.html`。`gl-` 開頭的類別只屬於 Guideline（`scss/pages/_guideline.scss`），其中 `.gl-is-hover`／`.gl-is-focus` 只用來把狀態「定格」給人看，正式頁面不要用。

| 類別 | 用途 | 位置 |
|---|---|---|
| `.container-flow`、`.container-narrow` | 與 `.container` 併用：1280（購物車、結帳）、1080（我的訂單、付款結果） | `_base.scss` |
| `.bleed-split`＋ mixin `shell-start`／`shell-end` | 滿版左右半的外層；文字欄的內距對齊版心 | `_base.scss` |
| `.section`、`.band-dark`、`.band-volt`、`.on-dark` | 區塊上下 48／64px；黑帶；黃塊；黑色面上的文字、連結、焦點、按鈕切換 | `_base.scss` |
| `.page-body` | 首頁以外各頁主要內容的外層：下緣留 48／64px，不讓最後一個區塊貼著頁尾 | `_base.scss` |
| `.section-head` | 區塊標題列：左 H2＋說明、右連結 | `_base.scss` |
| `.rule-title`（`.rule-title-aside`） | 頁內小節標題：22／24px 900＋下方 2px 黑線，右側可放一句灰色小字（付款結果的「購買品項」「接下來會發生什麼」） | `_base.scss` |
| `.marker` | H2 的黃色螢光筆底 | `_base.scss` |
| `.page-header`、`.page-title-row`、`.count-chip`、`.page-lead` | 首頁以外各頁的頁首：麵包屑或箭頭步驟 → H1（旁邊黃底數字方塊）→ 說明 | `_base.scss` |
| `.display-hero` | 首頁 H1（72／40px） | `_base.scss` |
| `.num` | Inter Tight 800 等寬數字（編號、件數） | `_base.scss` |
| `.price-tag`（`.price-cur`、`.price-num`）＋ `.price-tag-sm`／`-card`／`-set`／`-total`／`-hero` | 大字號金額標籤：18／22→28／32／28→40／44→64 | `_base.scss` |
| `.price-hangtag` ＋ `.is-off` | 黃色價格吊牌（左側尖角＋黑色穿孔），包住 `.price-tag-hero`；`.is-off` 是售完時的灰色版。只用在商品詳情 | `_base.scss` |
| `.btn-volt`、`.btn-dark`、`.btn-outline-dark`、`.btn-outline-light`、`.btn-card`、`.btn-text` | 按鈕三階；黑色面上的白框按鈕（預留，10 頁目前沒有用到）；卡片滿寬 48px 按鈕；文字連結按鈕。高度：一般 48、`.btn-lg` 與 `.btn-volt` 56、`.btn-sm` 44 | `_base.scss` |
| `.btn-close`、`.btn-close-white` | 44px 關閉鈕；手機選單與篩選抽屜的黑色標題列用白色 ×（hover 2px 黃框、焦點內縮黃框） | `_base.scss` |
| `.tag`、`.tag-volt`、`.tag-off`、`.tag-outline` | 矩形標籤：現貨（黑底）、僅剩 N 件（黃底）、已售完（灰底虛線）、庫存數（白底黑框） | `_base.scss` |
| `.badge-status` ＋ `.is-pending`／`.is-paid`／`.is-shipping`／`.is-done`／`.is-cancel` | 5 種訂單狀態的小標籤（配圖示 `bi-clock-fill`／`bi-check-circle`／`bi-truck`／`bi-check2-all`／`bi-x-circle`）。預留給之後的頁面；我的訂單的票根色塊 `.orders-card.is-*`＋`.orders-stub` 用同一組配色 | `_base.scss` |
| `.img-frame` | 灰底圖片框，圖片 cover | `_base.scss` |
| `.qty`（`.qty-btn`、`.qty-input`） | 數量增減：48px 方鍵、2px 黑框。只有「−」停用時（數量 1）只把那一鍵變灰；輸入框也停用（售完）時整組才改成虛線灰框 | `_base.scss` |
| `.option-card`（`-body`、`-title`、`-note`、`-aside`） | 結帳的配送、付款選項卡：選中黃底、停用虛線灰 | `_base.scss` |
| `.nav-underline`（Bootstrap）＋ `.tab-count` | 底線分頁籤（選中 4px 黑底線＋900）；分頁後面的數量小黑方塊 | `_base.scss` |
| `.alert-danger`／`-success`／`-info`／`-warning`／`-light` ＋ `.alert-title` | 實心色帶提示；錯誤一律紅底白字，不放黃底。目前 10 頁只用到 `.alert-danger`（登入、結帳、註冊的狀態示意） | `_base.scss` |
| `.demo-state`、`.demo-state-tag`、`.demo-state-title`、`.demo-state-stage` | 頁面底部的「設計稿狀態示意」：2px 黑線＋黑底黃字標籤＋灰底舞台 | `_base.scss` |
| `.empty-state`、`.empty-state-title` | 空狀態：一句 24／32px 大字＋一個動作 | `_base.scss` |
| `.text-phrase`、`.bleed-x`（mixin `bleed-x`）、`.form-label-optional` | 詞組換行；576px 以下橫向捲動列貼齊螢幕兩側；標籤後的「選填」 | `_base.scss` |
| `.site-toast-wrap`、`.site-toast` | 加入購物車的黑底 toast（在固定結帳列上方） | `_base.scss` |
| `.product-card`（`-media`、`-badges`、`-body`、`-title`、`-meta`、`-price`） | 無框商品卡 | `components/_product-card.scss` |
| `.coupon`（`-stub`、`-label`、`-amount`、`-rule`、`-main`、`-deadline`、`-timer`）＋ `.coupon-on-volt`、`.coupon-lg`；`.countdown`、`.countdown-num`、`.countdown-lg` | 折價券票券與倒數；`.coupon-timer` 把「今日 23:59 截止」與倒數疊成一組 | `components/_coupon.scss` |
| `.coupon-plain`、`.coupon-stack`（變數 `--coupon-split`）、`.coupon-sm` | 白底黑框票券（旁邊已有黃色大面時用）；直式票券（票根在上，撕線與缺口的位置由 `--coupon-split` 決定：外層高度固定時用百分比，否則用長度，票根內容要比它矮）；小版橫式票券（商品詳情價格下方） | `components/_coupon.scss` |
| `.chevron-steps`（`.is-done`／`.is-current`、`-num`、`-label`） | 箭頭步驟；576px 以下只顯示目前步驟（`.is-current` 或 `aria-current`）的文字，其他步驟縮到只包住勾或數字，目前步驟的文字完整顯示。已完成的步驟可以包 `<a>`（結帳頁的「購物車」），hover 只在文字加底線，焦點是內縮的黃框 | `components/_steps.scss` |
| `.buybar`（`-inner`、`-sub`、`-total`、`-total-label`、`-cta`）＋ `.buybar-light` | 固定底部結帳列；商品詳情手機用的白底購買列 | `components/_buybar.scss` |
| `.site-header`、`.site-countdown`（`-line`、`-tag`、`-deadline`、`-sep`、`-link`）、`.site-bar`、`.site-brand`、`.site-menu`、`.site-nav`、`.site-search`、`.site-cart`、`.site-icon-btn` | 頁首：黃色倒數條＋黑列；992px 以下導覽與搜尋框在左側黑色抽屜（同一份 markup） | `components/_header.scss` |
| `.site-footer`（`-services`、`-icon`、`-lead`、`-title`、`-links`、`-copy`） | 黃底頁尾：三個服務、品牌＋三組連結、版權 | `components/_footer.scss` |

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 色彩 | 白 `#FFFFFF`（頁底、卡片）、極致純黑 `#000000`（文字、頁首黑列、黑帶、深色按鈕、框線）、電光亮黃 `#FFE500`（主要 CTA、價格吊牌、倒數條、選中、Hero 色塊、頁尾）、亮黃淺 `#FFF59E`（選項卡、商品分類、顯示密碼鈕的 hover 底；付款處理中的按鈕底） |
| 中性色 | 商品圖底 `#F3F3F3`、停用底 `#E6E6E6`、分隔線 `#D6D6D6`、停用虛線 `#8A8A8A`（只當框線）、placeholder `#6E6E6E`、次要文字 `#5C5C5C`、停用文字 `#555555`、黑底次要字 `#B3B3B3` |
| 對比 | 黃底黑字 16.46:1；黑底黃字 16.46:1；**白底上的黃只有 1.28:1，禁止黃字、黃線、黃圖示**；次要文字白底 6.69、灰底 6.03、黃底 5.24 |
| 狀態色 | 成功 `#0A7A3B`（5.44）、錯誤 `#D3001C`（5.55；黃底上只有 4.35，錯誤不放黃底）、資訊 `#0047BB`（8.02）；低庫存用黃底黑字標籤 |
| 字體 | Inter Tight 600／800／900（數字、價格、倒數、logo、標題裡的西文）＋ Noto Sans TC 400／500／700／900（中文與內文）；所有數字 `tabular-nums` |
| 字級 | Display 72／40、H1 44／32、H2 36／26（螢光筆底）、H3 20／18、內文 15、輔助 14；價格 18／22→28／32／28→40／44→64（`.price-tag` 的五個尺寸） |
| 間距 | `$spacers`：1＝4、2＝8、3＝12、4＝16、5＝24、6＝40、7＝48、8＝64px；區塊上下 48／64；卡片 gap 24、列距 40 |
| 版心 | xxl 1440（比其他風格寬）；購物車、結帳 1280；我的訂單、付款結果 1080；`.container` 內距手機 16、md 以上 32 |
| 框線 | 1px 黑（輸入框、分隔）、2px 黑（按鈕、選項卡、票券、訂單卡）；不用 3px 以上 |
| 圓角 | 0（只有 radio 與熱點圓鈕是圓的） |
| 陰影 | 不用；浮起的東西用黑色實面或 1px 黑框 |
| 焦點 | 白底、黃底：3px 黑實線＋2px 偏移；黑底：3px 黃實線；照片上的熱點：黑框外加一圈黃 |
| 頁首 | 黃色倒數條 40px＋黑列 64px，sticky `top: -40px`；`scroll-padding-top` 72px |
| 固定結帳列 | 桌機 88px、手機 72px；頁尾底部內距加列高＋16px |
| 動態 | 按鈕、連結只換色（120ms），尺寸不變；倒數每秒更新文字（等寬數字，不推擠）；不做跑馬燈、輪播、翻牌、閃爍；`prefers-reduced-motion` 時 transition 關掉，倒數照常更新 |

### 和方向說明不同的地方

實作時依實測調整了幾處，資訊與規則都沒變：

- **首頁 H1**：方向說明寫 72／40px。第二行「活出無限的講究。」有 8 個字，992～1199px 時左半黃塊放不下 72px，所以改成 `clamp(2.5rem, 4.8vw, 4.5rem)`：手機 40、992 約 48、1200 約 58、1400 以上 72，任何寬度都維持兩行。
- **黑帶上的 H2**（四大價值）：黃色螢光筆底配白字對比不足，改成黃字、不加螢光筆。
- **間距尺度**：Bootstrap 預設的 `$spacers` 改成 4／8／12／16／24／40／48／64 八階（見上表），讓 12px 手機 gutter 與 40px 商品列距都有對應的工具類別。
- **倒數條在手機寬度**：方向說明只寫 992px 以下拿掉「今日 23:59 截止」。實測 390 寬放不下，所以 768px 以下再拿掉「限時券」標籤、576px 以下再拿掉「｜」，維持一行不換行。
- **空間靈感情境 C**：「售完的品項不會加入購物車。」放在商品清單下方（不是按鈕下方），讓三張卡的「整套加入購物車」對齊。
- **熱點小卡**：黑色實面（白字、黃色價格），主要行動是 `.btn-volt`「加入購物車」。
- **商品一覽的排序**：1200px 以上排序下拉在黏性分類列右側；1200px 以下分類列只放分類與「篩選」，排序下拉移到「全部商品，共 10 件」那一行右側（兩份 markup，各自有 `id` 與 `label`，用顯示類別切換）。992～1199px 若把排序也放進分類列，7 個分類放不下，最後的「椅子」會被藏起來。
- **商品一覽的分類列**：只有 768px 以下（手機）橫向捲動、右緣淡出；768px 以上不捲動（隱藏捲軸的橫捲列用滑鼠捲不動），放不下時換行：768～991px 排成兩行，992px 以上一行排完。
- **商品一覽的票券方塊**：面額與倒數字級用容器寬度（`cqi`）決定，768px 三欄時不會超出方塊。方塊高度跟著同一列的商品卡，所以內容撐滿上下：「限時券」在頂端、面額與門檻貼著撕線，撕線下方倒數在上、滿寬「登入領取」貼齊底部，不留一大塊空黃。
- **商品卡品名**：加上 `word-break: keep-all`，手機 2 欄時「雙人沙發床」這類詞不會從中間斷開。
- **商品詳情的黏性資訊**：方向說明把三項服務排在資訊欄最後。實測含服務的資訊欄約 820～850px 高，比 1440×900、1280×800 筆電視窗還高，sticky 會切掉底部，只好不黏，右欄捲過資訊後留下約 2,100px 空白。所以三項服務移到主區下方排成灰底一列（992px 以上 44px 黑方塊圖示＋標題＋說明；576～991px 圖示與標題同一行；手機圖示在標題上方），尺寸的標籤和數值改成同一行，間距略收，資訊欄降到 1200px 以上約 660～685px、992～1199px 約 760px。sticky 仍加視窗高度條件：1200px 以上視窗高 800px 起、992～1199px 視窗高 864px 起，更矮的視窗（例如 1366×768）跟著頁面捲動。
- **購物車的進度票券**：門檻標題「滿 NT$ 25,000 折 NT$ 1,000」放在撕線下方，票根只放標籤與倒數。992～1199px 右欄很窄，標題會換成兩行，放在票根裡會壓到撕線。
- **購物車空狀態**：只放一句大字、一句說明與「去逛逛」，不放「0 件」方塊。
- **登入、註冊的票券**：方向說明寫「左下角壓一張黃色票券」。`auth.jpg` 本身有一大面黃牆，1920 寬時票券剛好壓在黃牆上，黃色票券會和牆融成一片，所以 992px 以上照片上的票券改成白底黑框（同 `.coupon-plain` 的配色；這也符合票券「黃面上改白底」的規則）。992px 以下票券在照片下方、白色頁面上，維持黃底黑框。
- **登入、註冊的高度與狀態示意**：左右半的高度＝第一個畫面（扣掉頁首，最少 640px），照片與票券在第一個畫面就完整看得到。狀態示意放在左右半下方的一般版心（不放在右半表單下方）：放在右半時左邊照片會被拉長到 1400px 以上，裁切後幾乎只剩黃牆，黃色面積遠超過 25%。
- **註冊的文案**：照 wireframe SPEC 用 H1「建立新帳號」、按鈕「註冊」、「已經有帳號了？前往登入」，欄位是姓名、Email、密碼、確認密碼（SPEC 沒有手機欄）。
- **付款結果的箭頭步驟**：三段都是「已完成」的黑色，第 3 段同時是目前步驟（`.is-done`＋`aria-current="step"`）。`components/_steps.scss` 的手機規則改成「不是目前步驟才隱藏文字」，所以手機上第 3 段仍顯示「完成訂單」。
- **箭頭步驟在手機寬度**：576px 以下其他步驟縮到只包住勾或數字，剩下的寬度全部給目前步驟，文字完整顯示（「填寫資料與付款」不加刪節號，真的放不下才換成兩行）。
- **付款結果的資訊格**：992px 以上四欄並排；以下訂單編號、預計到貨各佔一整列，付款方式與配送方式並排（訂單編號不換行，390 寬兩欄放不下）。

完整規範請看 `guideline.html`。

### 換色時同步檢查

色票的唯一來源是 `_variables.scss`，但下面幾處把數值寫成文字或寫死，改色（或改頁首、固定結帳列的高度）時要一起檢查（共通的部分也列在上一層 [`../README.md`](../README.md) 的「換色時同步檢查」）：

- [ ] `scss/_variables.scss`：色票、`$theme-colors`（含 `"volt"`）與語意變數（`$body-*`、`$link-*`、`$input-*`、`$focus-ring-color`、`$form-feedback-*`、`$dropdown-*`、`$progress-*`、`$color-contrast-*`），以及每個色票後面註解的對比度。
- [ ] `guideline.html`：「色彩」的三大色塊（hex、角色、對比）、面積比例條、完整色票的 hex／用途／對比、「文字與底色的組合」15 組對比度（其中停用字與 placeholder 兩組用 inline `style="color: #555555"`、`#6E6E6E`）、Bootstrap 主題色與語意變數表；其他章節寫到的色碼與對比（價格吊牌 16.46:1／5.97:1、訂單狀態表、提示訊息 5.55:1、Do／Don't 的 1.28:1 與 4.35:1）。新增或刪除色票時，同步 `scss/pages/_guideline.scss` 的 `$gl-swatches`。
- [ ] 本檔的「Design token 摘要」：色彩、中性色、對比、狀態色、焦點。
- [ ] SCSS 註解裡寫到的色碼：`_base.scss` 黑帶的 `#B3B3B3`、`components/_steps.scss` 的 `#F3F3F3`、`components/_product-card.scss` 的 `#F3F3F3 → #EDEDED`。
- [ ] 改了頁首高度（`$site-countdown-height` 40px、`$site-bar-height` 64px、`$sticky-top-offset` 72px）時：Guideline「間距」的頁首節奏圖與黏性位移文字、目錄列的 ScrollSpy 偏移（`guideline.html` 的 `data-bs-root-margin="-130px …"`），以及本檔「頁首與頁尾」。
- [ ] 改了固定結帳列高度（`$buybar-height` 88px、`$buybar-height-sm` 72px）時：Guideline「間距」與「固定結帳列」的高度、頁尾留白文字。
- [ ] 改了頁首高度或商品詳情資訊欄的內容、字級時：重新量資訊欄高度，調整 `scss/pages/_product-detail.scss` 的 `.pd-info` 視窗高度條件（資訊欄高＋88px＋16px 以內），並同步 Guideline「間距」的黏性位移文字、「RWD」的 lg／xl 說明與「各頁版型」的商品詳情。
- [ ] `scripts/generate-images.mjs` 的 `STYLE`、`PRODUCT_STYLE`、`ROOM`、`PRODUCT`（寫死 `#FFE500`、`#F2F2F2` 與 electric-yellow）：換色後重新生圖，首頁 lookbook 熱點的 `left`／`top` 要重新對位置。
- [ ] `templates/page.html` 與 10 頁的 `theme-color`（`#FFE500`），改完跑 `npm run check`。
- [ ] `images/favicon.svg` 裡的色碼（`#FFE500`、`#000000`）。

## 圖片

`images/` 的圖片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名與 02、03 相同（21 張）。調性：白色空間＋一塊電光黃色塊、黑色金屬細節、正面硬閃光、高對比的快時尚型錄感；**每張空間照只有一個黃色元素**（漆成黃色的牆面、黃色收納盒或黃色毯子），**商品照完全不放黃色**（黃色留給介面）。登入、註冊的 `auth.jpg` 是靜物照：黃色收納盒疊在黃色牆面色塊前，兩者連成同一塊黃，登入頁第一個畫面的黃色面積約 20～24%，在 15～25% 以內。`favicon.svg` 是手繪向量（黃色方塊＋黑色粗體 N，和頁首 logo 同造型）。

| 檔名 | 比例 | 用途 |
|---|---|---|
| `hero.jpg` | 3:2 | 首頁 Hero 右半（裁成接近方形，家具在中段） |
| `room-a.jpg`～`room-c.jpg` | 3:2 | 首頁 lookbook 卡，裁成 4:5（`object-position` 對準家具，熱點座標以裁切後畫面量） |
| `p-1001.jpg`～`p-1010.jpg` | 1:1 | 商品照，淺灰無縫背景 |
| `detail-oak-dining.jpg` | 3:2 | 商品詳情第 2 張（橡木餐桌情境） |
| `detail-oak-grain.jpg`、`detail-oak-leg.jpg` | 1:1 | 商品詳情第 3、4 張（桌面圓角與木紋、桌腳接合） |
| `ugc-1.jpg`、`ugc-2.jpg` | 1:1 | 首頁見證：買家手機閃光燈實拍 |
| `auth.jpg` | 2:3 | 登入、註冊左半（下方三分之一留給票券） |
| `cta.jpg` | 3:2 | 首頁底部 CTA 右半 |

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`（原始 PNG 暫存在系統暫存目錄的 `nestcraft-fastfashion-raw-images/`）：

```bash
npm run images                                         # 產生缺少的圖片
CONC=1 node scripts/generate-images.mjs --only hero,cta # 只重做指定的圖
```
