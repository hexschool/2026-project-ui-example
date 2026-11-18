# 05｜撞色創作者沙龍：現場筆記 FieldNotes

> 高對比＋飽和色（純白底、深黑、克萊因藍撞活力橘）｜區塊編輯器以積木模組拖曳呈現，創作者後台數據與訂閱會員狀態對比鮮明。

| 編號 | 風格 | 色系搭配（Notion） | UI 視覺特點（Notion） |
|---|---|---|---|
| 05 | 撞色創作者沙龍 | 高對比 ＋ 飽和色（純白底、深黑、克萊因藍撞活力橘） | 區塊編輯器以積木模組拖曳呈現，創作者後台數據與訂閱會員狀態對比鮮明。 |

概念是「一面用積木拼起來的創作者沙龍海報牆」：整站是 12 欄的便當盒網格，每一塊內容都是一個積木（2px 墨黑框、20px 圓角、實色填滿），克萊因藍和活力橘的色塊撞在一起，標題用 Noto Sans TC 900 的超大字「喊出來」。大膽花在三件事：

- **便當盒積木**：首頁、方案頁、個人頁都是拼起來的積木，積木之間 16px，積木裡面寬鬆（40px 內距）。顏色只有白、黑、藍、橘四種填色，每個便當盒最多一塊藍、一塊橘。
- **積木區塊編輯器**（`account.html#editor`、Guideline）：寫作區是一疊積木，每塊左側都有常駐的黑色把手欄，免費預覽分隔線是一整塊橘色積木，Guideline 另有「拖曳中」的靜態示範。
- **對比鮮明的後台數據與會員狀態**：4 張數據卡 4 種填色；訂閱中是巨大的藍積木，已取消待到期是黃積木，扣款失敗是紅積木，已到期是白積木。

其他保持克制：長文閱讀欄是純白黑字，顏色只出現在海報、付費牆與徽章；沒有柔和陰影，硬陰影只給付費牆、選單、對話框與拖曳中的積木；幾何裝飾（四分之一圓、半圓）只出現在首頁。

這一套**不使用 Vite、Vue 或任何打包工具**，只有 Bootstrap 5＋HTML＋CSS＋JS（與 01 電商主題的 `01-luxury-style` 相同架構）：

- **HTML**：每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看。
- **CSS**：Bootstrap 用 Sass 客製，唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`）。單一淺色主題，不跟著作業系統切換深色模式。
- **JS**：互動大多交給 Bootstrap 的 `data-bs-*` 屬性，自己寫的只有 `js/main.js` 裡的幾個小功能（見下方）。

## 快速開始

**只想看畫面**：直接用瀏覽器打開 `index.html`。編譯好的 `css/style.css` 與 Bootstrap JS 都已在專案內，不需要安裝任何東西（字體從 Google Fonts 載入，需要網路）。

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
| 文章列表 | `articles.html` | `scss/pages/_articles.scss` | 完成 |
| 文章內頁（以〈一間餐廳的成本結構〉示範，含付費預覽牆） | `article.html` | `scss/pages/_article.scss` | 完成 |
| 訂閱方案（方案卡、比較矩陣、結帳確認、FAQ） | `pricing.html` | `scss/pages/_pricing.scss` | 完成 |
| 個人頁面「我的現場筆記」（讀者／作者／管理員） | `account.html` | `scss/pages/_account.scss` | 完成 |
| 登入 | `login.html` | `scss/pages/_auth.scss` | 完成 |
| 免費註冊 | `register.html` | `scss/pages/_auth.scss` | 完成 |
| 作者個人頁（以陳柏諺示範） | `author.html` | `scss/pages/_author.scss` | 完成 |
| 忘記密碼 | `forgot-password.html` | `scss/pages/_auth.scss` | 完成 |

頁首與頁尾沒有列出所有頁面的導覽，也不連 Guideline：從首頁依讀者流程點進各頁即可，Guideline 直接開 `guideline.html`。所有文章卡（含作者個人頁）都連到同一篇 `article.html`。登入頁從文章付費牆「已經是訂閱者了？登入」進入（忘記密碼？→ `forgot-password.html`）；註冊頁從方案頁免費方案的「免費註冊」進入；作者個人頁從文章內頁作者卡「查看全部文章」進入。

兩個頁面有**設計稿切換器**（灰色 2px 虛線框，標示「設計稿狀態示意（非產品介面）」），切換時會更新網址參數，重新整理後停在同一個狀態：

```
article.html                    ← 未訂閱（付費牆）
article.html?view=subscribed    ← 已訂閱（沒有付費牆）
account.html                    ← 讀者
account.html?role=author        ← 作者
account.html?role=admin         ← 管理員
```

其他狀態放在相關區塊下方的「設計稿狀態示意」（`.demo-state`，灰色 2px 虛線分隔）。

## 排版語言

同主題 6 套共用內容（區塊、元件、文案、狀態、連結），構圖由各風格決定。這一套的構圖規則如下，新頁面照這裡排，要像「積木牆」的一部分。

### 網格與版心

- **12 欄便當盒網格 `.bento`**：≥ 992px `grid-template-columns: repeat(12, minmax(0, 1fr))`、間距 16px；以下單欄，積木一塊接一塊（間距 12px）。768–991px 需要兩欄的地方（首頁的「為什麼值得訂」、主題、CTA）在頁面 partial 用 `media-breakpoint-only(md)` 改成 2 欄。
- 積木的位置寫在各頁 partial（`grid-column`、`grid-row`），**不做 `.span-*` 工具類別**。
- 容器沿用 Bootstrap 預設（≥ 1400px 為 1320px），左右內距 16px（≥ 992px 24px）。
- 長文 720px；文章內頁 ≥ 1200px 是 `grid-template-columns: minmax(360px, 1fr) 720px`（間距 56px）。
- 1920 寬：頁首、頁尾滿版；內容停在 1320px 置中。頁首的品牌格與會員格底色貼齊視窗兩側，格子裡的字對齊下方內容的左右邊（`--edge`，用頁首自己的 `cqw` 計算，見 `components/_header.scss`）。
- 區塊上下 80px（< 992px 56px）；相鄰的 `.section` 只留一份間距。

### 頁首：一排格子

- 高 72px＋底部 2px `$ink`、sticky。格子之間 2px `$ink` 直線，HTML 順序：品牌格 → 首頁｜文章列表｜訂閱方案 → 搜尋方格 → 會員格。
  - 品牌格：克萊因藍底，「現場筆記」900 白字＋「FieldNotes」Bricolage，寬至少 220px。
  - 導覽 3 格：白底 700 字、左右內距 28px；**目前頁＝黑底白字**；hover＝霧白底。
  - 彈性空白（白）→ 搜尋方格 72 × 72（展開時反黑）→ 會員格活力橘（36px 頭像＋「我的現場筆記」），目前頁（個人頁）黑底白字、頭像外圈橘。
- < 992px：品牌格（內容寬）＋搜尋、會員（橘）、選單（黑）3 個 56px 方格；選單展開是一疊滿寬格子（3 個導覽＋橘色會員格）。
- 搜尋：點方格展開頁首正下方的霧白條，裡面是一條白色搜尋積木（Collapse），送出到 `articles.html`。
- 格子的焦點環畫在格子內側（外 3px 白、內 3px 黑）。
- **sticky 偏移**：頁首 74px＋16px 呼吸＝ `top: 90px`（`$sticky-top-offset`）；< 992px 一律取消 sticky。閱讀進度條（`.reading-bar`）貼在頁首正下方，6px 克萊因藍。

### 頁尾：黑塊

滿版 `$ink` 底：一行超大品牌字「現場筆記」（`clamp(64px, 11vw, 176px)`，旁邊橘色 Bricolage「FieldNotes」）→ 品牌說明（白字，最寬 520px）＋3 欄連結（欄名是橘色小積木標籤；連結白字 700，hover 出現橘色底線）→ 版權列放在滿版活力橘細條上（黑字）。頁尾黑塊之外，不要再做整片滿版的黑色區塊帶。

### 積木與四種底色

- 積木 `.block`：2px `$ink` 框、20px 圓角、實色填滿，內距 40px（< 992px 24px）。填色 `.is-white`、`.is-ink`、`.is-klein`、`.is-orange`，另有 `.is-fog` 與狀態色 `.is-warning`（黃底黑字）、`.is-danger`（紅底白字）、`.is-success`（綠底白字）。
- **每種底色自帶一組反白規則**（`components/_bento.scss` 的 `surface` mixin，用 CSS 自訂屬性往下繼承）：文字、次要字（`var(--fn-muted)`）、連結、主要與次要按鈕、權限徽章、頭像框、分段控制的選中色都會自動換。所以藍積木裡的 `.btn-primary` 會自動變成白底藍字、黑積木裡變成橘底黑字，不用另外寫 class。不是積木的元素要套用同一組規則時，加 `.on-klein`、`.on-ink`、`.on-orange`、`.on-white`。
- 規則：橘底上的字一律 `$ink`（不放灰字）；藍底上的字一律白；橘色永遠不當白底上的字；`$ink-2` 不放在橘或藍上。每個便當盒最多一塊藍積木、一塊橘積木。
- **沒有柔和陰影**。`.shadow-hard`（8px 8px 0）只給付費牆卡與拖曳中的積木；`.shadow-hard-sm`（6px）給下拉選單、插入選單、對話框（Bootstrap 的 `.dropdown-menu`、`.modal-content` 已套用）。
- 線條：所有可見邊界都是 2px `$ink`；推薦積木 4px（月費方案）、選中與目前編輯中 3px `$klein`。表格列分隔才用 1px `$hairline`。
- 虛線只用在兩個地方：編輯器的空行積木、設計稿示意（切換器、`.demo-state`）。

### 卡片造型

- **文章積木** `.article-block`（文章列表、作者個人頁）：每篇一塊獨立積木，左側 12px 權限色條＋2px 黑線（`.is-locked` 藍、`.is-free` 橘；手機改成頂端色條）。≥ 1200px 積木內分左右兩欄（左 5：徽章＋分類、標題、作者；右 7：導言、標籤、資訊列），DOM 順序不變。hover／focus 換霧白底。
- **精簡文章積木** `.mini-block`（首頁精選次要、延伸閱讀）：頂端 12px 權限色條。
- **主題積木** `.topic-block`：整塊是連結，hover／focus 換成藍底白字（只換顏色）。
- 方案卡、數據卡、狀態卡、提示框也都是積木。權限色條只是裝飾，權限仍要有徽章的圖示＋文字。

### 標題階層

- H1、H2 用 Noto Sans TC 900 超大字、左對齊、貼著積木左緣；**H2 下方沒有底線或眉標**，靠字級撐。字級三段（≥ 1200 → 768–1199 → 以下）：各頁 H1 56 → 44 → 34、H2 44 → 36 → 30、H3 24 → 20。首頁 H1 依積木寬度縮放（最大 80px）。
- 區塊標題列 `.section-heading`：左 H2（＋副標）｜右動作按鈕，按鈕和 H2 底邊對齊；副標在 H2 下方佔滿整列。
- 900 只給 H1、H2、列表標題、作者大名；H3 以下 700；內文 400，長文不加粗。
- 長 H1 與標題用 `<wbr>`＋`.text-phrase` 控制斷點（390 寬不能有單字成行）。
- 長文 h2 上方一條 6 × 48px 的 `$orange` 短條（只在 `#article-body`）。

