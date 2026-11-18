# 01｜未來硬體實驗室：島造 ISLANDMAKE 在地製造提案平台

> 深色系＋冷色漸層（深鈦灰、冷藍漸層、青空色）。資金儀表板宛如航太數據監控台，募資進度條具發光充能感，科技感爆棚。

概念是「深夜航太控制室裡的一面遙測監控牆」：每個提案是一次發射任務，贊助者在控制室裡盯著它的燃料（資金）一格格充滿。深鈦灰是控制台的機殼，冷藍到青空的漸層是充能中的能量，數字一律用切角的 Chakra Petch 讀數字體。

科技感只花在「數字與進度」：**任務主控台**（HUD 角括號＋讀數格）、**發光充能條**（超額之後變成更亮的電池格）、**達成率弧形儀表**、**六角節點的發射序列**。專案故事、FAQ、表單、條款維持安靜好讀。不做霓虹字、文字發光、滿版掃描線、故障字效、英文大寫眉標、全息投影插圖。

和同主題其他 5 套刻意分開的地方：全站唯一**固定深色**、唯一**左側直立控制欄**頁首（不是頂部橫條）、首頁是唯一**置中構圖＋寬幅主控台**、專案細節與結帳是**鏡像版面**（主控台與摘要在左）、生產排程在桌機是**橫向發射序列**。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（架構同 `../03-bold-style/`）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。只有一套深色主題：`<html data-bs-theme="dark">`（固定深色，不是 `auto`），Bootstrap 的淺色與 `*-dark` 變數都設成同一組深色值，所以作業系統是淺色或深色模式，畫面都一樣。
- **JS**：互動都交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的六個小功能。圖表、儀表、序列都是 inline SVG 與 HTML／CSS，沒有圖表套件。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西（字體從 Google Fonts 載入，離線時會退回系統字體）。

**要修改樣式**：

```bash
npm install        # 安裝 bootstrap、bootstrap-icons、sass，並把 Bootstrap JS 與圖示字型複製進專案
npm run watch      # 開發時：監看 scss/，存檔就重新編譯 css/style.css
npm run css        # 編譯一次
npm run build      # 交付前：重新複製 vendor 檔案＋編譯一次 CSS
npm run check      # 檢查各頁的 head、頁首、頁尾是否與範本一致，以及頁首的目前頁標示
npm run vendor     # 只重新複製 Bootstrap JS 與圖示字型（npm install 時會自動執行）
npm run images     # 重新生成圖片（需要已登入的 codex CLI，換圖時才用）
```

## 頁面

| 頁面 | 檔案 | 狀態 | 樣式 | 頁面底部的「設計稿狀態示意」 |
|---|---|---|---|---|
| 首頁 | `index.html` | 完成 | `scss/pages/_home.scss` | 無 |
| 設計 Guideline | `guideline.html` | 完成 | `scss/pages/_guideline.scss` | （本身就是元件與狀態總覽：00 概覽＋9 章；18 則狀態文案全部列在第 07 章，S18 只出現在這裡） |
| 專案列表 | `projects.html` | 完成 | `scss/pages/_projects.scss` | S6 篩選無結果 |
| 專案細節與贊助方案選擇（以「一只走十年的台南帆布包」示範） | `project.html` | 完成 | `scss/pages/_project.scss` | 募資尚未開始（S3）、已結束成功（S4）、已結束失敗（S5）、未登入點擊贊助（S1）、付款失敗（S10）、未選擇方案、里程碑逾期（S16）、留言區為空（S9）；生產排程區內另有 Notion 的「延遲狀態範例」 |
| 個人頁面「我的島造」 | `account.html` | 完成 | `scss/pages/_account.scss` | 5 種贊助狀態徽章、贊助紀錄為空（S7）、追蹤清單為空（S8）、提案募資失敗、已下架（S14）、提案者尚無專案（S15） |
| 登入 | `login.html` | 完成 | `scss/pages/_auth.scss` | 帳號或密碼錯誤 |
| 註冊 | `register.html` | 完成 | `scss/pages/_auth.scss` | 欄位有錯誤時（顯示名稱未填、Email 已註冊、密碼太短、未勾同意條款） |
| 贊助結帳 | `checkout.html` | 完成 | `scss/pages/_checkout.scss` | 欄位有錯誤時（錯誤摘要＋3 個信用卡欄位）；付款失敗（S10）在專案細節 |
| 贊助成功 | `order-result.html` | 完成 | `scss/pages/_order-result.scss` | 無 |
| 贊助紀錄詳情（以帆布包這筆募資中的贊助示範） | `backing.html` | 完成 | `scss/pages/_backing.scss` | 已達標待生產、生產中、已出貨、募資失敗 ‧ 已退款（S5）在這頁的差異；取消贊助確認對話框的靜態樣子 |

頁面上沒有列出所有頁面的導覽：從首頁依流程點進各頁即可，Guideline 直接開 `guideline.html`。首頁所有專案卡都連到 `project.html`（專案細節只做一頁）。

## 排版語言

這一節是做其他 9 頁時的依據。構圖決定權在本套，內容（區塊、欄位、文案、狀態）照主題的 `../_wireframe/WIREFRAME_SPEC.md` 與 `../CONTENT.md`。

### 網格與版心

- 12 欄、gutter 24px。容器在「控制欄右邊的區域」裡置中，最大寬度已扣掉控制欄的 88px：`sm 540／md 720／lg 880／xl 1080／xxl 1280`。左右留白 16（手機）／24（≥ 768）／32px（≥ 992）。
- ≥ 992 的 `body` 有 `padding-left: 88px`。之後要做的 `position: fixed` 元件（手機底部行動列、≥ 992 才出現的浮層）要記得從 `left: $rail-width` 開始，Modal 與 Offcanvas 則照 Bootstrap 預設滿版即可。
- 1920 寬：網格紋理、光暈、交替區塊底色可以滿版（從控制欄右緣到視窗右緣），內容一律在容器內置中，不要偏左。
- **992–1199 是最擠的寬度**（可用區只有 816–1016px）。首頁實測的教訓：
  - XL 讀數（目前募得 `NT$ 1,235,600`，3rem）需要約 400px 寬，放不下時讓它獨佔一列，或在 `lg` 區間縮一級。
  - 3 欄專案卡在 992 寬時「目前金額」會被切掉，所以便當格到 ≥ 1200 才變 3 欄。
  - 主控台的按鈕欄用 `auto` 寬度，避免按鈕被擠出面板。
  - 專案細節 5：7、回饋 4：8、結帳 5：7、詳情 4：8 都要在 992 寬看過，讀數格要能換行或改單欄。
