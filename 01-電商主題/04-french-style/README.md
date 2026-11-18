# 04｜法式復古風：NestCraft 原創生活家居選物

> 淺色系＋暖色調（奶油底、勃艮第紅、焦糖棕）。優雅襯線字體，折抵標籤帶有火漆印章意象。

Notion 風格列：

| 編號 | 風格 | 色系搭配 | UI 視覺特點 |
|---|---|---|---|
| 04 | 法式復古風 | 淺色系＋暖色調（奶油底、勃艮第紅、焦糖棕） | 優雅襯線字體，折抵標籤帶有火漆印章意象 |

## 概念：NestCraft 巴黎選物鋪

把網站想成櫃檯上那本手翻型錄與一張手寫訂購單：每件家具放在襯紙框裡，價格用點線引過去；達到免運的地方，店主蓋一枚勃艮第火漆印。

版面像一本印刷型錄：**置中對稱**、**全站宋體**（連內文、表單都是 Noto Serif TC），外框用**雙線**，價目用**點線**，只有 logo、價格、訂單編號這些西文與數字用 Cormorant Garamond。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（與 01、02、03 相同架構）：

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
| 登入 | `login.html` | `scss/pages/_auth.scss` | 完成 |
| 註冊 | `register.html` | `scss/pages/_auth.scss` | 完成 |
| 我的訂單 | `orders.html` | `scss/pages/_orders.scss` | 完成 |

頁面上沒有列出所有頁面的導覽：從首頁依購物流程點進各頁即可，Guideline 直接開 `guideline.html`。

商品詳情只做一頁靜態示範（橡木餐桌），所有商品卡都連到 `product.html`。已售完、低庫存、多尺寸模式（沙發床）等變化，放在該頁底部的「設計稿狀態示意」。

我的訂單上方的狀態列（全部、待付款、已付款、出貨中、已完成、已取消）可以實際切換，點了只顯示該狀態的訂單。

**與 wireframe 的刻意差異**：資訊架構、區塊、文案、按鈕都和 wireframe 相同，只換構圖。

- 首頁 Hero 不是「文字與圖片左右兩欄」，改成滿版照片＋壓在照片下緣的置中徽框；空間靈感不用分頁切換，三個情境上下排成之字形全部攤開。
- 商品一覽沒有左側欄：分類改成置中的文字列，寬度、價格、庫存篩選收進「更多篩選」抽屜。
- 商品詳情左右反過來：資訊在左（窄）、圖庫在右，縮圖是橢圓浮雕。
- 購物車是整寬帳冊表格，總計在帳冊下方右側；結帳是單欄置中的「訂購單」，摘要在最上、確認付款在最下。
- 付款結果、登入、註冊、我的訂單都是置中單欄（沒有左右分欄、沒有會員側欄）。

## 排版語言

後面做其他頁的人，照這一節做，不要套其他風格的版型。

### 網格與版心

- 12 欄，`$grid-gutter-width: 2rem`，`$container-padding-x: 2.5rem`（手機左右各 20px）。
- 版心比其他風格窄，像一本書：xl 1140、xxl 1200。
- 窄頁用 `.container .container-<名稱>`（寬度在 `$page-widths`）：`login` 480、`result` 680、`checkout` 780、`orders` 880、`cart` 1040。其他寬度用 `.container-narrow` 加 `style="--narrow: 720px"`。
- 區塊上下留白：手機 56px、md 80px、lg 112px（`.section`）。交替區塊用羊皮紙底 `.section-alt`。

### 核心規則：置中與對稱

- 頁面標題、區塊標題、步驟條、分類列、按鈕列、頁尾都**置中**。
- 長段落文字**靠左**（中文置中長段落難讀），但段落本身限寬 34em 並置中在版心（`.measure`）。
- 兩欄構圖只在需要時用（首頁情境、商品詳情、CTA），而且要左右平衡；能單欄就單欄。

### 頁首：兩層刊頭（沒有公告列）

- **≥ 992px**：第一層 88px `.masthead`（左底線式搜尋框｜中火漆小印「N」＋ Cormorant 斜體 NestCraft＋「原創生活家居選物」｜右「會員」「購物車 4」）；第二層 52px `.site-nav`，置中導覽「首頁 ◆ 商品一覽 ◆ 空間靈感 ◆ 我的訂單」，上下各一條焦糖雙線。目前頁＝勃艮第字＋文字下方 6px 的 1px 底線＋`aria-current="page"`。
- **黏性**：`.site-header { position: sticky; top: -88px }`，捲動時第一層離開、只留導覽層（純 CSS）。`html { scroll-padding-top: 60px }`（手機 80px）。改第一層高度時，`$masthead-height`、`$scroll-offset-lg` 與 Guideline「間距」的文字要一起改。
- **< 992px**：單列 64px `.site-bar`（左漢堡、中 logo、右搜尋鈕與購物車）。漢堡開 `offcanvas-start` 手機選單 `#siteMenu`（紙面、內縮雙線框、置中襯線大連結、搜尋框在最上面）；放大鏡展開 `#siteSearchMobile` 搜尋列（`js/main.js` 自動聚焦）。
- 手機選單寫在 `<header>` **之前**（仍在 `skip-link` 到 `</header>` 的共用區塊內）：不在 sticky 頁首的堆疊層裡，背景遮罩才蓋得住頁首。
- 導覽連結的 class 只能是 `nav-link` 或 `nav-link active`（`check-layout.mjs` 只認這兩種），菱形畫在 `li + li::before`，樣式從父層選。頁首導覽與手機選單**兩處**都要標目前頁。