### 招牌元素

1. **便當盒積木**（全站）。
2. **積木區塊編輯器** `.lego-editor`（`account.html#editor`、Guideline 08）：每塊積木 `grid-template-columns: 32px 1fr`，左邊黑色把手欄（白色 `grip-vertical`，常駐顯示）；左上 28px 方形類型標記（只有圖示、`aria-hidden`）；被選取的段落 3px `$klein` 框＋上方黑色浮動工具列；免費預覽分隔線是一整塊橘色積木（兩端黑色方形把手、中央鎖頭＋文字、右側黑底「2,200 字」）；空行積木是 2px 虛線框＋40px 藍色「＋」鈕；插入選單是白色調色盤積木（6px 硬陰影）。Guideline 另畫一個拖曳中的靜態示範（`translate(6px, -6px) rotate(-1.5deg)`＋8px 硬陰影＋原位置虛線空槽＋4px 藍色插入線），不做真的拖曳。
3. **後台數據與會員狀態對比鮮明**：我的文章 4 張數據卡依序白、黑、藍、橘；內容數據只有「由本篇帶來的訂閱 214 人」是橘積木；訂閱中是巨大藍積木（72px 白色 Bricolage 到期日），其他 3 態並排：已取消待到期黃（`.is-warning`）、已到期白（`.is-white`）、未訂閱霧白（`.is-fog`）；扣款失敗是下方的紅色提醒積木；漏斗是 4 條等比例的克萊因藍橫條（40px 粗、直接標數字）。

### 各頁構圖（≥ 1200px，做其他頁時照這份）

**首頁**（完成）：Hero 便當盒＝大標積木（白，`1 / 8`，跨 2 列；右下角橘色四分之一圓）｜引文積木（藍，`8 / 13`，橘色大引號）＋3 塊數字積木（橘、黑、白）→ 為什麼值得訂：4 塊等高積木黑白交錯，每塊 56px 橘色圓底圖示 → H3 → 說明 → 主題：6 塊白積木寬度不等（5｜4｜3、6｜3｜3），hover 換藍 → 本週精選：一整條海報積木（左 7 封面｜右 5 橘底內容）＋3 塊精簡文章積木 → 作者牆黑積木（`1 / 9`，6 格一列）＋2 塊評價積木｜保障藍積木（`9 / 13`，跨兩列，3 段白線分隔）→ CTA 兩塊積木（左 7 橘＋藍色半圓、右 5 白）。

**文章列表**（完成）

- 版頭：麵包屑 → H1 56px → 說明 → 搜尋（64px 高、2px 框、12px 圓角的輸入框，右側接黑底白字「搜尋」按鈕，最寬 760px）。
- 篩選板（一排 4 塊積木，不 sticky）：最上方一列「篩選」標題＋「清除篩選」文字按鈕；主題分類（白，4 欄：8 個胖 radio 方塊排 2 欄，選中黑底白字）、熱門標籤（橘，4 欄：10 個白底黑框 `.tag`，選中黑底白字）、閱讀權限（白，2 欄：3 個 radio 列，附權限徽章）、閱讀時間（黑，2 欄：3 個 checkbox 列，白字）。
- 工具列：排序 `.nav-blocks`＋右側「顯示 1–8 篇」→ 8 塊 `.article-block`（單欄滿寬、間距 12px）→ 48px 方塊分頁（目前頁藍底）→ S09、S10 示意。
- 手機：「篩選條件（3）」黑色滿寬按鈕開 Offcanvas（bottom），裡面是 4 塊堆疊的篩選積木＋「清除篩選」「套用」；排序分頁籤放不下一排就換行（`.nav-blocks.is-wrap`，不橫向捲動）；文章積木色條改到頂端。**不要做成左側篩選欄**（那是 01、04）。

**文章內頁**（完成）

