<script setup>
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <!-- 內容較短的頁面，頁尾也貼齊視窗底部 -->
  <div class="d-flex flex-column min-vh-100">
    <SiteHeader />
    <main id="main" class="flex-grow-1" tabindex="-1">
      <!-- key：同一路由只換參數（例如商品 id）時也重新建立頁面 -->
      <RouterView :key="$route.path" />
    </main>
    <SiteFooter />
  </div>
</template>