### 頁尾

深勃艮第底、奶油字，全部置中：奶油色火漆 logo → 品牌語 → 三組連結（md 以上置中三欄，小標淺焦糖）→ 小花飾 → 版權小字。

### 卡片

- **商品卡 `.product-card`**：無外框。圖片放在襯紙框 `.mat`（紙面底、12px 內距、1px 髮絲線外框，圖片本身再一圈淡勃艮第細框）；文字全部置中：眉標分類 → 品名（600 18px）→ 尺寸（14px 褐灰）→ 價格（Cormorant 24px）→ 滿寬按鈕。商品列表的按鈕是雙線次要按鈕「加入購物車」；首頁人氣嚴選是勃艮第「閃電結帳」。價格與按鈕貼底，卡片等高。hover：襯紙框外框變勃艮第、品名加底線，不位移、不放大圖片。
- **一張紙 `.sheet`**：紙面底＋焦糖雙線框，內距 48px（`.sheet-lg` 56px）。用在結帳訂購單、登入／註冊卡、付款結果收據、我的訂單每一張收據。
- **雙線襯紙框 `.mat-double`**：首頁情境圖與商品詳情主圖共用（`_base.scss`）。
- **徽框 `.cartouche`**（首頁 Hero，四角內凹、雙線也跟著內凹）只用在首頁。
- **售完的商品卡**：襯紙框加 `.is-soldout`（照片降飽和、變淡），左上角壓一張紙面小籤 `.product-card-flag`「已售完」，按鈕停用並寫「已售完」；不放火漆印。

### 標題階層

| 層級 | 字體 | 桌機／手機 | 用法 |
|---|---|---|---|
| Display | Noto Serif TC 600 | 52／34px，字距 .04em | 首頁 H1（徽框裡） |
| H1 | Noto Serif TC 600 | 40／30px | 各頁標題，置中 |
| H2 | Noto Serif TC 600 | 32／26px | 區塊標題，置中，下方接花飾線 |
| H3 | Noto Serif TC 600 | 22／19px | 卡片群標題、表單段落 |
| 眉標 `.eyebrow` | Noto Serif TC 600 | 14px，字距 .24em，深焦糖 | 分類、小標；用中文加字距，不用英文大寫、不用編號 |
| 內文 | Noto Serif TC 400 | 17／16px，行高 1.9 | 段落限寬 34em |
| 輔助 `.text-note` | Noto Serif TC 400 | 14px | 說明、尺寸；**不小於 14px** |
| 價格 `.price` | Cormorant Garamond 600 | 卡片 24、詳情 40（`.price-lg`）、總計 36px（`.price-total`） | 齊線等寬數字 |

- 區塊標題用 `.section-heading`（H2 自動接花飾線，下面可放一句說明與 `.btn-text` 連結）。
- **中文不用斜體**（`em`、`i`、`cite` 已改成正體）；只有 Cormorant 的西文能斜。Cormorant 不用在 20px 以下，也不用在中英混排的標題。

### 招牌元素

1. **火漆印 `.seal`**（`components/_seal.scss`）：16 瓣波浪邊、壓印環、浮雕感，中心是真文字。意思永遠是「已經折抵／已經成立」：
   - `.seal-sm` 40px：商品卡，單件就達滿 NT$ 3,000 免運、且有庫存的商品印「免運」（p-1001、p-1002、p-1004、p-1005、p-1006、p-1009；藤編收納櫃售完不放；p-1007、p-1008、p-1010 未達門檻不放）。
   - `.seal` 56px：商品詳情價格旁（「單件即享免運」）、購物車與結帳的運費列（「已達滿 NT$ 3,000 免運門檻」）。**金額不變**，應付總額仍是 NT$ 20,250。
   - `.seal-lg` 96px：付款結果的成功印（中心 `bi-check-lg`），加 `.seal-stamp` 播一次蓋印回彈。
   - 同一畫面 56px 以上的印最多 1 枚；失敗、警示、售完都不用印。
2. **點線引導 `.leader`**：名稱……數值，像菜單價目。用在空間靈感價目、商品詳情尺寸卡與規格表、購物車總計、結帳訂購單、付款結果收據、訂單明細。
3. **雙線的一張紙 `.sheet`**：見上。
- **花飾**：H2 下方的花飾線（菱形＋左右 48px 髮絲線）、小花飾 `<svg class="fleuron"><use href="#fleuron"></use></svg>`、行內菱形 `.diamond-sep`。只放在區塊 H2 下方、頁尾、訂購單段落之間、步驟條連接線、空狀態；**一個畫面最多 3 個**。

