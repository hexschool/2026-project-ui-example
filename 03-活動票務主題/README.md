# 03 活動票務主題：StageOne 城市現場

六角學院 2026 專題班的活動票務設計稿範例。同一套 wireframe、同一份文案，做成多種視覺風格。**一種風格就是一個獨立、完整的專案**，可以單獨安裝、執行。這個主題的每套風格都只用 Bootstrap＋HTML＋CSS＋JS，不用打包工具（架構同 `01-電商主題/01-luxury-style/`）。

需求來源：Notion「03-活動票務主題：StageOne 城市現場」<https://app.notion.com/p/3ee6ab47eb4880dd867bf60f71ffcd95>

## 主題介紹（Notion 原文）

專為中小型現場活動打造的售票平台，聚焦在 Live House 演出、獨立劇場、城市市集與主題講座。主打「**三步完成購票、票券直接長在手機裡**」—— 不印實體票、不寄 email 附件，進場只要亮出動態 QR Code。同時替主辦方解決最痛的兩件事：即時掌握售票進度，以及入口驗票不塞車。

- **前台頁面**：首頁、活動列表（類型／日期／地區／價格篩選）、活動細節頁（票種選擇＋選位）、購票確認與快速支付頁

## 角色與核心流程

| 角色 | 流程（Notion 原文） | 本次設計稿涵蓋 |
|---|---|---|
| 購票者 | 瀏覽活動 → 註冊登入 → 選票種＋數量 → 購票選位 → 查看電子票券 | 全部。首頁 → 活動列表 → 活動細節（選票種、選位）→ 結帳 `checkout.html`（付款結果與電子票券在頁內 `#result`）。登入用共用的登入 Modal，Modal 的「註冊新帳號」→ 註冊 `register.html`（2026-11 補）。付款結果的「查看我的票券」→ 我的票券 `tickets.html` → 電子票券詳情 `ticket.html`；頁尾另可進購票紀錄 `orders.html`、追蹤的主辦方 `follows.html`（以上 2026-11 補） |
| 主辦方 | 註冊登入 → 建立活動 → 設定票種與數量 → 查看售票狀況 → 下架活動 | 只有入口（首頁「我要辦活動」轉換帶、登入 Modal）與 Guideline 裡的主辦方狀態；主辦方後台、行動驗票工具是 Notion 的「第二階段」，本次不做。Notion 同樣列在第二階段的購票者會員中心已在 2026-11 補做（我的票券、購票紀錄與電子發票、追蹤的主辦方），只有帳號設定仍不做 |

使用者故事全文見 [`CONTENT.md`](./CONTENT.md) §1。

## 目錄結構

```
03-活動票務主題/
├─ README.md            ← 本檔：總覽與新增風格的規則
├─ CONTENT.md           ← Notion 文案逐字整理（首頁、8 場活動、活動細節、結帳、16 條狀態文案、使用者故事）；2026-11 補頁的文字不在這裡，在 SPEC §2.9
├─ IMAGES.md            ← 3 套共用的圖片清單（22 張：檔名、比例、用途、風格中立的畫面主體）
├─ _wireframe/          ← wireframe 本地參考
│  ├─ README.md         ← 來源、瀏覽方式、注意事項
│  ├─ WIREFRAME_SPEC.md ← 逐頁版型規格（3 套風格的實作依據；§2.8～§2.9 是 Notion 沒寫的示意資料，含 2026-11 補頁的文字）
│  ├─ index.html        ← Notion 附件原檔（5 個頁面區塊，用 #hash 切換；需連網載入 Bootstrap CDN）
│  └─ screenshots/      ← 5 頁 1440px 全頁截圖（另有 *-notes.png 顯示設計標註；2026-11 補的 5 頁沒有截圖）
├─ 01-rave-style/       ← 風格 01：地下電音派對
├─ 02-salon-style/      ← 風格 02：古典藝文沙龍
└─ 04-biennale-style/   ← 風格 04：當代雙年展
```

## 風格清單