- 第一列：麵包屑（左）＋設計稿切換器（右）→ 兩欄 `minmax(360px, 1fr) 720px`、間距 56px。
- 左欄（DOM 在前）：**標題海報積木**（藍底白字，不 sticky）：權限徽章（藍積木裡自動白底藍字）＋分類＋標籤（白框小牌）→ H1 白字 40px／1.3 → 導言 19px `$on-klein-muted` → 作者列（48px 頭像白框、姓名、職稱｜日期｜閱讀時間）→ 工具列（白框按鈕：收藏、分享帶字；Aa、閱讀模式只有圖示）。下面是 sticky 群組（`top: 90px`）：黑色目錄積木（「本篇目錄」＋5 項，前面 Bricolage 橘色編號 1–5；目前項白底黑字；鎖住的項目鎖頭＋`$on-ink-muted`）→ 橘色進度積木（「閱讀進度」＋Bricolage 32%＋`.read-progress`（橘積木裡自動黑色填色）＋資訊列）→ 白色字級積木（`.segmented`）。
- 右欄：長文（白底黑字；h2 上方橘色短條；引言左側 8px 藍條；損益表 2px 框、黑表頭、合計列 `$klein-tint`）→ 未訂閱：140px 漸層到白＋付費牆卡（白底、3px 框、`.shadow-hard`；頂端 56px 橘帶放進度條與「已免費讀完 32%」；標題 28px 900；兩個 `.radio-card`；藍色滿寬「訂閱並繼續閱讀」；登入連結；信任小字；替代入口小字）→ 文末：作者卡積木（64px 頭像橘框、追蹤按鈕）、標籤、延伸閱讀 3 塊 `.mini-block` 單欄、讀者回應（留言框是 2px 框積木，未訂閱停用時 `$fog` 底；作者回覆是縮排的藍框積木＋「作者」藍底徽章）→ S14 示意。
- 992–1199px：海報改成長文上方的滿版藍色帶（內容 ≤ 720px 置中），目錄改成海報下方可展開的黑積木（Collapse）。手機：藍色帶 → 可展開目錄 → 長文；底部固定行動列是一條黑積木（4 格、2px 白線分格、圖示＋文字）。

**訂閱方案**（完成）

- 版頭便當盒：標題積木（白，`1 / 9`：麵包屑、H1 64px、副標）＋計費積木（黑，`9 / 13`：白字標籤、`.segmented` 選中自動橘底黑字、下方預留一行省錢提示，用 `visibility` 切換）。
- 3 塊等高方案積木：免費（白）、月費（藍、**4px 框**，左上壓一個傾斜 -4° 的橘色「★ 最多人選」貼紙，不放大積木）、年費（黑，「省 NT$ 360」橘色小牌）。價格 Bricolage 64px；✓ 在白積木是藍色 `check-lg`、藍積木白、黑積木橘；✗ 是灰 `x-lg`＋`var(--fn-muted)`；按鈕貼底，被強調的那顆 `.btn-primary`、另一顆 `.btn-outline-secondary`，顏色依積木底色自動反白。
- 比較矩陣：2px 框 20px 圓角（`overflow: hidden` 只包表格外框，手機的捲動容器另外一層）；表頭黑底白字、月費表頭藍底、月費欄 `$klein-tint`；✓ 是 20px 藍色實心圓勾＋「有」，✗ 是灰框圓叉＋「無」。
- 結帳：付款積木（白，`1 / 8`：4 個付款方式 `.radio-card` 2 × 2、卡號欄位、同意 checkbox，下方付款三態示意）｜摘要積木（橘，`8 / 13`，sticky `top: 90px`：明細、嵌在裡面的黑積木「下次扣款」＋白色 Bricolage 48px 日期與說明、本次應付、藍色滿寬「確認付款 NT$ 1,800」、信任小字）。
- FAQ：左 4 欄橘積木放 H2（sticky）｜右 8 欄 6 條問答積木（2px 框、16px 圓角、72px 高的問題列、右側 40px 黑方塊＋號；展開時問題列藍底白字、黑色＋方塊換成白底藍色 ×）。
- 手機：依序堆疊（貼紙不能被裁）；矩陣橫向捲動、首欄凍結、上方一句提示。

**個人頁面**（完成）

- 版頭（麵包屑、H1 56px｜右側設計稿切換器）→ 兩欄（左 300px sticky `top: 90px`｜右內容便當盒）。
- 左：個人積木（白：48px 頭像、陳柏諺、`.status-badge.is-brand`「年費訂閱中」）→ **權限群組積木**由上而下：閱讀（白）、創作（藍，右上「作者可見」）、平台管理（橘，右上「管理員可見」）、帳號（黑）；讀者另有一塊 2px 虛線框的申請積木（「你也在某個行業的現場嗎？」＋「申請成為作者」）。項目 44px 一列；目前項目在白積木上黑底白字、在彩色積木上白底黑字。角色標記用 `.role-chip`（和產品徽章區隔）。
- 右：我的訂閱（訂閱中藍積木 `1 / 8`＋白積木 `8 / 13`；其他 3 態積木並排：已取消待到期黃（`.is-warning`）、已到期白（`.is-white`）、未訂閱霧白（`.is-fog`）；提醒 2 塊（扣款失敗紅、即將到期黃）；取消對話框靜態版；訂閱紀錄表）→ 我的收藏（`.nav-blocks` → 3 塊收藏積木＋`.read-progress`：進行中藍、`.is-done` 綠、`.is-unstarted` 空軌）→ 追蹤的作者（`.empty-state` 積木）→ 我的文章（4 張數據卡依序白、黑、藍、橘 → 分頁籤 → 2px 框資料表）→ 撰寫新文章（積木編輯器 8｜設定積木 4）→ 內容數據（4 張只有「由本篇帶來的訂閱 214 人」是橘積木；漏斗是 4 條等比例的克萊因藍橫條）→ 平台管理 → 成為作者（申請表白積木 7｜狀態積木 5：審核中黃、已通過綠底白字、未通過紅底白字）→ 帳號設定（2 塊白積木）。
- 手機：側欄改成內容上方的黑色下拉按鈕（顯示目前區塊名稱），展開後是同樣的彩色群組積木。

**登入、註冊、忘記密碼**（完成，3 頁共用 `pages/_auth.scss`）

- 登入：12 欄，左 `2 / 8` 是**積木塔**（間距 0，積木之間共用 2px 框）：① 橘積木：H1「登入」64px＋說明，右上角一個 56px 黑色方形類型標記（只有圖示、裝飾，呼應積木編輯器的類型標記：登入 `box-arrow-in-right`、註冊 `person-plus-fill`、忘記密碼 `key-fill`）② 白積木：表單（56px 高的輸入框與主要按鈕；「忘記密碼？」在密碼標籤同列靠右、藍色滿寬「登入」），向右錯開 16px（`margin-left: 16px; margin-right: -16px`，寬度不變，不用 transform）③ 矮的黑積木：「還沒有帳號？免費註冊」白字、白色底線連結。右 `9 / 13`：兩塊設計稿示意積木由上而下（`.demo-state.auth-demo`：2px 灰色虛線框、20px 圓角，裡面是標籤、標題、設計說明與提示框）。
- 註冊：左 `1 / 7` 積木塔（橘 H1「免費註冊」→ 白表單 → 黑切換連結）＋下方欄位錯誤示意｜右 `8 / 13` 免費會員權益積木（白底、2px `$hairline` 框、不加填色與陰影，層級低於表單：h2「免費會員」、Bricolage NT$ 0、適合、✓ 藍／✗ 灰清單、「比較所有方案」）。
- 註冊頁的欄位錯誤示意：欄位重畫一份在白積木裡（id 加 `Demo` 後綴、不包 `<form>`），4 則錯誤同時出現，錯誤文字是紅色圖示＋黑字。
- 忘記密碼：左 `1 / 7` 積木塔（橘「忘記密碼」→ 白表單 → 黑「返回登入」）｜右 `8 / 13` 3 塊示意積木由上而下（重設信已寄出：白積木＋56px 綠色 `envelope-check` 方塊；設定新密碼：白積木表單，真的能送出到 `login.html`；連結已失效：`.callout.is-danger`），積木間距 12px。3 塊示意比塔高很多，≥ 992px 塔 sticky（`top: 90px`），捲動看示意時表單一直在旁邊。
- 手機：塔滿寬、不錯開 →（註冊頁的權益積木）→ 示意。

