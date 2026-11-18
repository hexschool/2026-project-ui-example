// ============================================================
// Craftory｜02 北歐明亮課室：全站共用的少量互動
// collapse、modal、offcanvas、tab、dropdown、toast 都由 Bootstrap 的 data-bs-* 屬性處理，這裡只補六件事
// ============================================================

// 1. 登入對話框：從「立即購買，開始上課」（或註冊頁的「登入」）開啟時，顯示未登入提示，主要按鈕改成「登入並開始上課」
//    觸發按鈕：<button data-bs-toggle="modal" data-bs-target="#authModal" data-auth-context="purchase">
//    送出目的地也跟著換：購買情境到 checkout.html（購買課程），一般情境還原成表單原本的 action（learn.html）
document.getElementById('authModal')?.addEventListener('show.bs.modal', (event) => {
  const purchase = event.relatedTarget?.dataset.authContext === 'purchase'
  const modal = event.target
  modal.querySelector('[data-auth-notice]').hidden = !purchase
  modal.querySelector('[data-auth-label="default"]').hidden = purchase
  modal.querySelector('[data-auth-label="purchase"]').hidden = !purchase
  const form = modal.querySelector('form')
  form.dataset.defaultAction ??= form.getAttribute('action')
  form.setAttribute('action', purchase ? 'checkout.html' : form.dataset.defaultAction)
})

// 2. 關閉對話框後捲到指定位置（鎖定單元提示的「看看課程包含什麼」→ 購買卡）
//    <button type="button" data-bs-dismiss="modal" data-dismiss-to="#purchase">
//    Bootstrap 的 data-bs-dismiss 會取消連結的預設行為，所以等對話框完全關閉後再捲動、移動焦點
document.querySelectorAll('[data-dismiss-to]').forEach((button) => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal')
    modal?.addEventListener('hidden.bs.modal', () => {
      const target = document.querySelector(button.dataset.dismissTo)
      if (!target) return
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      target.focus({ preventScroll: true })
    }, { once: true })
  })
})

// 3. 提示框（播放器與學習進度條上的「上次看到 07:18」）：Bootstrap 的 tooltip 需要手動啟用
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
  bootstrap.Tooltip.getOrCreateInstance(element)
})

// 4. 「全部收合」：收合指定容器裡所有展開的章節（學習頁側欄）
//    <button type="button" data-collapse-all="#learnChapters">全部收合</button>
document.querySelectorAll('[data-collapse-all]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll(`${button.dataset.collapseAll} .collapse.show`).forEach((panel) => {
      bootstrap.Collapse.getOrCreateInstance(panel, { toggle: false }).hide()
    })
  })
})

// 5. 課程列表：從首頁工藝情境卡進來時（courses.html?craft=pottery），預先選中該分類
//    課程卡不會跟著變（設計稿只示意篩選的選中狀態）
const craft = new URLSearchParams(window.location.search).get('craft')
if (craft) {
  const radio = document.querySelector(`input[name="craft"][value="${CSS.escape(craft)}"]`)
  if (radio) {
    radio.checked = true
    // < 992px 分類膠囊是橫向捲動的一列：把選中的那顆捲到中間（只捲這一列，不動整頁）
    const label = radio.labels[0]
    const row = label?.closest('.is-scroll')
    if (row && row.scrollWidth > row.clientWidth) {
      const offset = label.getBoundingClientRect().left - row.getBoundingClientRect().left
      row.scrollLeft += offset - (row.clientWidth - label.offsetWidth) / 2
    }
  }
}

// 6. 篩選分頁：只顯示符合條件的項目（我的課程的「全部／學習中／已完成」）
//    <div data-filter-list="#my-courses-list">…<button type="button" data-filter="學習中" aria-pressed="false">…
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