| 編號 | 風格 | 色系搭配 | UI 視覺特點 | 資料夾 | 狀態 |
|---|---|---|---|---|---|
| 01 | **地下電音派對** | 高對比 ＋ 深色（全黑底、極光綠、霓虹粉） | 粗暴幾何切角票券，QR Code 覆蓋全息防偽動態線條，次文化張力強烈。 | [`01-rave-style/`](./01-rave-style/) | 已完成 |
| 02 | **古典藝文沙龍** | 淺色系 ＋ 暖色調（米卡其、復古赭紅、青銅綠） | 擬真古典打孔票根造型，座位圖採用細線工筆感設計，適合交響樂與歌劇。 | [`02-salon-style/`](./02-salon-style/) | 已完成 |
| 03 | 電競競技場 | 深色系 ＋ 冷色系（曜石灰、碳纖維紋、炫光金屬藍） | 支援即時選位倒數、高能動態發光按鈕，支付流程如戰術任務般俐落。 | `03-esports-style/` | 規劃中 |
| 04 | **當代雙年展** | 黑白色系（極致純黑、純白、中灰階） | 俐落無襯線字體、巨型條碼與高反差幾何方塊，展現頂級藝術策展冷靜感。 | [`04-biennale-style/`](./04-biennale-style/) | 已完成 |
| 05 | 戶外露營音樂節 | 淺色系 ＋ 暖大地（泥灰灰白、野營橘、橄欖綠） | 結合手繪地圖圖標、露營風票券卡片，購票步驟像打包裝備般親切流暢。 | `05-camping-style/` | 規劃中 |
| 06 | 嘉年華主題樂園 | 繽紛暖色 ＋ 淺色底（奶油底、糖果紅、海軍藍、鮮黃） | 票券自帶立體微陰影（Soft Shadow），入場驗證章呈現蓋印回彈微互動。 | `06-carnival-style/` | 規劃中 |

色系與視覺特點是 Notion 原文。各風格的特點要落在哪些元件（票券、票種卡、座位圖、QR Code…），見 `_wireframe/WIREFRAME_SPEC.md` §5。

「已完成」是指 2026-10 的 5 頁；2026-11 起每套要補到 10 頁（新增註冊、我的票券、電子票券詳情、購票紀錄、追蹤的主辦方），補頁進度以各風格 README 的頁面表為準。

## 每套風格的共同規範

- **技術**：只用 Bootstrap 5（Sass 變數客製）＋ Bootstrap Icons＋HTML＋CSS＋少量 JS。唯一的編譯工具是 `sass` CLI，不用 Vite 或其他打包工具，不用 Tailwind。多頁靜態 HTML，頁首、頁尾、登入 Modal 每頁完整寫一份，用 `templates/page.html`＋`scripts/check-layout.mjs` 檢查同步。`css/style.css` 與 `js/vendor/` 要提交，雙擊 `index.html` 就能看。單一主題，不用 `data-bs-theme` 切換。
- **頁面**（10 頁，檔名固定；前 5 頁是 Notion 規定的，後 5 頁是 2026-11 補的，Notion 與 wireframe 都沒有畫面，版型見 SPEC §3.05～3.09、文案見 SPEC §2.9.1～2.9.7）：

  | 頁面 | 檔名 |
  |---|---|
  | 設計 Guideline（色彩、字級階層、間距、圓角陰影、元件狀態規範、RWD 斷點與 Do／Don't 對照） | `guideline.html` |
  | 首頁 | `index.html` |
  | 活動列表 | `events.html` |
  | 活動細節（含票種選擇與選位；以「午夜噪音祭 Vol.7」示範） | `event.html` |
  | 購票確認與快速支付（含付款結果與電子票券，在頁內 `#result` 區塊） | `checkout.html` |
  | 註冊（2026-11 補；從登入 Modal 的「註冊新帳號」進入，送出後回首頁） | `register.html` |
  | 我的票券（2026-11 補；從付款結果的「查看我的票券」或頁尾進入，分頁：即將到來／已使用／已過期） | `tickets.html` |
  | 電子票券詳情（2026-11 補；從我的票券的票券卡進入，以午夜噪音祭 Vol.7 的 3 張票示範） | `ticket.html` |
  | 購票紀錄（2026-11 補；從頁尾進入，含電子發票與退票申請） | `orders.html` |
  | 追蹤的主辦方（2026-11 補；從頁尾進入） | `follows.html` |

  - 不另做登入頁（登入 Modal `#loginModal` 就是登入畫面），也不另做付款結果頁（`checkout.html` 的 `#result`）。
  - 新頁在頁首沒有對應的項目，頁首不標目前頁；頁首仍顯示「登入／註冊」（設計稿不做登入後的頁首）。
  - 新頁規格只規定區塊、內容、文案與狀態，**桌機欄數與構圖由各風格依自己既有頁面的排版語言決定**（SPEC §3.05 前的說明），3 套不要做成同一個版型只換顏色。
  - 原有 5 頁只改 3 處連結，讓新頁從流程點得進去：頁尾「我的票券」「購票紀錄」「追蹤的主辦方」、登入 Modal 的「註冊新帳號」、付款結果的「查看我的票券」（SPEC §1.1 標「2026-11 改」的列）。`guideline.html` 的內容不動。

