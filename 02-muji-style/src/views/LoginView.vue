<script setup>
import { ref } from 'vue'

// 顯示密碼：切換密碼欄的 type
const showPw = ref(false)
</script>

<!-- 登入：lg 左右分割（左：直幅靜物＋品牌語／右：表單），版型見 scss/pages/_auth.scss -->
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
            <h1>登入</h1>
            <p class="page-lead text-phrase">登入後，可以查看訂單與大型家具的配送進度。</p>
          </header>

          <form @submit.prevent="$router.push('/orders')">
            <div class="mb-4">
              <label class="form-label" for="login-email">Email</label>
              <input
                id="login-email"
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

            <div class="mb-2">
              <label class="form-label" for="login-password">密碼</label>
              <div class="auth-password">
                <input
                  id="login-password"
                  class="form-control"
                  :type="showPw ? 'text' : 'password'"
                  name="password"
                  autocomplete="current-password"
                  required
                />
                <button
                  class="auth-password-toggle"
                  type="button"
                  aria-label="顯示密碼"
                  aria-controls="login-password"
                  :aria-pressed="showPw"
                  @click="showPw = !showPw"
                >
                  <i class="bi" :class="showPw ? 'bi-eye-slash' : 'bi-eye'" aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center mb-4">
              <div class="form-check auth-check">
                <input id="login-remember" class="form-check-input" type="checkbox" name="remember" />
                <label class="form-check-label" for="login-remember">記住我</label>
              </div>
              <!-- 設計稿沒有重設密碼頁，先連回本頁；不標成「目前頁面」 -->
              <RouterLink class="btn btn-text fs-6" to="/login" :aria-current="null">忘記密碼？</RouterLink>
            </div>

            <button class="btn btn-primary w-100" type="submit">登入</button>
          </form>

          <p class="auth-divider">或</p>

          <div class="d-grid gap-3">
            <button class="btn auth-social" type="button">
              <i class="bi bi-line" aria-hidden="true"></i>使用 LINE 登入
            </button>
            <button class="btn auth-social" type="button">
              <i class="bi bi-google" aria-hidden="true"></i>使用 Google 登入
            </button>
          </div>

          <p class="auth-switch">
            還沒有帳號？<RouterLink class="btn btn-text fs-6 ms-1" to="/register">立即註冊</RouterLink>
          </p>

          <!-- 設計稿狀態示意：帳密錯誤 -->
          <section class="demo-state" aria-labelledby="login-state-title">
            <p class="demo-state-tag">設計稿狀態示意</p>
            <h2 id="login-state-title" class="demo-state-title">登入失敗時</h2>
            <p class="text-note text-phrase">送出後驗證失敗，表單最上方會出現這則提示；已填的 Email 保留，只清空密碼。</p>

            <div class="alert alert-danger auth-alert mb-0">
              <i class="bi bi-x-circle" aria-hidden="true"></i>
              <div>
                <p class="auth-alert-title">沒有登入成功</p>
                <p class="text-phrase mb-0">Email 或密碼不正確。請再確認一次，或用「忘記密碼？」重新設定。</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
