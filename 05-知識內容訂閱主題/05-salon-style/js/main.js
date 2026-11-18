// ============================================================
// 現場筆記 FieldNotes｜05 撞色創作者沙龍：全站共用的少量互動
// collapse、dropdown、tab、modal、offcanvas、accordion 都由 Bootstrap 的 data-bs-* 屬性處理。
// 這裡只做 WIREFRAME_SPEC §2.8 列的 5 件事，再加上幾個小工具：
//   1. 設計稿切換器（article：未訂閱／已訂閱；account：讀者／作者／管理員）
//   2. 閱讀進度條（article）
//   3. 字級調整 Aa（article）
//   4. 月／年切換（pricing）
//   5. 作者文章狀態篩選（account）
//   另外：手機搜尋展開後聚焦、可橫向捲動的分頁籤把目前項目捲進畫面、
//        收藏／追蹤的 aria-pressed 切換、閱讀模式
// ============================================================

// localStorage 在私密視窗或封鎖網站資料時可能讀不到，一律包 try/catch
const store = {
  get: (key) => { try { return localStorage.getItem(key) } catch { return null } },
  set: (key, value) => { try { localStorage.setItem(key, value) } catch { /* 存不了就算了 */ } },
}

// 0. 搜尋列展開後，把焦點放進搜尋框
document.getElementById('siteSearch')?.addEventListener('shown.bs.collapse', (event) => {
  event.target.querySelector('input')?.focus()
})

// 1. 設計稿切換器
//    <body data-view="unsubscribed">（文章內頁）或 <body data-role="reader">（個人頁面）
//    <div class="design-switcher" data-switcher="view">
//      <button type="button" data-value="unsubscribed" aria-pressed="true">未訂閱</button>
//      <button type="button" data-value="subscribed" aria-pressed="false">已訂閱</button>
//    </div>
//    網址參數同名（?view=subscribed、?role=author）；切換時用 history.replaceState 更新網址，
//    重新整理後停在同一個狀態。網址有 #錨點時，套用狀態後再捲過去（被隱藏的區塊要先顯示才捲得到）。
document.querySelectorAll('[data-switcher]').forEach((switcher) => {
  const key = switcher.dataset.switcher // 'view' 或 'role'
  const buttons = [...switcher.querySelectorAll('button[data-value]')]
  const values = buttons.map((b) => b.dataset.value)

  const apply = (value, { updateUrl = true } = {}) => {
    if (!values.includes(value)) value = values[0]
    document.body.dataset[key] = value
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.value === value)))
    if (updateUrl) {
      const url = new URL(location.href)
      if (value === values[0]) url.searchParams.delete(key)
      else url.searchParams.set(key, value)
      history.replaceState(null, '', url)
    }
    document.dispatchEvent(new CustomEvent('design:switch', { detail: { key, value } }))
  }

  buttons.forEach((button) => button.addEventListener('click', () => apply(button.dataset.value)))

  // 切換後，側欄的 ScrollSpy 重新計算要觀察的區塊（初始化時被隱藏的區塊不會被觀察）
  document.addEventListener('design:switch', () => {
    window.bootstrap?.ScrollSpy.getInstance(document.body)?.refresh()
  })

  apply(new URLSearchParams(location.search).get(key) || document.body.dataset[key], { updateUrl: false })
  if (location.hash) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
    if (target) requestAnimationFrame(() => target.scrollIntoView())
  }
})

// 2. 閱讀進度條：依文章主體（#article-body 開頭到文末）計算百分比
//    <div class="reading-bar" role="progressbar" aria-valuenow="32" style="--p: 32%">（沒有 JS 時是靜態 32%）
//    同一個捲動事件也標出目錄的目前位置：最後一個捲過視窗上方 35% 的 h2，對應的 #toc 連結加 .active
//    （h2 本身很矮，Bootstrap ScrollSpy 只在標題還在畫面上時才標示，讀到段落中間就會消失，所以文章頁自己算）
const readingBar = document.querySelector('.reading-bar')
const articleBody = document.getElementById('article-body')
if (readingBar && articleBody) {
  const tocLinks = [...document.querySelectorAll('#toc a[href^="#sec-"]')]
  const update = () => {
    const box = articleBody.getBoundingClientRect()
    const total = box.height - window.innerHeight * 0.6
    const read = Math.min(Math.max(-box.top + window.innerHeight * 0.2, 0), Math.max(total, 1))
    const percent = Math.round((read / Math.max(total, 1)) * 100)
    readingBar.style.setProperty('--p', `${percent}%`)
    readingBar.setAttribute('aria-valuenow', String(percent))

    const headings = [...articleBody.querySelectorAll('h2[id]')].filter((h) => h.offsetParent)
    const passed = headings.filter((h) => h.getBoundingClientRect().top < window.innerHeight * 0.35)
    const currentId = (passed.at(-1) || headings[0])?.id
    tocLinks.forEach((link) => {
      const on = link.hash === `#${currentId}`
      link.classList.toggle('active', on)
      if (on) link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
    })
  }
  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
  document.addEventListener('design:switch', update) // 切換訂閱狀態後文章長度會變
}

