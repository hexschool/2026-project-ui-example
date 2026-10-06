# 05 知識內容訂閱主題：現場筆記 FieldNotes

六角學院 2026 專題班的知識內容訂閱設計稿範例。主題是 **現場筆記 FieldNotes**：

> 專為「想真正弄懂一個行業怎麼運作」的讀者打造的知識訂閱平台。這裡不收二手整理、不收懶人包，只收**第一線工作者親自寫的長文**——餐廳老闆算給你看成本結構、封測廠工程師寫一條產線的一天、小農講一顆鳳梨怎麼進到日本超市。
>
> 每篇文章都可以免費讀前三分之一，**讀到關鍵的那一段才需要訂閱**。訂閱一次解鎖全站，不綁單一作者、不另外加購。
>
> ——Notion「05-知識內容訂閱主題：現場筆記 FieldNotes」

同一套 wireframe、同一份文案、同一組圖片清單，做成多種視覺風格。**一種風格就是一個獨立、完整的專案**，可以單獨安裝、執行。這個主題的重點不是購物流程，而是**長文要讀得完**（排版）、**付費牆擋得誠實**（訂閱轉換）、**同一個版型承載三種權限**（讀者／作者／管理員）。

需求來源：Notion <https://app.notion.com/p/3ef6ab47eb4880deba15e50c5092ec08>（2026-10-04 最後編輯）。

## 角色與核心流程

| 角色 | 核心流程（Notion） | 設計稿上的頁面 |
|---|---|---|
| **讀者** | 註冊登入 → 瀏覽文章 → 免費預覽付費文章 → 訂閱 → 查看訂閱狀態 | 首頁 → 文章列表 → 文章內頁（付費牆）→ 訂閱方案（結帳）→ 個人頁面（訂閱狀態） |
| **作者** | 註冊申請成為作者 → 發布文章 → 管理自己的文章 | 個人頁面：成為作者 → 撰寫新文章（編輯器）→ 我的文章 → 內容數據 |
| **管理員** | 審核作者申請 → 管理使用者 | 個人頁面：作者申請審核 → 使用者管理 → 文章管理 |

- **前台頁面**：首頁、知識內容說明（文章列表＋文章內頁，含付費預覽牆）、訂閱方案頁面、個人頁面（讀者訂閱管理 ／ 作者文章後台與編輯器）。
- **本次不包含**（Notion）：作者分潤與稿酬結算、電子報寄送、留言即時通知、多人共筆與協作編輯、文章版本回溯、企業團體訂閱。
- 完整的使用者故事見 [`CONTENT.md`](./CONTENT.md) §2。

## 目錄結構

```
05-知識內容訂閱主題/
├─ README.md               ← 本檔：總覽、共同規範與新增風格的步驟
├─ CONTENT.md              ← ★ 文案唯一來源：Notion 全部文案逐字整理＋統一的補充文案
├─ IMAGES.md               ← ★ 3 套共用的圖片清單（17 張：作者頭像 8、文章封面 8、內文配圖 1）
├─ _wireframe/             ← wireframe 本地參考
│  ├─ README.md            ← 來源、瀏覽方式、與正式頁面的差異
│  ├─ WIREFRAME_SPEC.md    ← ★ 逐頁版型規格（實作新風格的依據）
│  ├─ index.html           ← wireframe 原檔（Notion 下載，單一 HTML、hash 切換 5 個頁面區塊）
│  ├─ screenshots/         ← 1440px 全頁截圖（6 個頁面＋個人頁面 3 種角色）
│  └─ tools/screenshot.mjs ← 重新截圖
├─ 01-typewriter-style/    ← 風格 01：純粹打字機
├─ 03-thinktank-style/     ← 風格 03：高端政經智庫
└─ 04-slow-reading-style/  ← 風格 04：溫暖心靈慢讀
```

實作一套風格要讀的 3 份文件：**`_wireframe/WIREFRAME_SPEC.md`（版型）→ `CONTENT.md`（文案）→ `IMAGES.md`（圖片）**。

## 風格清單

