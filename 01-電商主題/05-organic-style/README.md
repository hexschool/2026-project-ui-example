# 05｜親和無毒風：NestCraft 原創生活家居選物

> 淺色系＋冷色調（薄荷綠、鼠尾草灰、純白）。有機生鮮感，結帳步驟指引平滑清晰。

## 概念：NestCraft 晨光蔬果鋪

像一間採光很好的有機蔬果鋪：白牆、薄荷綠的籃子，每件家具附一張履歷卡，結帳像沿著一條綠色小徑一步步走完。

資訊裝在一格格圓角方塊裡，像攤位上的籃子；從購物車到付款結果，頁面上方一直有一條連續的綠色軌道，告訴你走到哪裡、下一步是什麼。

| Notion 風格列 | 內容 |
|---|---|
| 編號 | 05 |
| 風格 | 親和無毒風 |
| 色系搭配 | 淺色系＋冷色調（薄荷綠、鼠尾草灰、純白） |
| UI 視覺特點 | 有機生鮮感，結帳步驟指引平滑清晰 |

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（與 01、02、03 相同架構）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。
- **JS**：互動都交給 Bootstrap 的 `data-bs-*` 屬性（含結帳頁與 Guideline 的 Scrollspy），自己寫的只有 `js/main.js` 裡的五個小功能。

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

| 頁面 | 檔案 | 樣式 | 構圖重點 | 狀態 |
|---|---|---|---|---|
| 設計 Guideline | `guideline.html` | `scss/pages/_guideline.scss` | 左 3 欄黏性目錄卡（霧薄荷 24px 圓角、膠囊連結＋編號圓、Scrollspy 標示目前章節）＋右 9 欄十節 bento：概覽（規格與 10 頁清單）→ 色彩 → 字級階層 → 間距 → 圓角與陰影 → 元件狀態 → 平滑步驟指引 → 葉形標籤 → RWD 斷點 → Do／Don’t（8 組）；992px 以下目錄變成頁首下方的黏性橫捲膠囊列 | 完成 |
| 首頁 | `index.html` | `scss/pages/_home.scss` | bento Hero、膠囊分段＋大圖熱點＋迷你卡、霧薄荷大面板、見證泡泡、薄荷 CTA 面板 | 完成 |
| 商品一覽 | `products.html` | `scss/pages/_products.scss` | 頂部黏性膠囊篩選列（分類 chip＋只顯示有現貨＋寬度、價格兩個下拉＋排序；992px 以下篩選收進底部抽屜）＋ 2／3／4 欄圓角卡，第 11 格是薄荷「先量尺寸」方塊（沒有側欄） | 完成 |
| 商品詳情（以橡木餐桌示範） | `product.html` | `scss/pages/_product-detail.scss` | 左 bento 圖庫（沒有縮圖列，手機是橫捲列）＋家具履歷卡；右側標題卡＋購買卡黏住；膠囊分頁；推薦是霧薄荷引言方塊（lg 以上圖示圓靠上、標題與連結靠下）＋3 張商品卡 | 完成 |
| 購物車 | `cart.html` | `scss/pages/_cart.scss` | flow-track → 頂部黏性摘要列（手機只留應付總額＋前往結帳）＋免運進度軌 → 圓角品項卡（576px 以下數量鈕與「移除」上下排，小計和數量鈕對齊）→ 膠囊折扣碼＋繼續購物 | 完成 |
| 結帳 | `checkout.html` | `scss/pages/_checkout.scss` | 三欄：左子步驟軌（Scrollspy）＋中段落卡＋右黏性摘要；1200px 以下子步驟軌變成表單上方的黏性膠囊列 | 完成 |
| 付款結果 | `order-result.html` | `scss/pages/_order-result.scss` | 版心 760：頁首只放填滿的 flow-track → 32px 圓角結果卡（薄荷圓勾｜靠左標題，霧薄荷面板裡是 4 個白色資訊小方塊＋三項商品＋付款金額，兩顆等寬膠囊按鈕）→ 橫向「接下來會發生什麼」軌道時間軸（手機直向） | 完成 |
| 登入 | `login.html` | `scss/pages/_auth.scss` | 霧薄荷大面板上一張浮起的 32px 圓角大卡：左 5/12 照片方塊（卡內內縮 12px、24px 圓角）、右 7/12 表單；LINE、Google 白底膠囊並排；「還沒有帳號？」是霧薄荷小方塊；768px 以下照片隱藏 | 完成 |
| 註冊 | `register.html` | `scss/pages/_auth.scss` | 同登入大卡；會員好處是霧薄荷方塊＋白色圓形圖示；密碼規則是葉形提示（未達成鼠尾草字＋空心圓、達成成功色＋勾） | 完成 |
| 我的訂單 | `orders.html` | `scss/pages/_orders.scss` | 版心 960：頂部霧薄荷會員卡（森林薄荷圓頭像＋白色膠囊連結，沒有左側欄）→ 膠囊分段篩選（可實際切換，放不下時右端被切掉可橫捲）→ 圓角訂單卡，每張一條 4 節點迷你配送軌道，明細在卡內的霧薄荷面板展開 | 完成 |

頁面上沒有列出所有頁面的導覽：從首頁依購物流程點進各頁即可，Guideline 直接開 `guideline.html`。

