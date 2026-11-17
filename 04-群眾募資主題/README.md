# 04 群眾募資主題：島造 ISLANDMAKE 在地製造提案平台

六角學院 2026 專題班的群眾募資設計稿範例。主題是 **島造 ISLANDMAKE 在地製造提案平台**：只收台灣在地設計與製造提案的群眾募資平台，把「出貨跳票」做成制度——每個專案都要公開生產排程，逾期自動通知贊助者。

同一套 wireframe、同一份文案，做成多種視覺風格。**一種風格就是一個獨立、完整的專案**，可以單獨安裝、執行。這個主題的每套風格都只用 Bootstrap 5＋HTML＋CSS＋少量 JS，唯一的編譯工具是 `sass` CLI，不用打包工具（架構同 [`../01-電商主題/01-luxury-style/`](../01-電商主題/01-luxury-style/)）。

## 主題介紹（Notion 原文）

> 專注台灣在地設計與製造的群眾募資平台。不做快消、不做轉賣，只收「**說得出材料從哪來、工廠在哪裡、什麼時候能交到你手上**」的提案。平台把最常見的募資糾紛——**出貨跳票**——直接做成制度：每個專案都必須公開生產排程時間軸，並在每個里程碑更新進度，逾期自動通知所有贊助者。

來源：Notion「04-群眾募資主題：島造 ISLANDMAKE 在地製造提案平台」（<https://app.notion.com/p/3ef6ab47eb4880638063f06429c057ed>）。完整文案逐字整理在 [`CONTENT.md`](./CONTENT.md)。

## 角色與核心流程

| 角色 | 核心流程（Notion） | 這次的設計稿怎麼呈現 |
|---|---|---|
| **贊助者** | 註冊登入 → 瀏覽專案 → 選回饋方案＋贊助 → 查看贊助紀錄 → 留言 | 首頁 → 專案列表 → 專案細節（選回饋方案、看排程、留言）→ 贊助結帳 `checkout.html` → 贊助成功 `order-result.html` → 個人頁面的贊助紀錄 → 贊助紀錄詳情 `backing.html`。註冊登入（2026-11 補）：專案細節狀態示意「未登入點擊贊助」→ 登入 `login.html`（→ 註冊 `register.html`）→ 回到專案細節的回饋方案 |
| **提案者** | 註冊登入 → 建立專案 → 設定回饋方案 → 查看募資進度 → 發布／下架專案 → 回覆留言 | 個人頁面的提案管理（7 種提案狀態）與募資數據儀表板；專案細節的提案者回覆 |
| **管理員** | 審核專案上架 → 管理使用者 | 本次沒有管理員頁面；審核結果體現在提案者的「審核中／審核未通過」，Guideline 收錄「管理員審核佇列為空」文案 |

- **前台頁面**：首頁、專案列表（分類／狀態／金額／時間篩選）、專案細節與贊助方案選擇、個人頁面（贊助者的贊助紀錄 ／ 提案者的提案管理）
- **贊助者與提案者用同一個個人頁面版型**：側邊導覽依角色變化，頁面上有「設計稿狀態示意」的角色切換（`account.html?role=backer` 直接看贊助者畫面），規則見 `_wireframe/WIREFRAME_SPEC.md` §5。
- **本次不包含**（Notion）：分期付款與訂閱式募資、物流追蹤串接、提案者分潤結算與開立發票、專案更新電子報發送、多幣別與海外運費計算。提案者後台與管理員後台也不做（第二階段，見 `CONTENT.md` §7）。
- **2026-11 補頁**：Notion 規定的 5 頁之外，每套再補登入、註冊、贊助結帳、贊助成功、贊助紀錄詳情 5 頁（Notion 與 wireframe 都沒有），每套共 10 頁。版型見 `_wireframe/WIREFRAME_SPEC.md` §3.05～3.09，文案與示意資料見 `CONTENT.md` 附錄 B.7～B.12（Notion 沒寫，3 套統一）。

## 目錄結構

