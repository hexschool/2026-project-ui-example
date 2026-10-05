// ============================================================
// NestCraft｜02 日系無印風：全站共用的少量互動
// collapse、dropdown、tab、carousel、offcanvas 都由 Bootstrap 的 data-bs-* 屬性處理，這裡只補四件事
// ============================================================

// 1. 手機搜尋列展開後，把焦點放進搜尋框
document.getElementById('siteSearchMobile')?.addEventListener('shown.bs.collapse', (event) => {
  event.target.querySelector('input')?.focus()
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

// 3. 可橫向捲動的分頁籤：用方向鍵切換時，把切換到的項目捲進畫面（首頁手機版的空間情境卡、商品詳情的分頁）
//    只橫向捲動分頁列本身，不用 scrollIntoView（它會連帶捲動整頁）
const revealInNav = (item) => {
  const nav = item?.closest('.nav, [role="tablist"]')
  if (!nav || nav.scrollWidth <= nav.clientWidth) return
  const itemBox = item.getBoundingClientRect()
  const navBox = nav.getBoundingClientRect()
  if (itemBox.left < navBox.left) nav.scrollBy({ left: itemBox.left - navBox.left, behavior: 'smooth' })
  else if (itemBox.right > navBox.right) nav.scrollBy({ left: itemBox.right - navBox.right, behavior: 'smooth' })
}
document.querySelectorAll('[data-bs-toggle="tab"]').forEach((tab) => {
  tab.addEventListener('shown.bs.tab', () => revealInNav(tab))
})

// 4. 篩選按鈕：只顯示符合條件的項目（我的訂單的狀態列）
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
