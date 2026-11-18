# _wireframe：共用的線框圖參考

這個資料夾是電商設計稿的**資訊架構與版型依據**：所有風格（`02-muji-style` 以及之後的各套主題）的頁面組成、區塊順序與欄數都以這裡為準。它本身不需要安裝任何東西，瀏覽器直接開就能看。

- 來源：<https://cartflow-plum.vercel.app/>（v0 產生、Next.js SSR 的低保真線框圖，原站標題「居所家具選物 — 電商流程線框圖」）
- 鏡像日期：2026-09-23，共 19 個鏡像頁：前台 14 個（9 種頁面，其中商品內頁有 p-1001～p-1006 六個），後台 5 個

## 範圍與資料來源

1. **wireframe 只提供資訊架構與版型**：頁面有哪些、區塊順序、桌機欄數、元件與互動狀態。視覺風格由各風格自己決定。
2. **商品、分類、首頁文案以 Notion「設計稿範例產出文件」為唯一來源**，逐字使用（10 件商品、7 個分類含「全部」、首頁 5 個區塊的文案；01～06 直接寫在各頁 HTML）。wireframe 裡的品牌「居所家具」、商品 A～F、金額、庫存、訂單都只是**版型佔位**，不要照抄。品牌一律是 **NestCraft 原創生活家居選物**。
3. **本次必做**：設計 Guideline（wireframe 沒有這一頁，內容見 `WIREFRAME_SPEC.md` §1）＋前台 9 頁（首頁、商品列表、商品詳情、購物車、結帳、付款結果、登入、註冊、我的訂單）。**後台 A1～A5 為選做／之後再做**。
4. wireframe 上的文字箭頭（→、←、›）、英文全大寫眉標、ROOM 01／02／03 編號、用「·」串起來的資訊列、等寬字標籤，都是線框圖的標記，**不要照搬成文案或樣式**。
5. 每套風格是一個獨立的專案（技術組合依各風格需求，01～06 都是 Bootstrap＋HTML＋CSS＋JS），資料夾命名為 `編號-英文風格名-style`（例如 `02-muji-style`），新增方式見上一層的 [`../README.md`](../README.md)。

## 怎麼瀏覽

直接用瀏覽器開啟 **`index.html`**（雙擊或拖進瀏覽器），不需要伺服器。

- `index.html`：頁面索引，分成「使用者流程（前台，必做）」與「管理者流程（後台，選做）」兩組，每頁都有縮圖、一句話說明、頁面連結與全頁截圖連結。
- 每個鏡像頁最上方有一條細列「← 回到頁面索引」，右邊顯示原站路徑。頁面內的連結（頁首導覽、頁尾畫面索引、商品卡等）都已改成本地相對路徑，可以在鏡像頁之間直接點來點去。
- 實作新風格時，搭配 **`WIREFRAME_SPEC.md`** 閱讀：裡面逐頁列出區塊順序、桌機欄數、元件、互動狀態與 RWD 規則，另外附 Bootstrap 5 對照、Notion 商品摘要與實作檢核清單。

## 檔案結構

