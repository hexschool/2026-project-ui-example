// ============================================================
// NestCraft｜05 親和無毒風：全站共用的少量互動
// collapse、dropdown、tab、offcanvas、scrollspy 都由 Bootstrap 的 data-bs-* 屬性處理，這裡只補五件事
// ============================================================

// 1. 992px 以下：按頁首的放大鏡（data-focus-search）打開底部抽屜時，把焦點放進抽屜最上方的搜尋框
//    按選單鈕打開時維持 Bootstrap 預設（焦點在抽屜本身）
document.getElementById('siteMenu')?.addEventListener('shown.bs.offcanvas', (event) => {
  if (event.relatedTarget?.hasAttribute('data-focus-search')) {
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

// 3. 可橫向捲動的分段切換：用方向鍵切換時，把切換到的項目捲進畫面（首頁空間靈感的膠囊分段、商品詳情的分頁）
//    結帳的子步驟膠囊列、Guideline 的目錄列（992px 以下）也共用這個函式
//    只橫向捲動分頁列本身，不用 scrollIntoView（它會連帶捲動整頁）
const revealInNav = (item) => {
  // 分段外面包了 .seg-scroll（我的訂單）時，由外層負責捲動
  const nav = item?.closest('.seg-scroll') || item?.closest('.nav, .seg, [role="tablist"], .step-rail-list, .gl-toc-list')
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

// 5. Scrollspy 的目錄：結帳頁的子步驟軌（#coRail）與 Guideline 的目錄（#glToc）
//    換到下一個段落時，橫向膠囊列（結帳 1200px 以下、Guideline 992px 以下）把目前的項目捲進畫面
//    Scrollspy 設定寫在各頁的 <body data-bs-spy="scroll" data-bs-target="#coRail 或 #glToc" data-bs-root-margin="-170px 0px -50%">
//    Guideline 的章節比畫面高很多，另加 data-bs-threshold="0,1"（預設門檻 0.1 在很高的章節永遠達不到，目錄就不會換）
document.body.addEventListener('activate.bs.scrollspy', (event) => revealInNav(event.relatedTarget))
//    補一個 Bootstrap Scrollspy 的狀況：往下捲出表單、再往回捲時，最後一段（結帳的發票與備註）不會重新標示。
//    捲動時如果沒有任何段落被標示，就標示目前在頁首下方的那一段；之後 Scrollspy 換段時會自己清掉
const rail = document.querySelector('#coRail, #glToc')
if (rail) {
  let ticking = false
  const markVisible = () => {
    ticking = false
    if (rail.querySelector('.active')) return
    const links = [...rail.querySelectorAll('a[href^="#"]')]
    const line = 170 // 和 Scrollspy 的 rootMargin 上緣一致：膠囊列黏住時錨點跳轉後段落頂在 176px，上一段的底約在 160px，要落在這條線上方
    const hit = links.find((link) => {
      const box = document.querySelector(link.hash)?.getBoundingClientRect()
      return box && box.top <= window.innerHeight * 0.5 && box.bottom >= line
    })
    hit?.classList.add('active')
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(markVisible) }
  }, { passive: true })
  // 重新整理後停在頁面中段時，Scrollspy 要等下一次捲動才會標示：載入後先補標一次（第一段的 .active 直接寫在 HTML）
  window.addEventListener('load', () => setTimeout(markVisible, 200))
}
