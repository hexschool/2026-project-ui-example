<script setup>
import { orders, orderStatuses, statusClass, member, formatPrice, feeText } from '../data/products'

// 訂單（依下單日期新到舊）的小計、運費、付款方式、地址、狀態歷程都在 data/products.js

// 會員中心選單（lg 以上在左側；以下移到訂單清單之後）
const memberMenu = [
  { label: '我的訂單', icon: 'bi-receipt', to: '/orders', current: true },
  { label: '個人資料', icon: 'bi-person', to: '/orders' },
  { label: '收件地址', icon: 'bi-geo-alt', to: '/orders' },
]

// 大型家具配送進度：用語與訂單狀態一致（示意：目前在「出貨中」）
const deliverySteps = [
  { label: '已付款', date: '09/18', state: 'is-done', srText: '已完成' },
  { label: '備貨中', date: '09/19', state: 'is-done', srText: '已完成' },
  { label: '出貨中', date: '09/22', state: 'is-current', srText: '目前進度' },
  { label: '已完成', date: '預計 09/25', state: '', srText: '尚未完成' },
]
</script>

<!-- 我的訂單：版型見 scss/pages/_orders.scss -->
<template>
  <div class="container">
    <header class="page-header">
      <nav aria-label="目前位置">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><RouterLink to="/">首頁</RouterLink></li>
          <!-- 會員中心沒有獨立頁面，不做成連結 -->
          <li class="breadcrumb-item text-body-secondary">會員中心</li>
          <li class="breadcrumb-item active" aria-current="page">我的訂單</li>
        </ol>
      </nav>
      <h1>我的訂單</h1>
      <!-- 一句一段：空間夠時兩句並排，窄螢幕在句號處換行 -->
      <p class="page-lead text-phrase">
        <span class="d-inline-block">大型家具出貨後，可在這裡查看配送進度。</span><span class="d-inline-block">出車前一天，我們會先來電確認到府時段。</span>
      </p>
    </header>

    <div class="row gx-xl-6">
      <!-- 訂單（DOM 在前：手機先看到訂單，lg 以上移到右側 9 欄） -->
      <div class="col-lg-9">
        <ul class="nav nav-underline orders-filter" aria-label="依訂單狀態篩選">
          <li v-for="(status, i) in orderStatuses" :key="status" class="nav-item">
            <button
              class="nav-link"
              :class="{ active: i === 0 }"
              type="button"
              :aria-pressed="i === 0 ? 'true' : 'false'"
            >
              {{ status }}
            </button>
          </li>
        </ul>

        <ol class="list-unstyled orders-list">
          <li v-for="order in orders" :key="order.no" class="orders-row">
            <article :aria-labelledby="`order-${order.no}`">
              <header class="d-flex align-items-start justify-content-between gap-3 mb-4">
                <div>
                  <h2 :id="`order-${order.no}`" class="orders-no">
                    <span class="visually-hidden">訂單編號</span>
                    <span class="num">{{ order.no }}</span>
                  </h2>
                  <p class="text-note mb-0">
                    下單日期 <span class="num">{{ order.date }}</span>
                  </p>
                </div>
                <span class="badge-status" :class="statusClass[order.status]">{{ order.status }}</span>
              </header>

              <div class="orders-row-body">
                <ul class="list-unstyled orders-items">
                  <!-- 整列可點（stretched-link）：縮圖為裝飾，品名由連結提供 -->
                  <li v-for="item in order.items" :key="item.product.id" class="position-relative">
                    <div class="img-frame orders-thumb">
                      <img :src="item.product.image" alt="" width="64" height="64" loading="lazy" />
                    </div>
                    <div>
                      <RouterLink class="orders-item-name text-phrase stretched-link" :to="`/product/${item.product.id}`">
                        {{ item.product.name }}
                      </RouterLink>
                      <p class="text-note mb-0">
                        <span class="visually-hidden">數量</span>× <span class="num">{{ item.qty }}</span>
                      </p>
                    </div>
                  </li>
                </ul>
                <div class="orders-sum" :class="{ 'is-cancel': order.status === '已取消' }">
                  <p class="text-note">共 <span class="num">{{ order.count }}</span> 件</p>
                  <p>
                    <span class="visually-hidden">訂單金額</span>
                    <span class="price">{{ formatPrice(order.total) }}</span>
                  </p>
                </div>
              </div>

              <!-- 出貨中：大型家具配送進度 -->
              <div v-if="order.status === '出貨中'" class="mt-4">
                <h3 class="visually-hidden">配送進度</h3>
                <ol class="list-unstyled orders-track">
                  <li
                    v-for="step in deliverySteps"
                    :key="step.label"
                    :class="step.state"
                    :aria-current="step.state === 'is-current' ? 'step' : null"
                  >
                    {{ step.label }}<span class="visually-hidden">（{{ step.srText }}）</span>
                    <span class="orders-track-date num">{{ step.date }}</span>
                  </li>
                </ol>
                <p class="text-note mb-0">
                  <i class="bi bi-telephone me-2" aria-hidden="true"></i>司機將於 09/24 來電，確認到府時段。
                </p>
              </div>

              <footer class="orders-row-foot">
                <dl class="orders-meta">
                  <template v-if="order.status === '已取消'">
                    <div>
                      <dt>取消日期</dt>
                      <dd class="num">{{ order.cancelDate }}</dd>
                    </div>
                    <div>
                      <dt>款項</dt>
                      <dd>未扣款</dd>
                    </div>
                  </template>
                  <template v-else>
                    <div>
                      <dt>配送方式</dt>
                      <dd>{{ order.shipping }}</dd>
                    </div>
                    <div v-if="order.payDeadline" class="is-due">
                      <dt>付款期限</dt>
                      <dd class="num">{{ order.payDeadline }}</dd>
                    </div>
                    <div v-else>
                      <dt>{{ order.status === '已完成' ? '送達日期' : '預計到貨' }}</dt>
                      <dd class="num">{{ order.eta }}</dd>
                    </div>
                  </template>
                </dl>

                <div class="orders-actions">
                  <!-- 在原地展開明細（Bootstrap collapse）；待付款的訂單預設展開，直接看到繳費資訊 -->
                  <button
                    class="btn btn-text orders-toggle"
                    type="button"
                    data-bs-toggle="collapse"
                    :data-bs-target="`#detail-${order.no}`"
                    :aria-expanded="order.payDeadline ? 'true' : 'false'"
                    :aria-controls="`detail-${order.no}`"
                  >
                    訂單明細<span class="visually-hidden">（{{ order.no }}）</span>
                    <i class="bi bi-chevron-down" aria-hidden="true"></i>
                  </button>
                  <RouterLink v-if="order.status === '已完成'" class="btn btn-outline-primary btn-sm" to="/cart">
                    再買一次<span class="visually-hidden">（{{ order.no }}）</span>
                  </RouterLink>
                </div>
              </footer>

              <!-- 訂單明細 -->
              <div :id="`detail-${order.no}`" class="collapse" :class="{ show: order.payDeadline }">
                <div class="orders-detail">
                  <div class="row g-4 g-md-5">
                    <section class="col-md-7" :aria-labelledby="`items-${order.no}`">
                      <h3 :id="`items-${order.no}`" class="orders-detail-title">購買品項</h3>
                      <ul class="list-unstyled orders-detail-lines">
                        <li v-for="item in order.items" :key="item.product.id">
                          <span class="text-phrase">
                            {{ item.product.name }}
                            <span class="text-note text-nowrap">× <span class="num">{{ item.qty }}</span></span>
                          </span>
                          <span class="num">{{ formatPrice(item.subtotal) }}</span>
                        </li>
                      </ul>
                      <dl class="orders-detail-sum">
                        <div>
                          <dt>商品小計</dt>
                          <dd class="num">{{ formatPrice(order.subtotal) }}</dd>
                        </div>
                        <div>
                          <dt>運費</dt>
                          <dd>{{ feeText(order.shippingFee) }}</dd>
                        </div>
                        <div class="is-total">
                          <dt>{{ order.status === '待付款' ? '應付金額' : '訂單金額' }}</dt>
                          <dd class="price">{{ formatPrice(order.total) }}</dd>
                        </div>
                      </dl>
                    </section>

                    <div class="col-md-5 orders-detail-info">
                      <h3 class="orders-detail-title">收件資訊</h3>
                      <p>
                        {{ member.name }}<br />
                        <span class="num">{{ member.phone }}</span><br />
                        {{ order.address }}
                      </p>

                      <h3 class="orders-detail-title">付款方式</h3>
                      <p>{{ order.payment }}</p>
                      <template v-if="order.payDeadline">
                        <dl class="orders-atm">
                          <div>
                            <dt>轉入銀行代碼</dt>
                            <dd class="num">812</dd>
                          </div>
                          <div>
                            <dt>虛擬帳號</dt>
                            <dd class="num">9981 2345 6789 0123</dd>
                          </div>
                        </dl>
                        <p class="orders-due">
                          <i class="bi bi-clock" aria-hidden="true"></i>
                          <span>請於 <span class="num">{{ order.payDeadline }}</span> 前完成付款，逾期訂單會自動取消。</span>
                        </p>
                      </template>

                      <h3 class="orders-detail-title">狀態歷程</h3>
                      <ol class="list-unstyled orders-history">
                        <li v-for="[date, text] in order.history" :key="date">
                          <span class="num">{{ date }}</span>{{ text }}
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </li>
        </ol>

        <p class="text-note mt-4 mb-0">
          這裡會顯示近 12&nbsp;個月的訂單。需要更早的紀錄，請來信
          <a href="mailto:hello@nestcraft.example">hello@nestcraft.example</a>。
        </p>

        <!-- 設計稿狀態示意：篩選後沒有訂單（放在訂單列表之後，手機上也緊接著列表；規則同 Guideline 的「空狀態」） -->
        <section class="demo-state" aria-labelledby="orders-state-title">
          <p class="demo-state-tag">設計稿狀態示意</p>
          <h2 id="orders-state-title" class="demo-state-title">篩選後沒有訂單時</h2>
          <p class="text-note text-phrase">假設切換到「待付款」後沒有符合的訂單：篩選列保留，清單的位置改顯示以下區塊。</p>

          <ul class="nav nav-underline orders-filter" aria-label="依訂單狀態篩選（示意）">
            <li v-for="(status, i) in orderStatuses" :key="status" class="nav-item">
              <button class="nav-link" :class="{ active: i === 1 }" type="button" :aria-pressed="i === 1 ? 'true' : 'false'">
                {{ status }}
              </button>
            </li>
          </ul>
          <div class="empty-state">
            <p>目前沒有待付款的訂單。</p>
            <button class="btn btn-outline-secondary" type="button">查看全部訂單</button>
          </div>
        </section>
      </div>

      <!-- 會員中心：lg 以上移到左側並固定；以下排在訂單與狀態示意之後 -->
      <div class="col-lg-3 order-lg-first">
        <aside class="orders-aside">
          <h2 id="orders-member-title" class="visually-hidden">會員中心</h2>
          <div class="pb-3 border-bottom">
            <p class="mb-0">{{ member.name }}</p>
            <p class="text-note mb-0">{{ member.email }}</p>
          </div>
          <nav aria-label="會員中心">
            <div class="list-group list-group-flush orders-menu">
              <RouterLink
                v-for="item in memberMenu"
                :key="item.label"
                :to="item.to"
                class="list-group-item list-group-item-action"
                :class="{ active: item.current }"
                :aria-current="item.current ? 'page' : null"
              >
                <i class="bi" :class="item.icon" aria-hidden="true"></i>{{ item.label }}
              </RouterLink>
            </div>
          </nav>
          <!-- 登出是動作不是導覽：和選單分開 -->
          <RouterLink class="btn btn-text orders-logout mt-4 px-3" to="/login">
            <i class="bi bi-box-arrow-right" aria-hidden="true"></i>登出
          </RouterLink>
        </aside>
      </div>
    </div>
  </div>
</template>
