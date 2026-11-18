// ============================================================
// StageOne｜03 電競競技場：全站共用的少量互動
// collapse、modal、offcanvas（頁首選單、活動列表手機篩選）、accordion、tab／pill（電子票券詳情的票券插槽）、
// scrollspy（活動細節的情報分頁列、Guideline 目錄）都由 Bootstrap 的 data-bs-* 屬性處理，這裡只補下面幾件事
// 倒數、動態 QR Code、付款中都是設計稿的固定畫面，不用 JS 跑（見 README）
// ============================================================

const formatPrice = (n) => `NT$ ${n.toLocaleString('en-US')}`

// 1. 頁首搜尋列展開後，把焦點放進搜尋框
document.getElementById('siteSearch')?.addEventListener('shown.bs.collapse', (event) => {
  event.target.querySelector('input')?.focus()
})

// 2. 活動列表「活動類型」篩選（必做）
//    篩選控制台第一層的 8 格分段列：<div data-filter-group="category"><button class="…" data-filter="all|音樂演出…" aria-pressed>
//    （分段列的按鈕 class 由活動列表決定，JS 只看 data-filter 與 aria-pressed）
//    卡片：<ul id="eventList"><li data-category="音樂演出">…
//    數量：所有 [data-filter-count] 的文字換成目前顯示的場數（工具列「共 8 場活動」、手機版「套用篩選（顯示 8 場）」）
//    已套用標籤：[data-filter-applied] 裡放一顆「音樂演出 ✕」，按了回到「全部」
const categoryGroup = document.querySelector('[data-filter-group="category"]')
if (categoryGroup) {
  const chips = categoryGroup.querySelectorAll('[data-filter]')
  const cards = document.querySelectorAll('#eventList > [data-category]')
  const applied = document.querySelector('[data-filter-applied]')

  const applyCategory = (filter) => {
    chips.forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.filter === filter)))
    let shown = 0
    cards.forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter
      if (!card.hidden) shown++
    })
    document.querySelectorAll('[data-filter-count]').forEach((el) => { el.textContent = shown })

    if (applied) {
      applied.replaceChildren()
      if (filter !== 'all') {
        const tag = document.createElement('button')
        tag.type = 'button'
        tag.className = 'chip chip-applied'
        tag.setAttribute('aria-label', `移除${filter}`)
        tag.innerHTML = `${filter}<i class="bi bi-x-lg" aria-hidden="true"></i>`
        tag.addEventListener('click', () => applyCategory('all'))
        applied.append(tag)
      }
    }
  }
  chips.forEach((chip) => chip.addEventListener('click', () => applyCategory(chip.dataset.filter)))

  // 「清除全部」：類型回到全部，其他群組取消選取
  document.querySelectorAll('[data-filter-reset]').forEach((button) => {
    button.addEventListener('click', () => {
      applyCategory('all')
      document.querySelectorAll('[data-chip-group] .chip').forEach((chip) => chip.setAttribute('aria-pressed', 'false'))
      document.querySelectorAll('[data-reveal-target]').forEach((el) => { el.hidden = true })
    })
  })
}

// 3. 其他篩選群組（日期、地區、票價、狀態）：設計稿只切換選中樣式，不真的篩選
//    <div data-chip-group><button class="chip" aria-pressed="false">…；同一組只能選一個，再按一次取消
//    選到有 data-reveal 的膠囊（「自訂日期區間」）時，顯示對應的欄位
document.querySelectorAll('[data-chip-group]').forEach((group) => {
  const chips = group.querySelectorAll('.chip')
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const pressed = chip.getAttribute('aria-pressed') !== 'true'
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip && pressed)))
      chips.forEach((c) => {
        if (c.dataset.reveal) document.querySelector(c.dataset.reveal).hidden = c.getAttribute('aria-pressed') !== 'true'
      })
    })
  })
})

