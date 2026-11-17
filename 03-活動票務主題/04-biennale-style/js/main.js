// ============================================================
// StageOne 城市現場｜04 當代雙年展：全站共用的少量互動
// collapse、modal、offcanvas、accordion 都由 Bootstrap 的 data-bs-* 屬性處理，這裡只補下面 8 件事
// 倒數、付款中、付款結果等動態功能都是靜態畫面（規格 §2.7），這裡不跑任何計時器
// ============================================================

const formatPrice = (n) => `NT$ ${n.toLocaleString('en-US')}`

// 1. 頁首搜尋列展開後，把焦點放進搜尋框
document.getElementById('siteSearch')?.addEventListener('shown.bs.collapse', (event) => {
  event.target.querySelector('input')?.focus()
})

// 2. 活動列表「活動類型」篩選（必做）
//    膠囊：<div data-filter-group="#eventList">…<button type="button" data-filter="音樂演出" aria-pressed="false">
//    卡片：<li data-category="音樂演出">；data-filter="all" 顯示全部
//    數量：所有 [data-result-count] 會更新成目前顯示的場數（工具列「共 N 場活動」、手機版「套用篩選（顯示 N 場）」）
//    已套用標籤：[data-applied] 裡放一顆「音樂演出 ✕」，按了回到全部
document.querySelectorAll('[data-filter-group]').forEach((group) => {
  const buttons = group.querySelectorAll('[data-filter]')
  const items = document.querySelectorAll(`${group.dataset.filterGroup} > [data-category]`)
  const applied = document.querySelector('[data-applied]')

  const apply = (filter) => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)))
    let shown = 0
    items.forEach((item) => {
      item.hidden = filter !== 'all' && item.dataset.category !== filter
      if (!item.hidden) shown++
    })
    document.querySelectorAll('[data-result-count]').forEach((el) => { el.textContent = shown })
    if (applied) {
      applied.replaceChildren()
      if (filter !== 'all') {
        const chip = document.createElement('button')
        chip.type = 'button'
        chip.className = 'applied-chip'
        chip.setAttribute('aria-label', `移除${filter}`)
        chip.innerHTML = `${filter}<i class="bi bi-x-lg" aria-hidden="true"></i>`
        chip.addEventListener('click', () => apply('all'))
        applied.append(chip)
      }
    }
  }

  buttons.forEach((button) => button.addEventListener('click', () => apply(button.dataset.filter)))
  // 「清除全部」「清除篩選」：<button data-filter-reset>
  document.querySelectorAll('[data-filter-reset]').forEach((reset) => {
    reset.addEventListener('click', () => {
      apply('all')
      document.querySelectorAll('[data-toggle-pressed][aria-pressed="true"]').forEach((b) => b.setAttribute('aria-pressed', 'false'))
    })
  })
})

// 3. 其他篩選膠囊（日期、地區、票價、狀態）：設計稿只切換選中樣式，不真的篩選
//    <button type="button" data-toggle-pressed aria-pressed="false">
document.querySelectorAll('[data-toggle-pressed]').forEach((button) => {
  button.addEventListener('click', () => {
    button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'))
  })
})

// 4. 票種數量加減（活動細節）
//    <article class="ticket-type" data-ticket="預售全票" data-price="1500" data-stock="112">
//      <div class="qty"><button data-qty-step="-1">…<output>2</output>…<button data-qty-step="1">
//    規則：0 時「−」停用；達剩餘張數或整筆訂單上限（data-order-max，4 張）時「＋」停用
//    數量 ≥ 1 的票種卡加 .is-selected（粗框＋「已選」標記），並更新「已選票券」的明細與小計
const ticketSection = document.querySelector('[data-order-max]')
if (ticketSection) {
  const orderMax = Number(ticketSection.dataset.orderMax)
  const cards = [...ticketSection.querySelectorAll('.ticket-type[data-price]')]
  const summary = document.querySelector('[data-selection-summary]')

  const render = () => {
    const lines = cards.map((card) => ({
      card,
      name: card.dataset.ticket,
      price: Number(card.dataset.price),
      qty: Number(card.querySelector('output').value),
    }))
    const count = lines.reduce((sum, l) => sum + l.qty, 0)
    const subtotal = lines.reduce((sum, l) => sum + l.qty * l.price, 0)

    lines.forEach(({ card, qty }) => {
      const stock = Number(card.dataset.stock)
      card.classList.toggle('is-selected', qty > 0)
      card.querySelector('[data-qty-step="-1"]').disabled = qty === 0
      card.querySelector('[data-qty-step="1"]').disabled = qty >= stock || count >= orderMax
      card.querySelector('.ticket-type-picked')?.toggleAttribute('hidden', qty === 0)
      const picked = card.querySelector('[data-picked-count]')
      if (picked) picked.textContent = qty
    })

    if (summary) {
      summary.querySelector('[data-summary-lines]').innerHTML = lines
        .filter((l) => l.qty > 0)
        .map((l) => `<li><span>${l.name} × ${l.qty}</span><span class="price">${formatPrice(l.qty * l.price)}</span></li>`)
        .join('') || '<li class="text-secondary">還沒有選擇票種</li>'
      summary.querySelector('[data-summary-count]').textContent = count
      summary.querySelector('[data-summary-subtotal]').textContent = formatPrice(subtotal)
    }
    document.querySelectorAll('[data-bar-count]').forEach((el) => { el.textContent = count })
  }

  cards.forEach((card) => {
    card.querySelectorAll('[data-qty-step]').forEach((button) => {
      button.addEventListener('click', () => {
        const output = card.querySelector('output')
        output.value = Math.max(0, Number(output.value) + Number(button.dataset.qtyStep))
        render()
      })
    })
  })
  render()
}