**作者個人頁**（完成）：麵包屑 → **作者海報**（藍積木、滿容器寬、內距 56px；≥ 768px 兩欄：96px 頭像 3px 白框｜H1「陳柏諺」72px 白字＋橘底黑字「認證作者」（`patch-check-fill`）→ 職稱（`$on-klein-muted`）→ 簡介（最寬 640px）→ 追蹤按鈕（白底藍字；已追蹤橘底黑字，兩種文字同寬 160px）；≥ 1200px 追蹤按鈕排到海報右下角，平衡海報右半邊）→ 標題列（H2「陳柏諺的文章」｜「顯示 1–6 篇，共 18 篇」）→ 6 塊文章積木（不顯示作者列、不放縮圖、標題 h3）→ 分頁 → 空狀態示意。手機：海報內 64px 頭像與姓名、徽章、職稱橫排，簡介與追蹤在下。

**Guideline**：版頭是一個便當盒，白色標題積木 7｜藍色概念積木 5，下面 3 塊招牌積木 4｜4｜4（黑、橘、白，各連到「便當盒積木」「積木區塊編輯器」「訂閱狀態」那一節）。本體 ≥ 1200px 是左 240px sticky 目錄（一疊 12 塊小積木，目前節黑底白字＋橘色編號）｜右內容；< 1200px 目錄改成內容上方橫向捲動的方塊列（不 sticky）。12 節：色彩、字級、長文排版、間距與格線、圓角線陰影、元件狀態、內文元素、主題專屬元件（付費牆、閱讀進度、方案、訂閱狀態、作者申請、角色、文章 3 態、角色三欄、積木編輯器）、數據圖表、S01–S22 狀態文案、RWD、Do／Don't。色票做成色塊積木（色塊本身就是積木，寫 hex、角色、對比度）；四種底色的按鈕、徽章與連結各放在一塊積木裡並排；漏斗深色示範放在黑積木裡（橫條 `$sky-on-ink`、字白）；08 ⑨ 放積木編輯器與「拖曳中」示範。

### 各寬度怎麼收合

- **1920**：頁首、頁尾滿版，內容停在 1320px 置中；品牌格與會員格的底色貼齊視窗兩側，格子裡的字對齊內容左右邊。
- **1200–1919**：12 欄便當盒；數字積木的數字依積木寬度縮放（1200–1399 約 40px）。
- **992–1199**：便當盒仍是 12 欄；為什麼值得訂 2 × 2；主題 3 塊等寬一列（兩列）；作者牆 4 格一列；首頁 H1 依積木寬度縮小。
- **768–991**：頁首換成 56px 格子＋選單；便當盒單欄，只有為什麼值得訂、主題、CTA 改 2 欄；數字積木 3 格一列；主推海報封面在上、橘色內容在下；作者牆在黑積木內橫向捲動。
- **390**：全部單欄（間距 12px、積木內距 24px）；H1 約 37px、3 行；按鈕上下排；數字積木保持 3 格一列（數字約 28–32px）；作者牆橫向捲動；CTA 上下排。

### 動態

- 要做：按鈕與可點積木**按下**時 `translate(2px, 2px)`（`:active`，不是 hover）；主題積木、文章積木 hover／focus 換底色（120ms）；FAQ 展開時＋換成 ×（換圖示，不做旋轉動畫）；閱讀進度條。編輯器空行的文字游標是靜態的藍色細條，不閃爍。
- 不做：hover 上移、hover 加大或出現陰影、計數動畫、跑馬燈、色塊閃爍、真的拖曳。
- `prefers-reduced-motion: reduce`：拿掉 `:active` 位移與所有 transition（`_base.scss` 最後一段）。

### 不要做的事

- 大片純白＋1px 細線＋小字留白（那是 01 打字機）；細線分欄、襯線字、藍色只當線條（那是 03 智庫）。05 的邊界一律 2px、積木一定有圓角與填色。
- 每張卡都加硬陰影（會變成廉價的新粗獷風）。
- 7 : 5 首屏、容器內 3 : 9 左篩選＋分隔線列表、8 : 4 右側目錄（那是 wireframe 原樣與 01、04 的構圖）。

## 檔案結構

```
05-salon-style/
├─ *.html                    ← 10 個頁面，每頁完整包含頁首與頁尾
├─ templates/page.html       ← 頁面骨架：新增頁面從這裡複製（開頭註解寫目前頁規則）
├─ css/
│  ├─ style.css              ← 編譯結果（Bootstrap＋Icons＋本風格樣式），要提交
│  └─ fonts/                 ← Bootstrap Icons 字型（npm run vendor 複製）
├─ js/
│  ├─ main.js                ← 設計稿切換器、閱讀進度、字級、月／年切換、文章篩選等小功能
│  └─ vendor/bootstrap.bundle.min.js
├─ images/                   ← 作者頭像 8、文章封面 8、內文配圖 1（AI 生成，硬光高對比）、favicon.svg
├─ scss/
│  ├─ main.scss              ← 樣式進入點（載入順序見下方）
│  ├─ _variables.scss        ← ★ Design token：Bootstrap 變數覆寫
│  ├─ _base.scss             ← 全站基礎、按鈕、表單、分頁籤、分段控制、選項卡、標籤、焦點、空狀態、設計稿切換器與狀態示意
│  ├─ components/            ← 便當盒與積木、頁首、頁尾、徽章、頭像、卡片、閱讀進度、提示框、長文、付費牆、方案、訂閱狀態、數據、積木編輯器
│  └─ pages/                 ← 各頁專屬樣式（class 加頁面前綴），共 8 個：_home、_articles、_article、_pricing、_account、_auth（登入、註冊、忘記密碼共用）、_author、_guideline
└─ scripts/
   ├─ copy-vendor.mjs        ← 把 Bootstrap JS 與圖示字型從 node_modules 複製進專案
   ├─ check-layout.mjs       ← 檢查各頁的 head、頁首、頁尾是否與範本一致，以及頁首目前頁標示
   └─ generate-images.mjs    ← 生圖腳本（STYLE 與 17 張圖的 prompt）
```

## 沒有打包工具時的工作方式

- **頁首、頁尾每頁一份**：先改 `templates/page.html`，再同步到每一頁，最後執行 `npm run check`。每頁只有一處不同：頁首的目前頁。目前頁的連結一律寫成 `class="nav-link active"` 或 `class="site-member active"`（`check-layout.mjs` 依這個寫法比對）：
  - `index.html` → 首頁、`articles.html` → 文章列表、`pricing.html` → 訂閱方案：加 `active`＋`aria-current="page"`。
  - `account.html` → 桌機的 `<a class="site-member">` 與選單裡的「我的現場筆記」`<a class="nav-link">`（外層 `<li class="site-nav-member">` 讓它變橘格）：加 `active`＋`aria-current="page"`。
  - `article.html`、`author.html` → 文章列表只加 `active`，不加 `aria-current`。
  - `guideline.html`、`login.html`、`register.html`、`forgot-password.html` 不標示。
- **`<body>` 的屬性**：`article.html` 是 `data-view="unsubscribed"`，`account.html` 是 `data-role="reader"`；元素寫 `data-show-view="subscribed"`、`data-show-role="author admin"`，`_base.scss` 依 body 屬性隱藏不屬於目前狀態的元素。
- **假資料直接寫在 HTML**：文案全部逐字取自主題層的 `CONTENT.md`，跨頁要一致的數字見 `_wireframe/WIREFRAME_SPEC.md` §2.9。
- **JS**（`js/main.js`，選擇器與用法寫在檔案註解）：
  1. 設計稿切換器 `[data-switcher="view|role"]`＋`button[data-value]`。
  2. 閱讀進度 `.reading-bar`（`--p`、`aria-valuenow`）與目錄目前章節 `#toc a[href^="#sec-"]`，文章主體是 `#article-body`。
  3. 字級 Aa：`input[data-prose-size="sm|md|lg"]` 切換 `[data-prose]` 的 `.prose-sm／md／lg`。
  4. 月／年切換：`input[name="billing"]`、`.billing-note`（`.is-visible` 切換）、`[data-plan-btn="monthly|yearly"]` 在 `.btn-primary` 與 `.btn-outline-secondary` 之間交換；兩種按鈕的顏色會依所在積木自動反白，不用另外處理。
  5. 作者文章狀態篩選：`[data-filter-list]` 裡的 `[data-filter]` 對應資料列 `[data-status]`。
  6. 其他：搜尋列展開後聚焦、分頁籤橫向捲動時把目前項目捲進畫面、收藏與追蹤的 `[data-toggle-pressed]`、閱讀模式 `[data-reading-mode]`（`body.is-reading-mode`）。