### 線與形狀

- 圓角 0。只有火漆印、橢圓浮雕 `.cameo`、radio、狀態圓點、首頁價值圖示圈與熱點是圓的。開關（`form-switch`）也是直角：方框軌道＋方塊滑鈕（`$form-switch-border-radius: 0`，三張滑鈕 SVG 改成方塊）。
- 雙線（外線 1px＋3px 間隙＋內線 1px）用 mixin `double-line($line, $bg)` 畫（border＋兩層 inset box-shadow），`$bg` 要等於元素自己的底色。外框（訂購單、登入卡、熱點小卡、收據、徽框）用焦糖；次要按鈕用勃艮第。
- 髮絲線 1px `$line`：列表分隔、帳冊列。點線：`.leader` 與狀態示意的分隔線。
- 不用陰影；只有下拉選單、熱點小卡、Modal 用極淡的 `0 8px 24px rgba(42,28,22,.12)`。

### 各頁構圖原則

- **首頁**（完成）：滿版照片＋徽框 Hero → 羊皮紙 2×2 價值（十字髮絲線＋交叉點花飾）→ 三段之字形情境（A 圖左、B 圖右、C 圖左；熱點點擊開小卡）→ 人氣嚴選 4 欄（< 992px 橫向捲動）→ 明信片見證＋菱形分隔的承諾 → 勃艮第 CTA 帶。
- **商品一覽**（完成）：置中頁首 → 置中分類文字列（數量是右上小字、菱形分隔；576px 以下橫向捲動貼齊兩側）→ 上下焦糖雙線的工具列（共 10 件｜更多篩選｜排序；手機只有「篩選與排序」，排序移進篩選面板）→ 3 欄襯紙框卡（手機 2 欄），第 6 張後插整列羊皮紙宣言帶（左：花飾＋H3＋說明＋連結；右：點線尺寸示意「你的牆面寬度」）→ 最後一列只有 1 張，置中 → 置中「已顯示全部 10 件商品」。沒有側欄。篩選是 `offcanvas-end`，紙面雙線框，寬度選項用點線接數量。
- **商品詳情**（完成）：資訊在左、圖庫在右（DOM 先圖庫，`order-lg-*` 換位；lg 6／6、xl 以上 5／7）；主圖放在雙線襯紙框，下方置中 4 個橢圓浮雕縮圖（就是 carousel 的指示器）；價格旁 56px 印；點線尺寸卡；三個服務在 576px 以上是三欄＋髮絲直線，以下改成圖示在左的三列。置中分頁籤（`.nav-underline`，選中＝勃艮第 2px 底線＋小菱形）：商品詳情分頁 7／5（說明＋說明圖＋宋體數字組裝步驟｜雙線框點線規格表）。相關商品是羊皮紙整列區塊。
- **購物車**（完成）：1040 寬整寬帳冊；992px 以上是表格（欄頭＋墨褐雙線、列之間髮絲線、小計 Cormorant 靠右），以下每列變成「縮圖左、資訊右，數量與小計在底行」，底行上方一條貫穿整列的點線，並在帳冊上方放一行應付總計＋「前往結帳」。帳冊下方左折扣碼＋兩則服務說明、右點線總計＋運費火漆印。
- **結帳**（完成）：780 寬單欄置中訂購單 `.sheet.sheet-lg`：訂單摘要在最上 → 收件 → 配送 → 付款 → 發票備註 → 金額總計＋火漆印＋確認付款在最下；段落標題是置中 H2，段落之間置中菱形。信用卡欄位只在選「信用卡」時顯示（`:has()`）。狀態示意放在訂購單下方。
- **付款結果**（完成）：680 寬置中書信：步驟條三步全部完成（最後一步 `.is-done`＋`aria-current="step"`）→ 96px 火漆成功印（`.seal-lg.seal-stamp`，蓋印回彈一次）→ H1 → 說明 → 雙線收據（最上方置中「訂單摘要」與 Cormorant 30px 訂單編號 → 點線列付款、配送、到貨 → 左右髮絲線夾著的「購買品項」小標 → 三項點線 → 墨褐雙線 → 付款金額 36px）→ 「接下來會發生什麼」置中 H2＋花飾線、三段置中短文以菱形分隔 → 兩顆等寬按鈕（576px 以上並排、最寬 512px）。狀態示意「付款未完成時」：示意步驟條停在第 2 步 → 朱磚 1.5px 細圈＋`bi-exclamation-lg`（不是印）→ H3 → `.alert-danger` 說明框（裡面一列點線應付金額）→ 菱形項目符號的處理建議 → 「重新付款」「返回購物車」。
- **登入／註冊**（完成）：480 寬置中邀請卡 `.sheet`（沒有左右分欄）。橢圓浮雕照片（`auth.jpg`，`.cameo`）**跨在卡片上緣**，一半在卡外的奶油底上、一半在卡內，外圈是 6px 紙面環＋1px 焦糖細線；照片放大 1.3 倍對準曲木椅。登入 120×160（手機 96×128），註冊 `.auth-cameo-sm` 96×128。卡內：置中 H1 與說明 → 欄位（靠左）→ 勃艮第滿寬主要按鈕 → 登入有「或」分隔（左右髮絲線、文字兩側小菱形）與 LINE、Google 雙線按鈕；註冊在說明下方有上下髮絲線夾著的三個好處 → 卡底一條髮絲線上方是切換連結。狀態示意在卡片下方。
- **設計 Guideline**（完成）：1200 版心、全部置中，像型錄最前面的凡例。封面（麵包屑 → H1 → 花飾 → 說明 → 菱形分隔的版本資訊）→ 目錄是一張雙線紙 `.sheet`，九節用點線引到中文數字。各節奶油與羊皮紙交替，開頭是焦糖細圈的中文數字＋置中 H2＋花飾線：一 概覽（雙線襯紙框情境圖＋點線規格、四個原則、10 頁清單）→ 二 色彩（比例條、五組色卡附點線對比度、勃艮第面示範、Bootstrap 變數對應）→ 三 字級階層（三套字體、用頁面真的 class 排的字級表、小訂購單示範數字與金額、換行與斜體）→ 四 間距（spacer 0–8、區塊與頁首節奏圖、兩層刊頭黏性示意、間距數值）→ 五 圓角、框線與陰影 → 六 火漆印（三種尺寸、構造、可以與不可以蓋印、蓋印回彈）→ 七 元件狀態（按鈕五態、表單欄位、選項卡、可實際切換的分頁籤、導覽、步驟條、徽章與庫存、提示、空狀態＋10 頁的狀態示意清單、商品卡）→ 八 RWD 斷點（斷點表、992px 刊頭變化、10 頁版型行為、橫向捲動、格線與窄頁版心）→ 九 Do／Don’t 7 組（左建議、右避免，手機上下排）。每節最後一個「回到目錄」。滑過與焦點狀態用 `.gl-is-hover`、`.gl-is-focus` 固定顯示，這兩個 class 只在 Guideline 用。
- **我的訂單**（完成）：880 寬、全部置中，沒有會員側欄：頁首（麵包屑 → H1 → 說明 → 一行「王小明 ◆ Email」→ 一行文字連結「個人資料　收件地址　登出」）→ 置中狀態分頁（`.nav-underline`，768px 以下橫向捲動、576px 以下貼齊螢幕兩側）→ 每筆訂單一張雙線收據 `.sheet`：頭列（Cormorant 22px 編號＋「2026-09-23 下單」｜狀態徽章，下方髮絲線）→ 64px 襯紙框縮圖＋品名 × 數量，右側「共 N 件」＋ Cormorant 28px 金額（768px 以下金額移到品項下方，用點線引過去）→ 出貨中多一條 4 個菱形節點的配送進度（已到勃艮第實心、目前再加一圈、未到焦糖細框；走過的線是勃艮第實線、沒走的是點線）→ 底列（配送資訊｜「訂單明細」、已完成多「再買一次」）→ 訂單明細 collapse：上方點線，992px 以上左 7 點線明細、右 5 收件付款資訊與狀態歷程（中間髮絲直線），以下上下排。待付款的明細預設展開，付款期限用深焦糖字＋淺焦糖底提醒。已取消的金額改褐灰。