商品詳情只做一頁靜態示範（橡木餐桌），所有商品卡都連到 `product.html`。已售完、低庫存、多尺寸模式（沙發床）等變化，放在各頁底部的「設計稿狀態示意」：products「篩選後沒有商品時」；product「已售完時／庫存少於 10 件時／有多種尺寸模式時」；cart「購物車是空的時」；checkout「必填驗證與付款處理中」；order-result「付款未完成時」；login「登入失敗時」；register「送出後有欄位需要修正時」；orders「篩選後沒有訂單時」。

我的訂單上方的狀態篩選（全部、待付款、已付款、出貨中、已完成、已取消）可以實際切換，點了只顯示該狀態的訂單。

**與 wireframe 的刻意差異**：首頁 Hero 不是「文字與圖片左右兩欄」，改成 bento 方塊拼貼；空間靈感不是 3 張卡片，改成膠囊分段＋大圖＋下方商品列；商品一覽沒有左側欄，篩選改成頂部黏性膠囊列、商品 4 欄；商品詳情沒有縮圖列，所有圖片同時攤開成 bento 圖庫；購物車的金額摘要在頂部黏性列，不在右側；結帳是三欄（多一條子步驟軌）；付款結果的結果卡靠左（圓形標記與標題左右排），不是置中；登入、註冊不是窄欄垂直置中的單張卡，改成霧薄荷面板上含照片方塊的大卡；我的訂單沒有左側會員欄，改成頂部會員卡。這些都是本風格的構圖，資訊架構（區塊、順序、文案、按鈕、狀態）與 wireframe 相同。

## 排版語言

給接手做其他頁面的人：下面是這套和其他 5 套拉開差距的地方，新頁面請照這些規則構圖，不要回到「左側欄＋3 欄」或「表單左＋摘要右」。

### 網格與節奏

- 12 欄，`$grid-gutter-width: 1.5rem`；版心 xl 1140、xxl 1240，左右內距 16px（`$container-padding-x: 2rem`）。
- 各頁窄版心（`_variables.scss` 已有變數）：結帳 1240（三欄）、購物車 1000、我的訂單 960、登入大卡 960、付款結果 760。
- **方塊拼貼（bento）＋靠左**：資訊放進圓角方塊，方塊之間固定 16px（手機）／24px（lg 以上），用 `.bento` 的 gap，不要每處各寫一個數字。標題一律靠左。
- 區塊上下 72px（手機）／96px（lg 以上），`.section`；連續兩個白底區塊時，第二個加 `pt-0`，避免中間空太多。
- 色彩比例：白約 60%、薄荷霧／薄荷約 30%、森林薄荷約 10%。不要每樣東西都塗薄荷。

### 頁首與頁尾

- **懸浮膠囊頁首**，沒有公告列：`header.site-header` 透明、sticky、`pointer-events: none`；裡面的白色膠囊（64px 高、全圓角、1px 框＋柔陰影）離頂 12px，總高 88px。
- lg 以上：logo（薄荷圓底的葉片屋頂小屋＋ Nunito 800）｜置中導覽（目前頁＝薄荷底膠囊＋森林薄荷字＋`aria-current`）｜霧薄荷膠囊搜尋框、會員圓鈕、購物車圓鈕（數量是森林薄荷小圓）。
- 992px 以下：膠囊只留 logo、搜尋鈕、購物車、選單鈕；導覽是同一份 `#siteMenu`（`offcanvas-lg offcanvas-bottom`）變成**底部抽屜**：上緣 32px 圓角、最上方搜尋框、導覽是大膠囊按鈕。按放大鏡也是開這個抽屜，焦點直接進搜尋框。
- **黏性元件的 top 一律是 88px**（`$sticky-top`）：商品一覽的篩選列、商品詳情的卡堆疊、購物車的摘要列、結帳的子步驟軌與摘要卡、Guideline 的目錄。錨點捲動用 `scroll-padding-top: 104px`（88＋16）。
- **頁尾**：霧薄荷底，上緣 40px 大圓角（像一張從下方升起的卡），4 欄（品牌＋購物指南／關於 NestCraft／客服中心），底部版權。

### 卡片與形狀

- **圓角只有 5 階**：輸入框 12px、小元件與縮圖 16px、卡片與圖片 24px、Hero 方塊與面板 32px、按鈕與 chip 全膠囊；另外 CTA 面板與頁尾上緣用 40px 大面板。全站沒有直角。巢狀時內層比外層小一階（例如 40px 面板內縮 16px，裡面的照片 24px）。
- 線：卡片 1px `$card-line`；表單 1px `$sage-dark`。不用雙線、不用 2px 以上的粗框。
- 陰影只給「浮起來」的東西：懸浮頁首、黏性摘要、熱點小卡、底部抽屜、選中的分段。一般卡片不加陰影。
- **商品卡 `.product-card`**：白底 24px 圓角、1px 框；圖片區內縮 8px、16px 圓角、霧薄荷底；左上葉形標籤；文字靠左：分類 chip → 品名（圓體 700 17px，最多 2 行）→ 尺寸 → 底列價格左（Nunito 800 20px）、膠囊按鈕右；卡片窄於 17rem 時（container query）價格與按鈕一律上下排，同一列不會有的換行、有的不換。hover 只換框色＋淡陰影，**不位移、不放大圖片**。
- **葉形標籤 `.leaf-tag`**：`border-radius: 14px 3px`，用在現貨、僅剩 N 件、已售完，以及訂單的 5 種狀態（狀態一定要附圖示，不能只靠顏色）。
- 紋理：無。只有 Hero 主方塊與 CTA 面板的角落各放 1 個淡白色有機圓形（`.blob`），其他地方不放。