| 編號 | 風格 | 色系搭配 | UI 視覺特點 | 資料夾 | 狀態 |
|---|---|---|---|---|---|
| 01 | **純粹打字機** | 黑白色系（白紙底、打字機炭黑、單一主色藍） | 編輯器零多餘干擾，浮動工具列隨選隨現，會員方案表黑白分明一目了然。 | [`01-typewriter-style/`](./01-typewriter-style/) | 已完成 |
| 02 | 極客代碼知識庫 | 深色系 ＋ 冷色調（VS Code 暗底、電光綠、天藍） | 支援 Markdown 即時高亮與代碼塊預覽，會員權限以分支權限樹狀圖呈現。 | `02-geek-style/` | 規劃中 |
| 03 | **高端政經智庫** | 淺色系 ＋ 冷色調（牛津深藍、石板灰、純白底） | 採用權威報刊排版架構，方案矩陣採細線分隔，強調數據圖表與專家權威。 | [`03-thinktank-style/`](./03-thinktank-style/) | 已完成 |
| 04 | **溫暖心靈慢讀** | 淺色系 ＋ 暖色系（燕麥灰白、焦糖駝色、柔暖灰） | 柔光護眼色調，文字行距寬鬆，會員管理訂閱週期與取消路徑溫和而清晰。 | [`04-slow-reading-style/`](./04-slow-reading-style/) | 已完成 |
| 05 | 撞色創作者沙龍 | 高對比 ＋ 飽和色（純白底、深黑、克萊因藍撞活力橘） | 區塊編輯器以積木模組拖曳呈現，創作者後台數據與訂閱會員狀態對比鮮明。 | `05-salon-style/` | 規劃中 |
| 06 | 手帳筆記插畫 | 淺色系 ＋ 暖色調（淺奶油、柔和珊瑚橘、抹茶綠） | 編輯器工具列帶有手繪風標籤，訂閱方案按鈕圓潤可愛，營造輕負擔氛圍。 | `06-journal-style/` | 規劃中 |

風格說明逐字取自 Notion 風格表。規劃中的資料夾名稱是暫定。

### 各風格的招牌落點

Notion 的「UI 視覺特點」指出每套風格最該下功夫的地方。版型 3 套一樣，差異集中在這些元件：

| 風格 | 最該做出差異的地方 | 提醒 |
|---|---|---|
| 01 純粹打字機 | 所見即所得編輯器（零干擾、浮動工具列隨選隨現）、方案卡與比較矩陣（黑白分明） | 藍色只有一個，留給可以按的東西與「訂閱限定」；黑白之外的狀態色仍要通過三重編碼與對比 |
| 03 高端政經智庫 | 比較矩陣（細線分隔）、內容數據的漏斗圖與數據表、作者身分與權威感（作者列、作者卡、作者牆） | 報刊排版不等於縮小行高：長文行高仍 ≥ 1.8 |
| 04 溫暖心靈慢讀 | 長文排版（行距寬鬆、柔光護眼）、個人頁面的訂閱週期與取消路徑（溫和而清晰） | wireframe 本身是暖色調，但**不要整組沿用 wireframe 的色票**（磚紅不是焦糖駝色），依 Notion 色系重新定義。中文楷體不要用 Google Fonts 的霞鶩文楷 TC：它會把「為」「真」顯示成「爲」「眞」的舊字形，可改用以教育部標準字形為準的芫荽（Iansui） |

## 每套風格的共同規範

- **技術**：一律 Bootstrap 5（Sass 變數客製化）＋ Bootstrap Icons＋HTML＋CSS＋少量 JS，**唯一的編譯工具是 `sass` CLI**，不用 Vite 或任何打包工具，不用 Tailwind。架構同 [`../01-電商主題/01-luxury-style/`](../01-電商主題/01-luxury-style/)：多頁靜態 HTML、頁首頁尾每頁一份（`templates/page.html`＋`npm run check`）、`css/style.css` 與 `js/vendor/` 要提交（雙擊 `index.html` 就能看）。

  | 項目 | 規範 |
  |---|---|
  | 頁面 | 6 個 HTML，每頁完整包含頁首與頁尾 |
  | 樣式 | `scss/_variables.scss` 是 design token；`main.scss` 載入順序同 01 電商（functions → variables → bootstrap → icons → base → components → pages） |
  | JS | `js/main.js` 只做 `WIREFRAME_SPEC.md` §2.8 列的 5 件事（設計稿切換器、閱讀進度條、字級調整、月／年切換、作者文章篩選），其餘互動用 Bootstrap 的 `data-bs-*` |
  | 圖表 | 閱讀漏斗等圖表用 inline SVG 或 CSS 畫，不用圖表套件 |
  | 編輯器 | 靜態的介面設計：浮動工具列、＋插入選單、免費預覽分隔線、設定面板直接畫在畫面上，不需要真的能編輯 |
  | 字體 | 可用 Google Fonts（中文字型要確認有載入），寫進 Guideline |
  | 主題 | 單一主題（淺色或深色由風格決定），不跟著作業系統切換深色模式 |