## 檔案結構

```
04-french-style/
├─ *.html                    ← 10 個頁面，每頁完整包含頁首（含 SVG 圖示庫、手機選單）與頁尾
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的四個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 商品照、空間情境圖（AI 生成）、favicon.svg（手繪向量火漆印）
├─ scss/
│  ├─ main.scss              ← 樣式進入點
│  ├─ _variables.scss        ← ★ Design token：色票與 Bootstrap 變數覆寫
│  ├─ _base.scss             ← 全站基礎、線條語言、共用類別、double-line mixin
│  ├─ components/            ← 頁首、頁尾、火漆印、商品卡、結帳步驟、選項卡、收據、密碼欄
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾是否與範本一致
   └─ generate-images.mjs    ← 生圖腳本（所有圖片的 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾每頁一份**：先改 `templates/page.html`，再同步到每一頁，最後 `npm run check`。`check-layout.mjs` 比對三段：`<head>`、「`<a class="skip-link"` 到第一個 `</header>`」（包含 SVG 圖示庫、手機選單、兩層刊頭、手機搜尋列）、「`<footer class="site-footer">` 到 `</html>`」。
- **目前頁標示**：頁首導覽 `.site-nav` 與手機選單 `.site-menu-list` 兩處，目前頁的連結改成 `class="nav-link active"`＋`aria-current="page"`；商品詳情標「商品一覽」但不加 `aria-current`；購物車、結帳、付款結果、登入、註冊、Guideline 不標。
- **SVG 圖示庫**：火漆印的蠟面 `#seal-wax`（含漸層 `#seal-grad`）與小花飾 `#fleuron` 寫在頁首區塊開頭，每頁一份，各處用 `<use href="#…">` 引用。圖示庫用 `.svg-sprite`（寬高 0），不要改成 `display: none`，Chrome 會讓 symbol 裡的漸層失效。
- **假資料直接寫在 HTML**：資料逐字照 `02-muji-style/*.html`。購物車 3 項 4 件、商品小計與應付總額 NT$ 20,250（免運）；付款結果 NC-20260923-001；低庫存門檻 10 件；售完是藤編收納櫃。
- **換行與空白**：品名詞組斷點用 `<wbr>`＋`.text-phrase`；數字與單位、W × D × H 之間用 `&nbsp;`。
- **表單**：設計稿用 `<form action="下一頁">` GET 送出，密碼、Email、卡號這類個資欄位不加 `name`；欄位要有 `id`＋`<label for>`＋`autocomplete`。
- **JS**：`js/main.js` 只做四件事：手機搜尋列展開後自動聚焦（`#siteSearchMobile`）、`data-toggle-password` 顯示／隱藏密碼、分頁籤用方向鍵切換時把目前項目捲進畫面、我的訂單的狀態篩選（`data-filter-list`＋`data-filter` 按鈕對應每筆訂單的 `data-status`）。

