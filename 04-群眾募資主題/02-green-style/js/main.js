// ============================================================
// 島造 ISLANDMAKE｜02 綠色永續生活：全站共用的少量互動
// collapse、dropdown、tab、scrollspy、offcanvas、accordion 都由 Bootstrap 的 data-bs-* 屬性處理，這裡只補五件事
// ============================================================

// 1. 手機搜尋列展開後，把焦點放進搜尋框
document.getElementById('siteSearchMobile')?.addEventListener('shown.bs.collapse', (event) => {
  event.target.querySelector('input')?.focus()
})

// 2. 可橫向捲動的分頁籤：切換時把目前項目捲進畫面（只捲動分頁列本身，不用 scrollIntoView 以免整頁跳動）
const revealInNav = (item) => {
  const nav = item?.closest('.nav, [role="tablist"], [data-filter-list]')
  if (!nav || nav.scrollWidth <= nav.clientWidth) return
  const itemBox = item.getBoundingClientRect()
  const navBox = nav.getBoundingClientRect()
  if (itemBox.left < navBox.left) nav.scrollBy({ left: itemBox.left - navBox.left, behavior: 'smooth' })
  else if (itemBox.right > navBox.right) nav.scrollBy({ left: itemBox.right - navBox.right, behavior: 'smooth' })
}
document.querySelectorAll('[data-bs-toggle="tab"]').forEach((tab) => {
  tab.addEventListener('shown.bs.tab', () => revealInNav(tab))
})

// 3. 回饋方案選取（project.html）
//    方案：<input type="radio" name="reward" value="2280" data-reward-name="標準單入組">（已額滿的方案加 disabled）
//    自訂金額：<input id="pledgeAmount" type="number">；快捷鈕：<button data-add-amount="500">
//    小計：data-summary="name|price|extra|total"、最低金額：data-summary="min"
//    換方案時：金額重設為方案金額、最低金額跟著變；輸入低於最低金額時顯示錯誤
const pledge = document.getElementById('pledgeAmount')
const rewards = document.querySelectorAll('input[name="reward"]')
if (pledge && rewards.length) {
  const format = (n) => `NT$ ${n.toLocaleString('en-US')}`
  const setText = (key, text) => document.querySelectorAll(`[data-summary="${key}"]`).forEach((el) => { el.textContent = text })
  const selected = () => document.querySelector('input[name="reward"]:checked')

  const update = () => {
    const reward = selected()
    const price = Number(reward?.value || 0)
    const amount = Number(pledge.value || 0)
    const valid = amount >= price
    pledge.min = String(price)
    pledge.classList.toggle('is-invalid', !valid)
    pledge.setAttribute('aria-invalid', String(!valid))
    setText('name', reward?.dataset.rewardName || '尚未選擇')
    setText('min', price.toLocaleString('en-US'))
    setText('price', format(price))
    setText('extra', format(Math.max(amount - price, 0)))
    setText('total', format(Math.max(amount, price)))
  }
  rewards.forEach((radio) => radio.addEventListener('change', () => {
    pledge.value = radio.value // 換方案時從方案金額重新開始
    update()
  }))
  pledge.addEventListener('input', update)
  document.querySelectorAll('[data-add-amount]').forEach((button) => {
    button.addEventListener('click', () => {
      pledge.value = Number(pledge.value || 0) + Number(button.dataset.addAmount)
      update()
    })
  })
  update()
}

// 4. 篩選按鈕：只顯示符合條件的項目（account.html 的贊助紀錄分頁）
//    <div data-filter-list="#backingList">…<button type="button" data-filter="funding" aria-pressed="false">…
//    清單項目寫 data-status="funding"；data-filter 可以用空白分隔多個狀態（等待出貨＝ready producing）；"all" 顯示全部
document.querySelectorAll('[data-filter-list]').forEach((group) => {
  const buttons = group.querySelectorAll('[data-filter]')
  const items = document.querySelectorAll(`${group.dataset.filterList} > [data-status]`)
  const empty = document.querySelector(`${group.dataset.filterList} + [data-filter-empty]`)
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filters = button.dataset.filter.split(' ')
      let shown = 0
      buttons.forEach((b) => {
        b.classList.toggle('active', b === button)
        b.setAttribute('aria-pressed', String(b === button))
      })
      items.forEach((item) => {
        item.hidden = !filters.includes('all') && !filters.includes(item.dataset.status)
        if (!item.hidden) shown++
      })
      if (empty) empty.hidden = shown > 0
      revealInNav(button)
    })
  })
})

// 5. 角色切換（account.html）：只切換外層的 data-role，顯示與隱藏交給 CSS
//    <div data-role="proposer">…<button data-role-switch="backer" aria-pressed="false">以贊助者檢視</button>
//    網址 account.html?role=backer 直接開贊助者畫面（方便截圖與檢查）
const roleRoot = document.querySelector('[data-role]')
if (roleRoot) {
  const switches = document.querySelectorAll('[data-role-switch]')
  const setRole = (role) => {
    roleRoot.dataset.role = role
    switches.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.roleSwitch === role)))
  }
  switches.forEach((button) => button.addEventListener('click', () => setRole(button.dataset.roleSwitch)))
  const fromUrl = new URLSearchParams(location.search).get('role')
  if (fromUrl === 'backer' || fromUrl === 'proposer') setRole(fromUrl)
}