### 標題階層與字體

- 標題、按鈕、步驟、標籤、價格：Nunito（西文與數字）＋昭源圓體 Chiron GoRound TC（中文），700。
- 內文、表單輸入、說明：Noto Sans TC 400／500（圓體當長段落會顯得稚氣）。
- Display（首頁 H1）48／32px（平板與 lg 40px）、H1 34／28、H2 30／24、H3 20／18；內文 16px 行高 1.8、輔助 14px。
- H2 靠左＋一句副標，標題前不加符號、不用英文眉標、不用全大寫、不用 emoji 當圖示；圖示統一 Bootstrap Icons 線條款。
- 區塊標題列 `.section-heading`：標題＋副標左、連結右（`btn-text`＋`bi-arrow-right`）。

### 招牌元素

1. **平滑步驟指引 `.flow-track`**：結帳三步是一條 8px 高、全膠囊的連續軌道，三個 32px 節點在 1/6、1/2、5/6，節點下方是文字。已完成＝森林薄荷實心＋白勾（可點回購物車）；目前＝白底＋3px 森林薄荷外圈＋數字＋粗體＋`aria-current="step"`；未到＝白底＋1px 深鼠尾草框（不放連結）。填色：購物車 `--to: .1667`、結帳 `.5`、付款結果 `1`；載入時從 `--from`（上一步的位置）長到 `--to`，700ms 只播一次。手機只顯示目前步驟的文字。
   同一套語言延伸到：購物車免運進度（`.track`）、我的訂單每張卡的 4 節點配送進度（`.flow-track-mini`；已取消用 `.track.is-cancel` 虛線）、付款結果的「接下來」時間軸（8px 軌道＋40px 圖示節點，`pages/_order-result.scss`）、結帳頁左側子步驟軌、首頁「無縫閃電結帳」方塊的小插圖。
2. **有機生鮮感**：白＋薄荷大色塊（Hero 主方塊、CTA 面板、頁尾）、植物多的明亮照片、葉形標籤；商品詳情的**家具履歷卡**（霧薄荷底 24px 圓角，標題「家具履歷」，每列 40px 白色圓形圖示 `.icon-circle.icon-circle-sm`＋項目＋值，值照 02 的規格表）。

### 各頁構圖原則

- **首頁**：Hero 是 bento（薄荷主方塊放 H1 與按鈕、照片方塊、「5 坪」白方塊、「48 小時」森林薄荷方塊），整個 Hero 在 1440×900 首屏內看得完；四大價值是白框與霧底交替的方塊；空間靈感是膠囊分段（40px 圓形縮圖＋空間名稱）＋大圖熱點＋下方迷你商品卡＋霧薄荷整套列；人氣嚴選在霧薄荷大面板裡；見證是照片方塊＋對話泡泡＋首字頭像，承諾是三個霧薄荷方塊；最後是薄荷 40px 圓角 CTA 面板。
- **列表與詳情**：篩選放在上方黏性膠囊列，不做左側欄（992px 以下篩選表單收進底部抽屜，列上只留分類 chip 與「篩選」鈕）；商品 4 欄；詳情的圖片全部攤開成 bento，右欄是兩張黏性圓角卡（標題卡、購買卡），家具履歷卡放在圖庫下方；已在 900 高的視窗確認 992／1200／1440 寬時購買按鈕一直看得到。
- **結帳流程**：每頁頂部都是 `.flow-track`；購物車的摘要在**上方**黏住（不在右側），結帳是「左導引軌＋中表單＋右摘要」三欄，付款結果是圓角結果卡＋橫向時間軸。
- **會員頁**：登入、註冊是霧薄荷底上一張浮起的圓角大卡；我的訂單是頂部會員卡（不是左側欄）＋膠囊分段篩選。
- **狀態示意**：每頁底部的 `.demo-state`（虛線 32px 圓角框＋葉形虛線標籤「設計稿狀態示意」），示範畫面放在 `.demo-state-stage`。
- **Guideline**：和其他頁同一套語言，左側霧薄荷目錄卡、右側每節是靠左標題＋一格格方塊。示範一律用頁面真的在用的類別（按鈕、選項卡、分段、商品卡、軌道、葉形標籤、履歷卡、狀態示意…），滑過與焦點用 `.gl-is-hover`、`.gl-is-focus` 強制呈現（讀元件真正的 hover／focus 數值，加 `tabindex="-1"`）；分頁與訂單狀態篩選兩組示範可以實際操作。

## 檔案結構

```
05-organic-style/
├─ *.html                    ← 10 個頁面，每頁完整包含頁首（含底部抽屜）與頁尾
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製（開頭註解寫目前頁規則）
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 全站共用的五個小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 商品照、空間情境圖（AI 生成）、favicon.svg（手繪向量）
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫
│  ├─ _base.scss             ← 字體分工、標題階層、區塊節奏、按鈕、表單、焦點、共用小工具
│  ├─ components/            ← 頁首、頁尾、方塊、標籤與分段、商品卡、步驟軌道（含迷你配送軌道）、選項卡／金額列／提示框／空狀態／狀態示意、家具履歷卡、訂單摘要卡
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾是否與範本一致
   └─ generate-images.mjs    ← 生圖腳本（所有圖片的 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾每頁一份**：要改頁首或頁尾時，先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check`。每頁只有一處不同：頁首導覽的目前頁（`class="nav-link active"` 與 `aria-current="page"`；商品詳情標「商品一覽」但不加 `aria-current`；購物車、結帳、付款結果、登入、註冊、Guideline 不標示）。