## 樣式架構

`scss/main.scss` 的載入順序：Bootstrap functions → `_variables.scss` → Bootstrap → Bootstrap Icons → `_base.scss` → `components/*`（header、footer、seal、product-card、steps、radio-card、receipt、password-field）→ `pages/*`。

先用 Bootstrap 的變數與工具類別，做不到才寫自訂 CSS，自訂 CSS 只引用變數，不寫死色碼。

### 共用類別

新頁面直接套用，不要在 `pages/*` 另寫一份。

| 類別 | 用途 | 位置 |
|---|---|---|
| `.page-header`、`.page-lead` | 首頁以外各頁的置中頁首：麵包屑（或 `.checkout-steps`）→ h1 → 一句說明 | `_base.scss` |
| `.section`、`.section-alt`、`.section-heading` | 區塊留白 56／80／112px、羊皮紙底、置中 H2＋花飾線＋說明＋連結 | `_base.scss` |
| `.container-login`／`-result`／`-checkout`／`-orders`／`-cart`、`.container-narrow` | 窄頁版心 | `_base.scss` |
| `.measure` | 段落限寬 34em 並置中 | `_base.scss` |
| `.eyebrow` | 眉標（深焦糖 14px、字距 .24em） | `_base.scss` |
| `.num`、`.price`、`.price-lg`、`.price-total`、`.display-num` | `.num` 是 Noto Serif TC 的齊線數字（這套字沒有等寬數字，金額欄靠右對齊）；其餘是 Cormorant 齊線等寬數字：價格 24／40／36px、大數字 | `_base.scss` |
| `.text-note`、`.text-phrase` | 14px 說明；品名只在空白與 `<wbr>` 處換行 | `_base.scss` |
| `.ornament`、`.fleuron`、`.diamond-sep` | 花飾線、小花飾、行內菱形（一畫面最多 3 個花飾） | `_base.scss` |
| `.rule`、`.rule-double` | 髮絲分隔、總計上方的雙線 | `_base.scss` |
| `.mat`、`.mat-img`（`.mat-img-wide` 3:2）、`.mat-sm`、`.mat-double` | 襯紙框；`.mat-double` 是焦糖雙線的大框（首頁情境圖、商品詳情主圖） | `_base.scss` |
| `.cameo`、`.cameo-ring` | 橢圓浮雕框（4:5）；目前那張的勃艮第圈 | `_base.scss` |
| `.sheet`、`.sheet-lg` | 雙線的一張紙 | `_base.scss` |
| `.leader-list`、`.leader`、`.leader-wrap` | 點線引導；第一個子元素是名稱、最後一個是數值（`<dl>` 裡用 `<div class="leader"><dt>…<dd>…`）。數值可能很長時加 `.leader-wrap`：數值最寬 72%（576px 以上 62%）、可換行並靠右（規格表） | `_base.scss` |
| mixin `double-line($line, $bg)`、`double-rule-y`、`focus-ring` | 雙線外框、上下雙線、焦點環 | `_base.scss` |
| `.btn-primary`、`.btn-outline-primary`、`.btn-cream`、`.btn-text` | 勃艮第主要；雙線次要；勃艮第面上的奶油按鈕；文字連結（hover 底線 1px→2px）。高度：`.btn-sm` 44px、預設 50px、`.btn-lg` 60px | `_base.scss` |
| `.qty` | 數量鍵（直角 44px 方鍵） | `_base.scss` |
| `.nav-underline`（Bootstrap）＋`.tab-count` | 置中分頁籤，選中＝勃艮第 2px 底線＋小菱形；數量上標 | `_base.scss` |
| `.stock`、`.stock.is-low`、`.stock.is-out` | 庫存 12 件（橄欖圓點）、僅剩 5 件（深焦糖＋淺焦糖底）、已售完 | `_base.scss` |
| `.badge-status` ＋ `.is-pending`／`.is-paid`／`.is-shipping`／`.is-done`／`.is-cancel` | 5 種訂單狀態（勃艮第框空心點／墨褐框實心點／深焦糖底＋卡車／墨褐底＋勾／褐灰虛線框） | `_base.scss` |
| `.form-label-optional`、`.field-error`、`.is-invalid` | 選填標示；錯誤＝朱磚 2px 框＋`bi-exclamation-circle`＋文字 | `_base.scss` |
| `.alert-danger`（Bootstrap） | 表單最上方的錯誤摘要：紙面底、墨褐字、朱磚框＋左側 4px 朱磚線，圖示朱磚色 | `_base.scss` |
| `.demo-state`、`.demo-state-tag`、`.demo-state-title`、`.demo-state-note`、`.demo-state-stage` | 頁面底部「設計稿狀態示意」：點線分隔、標籤置中壓在點線上、示意畫面用虛線框 | `_base.scss` |
| `.empty-state` | 空狀態：置中一句話＋小花飾＋按鈕 | `_base.scss` |
| `.bleed-x` | 576px 以下讓橫向捲動列貼齊螢幕兩側 | `_base.scss` |
| `.seal`、`.seal-sm`、`.seal-lg`、`.seal-text`、`.seal-note`、`.seal-stamp` | 火漆印（寫法見 `components/_seal.scss` 開頭註解） | `components/_seal.scss` |
| `.product-card`（`-media`、`-body`、`-title`、`-dim`、`-price`、`-seal`、`-flag`） | 商品卡（markup 範例見檔案開頭註解）；售完＝`.product-card-media.is-soldout`＋左上角小籤 `.product-card-flag` | `components/_product-card.scss` |
| `.checkout-steps`（`.is-done`、`.is-current`、`-dot`、`-label`） | 置中步驟條：一、二、三；連接線中央小菱形。已完成的步驟可以包一層 `<a>` 回到上一步（結帳頁的「購物車」），文字有底線，hover 變勃艮第 2px 底線。三步全部完成（付款結果）：三個都是 `.is-done`，最後一步加 `aria-current="step"`（文字加粗，手機上仍顯示）。576px 以下只顯示目前步驟的文字，連接線 24px、左右各 8px，360px 寬也放得進版心 | `components/_steps.scss` |
| `.receipt-no`、`.receipt-no-lg` | 收據的訂單編號：Cormorant 22px／30px（手機 26px），齊線等寬數字、不換行 | `components/_receipt.scss` |
| `.receipt-rule` | 收據裡的小段標題：置中眉標＋左右髮絲線（`<h3 class="receipt-rule"><span>購買品項</span></h3>`），不算花飾 | `components/_receipt.scss` |
| `.leader-total` | 收據的總計列，接在 `.rule-double` 下方：`<p class="leader leader-total"><span>付款金額</span><span class="price price-total">…</span></p>`（付款結果、我的訂單明細） | `components/_receipt.scss` |
| `.password-field`、`.password-toggle` | 密碼欄＋疊在右側的顯示密碼按鈕（46px、左側髮絲線，按下後勃艮第）；搭配 `data-toggle-password` | `components/_password-field.scss` |
| `.radio-card`（`-label`、`-title`、`-desc`、`-meta`） | 選項卡：選中＝玫瑰霧底＋勃艮第框；停用＝羊皮紙底＋虛線 | `components/_radio-card.scss` |
| `.breadcrumb`（Bootstrap） | 置中麵包屑，分隔符號是全形斜線「／」，最後一項是目前頁、不做成連結 | `_base.scss` |
| `.dropdown-menu`、`.modal`（Bootstrap） | 浮層：直角紙面，只有這裡（與首頁熱點小卡）用極淡陰影 | `_base.scss` |
| `.site-header`、`.masthead`、`.site-nav`、`.site-bar`、`.site-menu`、`.site-search-mobile` | 頁首（兩層刊頭、手機單列、手機選單、手機搜尋列），寫在範本裡，各頁不另外改 | `components/_header.scss` |
| `.site-footer`（`-lead`、`-cols`、`-title`、`-links`、`-fleuron`、`-copy`） | 頁尾，寫在範本裡 | `components/_footer.scss` |