```
04-群眾募資主題/
├─ README.md               ← 本檔：總覽、共同規範、新增風格的步驟
├─ CONTENT.md              ← ★ 文案唯一來源：Notion 逐字整理（首頁、8 個專案、專案細節、個人頁、18 則狀態文案、使用者故事）＋示意資料（附錄 B，含 2026-11 補頁的文案）
├─ IMAGES.md               ← ★ 3 套共用的圖片清單（23 張，檔名、比例、用途、畫面主體、alt）
├─ _wireframe/             ← wireframe 本地參考
│  ├─ README.md            ← 來源、瀏覽方式、截圖說明
│  ├─ WIREFRAME_SPEC.md    ← ★ 逐頁版型規格（10 頁，新風格實作依據）與驗收清單
│  ├─ index.html           ← Notion 附件原檔（5 個頁面區塊，hash 切換）
│  └─ screenshots/         ← 1440px 全頁截圖，每頁「預設」與「顯示設計標註」各一張
├─ 02-green-style/         ← 風格 02：綠色永續生活
├─ 03-bold-style/          ← 風格 03：大膽新潮酷品
└─ 04-indie-press-style/   ← 風格 04：獨立出版文藝
```

## 風格清單

Notion 列了 6 種風格，先做 02、03、04 三種。「已完成」是指 2026-10 的 5 頁；2026-11 起每套要補到 10 頁（新增登入、註冊、贊助結帳、贊助成功、贊助紀錄詳情），補頁進度以各風格 README 的頁面表為準。

| 編號 | 風格 | 色系搭配 | UI 視覺特點 | 資料夾 | 狀態 |
|---|---|---|---|---|---|
| 01 | 未來硬體實驗室 | 深色系 ＋ 冷色漸層（深鈦灰、冷藍漸層、青空色） | 資金儀表板宛如航太數據監控台，募資進度條具發光充能感，科技感爆棚。 | `01-hardware-lab-style/`（暫定） | 規劃中 |
| 02 | **綠色永續生活** | 淺色系 ＋ 暖綠調（初生綠、森林墨綠、原木褐） | 溫和的圓角進度條，贊助方案卡片留白舒適，專案圖文區易於 SEO 爬蟲索引。 | [`02-green-style/`](./02-green-style/) | 已完成 |
| 03 | **大膽新潮酷品** | 高對比 ＋ 鮮豔單色（亮黃、深黑、奶白） | 達成率以超大 Bold 數字直擊眼球，回饋選項採粗黑厚邊框（Neo-brutalism）。 | [`03-bold-style/`](./03-bold-style/) | 已完成 |
| 04 | **獨立出版文藝** | 淺色系 ＋ 冷色調（鉛字黑、霧灰藍、象牙白） | 像翻閱雜誌般的專案介紹頁面，階層標題鮮明，交付時間軸呈現精緻刻度感。 | [`04-indie-press-style/`](./04-indie-press-style/) | 已完成 |
| 05 | 現代商務創新 | 淺色系 ＋ 冷色系（純白、企業深藍、科技冰灰） | 投資回報與專案進度以專業金融級圖表呈現，資訊透明且高度結構化。 | `05-business-style/`（暫定） | 規劃中 |
| 06 | 童話玩具工場 | 淺色系 ＋ 暖色系（櫻花粉、馬卡龍紫、檸檬黃） | 募資進度以「小球滾動/積木堆疊」視覺化呈現，回饋卡片軟萌且親和力高。 | `06-toy-factory-style/`（暫定） | 規劃中 |

## 每套風格的共同規範

- **技術**：只有 Bootstrap 5（Sass 變數客製）＋ Bootstrap Icons＋HTML＋CSS＋少量 JS。唯一的編譯工具是 `sass` CLI（`scss/` → `css/style.css`），不用 Vite 或任何打包工具，不用 Tailwind。

  | 項目 | 做法 |
  |---|---|
  | 頁面 | 多頁靜態 HTML，頁首頁尾每頁完整寫一份；`templates/page.html` 是範本，`npm run check`（`scripts/check-layout.mjs`）檢查 10 頁是否同步 |
  | 樣式 | `scss/_variables.scss` 是 design token；`main.scss` 載入順序同 01 電商（functions → 變數 → Bootstrap → Icons → base → components → pages） |
  | JS | 互動優先用 Bootstrap `data-bs-*`；自己寫的只有 `js/main.js` 的回饋方案選取、贊助紀錄篩選、角色切換（`WIREFRAME_SPEC.md` §2.9）；2026-11 補的 5 頁不新增 JS（表單用 `<form action>` 換頁，修改收件資訊用 Collapse、取消贊助用 Modal） |
  | 圖表 | 每日募資趨勢、累積 vs 目標、方案分佈用 **inline SVG 或 HTML／CSS** 畫，不引入圖表套件 |
  | 交付 | `css/style.css`、`css/fonts/`、`js/vendor/bootstrap.bundle.min.js` 要提交，雙擊 `index.html` 就能看 |
  | 字體 | 可用 Google Fonts（中文字體注意檔案大小，只載入用到的字重） |