- **導覽連結的 class 只寫 `nav-link`**：`check-layout.mjs` 只認完整字串 `class="nav-link active"`，不要在連結上加別的 class，樣式從父層 `.site-nav` 選。頁首區塊是從 `<a class="skip-link"` 到第一個 `</header>`。
- **新增頁面**：複製範本，改 `<title>`、description 與目前頁標示；在 `scss/pages/` 的 partial 寫樣式（`main.scss` 已經 import 全部 9 個 partial），執行 `npm run check`。
- **假資料直接寫在 HTML**：商品、購物車與訂單的數字寫死在頁面裡，和 01～03 同一組資料：購物車 3 項 4 件（橡木餐桌 ×1、NestBox 自由拼裝收納方塊 (三入組) ×2、SlimFit 夾縫多功能推車 ×1），小計與應付總額 NT$ 20,250、運費免運（滿 NT$ 3,000）；付款結果 NC-20260923-001；低庫存門檻 10 件（亞麻雙人沙發 5、弧形落地燈 9、羊毛休閒單椅 4、日暮亞麻沙發床 7），藤編收納櫃售完。
- **JS**：`js/main.js` 只做五件事：992px 以下按放大鏡開底部抽屜時把焦點放進搜尋框（`data-focus-search`）、`data-toggle-password` 顯示／隱藏密碼、分段切換用方向鍵切換時把目前項目捲進畫面、狀態篩選（我的訂單與 Guideline 的示範；`data-filter-list`＋`data-filter` 按鈕對應每個項目的 `data-status`；點到被切掉一半的按鈕時，外層 `.seg-scroll` 會把它捲進畫面）、Scrollspy 的目錄（結帳頁 `#coRail` 與 Guideline `#glToc`：換段時把橫向膠囊列的目前項目捲進畫面；往回捲時沒有任何段落被標示就補標）。其他互動（選單、分頁、下拉、底部抽屜、篩選抽屜、貨到通知的展開、Scrollspy）都靠 Bootstrap 的 `data-bs-*` 屬性；結帳的信用卡欄位與付款說明用 CSS `:has()` 依選中的付款方式切換，不需要 JS。
- **換行與空白**：品名的詞組斷點用 `<wbr>` 標出，搭配 `.text-phrase`；「日暮亞麻｜雙人沙發床」的斷點放在「｜」前面，「｜雙人沙發床」包在 `.text-nowrap` 裡，換行時直線跟著下一行，不會掛在行尾。數字與單位之間用 `&nbsp;`。商品卡的 W × D × H 寫成 `W40&nbsp;× D120&nbsp;× H180&nbsp;cm`（「×」前面不換行、後面可以換），手機 2 欄的卡片放不下一行時從「×」後面換行；有前綴（單入、沙發模式、單片底板）時，W × D × H 整組包在 `.d-inline-block` 裡，前綴自己一行。
- **表單**：設計稿沒有後端，用 `<form action="下一頁">` GET 送出，所以密碼、Email、卡號這類個資欄位**不加 `name`**（互斥的 radio 可以有 name）。欄位要有 `id`＋`<label for>`＋`autocomplete`。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、字體、間距、圓角、陰影、元件）
3. `bootstrap/scss/bootstrap`
4. `bootstrap-icons`（字型路徑指向 `css/fonts/`）
5. `_base.scss`
6. `components/*`：`_header`、`_footer`、`_tile`、`_tags`、`_product-card`、`_flow-track`、`_states`、`_trace-card`、`_order-summary`
7. `pages/*`：各頁專屬樣式，class 一律加頁面前綴（`home-`、`products-`、`pd-`、`cart-`、`co-`、`result-`、`auth-`、`orders-`、`gl-`）

原則是**先用 Bootstrap 的變數與工具類別和下表的共用類別**，真的做不到才寫自訂 CSS，而且只引用變數，不寫死色碼。

### 共用類別

下面這些類別跨頁共用，新頁面直接套用，不要在 `pages/*` 另寫一份。markup 範例寫在各檔案開頭的註解。

