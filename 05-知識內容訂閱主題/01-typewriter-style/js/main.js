// ============================================================
// 現場筆記 FieldNotes｜01 純粹打字機：全站共用的少量互動
// collapse、dropdown、tab、modal、offcanvas、accordion 都由 Bootstrap 的 data-bs-* 屬性處理
// 這裡只做規格（WIREFRAME_SPEC §2.8）列的 5 件事，加上幾個選用的小互動：
//   1. 設計稿切換器（article：未訂閱／已訂閱；account：讀者／作者／管理員）
//   2. 閱讀進度條（article）
//   3. 字級調整 Aa（article）
//   4. 月／年切換（pricing）
//   5. 作者文章狀態篩選（account）
//   選用：搜尋列展開後自動聚焦、收藏／追蹤的 aria-pressed、閱讀模式、確認付款的處理中示意
// ============================================================

// 1. 設計稿切換器
//    <body data-view="unsubscribed">＋<button data-set-view="subscribed" aria-pressed="false">
//    <body data-role="reader">＋<button data-set-role="author" aria-pressed="false">
//    讀網址參數（?view=subscribed、?role=author）→ 設定 body 屬性 → 更新按鈕 aria-pressed → history.replaceState
//    網址有 #錨點時，套用狀態後再捲過去（被隱藏的區塊要先顯示才捲得到）
const designStates = [
  { attr: 'view', param: 'view', values: ['unsubscribed', 'subscribed'] },
  { attr: 'role', param: 'role', values: ['reader', 'author', 'admin'] },
]
designStates.forEach(({ attr, param, values }) => {
  if (!(attr in document.body.dataset)) return
  const buttons = document.querySelectorAll(`[data-set-${attr}]`)
  const apply = (value, updateUrl) => {
    if (!values.includes(value)) value = values[0]
    document.body.dataset[attr] = value
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset[`set${attr[0].toUpperCase()}${attr.slice(1)}`] === value)))
    if (updateUrl) {
      const url = new URL(window.location.href)
      if (value === values[0]) url.searchParams.delete(param)
      else url.searchParams.set(param, value)
      history.replaceState(null, '', url)
    }
    // 目錄的 ScrollSpy 要重新計算（顯示／隱藏了章節）
    if (window.bootstrap) bootstrap.ScrollSpy.getInstance(document.body)?.refresh()
    document.dispatchEvent(new CustomEvent('designstatechange'))
  }
  apply(new URLSearchParams(window.location.search).get(param) || document.body.dataset[attr], false)
  buttons.forEach((button) => {
    button.addEventListener('click', () => apply(button.dataset[`set${attr[0].toUpperCase()}${attr.slice(1)}`], true))
  })
  // 有錨點：狀態套用後再捲動一次（第一次載入時瀏覽器可能捲到被隱藏的位置）
  if (window.location.hash) {
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
    if (target) requestAnimationFrame(() => target.scrollIntoView())
  }
})

// 2. 閱讀進度條：依文章主體（#article-body 到文末）計算百分比，更新頂端細條與 aria-valuenow
//    未訂閱時讀者只看得到免費段：讀到付費牆＝全文的 32%（#article-body 的 data-free-ratio）
//    右側「閱讀進度」卡（data-progress-card）同步更新；沒有 JS 時維持 HTML 寫的靜態 32%
const progress = document.querySelector('[data-reading-progress]')
const articleBody = document.getElementById('article-body')
if (progress && articleBody) {
  const bar = progress.querySelector('span')
  const card = document.querySelector('[data-progress-card]')
  const cardText = document.querySelector('[data-progress-card-text]')
  const update = () => {
    const box = articleBody.getBoundingClientRect()
    const start = box.top + window.scrollY - window.innerHeight * .3
    const end = box.bottom + window.scrollY - window.innerHeight
    const ratio = Math.min(1, Math.max(0, (window.scrollY - start) / Math.max(1, end - start)))
    const free = document.body.dataset.view === 'unsubscribed' ? Number(articleBody.dataset.freeRatio || 1) : 1
    const percent = Math.round(ratio * free * 100)
    bar.style.setProperty('--progress', `${percent}%`)
    progress.setAttribute('aria-valuenow', String(percent))
    if (card) {
      card.setAttribute('aria-valuenow', String(percent))
      card.querySelector('.progress-bar').style.width = `${percent}%`
      cardText.textContent = `${percent}%`
    }
  }
  let ticking = false
  window.addEventListener('scroll', () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => { update(); ticking = false })
  }, { passive: true })
  window.addEventListener('resize', update)
  document.addEventListener('designstatechange', update)
  update()
}

