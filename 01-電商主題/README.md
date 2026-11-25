# 01 電商主題：NestCraft 原創生活家居選物

六角學院 2026 專題班的電商設計稿範例。主題是 **NestCraft 原創生活家居選物**：專為租屋族與小資家庭設計的模組化家居電商，主打「靈活收納、小坪數友善」。

同一套 wireframe、同一份文案，做成多種視覺風格。**一種風格就是一個獨立、完整的專案**，可以單獨安裝、執行。目前 01～06 都只用 Bootstrap＋HTML＋CSS＋JS，不用打包工具；之後的風格若有不同的技術需求，可以各自決定。

## 目錄結構

```
01-電商主題/
├─ README.md             ← 本檔：總覽與新增風格的規則
├─ _wireframe/           ← wireframe 本地參考（純 HTML＋CSS，瀏覽器直接開 index.html）
│  ├─ README.md          ← 範圍、瀏覽方式、與原站的差異
│  ├─ WIREFRAME_SPEC.md  ← 逐頁版型規格（新風格實作依據）
│  ├─ index.html         ← 頁面索引（前台必做、後台選做）
│  ├─ pages/             ← 19 個鏡像頁（前台 14、後台 5）
│  ├─ screenshots/       ← 原站全頁截圖（1440px）
│  ├─ assets/            ← 鏡像用的 CSS（css/）與字型（fonts/）
│  └─ tools/             ← mirror.mjs 重新鏡像、check-links.mjs 檢查本地參照
├─ 01-luxury-style/      ← 風格 01：輕奢高定風（Bootstrap 5 + HTML + CSS + JS，無打包工具）
├─ 02-muji-style/        ← 風格 02：日系無印風（Bootstrap 5 + HTML + CSS + JS，無打包工具）
├─ 03-street-style/      ← 風格 03：街頭機能風（Bootstrap 5 + HTML + CSS + JS，無打包工具）
├─ 04-french-style/      ← 風格 04：法式復古風（Bootstrap 5 + HTML + CSS + JS，無打包工具）
├─ 05-organic-style/     ← 風格 05：親和無毒風（Bootstrap 5 + HTML + CSS + JS，無打包工具）
└─ 06-fastfashion-style/ ← 風格 06：平價快時尚（Bootstrap 5 + HTML + CSS + JS，無打包工具）
```

