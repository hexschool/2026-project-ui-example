// ============================================================
// 島造 ISLANDMAKE｜05 現代商務創新：全站共用的少量互動
// collapse、dropdown、tab、scrollspy、offcanvas、accordion、追蹤按鈕都由 Bootstrap 的 data-bs-* 屬性處理，
// 這裡只補五件事（WIREFRAME_SPEC §2.9）
// ============================================================

// 1. 手機搜尋列展開後，把焦點放進搜尋框
document.getElementById('siteSearchMobile')?.addEventListener('shown.bs.collapse', (event) => {
  event.target.querySelector('input')?.focus()
})

// 2. 可橫向捲動的分頁籤：用方向鍵切換時，把切換到的項目捲進畫面（首頁「正在發生的提案」、留言篩選）
//    只橫向捲動分頁列本身，不用 scrollIntoView（它會連帶捲動整頁）
const revealInNav = (item) => {
  const nav = item?.closest('.nav, [role="tablist"], [data-filter-list]')
  if (!nav || nav.scrollWidth <= nav.clientWidth) return
  const itemBox = item.getBoundingClientRect()
  const navBox = nav.getBoundingClientRect()
  if (itemBox.left < navBox.left) nav.scrollBy({ left: itemBox.left - navBox.left, behavior: 'smooth' })
  else if (itemBox.right > navBox.right) nav.scrollBy({ left: itemBox.right - navBox.right, behavior: 'smooth' })
}
document.querySelectorAll('[data-bs-toggle="tab"], [data-bs-toggle="pill"]').forEach((tab) => {
  tab.addEventListener('shown.bs.tab', () => revealInNav(tab))
})

// 3. 回饋方案選取（project.html #rewards：5 欄比較矩陣＋矩陣下方的全寬贊助小計列，兩者包在同一個 [data-pledge] 裡）
//    方案：<input type="radio" name="reward" data-price="2280" data-name="標準單入組">
//    自訂金額：<input type="number" data-pledge-amount>（min 跟著方案變；低於方案金額時顯示錯誤）
//    快捷鈕：<button data-pledge-add="500">；小計：data-pledge-name／-price／-extra／-total／-min 的元素
//    下一步：<a href="checkout.html" data-pledge-next>（沒選方案或金額不足時停用）
//    已額滿的方案 radio 是 disabled，選不到
const pledge = document.querySelector('[data-pledge]')
if (pledge) {
  const radios = pledge.querySelectorAll('input[name="reward"]')
  const amount = pledge.querySelector('[data-pledge-amount]')
  const nextButton = pledge.querySelector('[data-pledge-next]')
  const out = (key) => pledge.querySelectorAll(`[data-pledge-${key}]`)
  const money = (n) => `NT$ ${n.toLocaleString('en-US')}`
  const selected = () => [...radios].find((r) => r.checked)

  const render = () => {
    const radio = selected()
    const price = radio ? Number(radio.dataset.price) : 0
    const total = Number(amount.value) || 0
    const extra = Math.max(total - price, 0)
    const invalid = Boolean(radio) && total < price
    amount.min = price
    amount.classList.toggle('is-invalid', invalid)
    out('name').forEach((el) => { el.textContent = radio ? radio.dataset.name : '尚未選擇' })
    out('price').forEach((el) => { el.textContent = money(price) })
    out('min').forEach((el) => { el.textContent = price.toLocaleString('en-US') })
    out('extra').forEach((el) => { el.textContent = money(invalid ? 0 : extra) })
    out('total').forEach((el) => { el.textContent = money(invalid ? price : Math.max(total, price)) })
    // 「下一步：填寫收件資訊」是連到 checkout.html 的 <a>：停用時用 .disabled＋aria-disabled＋tabindex="-1"
    if (nextButton) {
      const off = !radio || invalid
      nextButton.classList.toggle('disabled', off)
      if (off) {
        nextButton.setAttribute('aria-disabled', 'true')
        nextButton.setAttribute('tabindex', '-1')
      } else {
        nextButton.removeAttribute('aria-disabled')
        nextButton.removeAttribute('tabindex')
      }
    }
  }

  // 換方案：金額重設為方案金額（回饋內容不變，額外支持歸零）
  radios.forEach((radio) => radio.addEventListener('change', () => {
    amount.value = radio.dataset.price
    render()
  }))
  amount.addEventListener('input', render)
  pledge.querySelectorAll('[data-pledge-add]').forEach((button) => {
    button.addEventListener('click', () => {
      const base = Math.max(Number(amount.value) || 0, Number(selected()?.dataset.price || 0))
      amount.value = base + Number(button.dataset.pledgeAdd)
      render()
    })
  })
  render()
}

// 4. 贊助紀錄分頁篩選（account.html #backings 的持有明細表：<tbody id="backingList"> 的每個 <tr data-status>；留言篩選共用）
//    <div data-filter-list="#backingList">…<button type="button" data-filter="ready producing" aria-pressed="false">等待出貨</button>
//    清單項目寫 data-status="producing"；data-filter 可以寫多個狀態（空白分隔），"all" 顯示全部
//    目前選取的按鈕加 .active 與 aria-pressed="true"；篩選後沒有項目時顯示 [data-filter-empty]
document.querySelectorAll('[data-filter-list]').forEach((group) => {
  const buttons = group.querySelectorAll('[data-filter]')
  const list = document.querySelector(group.dataset.filterList)
  const items = list.querySelectorAll(':scope > [data-status]')
  const empty = list.parentElement.querySelector('[data-filter-empty]')
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter.split(' ')
      let shown = 0
      buttons.forEach((b) => {
        b.classList.toggle('active', b === button)
        b.setAttribute('aria-pressed', String(b === button))
      })
      items.forEach((item) => {
        item.hidden = !filter.includes('all') && !filter.includes(item.dataset.status)
        if (!item.hidden) shown++
      })
      if (empty) empty.hidden = shown > 0
      revealInNav(button)
    })
  })
})

// 5. 角色切換（account.html，設計稿狀態示意）
//    外層 <div data-role="proposer">；按鈕 <button data-role-switch="backer" aria-pressed="false">
//    CSS 依 data-role 顯示或隱藏 .for-proposer／.for-backer；網址 ?role=backer 直接開贊助者畫面
const roleRoot = document.querySelector('[data-role]')
if (roleRoot) {
  const switches = document.querySelectorAll('[data-role-switch]')
  const setRole = (role) => {
    roleRoot.dataset.role = role
    switches.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.roleSwitch === role)))
    // 側邊導覽的 ScrollSpy 要重新計算（隱藏的區塊會改變位置）
    window.bootstrap?.ScrollSpy.getInstance(document.body)?.refresh()
  }
  switches.forEach((b) => b.addEventListener('click', () => setRole(b.dataset.roleSwitch)))
  const fromUrl = new URLSearchParams(location.search).get('role')
  if (fromUrl === 'backer' || fromUrl === 'proposer') setRole(fromUrl)
}