| 類別 | 用途 | 位置 |
|---|---|---|
| `.site-header`、`.site-header-pill`、`.site-brand`（`-mark`、`-name`）、`.site-nav`、`.site-search`、`.site-search-desktop`、`.site-actions`、`.site-icon-btn`、`.site-cart-count`、`.site-menu` | 懸浮膠囊頁首：透明 sticky 外層＋白色膠囊；logo、置中導覽、搜尋框、圓形圖示鈕、購物車數量小圓；`.site-menu` 是 992px 以下的底部抽屜（同一份 `#siteMenu`） | `components/_header.scss` |
| `.site-footer`（`-lead`、`-title`、`-links`、`-copy`） | 頁尾：霧薄荷底、上緣 40px 大圓角、4 欄＋版權列 | `components/_footer.scss` |
| `.skip-link` | 「跳至主要內容」，Tab 第一下才出現 | `_base.scss` |
| `.page-header`、`.page-lead` | 首頁以外各頁的頁首：麵包屑（購物車、結帳、付款結果改放 `.flow-track`）→ h1 → 一句說明，靠左 | `_base.scss` |
| `.section`、`.section-mist`、`.section-heading` | 區塊上下 72／96px；霧薄荷大面板（40px 圓角）；區塊標題列（標題＋副標左、連結右） | `_base.scss` |
| `.display-1`、`.text-round`、`.num`、`.price`、`.text-note` | 首頁 H1 字級；圓體；Nunito 等寬數字；價格（800、不換行）；14px 次要說明 | `_base.scss` |
| `.btn-primary`、`.btn-outline-primary`、`.btn-mint`、`.btn-white`、`.btn-text`、`.btn-icon` | 主要（森林薄荷）、次要（白底森林框）、薄荷底低強調、面板上的白按鈕、文字連結（44px 高）、44px 圓形圖示鈕（目前頁面沒有用到，留給新頁面）。全部膠囊；停用一律是停用底＋鼠尾草字 | `_base.scss` |
| `.qty` | 數量步進器：膠囊外框＋ 44px 圓鍵 | `_base.scss` |
| `.form-label-optional` | 欄位標籤後的「（選填）」小字（購物車折扣碼、結帳備註） | `_base.scss` |
| `.on-forest` | 放在森林薄荷實心方塊上，讓裡面的焦點環改成白色 | `_base.scss` |
| `.text-phrase`、`.img-cover`、`.bleed-x`（mixin `bleed-x`）、`.scroll-row` | 詞組換行；圖片裁切填滿；手機貼齊螢幕兩側；手機橫向捲動列（scroll-snap，項目寬度用 `--scroll-item`） | `_base.scss` |
| mixin `bottom-sheet` | 992px 以下的 `offcanvas-bottom` 底部抽屜外觀（上緣 32px 圓角、高度依內容、上方把手）：頁首選單與商品一覽的篩選抽屜共用 | `_base.scss` |
| `.tile`＋`.tile-mist`／`.tile-mint`／`.tile-forest`／`.tile-lg`／`.tile-media` | 方塊：白底框線、霧薄荷、薄荷、森林薄荷白字、32px 圓角、放圖片 | `components/_tile.scss` |
| `.bento` | 方塊拼貼：grid＋固定間距 16／24px，欄列由頁面的 `grid-template` 決定 | `components/_tile.scss` |
| `.icon-circle`、`.icon-circle-sm` | 56px 薄荷圓底圖示；40px 白色圓（家具履歷卡、霧底上的小圖示） | `components/_tile.scss` |
| `.blob`＋`.blob-tr`／`.blob-bl`、`.has-blob` | 有機圓形裝飾（只放 Hero 主方塊與 CTA 面板） | `components/_tile.scss` |
| `.chip`、`.chip-filter`、`.chip-count` | 分類小膠囊；可點的篩選 chip（選中＝薄荷底＋`aria-current`）；chip 裡的數量小圓 | `components/_tags.scss` |
| `.leaf-tag`＋`.is-stock`／`.is-low`／`.is-soldout` | 葉形標籤：現貨、僅剩 N 件、已售完 | `components/_tags.scss` |
| `.leaf-tag`＋`.is-pending`／`.is-paid`／`.is-shipping`／`.is-done`／`.is-cancel` | 5 種訂單狀態（圖示寫在 HTML：`bi-clock`、`bi-check-circle`、`bi-truck`、`bi-check2-all`、`bi-x-circle`） | `components/_tags.scss` |
| `.leaf-tag`＋`.is-hint`／`.is-met` | 註冊的密碼規則提示：未達成、達成 | `components/_tags.scss` |
| `.size-pills`、`.size-pill`、`.size-pill-key`、`.size-pills-mode` | 尺寸膠囊（寬、深、高各一顆，只是資訊）；多種尺寸模式時每組前面的小標。放在 `.tile-mist` 裡自動改白底 | `components/_tags.scss` |
| `.seg`、`.seg-item`、`.seg-solid` | 膠囊分段切換（霧薄荷軌道、選中是浮起的白膠囊）；`.seg-solid` 選中改森林薄荷底白字（我的訂單篩選） | `components/_tags.scss` |
| `.seg-scroll` | 分段放不下時的橫捲外框：膠囊本身完整，右端被版心或螢幕邊緣切掉，看得出還能往右捲（576px 以下貼齊螢幕兩側）；`js/main.js` 會優先捲動這一層 | `components/_tags.scss` |
| `.product-card`（`-media`、`-tag`、`-body`、`-category`、`-title`、`-size`、`-foot`） | 商品卡 | `components/_product-card.scss` |
| `.flow-track`、`.flow-step`（`.is-done`／`.is-current`）、`.flow-link`、`.flow-node`、`.flow-label` | 結帳三步的連續軌道；`style="--from: …; --to: …"` 控制填色 | `components/_flow-track.scss` |
| `.track`、`.track.is-cancel` | 進度軌道（免運、配送、時間軸）；已取消是虛線 | `components/_flow-track.scss` |
| `.flow-track-mini`、`.flow-date` | 迷你配送軌道（我的訂單每張卡）：同 `.flow-track` 的標記，4 個 24px 節點（待付款→已付款→出貨中→已完成），`--to` 填到目前狀態的節點（.125／.375／.625，已完成 1），不播長出動畫；已完成的訂單在最後一個 `.is-done` 節點加 `aria-current="step"`，手機仍顯示它的文字；`.flow-date` 是節點文字下的日期 | `components/_flow-track.scss` |
| `.step-rail-list`、`.step-rail-link`（`.active`）、`.step-rail-node`、`.step-rail-label`、`.step-rail-foot`；`.step-rail-pill`（mixin `step-rail-pill`） | 子步驟軌：直向 24px 節點＋2px 直線（Scrollspy 的目前段落＝實心節點＋粗體）；橫向版本是白色膠囊列、可橫捲、目前段落薄荷底 | `components/_flow-track.scss` |
| `.option-card`（`-body`、`-title`、`-note`、`-meta`、`.is-disabled`） | 結帳的配送、付款選項卡（選中＝薄荷底＋2px 森林薄荷框） | `components/_states.scss` |
| `.sum-rows`、`.sum-row`、`.sum-total` | 金額列（`<dl>`），總計 Nunito 800 28px | `components/_states.scss` |
| `.alert`（`.alert-danger`、`.alert-warning`、`.alert-title`） | 提示框：Bootstrap `.alert` 改成 16px 圓角、不加框、淡底＋墨綠字，圖示與 `.alert-title` 用狀態色（錯誤小標對底 5.75、警示小標 6.10）；結帳必填提示、登入失敗、付款未完成共用 | `components/_states.scss` |
| `.empty-state`、`.empty-state-art` | 空狀態：霧薄荷方塊、置中，96px 圓形插圖區＋一句話＋一個動作 | `components/_states.scss` |
| `.demo-state`（`-tag`、`-title`、`-note`、`-stage`） | 每頁底部的「設計稿狀態示意」 | `components/_states.scss` |
| `.trace-card`（`-head`、`-title`）、`.trace-list`、`.trace-row` | 家具履歷卡：霧薄荷 24px 圓角，每列 40px 白色圓形圖示＋項目（小字）＋值，md 以上兩欄 | `components/_trace-card.scss` |
| `.sum-card`（`.is-floating`）、`.sum-card-title`、`.sum-items`、`.sum-item`（`-thumb`、`-body`、`-name`、`-meta`） | 訂單摘要卡：霧薄荷 24px 圓角；品項是 56px 圓角縮圖＋品名＋數量與金額，下面接 `.sum-rows`；黏住時加 `.is-floating` 柔陰影 | `components/_order-summary.scss` |

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 色彩 | 純白 `$white #FFFFFF`（頁面底、卡片、輸入框）、薄荷霧 `$mist #EEF7F2`（交替區塊、摘要卡、圖片底）、薄荷綠 `$mint #CBEBDB`（Hero 主方塊、CTA 面板、選中底；不作文字）、薄荷亮 `$mint-bright #3FA37A`（只當裝飾：熱點外圈、卡片 hover 框；不作文字、不作進度填色）、森林薄荷 `$forest #1D6A50`（`$primary`：主要按鈕、連結、進度填色、焦點環）、深森林 `$forest-deep #15543F`（按鈕 hover、薄荷底上的強調字）、墨綠 `$ink #1C2B25`（主文字）、鼠尾草灰 `$sage #B9C6BE`（裝飾線）、深鼠尾草 `$sage-dark #7F9188`（表單框、未到節點）、鼠尾草字 `$sage-text #56655D`（次要文字）、placeholder `#64736B`、軌道底 `$track #DCEFE4`、卡片框 `$card-line #E1ECE6` |
| 狀態色 | 成功 `#1E7A4C`、警示字 `#7A5300`／警示底 `#FFF1CC`（低庫存）、錯誤 `#B42318`、資訊 `#2563A8`、停用底 `#EEF2EF`＋鼠尾草字 |
| 對比（實算） | 墨綠對白 14.77；森林薄荷上的白字 6.50、森林薄荷對霧 5.95、對薄荷 5.09、對軌道底 5.42；鼠尾草字對白 6.15、對霧 5.63、對薄荷 4.82；placeholder 對白 4.99；深鼠尾草（表單框）對白 3.33；警示 6.10；停用 5.44 |
| 字體 | Nunito 600／700／800＋昭源圓體 Chiron GoRound TC 500／700（標題、按鈕、步驟、標籤、價格）；Noto Sans TC 400／500／700（內文、表單） |
| 字級 | Display 48／32、H1 34／28、H2 30／24、H3 20／18、內文 16（行高 1.8）、輔助 14；價格卡片 20、詳情 32、總計 28（Nunito 800） |
| 間距 | spacer 7 階（`py-6` 72px、`py-7` 96px）；方塊間距 `$tile-gap` 16px／`$tile-gap-lg` 24px |
| 圓角 | `$radius-input` 12、`$radius-sm` 16、`$radius-card` 24、`$radius-panel` 32、`$radius-pill` 全膠囊；`$radius-sheet` 40（CTA 面板、頁尾上緣） |
| 陰影 | `$shadow-float: 0 8px 28px rgba(28,43,37,.10)`，只給懸浮頁首、黏性摘要、熱點小卡、底部抽屜 |
| 焦點 | 3px 森林薄荷外圈、2px 偏移；按鈕是白色間隙＋森林薄荷外圈；在森林薄荷方塊上（`.on-forest`）改白色 |
| 頁首 | `$site-header-height: 88px`（膠囊 64＋上下 12）、`$sticky-top: 88px`、`$scroll-offset: 104px` |
| 動態 | 軌道填色 700ms 只播一次；熱點光暈擴散 3 次後停；卡片與按鈕只有顏色、框色、陰影的 150～200ms 轉場；`prefers-reduced-motion: reduce` 全部關掉（軌道直接顯示最終長度） |

