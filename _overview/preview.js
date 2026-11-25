/* ============================================================
   預覽頁：把設計稿放進外框裡的 iframe
   - 網址的 # 後面是目前的設計稿：主題代號/風格資料夾/頁面（見 directory.js 的 previewHref）
   - 換頁只動 iframe；iframe 裡的 frame-guard.js 回報位置後，再更新工具列與網址。
     這樣不管是按工具列，或在設計稿裡點連結，瀏覽器的上一頁都只要按一次
   ============================================================ */
(() => {
  const { repo, themes } = window.UI_CATALOG
  const { previewHref } = window.UI_DIRECTORY
  const $ = (id) => document.getElementById(id)
  const frame = $('frame')
  const canvas = $('canvas')
  const directory = $('directory')
  const pageSelect = $('pageSelect')
  const deviceButtons = document.querySelectorAll('[data-device-button]')
  let current = null // { theme, style, file, query, anchor }

  // ---------- 網址 ⇄ 設計稿 ----------

  // 主題可以是代號（ecommerce）或資料夾名稱（01-電商主題，frame-guard.js 回報的是實際路徑），頁面有沒有 .html 都可以；
  // 只認目錄裡有的頁面，其他一律回傳 null，iframe 不會載入範例站以外的網址
  function parse(text) {
    const match = /^#?([^?#]*)(\?[^#]*)?(#.*)?$/.exec(text)
    if (!match) return null
    const [, path, query = '', anchor = ''] = match
    let parts
    try {
      parts = path.split('/').map((part) => decodeURIComponent(part))
    } catch {
      return null
    }
    const [themeKey, styleKey, pageKey] = parts
    const theme = themes.find((item) => item.slug === themeKey || item.dir === themeKey)
    const style = theme?.styles.find((item) => item.dir === styleKey)
    const file = (pageKey || 'index').replace(/\.html$/, '') + '.html'
    if (!style || !theme.pages.some((page) => page.file === file)) return null
    return { theme, style, file, query, anchor }
  }

  // 目錄裡的頁面；有列出的狀態（例如 article.html?view=subscribed）算一頁，其他查詢字串（例如篩選條件）不算
  const pageOf = ({ theme, file, query }) =>
    theme.pages.find((page) => page.file === file + query) || theme.pages.find((page) => page.file === file)

  const frameUrl = ({ theme, style, file, query, anchor }) =>
    encodeURI(`${theme.dir}/${style.dir}/${file}`) + query + anchor

  // ---------- 換設計稿 ----------

  function go(target) {
    frame.src = frameUrl(target)
    sync(target)
  }

  // 工具列、總目錄、標題與網址跟著目前的設計稿走
  function sync(target) {
    const { theme, style, file, query, anchor } = target
    const page = pageOf(target)
    // 目錄有列出的狀態，以及設計稿用網址帶的狀態（角色、已訂閱、分類）留在網址；其他查詢字串（例如表單送出的姓名、Email）不留
    const state = page.file === file + query || /^\?(role|view|craft)=[\w-]+$/.test(query) ? query : ''

    frame.hidden = false
    $('missing').hidden = true

    $('themeName').textContent = theme.name
    $('styleName').textContent = `${style.no} ${style.name}`
    $('sourceLink').href = `${repo}${encodeURIComponent(theme.dir)}/${style.dir}`
    setNeighbor($('prevStyle'), -1)
    setNeighbor($('nextStyle'), 1)

    if (current?.theme !== theme) {
      pageSelect.replaceChildren(...theme.pages.map((item) => new Option(item.name, item.file)))
    }
    pageSelect.value = page.file

    for (const link of directory.querySelectorAll('[data-style]')) {
      if (link.dataset.style === `${theme.slug}/${style.dir}`) link.setAttribute('aria-current', 'true')
      else link.removeAttribute('aria-current')
    }

    frame.title = `設計稿範例：${style.name}，${page.name}`
    document.title = `${style.name}：${page.name}（設計稿範例）｜UI 風格範例站`
    current = target
    history.replaceState(null, '', previewHref(theme, style, file + state) + (anchor === '#' ? '' : anchor))

    // 上一套／下一套：在同一個主題裡循環，停在同一頁，方便比較
    function setNeighbor(link, step) {
      const { styles } = theme
      const neighbor = styles[(styles.indexOf(style) + step + styles.length) % styles.length]
      const label = `${link.dataset.label}：${neighbor.no} ${neighbor.name}`
      link.href = previewHref(theme, neighbor, file + state)
      link.setAttribute('aria-label', label)
      link.title = label
    }
  }

  // 目錄裡沒有的網址：留在外框裡說明，多半是新頁面還沒登記
  function notFound() {
    if (location.hash.length < 2) return location.replace('index.html#directory')
    frame.hidden = true
    $('missing').hidden = false
  }

  // 用滑鼠或觸控操作外框後，把焦點交給設計稿，接著就能用方向鍵、空白鍵或簡報筆捲動；
  // 用鍵盤操作時焦點留在原本的按鈕上（click 的 detail 是 0；Firefox 用 Enter 按連結時 detail 是 1，但 pointerType 是空字串）
  function focusDesign(event) {
    if (event.detail && event.pointerType !== '') frame.focus()
  }

  // ---------- 事件 ----------

  window.addEventListener('message', (event) => {
    if (event.source !== frame.contentWindow || event.data?.type !== 'ui-preview') return
    const target = parse(String(event.data.at))
    if (target) sync(target)
  })

  // 上一套／下一套與總目錄都是真的連結，按住 Ctrl／⌘ 可以另開分頁
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="preview.html#"]')
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    directory.close()
    go(parse(link.hash))
    focusDesign(event)
  })

  // Windows 的選單在收合時按 ↓ 會直接換頁，所以用滑鼠選完頁面就把焦點移走；用鍵盤選時要留著才能繼續選
  let selectByPointer = false
  pageSelect.addEventListener('pointerdown', () => { selectByPointer = true })
  pageSelect.addEventListener('keydown', () => { selectByPointer = false })
  pageSelect.addEventListener('change', () => {
    const href = previewHref(current.theme, current.style, pageSelect.value)
    go(parse(href.slice(href.indexOf('#'))))
    if (selectByPointer) frame.focus()
  })

  // 剛打開、還沒操作外框時，也把焦點交給設計稿
  frame.addEventListener('load', () => {
    if (document.activeElement === document.body) frame.focus()
  }, { once: true })

  // 預覽寬度記在 sessionStorage，改樣式後重新整理不會跳回桌機
  function setDevice(name) {
    canvas.dataset.device = name
    for (const item of deviceButtons) item.setAttribute('aria-pressed', String(item.dataset.deviceButton === name))
  }
  for (const button of deviceButtons) {
    button.addEventListener('click', (event) => {
      setDevice(button.dataset.deviceButton)
      try { sessionStorage.setItem('ui-preview-device', button.dataset.deviceButton) } catch { /* 存不了就算了 */ }
      focusDesign(event)
    })
  }
  try {
    const saved = sessionStorage.getItem('ui-preview-device')
    if (['tablet', 'phone'].includes(saved)) setDevice(saved)
  } catch { /* 讀不到就用桌機 */ }

  $('openDirectory').addEventListener('click', () => {
    directory.showModal()
    directory.querySelector('[aria-current]')?.focus()
  })
  // 點側欄以外的地方關閉（Esc 與關閉按鈕由 <dialog> 內建處理）
  directory.addEventListener('click', (event) => {
    if (event.target === directory) directory.close()
  })

  // 使用者直接改網址列的 # 時；改網址已經多一筆瀏覽紀錄，iframe 用 replace 就不會再多一筆
  window.addEventListener('hashchange', () => {
    const target = parse(location.hash)
    if (!target) return notFound()
    frame.contentWindow.location.replace(new URL(frameUrl(target), location.href).href)
    sync(target)
  })

  // ---------- 開始 ----------

  const start = parse(location.hash)
  if (start) go(start)
  else notFound()
})()
