/* ============================================================
   範例站外框（每一頁設計稿的 <head> 都會載入這支）
   1. 直接打開設計稿時：轉到 preview.html，畫面一定有外框，不會被當成真的網站
   2. 已經在外框的 iframe 裡時：回報目前位置，外框的工具列與網址才會跟著換頁
   風格資料夾單獨複製到別的專案後，找不到這支檔案，頁面照常顯示；載入它的那兩行可以直接刪掉
   ============================================================ */
(() => {
  // 範例站根目錄（這支檔案的上一層）；用網址推算，所以雙擊開檔（file://）與架在網站上都適用
  const root = new URL('../', document.currentScript.src)
  // 這一頁在範例站裡的位置，例如 01-電商主題/02-muji-style/products.html?craft=pottery#list
  const here = () => location.pathname.slice(root.pathname.length) + location.search + location.hash

  // 外框的 iframe 有固定名稱；嵌在別的地方（例如編輯器的預覽面板）不算在外框裡，一樣轉過去
  if (window.top === window.self || window.name !== 'ui-preview') {
    if (navigator.webdriver) return // 自動化瀏覽器（Playwright、Puppeteer）截圖、量寬度時，要看的是設計稿本身
    document.documentElement.style.visibility = 'hidden' // 轉頁前不要閃過沒有外框的畫面
    location.replace(root.href + 'preview.html#' + here())
    return
  }

  // 從檔案直接打開時，瀏覽器把 iframe 與外框當成不同來源，回報只能用 postMessage
  const report = () => window.parent.postMessage({ type: 'ui-preview', at: here() }, '*')
  report()
  window.addEventListener('pageshow', report)
  window.addEventListener('hashchange', report)
  // 有些頁面的「設計稿切換器」用 history.replaceState 換網址，不會觸發上面的事件，所以點擊後再回報一次
  document.addEventListener('click', () => setTimeout(report))

  // 不同來源的 iframe 裡，沒指定 root 的 IntersectionObserver 會忽略 rootMargin（Bootstrap ScrollSpy 的目錄標示會錯位）；
  // 改以這份文件當 root，結果就和單獨打開頁面時一樣
  const Native = window.IntersectionObserver
  window.IntersectionObserver = class extends Native {
    constructor(callback, options = {}) {
      super(callback, { ...options, root: options.root || document })
    }
  }
})()
