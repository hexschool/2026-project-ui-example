<script setup>
import { ref } from 'vue'

// 顯示密碼：同時切換「密碼」與「確認密碼」兩欄
const showPw = ref(false)

// 加入會員的好處（對應使用者故事：追蹤家具訂單與配送進度）；數字與單位之間用不換行空白（\u00a0），不會被拆成兩行
const perks = [
  { icon: 'bi-truck', text: '追蹤家具訂單與大型家具的配送進度' },
  { icon: 'bi-geo-alt', text: '儲存收件地址，下次結帳不必重新填寫' },
  { icon: 'bi-arrow-repeat', text: '線上申請 14\u00a0天租屋友善退換' },
]
</script>

<!-- 註冊：與登入共用 scss/pages/_auth.scss 的左右分割版型 -->
<template>
  <div class="container">
    <div class="row gx-lg-5">
      <div class="col-lg-6 d-none d-lg-block auth-visual-col">
        <div class="auth-visual">
          <!-- lazy：lg 以下這一欄不顯示，手機不會下載這張圖 -->
          <img
            src="images/auth.jpg"
            alt="午後光線透過亞麻紗簾，木凳上放著摺好的毛巾與插著枝葉的陶瓶"
            width="1066"
            height="1600"
            loading="lazy"
          />
          <p class="auth-visual-line">家不必大，<br />剛好就好。</p>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="auth-panel">
          <header class="page-header">
            <h1>建立帳號</h1>
            <p class="page-lead text-phrase">只要一分鐘。加入會員後，你可以：</p>
            <ul class="list-unstyled auth-perks">
              <li v-for="perk in perks" :key="perk.icon">
                <i class="bi" :class="perk.icon" aria-hidden="true"></i>{{ perk.text }}
              </li>
            </ul>
          </header>

          <form @submit.prevent="$router.push('/orders')">
            <div class="mb-4">
              <label class="form-label" for="reg-name">姓名</label>
              <input
                id="reg-name"
                class="form-control"
                type="text"
                name="name"
                autocomplete="name"
                placeholder="王小明"
                required
              />
            </div>

            <div class="mb-4">
              <label class="form-label" for="reg-email">Email</label>
              <input
                id="reg-email"
                class="form-control"
                type="email"
                name="email"
                autocomplete="email"
                autocapitalize="off"
                spellcheck="false"
                placeholder="name@example.com"
                required
              />
            </div>

            <div class="mb-4">
              <label class="form-label" for="reg-phone">手機</label>
              <input
                id="reg-phone"
                class="form-control num"
                type="tel"
                name="phone"
                autocomplete="tel"
                inputmode="tel"
                placeholder="0912 345 678"
                required
              />
            </div>

            <div class="mb-4">
              <label class="form-label" for="reg-password">密碼</label>
              <div class="auth-password">
                <input
                  id="reg-password"
                  class="form-control"
                  :type="showPw ? 'text' : 'password'"
                  name="password"
                  autocomplete="new-password"
                  minlength="8"
                  aria-describedby="reg-password-help"
                  required
                />
                <button
                  class="auth-password-toggle"
                  type="button"
                  aria-label="顯示密碼"
                  aria-controls="reg-password reg-password-confirm"
                  :aria-pressed="showPw"
                  @click="showPw = !showPw"
                >
                  <i class="bi" :class="showPw ? 'bi-eye-slash' : 'bi-eye'" aria-hidden="true"></i>
                </button>
              </div>
              <p id="reg-password-help" class="form-text mb-0">至少 8&nbsp;碼，需包含英文與數字</p>
            </div>

            <div class="mb-3">
              <label class="form-label" for="reg-password-confirm">確認密碼</label>
              <input
                id="reg-password-confirm"
                class="form-control"
                :type="showPw ? 'text' : 'password'"
                name="password-confirm"
                autocomplete="new-password"
                minlength="8"
                placeholder="再次輸入密碼"
                aria-describedby="reg-password-help"
                required
              />
            </div>

            <div class="form-check auth-check mb-4">
              <input id="reg-agree" class="form-check-input" type="checkbox" name="agree" required />
              <!-- 設計稿沒有條款頁，先連回本頁；不標成「目前頁面」 -->
              <label class="form-check-label" for="reg-agree">
                我已閱讀並同意<RouterLink to="/register" :aria-current="null">服務條款</RouterLink>與<RouterLink class="text-nowrap" to="/register" :aria-current="null">隱私權政策</RouterLink>
              </label>
            </div>

            <button class="btn btn-primary w-100" type="submit">建立帳號</button>
          </form>

          <p class="auth-switch">
            已經有帳號？<RouterLink class="btn btn-text fs-6 ms-1" to="/login">登入</RouterLink>
          </p>

          <!-- 設計稿狀態示意：送出後的欄位錯誤 -->
          <section class="demo-state" aria-labelledby="reg-state-title">
            <p class="demo-state-tag">設計稿狀態示意</p>
            <h2 id="reg-state-title" class="demo-state-title">送出後有欄位需要修正時</h2>
            <p class="text-note text-phrase">錯誤訊息直接寫在該欄下方，說明怎麼改；其他已填的欄位保留不清空。</p>

            <div class="demo-state-stage">
              <div class="mb-3">
                <label class="form-label" for="reg-demo-confirm">確認密碼</label>
                <input
                  id="reg-demo-confirm"
                  class="form-control is-invalid"
                  type="password"
                  value="nestcraft2025"
                  autocomplete="off"
                  aria-invalid="true"
                  aria-describedby="reg-demo-confirm-error"
                />
                <p id="reg-demo-confirm-error" class="invalid-feedback mb-0">兩次輸入的密碼不一致，請再輸入一次。</p>
              </div>

              <div class="form-check auth-check">
                <input
                  id="reg-demo-agree"
                  class="form-check-input is-invalid"
                  type="checkbox"
                  aria-invalid="true"
                  aria-describedby="reg-demo-agree-error"
                />
                <label class="form-check-label" for="reg-demo-agree">我已閱讀並同意服務條款與<span class="text-nowrap">隱私權政策</span></label>
              </div>
              <p id="reg-demo-agree-error" class="invalid-feedback d-block mb-0">請先勾選同意，才能建立帳號。</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