```
_wireframe/
├─ index.html                  ← 頁面索引（從這裡開始）
├─ WIREFRAME_SPEC.md           ← 逐頁版型規格（實作新風格的依據）
├─ README.md                   ← 本檔
├─ pages/                      ← 19 個鏡像頁（純 HTML，檔名把路由的 / 換成 -）
│  ├─ home.html                  /
│  ├─ products.html              /products
│  ├─ product-p-1001.html        /product/p-1001（p-1001 到 p-1006 共 6 頁）
│  ├─ cart.html                  /cart
│  ├─ checkout.html              /checkout
│  ├─ order-result.html          /order-result
│  ├─ login.html                 /login
│  ├─ register.html              /register
│  ├─ orders.html                /orders
│  ├─ admin-login.html           /admin/login               （後台，選做）
│  ├─ admin.html                 /admin                     （後台，選做）
│  ├─ admin-products-new.html    /admin/products/new        （後台，選做）
│  ├─ admin-products-p-1001-edit.html  /admin/products/p-1001/edit（後台，選做）
│  └─ admin-orders.html          /admin/orders              （後台，選做）
├─ assets/
│  ├─ css/wireframe.css        ← 原站編譯後的 CSS（Tailwind v4），只移除了深色模式、改了字型路徑
│  ├─ css/mirror.css           ← 鏡像專用的附加樣式（強制淺色、「回到頁面索引」細列）
│  └─ fonts/*.woff2            ← Geist／Geist Mono 字型（11 個 unicode-range 子集）
├─ screenshots/                ← 原站全頁截圖，1440px 寬、淺色模式，檔名與 pages/ 相同
└─ tools/
   ├─ mirror.mjs               ← 從原站重新鏡像 pages/ 與 assets/
   └─ check-links.mjs          ← 檢查本地參照都存在，且沒有外部請求、script 或 inline 事件
```

## 與原站的差異

| 項目 | 原站 | 本地鏡像 |
|---|---|---|
| JavaScript | Next.js／React（含 RSC payload `self.__next_f.push`） | **全部移除**。所有 `<script>`、`<link rel="preload">`（script、font）、`next-size-adjust`、React Suspense 註解與 `<template>` 標記都拿掉了；`check-links.mjs` 會檢查沒有 `<script>`、inline 事件（`onclick=` 等）與 `javascript:` 網址 |
| 互動 | 下拉選單、數量增減、分頁籤等由 React 控制 | **不會動**，只呈現伺服器渲染的初始畫面，例如訂單管理的狀態下拉打不開、數量 ＋／− 按了沒反應 |
| 連結 | `/products`、`/#featured`… | 改成相對路徑：`products.html`、`home.html#featured`… |
| 沒有鏡像的頁面 | `/admin/products/p-1002/edit` 等 | 一律指向 `admin-products-p-1001-edit.html`（原站只提供 p-1001 的編輯頁版型） |
| 深色模式 | CSS 有 `@media (prefers-color-scheme: dark)`，作業系統是深色時頁面會變深色，頁尾出現「淺底白字」 | **已移除**深色模式區塊與 `.dark` 變數，不論作業系統設定如何都是淺色 |
| 字型 | 從 `/_next/static/media/` 載入 | 下載到 `assets/fonts/`，CSS 改成相對路徑 |
| 外部請求 | 有 | **沒有**，可完全離線瀏覽（`check-links.mjs` 不允許任何外部網址） |
| 頁面頂端 | 無 | 多一條 28px 細列「← 回到頁面索引」（樣式在 `mirror.css`）。原站根容器是 `min-h-dvh`，`mirror.css` 把它的最小高度扣掉 28px，所以短頁（登入、購物車、後台…）仍剛好一個視窗高、頁尾貼底，不會多出一段捲動 |

除了上表，所有版面 markup 與 class 都和原站相同。本地頁面（隱藏細列後）與 `screenshots/` 的原站截圖逐頁比對，版面一致，只有文字反鋸齒造成的零星像素差異（數量依截圖工具而定）。

## 維護

需要 Node 18 以上：

```bash
# 從原站重新抓取所有頁面、CSS、字型（會覆寫 pages/ 與 assets/css/wireframe.css、assets/fonts/）
node tools/mirror.mjs

# 檢查 index.html、pages/*.html、assets/css/*.css：本地參照都存在、沒有外部網址、script 或 inline 事件
node tools/check-links.mjs
```

- 原站若新增頁面，要在 `tools/mirror.mjs` 的 `PAGES` 清單加上路由與檔名，並同步更新 `index.html` 與 `WIREFRAME_SPEC.md`。
- `screenshots/` 不會被腳本更新；原站改版後，請用 1440px 寬、淺色模式重新截圖。
- 請不要手動修改 `assets/css/wireframe.css` 與 `pages/*.html`（它們要忠實反映原站）；鏡像才需要的樣式都寫在 `mirror.css`。