完整規範請看 `guideline.html`。

### 換色時同步檢查

色票的唯一來源是 `_variables.scss`，但下面幾處把數值寫成文字或寫死，改色（或改頁首高度）時要一起檢查（共通的部分也列在上一層 [`../README.md`](../README.md) 的「換色時同步檢查」）：

- [ ] `scss/_variables.scss`：色票、`$theme-colors` 與語意變數（`$body-*`、`$link-*`、`$input-*`、`$focus-ring-color`、`$form-check-*`、`$form-switch-*`、`$form-feedback-*`、`$progress-*`）。
- [ ] `guideline.html`：「色彩」的面積比例條、18 個色票的 hex／用途／對比、Bootstrap 變數對應表；其他章節寫到的色碼與對比（表單欄位的提示字 `#64736B`、開關關閉 3.33、軌道節點 6.50／3.33、葉形標籤的 4 組對比、Do／Don’t 的 `#CBEBDB`、`#3FA37A` 與 3.12、1.28、2.60、5.42、11.57、6.93）。新增或刪除色票時，同步 `scss/pages/_guideline.scss` 的 `$gl-swatches`。
- [ ] 本檔的「Design token 摘要」：色彩、狀態色、對比、焦點。
- [ ] SCSS 註解裡寫到的色碼與對比：`components/_states.scss` 提示框的 `#B42318`、`#7A5300`（5.7／6.10）。
- [ ] 改了頁首高度（`$site-header-pill-height` 64px、`$site-header-height` 88px，連帶 `$sticky-top` 與 `$scroll-offset` 104px）時：`checkout.html` 與 `guideline.html` 的 `data-bs-root-margin="-170px 0px -50%"`、`js/main.js` 的 `line = 170`、`_checkout.scss` 與 `_guideline.scss` 的 `scroll-margin-top: 4.5rem`，以及 Guideline「間距」的頁首尺規（12／64／12）與黏性位移文字、本檔「頁首與頁尾」。
- [ ] `scripts/generate-images.mjs` 的 `STYLE`、`ROOM`、`PRODUCT`（寫死極淡薄荷地面 `#EAF6EF`）、`CANDID`：換色後重新生圖，首頁空間靈感熱點的 `--x`／`--y` 要重新對位置。
- [ ] `templates/page.html` 與 10 頁的 `theme-color`（`#FFFFFF`），改完跑 `npm run check`。
- [ ] `images/favicon.svg` 裡的色碼（`#CBEBDB`、`#1D6A50`），和頁首 logo 的 `.mark-bg`／`.mark-ink` 一致。

