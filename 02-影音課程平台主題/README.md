# 02 影音課程平台主題：Craftory 手感工藝線上學院

六角學院 2026 專題班的影音課程平台設計稿範例。主題是 **Craftory 手感工藝線上學院**（以下為 Notion 原文）：

> 專為「想養成第二專長、但一直沒開始」的上班族打造的工藝影音學院，匯集各領域台灣在地職人開設的線上課程。每門課都以「**做出一件能帶走的完整作品**」為結業標準，支援章節免費試看、逐單元進度記錄與隨時續看。

同一套 wireframe、同一份文案，做成多種視覺風格。**一種風格就是一個獨立、完整的專案**，可以單獨安裝、執行。架構和 [`01-電商主題`](../01-電商主題/) 的各風格相同：只用 Bootstrap＋HTML＋CSS＋少量 JS，唯一的編譯工具是 `sass` CLI，不用 Vite、Vue 或任何打包工具。

## 主題範圍、角色與核心流程

（Notion 原文）

- **前台頁面**：首頁、課程列表（分類／難度／價格篩選）、課程詳情頁（試看＋購買）、課程播放學習頁（章節＋進度）
- **角色**：學生、講師（兩種角色、兩條流程）
- **核心流程**：
  - **學生** 瀏覽課程 → 註冊登入 → 購買課程 → 觀看影片
  - **講師** 註冊登入 → 建立課程 → 上傳章節影片 → 上架販售

本次設計稿只做學生端的 5 頁；講師流程只出現在 Guideline 的狀態元件（草稿／已上架／已下架）。完整使用者故事見 [`CONTENT.md`](./CONTENT.md) §2。

## 目錄結構

```
02-影音課程平台主題/
├─ README.md               ← 本檔：總覽與新增風格的規則
├─ CONTENT.md              ← ★ 全部文案（Notion 逐字）＋三套共用的補充資料與介面文字
├─ IMAGES.md               ← ★ 三套共用的圖片清單（檔名、比例、尺寸、用途、畫面主體）
├─ _wireframe/             ← wireframe 本地參考（純 HTML＋CSS，瀏覽器直接開 index.html）
│  ├─ README.md            ← 原站結構、範圍、瀏覽方式、與原站的差異
│  ├─ WIREFRAME_SPEC.md    ← ★ 逐頁版型規格（新風格實作依據）
│  ├─ index.html           ← 頁面索引
│  ├─ pages/               ← 5 個鏡像頁（首頁、探索課程、課程詳情、學習頁、講師後台）
│  ├─ screenshots/         ← 原站全頁截圖（1440px）
│  ├─ assets/              ← 鏡像用的 CSS（css/）與 Noto Sans TC 字型子集（fonts/）
│  └─ tools/               ← mirror.mjs 重新鏡像（Playwright）、check-links.mjs 檢查本地參照
├─ 01-dark-theater-style/  ← 風格 01：極致暗黑劇院
├─ 04-scholar-style/       ← 風格 04：人文書院風
└─ 05-swiss-style/         ← 風格 05：瑞士國際排版
```