// 4. 票種數量加減：更新數量、已選票券清單、小計；處理 0 與上限的停用
//    票種卡：<article class="ticket-type" data-ticket data-name="預售全票" data-price="1500" data-max="112">
//    加減器：<button data-qty-step="-1">、<output class="qty-value">、<button data-qty-step="1">
//    每筆訂單最多 4 張：<section data-order-max="4">
const ticketSection = document.querySelector('[data-order-max]')
if (ticketSection) {
  const orderMax = Number(ticketSection.dataset.orderMax)
  const tickets = [...ticketSection.querySelectorAll('[data-ticket]')]
  const qtyOf = (ticket) => Number(ticket.querySelector('.qty-value').textContent)

  const render = () => {
    const total = tickets.reduce((sum, t) => sum + qtyOf(t), 0)
    const subtotal = tickets.reduce((sum, t) => sum + qtyOf(t) * Number(t.dataset.price), 0)

    tickets.forEach((ticket) => {
      const qty = qtyOf(ticket)
      ticket.classList.toggle('is-selected', qty > 0)
      ticket.querySelector('[data-qty-step="-1"]').disabled = qty === 0
      ticket.querySelector('[data-qty-step="1"]').disabled = qty >= Number(ticket.dataset.max) || total >= orderMax
    })

    const list = document.querySelector('[data-selection-list]')
    if (list) {
      list.replaceChildren(...tickets.filter((t) => qtyOf(t) > 0).map((t) => {
        const li = document.createElement('li')
        li.innerHTML = `<span>${t.dataset.name} × ${qtyOf(t)}</span><span class="price">${formatPrice(qtyOf(t) * Number(t.dataset.price))}</span>`
        return li
      }))
      if (!total) list.innerHTML = '<li class="selection-empty">尚未選擇票種</li>'
    }
    document.querySelectorAll('[data-selection-count]').forEach((el) => { el.textContent = total })
    document.querySelectorAll('[data-selection-subtotal]').forEach((el) => { el.textContent = formatPrice(subtotal) })
    document.querySelectorAll('[data-selection-next]').forEach((link) => {
      link.classList.toggle('disabled', total === 0)
      link.setAttribute('aria-disabled', String(total === 0))
    })
  }

  tickets.forEach((ticket) => {
    ticket.querySelectorAll('[data-qty-step]').forEach((button) => {
      button.addEventListener('click', () => {
        const output = ticket.querySelector('.qty-value')
        output.textContent = Math.max(0, qtyOf(ticket) + Number(button.dataset.qtyStep))
        render()
      })
    })
  })
  render()
}

// 5. 座位點選：可選 ↔ 已選，更新 aria-pressed、aria-label 與「已選座位」文字
//    <button class="seat" type="button" data-seat="A 區 12 排 7 號" aria-pressed="false" aria-label="A 區 12 排 7 號，可選">
//    已售出、不可選的座位是 disabled，點不到
const seatButtons = document.querySelectorAll('.seat-map .seat[data-seat]:not(:disabled)')
const seatSelected = document.querySelector('[data-seat-selected]')
seatButtons.forEach((seat) => {
  seat.addEventListener('click', () => {
    const selected = seat.getAttribute('aria-pressed') !== 'true'
    seat.setAttribute('aria-pressed', String(selected))
    seat.setAttribute('aria-label', `${seat.dataset.seat}，${selected ? '已選' : '可選'}`)
    if (seatSelected) {
      const names = [...seatButtons].filter((s) => s.getAttribute('aria-pressed') === 'true').map((s) => s.dataset.seat)
      seatSelected.textContent = names.length ? names.join('、') : '尚未選擇'
    }
  })
})

// 6. 追蹤：♡ 加入追蹤 ↔ 已追蹤（只切換外觀）
//    <button class="btn btn-follow" type="button" aria-pressed="false"><i class="bi bi-heart"></i><span data-follow-text>加入追蹤</span></button>
document.querySelectorAll('.btn-follow').forEach((button) => {
  const label = button.querySelector('[data-follow-text]')
  const original = label?.textContent
  button.addEventListener('click', () => {
    const on = button.getAttribute('aria-pressed') !== 'true'
    button.setAttribute('aria-pressed', String(on))
    if (label) label.textContent = on ? '已追蹤' : original
  })
})