`scss/pages/_guideline.scss` 的 `.gl-*` 只給 Guideline 排版用（色卡、字級表、示意圖、Do／Don’t 框），其他頁不要套。

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 色彩 | 奶油底 `$cream #F5ECD9`（頁面）、紙面 `$paper #FBF7EE`（卡片、輸入框、襯紙框、一張紙）、羊皮紙 `$parchment #EDE0C6`（交替區塊、停用）、墨褐 `$ink #2A1C16`（主文字）、褐灰 `$ink-soft #64503F`（次要文字）、淡褐 `$ink-faint #7A6552`（只在紙面上的 placeholder）、勃艮第 `$burgundy #6D1F2F`（主要按鈕、連結、目前頁、焦點、火漆印）、深勃艮第 `$burgundy-deep #561726`（按鈕 hover、頁尾）、玫瑰霧 `$rose #F1DCDC`（選中的選項卡）、焦糖 `$caramel #B0702F`（只當裝飾或 24px 以上大字）、深焦糖 `$caramel-deep #8A521C`（眉標、低庫存）、淺焦糖 `$caramel-light #E9C9A0`（勃艮第面上的小標）、髮絲線 `$line #DCCBAE`、控制項框 `$line-strong #8F7B63` |
| 狀態色 | 成功 `$olive #4E6B35`、錯誤 `$brick #B23A1E`（朱磚，比勃艮第偏橘；勃艮第永遠不表示錯誤）、警示 `$caramel-deep` on `$caramel-wash #F6E3C8`、資訊 `$slate #3D5A78` |
| 字體 | Noto Serif TC（全站，標題 600／內文 400／按鈕與標籤 600）＋ Cormorant Garamond（logo、20px 以上的價格與數字）＋ 芫荽 Iansui（只用在首頁見證引言） |
| 間距 | spacer 8 階：4、8、16、24、40、56、80、112px；區塊 56／80／112px |
| 圓角 | 0（火漆印、橢圓浮雕、radio、狀態圓點例外） |
| 陰影 | 不用；浮層（下拉、熱點小卡、Modal）用 `0 8px 24px rgba(42,28,22,.12)` |
| 焦點 | 2px 勃艮第實線＋2px 偏移；勃艮第面上改奶油色；輸入框是 2px 勃艮第框 |
| 頁首 | 第一層 `$masthead-height` 88px、導覽層 `$site-nav-height` 52px（含上下框線 54px）、手機 `$site-bar-height` 64px（含 1px 底線的總高，`.site-bar-inner` 是 63px）；`scroll-padding-top` 桌機 60px、手機 80px |
| 動態 | 只有付款結果的蓋印回彈（560ms，`prefers-reduced-motion` 時取消）與 150ms 的顏色、底線過渡；不做進場動畫、視差、自動輪播 |