## 和方向說明不同的地方

做的過程中調整了幾處，資訊架構不受影響：

- **手機左右內距**：方向說明寫 `$container-padding-x: 1.5rem`（左右各 12px），改成全斷點 `2rem`（左右各 16px）。圓角卡片貼得太近螢幕邊緣時顯得擠。
- **圓角收斂到 5 階**：方向說明在首頁大圖與 CTA 照片寫 28px、熱點小卡與購物車品項卡寫 20px，這些都改成 24px（卡片與圖片那一階），讓「圓角只有 5 階」能成立。
- **Hero 的兩個小方塊等寬**：方向說明是「5 坪」佔 2 欄、「48 小時」佔 3 欄；「（約 16.5 m²）的明亮小套房」比較長，改成右側兩格等寬。lg（992～1199）主方塊改成 6 欄、主標 40px，避免主標擠成三行。
- **空間靈感大圖在 lg 以上裁成 2:1**：方向說明是 3:2；3:2 在 1240 版心會高達 800px，一個畫面看不完。手機與平板維持完整 3:2。熱點座標寫的是完整照片的百分比，CSS 會自動換算（見 `pages/_home.scss` 的 `.home-spot`）。
- **手機搜尋**：方向說明同時提到「搜尋鈕」與「抽屜最上方的搜尋框」，這裡把兩者合併：放大鏡打開同一個底部抽屜，焦點直接進搜尋框，不另做一條搜尋列。
- **錨點捲動位移**：`scroll-padding-top` 用 104px（頁首 88＋16），標題不會貼在膠囊下緣；sticky 元件的 top 仍是 88px。
- **頁首層級**：底部抽屜寫在頁首裡，所以頁首的 z-index 用 offcanvas 的 1045（高於遮罩 1040），抽屜才不會被遮罩蓋住。商品一覽的篩選抽屜寫在黏性篩選列裡，同樣在抽屜打開時把篩選列提到 1045（`:has(.offcanvas-lg.show)`）。
- **商品一覽的篩選**：方向說明只寫「頂部黏性膠囊列」。分類 chip 之外的篩選（只顯示有現貨、寬度、價格區間、排序）在 992px 以下收進底部抽屜，列上只留可橫捲的分類 chip 與「篩選」鈕，抽屜底部是「清除」與「顯示 10 件商品」。價格區間和同主題其他風格一樣是 5 個單選（不限、NT$ 3,000 以下、3,000–10,000、10,000–20,000、20,000 以上，預設不限）；lg 以上它和寬度一樣是膠囊下拉，抽屜裡直接攤開。992～1439px 版心不夠寬，篩選列會排成兩列（上分類、下篩選），1440 以上是一列；為了讓 1440 排得進一列，lg 以上的分類 chip 之間不留縫、左右內距收成 10px。
- **家具履歷卡的位置**：方向說明是右欄第三張黏性卡。標題卡＋購買卡＋履歷卡疊起來超過 900 高的視窗，購買按鈕會被推出畫面，所以右欄只黏標題卡與購買卡，履歷卡放到左欄圖庫下方（lg 以上的格線是「圖庫｜右欄」「履歷｜右欄」）。
- **付款結果的「接下來」時間軸不做填色動畫**：方向說明寫它和免運進度條同樣「從上一步長到這一步」。這三步都還沒發生，填色只會停在第一個節點、幾乎看不到，所以只保留軌道底色與節點：第一步（備貨與出貨）是目前進度（白底＋3px 森林薄荷外圈＋`aria-current="step"`），後兩步白底細框。結果卡內的兩顆按鈕照 SPEC 放在卡片最下方，時間軸在卡片下方。
- **登入、註冊的小標**：SPEC 提到 wireframe 在卡片上方有「會員登入」「會員註冊」小標，這裡做成 H1 上方的分類 chip。照片方塊左上角放 02 的品牌語「家不必大，剛好就好。」（白色小卡，不靠照片當底）。
- **註冊欄位與密碼規則**：方向說明列的是姓名、Email、密碼、確認密碼與兩個葉形提示；為了和同主題其他風格一致，多了「手機」欄，密碼規則照 02 的「至少 8 碼，需包含英文與數字」拆成「至少 8 碼」「包含英文與數字」兩片放在密碼欄下，「兩次輸入一致」放在確認密碼欄下。正式表單全部是未達成（欄位是空的），達成的樣子放在狀態示意。
- **登入、註冊的狀態示意**：lg 以上左 5/12 是標籤、標題與說明，右 7/12 是示範畫面，和上方大卡的「照片｜表單」對齊。
- **我的訂單**：已取消的訂單不畫 4 個節點，改成「已取消」字樣＋鼠尾草虛線軌道（`.track.is-cancel`）。會員卡右側的「個人資料」「收件地址」是導覽、「登出」是動作，分成兩組。手機的狀態篩選包在 `.seg-scroll` 裡，右端被螢幕邊緣切掉，看得出還能往右捲。
- **提示框（`.alert`）統一外觀**：付款未完成的說明框要用警示底 `#FFF1CC`，Bootstrap 預設的警示淡底是混濁的米色，所以在 `components/_states.scss` 把 `.alert-danger`、`.alert-warning` 改成本風格的淡底＋墨綠字。結帳頁「必填欄位沒有填好」的示意也跟著換成同一個外觀（標記沒有改）。
- **Guideline 的章節順序與目錄**：SPEC 規定的六節（色彩、字級階層、間距、圓角陰影、元件狀態、RWD 斷點與 Do／Don’t）照順序排，本風格多的「平滑步驟指引」「葉形標籤」插在元件狀態之後、RWD 之前；最前面加一節概覽（Notion 風格列、設計原則、10 頁清單）。目錄用同一份標記：lg 以上是左側黏性卡，992px 以下是頁首下方的黏性橫捲膠囊列（不是另做一份下拉選單），所以 Scrollspy 只有一個目標。章節比畫面高很多，Bootstrap Scrollspy 預設的門檻 0.1 永遠達不到，`<body>` 另加 `data-bs-threshold="0,1"`。
- **開關的文字間距**：開關改成 2.5em 寬後，Bootstrap 預設的 `$form-switch-padding-start`（2.5em）讓文字貼著開關，`_variables.scss` 改成 3.125em。商品一覽的開關用 flex＋gap 排，不受影響。
- **結帳的子步驟軌**：方向說明寫 992～1199 是中欄上方的橫向列；實作上 1200px 以下（含手機）都是表單上方的黏性膠囊列，只在表單範圍內黏住，捲到摘要卡就放開。錨點跳轉時段落卡標題會再往下讓 72px，不會被膠囊列蓋住；Scrollspy 的判定範圍是視窗頂下 170px 到一半高（`data-bs-root-margin="-170px 0px -50%"`），讓上一段的底邊落在範圍外，點子步驟軌後標示的一定是點到的那段。