- **版型**：以 [`_wireframe/WIREFRAME_SPEC.md`](./_wireframe/WIREFRAME_SPEC.md) 為準（區塊順序、桌機欄數、元件與狀態、RWD），資訊架構 3 套一致，只改視覺表現。2026-11 補的 5 頁欄數與構圖是建議，各風格可以調整（區塊與內容仍要一致）。
- **文案來源**：一律從 [`CONTENT.md`](./CONTENT.md) 逐字複製（Notion 原文）。wireframe 上的字只用來對照位置；Notion 沒寫的顯示欄位（列表起價、狀態標籤、座位、訂單、票號）照 `WIREFRAME_SPEC.md` §2.8～§2.9，3 套數字一致。2026-11 補頁的介面文字與示意資料（6 筆訂單、4 張票券卡、3 張電子票券、4 個追蹤的主辦方、退票試算）也在 §2.9.1～2.9.7，標「Notion 沒寫，3 套統一」。Notion 本身的不一致（例如星期幾）照 §2.10 處理，不要自行修正。
- **動態功能**：倒數、動態 QR Code、鎖位、付款 loading、付款結果都用靜態畫面＋「設計稿狀態示意」（`.demo-state`）呈現，不用 JS 跑倒數（`WIREFRAME_SPEC.md` §2.7）。自己寫的 JS 放在 `js/main.js`，必做的是「活動類型篩選」與 2026-11 補的「我的票券分頁」（也可以改用 Bootstrap Tab）；「取消追蹤」切換是選做。其他新頁的互動用 Bootstrap 內建（Tab、Carousel、Modal）或連結換頁，不另寫 JS（`WIREFRAME_SPEC.md` §2.7）。
- **頁面導覽**：頁尾不放列出所有頁面的「設計稿頁面」區塊；各頁依購票流程點進去，頁面清單寫在各風格的 README，Guideline 直接開 `guideline.html`。
- **圖片**：照 [`IMAGES.md`](./IMAGES.md) 的 22 個檔名生成到 `images/`，用風格自己的攝影調性；QR Code、條碼、座位圖、地圖、Logo 用 SVG／CSS 畫。2026-11 補的 5 頁沿用既有圖片，不生新圖（`IMAGES.md`「2026-11 補的 5 頁」）。
- **命名**：資料夾 `編號-英文風格名-style`，編號沿用 Notion 風格表（所以本次是 01、02、04，沒有 03）。`package.json` 的 `name` 用 `stageone-<編號>-<英文名>-style`，例如 `stageone-01-rave-style`。
- **檢核寬度**：每頁都在 1920、1440、1200、992、768、390 看過，沒有水平捲軸（`WIREFRAME_SPEC.md` §6 驗收清單）。

## 新增一套風格