`_wireframe/` 是所有風格共用的版型依據，來源為 [cartflow wireframe](https://cartflow-plum.vercel.app/)，已存成本地檔案，不必連線也能查看。

## 風格清單

| 編號 | 風格 | 色系搭配 | UI 視覺特點 | 資料夾 | 狀態 |
|---|---|---|---|---|---|
| 01 | **輕奢高定風** | 深色系＋暖金黑（曜石黑、香檳金、暖白） | 結帳卡片金屬反光質感，金流付款按鈕帶燙金邊框 | [`01-luxury-style/`](./01-luxury-style/) | 已完成 |
| 02 | **日系無印風** | 淺色系＋暖大地（米白、淺原木、亞麻灰） | 極簡清爽的結帳清單，大面積留白，減少填寫付款資訊時的焦慮感 | [`02-muji-style/`](./02-muji-style/) | 已完成 |
| 03 | **街頭機能風** | 高對比＋冷螢光（水泥灰、深炭、螢光青綠） | 購物車粗黑外框與粗體標籤，按鈕反差極大 | [`03-street-style/`](./03-street-style/) | 已完成 |
| 04 | **法式復古風** | 淺色系＋暖色調（奶油底、勃艮第紅、焦糖棕） | 優雅襯線字體，折抵標籤帶有火漆印章意象 | [`04-french-style/`](./04-french-style/) | 已完成 |
| 05 | **親和無毒風** | 淺色系＋冷色調（薄荷綠、鼠尾草灰、純白） | 有機生鮮感，結帳步驟指引平滑清晰 | [`05-organic-style/`](./05-organic-style/) | 已完成 |
| 06 | **平價快時尚** | 高飽和＋暖色系（電光亮黃、極致純黑、白底） | 折價券倒數、大字號金額標籤，CTA 吸睛 | [`06-fastfashion-style/`](./06-fastfashion-style/) | 已完成 |

## 每套風格的共同規範

- **技術**：一律使用 Bootstrap 5（Sass 變數客製化）＋ Bootstrap Icons，不使用 Tailwind。其餘依各風格的需求：

  | 風格 | 技術組合 | 頁面組成 | 啟動 |
  |---|---|---|---|
  | 01 輕奢高定風 | 只有 Bootstrap＋HTML＋CSS＋JS，唯一的編譯工具是 `sass` CLI；單一深色主題 | 多頁靜態 HTML，頁首頁尾每頁一份 | 直接打開 `index.html`；改樣式用 `npm run watch` |
  | 02 日系無印風 | 只有 Bootstrap＋HTML＋CSS＋JS，唯一的編譯工具是 `sass` CLI | 多頁靜態 HTML，頁首頁尾每頁一份 | 直接打開 `index.html`；改樣式用 `npm run watch` |
  | 03 街頭機能風 | 同上 | 同上 | 同上 |
  | 04 法式復古風 | 同上 | 同上 | 同上 |
  | 05 親和無毒風 | 同上 | 同上 | 同上 |
  | 06 平價快時尚 | 同上 | 同上 | 同上 |
- **頁面**（Notion 規定的 5 頁＋前台其餘頁）：
  1. 設計 Guideline：色彩、字級階層、間距、圓角陰影、元件狀態規範、RWD 斷點與 Do／Don't 對照
  2. 首頁、商品列表、商品詳情、購物車、結帳、付款結果
  3. 登入、註冊、我的訂單
  - 以上 Guideline＋前台 9 頁為必做。wireframe 的後台 A1～A5（後台登入、商品管理、新增／編輯商品、訂單管理）為**選做**，之後再做，規格見 `_wireframe/WIREFRAME_SPEC.md` §4。
- **文案與假資料**：統一取自 Notion「設計稿範例產出文件」，直接寫在各 `.html`，01～06 的數值一致（購物車 4 件、NT$ 20,250）。
- **頁面導覽**：頁尾不放列出所有頁面的「設計稿頁面」區塊，各頁從首頁依購物流程點進去；頁面清單寫在各風格的 README。
- **我的訂單**：上方的狀態列（全部、待付款…已取消）要能實際切換，點了只顯示該狀態的訂單，方便逐一檢視 5 種狀態（`js/main.js` 的篩選按鈕）。
- **命名**：資料夾以 `編號-英文風格名-style` 命名，編號沿用 Notion 風格表。

## 新增一套風格

1. 從 `01-luxury-style/`～`06-fastfashion-style/` 複製一套（六套架構相同，挑風格較接近的那套；深色主題從 01 開始最省事），放進新資料夾（命名照上方「命名」規則），刪掉 `node_modules/`。需要 Vite＋Vue 版本時，可以從 git 歷史 commit `0bbabd8` 的 `02-muji-style/` 取出舊版當範本。
2. 改 `package.json` 的 `name`、`description`，以及頁面的標題、字體與 favicon：先改 `templates/page.html` 再同步到每一頁，改完執行 `npm run check`。
3. 重寫 `scss/_variables.scss`：這是整套風格的 design token（色彩、字體、圓角、陰影、元件變數）。
4. 依風格調整 `_base.scss`、`components/`、`pages/` 與各個 `.html` 的版型。
5. 替換 `images/` 的圖片（檔名維持一致就不用改 HTML）。可改 `scripts/generate-images.mjs` 的 `STYLE` 重新生成。
6. 版型以 `_wireframe/WIREFRAME_SPEC.md` 為依據，資訊架構保持一致，只改視覺表現。
7. 回到本檔，更新「風格清單」的狀態。
8. 到根目錄的總目錄與預覽外框登記這套風格，步驟見[根目錄 README](../README.md)「新增風格或頁面時」。

### 換色時同步檢查

色票的唯一來源是 `_variables.scss`，但下面幾處把數值寫成文字或寫死，改色（或改頁首高度）時要一起檢查：

- [ ] `scss/_variables.scss`：色票、`$theme-colors` 與語意變數（`$body-*`、`$input-*`、`$focus-ring-color`…）。
- [ ] `guideline.html`：色票的 hex、對比度與用途文字，Bootstrap 主題色與語意變數的對應；新增或刪除色票時，同步 `scss/pages/_guideline.scss` 的色塊設定。
- [ ] 風格自己的 `README.md`：Design token 摘要（02 是 `02-muji-style/README.md` 的色彩、狀態色、表單列）。
- [ ] 改了頁首高度（`$site-header-height`、`$navbar-padding-y` 或 `$sticky-top-offset`）時，Guideline「間距」的頁首高度與 sticky 位移文字也一起改。
- [ ] `scripts/generate-images.mjs` 的 `STYLE`：整組圖片的色調與材質描述，換色後重新生圖。
- [ ] `templates/page.html` 與每一頁的 `theme-color`，以及 `images/favicon.svg` 裡的色碼。

## 啟動

```bash
# 01～06 用法相同，以 02 為例
cd 02-muji-style
open index.html  # 直接用瀏覽器看，已含編譯好的 CSS
npm install      # 要改樣式時才需要
npm run watch    # 監看 scss/ 並編譯 css/style.css
npm run check    # 檢查每頁的 head、頁首、頁尾是否與範本一致
```