- **頁面**（Notion 規定的 5 頁，「知識內容說明」拆成 2 個檔案）：

  | 頁面 | 檔名 |
  |---|---|
  | 設計 Guideline（色彩、字級階層、間距、圓角陰影、元件狀態規範、RWD 斷點與 Do／Don't 對照，另含長文排版、付費牆兩態、角色三欄等，見 SPEC §7） | `guideline.html` |
  | 首頁 | `index.html` |
  | 文章列表 | `articles.html` |
  | 文章內頁（含付費預覽牆，未訂閱／已訂閱兩種狀態） | `article.html` |
  | 訂閱方案（方案卡、比較矩陣、結帳確認、FAQ） | `pricing.html` |
  | 個人頁面（訂閱狀態、收藏與閱讀紀錄、我的文章、編輯器、內容數據、作者申請、平台管理；讀者／作者／管理員三種角色） | `account.html` |

- **文案與假資料**：全部取自 [`CONTENT.md`](./CONTENT.md)，直接寫在各頁 HTML，**逐字使用**。Notion 沒有的介面文字、示意內文、留言與管理員資料也統一在 CONTENT.md §10，3 套用同一份，不要各自發明。跨頁要一致的數字列在 SPEC §2.9。
- **圖片**：照 [`IMAGES.md`](./IMAGES.md) 的 17 張（檔名一致），每套在自己的 `images/` 用自己的 `STYLE` 生成；沒有照片的人用字首頭像。不要額外加 Hero 大圖或插畫。
- **設計稿狀態示意**：頁面一次只能呈現一種狀態，其他狀態用兩種方式呈現（SPEC §0.2）：
  - **設計稿切換器**：`article.html` 的「未訂閱｜已訂閱」（`?view=subscribed`）、`account.html` 的「讀者｜作者｜管理員」（`?role=author`、`?role=admin`），外觀要和產品介面明顯區隔。
  - **設計稿狀態示意區塊**：訂閱狀態的其他三種、付款三態、作者申請狀態、空狀態等，放在相關區塊下方，以虛線和正式內容分開（沿用 01 電商的 `.demo-state`）。
- **頁面導覽**：頁尾**不放**列出所有頁面的「設計稿頁面」區塊，頁首也不連 Guideline；各頁從首頁依讀者流程點進去，個人頁面的作者與管理員內容用角色切換器看。完整頁面清單寫在各風格的 README。
- **檢查寬度**：每頁都要看 390、768、992、1200、1440、1920，不能有水平捲軸；交付前至少截 390 與 1920 檢查。
- **命名**：資料夾以 `編號-英文風格名-style` 命名，編號沿用 Notion 風格表；`package.json` 的 `name` 用 `fieldnotes-編號-英文風格名-style`（例如 `fieldnotes-03-thinktank-style`）。

## 新增一套風格

這個主題的第一批 3 套風格是同時開始做的，所以一律從電商主題的 `01-luxury-style` 複製骨架；之後新增的風格可以改從本主題任一套已完成的風格複製（版型與文案都已就位，省最多事）。

