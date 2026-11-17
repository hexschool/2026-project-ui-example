// ============================================================
// StageOne 城市現場｜02 古典藝文沙龍：全站共用的少量互動
// collapse、modal、offcanvas、accordion、carousel、tab 都由 Bootstrap 的 data-bs-* 屬性處理，這裡只補下面 10 件事
// 倒數、鎖位、付款中等動態功能在設計稿裡是靜態畫面（不用 JS 跑倒數），其他狀態放在各頁的「設計稿狀態示意」
// ============================================================

// 1. 頁首搜尋列展開後，把焦點放進搜尋框
document.getElementById('siteSearch')?.addEventListener('shown.bs.collapse', (event) => {
  event.target.querySelector('input')?.focus()
})

// 2. 活動列表「活動類型」篩選（必做）
//    篩選膠囊：<button type="button" data-filter="音樂演出" aria-pressed="false">（data-filter="all" 是「全部」）
//    活動卡：  <article class="event-card" data-category="音樂演出">，放在 [data-filter-list] 指定的容器裡
//    數量：    所有 [data-result-count] 都會更新成目前顯示的場數（「共 8 場活動」、手機的「套用篩選（顯示 8 場）」）
//    已套用：  [data-applied-filters] 會列出目前的類型，按 ✕ 回到「全部」
const typeFilter = document.querySelector('[data-type-filter]')
if (typeFilter) {
  const pills = typeFilter.querySelectorAll('[data-filter]')
  const cards = document.querySelectorAll(`${typeFilter.dataset.typeFilter} [data-category]`)
  const counts = document.querySelectorAll('[data-result-count]')
  const applied = document.querySelector('[data-applied-filters]')

  const applyType = (type) => {
    pills.forEach((pill) => pill.setAttribute('aria-pressed', String(pill.dataset.filter === type)))
    let shown = 0
    cards.forEach((card) => {
      const match = type === 'all' || card.dataset.category === type
      card.hidden = !match
      if (match) shown++
    })
    counts.forEach((el) => { el.textContent = shown })

    // 已套用的篩選標籤（選「全部」時不顯示）
    if (applied) {
      applied.replaceChildren()
      applied.hidden = type === 'all'
      if (type !== 'all') {
        const chip = document.createElement('button')
        chip.type = 'button'
        chip.className = 'applied-chip'
        chip.setAttribute('aria-label', `移除${type}`)
        chip.innerHTML = `${type}<i class="bi bi-x-lg" aria-hidden="true"></i>`
        chip.addEventListener('click', () => applyType('all'))
        applied.append(chip)
      }
    }
  }

  pills.forEach((pill) => pill.addEventListener('click', () => applyType(pill.dataset.filter)))
  // 「清除全部」：類型回到全部，其他群組的膠囊取消選取
  document.querySelectorAll('[data-filter-reset]').forEach((button) => {
    button.addEventListener('click', () => {
      applyType('all')
      document.querySelectorAll('[data-toggle-pill]').forEach((pill) => pill.setAttribute('aria-pressed', 'false'))
    })
  })
}

// 3. 其他篩選群組（日期、地區、票價、狀態）：設計稿只切換選中樣式，不真的篩選
document.querySelectorAll('[data-toggle-pill]').forEach((pill) => {
  pill.addEventListener('click', () => {
    pill.setAttribute('aria-pressed', String(pill.getAttribute('aria-pressed') !== 'true'))
  })
})