- **間距尺度和 Bootstrap 預設不同**（`$spacers` 已改）：`1`=4、`2`=8、`3`=12、`4`=16、`5`=24、`6`=32、`7`=48、`8`=64、`9`=88px。也就是 `g-4` 是 16px、`g-5` 是 24px、`mt-6` 是 32px、`py-7` 是 48px。
- 區塊上下留白 56px（手機）／88px（≥ 992）；面板內距 20／24px。

### 頁首：左側直立控制欄（`components/_header.scss`）

- **≥ 992**：固定在左緣、全高、寬 88px，`$ti-900` 底＋右側 1px 線。上：Logo 標誌（切角方塊裡一座島＋一道軌道弧線）＋「島造」＋ ISLANDMAKE 副字標；中：主導覽 3 項（圖示在上、13px 文字在下）＋「搜尋」；下：「我要提案」（`index.html#propose`）、頭像。目前頁＝左緣 3px 青空條（不發光）＋圖示與文字變 `$sky-300`。
- **< 992**：頂部 60px 橫列（sticky）：Logo 左；搜尋、頭像、選單在右；選單展開成全寬深色面板（導覽＋全寬「我要提案」）。
- **搜尋**：`#siteSearchMobile` 是一個 Collapse，手機在橫列下方展開；≥ 992 浮在控制欄右側上方（寬 560px，不推擠版面），由控制欄的「搜尋」鈕切換。展開後 `main.js` 會自動聚焦輸入框。
- `npm run check` 的限制：`<a class="skip-link"`、`<header class="site-header">`（header 標籤不能再加 class）、`<footer class="site-footer">` 都要保留；導覽連結的開始標籤一字不改（`<a class="nav-link" href="index.html">`），目前頁寫成 `<a class="nav-link active" href="…" aria-current="page">`，圖示與文字放在連結**裡面**，屬性順序不能動。
- 錨點與 sticky：`scroll-padding-top` 在 < 992 是 76px（60＋16）、≥ 992 是 24px；≥ 992 沒有頂部頁首，sticky 元件用 `$sticky-offset`（24px）；< 992 不用 sticky。

### 頁尾（`components/_footer.scss`）

`$ti-900` 底、上緣 1px 充能漸層線；左邊品牌（Logo＋介紹）、右邊三組連結（贊助者／提案者／平台），≥ 576 組與組之間是直立 1px 線；版權列用 JetBrains Mono 小字。沒有目的頁的連結是不帶 `href` 的 `<a>`。

### 卡片造型：遙測面板

- 所有卡片與面板都是 `.panel`：`$ti-850` 底、1px `$line` 框、6px 圓角；面板之間靠線分，不靠陰影。
- 上緣 2px 狀態條 `.panel-strip`：募資中加 `.is-live`（充能漸層），其他狀態是 `$line-strong`。
- 數字區＝中文標籤（13px、muted）＋ Chakra 讀數，彼此用 1px 線分格（`.readouts`）。
- 專案卡（`components/_project-card.scss`）：4:3 圖（下緣深色漸層，左上分類、剩 ≤ 7 天時右上 `warn` 時間警示）→ h3 名稱 → 提案者 → 讀數列（達成率｜目前金額，4：6）→ M 充能條 → 人數｜剩餘天數。整張卡用 `.stretched-link` 連到 `project.html`，卡片等高、資料列貼底。
- hover／focus：框線變 `$sky-400` 50%＋微光、圖片亮度 1.08，**尺寸不變**（不放大圖片、不位移、不出現隱藏資訊）。

### 標題階層

- 區塊 h2 靠左，前面一道 3px 寬、1em 高的充能短直線（`.section-heading` 裡的 h2 自動套用，單獨用時加 `.title-mark`），右側可放一個 `.btn-text` 連結。首頁 Hero 是全站**唯一置中**的地方。
- 首頁以外的頁面標題區 `.page-head`：網格紋理帶＋麵包屑（分隔符 `/`，Mono）→ H1（2.25rem／500）→ 說明。
- 標題字重最多 500（不用 700／900 的粗黑），字距 0.04em；Display（首頁 H1）字距 0.06em。

### 招牌元素

1. **充能條 `.charge`**（落實「募資進度條具發光充能感」）：L（12px，外發光＋每 3.6 秒一道掃光）／M（8px）／S（4px）（M、S 只有漸層＋上緣 1px 高光，不發光）；未達標＝實心漸層填到達成率、剛好達標＝滿格＋末端刻度、超額＝滿格，在 `--target`（目標 ÷ 已募，`CONTENT.md` 附錄 B.5）畫一道 2px 刻度，刻度之後是更亮的「電池格」。L 尺寸可包一層 `.charge-scale` 加「目標」小三角與 0／100%／達成率刻度字。進度條是裝飾（`aria-hidden`），數字一定以文字出現在旁邊。
2. **任務主控台 `.console`**（落實「資金儀表板宛如航太數據監控台」）：遙測面板＋上緣充能條＋頂部標頭列（live 狀態燈＋小標籤）→ 讀數格 → 充能條 → CTA。用在首頁 Hero、專案儀表板、結帳「載荷清單」、贊助紀錄詳情左欄；內部怎麼排由各頁決定（首頁的 `.home-console` 是一個例子）。
3. **HUD 角括號 `.hud`**：12px 長、1.5px 粗的 L 形四角。**全站只用 4 處**：首頁 Hero 主控台、專案儀表板、贊助成功的確認環、贊助紀錄詳情左側主控台。縮小版主控台（狀態示意、結帳摘要）不加。登入、註冊「監視畫面」的四角取景框（`.auth-monitor-frame`）是照片上的取景線，畫在圖片內側、不外推，不算在這 4 處。
4. **達成率弧形儀表 `.gauge`**：240° 弧、刻度 0／100／200／300%（100% 是亮刻度），指示弧畫到 `--val`。**只用在帆布包**：專案儀表板（達成率旁，直徑 ≤ 96px，992–1199 的窄欄可以隱藏）、個人頁募資數據的達成率格。卡片與列表不用（其他專案到 586%，刻度會爆）。
5. **發射序列 `.sequence`**：≥ 992 橫向（站數由 `--steps` 決定）、< 992 垂直；站點是六角形節點（已完成實心＋勾、進行中發光脈動、未開始虛線、延遲珊瑚紅）；已完成那一站之後的軌道是充能漸層。用在生產排程（4 站）、贊助紀錄詳情的生產進度（4 站、不放照片，`.sequence-xxl`：放在 8 欄模組裡，≥ 1400 才橫向）。結帳與贊助成功的步驟條是同一套節點語彙的小型版 `.launch-steps`（3 站、節點 2rem、< 576 只顯示目前步驟的文字）。