`_wireframe/` 是所有風格共用的版型依據，來源為 [Craftory wireframe](https://wireframe-2-video-platform.vercel.app/)，已存成本地檔案（課程照片仍連到 Unsplash）。原站是單一網址的單頁應用，用頁首按鈕切換畫面，鏡像時把每個畫面各存成一頁。

## 風格清單

Notion「設計稿範例產出文件」的影音課程平台風格表，本次先做 01、04、05。

| 編號 | 風格 | 色系搭配 | UI 視覺特點 | 資料夾 | 狀態 |
|---|---|---|---|---|---|
| 01 | **極致暗黑劇院** | 深色系＋冷色系（深空黑、微光冷藍、純白） | 95% 暗底專注介面，播放控制器僅在滑鼠懸停時發出柔光，降低視覺干擾 | [`01-dark-theater-style/`](./01-dark-theater-style/) | 已完成 |
| 02 | 北歐明亮課室 | 淺色系＋冷色系（雪白、冰河藍、低飽和灰） | 章節目錄與隨堂筆記側欄採用輕量卡片，留白寬裕，適合長時間白天學習 | `02-nordic-style/` | 規劃中 |
| 03 | AI 賽博學院 | 深色系＋高對比（深靛藍、賽博紫、電光粉） | 播放進度條呈漸層能量光束，程式碼筆記支援終端機螢光高亮，科技感十足 | `03-cyber-style/` | 規劃中 |
| 04 | **人文書院風** | 淺色系＋暖色系（竹青綠、杏仁黃、深墨色） | 章節名稱使用典雅宋體，進度圓環細緻，適合文學、哲學或美學生活講堂 | [`04-scholar-style/`](./04-scholar-style/) | 已完成 |
| 05 | **瑞士國際排版** | 黑白色系＋亮紅點綴（純白底、深黑文字、瑞士紅） | 嚴格的網格對齊，播放清單去除多餘裝飾，以純粹的排版字級架構層級 | [`05-swiss-style/`](./05-swiss-style/) | 已完成 |
| 06 | 童心啟蒙樂園 | 淺色系＋繽紛暖色（向日葵黃、天空藍、珊瑚橘） | 大圓角播放按鈕、闖關地圖式章節清單，進度完成時帶有可愛勳章動畫 | `06-kids-style/` | 規劃中 |

各風格在版型上要特別注意的地方（例如暗黑劇院的控制列不能完全隱藏、書院風的進度圓環、瑞士排版的無裝飾播放清單），見 `_wireframe/WIREFRAME_SPEC.md` §0.4。

## 每套風格的共同規範

- **技術**：一律 Bootstrap 5（Sass 變數客製）＋ Bootstrap Icons＋HTML＋CSS＋少量 JS，唯一的編譯工具是 `sass` CLI；不用 Tailwind、Vite、Vue 或其他打包工具。

  | 項目 | 做法（同 `01-電商主題/01-luxury-style`） |
  |---|---|
  | HTML | 每頁一個完整的 `.html`，用一般的 `<a href>` 換頁，瀏覽器直接打開就能看 |
  | 頁首、頁尾、登入對話框 | 每頁完整寫一份；先改 `templates/page.html`，再同步到每一頁，用 `npm run check`（`scripts/check-layout.mjs`）確認一致 |
  | CSS | `scss/` → `css/style.css`（要提交編譯結果）；design token 集中在 `scss/_variables.scss` |
  | JS | 互動優先用 Bootstrap 的 `data-bs-*`（Collapse、Offcanvas、Modal、Tabs、Dropdown、Toast、Accordion）；自己寫的放 `js/main.js`，只做小功能（例如登入對話框依觸發按鈕顯示購買提示、手機搜尋聚焦） |
  | 深色風格 | 單一深色主題：直接把 Bootstrap 的變數設成深色，不用 `data-bs-theme`（01 極致暗黑劇院照 `01-luxury-style` 的做法） |

- **頁面**（共 5 頁，檔名固定）：

  | 頁面 | 檔名 | 內容 |
  |---|---|---|
  | 設計 Guideline | `guideline.html` | 色彩、字級階層、間距、圓角陰影、元件狀態規範（含 Notion 7 則狀態文案）、RWD 斷點與 Do／Don't 對照 |
  | 首頁 | `index.html` | 全螢幕主視覺＋正在播放小卡、學得完的理由、工藝作品入口、熱門課程、學員作品牆＋學習保障、底部 CTA |
  | 課程列表 | `courses.html` | 篩選（工藝分類、難度、價格）、排序、8 門課程卡、分頁 |
  | 課程詳情 | `course.html` | 以「從零開始的手捏陶」示範：試看播放器、sticky 購買卡、你會做出什麼、課程章節、講師、評價、常見問題 |
  | 課程播放／學習頁 | `learn.html` | 手捏陶 3-2：播放器、續看提示、操作列、分頁（單元重點／課程問答／附件下載）、學習進度與章節側欄 |

  版型、區塊順序與元件依 [`_wireframe/WIREFRAME_SPEC.md`](./_wireframe/WIREFRAME_SPEC.md)；與 wireframe 不同時以 Notion 與規格為準。
- **文案與假資料**：統一取自 [`CONTENT.md`](./CONTENT.md)，直接寫在各 `.html`。§1～§8 是 Notion 原文，逐字使用；§9 是 Notion 沒寫的補充資料與介面文字（星等、學習人數、52 門課的分類數、28 個單元、學習進度 14／28 的分配、按鈕文字、頁尾），三套統一，不要各自另編。
- **圖片**：依 [`IMAGES.md`](./IMAGES.md) 的 23 張清單、相同檔名，用各風格自己的調性生成，放在各風格的 `images/`；生圖腳本 `scripts/generate-images.mjs` 只改 `STYLE` 與描述。
- **動態功能**：播放器、進度記憶、續看 Toast、試看／鎖定、未登入、篩選結果等用靜態畫面呈現；看不到的狀態放在該頁底部的「設計稿狀態示意」（規格 §0.3）。
- **頁面導覽**：頁尾**不放**列出所有頁面的「設計稿頁面」區塊，各頁依學生流程點進去（首頁 → 課程列表 → 課程詳情 → 學習頁）；頁面清單寫在各風格的 README，Guideline 直接開 `guideline.html`。
- **命名**：資料夾以 `編號-英文風格名-style` 命名，編號沿用 Notion 風格表（`01-dark-theater-style`、`04-scholar-style`、`05-swiss-style`）。

## 新增一套風格

1. 複製一套架構相同的風格當起點，放進新資料夾，刪掉 `node_modules/`。這個主題還沒有完成的風格時，從 [`../01-電商主題/01-luxury-style/`](../01-電商主題/01-luxury-style/) 複製架構（`package.json`、`scripts/`、`templates/`、`scss/` 的分層），把頁面換成本主題的 5 頁；之後就從本主題最接近的風格複製（深色從 `01-dark-theater-style`）。
2. 改 `package.json` 的 `name`、`description`，以及頁面的標題、字體與 favicon：先改 `templates/page.html` 再同步到每一頁；`scripts/check-layout.mjs` 的頁面清單改成本主題的 5 頁，改完執行 `npm run check`。
3. 重寫 `scss/_variables.scss`：整套風格的 design token（色彩、字體、圓角、陰影、元件變數）。
4. 依風格調整 `_base.scss`、`components/`（頁首、頁尾、課程卡、播放器、章節清單、購買卡…）、`pages/` 與各個 `.html` 的版型。
5. 依 `IMAGES.md` 生成 `images/`（檔名一致就不用改 HTML）。
6. 版型以 `_wireframe/WIREFRAME_SPEC.md` 為依據，資訊架構保持一致，只改視覺表現；最後跑一次規格 §6 的驗收清單。
7. 回到本檔，更新「風格清單」的狀態與連結。

### 換色時同步檢查

色票的唯一來源是 `_variables.scss`，但下面幾處把數值寫成文字或寫死，改色（或改頁首高度）時要一起檢查：

- [ ] `scss/_variables.scss`：色票、`$theme-colors` 與語意變數（`$body-*`、`$input-*`、`$focus-ring-color`…）。
- [ ] `guideline.html`：色票的 hex、對比度與用途文字，Bootstrap 主題色與語意變數的對應。
- [ ] 風格自己的 `README.md`：Design token 摘要。
- [ ] 改了頁首高度時：Guideline「間距」的頁首高度、購買卡與學習頁側欄的 sticky `top`、錨點的 `scroll-margin-top`。
- [ ] `scripts/generate-images.mjs` 的 `STYLE`：整組圖片的色調與材質描述，換色後重新生圖。
- [ ] `templates/page.html` 與每一頁的 `theme-color`，以及 `images/favicon.svg` 裡的色碼。

## 啟動

```bash
# 以 01 為例，04、05 用法相同
cd 01-dark-theater-style
open index.html  # 直接用瀏覽器看，已含編譯好的 CSS
npm install      # 要改樣式時才需要
npm run watch    # 監看 scss/ 並編譯 css/style.css
npm run check    # 檢查每頁的 head、頁首、頁尾（與登入對話框）是否與範本一致

# wireframe 參考（在主題資料夾執行）
open _wireframe/index.html
node _wireframe/tools/check-links.mjs
```