完整規範請看 `guideline.html`。

### 換色時同步檢查

色票的唯一來源是 `_variables.scss`，但下面幾處把數值寫成文字或寫死，改色（或改頁首高度）時要一起檢查：

- [ ] `scss/_variables.scss`：色票、`$theme-colors` 與語意變數（`$body-*`、`$input-*`、`$focus-ring-color`、`$link-*`、`$form-feedback-*`、`$color-contrast-light`）。
- [ ] `guideline.html`：色卡的 hex、點線對比度與用途文字，「Bootstrap 變數對應」，字級階層與 Do／Don’t 裡寫到的色碼與對比（焦糖 3.44:1、深焦糖 5.41:1、火漆印字最亮處 6.26:1）；新增或刪除色票時，同步 `scss/pages/_guideline.scss` 的 `$gl-swatches`。
- [ ] 本檔的「Design token 摘要」：色彩、狀態色、頁首。
- [ ] 改了頁首高度（`$masthead-height` 88px、`$site-nav-height` 52px、`$site-bar-height` 64px，`$scroll-offset-lg`／`-sm` 會跟著算）時，Guideline「間距」的兩層刊頭示意、間距數值與 `scroll-padding-top` 文字，以及本檔「頁首：兩層刊頭」一起改。
- [ ] `scripts/generate-images.mjs` 的 `STYLE`（房間圖）與 `TONE`（商品照）：換色後重新生圖，首頁熱點的 `left`／`top` 要重新對位置。
- [ ] `templates/page.html` 與 10 頁的 `theme-color`（`#F5ECD9`）。
- [ ] `templates/page.html` 與 10 頁頁首 SVG 圖示庫的漸層色：`#seal-grad`（`#9A3346`、`#6D1F2F`、`#561726`）、`#seal-bevel` 與 `#seal-press`（`#F8EFDC`、`#2A1C16`）、壓印細線 `#F8EFDC`。改完跑 `npm run check`。
- [ ] `images/favicon.svg` 裡的火漆印色碼（`#9A3346`、`#6D1F2F`、`#561726`、`#F8EFDC`）。

### 與方向說明不同的地方