1. **複製骨架**：把 `../01-電商主題/01-luxury-style/` 複製成新資料夾（例如 `03-thinktank-style/`），刪掉 `node_modules/`、`images/` 裡的電商圖片、10 個電商 `.html`、`scss/pages/` 與 `scss/components/` 裡電商專用的 partial（購物車、結帳、商品卡、訂單摘要等）。保留 `package.json`、`scripts/`、`templates/`、`scss/main.scss`、`scss/_base.scss` 的架構與 `js/vendor/`。
2. **改專案資訊**：`package.json` 的 `name`、`description`；`templates/page.html` 的 `<title>`、description、字體、`theme-color`、favicon，以及**整個頁首與頁尾**（照 SPEC §2.2、§2.3：首頁、文章列表、訂閱方案＋搜尋＋會員入口；頁尾讀者／作者／平台 3 欄，沒有設計稿頁面導覽）。
3. **改檢查腳本**：`scripts/check-layout.mjs` 的區塊名稱（沒有公告列）與目前頁對應：`article.html` 的目前頁是 `articles.html`（只加 `active`），`guideline.html` 不標示。
4. **重寫 `scss/_variables.scss`**：整套風格的 design token（色彩、權限色與狀態色、字體、長文字級與行高、圓角、陰影、元件變數）。
5. **建立 6 個頁面**：從 `templates/page.html` 複製，依 `_wireframe/WIREFRAME_SPEC.md` 的區塊順序與欄數實作，文案貼 `CONTENT.md`。`scss/pages/` 每頁一個 partial（例如 `_guideline`、`_home`、`_articles`、`_article`、`_pricing`、`_account`），共用元件放 `scss/components/`（例如頁首、頁尾、文章卡、權限徽章、付費牆、方案卡、編輯器、設計稿狀態示意）。
6. **重寫 `js/main.js`**：只做 SPEC §2.8 的 5 件事。
7. **生成圖片**：改 `scripts/generate-images.mjs`，`JOBS` 換成 `IMAGES.md` 的 17 張、`STYLE` 換成本風格的調性，`sips` 改成「先裁切再縮放」（封面 1200 × 630、配圖 16:9、頭像 600 × 600）；執行 `npm run images`。另外畫一個 `images/favicon.svg`。
8. **寫 Guideline**：12 節照 SPEC §7，示範都用頁面真的在用的 class。
9. **寫風格 README**：概念、頁面清單（6 個檔名、兩個設計稿切換器的網址參數）、檔案結構、共用類別、Design token 摘要、圖片說明（格式同 `01-luxury-style/README.md`）。
10. **驗收**：跑 `npm run check`，照 SPEC §10 的驗收清單逐項確認，每頁截 390 與 1920 看過。
11. 回到本檔，更新「風格清單」的狀態。

### 換色時同步檢查

色票的唯一來源是 `_variables.scss`，但下面幾處把數值寫成文字或寫死，改色時要一起檢查：

- [ ] `scss/_variables.scss`：色票、`$theme-colors`、權限色與狀態色、語意變數（`$body-*`、`$input-*`、`$focus-ring-color`…）。
- [ ] `guideline.html`：色票的 hex、對比度與用途文字，Bootstrap 主題色與語意變數的對應。
- [ ] 漏斗圖與其他 inline SVG：顏色請用 CSS class 或 `currentColor` 控制，不要在 SVG 裡寫死 hex；Guideline 的深色底示範也要跟著檢查。
- [ ] 風格自己的 `README.md`：Design token 摘要。
- [ ] 改了頁首高度時：sticky 元素（篩選側欄、文章目錄、閱讀進度條、訂閱摘要、個人頁側欄、Guideline 目錄）的 `top`，以及 Guideline「間距」寫的數字。
- [ ] `scripts/generate-images.mjs` 的 `STYLE`：整組圖片的色調，換色後重新生圖。
- [ ] `templates/page.html` 與每一頁的 `theme-color`，以及 `images/favicon.svg` 裡的色碼。

## 啟動

```bash
# 3 套用法相同，以 03 為例
cd 03-thinktank-style
open index.html  # 直接用瀏覽器看，已含編譯好的 CSS
npm install      # 要改樣式時才需要（會把 Bootstrap JS 與圖示字型複製進專案）
npm run watch    # 監看 scss/ 並編譯 css/style.css
npm run check    # 檢查每頁的 head、頁首、頁尾是否與範本一致
npm run images   # 重新生成圖片（需要已登入的 codex CLI）
```

看兩種文章狀態與三種角色：

```
article.html                    ← 未訂閱（付費牆）
article.html?view=subscribed    ← 已訂閱（沒有付費牆）
account.html                    ← 讀者
account.html?role=author        ← 作者
account.html?role=admin         ← 管理員
```

wireframe 參考：直接開 `_wireframe/index.html`（需要網路載入 Bootstrap CDN），或看 `_wireframe/screenshots/`。
