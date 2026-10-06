// ============================================================
// Craftory｜04 人文書院風：全站共用的少量互動
// collapse、modal、offcanvas、tab、dropdown、toast 都由 Bootstrap 的 data-bs-* 屬性處理，這裡只補五件事
// ============================================================

// 1. 登入對話框：從「立即購買，開始上課」開啟時，顯示未登入提示，主要按鈕改成「登入並開始上課」
//    觸發按鈕：<button data-bs-toggle="modal" data-bs-target="#authModal" data-auth-context="purchase">
document.getElementById('authModal')?.addEventListener('show.bs.modal', (event) => {
  const purchase = event.relatedTarget?.dataset.authContext === 'purchase'
  const modal = event.target
  modal.querySelector('[data-auth-notice]').hidden = !purchase
  modal.querySelector('[data-auth-label="default"]').hidden = purchase
  modal.querySelector('[data-auth-label="purchase"]').hidden = !purchase
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

// 3. 提示框（播放器進度條上的「上次看到 07:18」）：Bootstrap 的 tooltip 需要手動啟用
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
  if (radio) radio.checked = true
}