- 刊頭 logo 下方的「原創生活家居選物」用 14px（方向說明寫 13px），遵守宋體不小於 14px 的規則。
- 首頁最終 CTA 帶用 `$burgundy`，不用 `$burgundy-deep`：它下面緊接著深勃艮第頁尾，同色會黏成一大塊，換淺一階才分得出兩層。
- 首頁 Hero 副標在手機用 15px（桌機 17px），兩句話各自一行，不會在句子中間斷開。
- 導覽之間的菱形用旋轉的小方塊畫（`li + li::before`），沒有另做 SVG mask，效果相同。
- 首頁情境的點線價目下方多一行尺寸（和 02 一樣），方便和熱點小卡對照。
- 商品照的 prompt 只取 `STYLE` 的色調與光線（`TONE`），不帶房間元素，避免無縫背景裡出現地板或窗框。
- 商品一覽在手機的商品卡火漆印維持 40px（方向說明寫 32px）：32px 的印放 12px「免運」兩字太擠，40px 在 2 欄卡上也不會壓到照片主體。
- 商品詳情主區在 992–1199px 用 6／6，1200px 以上才是 5／7：992px 時左欄 5 欄只剩約 350px，價格列與三個服務會擠成好幾行。
- 商品詳情分頁「商品詳情」用 7／5（方向說明寫 2／3＋1／3）：規格表的「組裝方式」「配送方式」數值較長，5 欄才不會一字一行。「規格」分頁放同一份點線規格表，置中、最寬 40rem。
- 商品詳情的「你可能也會喜歡」放在羊皮紙整列區塊（`.section-alt`），跟上方分頁內容分開。
- 購物車在 992px 以下（不只手機）就改成卡片列＋頂部一行應付總計：768px 時其他四欄固定寬，品名欄只剩約 70px。
- 結帳訂購單的訂單摘要用完整品名（不用短名），手機上品名可換行，`× 2` 用不換行空白黏在品名後面。最後一段的標題是「金額總計」。
- 付款結果的收據把訂單編號放在最上方置中（Cormorant 30px），不做成點線列；付款、配送、到貨與品項才用點線。頁首下距在 992px 以上是 56px（其他頁 80px），書信和收據靠近一點。
- 付款結果「付款未完成時」的示意框比版心窄，步驟條的連接線再縮短：768px 以下 24px，390px 以下的小手機 16px，只剩中央菱形。版心裡的步驟條是 768px 以上 72px、576–767px 40px、手機 24px；360px 寬也放得下。
- 首頁 Hero 照片在桌機的高度改成 `clamp(360px, calc(100vh - 385px), 640px)`（方向說明寫 `clamp(480px, 64vh, 640px)`）：原本在 1366×768、1280×800、1440×900 的筆電上，徽框裡的主按鈕落在第一屏以下；改成跟視窗高度連動後，主按鈕下緣離視窗底約 32px，視窗高 1025px 以上仍是 640px。
- 登入、註冊卡的橢圓浮雕照片跨在卡片上緣（方向說明只寫「最上方」），像邀請卡上的徽章；照片放大 1.3 倍，橢圓裡看得清曲木椅。
- 註冊頁的文案與欄位照 02 與同主題其他 2 套：H1 與按鈕是「建立帳號」、多一欄「手機」、底部「已經有帳號？登入」（方向說明寫「註冊」「已經有帳號了？前往登入」）。登入、註冊卡上方不另放「會員登入」小標，和既有 3 套一致。
- `.btn-sm` 的上下內距是 10px，高約 44px（原本 8px 只有 40px）：首頁熱點小卡、商品一覽工具列、購物車 992px 以下的頂部總計列、我的訂單都用到它，44px 才符合觸控目標。
- 置中分頁籤 `.nav-underline` 上、左、右各留 4px 內距，焦點框改成往外 2px：它設了 `overflow-x: auto` 會裁掉外框，原本往內縮的焦點框會壓到字。
- Guideline 的章節在 SPEC 的六項之外多一節「火漆印」，放在「圓角、框線與陰影」與「元件狀態」之間；SPEC 六項的先後順序不變，最前面另有「概覽」。
- 我的訂單的訂單明細在 992px 以上才分左右兩欄（7／5），以下上下排：768px 時右欄只剩約 190px，「虛擬帳號……9981 2345 6789 0123」放不下。

## 圖片

`images/` 的圖片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意；`favicon.svg` 是手繪向量的火漆印。替換時保持相同檔名即可，不需改程式。

- 調性：巴黎老公寓、奶油灰泥牆、人字拼橡木地板、高窗白紗簾、午後金色窗光；勃艮第與焦糖只出現在小織品（絨布抱枕、羊毛毯），家具本身維持橡木、亞麻、藤編。
- 生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`（`STYLE` 是房間圖的共同調性，`TONE` 是商品照的色調）；原始 PNG 暫存在系統暫存資料夾的 `nestcraft-french-raw-images/`。
- 首頁熱點的 `left`／`top` 百分比是對照這組照片量的；重新生圖後要重新對位置。

```bash
npm run images                                           # 產生缺少的圖片（預設一次一張）
node scripts/generate-images.mjs --only hero,cta         # 只重做指定的圖
node scripts/generate-images.mjs --force                 # 全部重做
```