// 7. 首頁熱門列的左右箭頭：一次捲動一張卡的寬度（≥ 1400px 4 張剛好一列，箭頭隱藏）
//    <button class="btn btn-icon" data-rail-prev="#featuredRail">、<button class="btn btn-icon" data-rail-next="#featuredRail">
document.querySelectorAll('[data-rail-prev], [data-rail-next]').forEach((button) => {
  const rail = document.querySelector(button.dataset.railPrev || button.dataset.railNext)
  const direction = button.dataset.railPrev ? -1 : 1
  button.addEventListener('click', () => {
    const item = rail.firstElementChild
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0
    rail.scrollBy({ left: direction * (item.offsetWidth + gap), behavior: 'smooth' })
  })
})

// 8. 電子票券切換時更新「第 N 張，共 3 張」
//    輪播：<div class="carousel">…<span data-carousel-index>1</span>（結帳頁若用 Carousel）
//    票券插槽：Bootstrap pill（data-bs-toggle="pill"），插槽按鈕加 data-ticket-index="1|2|3"，
//    顯示處放 <span data-ticket-index-label>1</span>（電子票券詳情；不需要時可以不放）
document.querySelectorAll('.carousel').forEach((carousel) => {
  const index = carousel.querySelector('[data-carousel-index]')
  carousel.addEventListener('slid.bs.carousel', (event) => {
    if (index) index.textContent = event.to + 1
  })
})
document.querySelectorAll('[data-ticket-index]').forEach((slot) => {
  slot.addEventListener('shown.bs.tab', () => {
    document.querySelectorAll('[data-ticket-index-label]').forEach((el) => { el.textContent = slot.dataset.ticketIndex })
  })
})

// 9. 我的票券的分頁：即將到來／已使用／已過期，只顯示選中的那一組（2026-11 補；屬性名稱照電商 js/main.js 的分頁篩選）
//    3 格 HUD 分段列：<div data-filter-list="#ticketList"><button class="…" data-filter="upcoming" aria-pressed="true">…
//    票券：<ul id="ticketList"><li data-status="upcoming|used|expired">…
//    HTML 先全部顯示（沒有 JS 也看得到所有票券），載入時套用 aria-pressed="true" 的那一個（預設「即將到來」）
document.querySelectorAll('[data-filter-list]').forEach((group) => {
  const tabs = group.querySelectorAll('[data-filter]')
  const items = document.querySelectorAll(`${group.dataset.filterList} > [data-status]`)
  const show = (filter) => {
    tabs.forEach((tab) => tab.setAttribute('aria-pressed', String(tab.dataset.filter === filter)))
    items.forEach((item) => { item.hidden = item.dataset.status !== filter })
  }
  tabs.forEach((tab) => tab.addEventListener('click', () => show(tab.dataset.filter)))
  show(group.querySelector('[aria-pressed="true"]')?.dataset.filter || tabs[0].dataset.filter)
})

// 10. 追蹤的主辦方：「取消追蹤」↔「追蹤」（2026-11 補；設計稿只換文字與圖示，卡片不移除、不呼叫 API）
//     <button type="button" data-unfollow><i class="bi bi-person-dash"></i><span data-unfollow-label>取消追蹤</span><span class="visually-hidden">：主辦方名稱</span></button>
//     不併進第 6 項：第 6 項是「加入追蹤 ↔ 已追蹤」＋愛心；這裡的按鈕文字本身就說明了按下去會做什麼，
//     所以不加 aria-pressed（否則會報讀成「取消追蹤，已按下」），狀態記在 data-following
document.querySelectorAll('[data-unfollow]').forEach((button) => {
  const label = button.querySelector('[data-unfollow-label]')
  const icon = button.querySelector('.bi')
  button.dataset.following = 'true'
  button.addEventListener('click', () => {
    const following = button.dataset.following !== 'true'
    button.dataset.following = String(following)
    if (label) label.textContent = following ? '取消追蹤' : '追蹤'
    if (icon) icon.className = `bi ${following ? 'bi-person-dash' : 'bi-person-plus'}`
  })
})
