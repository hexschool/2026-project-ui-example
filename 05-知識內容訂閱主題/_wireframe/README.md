# _wireframe：共用的線框圖參考

這個資料夾是「現場筆記 FieldNotes」設計稿的**資訊架構與版型依據**：所有風格（`01-typewriter-style`、`03-thinktank-style`、`04-slow-reading-style` 以及之後的各套）的頁面組成、區塊與內容都以這裡為準；桌機欄數與區塊的排列構圖是建議，各風格可以依自己的排版語言調整（2026-11-17 起，見 `WIREFRAME_SPEC.md` §0）。

- 來源：Notion「05-知識內容訂閱主題：現場筆記 FieldNotes」頁面內嵌的 `index.html`（<https://app.notion.com/p/3ef6ab47eb4880deba15e50c5092ec08>）
- 下載日期：2026-10-06（Notion 頁面最後編輯 2026-10-04）；`index.html` 是**原樣保存**，沒有改過任何一個字元
- 形式：**單一 HTML 檔**，裡面有 5 個頁面區塊（`page-guideline`、`page-home`、`page-content`、`page-pricing`、`page-account`），用網址 hash 切換；`page-content` 又分「文章列表」「文章內頁」兩個子檢視

## 範圍與資料來源

1. **wireframe 只提供資訊架構與版型**：頁面有哪些、區塊順序、元件與互動狀態照做；桌機欄數與構圖是建議（`WIREFRAME_SPEC.md` §0）。它雖然已經上了色（奶油底、磚紅、襯線標題），**但那不是任何一套風格的視覺規格**，各風格的配色、字體要依 Notion 風格表自己定義（見 `WIREFRAME_SPEC.md` §0.1）。
2. **文案以 Notion 為唯一來源**，已逐字整理在上一層的 [`../CONTENT.md`](../CONTENT.md)。wireframe 有幾處把 Notion 的「配置理念」當成副標、補了自己的文字或資料，差異與決定列在 `WIREFRAME_SPEC.md` §8。
3. **本次的頁面與檔名**（共 10 頁）：`guideline.html`、`index.html`、`articles.html`、`article.html`、`pricing.html`、`account.html`（Notion 的「知識內容說明」拆成列表與內頁兩個檔案），以及 2026-11 補的 `login.html`、`register.html`、`author.html`、`forgot-password.html`。後 4 頁 wireframe 沒有，規格見 `WIREFRAME_SPEC.md` §3.06～3.09。
4. wireframe 裡的設計稿工具列、頁首的頁面清單、頁尾的「設計稿」欄、「設計註」、英文眉標、emoji 圖示都是線框圖的標記，**不要照搬**（`WIREFRAME_SPEC.md` §0.1）。

## 怎麼瀏覽

直接用瀏覽器開啟 **`index.html`**。頁面從 jsDelivr 載入 Bootstrap 5.3.3 的 CSS 與 JS（原檔如此，保留外部 CDN），**需要網路**；離線時版面會亂掉，請改看 `screenshots/`。

| 頁面區塊 | 網址 | 對應的正式檔案 | 截圖 |
|---|---|---|---|
| 設計 Guideline | `index.html#guideline` | `guideline.html` | `screenshots/guideline.png` |
| 首頁 | `index.html#home`（預設） | `index.html` | `screenshots/home.png` |
| 文章列表 | `index.html#articles` | `articles.html` | `screenshots/articles.png` |
| 文章內頁 | `index.html#article` | `article.html` | `screenshots/article.png` |
| 訂閱方案 | `index.html#pricing` | `pricing.html` | `screenshots/pricing.png` |
| 個人頁面 | `index.html#account` | `account.html` | `screenshots/account.png`（全部顯示）、`account-reader.png`、`account-author.png`、`account-admin.png` |

- **設計註**：勾選最上方深色工具列的「顯示設計標註」，每個區塊下方會出現「設計註」，說明為什麼這樣設計（例如付費牆為什麼不硬切、比較表為什麼手機不拆卡片）。實作前建議打開讀一遍，重點已整理進 `WIREFRAME_SPEC.md`。截圖是**未勾選**的狀態。
- **角色切換**：個人頁面右上「檢視角色（設計稿切換器）」可切換全部顯示／讀者／作者／管理員。
- **月／年切換**：訂閱方案頁的「月繳｜年繳（省兩個月）」會顯示省多少錢的提示；FAQ 可以展開收合。
- 工具列右側會即時顯示目前的 Bootstrap 斷點，方便調整視窗寬度時對照 RWD。

## 檔案結構

```
_wireframe/
├─ index.html          ← wireframe 原檔（Notion 下載，原樣保存）
├─ README.md           ← 本檔
├─ WIREFRAME_SPEC.md   ← 逐頁版型規格（實作新風格的依據）
├─ screenshots/        ← 1440px 寬全頁截圖（設計註未勾選）
│  ├─ guideline.png
│  ├─ home.png
│  ├─ articles.png
│  ├─ article.png
│  ├─ pricing.png
│  ├─ account.png         （角色：全部顯示）
│  ├─ account-reader.png  （角色：讀者）
│  ├─ account-author.png  （角色：作者）
│  └─ account-admin.png   （角色：管理員）
└─ tools/
   └─ screenshot.mjs   ← 重新產生 screenshots/
```

## 與正式頁面的差異（一覽）

| 項目 | wireframe | 各風格的正式頁面 |
|---|---|---|
| 檔案 | 1 個 HTML，hash 切換 5 個區塊 | 10 個獨立 HTML（多頁靜態網站；其中登入、註冊、作者個人頁、忘記密碼是 2026-11 補的，wireframe 沒有） |
| 樣式 | `<style>` 內嵌＋ CDN 的 Bootstrap 預設樣式 | Bootstrap 5 Sass 變數客製，sass CLI 編譯成 `css/style.css` |
| 頁首 | 列出所有設計稿頁面＋「登入 / 註冊」 | 首頁、文章列表、訂閱方案＋搜尋＋會員入口（不放登入／註冊，示意使用者已登入） |
| 頁尾 | 第 5 欄「設計稿」 | 不放設計稿頁面導覽 |
| 圖片 | 漸層佔位框、字首頭像 | `IMAGES.md` 的 17 張照片＋字首頭像 |
| 圖示 | emoji 與文字元 | Bootstrap Icons |
| 角色切換 | 全部顯示／讀者／作者／管理員 | 讀者／作者／管理員（預設讀者，支援 `?role=`） |
| 文章訂閱狀態 | 只有未訂閱，已訂閱只在 Guideline 示意 | 設計稿切換器「未訂閱｜已訂閱」（支援 `?view=subscribed`） |

## 維護

重新截圖（Notion 的 wireframe 更新後，先把新檔覆蓋 `index.html`）：

```bash
node tools/screenshot.mjs
```

需要 Node 18 以上與 Playwright（腳本開頭說明了 `PLAYWRIGHT_MODULES`、`HEADLESS_SHELL` 兩個環境變數）。macOS 請用 Playwright 的 `chrome-headless-shell`，不要用 Google Chrome.app 的 headless（每次啟動 Dock 圖示會跳動）。

請不要手動修改 `index.html`，它要忠實反映 Notion 上的版本；修正與決定都寫在 `WIREFRAME_SPEC.md`。
