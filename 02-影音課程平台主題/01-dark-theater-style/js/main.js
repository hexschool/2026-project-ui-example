// ============================================================
// Craftory｜01 極致暗黑劇院：全站共用的少量互動
// collapse、dropdown、tab、modal、offcanvas、toast 都由 Bootstrap 的 data-bs-* 屬性處理，這裡只補六件事
// ============================================================

// 1. 手機搜尋列展開後，把焦點放進搜尋框
document.getElementById('siteSearchMobile')?.addEventListener('shown.bs.collapse', (event) => {
  event.target.querySelector('input')?.focus()
})

// 2. 登入對話框：從「立即購買，開始上課」開啟時（按鈕有 data-auth-context="purchase"），
//    顯示未登入提示「登入後就能開始上課…」，主要按鈕改成「登入並開始上課」；從頁首開啟時恢復一般版
document.getElementById('authModal')?.addEventListener('show.bs.modal', (event) => {
  const isPurchase = event.relatedTarget?.dataset.authContext === 'purchase'
  const modal = event.target
  modal.querySelector('.auth-hint').hidden = !isPurchase
  const submit = modal.querySelector('[data-auth-submit]')
  submit.textContent = isPurchase ? submit.dataset.labelPurchase : submit.dataset.labelDefault
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