- **換行與空白**：標題的詞組斷點用 `<wbr>` 標出並加 `.text-phrase`；數字與單位之間用 `&nbsp;`。
- **表單**：搜尋用 `<form action="articles.html">`（`name="q"`）。登入、註冊、忘記密碼用 `<form action="目的頁">` GET 換頁，密碼與 Email 欄位不加 `name`。

## 樣式架構

`scss/main.scss` 的載入順序：Bootstrap 函式 → `_variables.scss` → Bootstrap 本體 → Bootstrap Icons → `_base.scss` → `components/*`（`_bento` 第一個）→ `pages/*`。新增元件或頁面時，在 `main.scss` 對應段落加一行 `@import`。原則是先用 Bootstrap 的變數與工具類別，做不到才寫自訂 CSS，自訂 CSS 只引用變數，不寫死色碼。

### 共用類別

| 類別 | 用途 | 位置 |
|---|---|---|
| `.bento` | 12 欄便當盒網格（≥ 992px），以下單欄；積木位置寫在頁面 partial | `components/_bento.scss` |
| `.block`（`.is-white`、`.is-ink`、`.is-klein`、`.is-orange`、`.is-fog`、`.is-warning`、`.is-danger`、`.is-success`）、`.block-tight` | 積木：2px 框、20px 圓角、實色填滿、內距 40／24px；`.block-tight` 內距 24／20px（數字積木這類小塊） | `components/_bento.scss` |
| `.on-white`、`.on-ink`、`.on-klein`、`.on-orange` | 不是積木的元素套用某種底色的反白規則（頁首品牌格、頁尾、提示框等） | `components/_bento.scss` |
| `surface-white`、`surface-ink`、`surface-klein`、`surface-orange`（mixin） | 在 SCSS 裡讓某個元素變成某種底色（例如 `.topic-block:hover { @include surface-klein; }`） | `components/_bento.scss` |
| `var(--fn-muted)`、`var(--fn-fg)`、`var(--fn-bg)`、`var(--fn-ring)` | 依所在底色變化的次要字、文字、底色、頭像框色；元件裡的次要字一律用 `var(--fn-muted)` | `components/_bento.scss` |
| `.block-link` | 整塊可點的積木（`<a>`）：hover 只換顏色，按下位移 2px | `components/_bento.scss` |
| `.shadow-hard`、`.shadow-hard-sm` | 8px／6px 硬陰影（只給付費牆、拖曳中的積木／選單、對話框） | `components/_bento.scss` |
| `.deco-shape` | 幾何裝飾的定位底（只在首頁 Hero 與 CTA） | `components/_bento.scss` |
| `.section`、`.section-sm`、`.section-heading`（`.section-heading-action`） | 區塊上下 80／56px；標題列（左 H2＋副標、右動作按鈕） | `_base.scss` |
| `.page-header`、`.page-lead`、`.page-body` | 首頁以外各頁的版頭（麵包屑 → H1 → 說明）、頁面主體底部留白 | `_base.scss` |
| `.figure-num`、`.num`、`.text-note`、`.text-phrase`、`.text-black-900` | Bricolage 大數字；表格數字（Noto 500＋tabular-nums）；小字；詞組換行；900 字重 | `_base.scss` |
| `.btn-primary`、`.btn-outline-secondary`、`.btn-dark`、`.btn-accent`、`.btn-text`、`.btn-icon` | 主要（依底色反白）、次要（依底色反白）、黑底白字、橘底黑字、文字按鈕、44px 方形圖示按鈕；`.btn-lg` 56px、預設 48px、`.btn-sm` 44px | `_base.scss` |
| `.nav-blocks`（`.nav-link`、`.tab-count`、`.is-wrap`） | 方塊分頁籤（排序、收藏、我的文章、審核佇列）：選中黑底白字，手機橫向捲動；`.is-wrap` 改成放不下就換行（3～4 顆時用）；也支援 `.btn-check`＋`label.nav-link`（文章列表排序） | `_base.scss` |
| `.segmented`（`.segmented-sm`） | 分段控制（月／年、字級、付費層級、數據期間），內放 `.btn-check`＋`.btn`；選中色依底色（白積木黑底、黑積木橘底、藍積木白底） | `_base.scss` |
| `.radio-card` | 整張可點的 radio 卡（付費牆方案、付款方式）：選中藍底白字＋右上勾勾 | `_base.scss` |
| `.tag`、`.tag-list` | `#標籤` 方角小牌：一般、選中（`.is-active` 或 `.btn-check:checked`）、0 篇（`.is-empty`） | `_base.scss` |
| `.form-control-lg`、`.form-label-optional`、`.form-count`、`.invalid-feedback` | 64px 大搜尋框、「選填」、字數提示、錯誤文字（紅色圖示＋黑字） | `_base.scss` |
| `.pagination`（`.page-link-text`） | 48px 方塊分頁，目前頁藍底白字；上一頁／下一頁的文字包在 `.page-link-text`，< 576px 只留箭頭（文字改成螢幕閱讀器才讀） | `_base.scss` |
| `.empty-state`、`.empty-state-icon` | 空狀態：56px 霧白方塊圖示＋一句說明＋一個按鈕 | `_base.scss` |
| `.scroll-x`、`.img-cover` | 橫向捲動容器、滿版裁切圖片 | `_base.scss` |
| `.design-switcher`、`.role-chip`、`.demo-state`（`-tag`、`-title`、`-stage`） | 設計稿專用：切換器、「作者可見」標記（1px 虛線小字）、狀態示意區塊（2px 灰色虛線） | `_base.scss` |
| `.site-header`、`.site-cells`、`.site-brand`、`.site-cell`（`-member`、`-menu`）、`.site-nav`、`.site-nav-member`、`.site-member`、`.site-search-panel`、`.site-search` | 頁首格子列 | `components/_header.scss` |
| `.site-footer`、`.site-footer-main`、`.site-footer-brand`（`-word`、`-en`）、`.site-footer-lead`、`.site-footer-title`、`.site-footer-links`、`.site-footer-strip`、`.site-footer-copy` | 頁尾黑塊 | `components/_footer.scss` |
| `.perm-badge`（`.is-locked`、`.is-free`、`.is-draft`、`.is-removed`） | 權限徽章：2px 框方角小牌，訂閱限定藍底白字、免費橘底黑字（藍、橘積木裡自動反白） | `components/_badges.scss` |
| `.status-badge`（`.is-success`、`.is-warning`、`.is-danger`、`.is-info`、`.is-brand`、`.is-accent`、`.is-neutral`、`.is-muted`） | 狀態徽章：2px 框方角小牌＋圖示＋文字，填色依狀態 | `components/_badges.scss` |
| `.avatar`（`-xs` 24、`-sm` 32、`-md` 40、`-lg` 48、`-xl` 64、`-xxl` 96）、`.avatar-initial`、`.author-line`（`-name`、`-meta`） | 頭像（正圓＋2px 框，框色依底色）、字首頭像（藍淡底藍字）、作者列 | `components/_avatar.scss` |
| `.card-kicker`、`.card-kicker-link`、`.meta-line`（`.meta-line-flow`、`.meta-line-wrap`） | 「權限徽章＋分類」列、「‧」資訊列（`-flow`：只有第一項可換行，其餘黏在一起；`-wrap`：每一項不斷行，「‧」接在前一項後面，換行時留在行尾，文章列表 3 項以上的資訊列用） | `components/_cards.scss` |
| `.perm-stripe-left`、`.perm-stripe-top`（搭配 `.is-locked`／`.is-free`） | 12px 權限色條（背景漸層畫，跟著圓角） | `components/_cards.scss` |
| `.topic-block`（`-icon`、`-title`、`-text`、`-meta`） | 主題積木：hover／focus 換藍底白字 | `components/_cards.scss` |
| `.mini-block`（`-title`、`-author`） | 精簡文章積木：頂端權限色條 | `components/_cards.scss` |
| `.article-block`（`-head`、`-body`、`-title`、`-lede`） | 文章積木：左側權限色條（手機頂端），≥ 1200px 內分 5 : 7 兩欄 | `components/_cards.scss` |
| `.article-stack`、`.meta-line .is-preview` | 文章積木的堆疊（單欄滿寬、間距 12px）；資訊列的「免費預覽前 N 字」（克萊因藍粗字）。文章列表與作者個人頁共用 | `components/_cards.scss` |
| `.cover-frame` | 積木裡的封面圖（被積木圓角裁切） | `components/_cards.scss` |
| `.reading-bar`、`.read-progress`（`.is-done`、`.is-unstarted`、`.is-lg`） | 頁首下方 6px 閱讀進度；卡片與付費牆內的 2px 框進度條（`--p` 控制長度） | `components/_progress.scss` |
| `.callout`（`.is-info`、`.is-success`、`.is-warning`、`.is-danger`、`.is-brand`）、`.callout-icon`、`.callout-body`、`.callout-title`、`.callout-action` | 提示框：2px 框、12px 圓角、左側 8px 色條；資訊不用藍，品牌強調是藍底白字 | `components/_callout.scss` |
| `.lede`、`.prose`（`.prose-sm`、`.prose-md`、`.prose-lg`）、`.prose-table`、`.prose-table-scroll` | 長文：720px、18px／1.85、h2 上方橘色短條、引言藍條、損益表（黑表頭、合計列藍淡底）；Aa 三段字級 | `components/_prose.scss` |
| `.paywall`（`-teaser`、`-band`、`-band-text`、`-body`、`-title`、`-text`、`-plans`、`-login`、`-trust`、`-alt`）、`.plan-option-name`、`.plan-option-price`、`.save-tag` | 付費預覽牆：殘句淡出＋白底 3px 框硬陰影卡、頂端橘帶（進度＋已免費讀完 32%）、月／年 `.radio-card` | `components/_paywall.scss` |
| `.plan-block`（`.is-recommended`）、`.plan-sticker`、`.plan-name`、`.plan-price`（`-currency`、`-num`、`-unit`）、`.plan-fit`、`.plan-features`（`.is-yes`、`.is-no`）、`.plan-btn` | 方案積木：免費白、月費藍＋傾斜橘貼紙、年費黑，按鈕貼底 | `components/_plans.scss` |
| `.compare-frame`、`.compare-scroll`、`.compare-hint`、`.compare-table`（`.cell-yes`、`.cell-no`、`.cell-na`） | 權益比較矩陣：2px 框、黑表頭、月費欄藍淡底、手機首欄凍結橫向捲動 | `components/_plans.scss` |
| `.sub-main`、`.sub-hero`（`-label`、`-date`、`-remain`）、`.sub-detail`、`.sub-dl`、`.sub-states`、`.sub-state`（`-title`、`-text`） | 訂閱狀態：訂閱中藍積木＋白色明細積木；其他狀態一排 3 塊（已取消待到期黃、已到期白、未訂閱霧白） | `components/_subscription.scss` |
| `.notice-block`（`-icon`、`-body`、`-title`、`-quote`）、`.cancel-dialog`（`-icon`、`-title`、`-text`、`-note`）、`.equal-actions` | 提醒積木（扣款失敗紅、即將到期黃、成為作者綠）、取消自動續訂對話框（靜態示意與 `#cancelModal` 共用）、兩顆一樣寬的按鈕（放不下兩欄時上下排） | `components/_subscription.scss` |
| `.stat-grid`、`.stat-block`、`.stat-label`、`.stat-value` | 數據卡：小字標籤＋Bricolage 大數字（依積木寬度縮放）＋單位 | `components/_data.scss` |
| `.data-table`（`.is-compact`）、`.table-actions`、`.table-title`（`.is-removed`）、`.user-cell` | 資料表：2px 框積木、黑表頭、數字欄靠右；`.is-compact` 給欄位多的表格（窄留白、標題與備註可換行、操作可上下排，≥ 1200px 不用捲動） | `components/_data.scss` |
| `.funnel`（`-title`、`-sub`、`-row`、`-label`、`-track`、`-bar`、`-value`、`-rate`） | 閱讀漏斗：4 條同色克萊因藍橫條（`--w` 控制長度），右側直接標數字 | `components/_data.scss` |
| `.lego-editor`、`.lego-block`、`.lego-grip`、`.lego-type`、`.lego-body`、`.lego-selected`、`.lego-toolbar`、`.lego-divider`（`-main`、`-grip`、`-label`、`-hint`、`-count`）、`.lego-placeholder`、`.lego-plus`、`.lego-menu`（`-group`、`-item`）、`.lego-footer`、`.autosave`、`.check-list` | 積木區塊編輯器：黑色把手欄、類型標記、選取藍框＋黑色浮動工具列、橘色免費預覽分隔線積木、虛線空行、插入選單、底部操作列 | `components/_lego-editor.scss` |
| `.editor-settings-head`、`.editor-settings-body`、`.settings-field`、`.settings-label`、`.settings-value`、`.settings-progress`、`.settings-cover`、`.tag-removable`、`.tag-add` | 編輯器右側的文章設定積木 | `components/_lego-editor.scss` |
| `.dropdown-menu`、`.modal-content`、`.offcanvas`、`.offcanvas-lg`（自動） | 浮層一律套白底反白規則（在藍、黑積木裡打開也是白底黑字） | `components/_bento.scss` |
| `.auth-grid`（`.is-login`、`.is-register`、`.is-forgot`）、`.auth-tower`、`.auth-tower-head`、`.auth-mark`、`.auth-title`、`.auth-lead`、`.auth-form-block`、`.auth-form`、`.auth-field`（`-last`）、`.auth-label-row`、`.auth-terms`、`.auth-terms-link`、`.auth-switch`、`.auth-plan`、`.auth-demos`、`.auth-demo`（`-note`）、`.auth-stage`（`-title`、`-lead`）、`.auth-sent-icon`、`.auth-sent-text`、`.auth-resend` | 登入、註冊、忘記密碼：12 欄版面、積木塔（橘 H1 → 白表單（錯開 16px）→ 黑切換）、權益積木、虛線框示意積木 | `pages/_auth.scss` |
| `.author-crumbs`、`.author-poster`（`-avatar`、`-head`、`-title`、`-name`、`-job`、`-bio`、`-follow`）、`.author-follow`、`.author-list-head`、`.author-list-count`、`.author-pager` | 作者個人頁：藍色作者海報、追蹤按鈕（海報上白底藍字、已追蹤橘底黑字）、文章標題列 | `pages/_author.scss` |
| `.gl-*` | Guideline 專用：版頭便當盒（`.gl-head`、`-kicker`、`-sign`、`-num`）、目錄（`.gl-layout`、`.gl-toc`、`.gl-toc-link`）、節（`.gl-section`、`-num`、`.gl-principle`、`.gl-sub`、`.gl-caption`）、色票（`.gl-swatches`、`.gl-swatch`，顏色由 `$gl-swatches` 從變數取）、字級列、各頁欄數條（`.gl-cols`、`.gl-col`）、圓角／線／陰影樣本、拖曳中示範（`.gl-dragging`、`.gl-drop-line`）、Do／Don't（`.gl-dodont`、`.gl-dd-pair`） | `pages/_guideline.scss` |
| `.home-*` | 首頁專用（`.home-hero-main`、`.home-quote`、`.home-stats`、`.home-why-grid`、`.home-topics-grid`、`.home-feature`、`.author-wall`、`.home-review`、`.home-guarantee`、`.home-cta` 等） | `pages/_home.scss` |


