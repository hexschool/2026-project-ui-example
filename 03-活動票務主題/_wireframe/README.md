# _wireframe：活動票務主題的版型參考

這個資料夾是 StageOne 城市現場的**資訊架構與版型依據**：3 套風格（`01-rave-style`、`02-salon-style`、`04-biennale-style`）的頁面組成、區塊順序、欄數與元件狀態都以這裡為準。

- 來源：Notion「03-活動票務主題：StageOne 城市現場」頁內附的 wireframe 檔（<https://app.notion.com/p/3ee6ab47eb4880dd867bf60f71ffcd95>，〈wireframe〉一節的 `index.html` 附件）
- 下載日期：2026-10-06（Notion 頁最後編輯 2026-10-04）
- 原檔標題：「StageOne 城市現場｜活動票務系統 設計稿」，單一 HTML 檔，5 個頁面區塊用 JS 切換

## 範圍與資料來源

1. **wireframe 只提供版型與資訊架構**：有哪些頁面、區塊順序、桌機欄數、元件與狀態。它雖然有配色（奶油底、墨褐、磚紅），但那是 wireframe 自己的示意風格，**不是**任何一套風格的規格。
2. **文案以 Notion 為唯一來源**，已逐字整理在上一層的 [`../CONTENT.md`](../CONTENT.md)。wireframe 上有不少字是自己改寫或補的（例如「為什麼在這裡買票比較安心？」「02 天 05:12:48」「@late_night_gigs_」），兩者不一致時以 Notion 為準，對照表在 `WIREFRAME_SPEC.md` §4。
3. **每套共 10 頁**。Notion 規定的 5 頁（設計 Guideline、首頁、活動列表、活動細節、購票確認與快速支付）剛好就是 wireframe 的 5 個頁面區塊；付款結果與電子票券依 wireframe 放在結帳頁下方的頁內區塊，不另開頁。2026-11 補的 5 頁（註冊、我的票券、電子票券詳情、購票紀錄、追蹤的主辦方）**wireframe 沒有、也沒有截圖**，版型直接看 `WIREFRAME_SPEC.md` §3.05～3.09，文案與示意資料看 §2.9.1～2.9.7。登入仍用共用的登入 Modal，不另做登入頁。主辦方後台、行動驗票工具與帳號設定仍是第二階段，不做。
4. wireframe 的設計稿工具列、頁首的設計稿頁面導覽、頁尾的「設計稿」欄、「設計註」標註，都是給審稿用的，**不要做進正式頁面**。

## 怎麼瀏覽

直接用瀏覽器開啟 **`index.html`**（雙擊或拖進瀏覽器）。

- **需要網路**：檔案從 CDN 載入 Bootstrap 5.3.3（`cdn.jsdelivr.net`）。離線時版面會跑掉，這時看 `screenshots/` 即可。
- **切換頁面**：點頁首的「設計 Guideline／首頁／活動列表／活動細節／購票與付款」，或直接在網址後面加 hash：

  | 頁面 | 網址 hash | 頁面區塊 id | 截圖 |
  |---|---|---|---|
  | 設計 Guideline | `index.html#guideline` | `#page-guideline` | `screenshots/guideline.png` |
  | 首頁 | `index.html#home`（預設） | `#page-home` | `screenshots/home.png` |
  | 活動列表 | `index.html#events` | `#page-events` | `screenshots/events.png` |
  | 活動細節 | `index.html#event` | `#page-event` | `screenshots/event.png` |
  | 購票與付款 | `index.html#checkout` | `#page-checkout` | `screenshots/checkout.png` |

- **設計標註**：勾選最上方深色工具列的「顯示設計標註」，會出現淺棕色的「設計註」框，說明 hover、手機版、狀態切換等行為。截圖資料夾另有一份 `<頁>-notes.png` 是打開標註的版本。標註的內容已整理進 `WIREFRAME_SPEC.md` 各頁的〈互動與狀態〉與〈RWD〉。
- 工具列右邊會顯示目前的 Bootstrap 斷點（xs～xxl）與視窗寬度，縮放視窗時可以對照。

## 檔案結構

```
_wireframe/
├─ index.html          ← Notion 附件原檔（未修改，外部只引用 Bootstrap 5.3.3 CDN）
├─ WIREFRAME_SPEC.md   ← 逐頁版型規格（3 套風格的實作依據，從這裡開始讀）
├─ README.md           ← 本檔
└─ screenshots/        ← 1440px 寬全頁截圖，淺色模式（只有 wireframe 的 5 頁；2026-11 補的 5 頁沒有）
   ├─ guideline.png      guideline-notes.png
   ├─ home.png           home-notes.png
   ├─ events.png         events-notes.png
   ├─ event.png          event-notes.png
   └─ checkout.png       checkout-notes.png
```

## 注意事項

- **不要修改 `index.html`**，它要忠實反映 Notion 的附件。要調整規格請改 `WIREFRAME_SPEC.md`。
- wireframe 頁尾的「純線框版本」連到 `wireframe-plain.html`，這個檔案 Notion 沒有附，點了會 404，可以忽略。
- wireframe 的頁面上同時並排了一些本來不會同時出現的狀態（例如結帳頁的一般與警示步驟列、成功與失敗結果、已選座位與選位衝突），這是為了審稿。正式頁面用「設計稿狀態示意」區塊呈現，規則見 `WIREFRAME_SPEC.md` §2.5 DemoState 與 §2.7。
- wireframe 自己的 Guideline「RWD 斷點」表有幾格和頁面實際版型矛盾（活動列表卡、首頁情境卡的欄數），以 `WIREFRAME_SPEC.md` 各頁的〈RWD〉為準。
- Notion 的日期星期幾是照 2025 年的日曆寫的（例如 2026/10/18 寫成星期六，實際是星期日），文案照抄、不修正，說明在 `WIREFRAME_SPEC.md` §2.10。

## 重新截圖

截圖用 Playwright 的 `chrome-headless-shell`（不要用 Google Chrome.app，會讓 Dock 圖示跳動）。headless shell 在這台機器上連不到 CDN，截圖時要先把 Bootstrap 5.3.3 的 CSS／JS 下載到本機，再用 `context.route()` 攔截 CDN 網址回應本機檔案（`index.html` 本身不改）。做法：

1. 下載 `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css` 與 `.../js/bootstrap.bundle.min.js`。
2. 開 1440×900、`colorScheme: 'light'` 的頁面，`route` 這兩個網址到本機檔。
3. 對每個頁面：設定 `location.hash`，切換 `body.no-notes` 與 `#toggleNote`，`page.screenshot({ fullPage: true })`。
4. 檢查 `.page.active` 的 id 是否是要截的頁面，避免切換失敗時截到首頁。
