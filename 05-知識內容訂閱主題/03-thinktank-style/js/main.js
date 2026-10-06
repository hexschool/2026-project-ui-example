// ============================================================
// 現場筆記 FieldNotes｜03 高端政經智庫：全站共用的少量互動
// collapse、dropdown、tab、modal、offcanvas、accordion 都由 Bootstrap 的 data-bs-* 屬性處理，這裡只補：
// 1. 設計稿切換器（article、account）  2. 閱讀進度條（article）  3. 字級調整（article）
// 4. 月／年切換（pricing）  5. 作者文章狀態篩選（account）
// 另外（選用）：搜尋列展開後聚焦、收藏／追蹤的 aria-pressed、閱讀模式、分頁籤捲進畫面
// ============================================================

// 0. 搜尋列展開後，把焦點放進搜尋框
document.getElementById('siteSearch')?.addEventListener('shown.bs.collapse', (event) => {
  event.target.querySelector('input')?.focus()
})

// 1. 設計稿切換器：網址參數 → <body data-view／data-role> → 按鈕 aria-pressed → history.replaceState
//    <div class="demo-switch" role="group">
//      <button type="button" data-switch="view" data-value="subscribed" aria-pressed="false">已訂閱</button>
//    </div>
//    article.html?view=subscribed、account.html?role=author／?role=admin 直接開對應狀態
//    網址有 #錨點 時，套用狀態後再捲過去（被隱藏的區塊要先顯示才捲得到）
const switches = document.querySelectorAll('[data-switch]')
if (switches.length) {
  const key = switches[0].dataset.switch // view 或 role
  const allowed = [...switches].map((b) => b.dataset.value)
  const apply = (value, updateUrl) => {
    if (!allowed.includes(value)) value = allowed[0]
    document.body.dataset[key] = value
    switches.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.value === value)))
    if (updateUrl) {
      const url = new URL(window.location.href)
      if (value === allowed[0]) url.searchParams.delete(key)
      else url.searchParams.set(key, value)
      history.replaceState(null, '', url)
    }
  }
  apply(new URLSearchParams(window.location.search).get(key) || document.body.dataset[key], false)
  switches.forEach((b) => b.addEventListener('click', () => apply(b.dataset.value, true)))
  // 等圖片與字型載入完再捲，避免版面還在變動時捲到錯的位置
  const scrollToHash = () => document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView()
  if (window.location.hash) {
    if (document.readyState === 'complete') requestAnimationFrame(scrollToHash)
    else window.addEventListener('load', scrollToHash, { once: true })
  }
}

// 2. 閱讀進度條：依文章主體（#article-body 頂端到底端）計算百分比；沒有 JS 時維持 HTML 寫的靜態 32%
const progress = document.getElementById('readingProgress')
const articleBody = document.getElementById('article-body')
if (progress && articleBody) {
  const bar = progress.querySelector('.progress-bar')
  const update = () => {
    const box = articleBody.getBoundingClientRect()
    const total = box.height - window.innerHeight * 0.5
    const read = Math.min(Math.max(-box.top + window.innerHeight * 0.25, 0), total)
    const percent = total > 0 ? Math.round((read / total) * 100) : 0
    bar.style.width = `${percent}%`
    progress.setAttribute('aria-valuenow', String(percent))
  }
  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
}

// 3. 字級調整：三段（小／標準／大）切換 .prose 的 class，行高跟著字級（三段都 ≥ 1.8）
//    <input class="btn-check" type="radio" name="proseSize" value="sm">；選擇記在 localStorage（可能被瀏覽器封鎖，用 try/catch）
const sizeInputs = document.querySelectorAll('input[name^="proseSize"]')
if (sizeInputs.length) {
  const proses = document.querySelectorAll('[data-prose-sizable]')
  const setSize = (size) => {
    proses.forEach((p) => {
      p.classList.toggle('prose-sm', size === 'sm')
      p.classList.toggle('prose-lg', size === 'lg')
    })
    sizeInputs.forEach((input) => { input.checked = input.value === size })
  }
  let saved = null
  try { saved = localStorage.getItem('fieldnotes-prose-size') } catch (error) { /* 無痕模式等情況讀不到，維持預設 */ }
  if (saved) setSize(saved)
  sizeInputs.forEach((input) => input.addEventListener('change', () => {
    setSize(input.value)
    try { localStorage.setItem('fieldnotes-prose-size', input.value) } catch (error) { /* 存不了就只套用在這一頁 */ }
  }))
}