發光要克制：一個畫面裡發光的東西不超過 3 處。外發光只給 **L 充能條**（首頁與專案頁主控台各一條）、**主控台標頭的 live 燈**（`.console-head` 裡那一顆）、**序列與步驟條的進行中節點**、贊助成功的確認環、**選中**（方案卡、個人頁預設地址）與**焦點**；計算 3 處時這些全部算進去。主要按鈕只靠漸層區分、M／S 充能條只有漸層＋上緣 1px 高光、徽章裡的狀態圓點是實心、弧形儀表與頁首目前頁的青空條都不發光；卡片、標題、文字也不發光。（方向說明原本把主要按鈕也列進發光；按鈕常和主控台同屏，為了守住 3 處的上限改成不發光。）實測 390／992／1200／1440 寬、視窗高 900、每 150px 捲動一次：首頁與專案頁任一畫面最多 2 處（live 燈、L 充能條），其他頁 0～1 處；只有 Guideline 的並排示範（充能條 3 種尺寸、Do／Don't 的反例）會到 4 處。

### 各頁構圖原則

| 頁面 | 桌機構圖 | 手機 | 主角 |
|---|---|---|---|
| `index.html`（完成） | Hero 置中（網格紋理＋頂部冷藍光暈）：H1 兩行 → 副標 → 兩顆按鈕 → 寬幅任務主控台（左 5 主視覺＋名稱｜右讀數：目前募得 XL 獨佔一格、目標一條細列、達成率 L／贊助人數／剩餘天數 3 格；底部 L 充能條＋「看這個專案」＋追蹤）→ 品牌核心痛點（一條橫向面板切 4 格）→ 分類策展（4 張 4:5 卡，底部深色讀數條常駐）→ 正在發生的提案（`$ti-900` 區塊、方角分段分頁、便當格：≥ 1200 第 1 張大卡跨 2 欄 2 列，右側兩張小卡主視覺改 21:9，大卡圖片約 4:3、整張在一個視窗高內）→ 通訊紀錄式評價＋平台保障 6：6 → #propose 冷藍漸層轉換帶 | Hero 靠左；主控台單欄：圖 → 名稱 → 金額 → 充能條 → 3 格讀數 → 按鈕 | 任務主控台＋充能條 |
| `projects.html`（完成） | 頁面標題區 → **全寬篩選控制台**（取代側欄；標頭列左「篩選」、中關鍵字、右「清除全部」；下方 5 組並排）→ 工具列（已套用、共 92 件）→ 8 條**三區任務條**：圖 3｜文 6｜遙測欄 3（達成率、目前金額、M 充能條、目標／人數／剩餘天數 Mono 對齊），三區之間直立髮絲線 → 方角分頁 → S6 | 控制台用 `.offcanvas-lg`（< 992 變全螢幕浮層，底部「查看 92 件結果」）；任務條 ≥ 768 兩區（圖 4｜文 8，遙測移到文字下方），< 768 上下排 | 篩選控制台、遙測欄 |
| `project.html`（完成） | 麵包屑 → **鏡像** Grid `5fr 7fr`：**主控台在左**（sticky，top 24px，`.console.hud`，1440×900 時高度約 800px；視窗高度 ≥ 860px 才 sticky，矮視窗跟著捲動，避免底部按鈕被切掉）｜右欄主視覺 → 縮圖 → 標題區 → 頁內導覽 → 故事（680px）；回饋方案鏡像 4：8（左 sticky「載荷面板」、右 5 張三區模組卡）；生產排程全寬橫向發射序列；提案者「機組資料卡」4：8；留言「通訊紀錄」；風險 `warn` 面板＋FAQ 方角 Accordion；狀態示意 S3／S4／S5 縮小版主控台 3 欄 | 主視覺 → 縮圖橫捲 → 標題 → 主控台（不 sticky）→ … ；底部行動列（`$ti-900`、上緣 S 充能細條、`safe-area-inset-bottom`）；992–1199 主控台讀數改單欄、弧形儀表隱藏 | 左側主控台、發射序列 |
| `account.html`（完成） | 「操作員識別列」（頭像＋青空細外環 `.avatar-ring`、H1、`ok` 認證提案者、角色切換 `.seg`）→ **橫向 sticky 模組列**（取代側欄，ScrollSpy；兩組「贊助｜提案」，992–1199 放不下時兩組各佔一列，不藏項目）→ 全寬內容：贊助紀錄（4 讀數格 → 分段篩選 → ≥ 1200 兩欄任務卡：縮圖＋資訊｜`$ti-900` 狀態帶｜操作列）、提案狀態看板（左緣 2px 狀態條、4：5：3）、募資數據（4 讀數格 → 圖表 2「主螢幕」全寬 → 圖表 1 同寬同 x 座標，日期上下對齊 → 圖表 3 橫條，≥ 1400 和表格並排）、收件與帳號 7：5 | 模組列變 Dropdown；全部單欄；統計 2×2 | 模組列、圖表主螢幕 |
| `login.html`／`register.html`（完成） | 5：7：左 5 欄表單直接放在深色底（不包卡，上緣 2px 充能線，左緣對齊版心；欄寬取版心 5/12、至少 25rem）｜右 7 欄 `proposer-workshop.jpg`（`alt=""`、`aria-hidden`）做成「監視畫面」：和表單區等高、出血到視窗右緣、灰階＋青空疊色、四角取景框、極淡靜態掃描線、左緣淡入，圖上不放字；分欄區下方一道髮絲線，設計稿狀態示意接在下面、寬度與左緣同表單欄 | 圖隱藏，單欄：H1 → 說明 → 表單 → 切換連結 → 狀態示意 | 監視畫面 |
| `checkout.html`（完成） | 3 站步驟條 `.launch-steps` → H1（靠左）→ **鏡像** 5：7：左 5 sticky「載荷清單」主控台（視窗高 ≥ 56rem 才 sticky；贊助摘要、總計 Chakra XL、「確認贊助並付款」`form="checkoutForm"`）｜右 7 表單模組（地址卡在模組寬 ≥ 32rem 時 2 欄、付款卡、信用卡子面板）。DOM 順序是表單在前、摘要在後，桌機用 grid 放左。選「行動支付」時信用卡子面板用 `:has()` 隱藏，不寫 JS | 單欄：表單 → 摘要（含送出按鈕）→ 狀態示意；步驟條只顯示目前步驟的文字 | 載荷清單 |
| `order-result.html`（完成） | 3 站全亮步驟條 → **置中確認環**（160px SVG、充能漸層描繪一次、環心勾、HUD 角括號）→ H1＋說明置中 → 6：6 雙面板（贊助明細｜收件與預計出貨讀數）→ 全寬 `ok` 提醒 → 置中兩顆等寬按鈕。不放專案的達成率、金額、天數 | 單欄 | 確認環 |
| `backing.html`（完成） | 頁面標題區（麵包屑、贊助編號 Mono、回到贊助紀錄）→ 4：8（992–1199 為 5：7）：左 sticky 主控台（專案摘要＋付款資訊，`.hud`；視窗高 ≥ 50rem 才 sticky；主控台本身是容器，欄寬不夠時付款資訊改成標籤在上）｜右模組堆疊（我的方案 → 收件資訊＋Collapse 改地址 → 迷你序列（≥ 1400 橫向）→ 取消贊助 `.btn-outline-danger`）；Modal 深色；狀態示意 ≥ 768 兩欄縮小版主控台＋取消對話框的靜態樣子 | 專案摘要最前、取消贊助最後 | 左側主控台 |
| `guideline.html`（完成） | 頁面標題區 → **上方 sticky 章節頻道列**（00 概覽＋9 章共 10 格，`.nav.seg`，編號在上、章名在下，ScrollSpy；不用左側 3：9，因為控制欄已在左）→ 全寬章節（底色交替，章首是「頻道號」方塊＋h2，每章一組 `.module.panel`）：00 概覽（招牌元素合體的主控台＋5 個招牌元素＋10 頁卡片）、01 色彩（4 組色票含對比、6 種語意色調、狀態徽章總表與出現位置）、02 字級（字族、字級表、長文、數字排版）、03 間距（尺度、容器、10 頁欄位配置）、04 圓角、分層與發光、05 元件狀態（按鈕、表單、充能條 3 狀態 × 3 尺寸、回饋方案卡 4 狀態、里程碑＋延遲、分段與篩選、Callout、權限、頁首、留言）、06 數據圖表（同一張累積金額圖的深色預設與淺色底 `#EEF3F8` 範例**上下對照**、日期對齊；提示框靜態示範；配色對照表）、07 18 則狀態文案（含出現的頁面）＋空畫面、08 RWD（斷點、10 頁各寬度、手機底部行動列、無障礙）、09 Do／Don't 8 組。示範一律用頁面真的在用的 class（`pd-`、`ac-` 等頁面前綴也照用），`gl-` 只寫色票、尺規、靜態 hover／focus 這類 Guideline 才需要的東西 | 章節列是標題區下方可橫捲的一列（不 sticky）；圖表在圖卡內橫捲（SVG 最小寬 760px）；手機行動列示範貼齊螢幕兩側 | 招牌元素示範、圖表對照 |

