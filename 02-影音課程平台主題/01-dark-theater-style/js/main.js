// ============================================================
// Craftory｜01 極致暗黑劇院：全站共用的少量互動
// collapse、dropdown、tab、modal、offcanvas、toast 都由 Bootstrap 的 data-bs-* 屬性處理，這裡只補七件事
// ============================================================

// 1. 手機搜尋列展開後，把焦點放進搜尋框
document.getElementById('siteSearchMobile')?.addEventListener('shown.bs.collapse', (event) => {
  event.target.querySelector('input')?.focus()
})

// 2. 登入對話框：從「立即購買，開始上課」或註冊頁「登入」開啟時（按鈕有 data-auth-context="purchase"），
//    顯示未登入提示「登入後就能開始上課…」，主要按鈕改成「登入並開始上課」，表單送出到 checkout.html；
//    從頁首開啟時恢復一般版（送出到範本原本的 action，learn.html）
document.getElementById('authModal')?.addEventListener('show.bs.modal', (event) => {
  const isPurchase = event.relatedTarget?.dataset.authContext === 'purchase'
  const modal = event.target
  modal.querySelector('.auth-hint').hidden = !isPurchase
  const submit = modal.querySelector('[data-auth-submit]')
  submit.textContent = isPurchase ? submit.dataset.labelPurchase : submit.dataset.labelDefault
  const form = modal.querySelector('.auth-form')
  form.dataset.defaultAction ??= form.getAttribute('action')
  form.setAttribute('action', isPurchase ? 'checkout.html' : form.dataset.defaultAction)
})

// 3. 對話框裡「關閉後捲到某處」的按鈕（鎖定提示的「看看課程包含什麼」→ 購買卡 #purchase）
//    <button type="button" data-bs-dismiss="modal" data-scroll-after-dismiss="#purchase">
//    Bootstrap 關閉對話框時會擋掉連結的預設動作，所以等對話框完全關閉後再捲動，並把焦點移到目標
document.querySelectorAll('[data-scroll-after-dismiss]').forEach((button) => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal')
    modal?.addEventListener('hidden.bs.modal', () => {
      const target = document.querySelector(button.dataset.scrollAfterDismiss)
      if (!target) return
      target.setAttribute('tabindex', '-1')
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      target.focus({ preventScroll: true })
    }, { once: true })
  })
})

// 4. 課程列表：從首頁工藝情境卡進來時（courses.html?craft=pottery），預先選好該工藝分類
//    設計稿只改變選中狀態，課程卡不會跟著變
const craft = new URLSearchParams(location.search).get('craft')
if (craft) {
  const radio = document.querySelector(`input[name="craft"][value="${CSS.escape(craft)}"]`)
  if (radio) radio.checked = true
}

// 5. 「全部收合」：收起指定清單裡所有展開的章節（學習頁側欄）
//    <button type="button" data-collapse-all="#learnChapters">全部收合</button>
document.querySelectorAll('[data-collapse-all]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll(`${button.dataset.collapseAll} .collapse.show`).forEach((panel) => {
      bootstrap.Collapse.getOrCreateInstance(panel, { toggle: false }).hide()
    })
  })
})

// 6. 可橫向捲動的分頁籤：用方向鍵切換時，把切換到的項目捲進畫面（學習頁手機版的分頁）
//    只橫向捲動分頁列本身，不用 scrollIntoView（它會連帶捲動整頁）
document.querySelectorAll('[data-bs-toggle="tab"]').forEach((tab) => {
  tab.addEventListener('shown.bs.tab', () => {
    const nav = tab.closest('.nav')
    if (!nav || nav.scrollWidth <= nav.clientWidth) return
    const itemBox = tab.getBoundingClientRect()
    const navBox = nav.getBoundingClientRect()
    if (itemBox.left < navBox.left) nav.scrollBy({ left: itemBox.left - navBox.left, behavior: 'smooth' })
    else if (itemBox.right > navBox.right) nav.scrollBy({ left: itemBox.right - navBox.right, behavior: 'smooth' })
  })
})

// 7. 篩選按鈕：只顯示符合條件的項目（我的課程的「全部／學習中／已完成」）
//    <div role="group" data-filter-list="#my-courses-list">…<button type="button" data-filter="學習中" aria-pressed="false">…
//    清單的直接子項目寫 data-status="學習中"；data-filter="all" 顯示全部。目前選取的按鈕加 .active 與 aria-pressed="true"
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
    })
  })
})
