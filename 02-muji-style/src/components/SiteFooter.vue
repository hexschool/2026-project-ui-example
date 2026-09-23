<script setup>
import { routes } from '../router'

// 設計稿頁面導覽：列出所有頁面，方便檢視（詳情頁以第一件商品示意）
const pages = routes.map((r) => ({
  title: r.meta.title,
  to: r.path.replace(':id', 'p-1001'),
}))
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="row gy-5">
        <div class="col-lg-4">
          <RouterLink class="site-brand mb-3" to="/" :aria-current="null">
            <span class="site-brand-name">NestCraft</span>
          </RouterLink>
          <p class="site-footer-lead">
            把有限的坪數，活出無限的講究。<br />
            專為租屋族與小空間打造的模組家具。
          </p>
        </div>
        <!-- 購物指南、品牌故事尚未設計頁面：用不帶 href 的佔位連結（不會被 hash 路由當成「回首頁」） -->
        <div class="col-6 col-md-4 col-lg-2">
          <h2 class="site-footer-title">購物指南</h2>
          <ul class="list-unstyled site-footer-links">
            <li><a>運送與安裝</a></li>
            <li><a>14 天退換說明</a></li>
            <li><a>付款方式</a></li>
          </ul>
        </div>
        <div class="col-6 col-md-4 col-lg-2">
          <h2 class="site-footer-title">關於 NestCraft</h2>
          <ul class="list-unstyled site-footer-links">
            <li><a>品牌故事</a></li>
            <li><RouterLink :to="{ path: '/', hash: '#rooms' }" :aria-current="null">空間靈感</RouterLink></li>
            <li><RouterLink to="/products">全部商品</RouterLink></li>
          </ul>
        </div>
        <div class="col-md-4 col-lg-4">
          <h2 class="site-footer-title">客服中心</h2>
          <ul class="list-unstyled site-footer-links">
            <li>週一至週五 10:00–18:00</li>
            <li><a href="mailto:hello@nestcraft.example">hello@nestcraft.example</a></li>
          </ul>
        </div>
      </div>

      <!-- 設計稿頁面導覽（課程檢視用） -->
      <nav class="site-footer-pages" aria-label="設計稿頁面導覽">
        <h2 class="site-footer-title">設計稿頁面</h2>
        <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
          <li v-for="page in pages" :key="page.to">
            <RouterLink class="btn btn-sm btn-outline-secondary" :to="page.to">{{ page.title }}</RouterLink>
          </li>
        </ul>
      </nav>

      <p class="site-footer-copy">
        © 2026 NestCraft 原創生活家居選物｜本站為課程設計稿範例，商品與訂單皆為示意資料。
      </p>
    </div>
  </footer>
</template>