## 檔案結構

```
01-hardware-lab-style/
├─ *.html                    ← 10 個頁面，每頁完整包含頁首與頁尾：index、projects、project、account、login、register、checkout、order-result、backing、guideline
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製（開頭註解寫了目前頁的標示規則）
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
│  ├─ _base.scss             ← 全站基礎與共用類別（面板、充能條、讀數格、徽章、提示框…）
│  ├─ components/            ← 頁首（控制欄）、頁尾、主控台＋弧形儀表、發射序列、流程元件（步驟條、模組、選項卡、明細）、專案卡、圖表卡
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴）
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾是否與範本一致
   └─ generate-images.mjs    ← 生圖腳本（STYLE 與 23 張圖的 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾每頁一份**：要改頁首或頁尾時，先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check`。每頁只有一處不同：頁首導覽的目前頁。index → 首頁、projects → 探索專案、account → 我的島造（`active`＋`aria-current="page"`）；**子頁只加 `active`、不加 `aria-current`**：project → 探索專案、backing → 我的島造；guideline、login、register、checkout、order-result 不標示。全站以已登入的提案者「陳柏宇」呈現，登入、註冊頁也照範本。
- **新增頁面**：複製範本成新頁，改 `<title>`（`頁面名稱｜島造 ISLANDMAKE 在地製造提案平台`）、description 與目前頁標示，內容寫在兩行「頁面內容」註解之間；樣式寫在 `scss/pages/` 已有的 partial（`main.scss` 已全部載入），執行 `npm run check`。
- **頁面 class 前綴**：首頁 `home-`；建議其他頁沿用同主題的慣例：列表 `pl-`、專案細節 `pd-`、個人頁 `ac-`、登入註冊 `auth-`、結帳 `co-`、贊助成功 `or-`、詳情 `bk-`、Guideline `gl-`。
- **假資料直接寫在 HTML**：文案逐字取自主題的 `../CONTENT.md`（Notion），Notion 沒有的數字用它的附錄 B（六套風格一致）。帆布包的數字（NT$ 1,235,600／目標 NT$ 500,000／247%／1,042 人／剩 12 天／超額刻度 40.5%）改動時要多頁同步。
- **JS**：`js/main.js` 只做六件事：搜尋面板展開後自動聚焦（`#siteSearchMobile`）、分頁籤（`data-bs-toggle="tab"`）與篩選按鈕切換時，把目前項目在可橫捲的 `.nav`／`.seg` 列裡捲進畫面、追蹤按鈕切換 `aria-pressed`（`.btn-follow`）、回饋方案選取與贊助小計（只在 `#rewardForm` 存在時執行，見下表）、贊助紀錄篩選（`data-filter` 按鈕對應卡片的 `data-status`）、個人頁角色切換（`data-role`、`data-set-role`＋`?role=backer`；對應的 `[data-role="backer"] .for-proposer`、`[data-role="proposer"] .for-backer { display: none }` 要在做個人頁時寫進 `_account.scss`）。其他互動（選單、分頁、輪播、下拉、Offcanvas、ScrollSpy、FAQ）都靠 Bootstrap 的 `data-bs-*`。
- **換行與空白**：專案名稱、標題用 `.text-phrase`＋`<wbr>` 標出詞組斷點；數字與單位之間用 `&nbsp;`（`1,042&nbsp;人`、`12&nbsp;天`）。
- **語意化數字**：金額、達成率、人數用 `<data value>`，日期用 `<time datetime>`。
- **圖片載入**：首屏與一進頁就看得到的圖不要加 `loading="lazy"`；只有隱藏分頁裡、或離首屏很遠的圖才加。
- **表單**：設計稿沒有後端，照靜態設計稿的慣例用 `<form action="目的頁">`（GET）：專案細節的「下一步：填寫收件資訊」→ `checkout.html`、登入與註冊 → `project.html#rewards`、結帳 → `order-result.html`、修改收件資訊 → `backing.html#shipping`。密碼、Email、姓名、手機、地址、卡號欄位都**不加 `name`**，避免出現在網址；只有地址與付款方式的 radio 帶 `name`（值是 `home`、`card` 這類代號）。欄位一律有 `id`、`<label for>` 與 `autocomplete`；錯誤狀態示意的欄位重畫一份、`id` 加 `-demo` 後綴，不包 `<form>`。沒有目的頁的按鈕用 `<button type="button">`。
- **Modal 的靜態樣子**：狀態示意裡只用 `.modal-content` 以下的 class，**不加 `.modal`**；Bootstrap 的 `--bs-modal-*` 變數定義在 `.modal` 上，靜態樣子要由外層（例如 `.bk-dialog-demo`）用同一組 Sass 變數補上內距、框線與底色。