// 4. 票種數量加減與「已選票券」
//    <div data-order data-order-max="4">                         ← 整筆訂單（最多 4 張）
//      <div class="qty" data-qty="presale" data-price="1500" data-stock="112">
//        <button data-qty-step="-1">−</button><output>2</output><button data-qty-step="1">＋</button>
//      </div>
//    已選票券：[data-summary-row="presale"]（數量 0 時隱藏）裡的 [data-summary-qty]、[data-summary-amount]，
//             以及 [data-total-qty]、[data-total-amount]、[data-order-next]（0 張時停用）
const order = document.querySelector('[data-order]')
if (order) {
  const max = Number(order.dataset.orderMax || 4)
  const steppers = [...order.querySelectorAll('[data-qty]')]
  const money = (n) => `NT$ ${n.toLocaleString('en-US')}`
  const qtyOf = (stepper) => Number(stepper.querySelector('output').textContent)

  const render = () => {
    const total = steppers.reduce((sum, s) => sum + qtyOf(s), 0)
    let amount = 0
    steppers.forEach((stepper) => {
      const qty = qtyOf(stepper)
      const price = Number(stepper.dataset.price)
      amount += qty * price
      // 「−」在 0 時停用；「＋」在達到剩餘張數或整筆上限時停用
      stepper.querySelector('[data-qty-step="-1"]').disabled = qty === 0
      stepper.querySelector('[data-qty-step="1"]').disabled = qty >= Number(stepper.dataset.stock) || total >= max
      // 票種卡：數量 ≥ 1 是「已選」（外框強調＋「已選」標籤）
      stepper.closest('.ticket')?.classList.toggle('is-selected', qty > 0)
      const row = document.querySelector(`[data-summary-row="${stepper.dataset.qty}"]`)
      if (row) {
        row.hidden = qty === 0
        row.querySelector('[data-summary-qty]').textContent = qty
        row.querySelector('[data-summary-amount]').textContent = money(qty * price)
      }
    })
    document.querySelectorAll('[data-total-qty]').forEach((el) => { el.textContent = total })
    document.querySelectorAll('[data-total-amount]').forEach((el) => { el.textContent = money(amount) })
    document.querySelectorAll('[data-order-next]').forEach((link) => {
      link.classList.toggle('disabled', total === 0)
      link.setAttribute('aria-disabled', String(total === 0))
    })
  }

  steppers.forEach((stepper) => {
    stepper.querySelectorAll('[data-qty-step]').forEach((button) => {
      button.addEventListener('click', () => {
        const output = stepper.querySelector('output')
        output.textContent = Math.max(0, qtyOf(stepper) + Number(button.dataset.qtyStep))
        render()
      })
    })
  })
  render()
}

// 5. 座位點選：可選 ↔ 已選（已售出、不可選是 disabled，點不到）
//    <button class="seat" type="button" data-seat="A 區 12 排 7 號" aria-pressed="true" aria-label="A 區 12 排 7 號，已選">
//    已選座位的文字寫在 [data-seat-picked]；一筆訂單最多選 4 個座位
document.querySelectorAll('[data-seatmap]').forEach((map) => {
  const seats = [...map.querySelectorAll('.seat[data-seat]:not(:disabled)')]
  const picked = map.querySelector('[data-seat-picked]')
  const update = () => {
    const names = seats.filter((s) => s.getAttribute('aria-pressed') === 'true').map((s) => s.dataset.seat)
    if (picked) picked.textContent = names.length ? names.join('、') : '尚未選擇'
  }
  seats.forEach((seat) => {
    seat.addEventListener('click', () => {
      const selected = seat.getAttribute('aria-pressed') === 'true'
      const count = seats.filter((s) => s.getAttribute('aria-pressed') === 'true').length
      if (!selected && count >= 4) return
      seat.setAttribute('aria-pressed', String(!selected))
      seat.setAttribute('aria-label', `${seat.dataset.seat}，${selected ? '可選' : '已選'}`)
      update()
    })
  })
})

// 6. 「追蹤」按鈕切換（設計稿只換外觀，不呼叫 API）
//    <button class="btn btn-follow" type="button" data-follow aria-pressed="false"><i class="bi bi-heart"></i><span>加入追蹤</span></button>
document.querySelectorAll('[data-follow]').forEach((button) => {
  const label = button.querySelector('span')
  const original = label?.textContent
  button.addEventListener('click', () => {
    const on = button.getAttribute('aria-pressed') !== 'true'
    button.setAttribute('aria-pressed', String(on))
    button.querySelector('.bi')?.classList.toggle('bi-heart', !on)
    button.querySelector('.bi')?.classList.toggle('bi-heart-fill', on)
    if (label) label.textContent = on ? '已追蹤' : original
  })
})

