<script setup>
import { useRoute } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { findProduct, formatPrice, formatSize, mediaOf, sizeDrawingOf, relatedOf, LOW_STOCK } from '../data/products'

// 依網址的 id 取得商品（找不到時 findProduct 會回傳第一件）
const route = useRoute()
const product = findProduct(route.params.id)
const soldOut = product.stock === 0
const lowStock = product.stock > 0 && product.stock < LOW_STOCK

// 圖庫與情境圖、尺寸圖、相關商品：都在 data/products.js 算好
const { gallery, storyScene } = mediaOf(product)
const { sizeModes, dimScale } = sizeDrawingOf(product)
const related = relatedOf(product)

// 服務說明、評價：數字與單位之間用不換行空白（\u00a0），不會被拆成兩行
const services = [
  { icon: 'bi-box-seam', title: '免工具組裝', note: '卡榫與快拆五金，一個人就能完成' },
  { icon: 'bi-arrow-repeat', title: '14\u00a0天租屋友善退換', note: '收貨後 14\u00a0天內，不合適可申請退換' },
  { icon: 'bi-truck', title: '48\u00a0小時內出貨', note: '現貨商品付款後 48\u00a0小時內寄出' },
]

const assemblySteps = [
  '開箱後依配件清單核對零件，並在地上鋪一塊軟布保護表面。',
  '依說明書的標號對準卡榫，平均施力推入，聽到「喀」一聲即固定。',
  '擺放到定位後輕推確認平穩，再開始使用。',
]

const reviews = [
  { name: '林小姐', space: '7\u00a0坪套房', date: '2026-09-02', rating: 5, text: '下單前照著尺寸圖在地上貼了紙膠帶，確認走道還留得出來才買。實品和標示的尺寸一致，擺進去剛剛好。' },
  { name: '陳先生', space: '12\u00a0坪兩房', date: '2026-08-21', rating: 5, text: '配送前一天有電話確認時段，師傅把包材一起帶走。一個人組裝大約二十分鐘，說明書的圖很清楚。' },
  { name: '吳小姐', space: '5\u00a0坪雅房', date: '2026-08-09', rating: 4, text: '顏色比照片再暖一點，和房東留下的木地板很搭。紙箱偏大，搬上樓前記得先量樓梯轉角。' },
]
</script>