## 樣式架構

`scss/main.scss` 的載入順序：

1. `bootstrap/scss/functions`
2. `_variables.scss`：本風格的變數覆寫（色彩、語意色調、字體、間距、圓角、發光、元件的深色設定）
3. `bootstrap/scss/bootstrap`：用上面的變數編譯出整套 Bootstrap
4. `bootstrap-icons`：圖示字型與 class（字型路徑指向 `css/fonts/`）
5. `_base.scss`：字體、區塊節奏、按鈕、表單、焦點，以及下表的共用類別
6. `components/*`：頁首（控制欄）、頁尾、主控台＋弧形儀表、發射序列、流程元件（`_flow.scss`：結帳、贊助成功、贊助紀錄詳情共用）、專案卡、圖表卡
7. `pages/*`：各頁專屬樣式，class 一律加頁面前綴

原則是**先用 Bootstrap 的變數與工具類別**，真的做不到才寫自訂 CSS，而且自訂 CSS 也只引用變數，不寫死色碼（SVG 圖表也一樣：顏色由 class 與 CSS 變數決定）。每個共用類別的 HTML 範例寫在 SCSS 該段開頭的註解裡。

### 共用類別

| 類別 | 用途與寫法 |
|---|---|
| `.panel`、`.panel-pad` | 遙測面板（`$ti-850`、1px 框、6px 圓角）；`.panel-pad` 加上 20／24px 內距 |
| `.panel-strip`（＋`.is-live`） | 面板上緣 2px 狀態條；`.is-live` 是充能漸層（募資中），其他是 `$line-strong` |
| `.is-selected` | 選中：青空框＋`$select-bg` 底＋微光（方案卡）。地址卡、付款卡改用 `.option-card`，靠 `:has(:checked)` 選中、不加外發光 |
| `.hud` | 四角 HUD 角括號（畫在 `::after`）。全站只用 4 處，見「招牌元素」 |
| `.cut-box`、`.cut-box-lg` | 左上、右下切角的圖示方框（40／64px）：品牌核心痛點、平台保障、空狀態 |
| `.charge`（`.is-full`、`.is-over`、`.charge-l`、`.charge-s`） | 充能條。未達標 `style="--fund: 68%"`；超額 `class="charge is-over" style="--target: 40.5%"`；一律 `aria-hidden="true"` |
| `.charge-scale`、`.charge-marker`、`.charge-ticks`（`.is-target`、`.is-end`） | L 充能條的「目標」小三角與刻度字；`--target` 寫在 `.charge-scale` 上 |
| `.readouts`、`.readout` | 讀數格：`<dl class="readouts" style="--cols: 3">`，每格 `<div class="readout"><dt class="label">…</dt><dd class="readout-value">…</dd></div>`；格線是容器底色從 1px gap 露出來 |
| `.readout-value`（`.readout-xl`、`.readout-l`、`.readout-s`、`.readout-xs`、`.readout-sky`）、`.unit`、`.readout-meta` | Chakra 讀數與尺寸（XL 3rem 只給目前募得、L 2.5rem 給達成率）；中文單位包 `<span class="unit">`，基線對齊；`.readout-meta` 是讀數下的一行補充 |
| `.stat-tile`（＋`.is-ok`） | 數據卡：標籤 → 大數字 → 補充；`.is-ok` 是強調格（準時出貨率 100%）。金額型的數字在 < 576 兩欄時會放不下，要給整欄寬 |
| `.console`、`.console-head`、`.console-head-meta`、`.console-body` | 任務主控台的外框、標頭列（狀態燈＋小標籤）、內容區 |
| `.gauge`（`.gauge-track`、`.gauge-value`、`.gauge-ticks`、`.gauge-target`） | 達成率弧形儀表，inline SVG 寫法在 `components/_console.scss` 開頭；`style="--val: 247"` |
| `.sequence`（＋`.sequence-xxl`）、`.sequence-step`（`.is-done`、`.is-live`、`.is-todo`、`.is-err`）、`.sequence-node`、`.sequence-body`、`.sequence-title`（內含 `.sequence-no`、`.sequence-sep`）、`.sequence-meta` | 發射序列，`<ol class="sequence" style="--steps: 4">`；寫法在 `components/_sequence.scss` 開頭。標題寫成 `<span class="sequence-no">里程碑 1</span><span class="sequence-sep">｜</span>設計定版`：平常一行；992–1199 橫排每站只有約 174px，「里程碑 N」改成名稱上方的小標，分隔線只留給讀屏。預設 ≥ 992 橫向；`.sequence-xxl` 到 ≥ 1400 才橫向（放在窄欄模組裡時用） |
| `.launch-steps`、`.launch-step`、`.launch-step-node`、`.launch-step-label` | 結帳流程的 3 站步驟條（`components/_flow.scss`）：`<nav class="launch-steps" aria-label="贊助步驟"><ol><li class="is-done">…`；`li` 加 `is-done`／`is-live`，目前步驟加 `aria-current="step"`；已完成的站可以是連結。< 576 只顯示目前步驟的文字 |
| `.module`、`.module-head`、`.module-title`、`.module-desc`、`.module-body` | 表單與明細的模組面板（外層同時加 `panel`）：標頭列（h2＋充能短直線＋說明）→ 內容區。`.module-body` 是容器查詢的容器（`container-type: inline-size`） |
| `.option-grid`、`.option-card`、`.option-card-check`、`.option-card-body`、`.option-card-title`、`.option-card-line` | 單選卡（地址、付款方式）：`<label class="option-card"><input class="btn-check" type="radio" …>…</label>`；選中由 `:has(.btn-check:checked)` 決定（青空框＋`$select-bg`＋上緣充能線＋右上實心勾），不寫 JS、不加外發光。`.option-grid` 在模組寬 ≥ 32rem 時 2 欄 |
| `.ledger`（`.ledger-total`） | 金額明細：`<dl class="ledger">`，每列標籤靠左、金額 Mono 靠右，列之間虛線；`.ledger-total` 是實線分隔的總計列 |
| `.detail-list`（`.is-total`） | 標籤＋值的明細清單（贊助明細、付款資訊、收件資訊）：標籤欄 6.5em、值靠左、列之間髮絲線；`.is-total` 的值用 Chakra 青空色 |
| `.pledge-project`、`.pledge-project-thumb`、`.pledge-project-name`、`.pledge-project-maker` | 贊助的專案摘要列：4:3 縮圖＋專案名稱＋提案者 |
| `.meta-list` | 一列短資訊，項目之間 1px 直線分隔（贊助編號 ‧ 日期、方案 ‧ 金額 ‧ 贊助日） |
| `.reward-tier-items` | 回饋內容的方點清單。寫在 `pages/_project.scss`（方案卡），結帳摘要與贊助紀錄詳情的「我的方案」直接沿用同一個 class |
| `.project-card`（＋`.is-feature`）及 `-media`、`-flags`、`-body`、`-title`、`-maker`、`-readouts`、`-meta` | 專案卡；外層同時加 `panel panel-strip is-live`；`.amount-value` 是讀數列裡的金額；`.is-feature` 是便當格大卡（≥ 768 讀數放大、≥ 1200 圖片填滿剩餘高度；高度由右側兩張小卡決定，所以那兩張的主視覺在 ≥ 1200 改成 21:9，大卡圖片約 4:3、整張 810～840px） |
| `.chart-card`（＋`.is-light`）、`.chart-card-head`、`.chart-card-title`、`.chart-card-sub`、`.chart-screen`、`.chart-scroll`、`.chart-table` | 圖表卡（`components/_chart.scss`）：標題＋副標＋「切換表格檢視」→ 圖表 → Collapse 數據表；`.chart-screen` 是主圖外的 `$ti-900` 內嵌面板；`.is-light` 是淺色底 `#EEF3F8` 範例（只用在 Guideline 第 06 章，和深色預設上下對照），顏色另選一組 `$chart-light-*`，不是自動反轉 |
| `.chart-svg`（＋`.is-wide`）、`.chart-grid`（＋`.is-base`）、`.chart-x`、`.chart-y`、`.chart-area`、`.chart-line`、`.chart-point`、`.chart-target`、`.chart-note`（＋`.is-strong`、`.is-target`） | inline SVG 圖表：顏色全部由 class 與 CSS 變數決定；只有 `.chart-target` 是虛線；`.chart-note` 描一圈底色壓過格線。< 768（`.is-wide` 是 < 992）SVG 有最小寬，只在圖卡內橫捲；文字是 viewBox 單位，頁面可依斷點改 `--chart-fs` |
| `.hbar-list`、`.hbar-row`、`.hbar-label`、`.hbar`、`.hbar-fill`、`.hbar-value` | HTML／CSS 橫條圖：`style="--w: .867"`（金額 ÷ 最大值），數值標在長條尖端，同一個數據色 |
| `.badge-state`（`.is-live`、`.is-info`、`.is-warn`、`.is-ok`、`.is-err`、`.is-idle`；`.is-dashed`、`.is-lg`） | 狀態徽章：狀態色文字＋16% 色底＋圖示或 `.status-dot`，不只靠顏色；已下架加 `.is-dashed` |
| `.status-dot` | 狀態圓點：實心、不發光；只有主控台標頭（`.console-head`）的 live 燈帶微光並脈動（只改陰影）。要單獨示範發光燈時加 `.status-dot.is-live` |
| `.text-live`、`.text-info`、`.text-warn`、`.text-ok`、`.text-err`、`.text-idle` | 語意色文字（深色底上的淺一階色） |
| `.tag`、`.tag-overlay`、`a.tag` | 標籤（分類、地點）；`.tag-overlay` 疊在圖片上；`a.tag` 是可點的分類連結（44px 高） |
| `.callout`（`.is-live`／`.is-info`／`.is-warn`／`.is-ok`／`.is-err`／`.is-idle`）、`.callout-icon`、`.callout-title` | 提示框：左側 2px 狀態色線＋16% 色底＋圖示，字級同內文 |
| `.chip`、`.chip-count`、`.chip-applied` | 篩選標籤：`<input class="btn-check" …><label class="chip" for="…">`；選中有勾；`.chip-applied` 是已套用的篩選（帶移除鈕） |
| `.seg`、`.seg-btn`、`.tab-count` | 方角分段控制：`<ul class="nav seg" role="tablist">` 當分頁籤，或 `<div class="seg" role="group">` 裡放 `.seg-btn[aria-pressed]`；`.tab-count` 是分頁上的數字 |
| `.btn-primary`、`.btn-outline-sky`、`.btn-ghost`、`.btn-outline-danger`、`.btn-text`、`.btn-icon`、`.btn-follow` | 主要（冷藍→青空漸層＋深字，一個畫面只放一顆最重要的）、次要（1px 青空框）、中性、危險（層級低）、文字連結＋箭頭、44px 圖示鈕、追蹤（`aria-pressed="true"` 時實心愛心） |
| `.page-head`、`.page-head-slim`、`.page-title`、`.page-lead` | 首頁以外的頁面標題區（網格紋理帶）；`.page-head-slim` 只有麵包屑 |
| `.section`、`.section-tight`、`.section-alt`、`.section-heading`、`.title-mark` | 區塊節奏（56／88px、緊湊 32／56px）、`$ti-900` 交替區塊、區塊標題列、h2 前的充能短直線 |
| `.grid-texture`（mixin `grid-texture`） | 32px 網格紋理，只鋪在首頁 Hero 與頁面標題區 |
| `.num-display`、`.mono`、`.num`、`.amount`、`.label` | Chakra 獨立大數字、JetBrains Mono 小字（編號、日期、座標）、等寬對齊數字、不換行的金額、13px 中文標籤 |
| `.text-note`、`.text-faint`、`.text-muted-lab`、`.text-phrase` | 次要說明、淡字（只用在 ≥ 13px）、次要色、詞組不拆開（搭配 `<wbr>`） |
| `.avatar`、`.avatar-letter`、`.avatar-lg`、`.avatar-ring` | 圓形頭像、文字頭像、大頭像、青空細外環 |
| `.img-frame`、`.media-shade` | 髮絲框圖片外框、圖片下緣深色漸層 |
| `.scroll-x`、`.bleed-x`（mixin `bleed-x`） | 橫向捲動容器（圖表、表格、縮圖列）；< 576 讓捲動列貼齊螢幕兩側 |
| `.table-lab` | 數據表：表頭 `$ti-800`、Mono 數字靠右（`td.num`）、列之間髮絲線 |
| `.empty-state` | 空狀態：`.cut-box-lg` 圖示 → Notion 文案 → 按鈕 |
| `.demo-state`、`.demo-state-tag`、`.demo-state-title`、`.demo-case`、`.demo-case-title` | 設計稿狀態示意區（1px 虛線分隔、Mono 方框標籤）與每個示意情境 |
| `.skip-link` | 跳至主要內容（≥ 992 位置避開控制欄） |
| `.site-header`、`.site-rail`、`.site-nav`、`.site-brand*`、`.site-search*`、`.site-propose`、`.site-avatar`、`.site-footer*` | 頁首（控制欄）與頁尾，只寫在 `templates/page.html`，各頁照抄、不在別處使用；Guideline 第 05 章的頁首示範是另畫的 `.gl-rail`／`.gl-topbar` |