- **頁面**（10 頁，檔名固定；前 5 頁是 Notion 規定的，後 5 頁是 2026-11 補的，Notion 沒有，版型見 SPEC §3.05～3.09、文案見 CONTENT 附錄 B.7～B.12）：

  | 頁面 | 檔名 |
  |---|---|
  | 設計 Guideline（色彩、字級階層、間距、圓角陰影、元件狀態規範、數據圖表、狀態文案、RWD 斷點、Do／Don't） | `guideline.html` |
  | 首頁 | `index.html` |
  | 專案列表 | `projects.html` |
  | 專案細節與贊助方案選擇（以「一只走十年的台南帆布包」示範，所有專案卡都連到這頁） | `project.html` |
  | 個人頁面「我的島造」（贊助紀錄、提案管理、募資數據儀表板、帳號設定；贊助者／提案者兩種角色） | `account.html` |
  | 登入（2026-11 補；從專案細節狀態示意「未登入點擊贊助」進入，登入後回到回饋方案） | `login.html` |
  | 註冊（2026-11 補；從登入頁進入，註冊後回到回饋方案） | `register.html` |
  | 贊助結帳（2026-11 補；從專案細節贊助小計的「下一步：填寫收件資訊」進入） | `checkout.html` |
  | 贊助成功（2026-11 補；結帳送出後，就是個人頁贊助紀錄卡片 1 那一筆） | `order-result.html` |
  | 贊助紀錄詳情（2026-11 補；從個人頁贊助紀錄卡的專案名稱進入，含另外 4 種贊助狀態的狀態示意） | `backing.html` |

  - 頁首仍不放登入／註冊按鈕（全站以已登入的提案者 陳柏宇 呈現），登入頁的入口只有專案細節的 S1 狀態示意。
  - 補頁時原頁只改 3 處連結（專案細節的「下一步：填寫收件資訊」與「登入 / 註冊」、個人頁贊助紀錄卡的專案名稱，SPEC §1.1），內容與版面不動，`guideline.html` 不動；新頁用到 Guideline 沒有的元件，寫在風格 README 的「共用類別」。
  - 新頁規格只規定區塊、內容、文案與狀態，**桌機欄數與構圖由各風格依自己既有頁面的排版語言決定**（SPEC §3「2026-11 補頁的排版」），3 套不要做成同一個版型只換顏色。

- **文案與資料**：一律取自 [`CONTENT.md`](./CONTENT.md)，逐字使用，直接寫在各 `.html`。Notion 沒有的資料用 `CONTENT.md` 附錄 B 的示意資料，三套數字一致（帆布包 NT$ 1,235,600／247%／1,042 人／剩 12 天；2026-11 補頁的那一筆贊助：IM-20260918-0016／標準單入組 NT$ 2,280／2026/09/18，附錄 B.7）。
- **版型**：照 [`_wireframe/WIREFRAME_SPEC.md`](./_wireframe/WIREFRAME_SPEC.md)：區塊順序、欄數、元件與狀態一致，只改視覺（2026-11 補的 5 頁欄數與構圖是建議，各風格可以調整）。wireframe 和 Notion 不一致時以 Notion 為準（§6）。
- **圖片**：照 [`IMAGES.md`](./IMAGES.md) 的 23 張，三套檔名相同、內容相同，各自用自己的 `STYLE` 重新生成。2026-11 補的 5 頁沿用既有圖片，不生新圖（`IMAGES.md` §H）。
- **狀態**：回饋方案 4 種、里程碑 4 種＋延遲、贊助紀錄 5 種、提案 7 種、專案募資 4 種、角色 2 種都要看得到；非預設狀態放在該頁底部的「設計稿狀態示意」區（`WIREFRAME_SPEC.md` §0.3）。2026-11 補頁另有：登入的帳號或密碼錯誤、註冊與結帳的欄位錯誤、贊助紀錄詳情的另外 4 種贊助狀態與取消確認對話框。
- **頁面導覽**：頁尾**不放**列出所有頁面的「設計稿頁面」區塊；各頁從首頁依流程點進去，Guideline 直接開 `guideline.html`，頁面清單寫在各風格的 README。
- **檢查寬度**：每頁在 390／768／992／1200／1440／1920 截圖檢查，不能有頁面層級的水平捲軸。做完用 `WIREFRAME_SPEC.md` §7 的驗收清單逐項確認。
- **命名**：資料夾以 `編號-英文風格名-style` 命名，編號沿用 Notion 風格表。