## Design token 摘要

| 類別 | 設定 |
|---|---|
| 面 | 純白 `$paper #FFFFFF`（頁面底、白積木）、霧白 `$fog #F2F2F2`（表頭、停用、hover 底） |
| 墨黑 | `$ink #0A0A0A`（標題、2px 框、黑積木，對白 19.80:1）、`$ink-text #1F1F1F`（長文，16.48:1）、`$ink-2 #3D3D3D`（次要字，10.86:1）、`$gray-600 #5C5C5C`（placeholder、說明，6.69:1） |
| 克萊因藍 | `$klein #002FA7`（主色：主要按鈕、連結、訂閱限定、藍積木；當字 10.69:1）、`$klein-deep #00217A`（hover）、`$klein-tint #E5EAF6`（推薦欄、選中列）、`$on-klein-muted #C9D4F2`（藍積木上的次要字，7.22:1） |
| 活力橘 | `$orange #FF5A1F`（撞色：橘積木、免費權限、進度、強調數據；橘底上 `$ink` 6.35:1；橘對白只有 3.12:1，不當字）、`$orange-hover #FF7A45`、`$orange-ink #B33E00`（真的需要橘色字時，5.82:1）、`$orange-tint #FFE6DC` |
| 狀態色 | 成功 `$success #0A7D3E`（白字 5.23:1）、提醒 `$warning #FFD23F`（填色，黑字 13.71:1；字色 `$warning-ink #7A5A00`）、錯誤 `$danger #D0103A`（白字 5.50:1）；各配淡底 |
| 黑積木上 | 次要字 `$on-ink-muted #9A9A9A`（7.04:1）、深底圖表 `$sky-on-ink #7FA0FF`（7.90:1） |
| 權限色 | 訂閱限定＝藍底白字＋`lock-fill`；免費＝橘底黑字＋`unlock` |
| Bootstrap 對應 | `$primary: $klein`、`$secondary: $ink`、`$info: $ink`、`$light: $fog`、`$dark: $ink`，另加 `"accent": $orange`；`$headings-color: inherit`（標題跟著積木底色） |
| 字體 | Noto Sans TC 400／500／700／900（全部中文）、Bricolage Grotesque 600–800（數字、價格、到期日、英文品牌）；表格與資訊列數字用 Noto 500＋`tabular-nums` |
| 字級 | 首頁 H1 最大 80px（依積木寬度縮放）、各頁 H1 56／44／34、H2 44／36／30、H3 24／20、列表標題 26／22、介面 16／1.7、導言 20／1.75、引言 21／1.7 |
| 長文 | 720px、18px／1.85、段距 1.3em；Aa 17／18／20px（行高 1.9／1.85／1.8）；h2 28px 上方 6 × 48px 橘色短條 |
| 圓角 | 積木 20px、按鈕與輸入框 12px、徽章 8px、頭像正圓 |
| 線 | 2px `$ink`（全部可見邊界）、4px（推薦）、3px `$klein`（選中）、1px `$hairline #D6D6D6`（表格列分隔，裝飾） |
| 陰影 | 沒有柔和陰影；`$shadow-hard 8px 8px 0 $ink`（付費牆、拖曳中）、`$shadow-hard-sm 6px 6px 0 $ink`（選單、對話框） |
| 間距 | 便當盒 16px（手機 12px）、積木內距 40px（< 992px 24px）、區塊上下 80px（< 992px 56px） |
| 頁首 | 72px 格子＋2px 底線＝ 74px（< 992px 56＋2＝ 58px）；sticky 偏移 `$sticky-top-offset` 90px |
| 焦點 | 2px 白內圈＋3px `$ink` 外圈（白、藍、橘、黑積木上都看得到）；頁首格子畫在內側 |
| 動態 | 按下位移 2px、主題與文章積木 hover 換底色 120ms；`prefers-reduced-motion` 全部關閉 |