`main.js` 用到的鉤子：`#siteSearchMobile`；`.btn-follow[aria-pressed]`；`#rewardForm` 裡的 `.reward-tier`、`input[name="reward"]`（`data-name`）、`.reward-tier-choose`、`[data-summary="name|base|extra|total"]`、`#pledgeAmount`、`#pledgeMin`、`#pledgeNext`、`[data-add]`；`[data-filter-list]`＋`data-filter`／`data-status`；`[data-role]`、`[data-set-role]`。

## Design token 摘要

| 類別 | 設定 |
|---|---|
| 鈦灰（面） | 頁面底 `$ti-950 #0A0E13`（也是 `theme-color`）、交替區塊／頁尾／控制欄 `$ti-900 #0F151C`、面板與卡片 `$ti-850 #141B24`、輸入框與表頭 `$ti-800 #1A2330` |
| 線 | 髮絲線 `$line #273241`（裝飾）、圖表格線與未開始的虛線 `$line-strong #3A4A5E`、表單框線與停用文字 `$control #6F829A`（對 `$ti-900` 4.66:1） |
| 文字 | 主文字 `$fg #E8EEF5`、次要 `$fg-muted #A6B4C4`（對 `$ti-900` 8.69:1）、淡 `$fg-faint #8C9CB0`（6.55:1，只用在 ≥ 13px） |
| 冷藍到青空 | 冷藍 `$blue-500 #3E7BFA`（只當圖形）、文字連結 `$blue-300 #7EA6FF`（7.68:1）、青空 `$sky-400 #4CC8F4`（品牌主色、選中框）、大讀數與焦點 `$sky-300 #7DDCFA`、電池格亮端 `$cell-hi #B5ECFF`、進度軌道 `$track #1F2A38`、選中底 `$select-bg #1A2C39` |
| 漸層 | 充能 `$grad-charge`（90deg 冷藍→青空）、主要按鈕 `$grad-btn`（`#6A97FF`→青空，字 `#06101A`，6.82／9.92:1）、電池格 `$grad-cells`、轉換帶 `$grad-band`（`#13234A`→`#0F3A55`） |
| 語意色調（文字／16% 底） | live `#7DDCFA`／`#1D3745`、info `#C3C9FF`／`#2C3347`（薰衣草紫，不用藍，否則和 live 分不開）、warn `#FFC24D`／`#3A362B`、ok `#4FDB9A`／`#1D3A37`、err `#FF9B9B`／`#3A2A32`、idle `#C2CCD8`／`#272F39`；徽章對比 6.69–8.33:1 |
| 字體 | Noto Sans TC 400／500／700（標題最多 500、字距 0.04em）；Chakra Petch 500／600／700（金額、達成率、天數、刻度、ISLANDMAKE）；JetBrains Mono 400／500（編號、日期時間、座標、表格數字） |
| 字級 | Display `clamp(2.5rem, 1.5rem + 3.2vw, 4.25rem)`；H1 2.25rem、h2 1.625rem、h3 1.1875rem（手機 H1 1.875、h2 1.4375）；內文 1rem／1.75；長文 1.0625rem／1.9、680px；標籤 0.8125rem；讀數 XL 3rem、L 2.5rem、M 1.75rem、S 1.5rem |
| 圓角 | 進度條 2px、徽章與篩選標籤 3px、按鈕與輸入框 4px、面板與卡片 6px；頭像圓形；**沒有膠囊、沒有大圓角** |
| 陰影與發光 | 不用投影分層；浮起層（下拉、Modal、底部行動列、搜尋面板）＝ 1px `$line-strong` 框＋`0 16px 40px rgba(0,0,0,.45)`；發光 `$glow`＝`0 0 0 1px` 青空 45%＋`0 0 18px` 青空 18%（選中）、`$glow-soft`＝`0 0 14px` 青空 35%（L 充能條），只給 L 充能條、主控台 live 燈、進行中節點、選中、焦點，一個畫面最多 3 處；主要按鈕不加外光暈；文字不加 `text-shadow` |
| 版面 | 控制欄 88px、手機頂部橫列 60px；容器 540／720／880／1080／1280；區塊 56／88px；面板內距 20／24px；sticky 位移 24px |
| 焦點 | 一般元素 2px `$sky-300` 外框＋2px 間隙；按鈕與輸入框多一圈 25% 青空外暈 |
| 淺色底圖表（只在 Guideline） | `$chart-light-bg #EEF3F8`、標題與標註 `$chart-light-ink #0F151C`（16.4:1）、座標與副標 `$chart-light-muted #4D5E72`（6.0:1）、數據線與連結 `$chart-light-line #1F5FD6`（5.1:1）、目標虛線 `$chart-light-target #2B3747`、基準線 `$chart-light-base #8193A8` 與格線 `$chart-light-grid #CFD9E4`（裝飾）、表頭 `$chart-light-head #DDE5EE`、提示框底 `$chart-light-float #FFFFFF` |