## 新增一套風格

1. 建立資料夾（例如 `05-business-style/`）。主題內已有完成的風格時，複製**風格最接近的那一套**，刪掉 `node_modules/`，再改視覺即可；還沒有時，從 `../01-電商主題/01-luxury-style/` 複製技術骨架：`package.json`（改 `name`、`description`）、`.gitignore`、`scripts/`（`copy-vendor.mjs`、`check-layout.mjs`、`generate-images.mjs`）、`scss/main.scss` 的載入順序、`_base.scss` 的共用工具（`.demo-state`、`.empty-state`、`.text-phrase`…），電商的頁面、元件樣式與圖片不要帶過來。
2. 寫 `templates/page.html`：島造的頁首（首頁／探索專案／我的島造＋搜尋＋我要提案＋頭像）、頁尾、字體、favicon、`theme-color`（`WIREFRAME_SPEC.md` §2.2、§2.3）。10 頁都從範本複製。`scripts/check-layout.mjs` 的目前頁對應改成 `project.html → projects.html`、`backing.html → account.html`（兩者只加 `active`），`guideline.html`、`login.html`、`register.html`、`checkout.html`、`order-result.html` 不標示，執行 `npm run check`。
3. 重寫 `scss/_variables.scss`：色彩（含 6 種語意色調 `live`、`info`、`warn`、`ok`、`err`、`idle`，`WIREFRAME_SPEC.md` §2.6）、字體、間距、圓角、陰影、元件變數。
4. 照 `WIREFRAME_SPEC.md` 逐頁實作，文案從 `CONTENT.md` 複製。專案細節的故事排版另看 §4，個人頁的角色差異看 §5。2026-11 補的 5 頁看 §3.05～3.09（登入、註冊版型相近，可以共用一個 `scss/pages/_auth.scss`；結帳與贊助成功可以共用步驟條）。
5. 圖片：把 `scripts/generate-images.mjs` 的 `JOBS` 換成 `IMAGES.md` 的 23 張（檔名、比例、畫面主體譯成英文），改 `STYLE` 為這套風格的調性，執行 `npm run images`。
6. Guideline：9 章都要有（`WIREFRAME_SPEC.md` §3.00），18 則狀態文案逐字收錄，圖表要有淺色與深色底的範例。
7. 在 6 種寬度截圖檢查（用 Playwright 的 headless shell，不要用 Google Chrome.app），用 §7 驗收清單逐項確認。
8. 寫這套風格的 `README.md`（10 頁的頁面表、狀態示意清單、共用類別、Design token 摘要、圖片說明），回到本檔把「風格清單」的狀態改成「已完成」。

### 換色時同步檢查

色票的唯一來源是 `_variables.scss`，但下面幾處把數值寫成文字或寫死，改色時要一起檢查：

- [ ] `scss/_variables.scss`：色票、`$theme-colors`、語意色調與 Bootstrap 語意變數（`$body-*`、`$input-*`、`$focus-ring-color`…）。
- [ ] `guideline.html`：色票的 hex、對比度與用途文字；狀態徽章總表。
- [ ] 圖表：inline SVG 裡若直接寫了 `fill`／`stroke` 色碼（建議改用 `currentColor` 或 class），Guideline 的深色底圖表範例也要一起改。
- [ ] 風格自己的 `README.md`：Design token 摘要。
- [ ] 改了頁首高度時，sticky 位移（儀表板、故事目錄、側欄、小計卡）與 Guideline「間距」的數字一起改。
- [ ] `scripts/generate-images.mjs` 的 `STYLE`：整組圖片的色調，換色後重新生圖。
- [ ] `templates/page.html` 與每一頁的 `theme-color`，以及 `images/favicon.svg` 裡的色碼。

## 啟動

```bash
# 02、03、04 用法相同，以 02 為例
cd 02-green-style
open index.html  # 直接用瀏覽器看，已含編譯好的 CSS
npm install      # 要改樣式時才需要
npm run watch    # 監看 scss/ 並編譯 css/style.css
npm run check    # 檢查 10 頁的 head、頁首、頁尾是否與範本一致
npm run images   # 重新生成圖片（需要已登入的 codex CLI）

# wireframe 參考（需連網載入 Bootstrap CDN；離線請看 _wireframe/screenshots/）
open _wireframe/index.html
```