// 3. 字級調整 Aa：三段（sm／md／lg）切換 .prose 的 class，行高跟著換（每段都 ≥ 1.8）
//    <input type="radio" class="btn-check" data-prose-size="lg" …>；頁面上可以有好幾組（工具列、手機行動列），會互相同步
//    選擇記在 localStorage，跨文章保留
const sizeInputs = document.querySelectorAll('[data-prose-size]')
if (sizeInputs.length) {
  const proseBlocks = document.querySelectorAll('[data-prose]')
  const setSize = (size) => {
    proseBlocks.forEach((el) => {
      el.classList.remove('prose-sm', 'prose-md', 'prose-lg')
      el.classList.add(`prose-${size}`)
    })
    sizeInputs.forEach((input) => { input.checked = input.dataset.proseSize === size })
    store.set('fieldnotes-prose-size', size)
  }
  sizeInputs.forEach((input) => input.addEventListener('change', () => setSize(input.dataset.proseSize)))
  const saved = store.get('fieldnotes-prose-size')
  if (['sm', 'md', 'lg'].includes(saved)) setSize(saved)
}

// 4. 月／年切換：年繳時顯示省錢提示，並把被選中計費方式那張卡的按鈕升為強調、另一張降為次要
//    <input type="radio" name="billing" value="monthly|yearly" …>
//    <p class="billing-note" aria-live="polite">…</p>（.is-visible 切換 visibility，預留高度、版面不跳）
//    <a class="btn …" data-plan-btn="monthly|yearly">
//    強調＝.btn-primary、次要＝.btn-outline-secondary；兩者的顏色會依所在積木的底色自動反白
//    （白積木藍底白字、藍積木白底藍字、黑積木橘底黑字，見 scss/_base.scss 的 surface 情境）
const billingInputs = document.querySelectorAll('input[name="billing"]')
if (billingInputs.length) {
  const note = document.querySelector('.billing-note')
  const planButtons = document.querySelectorAll('[data-plan-btn]')
  const setBilling = (cycle) => {
    note?.classList.toggle('is-visible', cycle === 'yearly')
    planButtons.forEach((btn) => {
      const on = btn.dataset.planBtn === cycle
      btn.classList.toggle('btn-primary', on)
      btn.classList.toggle('btn-outline-secondary', !on)
    })
  }
  billingInputs.forEach((input) => input.addEventListener('change', () => setBilling(input.value)))
  setBilling([...billingInputs].find((i) => i.checked)?.value || 'monthly')
}

// 5. 作者文章狀態篩選：分頁籤「全部／已發布／草稿／已下架」
//    <div role="group" data-filter-list="#myArticles"><button type="button" data-filter="published" aria-pressed="false">…
//    資料列寫 data-status="published|draft|removed"；data-filter="all" 顯示全部
document.querySelectorAll('[data-filter-list]').forEach((group) => {
  const buttons = group.querySelectorAll('[data-filter]')
  const items = document.querySelectorAll(`${group.dataset.filterList} [data-status]`)
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter
      buttons.forEach((b) => {
        b.classList.toggle('active', b === button)
        b.setAttribute('aria-pressed', String(b === button))
      })
      items.forEach((item) => {
        item.hidden = filter !== 'all' && item.dataset.status !== filter
      })
      revealInNav(button)
    })
  })
})

// 可橫向捲動的分頁籤：切換時把目前項目捲進畫面（只捲分頁列本身，不連帶捲動整頁）
function revealInNav(item) {
  const nav = item?.closest('.nav, [role="tablist"], [role="group"]')
  if (!nav || nav.scrollWidth <= nav.clientWidth) return
  const itemBox = item.getBoundingClientRect()
  const navBox = nav.getBoundingClientRect()
  if (itemBox.left < navBox.left) nav.scrollBy({ left: itemBox.left - navBox.left, behavior: 'smooth' })
  else if (itemBox.right > navBox.right) nav.scrollBy({ left: itemBox.right - navBox.right, behavior: 'smooth' })
}
document.querySelectorAll('[data-bs-toggle="tab"]').forEach((tab) => {
  tab.addEventListener('shown.bs.tab', () => revealInNav(tab))
})

// 6. 收藏、追蹤作者：切換 aria-pressed 與按鈕文字、圖示
//    <button type="button" aria-pressed="false" data-toggle-pressed
//            data-label-on="已收藏" data-icon-on="bi-bookmark-fill" data-icon-off="bi-bookmark">
//      <i class="bi bi-bookmark"></i><span>收藏</span></button>
document.querySelectorAll('[data-toggle-pressed]').forEach((button) => {
  const label = button.querySelector('span')
  const icon = button.querySelector('.bi')
  const off = { text: label?.textContent, icon: button.dataset.iconOff }
  button.addEventListener('click', () => {
    const on = button.getAttribute('aria-pressed') !== 'true'
    button.setAttribute('aria-pressed', String(on))
    if (label && button.dataset.labelOn) label.textContent = on ? button.dataset.labelOn : off.text
    if (icon && button.dataset.iconOn) {
      icon.classList.toggle(button.dataset.iconOn, on)
      icon.classList.toggle(off.icon, !on)
    }
  })
})

// 7. 閱讀模式：隱藏頁首、麵包屑與目錄，只留閱讀欄（<body class="is-reading-mode">）
//    頁面上有好幾顆閱讀模式按鈕（工具列、行動列），狀態一起同步
const readingButtons = document.querySelectorAll('[data-reading-mode]')
readingButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const on = !document.body.classList.contains('is-reading-mode')
    document.body.classList.toggle('is-reading-mode', on)
    readingButtons.forEach((b) => b.setAttribute('aria-pressed', String(on)))
  })
})