// 4. 月／年切換：年繳時顯示省錢提示，並把被選中計費方式那張卡的按鈕升為主要、另一張降為次要
//    <input name="billing" value="month|year">、提示 #billingHint、按鈕 [data-plan-cta="month|year"]
const billingInputs = document.querySelectorAll('input[name="billing"]')
if (billingInputs.length) {
  const hint = document.getElementById('billingHint')
  const ctas = document.querySelectorAll('[data-plan-cta]')
  const setBilling = (value) => {
    hint?.classList.toggle('is-visible', value === 'year') // 用 visibility 切換，預留高度，版面不跳動
    hint?.setAttribute('aria-hidden', String(value !== 'year'))
    ctas.forEach((btn) => {
      const on = btn.dataset.planCta === value
      btn.classList.toggle('btn-primary', on)
      btn.classList.toggle('btn-outline-primary', !on)
    })
  }
  billingInputs.forEach((input) => input.addEventListener('change', () => setBilling(input.value)))
  setBilling([...billingInputs].find((input) => input.checked)?.value || 'month')
}

// 5. 作者文章狀態篩選：分頁籤 data-filter 對應文章列 data-status；data-filter="all" 顯示全部
//    <div data-filter-list="#myArticles">…<button type="button" data-filter="draft" aria-pressed="false">草稿</button>
const revealInNav = (item) => {
  const nav = item?.closest('.nav, [role="tablist"], [data-filter-list]')
  if (!nav || nav.scrollWidth <= nav.clientWidth) return
  const itemBox = item.getBoundingClientRect()
  const navBox = nav.getBoundingClientRect()
  if (itemBox.left < navBox.left) nav.scrollBy({ left: itemBox.left - navBox.left, behavior: 'smooth' })
  else if (itemBox.right > navBox.right) nav.scrollBy({ left: itemBox.right - navBox.right, behavior: 'smooth' })
}
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
document.querySelectorAll('[data-bs-toggle="tab"]').forEach((tab) => {
  tab.addEventListener('shown.bs.tab', () => revealInNav(tab))
})

// 6.（選用）收藏、追蹤作者、閱讀模式：切換 aria-pressed，按鈕文字與圖示跟著換
//    <button type="button" data-toggle-pressed data-label-on="已收藏" data-icon-on="bi-bookmark-fill" aria-pressed="false">
//      <i class="bi bi-bookmark" aria-hidden="true"></i><span>收藏</span></button>
//    閱讀模式另外加 data-reading-mode：在 <body> 加上 .is-reading-mode（隱藏目錄、日期列，閱讀欄置中）
document.querySelectorAll('[data-toggle-pressed]').forEach((button) => {
  const label = button.querySelector('span')
  const icon = button.querySelector('.bi')
  const off = { label: label?.textContent, icon: icon?.className }
  button.addEventListener('click', () => {
    const on = button.getAttribute('aria-pressed') !== 'true'
    button.setAttribute('aria-pressed', String(on))
    if (label && button.dataset.labelOn) label.textContent = on ? button.dataset.labelOn : off.label
    if (icon && button.dataset.iconOn) icon.className = on ? `bi ${button.dataset.iconOn}` : off.icon
    if (button.hasAttribute('data-reading-mode')) {
      document.body.classList.toggle('is-reading-mode', on)
      document.querySelectorAll('[data-reading-mode]').forEach((b) => b.setAttribute('aria-pressed', String(on)))
    }
  })
})
