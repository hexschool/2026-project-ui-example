// ============================================================
// Craftory｜05 瑞士國際排版：全站共用的少量互動
// collapse、dropdown、tab、modal、offcanvas、toast 都由 Bootstrap 的 data-bs-* 屬性處理，這裡只補五件事
// ============================================================

// 1. 登入對話框：從「立即購買，開始上課」開啟時，顯示未登入提示，主要按鈕改成「登入並開始上課」
//    觸發按鈕：<button data-bs-toggle="modal" data-bs-target="#authModal" data-auth-intent="purchase">
document.getElementById('authModal')?.addEventListener('show.bs.modal', (event) => {
  const purchase = event.relatedTarget?.dataset.authIntent === 'purchase'
  const modal = event.target
  modal.querySelector('[data-auth-notice]').hidden = !purchase
  modal.querySelector('[data-auth-submit]').textContent = purchase ? '登入並開始上課' : '登入'
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
