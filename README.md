# 範例設計稿｜電商主題：NestCraft 原創生活家居選物

六角學院 2026 專題班的電商設計稿範例。主題是 **NestCraft 原創生活家居選物**：專為租屋族與小資家庭設計的模組化家居電商，主打「靈活收納、小坪數友善」。

同一套 wireframe、同一份文案，做成多種視覺風格。**一種風格就是一個獨立、完整的 Vite 專案**，可以單獨安裝、執行、打包。

## 目錄結構

```
範例設計稿/
├─ README.md            ← 本檔：總覽與新增風格的規則
├─ _wireframe/          ← wireframe 本地參考（純 HTML＋CSS，瀏覽器直接開 index.html）
│  ├─ README.md         ← 範圍、瀏覽方式、與原站的差異
│  ├─ WIREFRAME_SPEC.md ← 逐頁版型規格（新風格實作依據）
│  ├─ index.html        ← 頁面索引（前台必做、後台選做）
│  ├─ pages/            ← 19 個鏡像頁（前台 14、後台 5）
│  ├─ screenshots/      ← 原站全頁截圖（1440px）
│  ├─ assets/           ← 鏡像用的 CSS（css/）與字型（fonts/）
│  └─ tools/            ← mirror.mjs 重新鏡像、check-links.mjs 檢查本地參照
└─ 02-muji-style/       ← 風格 02：日系無印風（Vite + Vue 3 + Bootstrap 5）
```

`_wireframe/` 是所有風格共用的版型依據，來源為 [cartflow wireframe](https://cartflow-plum.vercel.app/)，已存成本地檔案，不必連線也能查看。

## 風格清單

| 編號 | 風格 | 色系搭配 | UI 視覺特點 | 資料夾 | 狀態 |
|---|---|---|---|---|---|
| 01 | 輕奢高定風 | 深色系＋暖金黑（曜石黑、香檳金、暖白） | 結帳卡片金屬反光質感，金流付款按鈕帶燙金邊框 | `01-luxury-style/` | 規劃中 |
| 02 | **日系無印風** | 淺色系＋暖大地（米白、淺原木、亞麻灰） | 極簡清爽的結帳清單，大面積留白，減少填寫付款資訊時的焦慮感 | [`02-muji-style/`](./02-muji-style/) | 已完成 |
| 03 | 街頭機能風 | 高對比＋冷螢光（水泥灰、深炭、螢光青綠） | 購物車粗黑外框與粗體標籤，按鈕反差極大 | `03-street-style/` | 規劃中 |
| 04 | 法式復古風 | 淺色系＋暖色調（奶油底、勃艮第紅、焦糖棕） | 優雅襯線字體，折抵標籤帶有火漆印章意象 | `04-french-style/` | 規劃中 |
| 05 | 親和無毒風 | 淺色系＋冷色調（薄荷綠、鼠尾草灰、純白） | 有機生鮮感，結帳步驟指引平滑清晰 | `05-organic-style/` | 規劃中 |
| 06 | 平價快時尚 | 高飽和＋暖色系（電光亮黃、極致純黑、白底） | 折價券倒數、大字號金額標籤，CTA 吸睛 | `06-fastfashion-style/` | 規劃中 |

## 每套風格的共同規範

- **技術**：Vite＋Vue 3 Composition API（`<script setup>`，Vue 程式碼盡量少，重點在版型）＋ Bootstrap 5（Sass 變數客製化）＋ Bootstrap Icons。不使用 Tailwind。
- **頁面**（Notion 規定的 5 頁＋前台其餘頁）：
  1. 設計 Guideline：色彩、字級階層、間距、圓角陰影、元件狀態規範、RWD 斷點與 Do／Don't 對照
  2. 首頁、商品列表、商品詳情、購物車、結帳、付款結果
  3. 登入、註冊、我的訂單
  - 以上 Guideline＋前台 9 頁為必做。wireframe 的後台 A1～A5（後台登入、商品管理、新增／編輯商品、訂單管理）為**選做**，之後再做，規格見 `_wireframe/WIREFRAME_SPEC.md` §4。
- **文案與假資料**：統一取自 Notion「設計稿範例產出文件」，放在各專案的 `src/data/products.js`。
- **命名**：資料夾以 `編號-英文風格名-style` 命名，編號沿用 Notion 風格表。

## 新增一套風格

1. 複製 `02-muji-style/` 成新資料夾（例如 `01-luxury-style/`），刪掉 `node_modules/`、`dist/`。
2. 改 `package.json` 的 `name`、`description`，以及 `index.html` 的標題、字體與 favicon。
3. 重寫 `src/scss/_variables.scss`：這是整套風格的 design token（色彩、字體、圓角、陰影、元件變數）。
4. 依風格調整 `src/scss/_base.scss`、`src/scss/components/`、`src/scss/pages/` 與各頁 `src/views/*.vue` 的版型。
5. 替換 `public/images/` 的圖片（檔名維持一致，就不用改程式）。
6. 版型以 `_wireframe/WIREFRAME_SPEC.md` 為依據，資訊架構保持一致，只改視覺表現。
7. 回到本檔，更新「風格清單」的狀態。

### 換色時同步檢查

色票的唯一來源是 `_variables.scss`，但下面幾處把數值寫成文字或寫死，改色（或改頁首高度）時要一起檢查：

- [ ] `src/scss/_variables.scss`：色票、`$theme-colors` 與語意變數（`$body-*`、`$input-*`、`$focus-ring-color`…）。
- [ ] `src/views/GuidelineView.vue`：`palette` 的 hex、對比度與用途文字，`themeColors`、`semanticTokens` 的對應；新增或刪除色票時，同步 `src/scss/pages/_guideline.scss` 的 `$gl-swatches`（色塊由它產生）。
- [ ] 風格自己的 `README.md`：Design token 摘要（02 是 `02-muji-style/README.md` 的色彩、狀態色、表單列）。
- [ ] `src/router.js`：錨點捲動的 `top` 寫死為 `$sticky-top-offset` 的 px 值（02 是 106）；改了 `$site-header-height`、`$navbar-padding-y` 或 `$sticky-top-offset` 時要同步，Guideline「間距」的頁首高度與 sticky 位移也一起改。
- [ ] `scripts/generate-images.mjs` 的 `STYLE`：整組圖片的色調與材質描述，換色後重新生圖。
- [ ] `index.html`：`theme-color` 與 favicon SVG 裡的色碼。

## 啟動任一風格

```bash
cd 02-muji-style
npm install
npm run dev      # 開發預覽
npm run build    # 打包到 dist/（相對路徑，可直接放上靜態主機）
```
