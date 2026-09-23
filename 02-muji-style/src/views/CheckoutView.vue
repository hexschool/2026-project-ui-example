<script setup>
import CheckoutSteps from '../components/CheckoutSteps.vue'
import { cartItems, cartSubtotal, cartTotal, shippingText, formatPrice, member } from '../data/products'

// 表單選項（示意）
const cities = ['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市']
const districts = ['中正區', '大安區', '信義區', '松山區', '中山區', '內湖區']

// 配送方式：宅配到府、門市自取、大型家具到府安裝、超商取貨（購物車有大型家具，停用並寫明原因）
// 說明文字的數字與單位之間用不換行空白（\u00a0），不會被拆成兩行
const shippingOptions = [
  { id: 'ship-home', title: '宅配到府', fee: '免運', icon: 'bi-truck', desc: '3–5\u00a0個工作天送達，大型家具由兩位專人搬運進屋。', checked: true },
  { id: 'ship-pickup', title: '門市自取', fee: '免運', icon: 'bi-shop-window', desc: '到貨後以簡訊通知，7\u00a0天內到台北門市取貨。' },
  { id: 'ship-install', title: '大型家具到府安裝', fee: '+NT$ 800', icon: 'bi-tools', desc: '專人組裝並帶走包材，沒有工具也不用擔心。' },
  { id: 'ship-store', title: '超商取貨', fee: '不適用', icon: 'bi-shop', desc: '購物車內的橡木餐桌屬大型家具，無法以超商寄送。', disabled: true },
]

const paymentOptions = [
  { value: 'card', title: '信用卡', icon: 'bi-credit-card', desc: '一次付清，立即完成付款', checked: true },
  { value: 'atm', title: 'ATM 轉帳', icon: 'bi-bank', desc: '取得虛擬帳號，3\u00a0天內轉帳' },
  { value: 'cod', title: '貨到付款', icon: 'bi-cash-coin', desc: '商品送達時付款給物流人員' },
  { value: 'mobile', title: '行動支付', icon: 'bi-phone', desc: 'Apple Pay、LINE Pay' },
]
</script>

