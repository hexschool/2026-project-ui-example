<script setup>
import CheckoutSteps from '../components/CheckoutSteps.vue'
import { orders, member, cartTotal, formatPrice } from '../data/products'

// 剛成立的訂單＝「我的訂單」列表的第一筆，兩頁的編號、品項、金額、付款方式一致
// 付款失敗示意：訂單沒有成立，應付金額取自購物車（cartTotal）
const order = orders[0]

// 接下來會發生什麼：真實的時間順序，所以用編號；數字與單位之間用不換行空白（\u00a0），不會被拆成兩行
const nextSteps = [
  { title: '備貨與出貨', desc: '現貨商品會在 48\u00a0小時內出貨，出貨時會以 Email 寄送物流單號。' },
  { title: '配送前一天來電', desc: '橡木餐桌屬大型家具，物流人員會在配送前一天來電，和你確認到貨時段與搬運動線。' },
  { title: '收貨後 14\u00a0天內可退換', desc: '若尺寸或顏色不合適，可以在「我的訂單」直接申請退換。' },
]
</script>

<template>
  <div class="container">
    <div class="or-wrap">
      <header class="page-header">
        <CheckoutSteps :current="3" />
        <h1><i class="bi bi-check2-circle or-title-icon" aria-hidden="true"></i>付款成功，訂單已成立</h1>
        <p class="page-lead text-phrase">
          訂單確認信已寄至 <span class="text-body">{{ member.email }}</span>。出貨與配送進度，之後都可以在「我的訂單」查看。
        </p>
      </header>

      <!-- 訂單摘要（樣式與購物車、結帳共用，見 scss/components/_order-summary.scss） -->
      <section class="order-summary" aria-labelledby="or-summary-title">
        <h2 id="or-summary-title" class="order-summary-title">訂單摘要</h2>

        <dl class="order-summary-rows">
          <div class="order-summary-row">
            <dt>訂單編號</dt>
            <dd class="num">{{ order.no }}</dd>
          </div>
          <div class="order-summary-row">
            <dt>付款方式</dt>
            <dd>{{ order.payment }}</dd>
          </div>
          <div class="order-summary-row">
            <dt>配送方式</dt>
            <dd>{{ order.shipping }}</dd>
          </div>
          <div class="order-summary-row">
            <dt>預計到貨</dt>
            <dd><span class="num">{{ order.eta }}</span>（五）前</dd>
          </div>
        </dl>

        <ul class="order-summary-items" aria-label="購買品項">
          <li v-for="item in order.items" :key="item.product.id" class="order-summary-item">
            <div class="order-summary-thumb img-frame">
              <img :src="item.product.image" alt="" />
            </div>
            <div class="order-summary-item-body">
              <p class="order-summary-item-name">{{ item.product.name }}</p>
              <p class="order-summary-item-meta">
                <span>數量 <span class="num">{{ item.qty }}</span></span>
                <span class="num"><span class="visually-hidden">小計</span>{{ formatPrice(item.subtotal) }}</span>
              </p>
            </div>
          </li>
        </ul>

        <dl class="order-summary-rows">
          <div class="order-summary-row order-summary-total">
            <dt>付款金額</dt>
            <dd class="price">{{ formatPrice(order.total) }}</dd>
          </div>
        </dl>
      </section>

      <!-- 接下來會發生什麼 -->
      <section class="mt-6" aria-labelledby="or-next-title">
        <h2 id="or-next-title" class="h4 mb-4">接下來會發生什麼</h2>
        <ol class="list-unstyled mb-0 or-timeline">
          <li v-for="(step, i) in nextSteps" :key="step.title">
            <span class="or-timeline-no num" aria-hidden="true">{{ i + 1 }}</span>
            <div>
              <h3 class="or-timeline-title">{{ step.title }}</h3>
              <p class="text-secondary text-phrase mb-0">{{ step.desc }}</p>
            </div>
          </li>
        </ol>
      </section>

      <div class="or-actions d-grid d-sm-flex gap-3 mt-6">
        <RouterLink class="btn btn-primary" to="/orders">查看我的訂單</RouterLink>
        <RouterLink class="btn btn-outline-primary" to="/products">繼續購物</RouterLink>
      </div>

      <!-- 設計稿狀態示意：付款未完成 -->
      <section class="demo-state" aria-labelledby="or-state-title">
        <p class="demo-state-tag">設計稿狀態示意</p>
        <h2 id="or-state-title" class="demo-state-title">付款未完成時</h2>
        <p class="text-note text-phrase">
          付款失敗時，上方的結帳步驟停在「填寫資料與付款」，標題與訂單摘要替換成以下區塊。
        </p>

        <div class="or-fail demo-state-stage">
          <h3 class="h4 mb-4">
            <i class="bi bi-exclamation-circle or-fail-icon" aria-hidden="true"></i>付款未完成，訂單尚未成立
          </h3>

          <div class="alert alert-warning mb-4">
            <p class="mb-2">發卡銀行沒有核准這筆交易，可能是額度不足，或簡訊驗證碼逾時。</p>
            <p class="mb-0">
              應付金額 <span class="price">{{ formatPrice(cartTotal) }}</span> 尚未扣款。購物車與收件資料都還保留著，重新付款時不需要再填一次。
            </p>
          </div>

          <h4 class="or-fail-subhead">你可以這樣做</h4>
          <ul class="or-fail-list mb-4">
            <li>確認卡片額度後，重新付款一次</li>
            <li>改用 ATM 轉帳或貨到付款</li>
            <li>仍無法完成時，請聯繫發卡銀行或<a class="text-nowrap" href="mailto:hello@nestcraft.example">我們的客服</a></li>
          </ul>

          <div class="d-grid d-sm-flex gap-3">
            <RouterLink class="btn btn-primary" to="/checkout">重新付款</RouterLink>
            <RouterLink class="btn btn-outline-primary" to="/cart">返回購物車</RouterLink>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