<template>
  <div class="container">
    <div class="page-header pd-head">
      <nav aria-label="目前位置">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><RouterLink to="/">首頁</RouterLink></li>
          <li class="breadcrumb-item"><RouterLink to="/products">商品一覽</RouterLink></li>
          <li class="breadcrumb-item"><RouterLink to="/products">{{ product.category }}</RouterLink></li>
          <li class="breadcrumb-item active" aria-current="page">{{ product.shortName ?? product.name }}</li>
        </ol>
      </nav>
    </div>

    <div class="row gx-lg-5 gy-5">
      <!-- 圖庫：Bootstrap carousel，縮圖即 indicators；只有一張圖時不顯示切換 -->
      <div class="col-md-6 col-lg-7">
        <div id="pdGallery" class="carousel slide pd-gallery" data-bs-interval="false">
          <div class="pd-gallery-main">
            <div class="carousel-inner">
              <div v-for="(img, i) in gallery" :key="img.src" class="carousel-item" :class="{ active: i === 0 }">
                <div class="img-frame pd-gallery-frame">
                  <img :src="img.src" :alt="img.alt" :style="{ objectPosition: img.position }" />
                </div>
              </div>
            </div>
            <template v-if="gallery.length > 1">
              <button class="carousel-control-prev pd-gallery-arrow" type="button" data-bs-target="#pdGallery" data-bs-slide="prev">
                <i class="bi bi-chevron-left" aria-hidden="true"></i>
                <span class="visually-hidden">上一張圖片</span>
              </button>
              <button class="carousel-control-next pd-gallery-arrow" type="button" data-bs-target="#pdGallery" data-bs-slide="next">
                <i class="bi bi-chevron-right" aria-hidden="true"></i>
                <span class="visually-hidden">下一張圖片</span>
              </button>
            </template>
          </div>
          <div v-if="gallery.length > 1" class="carousel-indicators pd-thumbs">
            <button
              v-for="(img, i) in gallery"
              :key="img.src"
              type="button"
              data-bs-target="#pdGallery"
              :data-bs-slide-to="i"
              :class="{ active: i === 0 }"
              :aria-current="i === 0 ? 'true' : null"
              :aria-label="`第 ${i + 1} 張：${img.alt}`"
            >
              <img :src="img.src" alt="" :style="{ objectPosition: img.position }" />
            </button>
          </div>
        </div>
      </div>

      <!-- 商品資訊 -->
      <div class="col-md-6 col-lg-5">
        <p class="pd-category">{{ product.category }}</p>
        <h1 class="h2 pd-title text-phrase">{{ product.name }}</h1>

        <p class="pd-price price">{{ formatPrice(product.price) }}</p>
        <p v-if="soldOut" class="pd-stock is-out">
          <i class="bi bi-dash-circle" aria-hidden="true"></i>已售完，預計 3–4&nbsp;週後補貨
        </p>
        <p v-else-if="lowStock" class="pd-stock is-low">
          <i class="bi bi-hourglass-split" aria-hidden="true"></i>剩 <span class="num">{{ product.stock }}</span> 件
        </p>
        <p v-else class="pd-stock is-in">
          <i class="bi bi-check2-circle" aria-hidden="true"></i>有庫存，付款後 48&nbsp;小時內出貨
        </p>

        <p class="pd-summary">{{ product.description }}</p>
        <!-- 同頁錨點：移除 RouterLink 自動加上的 aria-current -->
        <RouterLink class="btn btn-text pd-more" :to="{ hash: '#pd-tabs' }" :aria-current="null">閱讀完整介紹與規格</RouterLink>

        <!-- 購買：緊接在價格與摘要之後，桌機第一屏即可看到 -->
        <form class="pd-buy" @submit.prevent>
          <div class="d-flex align-items-center gap-3 mb-3">
            <label class="form-label mb-0" for="pdQty">數量</label>
            <!-- 數量為 1 時「−」停用 -->
            <div class="qty">
              <button class="btn" type="button" aria-label="減少數量" disabled>−</button>
              <input id="pdQty" value="1" inputmode="numeric" :disabled="soldOut" />
              <button class="btn" type="button" aria-label="增加數量" :disabled="soldOut">+</button>
            </div>
          </div>

          <div v-if="soldOut" class="row g-2">
            <div class="col-6">
              <button class="btn btn-outline-primary w-100 px-3" type="button" disabled>已售完</button>
            </div>
            <div class="col-6">
              <button
                class="btn btn-primary w-100 px-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#pdNotify"
                aria-expanded="false"
                aria-controls="pdNotify"
              >
                <i class="bi bi-bell me-2" aria-hidden="true"></i>貨到通知我
              </button>
            </div>
            <div id="pdNotify" class="collapse col-12">
              <div class="mt-3 p-4 bg-light">
                <label class="form-label" for="pdNotifyEmail">補貨時寄信通知到</label>
                <div class="d-flex gap-2">
                  <input id="pdNotifyEmail" class="form-control" type="email" placeholder="name@example.com" autocomplete="email" />
                  <button class="btn btn-outline-primary flex-shrink-0" type="button">登記通知</button>
                </div>
                <p class="text-note mt-2 mb-0">只用於這次補貨通知，寄出後即刪除。</p>
              </div>
            </div>
          </div>
          <div v-else class="row g-2">
            <div class="col-6">
              <button class="btn btn-outline-primary w-100" type="button">加入購物車</button>
            </div>
            <div class="col-6">
              <RouterLink class="btn btn-primary w-100" to="/checkout">直接購買</RouterLink>
            </div>
          </div>
        </form>

        <!-- 尺寸圖：正面＋側面線稿，依實際比例縮放；多種模式時共用同一比例尺 -->
        <figure class="pd-dim card card-body mb-5" :style="dimScale">
          <div class="pd-dim-sets">
            <div v-for="mode in sizeModes" :key="mode.label ?? 'size'">
              <p v-if="mode.label" class="pd-dim-mode">{{ mode.label }}</p>
              <div
                class="pd-dim-drawing"
                role="img"
                :aria-label="`${mode.label ?? ''}尺寸圖：寬 ${mode.w} 公分、深 ${mode.d} 公分、高 ${mode.h} 公分`"
                :style="{ '--w': mode.w, '--d': mode.d, '--h': mode.h }"
              >
                <div class="pd-dim-h">
                  <span class="num">H {{ mode.h }}</span>
                  <span class="pd-dim-vline"></span>
                </div>
                <div class="pd-dim-view">
                  <div class="pd-dim-box is-front"></div>
                  <span class="dim-line is-w"></span>
                  <span class="pd-dim-value num">W {{ mode.w }}</span>
                  <span class="pd-dim-name">正面</span>
                </div>
                <div class="pd-dim-view">
                  <div class="pd-dim-box is-side"></div>
                  <span class="dim-line is-d"></span>
                  <span class="pd-dim-value num">D {{ mode.d }}</span>
                  <span class="pd-dim-name">側面</span>
                </div>
              </div>
            </div>
          </div>
          <figcaption class="pd-dim-caption">
            <p class="pd-dim-title">下單前，先量量你的空間</p>
            <p v-for="mode in sizeModes" :key="mode.label ?? 'size'" class="pd-dim-size">{{ formatSize(mode, mode.label) }}</p>
            <p class="text-note mb-0">尺寸以最外緣計算，搬運前也請確認門框與樓梯轉角。</p>
          </figcaption>
        </figure>

        <ul class="pd-services list-unstyled">
          <li v-for="service in services" :key="service.title">
            <i class="bi" :class="service.icon" aria-hidden="true"></i>
            <div>
              <p class="mb-0">{{ service.title }}</p>
              <p class="text-note mb-0">{{ service.note }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- 分頁籤：商品詳情／規格／評價 -->
  <section id="pd-tabs" class="pt-6 pt-lg-7" aria-label="商品資訊">
    <div class="container">
      <ul class="nav nav-underline" role="tablist">
        <li class="nav-item" role="presentation">
          <button id="pd-tab-detail" class="nav-link active" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#pd-pane-detail" aria-controls="pd-pane-detail" aria-selected="true">
            商品詳情
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button id="pd-tab-spec" class="nav-link" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#pd-pane-spec" aria-controls="pd-pane-spec" aria-selected="false">
            規格
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button id="pd-tab-review" class="nav-link" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#pd-pane-review" aria-controls="pd-pane-review" aria-selected="false">
            評價<span class="tab-count num">{{ reviews.length }}</span>
          </button>
        </li>
      </ul>

      <div class="tab-content pt-5 pt-lg-6">
        <!-- 商品詳情 -->
        <div id="pd-pane-detail" class="tab-pane fade show active" role="tabpanel" aria-labelledby="pd-tab-detail" tabindex="0">
          <div class="row gy-6">
            <div class="col-lg-7">
              <h2 class="h4 mb-4">商品介紹</h2>
              <p class="pd-story">{{ product.description }}</p>
              <figure v-if="storyScene" class="m-0">
                <div class="img-frame pd-scene-frame">
                  <img :src="storyScene.src" :alt="storyScene.alt" loading="lazy" />
                </div>
                <figcaption class="text-note mt-2">{{ storyScene.caption }}</figcaption>
              </figure>
            </div>
            <div class="col-lg-4 offset-lg-1">
              <h2 class="h4 mb-2">組裝說明</h2>
              <p class="text-note mb-4">約 15–20&nbsp;分鐘，一個人即可完成，不需另備工具。</p>
              <ol class="pd-steps list-unstyled">
                <li v-for="(step, i) in assemblySteps" :key="step">
                  <span class="pd-steps-no num">{{ i + 1 }}</span>
                  <p class="mb-0">{{ step }}</p>
                </li>
              </ol>
              <p class="text-note mb-0">
                <i class="bi bi-file-earmark-text me-1" aria-hidden="true"></i>隨貨附組裝說明書與備用卡榫。
              </p>
            </div>
          </div>
        </div>

        <!-- 規格 -->
        <div id="pd-pane-spec" class="tab-pane fade" role="tabpanel" aria-labelledby="pd-tab-spec" tabindex="0">
          <div class="row">
            <div class="col-lg-8">
              <table class="table pd-spec mb-0">
                <caption class="visually-hidden">{{ product.name }}規格</caption>
                <tbody>
                  <tr><th scope="row">尺寸</th><td class="text-phrase">{{ product.sizeText }}</td></tr>
                  <tr><th scope="row">材質</th><td>{{ product.material }}</td></tr>
                  <tr><th scope="row">分類</th><td>{{ product.category }}</td></tr>
                  <tr><th scope="row">商品編號</th><td class="num">{{ product.id }}</td></tr>
                  <tr><th scope="row">組裝方式</th><td>免工具卡榫組裝，約 15–20&nbsp;分鐘</td></tr>
                  <tr><th scope="row">保固</th><td>一年，自收貨日起算</td></tr>
                  <tr><th scope="row">配送方式</th><td>宅配到府，可預約配送時段；大型家具含搬運上樓與包材回收</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 評價：星星只是裝飾，分數一律以數字呈現 -->
        <div id="pd-pane-review" class="tab-pane fade" role="tabpanel" aria-labelledby="pd-tab-review" tabindex="0">
          <div class="row gy-5">
            <div class="col-lg-4">
              <p class="pd-rating-score num mb-1">4.7<span class="pd-rating-max">／5</span></p>
              <p class="pd-stars mb-2" aria-hidden="true">
                <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-half"></i>
              </p>
              <p class="text-note mb-4">平均 4.7 分，共 <span class="num">{{ reviews.length }}</span> 則評價</p>
              <p class="pd-rating-fit mb-0">
                <i class="bi bi-rulers me-2" aria-hidden="true"></i><span class="num">{{ reviews.length }}</span> 位買家都表示「尺寸與標示相符」
              </p>
            </div>
            <div class="col-lg-7 offset-lg-1">
              <ul class="pd-reviews list-unstyled mb-4">
                <li v-for="review in reviews" :key="review.name">
                  <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
                    <div>
                      <p class="mb-0">{{ review.name }}</p>
                      <p class="text-note mb-0">居住空間：{{ review.space }}</p>
                    </div>
                    <p class="text-note num mb-0">{{ review.date }}</p>
                  </div>
                  <p class="pd-review-score">
                    <span class="pd-stars" aria-hidden="true">
                      <i v-for="n in 5" :key="n" class="bi" :class="n <= review.rating ? 'bi-star-fill' : 'bi-star'"></i>
                    </span>
                    <span class="num"><span class="visually-hidden">評分 </span>{{ review.rating.toFixed(1) }}／5</span>
                  </p>
                  <p class="mb-0">{{ review.text }}</p>
                </li>
              </ul>
              <p class="text-note mb-0">
                完成訂單後，可以在<RouterLink to="/orders">我的訂單</RouterLink>撰寫評價。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 你可能也會喜歡：分隔線留在版心內 -->
  <section class="container mt-6 mt-lg-7" aria-labelledby="pdRelatedTitle">
    <div class="pt-6 pt-lg-7 border-top">
      <div class="section-heading">
        <h2 id="pdRelatedTitle">你可能也會喜歡</h2>
        <p>同樣適合小坪數的家具與收納。</p>
      </div>
      <div class="row row-cols-2 row-cols-md-3 gx-3 gx-md-4 gy-5">
        <div v-for="(item, i) in related" :key="item.id" class="col" :class="{ 'd-md-none': i === 3 }">
          <ProductCard :product="item" />
        </div>
      </div>
    </div>
  </section>
</template>