完整規範請看 `guideline.html`。

### 換色時同步檢查

色票的唯一來源是 `_variables.scss`，但下面幾處把數值寫成文字或寫死，改色時要一起檢查（格式同上一層 [`../README.md`](../README.md)）：

- [ ] `scss/_variables.scss`：鈦灰四層、線與文字、冷藍到青空、漸層、`$theme-colors`、6 種語意色調（文字色＋16% 底），以及 Bootstrap 的深色語意變數（`$body-*-dark`、`$input-*`、`$focus-ring-color`…）；每個色票後面的對比註解要重算。
- [ ] `guideline.html`：第 01 章的色票 hex、對比度與用途文字，6 種語意色調表、狀態徽章總表；第 04 章發光層級表；第 05 章按鈕表的說明（亮度 1.08／0.96、對比）。
- [ ] 圖表：SVG 裡沒有寫死色碼（顏色在 `components/_chart.scss` 由 class 與 CSS 變數決定），改的是 `_chart.scss` 用到的變數；淺色底範例用 `$chart-light-*` 另一組，要對 `$chart-light-bg` 重算對比；Guideline 第 06 章的「圖表配色對照」表一起改。
- [ ] 這份 `README.md`：Design token 摘要（含淺色底圖表那一列）。
- [ ] 改了頁首尺寸時（`$rail-width` 88px、`$header-height-sm` 60px）：`scroll-padding-top`、`$sticky-offset`、各頁 sticky 主控台與模組列、Guideline 頻道列的 `scroll-margin-top`，以及 Guideline 第 03 章容器表與第 08 章斷點表的數字。
- [ ] `scripts/generate-images.mjs` 的 `STYLE`：整組圖片的冷色調，換色後重新生圖。
- [ ] `templates/page.html` 與每一頁的 `theme-color`（`#0A0E13`），以及 `images/favicon.svg` 裡的色碼（`#141B24`、`#3A4A5E`、`#3E7BFA`、`#4CC8F4`、`#7DDCFA`）。