// 3. 字級調整：三段字級切換 .prose 的 class（行高同步，每段都 ≥ 1.8），選擇記在 localStorage
//    <input type="radio" class="btn-check" name="fontSize" value="sm" data-font-size>
const sizeInputs = document.querySelectorAll('[data-font-size]')
const prose = document.querySelectorAll('[data-prose]')
if (sizeInputs.length && prose.length) {
  const setSize = (size) => {
    prose.forEach((el) => {
      el.classList.remove('is-size-sm', 'is-size-md', 'is-size-lg')
      el.classList.add(`is-size-${size}`)
    })
    sizeInputs.forEach((input) => { input.checked = input.value === size })
  }
  let saved = null
  try { saved = localStorage.getItem('fieldnotes-font-size') } catch { /* 無痕模式或封鎖儲存空間時忽略 */ }
  if (['sm', 'md', 'lg'].includes(saved)) setSize(saved)
  sizeInputs.forEach((input) => {
    input.addEventListener('change', () => {
      setSize(input.value)
      try { localStorage.setItem('fieldnotes-font-size', input.value) } catch { /* 同上 */ }
    })
  })
}

// 4. 月／年切換：年繳時顯示省錢提示，並把被選中計費方式那張卡的按鈕升為強調、另一張降為次要
//    <input type="radio" name="billing" value="month|year" data-billing>
//    提示：<p data-billing-hint>（預留高度，用 visibility 切換，版面不跳動）
//    按鈕：<a data-plan-cta="month|year" class="btn …">
const billingInputs = document.querySelectorAll('[data-billing]')
if (billingInputs.length) {
  const hint = document.querySelector('[data-billing-hint]')
  const ctas = document.querySelectorAll('[data-plan-cta]')
  const setBilling = (value) => {
    if (hint) hint.classList.toggle('is-visible', value === 'year')
    ctas.forEach((cta) => {
      const on = cta.dataset.planCta === value
      cta.classList.toggle('btn-dark', on)
      cta.classList.toggle('btn-outline-dark', !on)
    })
  }
  billingInputs.forEach((input) => input.addEventListener('change', () => setBilling(input.value)))
  setBilling([...billingInputs].find((input) => input.checked)?.value || 'month')
}

// 5. 作者文章狀態篩選：分頁籤「全部／已發布／草稿／已下架」
//    <div data-filter-list="#myArticles">…<button data-filter="draft" aria-pressed="false">
//    表格列寫 data-status="published|draft|removed"；data-filter="all" 顯示全部
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
    })
  })
})

// ---------- 選用的小互動 ----------

// 搜尋列展開後，把焦點放進搜尋框
document.getElementById('siteSearch')?.addEventListener('shown.bs.collapse', (event) => {
  event.target.querySelector('input')?.focus()
})

// 收藏、追蹤作者：切換 aria-pressed 與按鈕文字
//    <button data-toggle-pressed data-label-on="已收藏" data-label-off="收藏" data-icon-on="bi-bookmark-fill" data-icon-off="bi-bookmark">
document.querySelectorAll('[data-toggle-pressed]').forEach((button) => {
  button.addEventListener('click', () => {
    const on = button.getAttribute('aria-pressed') !== 'true'
    document.querySelectorAll(`[data-toggle-pressed="${button.dataset.togglePressed}"]`).forEach((twin) => {
      twin.setAttribute('aria-pressed', String(on))
      const label = twin.querySelector('[data-label]')
      if (label && twin.dataset.labelOn) label.textContent = on ? twin.dataset.labelOn : twin.dataset.labelOff
      const icon = twin.querySelector('.bi')
      if (icon && twin.dataset.iconOn) {
        icon.classList.toggle(twin.dataset.iconOn, on)
        icon.classList.toggle(twin.dataset.iconOff, !on)
      }
    })
  })
})

// 閱讀模式：隱藏頁首、目錄與文末以外的干擾，只留閱讀欄（body.is-reading-mode）
document.querySelectorAll('[data-reading-mode]').forEach((button) => {
  button.addEventListener('click', () => {
    const on = !document.body.classList.contains('is-reading-mode')
    document.body.classList.toggle('is-reading-mode', on)
    document.querySelectorAll('[data-reading-mode]').forEach((b) => b.setAttribute('aria-pressed', String(on)))
  })
})

// 確認付款：按下後按鈕顯示「處理中」，1.5 秒後在按鈕下方寫出「訂閱成功」（設計稿示意，不送出任何資料）
const payButton = document.querySelector('[data-pay]')
if (payButton) {
  const status = document.querySelector('[data-pay-status]')
  payButton.addEventListener('click', () => {
    if (payButton.disabled) return
    const label = payButton.innerHTML
    payButton.disabled = true
    payButton.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>處理中，請勿關閉頁面…'
    if (status) status.textContent = '處理中，請勿關閉頁面…'
    setTimeout(() => {
      payButton.disabled = false
      payButton.innerHTML = label
      if (status) status.textContent = '訂閱成功，438 篇文章已全部解鎖。'
    }, 1500)
  })
}
