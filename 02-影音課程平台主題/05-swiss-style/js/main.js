// ============================================================
// Craftory｜05 瑞士國際排版：全站共用的少量互動
// collapse、dropdown、tab、modal、offcanvas、toast 都由 Bootstrap 的 data-bs-* 屬性處理，這裡只補六件事
// ============================================================

// 1. 登入對話框：從「立即購買，開始上課」（或註冊頁的「登入」）開啟時，顯示未登入提示，主要按鈕改成「登入並開始上課」，
//    送出目的地改成購買課程 checkout.html；一般情境還原成範本寫的 learn.html
//    觸發按鈕：<button data-bs-toggle="modal" data-bs-target="#authModal" data-auth-intent="purchase">
document.getElementById('authModal')?.addEventListener('show.bs.modal', (event) => {
  const purchase = event.relatedTarget?.dataset.authIntent === 'purchase'
  const modal = event.target
  modal.querySelector('[data-auth-notice]').hidden = !purchase
  modal.querySelector('[data-auth-submit]').textContent = purchase ? '登入並開始上課' : '登入'
  const form = modal.querySelector('.auth-form')
  form.dataset.defaultAction ??= form.getAttribute('action')
  form.setAttribute('action', purchase ? 'checkout.html' : form.dataset.defaultAction)
})

// 2. 關閉對話框後捲到指定位置（鎖定單元提示的「看看課程包含什麼」→ 購買卡 #purchase）
//    <button type="button" data-bs-dismiss="modal" data-scroll-to="#purchase">
//    Bootstrap 的 data-bs-dismiss 會擋掉 <a href> 的跳轉，所以等對話框完全關閉後再捲動並移動焦點
document.querySelectorAll('[data-scroll-to]').forEach((button) => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal')
    const target = document.querySelector(button.dataset.scrollTo)
    if (!modal || !target) return
    modal.addEventListener('hidden.bs.modal', () => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      target.focus({ preventScroll: true })
    }, { once: true })
  })
})

// 3. 「全部收合」：把指定範圍內展開中的章節都收起來（學習頁側欄）
//    <button type="button" data-collapse-all="#learnChapters">全部收合</button>
document.querySelectorAll('[data-collapse-all]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll(`${button.dataset.collapseAll} .collapse.show`).forEach((panel) => {
      bootstrap.Collapse.getOrCreateInstance(panel).hide()
    })
  })
})

// 4. 首頁工藝情境卡帶入分類：courses.html?craft=pottery 會預先選中「陶藝」
//    （設計稿只改變篩選的選中狀態，課程卡不會跟著變）
const craft = new URLSearchParams(window.location.search).get('craft')
if (craft) {
  const radio = document.querySelector(`input[name="craft"][value="${CSS.escape(craft)}"]`)
  if (radio) radio.checked = true
}

// 5. 顯示網格：在 <html> 切換 .show-grid，畫面最上層出現 12 欄覆蓋（Guideline）
//    <button type="button" data-grid-toggle aria-pressed="false">顯示網格</button>
document.querySelectorAll('[data-grid-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const on = document.documentElement.classList.toggle('show-grid')
    document.querySelectorAll('[data-grid-toggle]').forEach((b) => b.setAttribute('aria-pressed', String(on)))
  })
})

// 6. 篩選分頁籤：只顯示符合條件的項目（我的課程的「全部／學習中／已完成」，寫法同 01 電商「我的訂單」）
//    <div data-filter-list="#myCoursesList">…<button type="button" data-filter="學習中" aria-pressed="false">…
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
