<script setup>
import CheckoutSteps from '../components/CheckoutSteps.vue'
import { cartItems, cartSubtotal, cartQty, cartTotal, shippingText, formatPrice, formatSize } from '../data/products'

// 規格選項（示意）：購物車內可直接切換顏色／表面處理
const specOptions = {
  'p-1001': ['天然原木色', '淺灰洗白色'],
  'p-1007': ['米白', '淺原木', '亞麻灰'],
  'p-1008': ['霧白', '炭灰'],
}
</script>

<template>
  <div class="container">
    <header class="page-header">
      <CheckoutSteps :current="1" />
      <h1>購物車</h1>
      <p class="page-lead text-phrase">
        共 <span class="num">{{ cartItems.length }}</span> 項商品、<span class="num">{{ cartQty }}</span> 件。數量與規格可以在這裡直接調整。
      </p>
    </header>

    <!-- xl 以上的欄寬與間距和結帳頁相同，訂單摘要換頁時位置、寬度不變 -->
    <div class="row gy-5 gx-lg-4 gx-xl-6">
      <!-- 品項清單 -->
      <div class="col-lg-8">
        <!-- 手機、平板：總額與結帳按鈕先放在清單上方，不用捲到最下面才看得到 -->
        <div class="cart-quick card card-body flex-row align-items-center justify-content-between gap-3 mb-4 d-lg-none">
          <p class="mb-0">
            <span class="text-note d-block">應付總額（<span class="num">{{ cartQty }}</span> 件）</span>
            <span class="price cart-quick-total">{{ formatPrice(cartTotal) }}</span>
          </p>
          <RouterLink class="btn btn-primary" to="/checkout">前往結帳</RouterLink>
        </div>

        <section aria-labelledby="cart-items-title">
          <h2 id="cart-items-title" class="visually-hidden">購物車品項</h2>

          <div class="cart-cols d-none d-md-block" aria-hidden="true">
            <div class="row gx-3">
              <div class="col-md-6">商品</div>
              <div class="col-md-3 text-center">數量</div>
              <div class="col-md-3 text-end">小計</div>
            </div>
          </div>

          <ul class="list-unstyled mb-0">
            <li v-for="item in cartItems" :key="item.product.id" class="cart-item card card-body">
              <div class="row gx-3 gy-3 align-items-stretch align-items-md-center">
                <div class="col-12 col-md-6">
                  <div class="d-flex gap-3 gap-md-4 gap-lg-3 gap-xl-4">
                    <RouterLink
                      class="cart-item-media img-frame flex-shrink-0 align-self-start"
                      :to="`/product/${item.product.id}`"
                      tabindex="-1"
                      aria-hidden="true"
                    >
                      <img :src="item.product.image" alt="" />
                    </RouterLink>

                    <div class="flex-grow-1">
                      <h3 class="cart-item-name text-phrase">
                        <RouterLink :to="`/product/${item.product.id}`">{{ item.product.name }}</RouterLink>
                      </h3>
                      <p class="dim mb-1">
                        <span class="dim-line" aria-hidden="true"></span>
                        <span>{{ formatSize(item.product.size, item.product.sizeNote) }}</span>
                      </p>
                      <p class="text-note mb-2">單價 <span class="num">{{ formatPrice(item.product.price) }}</span></p>
                      <div class="d-flex align-items-center gap-2">
                        <label class="text-note flex-shrink-0" :for="`spec-${item.product.id}`">
                          規格<span class="visually-hidden">（{{ item.product.name }}）</span>
                        </label>
                        <select :id="`spec-${item.product.id}`" class="form-select form-select-sm cart-spec">
                          <option v-for="opt in specOptions[item.product.id]" :key="opt">{{ opt }}</option>
                        </select>
                      </div>
                      <p v-if="item.product.size.w >= 120" class="text-note mt-2 mb-0">
                        <i class="bi bi-truck me-1" aria-hidden="true"></i>大型家具，配送前一天會來電。
                      </p>
                    </div>
                  </div>
                </div>

                <!-- 手機：數量、小計與商品資訊之間的分隔線（跟內容等寬） -->
                <div class="col-12 d-md-none" aria-hidden="true">
                  <hr class="rule" />
                </div>

                <div class="col-auto col-md-3 d-flex align-items-center justify-content-md-center">
                  <div class="d-flex flex-md-column align-items-center gap-3 gap-md-1">
                    <!-- 數量為 1 時「−」停用；要刪除請用「移除」 -->
                    <div class="qty">
                      <button class="btn" type="button" :aria-label="`減少數量（${item.product.name}）`" :disabled="item.qty === 1">−</button>
                      <input type="text" :value="item.qty" inputmode="numeric" :aria-label="`數量（${item.product.name}）`" />
                      <button class="btn" type="button" :aria-label="`增加數量（${item.product.name}）`">+</button>
                    </div>
                    <button class="btn btn-text" type="button" :aria-label="`移除 ${item.product.name}`">
                      <i class="bi bi-trash me-1" aria-hidden="true"></i>移除
                    </button>
                  </div>
                </div>

                <div class="col col-md-3 d-flex align-items-center justify-content-end">
                  <span class="visually-hidden">小計</span>
                  <span class="price">{{ formatPrice(item.subtotal) }}</span>
                </div>
              </div>
            </li>
          </ul>
        </section>

        <!-- 折扣碼：安靜地放在清單下方，不搶結帳的注意力 -->
        <form class="cart-coupon mt-5" @submit.prevent>
          <label class="form-label" for="cart-coupon">折扣碼<span class="form-label-optional">選填</span></label>
          <div class="input-group">
            <input id="cart-coupon" class="form-control" type="text" autocomplete="off" placeholder="輸入折扣碼" />
            <button class="btn btn-outline-primary" type="submit">套用</button>
          </div>
        </form>
      </div>

      <!-- 訂單摘要（樣式見 scss/components/_order-summary.scss，與結帳、付款結果共用） -->
      <div class="col-md-8 offset-md-4 col-lg-4 offset-lg-0">
        <aside class="order-summary is-sticky" aria-labelledby="cart-summary-title">
          <h2 id="cart-summary-title" class="order-summary-title">訂單摘要</h2>

          <dl class="order-summary-rows">
            <div class="order-summary-row">
              <dt>商品小計（<span class="num">{{ cartQty }}</span> 件）</dt>
              <dd class="num">{{ formatPrice(cartSubtotal) }}</dd>
            </div>
            <div class="order-summary-row">
              <dt>運費</dt>
              <dd>{{ shippingText }}</dd>
              <dd class="order-summary-note">已達滿 <span class="num">NT$ 3,000</span> 免運門檻</dd>
            </div>
            <div class="order-summary-row order-summary-total">
              <dt>應付總額</dt>
              <dd class="price">{{ formatPrice(cartTotal) }}</dd>
            </div>
          </dl>

          <RouterLink class="btn btn-primary w-100 mt-4" to="/checkout">前往結帳</RouterLink>
          <div class="text-center mt-2">
            <RouterLink class="btn btn-text" to="/products">繼續購物</RouterLink>
          </div>

          <ul class="cart-assure list-unstyled mb-0">
            <li>
              <i class="bi bi-arrow-repeat" aria-hidden="true"></i>
              <span>14&nbsp;天租屋友善退換，搬家前後都適用</span>
            </li>
            <li>
              <i class="bi bi-shield-lock" aria-hidden="true"></i>
              <span>付款資料加密傳輸，不會儲存完整卡號</span>
            </li>
          </ul>
        </aside>
      </div>
    </div>

    <!-- 設計稿狀態示意：購物車是空的（規則同 Guideline 的「空狀態」） -->
    <section class="demo-state" aria-labelledby="cart-state-title">
      <p class="demo-state-tag">設計稿狀態示意</p>
      <h2 id="cart-state-title" class="demo-state-title">購物車是空的時</h2>
      <p class="text-note text-phrase">頁首只留標題「購物車」，結帳步驟與訂單摘要都隱藏，標題下方改顯示以下區塊。</p>

      <div class="empty-state">
        <p>購物車裡還沒有商品。</p>
        <RouterLink class="btn btn-primary" to="/products">瀏覽商品一覽</RouterLink>
      </div>
    </section>
  </div>
</template>
