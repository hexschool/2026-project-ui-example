<script setup>
import { onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { featuredProducts, findProduct, formatPrice, rooms } from '../data/products'

// 手機的情境卡是橫向捲動列：用方向鍵切換時，把選到的卡捲進畫面
onMounted(() => {
  document
    .querySelector('.home-room-tabs')
    ?.addEventListener('shown.bs.tab', (e) => e.target.scrollIntoView({ block: 'nearest', inline: 'nearest' }))
})

// 文案取自 Notion；數字與單位之間用不換行空白（JS 字串寫 \u00a0、模板寫 &nbsp;），讓「3 步」「14 天」「48 小時」不被拆行

// 區塊二：四大堅持
const pillars = [
  { icon: 'bi-grid-1x2', title: '自由模組變化', text: '靈活擴充，搬家也能輕鬆帶著走，適應每個階段的你。' },
  { icon: 'bi-bookshelf', title: '小坪數神收納', text: '向上發展、極致利用畸零地，榨出空間最大潛力。' },
  { icon: 'bi-lamp', title: '沉浸式情境選物', text: '不知道怎麼搭？一鍵套用設計師的空間靈感。' },
  { icon: 'bi-lightning-charge', title: '無縫閃電結帳', text: '所見即所得，最快 3\u00a0步完成結帳，美好生活不需等待。' },
]

// 區塊五：室友見證（UGC，使用者原話逐字）與無憂承諾
// 引言最後「帶走」之間放不斷行字元（\u2060，畫面上看不到），避免最後一行只剩「走🥺」」
const reviews = [
  {
    image: 'images/ugc-1.jpg',
    alt: '買家實拍：窗邊的灰色布沙發旁，疊放著原木收納方塊，上面擺著書與綠色植物',
    quote: '終於找到小房間也能放得下的沙發！模組收納櫃超好裝，下次搬家也能帶\u2060走🥺',
    author: '@Taipei_Renter',
    product: findProduct('p-1007'),
  },
  {
    image: 'images/ugc-2.jpg',
    alt: '買家實拍：玄關牆上的原木洞洞板掛著托特包與鑰匙，牆邊窄縫放著白色推車',
    quote: '結帳流程真的超順，跟著情境圖買完全不踩雷，小資族救星！',
    author: '@Design_Daily',
    product: findProduct('p-1010'),
  },
]
const promises = [
  { icon: 'bi-puzzle', title: '免工具組裝', text: '90%\u00a0商品採卡扣與簡易設計，單人也能輕鬆完成。' },
  { icon: 'bi-arrow-repeat', title: '租屋友善退換', text: '14\u00a0天猶豫期，專人到府收件，試擺不將就。' },
  { icon: 'bi-truck', title: '現貨極速派送', text: '48\u00a0小時內出貨，週末馬上動手改造。' },
]

// 空間靈感：熱點尺寸（spot.sizeText）、整套件數與金額（room.setCount／setTotal）都在 data/products.js 算好
</script>

<template>
  <div>
    <!-- 區塊一：首屏視覺與品牌宣言（直書主標為全站唯一招牌元素） -->
    <section class="home-hero" aria-labelledby="home-hero-title">
      <div class="container">
        <div class="home-hero-grid">
          <h1 id="home-hero-title" class="home-hero-title text-vertical">
            <span class="d-block">把有限的坪數，</span>
            <span class="d-block">活出無限的講究。</span>
          </h1>

          <div class="home-hero-media img-frame">
            <img
              src="images/hero.jpg"
              alt="左側是原木床架與亞麻寢具，中央是淺灰雙人沙發與圓形茶几，右側牆邊是低矮的原木收納櫃"
              fetchpriority="high"
            />
          </div>
          <p class="home-hero-caption dim">
            <span class="dim-line" aria-hidden="true"></span>
            <span>5&nbsp;坪（約 16.5&nbsp;m²）的明亮小套房</span>
          </p>

          <div class="home-hero-body">
            <p class="home-hero-lead">
              <span class="d-inline-block">專為租屋族與小空間打造的靈活模組家具。</span><span class="d-inline-block">不需妥協，輕鬆拼湊你的理想生活。</span>
            </p>
            <!-- 同頁錨點：移除 RouterLink 自動加上的 aria-current -->
            <div class="home-hero-actions d-grid d-sm-flex gap-2 gap-sm-3">
              <RouterLink class="btn btn-primary" :to="{ hash: '#rooms' }" :aria-current="null">探索空間靈感</RouterLink>
              <RouterLink class="btn btn-outline-primary" :to="{ hash: '#featured' }" :aria-current="null">立即打造專屬角落</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 區塊二：品牌核心痛點解決 -->
    <section class="section section-alt" aria-labelledby="home-values-title">
      <div class="container">
        <div class="section-heading text-phrase">
          <h2 id="home-values-title">專為小日子設計的四大堅持</h2>
        </div>
        <ul class="home-values row row-cols-1 row-cols-sm-2 row-cols-lg-4 gx-4 gx-md-5 list-unstyled mb-0">
          <li v-for="item in pillars" :key="item.title" class="col">
            <div class="home-value d-flex flex-lg-column gap-3 gap-lg-4">
              <i class="home-value-icon bi" :class="item.icon" aria-hidden="true"></i>
              <div>
                <h3 class="h5 mb-2">{{ item.title }}</h3>
                <p class="mb-0 text-secondary">{{ item.text }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- 區塊三：沉浸式空間搭配 -->
    <section id="rooms" class="section home-rooms" aria-labelledby="home-rooms-title">
      <div class="container">
        <div class="section-heading text-phrase d-md-flex align-items-end justify-content-between gap-5">
          <div>
            <!-- 手機：分隔符「｜」改為換行，不吊在行尾 -->
            <h2 id="home-rooms-title">靈感提案<span class="d-none d-sm-inline">｜</span><br class="d-sm-none" />看見你未來的家</h2>
            <p>直接選取喜歡的風格整套打包，或是尋找屬於你的佈置靈感。</p>
          </div>
          <RouterLink class="btn btn-text flex-shrink-0 mt-3 mt-md-0" to="/products">瀏覽更多風格圖鑑</RouterLink>
        </div>

        <!-- 3 張情境卡就是分頁按鈕（Bootstrap tab）：選取後在下方顯示大圖熱點與商品清單 -->
        <ul class="home-room-tabs list-unstyled" role="tablist" aria-label="空間情境">
          <li v-for="(room, i) in rooms" :key="room.id" role="presentation">
            <button
              :id="`${room.id}-tab`"
              class="home-room-tab"
              :class="{ active: i === 0 }"
              type="button"
              role="tab"
              data-bs-toggle="tab"
              :data-bs-target="`#${room.id}-pane`"
              :aria-controls="`${room.id}-pane`"
              :aria-selected="i === 0 ? 'true' : 'false'"
            >
              <span class="home-room-thumb img-frame">
                <img :src="room.image" alt="" />
              </span>
              <span>
                <span class="home-room-label d-block">【{{ room.label }}】</span>
                <span class="home-room-name text-phrase d-block">{{ room.title }}</span>
              </span>
            </button>
          </li>
        </ul>

        <div class="tab-content">
          <div
            v-for="(room, i) in rooms"
            :id="`${room.id}-pane`"
            :key="room.id"
            class="tab-pane fade"
            :class="{ 'show active': i === 0 }"
            role="tabpanel"
            :aria-labelledby="`${room.id}-tab`"
            tabindex="0"
          >
            <h3 class="visually-hidden">【{{ room.label }}】{{ room.title }}</h3>
            <div class="row gx-4 gx-lg-5 gy-5 pt-4">
              <!-- 情境圖＋熱點（Bootstrap dropdown；小卡離螢幕邊緣至少 20px） -->
              <div class="col-lg-7 col-xl-8">
                <div class="home-room-stage">
                  <div class="home-room-frame img-frame">
                    <img :src="room.image" :alt="room.alt" />
                  </div>

                  <div
                    v-for="spot in room.hotspots"
                    :key="spot.product.id"
                    class="dropdown home-spot"
                    :style="{ left: `${spot.x}%`, top: `${spot.y}%` }"
                  >
                    <button
                      class="home-spot-btn"
                      type="button"
                      data-bs-toggle="dropdown"
                      data-bs-popper-config='{"modifiers":[{"name":"preventOverflow","options":{"padding":20}},{"name":"offset","options":{"offset":[0,6]}}]}'
                      aria-expanded="false"
                      :aria-label="`查看 ${spot.product.name}`"
                    >
                      <span class="home-spot-dot" aria-hidden="true"></span>
                    </button>
                    <div class="dropdown-menu home-spot-card">
                      <div class="d-flex gap-3">
                        <div class="home-thumb img-frame">
                          <img :src="spot.product.image" alt="" />
                        </div>
                        <div>
                          <p class="home-spot-name text-phrase mb-1">{{ spot.product.name }}</p>
                          <p class="price mb-0">{{ formatPrice(spot.product.price) }}</p>
                        </div>
                      </div>
                      <p class="dim mt-3 mb-3">
                        <span class="dim-line" aria-hidden="true"></span>
                        <span>{{ spot.sizeText }}</span>
                      </p>
                      <div class="d-flex align-items-center justify-content-between gap-3">
                        <button v-if="spot.product.stock === 0" class="btn btn-sm btn-outline-secondary" type="button" disabled>已售完</button>
                        <button v-else class="btn btn-sm btn-primary" type="button">加入購物車</button>
                        <RouterLink class="btn btn-sm btn-text" :to="`/product/${spot.product.id}`">查看商品</RouterLink>
                      </div>
                    </div>
                  </div>
                </div>
                <p class="text-note mt-3 mb-0">點選圖上的圓點，查看家具的尺寸與價格。</p>
              </div>

              <!-- 此情境的商品清單 -->
              <div class="col-lg-5 col-xl-4">
                <ul class="list-unstyled mb-0 border-top">
                  <li v-for="spot in room.hotspots" :key="spot.product.id" class="home-room-item position-relative d-flex gap-3 border-bottom">
                    <div class="home-thumb img-frame">
                      <img :src="spot.product.image" alt="" />
                    </div>
                    <div class="flex-grow-1">
                      <RouterLink class="home-room-link text-phrase stretched-link" :to="`/product/${spot.product.id}`">
                        {{ spot.product.name }}
                      </RouterLink>
                      <p class="dim mb-1">
                        <span class="dim-line" aria-hidden="true"></span>
                        <span>{{ spot.sizeText }}</span>
                      </p>
                      <p class="mb-0">
                        <span class="price">{{ formatPrice(spot.product.price) }}</span>
                        <span v-if="spot.product.stock === 0" class="text-note ms-2">已售完</span>
                      </p>
                    </div>
                  </li>
                </ul>
                <div class="d-flex justify-content-between align-items-baseline mt-4 mb-3">
                  <span class="text-secondary">整套 <span class="num">{{ room.setCount }}</span> 件</span>
                  <span class="price fs-5">{{ formatPrice(room.setTotal) }}</span>
                </div>
                <button class="btn btn-primary w-100" type="button">整套加入購物車</button>
                <p v-if="room.hasSoldOut" class="text-note mt-2 mb-0">售完的品項不會加入購物車。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 區塊四：熱銷靈活單品推薦（手機／平板橫向滑動、桌機四欄） -->
    <section id="featured" class="section section-alt home-featured-section" aria-labelledby="home-featured-title">
      <div class="container">
        <div class="section-heading text-phrase d-md-flex align-items-end justify-content-between gap-5">
          <div>
            <h2 id="home-featured-title">人氣嚴選<span class="d-none d-sm-inline">｜</span><br class="d-sm-none" />空間放大的秘密武器</h2>
            <p>最受租屋族歡迎的多功能家具，無痛升級生活品質。</p>
          </div>
          <RouterLink class="btn btn-text flex-shrink-0 mt-3 mt-md-0" to="/products">查看全部商品</RouterLink>
        </div>
        <ul class="home-featured list-unstyled mb-0">
          <li v-for="product in featuredProducts" :key="product.id">
            <ProductCard :product="product" quick />
          </li>
        </ul>
      </div>
    </section>

    <!-- 區塊五：租屋族真實好評與無憂承諾 -->
    <section class="section" aria-labelledby="home-proof-title">
      <div class="container">
        <div class="section-heading text-phrase">
          <h2 id="home-proof-title">NestCraft 室友見證 ＆&nbsp;無憂承諾</h2>
        </div>
        <div class="row gx-4 gx-xl-6 gy-6">
          <div class="col-lg-7">
            <div class="row gy-5 gx-4">
              <div v-for="review in reviews" :key="review.author" class="col-sm-6">
                <figure class="mb-0">
                  <div class="home-ugc-media img-frame">
                    <img :src="review.image" :alt="review.alt" loading="lazy" />
                  </div>
                  <blockquote class="home-ugc-quote">
                    <p class="mb-0">「{{ review.quote }}」</p>
                  </blockquote>
                  <figcaption class="text-note">
                    <span class="d-block num"><i class="bi bi-instagram me-2" aria-hidden="true"></i>{{ review.author }}</span>
                    <span class="d-block mt-1">
                      照片中的商品：<RouterLink class="home-ugc-product text-phrase" :to="`/product/${review.product.id}`">{{ review.product.name }}</RouterLink>
                    </span>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>

          <div class="col-lg-5">
            <ul class="list-unstyled mb-0 border-top">
              <li v-for="item in promises" :key="item.title" class="home-promise d-flex gap-3 border-bottom">
                <i class="home-value-icon bi" :class="item.icon" aria-hidden="true"></i>
                <div>
                  <h3 class="h5 mb-2">{{ item.title }}</h3>
                  <p class="mb-0 text-secondary">{{ item.text }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部 CTA：文字放在 cta.jpg 左半的留白牆面；md 以上照片直接接頁尾 -->
    <section class="home-cta" aria-labelledby="home-cta-title">
      <img class="home-cta-bg" src="images/cta.jpg" alt="" loading="lazy" />
      <div class="container home-cta-inner">
        <div class="row gx-4">
          <div class="col-md-6 col-lg-5">
            <h2 id="home-cta-title" class="home-cta-title">
              <span class="d-inline-block">準備好迎接</span><span class="d-inline-block">新的生活空間了嗎？</span>
            </h2>
            <p class="mb-4">全館滿 <span class="num">NT$&nbsp;3,000</span> 免運，14&nbsp;天內可退換。</p>
            <RouterLink class="btn btn-primary btn-lg" :to="{ hash: '#rooms' }" :aria-current="null">立即開始我的改造</RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
