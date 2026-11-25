/* ============================================================
   總目錄：把 catalog.js 的主題與風格畫成縮圖清單
   index.html 的「總目錄」與預覽頁的總目錄側欄共用；要改主題、風格或頁面，請改 catalog.js
   <div data-directory data-home="index.html"></div>
   data-home：主題說明在哪一頁（在 index.html 本身留空）
   ============================================================ */
window.UI_DIRECTORY = (() => {
  const { themes } = window.UI_CATALOG

  // 預覽頁網址：preview.html#主題代號/風格資料夾/頁面，例如 preview.html#ecommerce/02-muji-style/products
  const previewHref = (theme, style, file = 'index.html') =>
    `preview.html#${theme.slug}/${style.dir}/${file.replace('.html', '')}`

  const styleItem = (theme, style) => `
        <li>
          <a class="dir-style" href="${previewHref(theme, style)}" data-style="${theme.slug}/${style.dir}">
            <img src="_overview/thumbs/${theme.no}-${style.dir}.jpg" alt="" width="960" height="600" loading="lazy">
            <span class="dir-name"><span class="num">${style.no}</span> ${style.name}</span>
          </a>
        </li>`

  const themeItem = (theme, home) => `
      <li class="dir-theme">
        <div class="dir-head">
          <h3><span class="num">${theme.no}</span> ${theme.name}</h3>
          <p class="dir-brand text-phrase">${theme.brand} ${theme.tagline}</p>
          <a class="dir-more" href="${home}#${theme.slug}"><span class="visually-hidden">${theme.name}：</span>各風格的色系與特點</a>
        </div>
        <ul class="dir-styles" aria-label="${theme.name}的風格">${theme.styles.map((style) => styleItem(theme, style)).join('')}
        </ul>
      </li>`

  for (const box of document.querySelectorAll('[data-directory]')) {
    const home = box.dataset.home || ''
    box.innerHTML = `<ol class="dir">${themes.map((theme) => themeItem(theme, home)).join('')}</ol>`
  }

  return { previewHref }
})()
