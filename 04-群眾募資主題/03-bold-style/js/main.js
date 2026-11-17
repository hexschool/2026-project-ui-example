// ============================================================
// 島造 ISLANDMAKE｜03 大膽新潮酷品：全站共用的少量互動
// collapse、dropdown、tab、scrollspy、offcanvas、accordion 都由 Bootstrap 的 data-bs-* 屬性處理，這裡只補六件事
// ============================================================

// 1. 手機搜尋列展開後，把焦點放進搜尋框
document.getElementById('siteSearchMobile')?.addEventListener('shown.bs.collapse', (event) => {
  event.target.querySelector('input')?.focus()
})

// 2. 可橫向捲動的分頁籤：切換到的項目若被切掉一半，把它捲進畫面
//    只橫向捲動分頁列本身，不用 scrollIntoView（它會連帶捲動整頁）
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

// 3. 追蹤按鈕：切換 aria-pressed（愛心實心／空心由 CSS 處理）
//    <button class="btn btn-follow" type="button" aria-pressed="false" aria-label="追蹤專案">
document.querySelectorAll('.btn-follow').forEach((button) => {
  button.addEventListener('click', () => {
    button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'))
  })
})

// 4. 回饋方案選取（project.html）
//    每張方案卡是 <label class="reward-tier"> 包住 <input type="radio" name="reward" value="2280" data-name="標準單入組">
//    選了方案：更新贊助小計（已選方案、方案金額、額外支持、總計）與自訂金額的最低金額
//    自訂金額 #pledgeAmount 低於方案金額時顯示錯誤樣式；快捷鈕 data-add="500" 把金額加上去
const rewardForm = document.getElementById('rewardForm')
if (rewardForm) {
  const amountInput = document.getElementById('pledgeAmount')
  const minText = document.getElementById('pledgeMin')
  const nextButton = document.getElementById('pledgeNext')
  const out = (key) => rewardForm.querySelector(`[data-summary="${key}"]`)
  const money = (n) => `NT$ ${n.toLocaleString('en-US')}`
  const selected = () => rewardForm.querySelector('input[name="reward"]:checked')

  const update = () => {
    const tier = selected()
    const base = Number(tier?.value || 0)
    const amount = Number(amountInput.value || 0)
    const tooLow = !tier || amount < base
    amountInput.min = base
    minText.textContent = base.toLocaleString('en-US')
    amountInput.classList.toggle('is-invalid', Boolean(tier) && amount < base)
    out('name').textContent = tier ? tier.dataset.name : '尚未選擇'
    out('base').textContent = money(base)
    out('extra').textContent = money(Math.max(amount - base, 0))
    out('total').textContent = money(tier ? Math.max(amount, base) : 0)
    nextButton.disabled = tooLow
    // 每張卡的按鈕文字：選中的寫「已選擇」，其他寫「選擇這個方案」（已額滿的方案不變）
    rewardForm.querySelectorAll('input[name="reward"]:not(:disabled)').forEach((input) => {
      const label = input.closest('.reward-tier')?.querySelector('.reward-tier-choose')
      if (label) label.textContent = input.checked ? '已選擇' : '選擇這個方案'
    })
  }

  rewardForm.querySelectorAll('input[name="reward"]').forEach((input) => {
    input.addEventListener('change', () => {
      amountInput.value = input.value // 換方案時，金額重設為方案金額
      update()
    })
  })
  amountInput.addEventListener('input', update)
  rewardForm.querySelectorAll('[data-add]').forEach((button) => {
    button.addEventListener('click', () => {
      amountInput.value = Math.max(Number(amountInput.value || 0), Number(selected()?.value || 0)) + Number(button.dataset.add)
      update()
    })
  })
  update()
}

// 5. 篩選按鈕：只顯示符合條件的項目（個人頁的贊助紀錄分頁）
//    <div data-filter-list="#backingList">…<button type="button" data-filter="waiting" aria-pressed="false">…
//    卡片寫 data-status="producing"；按鈕的 data-filter 可以對應多個狀態（空白分隔），"all" 顯示全部
document.querySelectorAll('[data-filter-list]').forEach((group) => {
  const buttons = group.querySelectorAll('[data-filter]')
  const items = document.querySelectorAll(`${group.dataset.filterList} > [data-status]`)
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter.split(' ')
      buttons.forEach((b) => {
        b.classList.toggle('active', b === button)
        b.setAttribute('aria-pressed', String(b === button))
      })
      items.forEach((item) => {
        item.hidden = !filter.includes('all') && !filter.includes(item.dataset.status)
      })
      revealInNav(button)
    })
  })
})

// 6. 角色切換（account.html，設計稿狀態示意）：切換外層的 data-role="proposer|backer"
//    CSS 依 data-role 顯示 .for-proposer／.for-backer；網址 account.html?role=backer 直接開贊助者畫面
const roleRoot = document.querySelector('[data-role]')
if (roleRoot) {
  const setRole = (role) => {
    roleRoot.dataset.role = role
    document.querySelectorAll('[data-set-role]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.setRole === role))
    })
    bootstrap.ScrollSpy.getInstance(document.body)?.refresh() // 區塊顯示／隱藏後重新計算目錄位置
  }
  document.querySelectorAll('[data-set-role]').forEach((button) => {
    button.addEventListener('click', () => setRole(button.dataset.setRole))
  })
  if (new URLSearchParams(location.search).get('role') === 'backer') setRole('backer')
}