1. 從 `../01-電商主題/` 挑一套架構最接近的當範本（深色風格用 `01-luxury-style`，淺色用 `02-muji-style`，高對比用 `03-street-style`），**只複製專案骨架**：`package.json`、`.gitignore`、`scripts/`、`scss/`（`_variables.scss`、`_base.scss`、`main.scss` 與資料夾結構）、`templates/page.html`、`js/main.js` 的寫法。電商的頁面、元件樣式與圖片都不要帶過來。放進新資料夾（例如 `01-rave-style/`），不要複製 `node_modules/`。
2. 改 `package.json` 的 `name`、`description`。
3. 重寫 `templates/page.html`：`<head>`（標題、字體、favicon、`theme-color`）、頁首（`WIREFRAME_SPEC.md` §2.2）、登入 Modal（§2.3）、頁尾（§2.4）。
4. 改 `scripts/check-layout.mjs`：頁面清單是 10 頁（腳本會讀資料夾裡所有 `.html`）；「目前頁」規則改成 `event.html` 對應 `events.html`，`checkout.html`、`guideline.html` 與 2026-11 補的 `register.html`、`tickets.html`、`ticket.html`、`orders.html`、`follows.html` 沒有目前頁（設成 `null`）；比對範圍要包含頁尾之後的登入 Modal。
5. 重寫 `scss/_variables.scss`：這是整套風格的 design token（色彩、字體、圓角、陰影、元件變數），票務專用的語意色（即將完售、售罄、選中、倒數警示、驗票成功／失敗）也在這裡定義。
6. 依 `WIREFRAME_SPEC.md` §3 做 10 個頁面（§3.00～3.04 是原有 5 頁，§3.05～3.09 是 2026-11 補的 5 頁），`scss/components/` 放共用元件（票種卡、座位圖、倒數、電子票券、QR Code…），`scss/pages/` 放各頁樣式。新頁的元件（票券卡、分頁、訂單卡、退票申請、主辦方卡、空狀態）Guideline 沒有，寫在風格 README 的「共用類別」。
7. 改 `scripts/generate-images.mjs` 的 `STYLE` 與 `JOBS`（照 `IMAGES.md`），`npm run images` 生成 22 張圖。
8. 寫風格自己的 `README.md`：風格概念、頁面清單與檔名（10 頁）、design token 摘要、共用類別、指令。
9. 用 `WIREFRAME_SPEC.md` §6 的驗收清單逐項檢查，回到本檔把「風格清單」的狀態改成「已完成」。

### 換色時同步檢查

色票的唯一來源是 `_variables.scss`，但下面幾處把數值寫成文字或寫死，改色（或改頁首高度）時要一起檢查：

- [ ] `scss/_variables.scss`：色票、`$theme-colors`、語意變數（`$body-*`、`$input-*`、`$focus-ring-color`…）與票務語意色。
- [ ] `guideline.html`：色票的 hex、對比度與用途文字；Bootstrap 主題色與語意變數的對應。
- [ ] 風格自己的 `README.md`：design token 摘要。
- [ ] 改了頁首高度時：sticky 位移（購票卡、篩選側欄、訂單明細、結帳步驟列；2026-11 補頁有做 sticky 時，還有電子票券詳情的票券欄、購票紀錄的退票申請與 `#refund` 錨點位移）與 Guideline「間距」裡的數字。
- [ ] SVG：QR Code、條碼、示意地圖、Logo、favicon 裡寫死的色碼。
- [ ] `scripts/generate-images.mjs` 的 `STYLE`：換色後重新生圖。
- [ ] `templates/page.html` 與每一頁的 `theme-color`。

## 啟動

```bash
# 每套用法相同，以 01 為例
cd 01-rave-style
open index.html  # 直接用瀏覽器看，已含編譯好的 CSS
npm install      # 要改樣式時才需要
npm run watch    # 監看 scss/ 並編譯 css/style.css
npm run check    # 檢查每頁的 head、頁首、頁尾、登入 Modal 是否與範本一致
npm run images   # 重新生成圖片（需要已登入的 codex CLI）

# 看 wireframe（需要網路載入 Bootstrap CDN）
open _wireframe/index.html
```
