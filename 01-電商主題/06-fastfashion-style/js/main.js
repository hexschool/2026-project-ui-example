// ============================================================
// NestCraft｜06 平價快時尚：全站共用的少量互動
// collapse、dropdown、tab、offcanvas、toast 都由 Bootstrap 的 data-bs-* 屬性處理，這裡只補六件事
// ============================================================

// 1. 手機選單：按頁首的放大鏡打開抽屜時，把焦點放進搜尋框
//    <button … data-bs-toggle="offcanvas" data-bs-target="#siteMenu" data-menu-search>
document.getElementById('siteMenu')?.addEventListener('shown.bs.offcanvas', (event) => {
  if (event.relatedTarget?.hasAttribute('data-menu-search')) {
    event.target.querySelector('input[type="search"]')?.focus()
  }
})

// 2. 顯示／隱藏密碼
//    <button type="button" data-toggle-password="#password,#passwordConfirm" aria-pressed="false">
document.querySelectorAll('[data-toggle-password]').forEach((button) => {
  button.addEventListener('click', () => {
    const show = button.getAttribute('aria-pressed') !== 'true'
    button.setAttribute('aria-pressed', String(show))
    document.querySelectorAll(button.dataset.togglePassword).forEach((input) => {
      input.type = show ? 'text' : 'password'
    })
    const icon = button.querySelector('.bi')
    icon?.classList.toggle('bi-eye', !show)
    icon?.classList.toggle('bi-eye-slash', show)
  })
})

// 3. 可橫向捲動的分頁籤與目錄：切換到的項目自動捲進畫面
//    分頁籤：用方向鍵切換時；ScrollSpy 目錄（Guideline 的黏性目錄列）：捲動到新章節時
//    只橫向捲動分頁列本身，不用 scrollIntoView（它會連帶捲動整頁，打斷正在進行的平滑捲動）
const revealInNav = (item) => {
  const nav = item?.closest('.nav')
  if (!nav || nav.scrollWidth <= nav.clientWidth) return
  const itemBox = item.getBoundingClientRect()
  const navBox = nav.getBoundingClientRect()
  if (itemBox.left < navBox.left) nav.scrollBy({ left: itemBox.left - navBox.left, behavior: 'smooth' })
  else if (itemBox.right > navBox.right) nav.scrollBy({ left: itemBox.right - navBox.right, behavior: 'smooth' })
}
document.querySelectorAll('[data-bs-toggle="tab"]').forEach((tab) => {
  tab.addEventListener('shown.bs.tab', () => revealInNav(tab))
})
window.addEventListener('activate.bs.scrollspy', (event) => revealInNav(event.relatedTarget))

// 4. 篩選按鈕：只顯示符合條件的項目（我的訂單的狀態分頁）
//    <ul data-filter-list="#ordersList">…<button type="button" data-filter="待付款" aria-pressed="false">…
//    清單項目寫 data-status="待付款"；data-filter="all" 顯示全部。目前選取的按鈕加 .active 與 aria-pressed="true"
document.querySelectorAll('[data-filter-list]').forEach((group) => {
  const buttons = group.querySelectorAll('[data-filter]')
  const items = document.querySelectorAll(`${group.dataset.filterList} > [data-status]`)
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
      revealInNav(button) // 手機上篩選列可以橫向捲動：點到被切掉一半的按鈕時，把它捲進畫面
    })
  })
})

// 5. 折價券倒數：算到今天 23:59:59，每秒更新所有 [data-countdown]（HH:MM:SS）
//    HTML 先寫一個靜態值，JS 失效時旁邊仍有「今日 23:59 截止」；數字 aria-hidden、不加 aria-live（避免每秒朗讀）
//    截止時間是真的「今天 23:59」，不做歸零就重來的假倒數；這是資訊，prefers-reduced-motion 時照常更新
const countdowns = document.querySelectorAll('[data-countdown]')
if (countdowns.length) {
  const pad = (n) => String(n).padStart(2, '0')
  const tick = () => {
    const now = new Date()
    const end = new Date(now)
    end.setHours(23, 59, 59, 999)
    const left = Math.max(0, Math.floor((end - now) / 1000))
    const text = `${pad(Math.floor(left / 3600))}:${pad(Math.floor(left / 60) % 60)}:${pad(left % 60)}`
    countdowns.forEach((el) => { el.textContent = text })
  }
  tick()
  setInterval(tick, 1000)
}

// 6. 加入購物車（設計稿示意）：按鈕寫 data-add-cart="品名"，整套加入時另加 data-add-qty="件數"
//    顯示黑底 toast，並把頁首「購物車」的數量加上去（只是示意，換頁後回到 4）
const cartToastEl = document.getElementById('cartToast')
if (cartToastEl && window.bootstrap) {
  const cartToast = bootstrap.Toast.getOrCreateInstance(cartToastEl, { delay: 3500 })
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-cart]')
    if (!button || button.disabled) return
    const qty = Number(button.dataset.addQty || 1)
    let total = 0
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      total = Number(el.textContent) + qty
      el.textContent = total
    })
    document.querySelectorAll('[data-cart-link]').forEach((link) => {
      link.setAttribute('aria-label', `購物車，${total} 件商品`)
    })
    cartToastEl.querySelector('[data-toast-text]').textContent = `已加入購物車：${button.dataset.addCart}`
    cartToast.show()
  })
}
