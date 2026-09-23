import { createRouter, createWebHashHistory } from 'vue-router'

// 每個頁面一個 .vue；meta.title 用於分頁標題與頁尾「設計稿頁面導覽」
export const routes = [
  { path: '/', name: 'home', component: () => import('./views/HomeView.vue'), meta: { title: '首頁' } },
  { path: '/products', name: 'products', component: () => import('./views/ProductsView.vue'), meta: { title: '商品一覽' } },
  { path: '/product/:id', name: 'product', component: () => import('./views/ProductDetailView.vue'), meta: { title: '商品詳情' } },
  { path: '/cart', name: 'cart', component: () => import('./views/CartView.vue'), meta: { title: '購物車' } },
  { path: '/checkout', name: 'checkout', component: () => import('./views/CheckoutView.vue'), meta: { title: '結帳' } },
  { path: '/order-result', name: 'order-result', component: () => import('./views/OrderResultView.vue'), meta: { title: '付款結果' } },
  { path: '/login', name: 'login', component: () => import('./views/LoginView.vue'), meta: { title: '登入' } },
  { path: '/register', name: 'register', component: () => import('./views/RegisterView.vue'), meta: { title: '註冊' } },
  { path: '/orders', name: 'orders', component: () => import('./views/OrdersView.vue'), meta: { title: '我的訂單' } },
  { path: '/guideline', name: 'guideline', component: () => import('./views/GuidelineView.vue'), meta: { title: '設計 Guideline' } },
]

const router = createRouter({
  // Hash 模式：build 後直接放上靜態主機也不會因重新整理而 404
  history: createWebHashHistory(),
  routes,
  async scrollBehavior(to, from) {
    if (to.hash && !to.hash.startsWith('#/')) {
      // 等字型載入完成再定位，否則版面還會長高，錨點會停錯位置
      await document.fonts.ready
      // 鍵盤焦點也移到目標區塊，下一次 Tab 才會從這裡繼續
      const el = document.querySelector(to.hash)
      if (el) {
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
        el.focus({ preventScroll: true })
      }
      // top 對應 SCSS 的 $sticky-top-offset（頁首 82px ＋ 24px 間距），改 token 時要同步
      return { el: to.hash, top: 106, behavior: from.matched.length ? 'smooth' : 'instant' }
    }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = `${to.meta.title}｜NestCraft 原創生活家居選物`
})

export default router
