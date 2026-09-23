<script setup>
import { formatPrice, formatSize } from '../data/products'

// quick：首頁「人氣嚴選」使用，按鈕改為「閃電結帳」
const props = defineProps({
  product: { type: Object, required: true },
  quick: { type: Boolean, default: false },
})

const soldOut = props.product.stock === 0
</script>

<template>
  <article class="product-card">
    <RouterLink class="product-card-media img-frame" :to="`/product/${product.id}`" tabindex="-1" aria-hidden="true">
      <img :src="product.image" :alt="product.name" loading="lazy" />
      <span v-if="soldOut" class="product-card-flag">已售完</span>
    </RouterLink>

    <div class="product-card-body">
      <p class="product-card-category">{{ product.category }}</p>
      <h3 class="product-card-title">
        <RouterLink :to="`/product/${product.id}`">{{ product.name }}</RouterLink>
      </h3>
      <p class="dim mb-0">
        <span class="dim-line" aria-hidden="true"></span>
        <span>{{ formatSize(product.size, product.sizeNote) }}</span>
      </p>

      <div class="product-card-foot">
        <span class="price">{{ formatPrice(product.price) }}</span>
        <button v-if="soldOut" class="btn btn-sm btn-outline-secondary" type="button" disabled>已售完</button>
        <RouterLink v-else-if="quick" class="btn btn-sm btn-primary" to="/checkout">
          <i class="bi bi-lightning-charge me-1" aria-hidden="true"></i>閃電結帳
        </RouterLink>
        <button v-else class="btn btn-sm btn-outline-primary" type="button">加入購物車</button>
      </div>
    </div>
  </article>
</template>