// 5. 座位點選（活動細節）：可選 ↔ 已選，更新 aria-pressed、aria-label 與「已選座位」文字
//    <button class="seat" type="button" data-seat="A 區 12 排 7 號" aria-pressed="false" aria-label="A 區 12 排 7 號，可選">
//    已售出、不可選的座位有 disabled，點不到
const seatMap = document.querySelector('[data-seat-map]')
if (seatMap) {
  const seats = seatMap.querySelectorAll('.seat:not(:disabled)')
  const output = document.querySelector('[data-seat-output]')
  const render = () => {
    const picked = [...seats].filter((s) => s.getAttribute('aria-pressed') === 'true').map((s) => s.dataset.seat)
    if (output) output.textContent = picked.length ? picked.join('、') : '尚未選擇'
  }
  seats.forEach((seat) => {
    seat.addEventListener('click', () => {
      const on = seat.getAttribute('aria-pressed') !== 'true'
      seat.setAttribute('aria-pressed', String(on))
      seat.setAttribute('aria-label', `${seat.dataset.seat}，${on ? '已選' : '可選'}`)
      render()
    })
  })
}

// 6. 「追蹤」切換：♡ 加入追蹤 ↔ ♥ 已追蹤
//    <button type="button" data-follow aria-pressed="false"><i class="bi bi-heart"></i><span>加入追蹤</span></button>
//    文字可用 data-follow-on／data-follow-off 自訂（活動列表卡是「追蹤」「已追蹤」）
//    追蹤的主辦方的「取消追蹤」也用這段：aria-pressed="true" 開始，data-follow-on="取消追蹤"、data-follow-off="追蹤"
document.querySelectorAll('[data-follow]').forEach((button) => {
  const label = button.querySelector('span')
  const off = button.dataset.followOff || label?.textContent
  const on = button.dataset.followOn || '已追蹤'
  button.addEventListener('click', () => {
    const pressed = button.getAttribute('aria-pressed') !== 'true'
    button.setAttribute('aria-pressed', String(pressed))
    button.querySelector('.bi')?.classList.toggle('bi-heart', !pressed)
    button.querySelector('.bi')?.classList.toggle('bi-heart-fill', pressed)
    if (label) label.textContent = pressed ? on : off
  })
})

// 7. 首頁「本週最多人在看」的左右箭頭：捲動一張卡的寬度
//    <button data-scroll-track="#featuredTrack" data-scroll-dir="1">
document.querySelectorAll('[data-scroll-track]').forEach((button) => {
  const track = document.querySelector(button.dataset.scrollTrack)
  button.addEventListener('click', () => {
    const card = track?.querySelector('li')
    if (!card) return
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollBy({ left: Number(button.dataset.scrollDir) * (card.offsetWidth + 24), behavior: smooth ? 'smooth' : 'auto' })
  })
})

// 8. 我的票券的分頁（即將到來／已使用／已過期）：按了只顯示那一類票券卡
//    分頁：<div data-filter-list="#ticketList">…<button type="button" data-filter="upcoming" aria-pressed="true">
//    票券卡：<li data-status="upcoming">；HTML 先全部顯示（沒有 JS 也看得到），載入時套用選中的那一個分頁
document.querySelectorAll('[data-filter-list]').forEach((group) => {
  const buttons = [...group.querySelectorAll('[data-filter]')]
  const items = document.querySelectorAll(`${group.dataset.filterList} > [data-status]`)
  const apply = (filter) => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)))
    items.forEach((item) => { item.hidden = item.dataset.status !== filter })
  }
  buttons.forEach((button) => button.addEventListener('click', () => apply(button.dataset.filter)))
  const current = buttons.find((b) => b.getAttribute('aria-pressed') === 'true') || buttons[0]
  if (current) apply(current.dataset.filter)
})