完整規範請看 `guideline.html`（12 節：色彩、字級、長文排版、間距與格線、圓角線陰影、元件狀態、內文元素、主題專屬元件、數據圖表、S01–S22 狀態文案、RWD、Do／Don't）。

### 換色時同步檢查

色票的唯一來源是 `_variables.scss`，但下面幾處把數值寫成文字或寫死，改色時要一起檢查：

- [ ] `scss/_variables.scss`：色票（面、墨黑四階、克萊因藍 4 色、活力橘 4 色、狀態色與淡底、`$on-ink-muted`、`$sky-on-ink`）、`$theme-colors`（含 `"accent"`）、語意變數（`$body-*`、`$link-*`、`$input-*`、`$focus-ring-*`、`$focus-ring-double`、`$mark-bg`、`$component-active-*`…）、陰影 `$shadow-hard`／`$shadow-hard-sm`。
- [ ] `guideline.html`：色票的 hex、對比度與等級（AAA／AA／只當裝飾）、用途文字，「底色與字色的搭配」表、「撞色只在面上，不在字上」的 4 組錯誤示範、權限徽章與狀態徽章的對比文字、Bootstrap 主題色與語意變數的對應表。色塊本身的顏色由 `scss/pages/_guideline.scss` 的 `$gl-swatches` 從變數取，不用改。
- [ ] 寫死的 hover 色碼：`components/_bento.scss` 的 `surface` 參數（黑積木次要按鈕 hover `#262626`、紅積木 `#B00D31`、綠積木 `#086A35`）、`components/_lego-editor.scss` 浮動工具列按鈕 hover `#262626`、`pages/_article.scss` 黑色目錄積木的連結 hover `#262626`。
- [ ] 漏斗圖與長條：用 HTML＋CSS 畫（顏色來自 `var(--fn-bar)`，跟著積木底色），全站沒有 inline SVG；改色後確認白積木（`$klein` 橫條）與黑積木（`$sky-on-ink` 橫條、白字）兩種示範的對比，Guideline 09 的數字也要重算。
- [ ] 風格自己的 `README.md`：Design token 摘要。
- [ ] 改了頁首高度（`$site-header-height` 74px、`$site-header-height-sm` 58px）時：`$sticky-top-offset`（90px）與 `html` 的 `scroll-padding-top`，以及用到它們的 sticky 元素（頁首正下方的閱讀進度細條 `.reading-bar`、文章內頁左欄群組、方案頁的結帳摘要與 FAQ 標題積木、個人頁左欄、編輯器的文章設定積木、忘記密碼的積木塔、Guideline 目錄）和 Guideline「間距與格線」寫的數字。
- [ ] `scripts/generate-images.mjs` 的 `STYLE`：整組圖片的色調，換色後重新生圖。
- [ ] `templates/page.html` 與每一頁的 `theme-color`（目前 `#FFFFFF`，＝`$paper`），以及 `images/favicon.svg` 裡的色碼（`#002FA7` `$klein`、`#FF5A1F` `$orange`、`#0A0A0A` `$ink`、`#FFFFFF` `$paper`）。

## 圖片