## 動態

| 動態 | 做法 |
|---|---|
| 充能條填滿 | 載入時填色由 0 長到定位（`transform: scaleX()`、900ms、只跑一次）；元素尺寸一開始就是最終值 |
| 掃光（只有 L） | 一道亮帶每 3.6 秒由左掃到右，偽元素絕對定位、`overflow: hidden` |
| live 圓點、進行中節點 | 外圈陰影循環 2.4 秒，不改尺寸 |
| 弧形儀表、確認環 | `stroke-dashoffset` 描繪一次 1.2 秒 |
| hover | 框線變青空 50%＋冷光、主要按鈕亮度 1.08、連結加底線、圖片亮度 1.08；不位移、不放大、不出現隱藏資訊 |

`prefers-reduced-motion: reduce` 時全部關閉：充能條直接顯示最終長度、掃光與脈動移除、描繪直接畫滿。不做數字跳動計數、掃描線動畫、閃爍、hover 才顯示的讀數。

## 圖片

`images/` 的 23 張圖皆以 AI（Codex CLI 的 image_generation）生成，僅供課程示意；檔名、畫面主體與 alt 照主題的 [`../IMAGES.md`](../IMAGES.md)，六套風格相同。這一套的調性是「夜班產品實驗室攝影」：6500–7500K 冷白主光、LED 燈條打出細細的青藍輪廓光、石墨與鈦灰的環境沉進陰影、低彩度但物件保留原色（原胚帆布、墨綠、炭黑）；產品照（帆布包、餐具、筆記本、咖啡渣杯、三色布料）放在深色霧面無縫背景上，背後一團淡淡的冷色光暈，避免在深色頁面上出現刺眼的白底；紀錄類場景（帆布廠、縫紉、漁船甲板、倉庫）在藍調時刻或工作燈下拍，寫實、不科幻；顧客實拍（`ugc-*`）維持夜間室內的手機隨手拍。所有圖都不含文字、商標、介面畫面、全息投影與霓虹招牌。替換時保持相同檔名即可，不需改程式。

```bash
npm run images                                              # 產生缺少的圖片
node scripts/generate-images.mjs --only hero-canvas-bag    # 只產生指定的圖（不含 .jpg，逗號分隔）
node scripts/generate-images.mjs --only story-bag-details --force   # 重做指定的圖
CONC=2 npm run images                                       # 並行數（預設 1）
```

換成其他風格時，改腳本裡的 `STYLE`（整組圖的共同調性）、`PRODUCT`／`SCENE`／`CANDID` 三種拍法與各張描述即可。`images/favicon.svg` 是手繪向量：`$ti-850` 切角方塊、青空色島形、一道冷藍軌道弧線。