<template>
  <div class="container">
    <header class="page-header">
      <CheckoutSteps :current="2" />
      <h1>填寫資料與付款</h1>
      <p class="page-lead text-phrase">除了標示「選填」的欄位，其他都需要填寫。資料只會用於這筆訂單的配送與聯繫。</p>
    </header>

    <!-- xl 以上的欄寬與間距和購物車相同，訂單摘要換頁時位置、寬度不變；lg 摘要多一欄，品名才有足夠寬度 -->
    <div class="row gy-5 gx-lg-5 gx-xl-6">
      <!-- 手機、平板：可展開的訂單摘要放在表單前面（畫面與鍵盤順序一致） -->
      <div class="col-12 d-lg-none">
        <aside class="order-summary p-0" aria-label="訂單摘要">
          <h2 class="mb-0">
            <button
              class="co-summary-toggle"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#coSummaryBody"
              aria-expanded="false"
              aria-controls="coSummaryBody"
            >
              <span><i class="bi bi-bag me-2" aria-hidden="true"></i>查看訂單明細</span>
              <span class="d-inline-flex align-items-center gap-2">
                <span class="price">{{ formatPrice(cartTotal) }}</span>
                <i class="bi bi-chevron-down co-summary-chevron" aria-hidden="true"></i>
              </span>
            </button>
          </h2>

          <div id="coSummaryBody" class="collapse">
            <div class="co-summary-body">
              <ul class="order-summary-items">
                <li v-for="item in cartItems" :key="item.product.id" class="order-summary-item">
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
                <div class="order-summary-row">
                  <dt>商品小計</dt>
                  <dd class="num">{{ formatPrice(cartSubtotal) }}</dd>
                </div>
                <div class="order-summary-row">
                  <dt>運費</dt>
                  <dd>{{ shippingText }}</dd>
                </div>
                <div class="order-summary-row order-summary-total">
                  <dt>應付總額</dt>
                  <dd class="price">{{ formatPrice(cartTotal) }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </aside>
      </div>

      <!-- 表單 -->
      <div class="col-lg-7 col-xl-8">
        <!--
          設計稿示意：novalidate 讓「確認付款」可以直接前往付款結果頁。
          正式串接時拿掉 novalidate，交給瀏覽器（或自訂驗證）檢查必填欄位。
        -->
        <form id="checkoutForm" novalidate @submit.prevent="$router.push('/order-result')">
          <!-- 收件資訊 -->
          <fieldset class="co-fieldset">
            <legend class="co-legend"><h2 class="h4 mb-0">收件資訊</h2></legend>
            <div class="row g-4">
              <div class="col-md-6">
                <label class="form-label" for="co-name">收件人姓名</label>
                <input id="co-name" class="form-control" type="text" autocomplete="shipping name" placeholder="王小明" required />
              </div>
              <div class="col-md-6">
                <label class="form-label" for="co-tel">手機號碼</label>
                <input
                  id="co-tel"
                  class="form-control"
                  type="tel"
                  inputmode="tel"
                  autocomplete="shipping tel"
                  placeholder="0912 345 678"
                  aria-describedby="co-tel-help"
                  required
                />
                <p id="co-tel-help" class="form-text mb-0">只用於配送當天聯繫。</p>
              </div>
              <div class="col-12">
                <label class="form-label" for="co-email">Email</label>
                <input
                  id="co-email"
                  class="form-control"
                  type="email"
                  inputmode="email"
                  autocomplete="email"
                  :value="member.email"
                  placeholder="name@example.com"
                  aria-describedby="co-email-help"
                  required
                />
                <p id="co-email-help" class="form-text mb-0">訂單確認信與出貨通知會寄到這裡。</p>
              </div>
              <div class="col-6">
                <label class="form-label" for="co-city">縣市</label>
                <select id="co-city" class="form-select" autocomplete="shipping address-level1" required>
                  <option value="" selected disabled>請選擇</option>
                  <option v-for="city in cities" :key="city">{{ city }}</option>
                </select>
              </div>
              <div class="col-6">
                <label class="form-label" for="co-district">鄉鎮市區</label>
                <select id="co-district" class="form-select" autocomplete="shipping address-level2" required>
                  <option value="" selected disabled>請選擇</option>
                  <option v-for="d in districts" :key="d">{{ d }}</option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label" for="co-address">詳細地址</label>
                <input
                  id="co-address"
                  class="form-control"
                  type="text"
                  autocomplete="shipping address-line1"
                  placeholder="路名、巷弄、門牌與樓層"
                  aria-describedby="co-address-help"
                  required
                />
                <p id="co-address-help" class="form-text mb-0">若沒有電梯，請一併寫上樓層，我們會安排足夠的搬運人力。</p>
              </div>
            </div>
          </fieldset>

          <!-- 配送方式 -->
          <fieldset class="co-fieldset">
            <legend class="co-legend"><h2 class="h4 mb-0">配送方式</h2></legend>
            <div class="d-grid gap-3">
              <label
                v-for="opt in shippingOptions"
                :key="opt.id"
                class="co-option"
                :class="{ 'is-disabled': opt.disabled }"
              >
                <input
                  :id="opt.id"
                  class="form-check-input"
                  type="radio"
                  name="shipping"
                  :value="opt.id"
                  :checked="opt.checked"
                  :disabled="opt.disabled"
                />
                <span class="co-option-body">
                  <span class="co-option-head">
                    <span class="co-option-title">
                      <i class="bi me-2" :class="opt.icon" aria-hidden="true"></i>{{ opt.title }}
                    </span>
                    <span class="co-option-fee num">{{ opt.fee }}</span>
                  </span>
                  <span class="co-option-desc">{{ opt.desc }}</span>
                </span>
              </label>
            </div>
          </fieldset>

          <!-- 付款方式 -->
          <fieldset class="co-fieldset co-pay">
            <legend class="co-legend"><h2 class="h4 mb-0">付款方式</h2></legend>
            <div class="row row-cols-1 row-cols-md-2 g-3">
              <div v-for="opt in paymentOptions" :key="opt.value" class="col">
                <label class="co-option h-100">
                  <input
                    :id="`pay-${opt.value}`"
                    class="form-check-input"
                    type="radio"
                    name="payment"
                    :value="opt.value"
                    :checked="opt.checked"
                  />
                  <span class="co-option-body">
                    <span class="co-option-title">
                      <i class="bi me-2" :class="opt.icon" aria-hidden="true"></i>{{ opt.title }}
                    </span>
                    <span class="co-option-desc">{{ opt.desc }}</span>
                  </span>
                </label>
              </div>
            </div>

            <!--
              信用卡欄位：選「信用卡」時才顯示，由 CSS :has() 切換（見 _checkout.scss）。
              這三欄不加 required：選其他付款方式時欄位只是被隱藏，若仍是 required，瀏覽器會擋下送出。
              以 aria-required 告知螢幕閱讀器必填，實際檢查放在送出時依付款方式處理（或交給金流頁）。
            -->
            <fieldset class="co-card card card-body mt-4">
              <legend class="visually-hidden">信用卡資料</legend>
              <div class="row g-4">
                <div class="col-12">
                  <div class="d-flex flex-wrap justify-content-between align-items-baseline column-gap-3">
                    <label class="form-label" for="co-cc-number">卡號</label>
                    <p class="text-note mb-2">
                      <i class="bi bi-lock me-1" aria-hidden="true"></i>資料以 SSL 加密傳輸
                    </p>
                  </div>
                  <input
                    id="co-cc-number"
                    class="form-control num"
                    type="text"
                    inputmode="numeric"
                    autocomplete="cc-number"
                    placeholder="0000 0000 0000 0000"
                    aria-required="true"
                  />
                </div>
                <div class="col-6">
                  <label class="form-label" for="co-cc-exp">有效期限</label>
                  <input
                    id="co-cc-exp"
                    class="form-control num"
                    type="text"
                    inputmode="numeric"
                    autocomplete="cc-exp"
                    placeholder="MM / YY"
                    aria-required="true"
                  />
                </div>
                <div class="col-6">
                  <label class="form-label" for="co-cc-csc">安全碼</label>
                  <input
                    id="co-cc-csc"
                    class="form-control num"
                    type="text"
                    inputmode="numeric"
                    autocomplete="cc-csc"
                    placeholder="123"
                    aria-describedby="co-cc-csc-help"
                    aria-required="true"
                  />
                  <p id="co-cc-csc-help" class="form-text mb-0">卡片背面末 3&nbsp;碼</p>
                </div>
              </div>
            </fieldset>
          </fieldset>

          <!-- 發票與備註 -->
          <fieldset class="co-fieldset">
            <legend class="co-legend"><h2 class="h4 mb-0">發票與備註</h2></legend>
            <div class="row g-4">
              <div class="col-12">
                <label class="form-label" for="co-invoice">電子發票</label>
                <select id="co-invoice" class="form-select" aria-describedby="co-invoice-help">
                  <option selected>會員載具（寄送至 Email）</option>
                  <option>手機條碼載具</option>
                  <option>自然人憑證載具</option>
                  <option>公司報帳（需填統一編號）</option>
                  <option>捐贈發票</option>
                </select>
                <p id="co-invoice-help" class="form-text mb-0">發票會在出貨後開立，若中獎將以 Email 通知。</p>
              </div>
              <div class="col-12">
                <label class="form-label" for="co-note">備註<span class="form-label-optional">選填</span></label>
                <textarea
                  id="co-note"
                  class="form-control"
                  rows="3"
                  placeholder="例如：平日 18:00 後方便收貨、社區需要先登記"
                ></textarea>
              </div>
            </div>
          </fieldset>

          <!-- 手機、平板：確認付款放在表單最後 -->
          <div class="pt-5 d-lg-none">
            <dl class="order-summary-rows mb-3">
              <div class="order-summary-row order-summary-total">
                <dt>應付總額</dt>
                <dd class="price">{{ formatPrice(cartTotal) }}</dd>
              </div>
            </dl>
            <button class="btn btn-primary w-100" type="submit">確認付款</button>
            <p class="text-note text-center mt-3 mb-0">確認付款前，你都可以返回修改。</p>
            <div class="text-center mt-2">
              <RouterLink class="btn btn-text" to="/cart">
                <i class="bi bi-chevron-left me-1" aria-hidden="true"></i>返回購物車
              </RouterLink>
            </div>
          </div>
        </form>
      </div>

      <!-- 桌機：訂單摘要在表單之後（鍵盤先填完表單再到確認付款），畫面上固定在右欄 -->
      <div class="col-lg-5 col-xl-4 d-none d-lg-block">
        <aside class="order-summary is-sticky" aria-labelledby="co-summary-title">
          <h2 id="co-summary-title" class="order-summary-title">訂單摘要</h2>

          <ul class="order-summary-items">
            <li v-for="item in cartItems" :key="item.product.id" class="order-summary-item">
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
            <div class="order-summary-row">
              <dt>商品小計</dt>
              <dd class="num">{{ formatPrice(cartSubtotal) }}</dd>
            </div>
            <div class="order-summary-row">
              <dt>運費</dt>
              <dd>{{ shippingText }}</dd>
            </div>
            <div class="order-summary-row order-summary-total">
              <dt>應付總額</dt>
              <dd class="price">{{ formatPrice(cartTotal) }}</dd>
            </div>
          </dl>

          <div>
            <button class="btn btn-primary w-100 mt-4" type="submit" form="checkoutForm">確認付款</button>
            <p class="text-note text-center mt-3 mb-0">確認付款前，你都可以返回修改。</p>
            <div class="text-center mt-2">
              <RouterLink class="btn btn-text" to="/cart">
                <i class="bi bi-chevron-left me-1" aria-hidden="true"></i>返回購物車
              </RouterLink>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