## 圖片

`images/` 的圖片皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意。檔名與 01～03 相同（hero、room-a～c、p-1001～p-1010、detail-oak-dining／grain／leg、ugc-1、ugc-2、auth、cta），替換時保持相同檔名即可。`favicon.svg` 是手繪向量，和頁首 logo 同一個圖形。

整組圖的調性（腳本裡的 `STYLE`）：純白與極淡薄荷的牆、鼠尾草灰的棉麻、淺樺木與白橡木、很多新鮮綠植與香草盆栽、約 5500K 的冷調晨光、柔和的陰影，像陽光下的有機蔬果鋪。商品照是純白背景漸變到極淡薄荷地面。

- 空間圖的家具和熱點對應：room-a 是攤開成床的沙發床＋床頭櫃；room-b 是收納方塊牆＋當書桌的橡木桌＋沙發床；room-c 是橡木餐桌、藤編收納櫃、雙人沙發、弧形落地燈。換圖後要對照新照片重新量熱點的 `--x`／`--y`。
- 商品詳情圖庫（橡木餐桌）是 p-1001＋detail-oak-grain＋detail-oak-leg＋detail-oak-dining，四張是同一張桌子。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`（原始 PNG 暫存在系統暫存目錄的 `nestcraft-organic-raw-images/`）：

```bash
npm run images                                     # 產生缺少的圖片
node scripts/generate-images.mjs --only hero,cta   # 只重做指定的圖
node scripts/generate-images.mjs --force           # 全部重做
CONC=1 node scripts/generate-images.mjs            # 並行數（預設 1）
```