`images/` 的 17 張圖（作者頭像 8、文章封面 8、內文配圖 1）以 AI（Codex CLI 的 image_generation）生成，僅供課程示意，檔名與主題層 [`../IMAGES.md`](../IMAGES.md) 一致。調性是當代雜誌封面的硬光或直打閃光：乾淨的深黑與亮白、飽和但自然的色彩，陰影帶一點鈷藍，橘色只出現在場景本來就有的東西（水果、安全背心、暖燈），構圖簡單、主體四周留白。頭像在頁面上是正圓＋2px 框；封面放進積木時被積木圓角裁切。沒有照片的人（作者牆後 4 位、讀者、申請者、@deal_hunter_99）用 CSS 字首頭像（`.avatar-initial`）。`favicon.svg` 是手繪的三塊便當盒積木（藍、橘、黑）。

生圖腳本與所有 prompt 在 `scripts/generate-images.mjs`（原始 PNG 暫存在系統暫存資料夾的 `fieldnotes-salon-raw-images/`；頭像 1024 → 600 × 600；封面 1536 × 1024 → 中央裁成 1536 × 806 → 1200 × 630；配圖中央裁成 1536 × 864）：

```bash
npm run images                                                      # 產生缺少的圖片
node scripts/generate-images.mjs --only avatar-chen,cover-caseload  # 只重做指定的圖
node scripts/generate-images.mjs --force                            # 全部重做
```

## 和設計方向的差異

實作首頁時，依實際寬度調整了幾處（其他照設計方向）：

- 首頁 H1 是**三行**（「想弄懂一個行業，／問在裡面工作的人／最快。」）而不是兩行：80px 時大標積木（7 欄）一行只放得下 8 個字。字級改用 `clamp(34px, 12.2cqi, 80px)` 依積木寬度縮放，1440 寬約 78px，390 寬約 37px，保證每段 8 個字不溢出。
- 「為什麼值得訂」在 992–1199px 排成 2 × 2（4 欄時標題會剩一個字成行）；主題積木在 992–1199px 改成 3 塊等寬一列（3 欄寬的積木放不下「最新更新 2026/09/28」）；作者牆在 992–1199px 4 格一列（6 格時職稱會斷行）。
- 數字積木的數字依積木寬度縮放（`clamp(28px, 40cqi, 48px)`），992–1399px 的 3 格很窄，固定 48px 會撐出積木。
- 保障藍積木跨兩列、比內容高，3 項保障平均分成 3 段，段與段之間 2px 白線。
- 四種底色的反白規則做成 `surface` mixin＋CSS 自訂屬性（放在 `components/_bento.scss`），`.block.is-*` 與 `.on-*` 共用，巢狀的積木（例如橘積木裡的黑積木）也會正確反白。

實作文章列表、文章內頁、訂閱方案、個人頁面時的調整：

- 文章內頁 1200–1399px 的版心（1092px）放不下 360＋56＋720，改成左欄 `minmax(0, 1fr)`｜長文 680px（規格下限）、間距 40px；海報 H1 縮到 32px，在 `<wbr>` 處斷成 4 行，冒號不會跑到行首。≥ 1400px 照原設計（360 以上｜720、間距 56px）。
- 文章列表的排序分頁籤、個人頁「我的文章」與「申請狀態」的分頁籤只有 3～4 顆，手機改成換行（`.nav-blocks.is-wrap`），不做橫向捲動，避免最後一顆被切一半；收藏分頁籤維持原本的橫向捲動。
- 文章列表手機版的分頁只留箭頭（「上一頁／下一頁」文字改成螢幕閱讀器才讀）並收起第 3 頁，維持一列；資訊列改用 `.meta-line-wrap`，換行時「‧」留在行尾。
- FAQ 展開時不把＋號轉 45°，直接換成白底藍色 × 圖示（方塊本身不動）。
- 結帳付款方式 < 576px 改成一欄 4 個（2 × 2 時「Apple Pay」會斷行）。
- 「變更方案／取消自動續訂」兩顆按鈕寬度相同，放不下兩欄（1200–1399px 的明細積木）時改成上下排，按鈕字不換行。
- 個人頁「其他訂閱狀態」的未訂閱積木用霧白（`.is-fog`），不是方向說明寫的白積木：已到期與未訂閱都是「免費會員」、按鈕也都是藍色，兩塊都白時只剩徽章能分辨。改成霧白後狀態和底色一對一（訂閱中藍、已取消待到期黃、已到期白、未訂閱霧白、扣款失敗紅），Guideline 的訂閱狀態一節也照這個寫。
- 「成為作者」申請表的「作品連結」與「身分佐證」各占一整列（原本兩欄並排）。身分佐證是原生檔案欄位，半欄寬時瀏覽器的「未選擇檔案」字樣會被截斷。
- 文章內頁已訂閱的留言框不加 `name`，表單只帶一個隱藏的 `view=subscribed`，`action` 指向 `article.html#comments`：送出後停在已訂閱狀態的讀者回應區，留言內容不會進網址。
- 「我的文章」6 欄與「使用者與角色管理」5 欄的資料表用 `.data-table.is-compact`（窄留白、標題與灰字備註可換行、操作按鈕可上下排），≥ 1200px 不用橫向捲動；1200–1399px 付費層級切換拿掉鎖頭圖示（文字已說明）。平板以下照常在表格框內橫向捲動。

實作登入、註冊、忘記密碼與作者個人頁（2026-11 補頁）時的調整：

- 積木塔的橘色 H1 積木右上角加了一個黑色方形類型標記（只有圖示、`aria-hidden`），呼應積木編輯器左上角的類型標記；方向說明沒有寫，屬於不改變資訊層級的裝飾。
- 表單頁的輸入框改成 56px 高（全站預設 48px），和 56px 的主要按鈕同高，積木塔的白色表單積木比較厚實。
- 忘記密碼頁右側 3 塊示意比積木塔高很多，≥ 992px 讓積木塔 sticky（`top: 90px`），左欄不會只剩一大片空白。
- 作者海報在 ≥ 1200px 把追蹤按鈕排到海報右下角（DOM 仍在簡介後面），海報右半邊不會整片空著；768–1199px 照方向說明放在簡介下方。
- `.article-stack`、`.meta-line .is-preview` 從 `pages/_articles.scss` 移到 `components/_cards.scss`，分頁 `.page-link-text` 的手機規則移到 `_base.scss`，作者個人頁直接共用；文章列表的畫面沒有變。

實作 Guideline 時的調整：

- **付費牆三態**：Guideline 的右欄比文章內頁窄，未訂閱（左）與已訂閱、未登入（右）要到 ≥ 1400px 才並排，欄寬 5 : 3（左欄要夠寬，付費牆裡月／年兩張選項卡的價格「／年」才不換行）；以下上下排。未登入的變化（主要按鈕改「登入後訂閱」＋S01 小字）只畫在 Guideline，文章內頁的設計稿切換器只有未訂閱／已訂閱。
- **頁首正下方的閱讀進度細條**：真的 `.reading-bar` 是 sticky 在頁首下方；Guideline 把同一個 class 放進一個迷你頁框（`.gl-bar-frame`，上方一條黑色假頁首），改回文件流，看得出它貼在頁首正下方。另外把卡片內的 `.read-progress` 放進黑、藍、橘三塊積木，示範框色自動反白。
- **按鈕**：`.btn-accent`（橘底黑字）有定義但目前沒有頁面在用，Guideline 不示範；按鈕表的「固定色」只列實際在用的 `.btn-dark`（搜尋、首頁精選「免費讀前 2,200 字」、手機「篩選條件（3）」）。
- **彩色積木裡的行內程式碼**：預設的 `code` 是克萊因藍字，放在黑、藍、橘積木上對比不足；Guideline 的說明文字在彩色積木裡會提到 class 名稱，所以 `.gl-main` 裡的彩色積木讓 `code` 跟著字色（只影響 Guideline，長文的 `code` 本來就在白底）。
- **「拖曳中」示範**：被拿起的積木 `translate(6px, -6px) rotate(-1.5deg)`＋8px 硬陰影，原位置留 2px 虛線空槽，放下的位置是一條 4px 克萊因藍插入線；靜態示範，沒有動畫，頁面上也不做真的拖曳。
