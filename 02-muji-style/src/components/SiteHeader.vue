<script setup>
import { onMounted } from 'vue'
import { cartQty as cartCount } from '../data/products'

// 手機搜尋列展開後，把焦點直接放進搜尋框
onMounted(() => {
  document
    .getElementById('siteSearchMobile')
    ?.addEventListener('shown.bs.collapse', (e) => e.target.querySelector('input')?.focus())
})

// 跳至主要內容：hash 路由下不能用 href="#main"（會被當成路由），改為直接移動焦點
const skipToMain = () => document.getElementById('main')?.focus()
</script>

<template>
  <a class="skip-link" href="#main" @click.prevent="skipToMain">跳至主要內容</a>

  <!-- 公告列 -->
  <div class="site-notice">
    <div class="container">
      <p class="mb-0">
        全館滿 <span class="num">NT$ 3,000</span> 免運
        <span class="d-none d-md-inline">｜現貨 48 小時內出貨｜14 天租屋友善退換</span>
      </p>
    </div>
  </div>

  <header class="site-header">
    <nav class="navbar navbar-expand-lg" aria-label="主要導覽">
      <div class="container">
        <!-- 指向首頁的品牌連結不標 aria-current，避免首頁出現多個「目前頁面」 -->
        <RouterLink class="navbar-brand site-brand" to="/" :aria-current="null">
          <svg class="site-brand-mark" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M6 26V11l10-5 10 5v15" />
            <path class="accent" d="M12.5 26v-7.5h7V26" />
          </svg>
          <span class="site-brand-name">NestCraft</span>
          <span class="site-brand-tagline d-none d-xl-inline">原創生活家居選物</span>
        </RouterLink>

        <!-- 992px 以下的圖示列（桌機另一組放在導覽之後，讓 Tab 順序與畫面順序一致） -->
        <div class="d-flex d-lg-none align-items-center gap-1">
          <button
            class="site-icon-link d-lg-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#siteSearchMobile"
            aria-controls="siteSearchMobile"
            aria-expanded="false"
            aria-label="搜尋商品"
          >
            <i class="bi bi-search" aria-hidden="true"></i>
          </button>
          <!-- 手機（< 576px）空間不足，會員入口移到選單內 -->
          <RouterLink class="site-icon-link d-none d-sm-inline-grid" to="/login" aria-label="會員登入">
            <i class="bi bi-person" aria-hidden="true"></i>
          </RouterLink>
          <RouterLink class="site-icon-link" to="/cart" :aria-label="`購物車，${cartCount} 件商品`">
            <i class="bi bi-bag" aria-hidden="true"></i>
            <span class="site-cart-count num">{{ cartCount }}</span>
          </RouterLink>
          <button
            class="navbar-toggler site-icon-link"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#siteNav"
            aria-controls="siteNav"
            aria-expanded="false"
            aria-label="開啟選單"
          >
            <i class="bi bi-list" aria-hidden="true"></i>
          </button>
        </div>

        <div id="siteNav" class="collapse navbar-collapse">
          <ul class="navbar-nav ms-lg-4 me-auto">
            <li class="nav-item">
              <RouterLink class="nav-link" exact-active-class="active" to="/">首頁</RouterLink>
            </li>
            <li class="nav-item">
              <!-- 商品詳情頁也標示「商品一覽」為目前位置 -->
              <RouterLink
                class="nav-link"
                active-class="active"
                :class="{ active: $route.name === 'product' }"
                to="/products"
              >
                商品一覽
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ path: '/', hash: '#rooms' }" :aria-current="null" exact-active-class="">
                空間靈感
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" to="/orders">我的訂單</RouterLink>
            </li>
            <li class="nav-item d-sm-none">
              <RouterLink class="nav-link" active-class="active" to="/login">會員登入</RouterLink>
            </li>
          </ul>
          <form class="site-search d-none d-lg-block" role="search" @submit.prevent>
            <i class="bi bi-search" aria-hidden="true"></i>
            <input class="form-control" type="search" placeholder="搜尋家具、收納、尺寸…" aria-label="搜尋商品" />
          </form>
          <!-- 桌機圖示列：導覽 → 搜尋 → 會員 → 購物車 -->
          <div class="d-none d-lg-flex align-items-center gap-1 ms-3">
            <RouterLink class="site-icon-link" to="/login" aria-label="會員登入">
              <i class="bi bi-person" aria-hidden="true"></i>
            </RouterLink>
            <RouterLink class="site-icon-link" to="/cart" :aria-label="`購物車，${cartCount} 件商品`">
              <i class="bi bi-bag" aria-hidden="true"></i>
              <span class="site-cart-count num">{{ cartCount }}</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- 992px 以下：點放大鏡展開的搜尋列 -->
    <div id="siteSearchMobile" class="collapse d-lg-none site-search-mobile">
      <div class="container">
        <form class="site-search" role="search" @submit.prevent>
          <i class="bi bi-search" aria-hidden="true"></i>
          <input class="form-control" type="search" placeholder="搜尋家具、收納、尺寸…" aria-label="搜尋商品" />
        </form>
      </div>
    </div>
  </header>
</template>