// 7. 橫向捲動軌道的左右箭頭（首頁本週熱門）：一次捲一張卡的寬度
//    <button data-scroll-target="#featuredTrack" data-scroll-dir="1" aria-label="下一個">
document.querySelectorAll('[data-scroll-target]').forEach((button) => {
  button.addEventListener('click', () => {
    const track = document.querySelector(button.dataset.scrollTarget)
    const item = track?.firstElementChild
    if (!track || !item) return
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    track.scrollBy({ left: Number(button.dataset.scrollDir) * (item.offsetWidth + gap), behavior: 'smooth' })
  })
})

// 8. 付款方式：選「信用卡付款」才展開卡號表單（Notion：信用卡表單預設收合）
//    <input type="radio" name="payMethod" data-pay-target="#payCardForm">；其他 radio 選了就收合
document.querySelectorAll('input[type="radio"][name="payMethod"]').forEach((radio, _, radios) => {
  radio.addEventListener('change', () => {
    radios.forEach((r) => {
      if (!r.dataset.payTarget) return
      const panel = document.querySelector(r.dataset.payTarget)
      if (panel) bootstrap.Collapse.getOrCreateInstance(panel, { toggle: false })[r.checked ? 'show' : 'hide']()
    })
  })
})

// 9. 我的票券的分頁（2026-11 補，tickets.html）：即將到來／已使用／已過期
//    分頁：<div data-ticket-tabs="#ticketList"><button type="button" data-filter="upcoming" aria-pressed="true">…</div>
//    票券卡：#ticketList 裡的 <article data-status="upcoming|used|expired">，只顯示目前分頁那一組
//    HTML 先全部顯示（沒有 JS 時也看得到所有票券），載入後套用 aria-pressed="true" 的那一個分頁
document.querySelectorAll('[data-ticket-tabs]').forEach((group) => {
  const tabs = [...group.querySelectorAll('[data-filter]')]
  const items = document.querySelectorAll(`${group.dataset.ticketTabs} [data-status]`)
  const show = (status) => {
    tabs.forEach((tab) => tab.setAttribute('aria-pressed', String(tab.dataset.filter === status)))
    items.forEach((item) => { item.hidden = item.dataset.status !== status })
  }
  tabs.forEach((tab) => tab.addEventListener('click', () => show(tab.dataset.filter)))
  show((tabs.find((tab) => tab.getAttribute('aria-pressed') === 'true') || tabs[0])?.dataset.filter)
})

// 10. 「取消追蹤」按鈕切換（2026-11 補，follows.html；設計稿只換外觀與文字，不移除這一列、不呼叫 API）
//     <button type="button" data-unfollow><i class="bi bi-person-dash"></i><span data-unfollow-label>取消追蹤</span></button>
//     按下後換成「追蹤」（圖示 bi-person-plus），再按一次回到「取消追蹤」
//     不和第 6 項共用：第 6 項是「加入追蹤 ↔ 已追蹤」、愛心圖示，這裡是「取消追蹤 ↔ 追蹤」、人像圖示，文字與圖示都不同
//     也不用 aria-pressed：這顆按鈕的文字寫的是「按下去會做的事」，每次都會換字；
//     如果再加 aria-pressed，報讀會變成「取消追蹤，已按下」這種互相矛盾的說法（切換按鈕的文字應該固定不變）
//     所以狀態只記在 data-following（"false" 表示已取消追蹤），畫面與報讀都靠按鈕文字
document.querySelectorAll('[data-unfollow]').forEach((button) => {
  const label = button.querySelector('[data-unfollow-label]')
  const icon = button.querySelector('.bi')
  button.addEventListener('click', () => {
    const following = button.dataset.following !== 'false'
    button.dataset.following = String(!following)
    if (label) label.textContent = following ? '追蹤' : '取消追蹤'
    icon?.classList.toggle('bi-person-dash', !following)
    icon?.classList.toggle('bi-person-plus', following)
  })
})
