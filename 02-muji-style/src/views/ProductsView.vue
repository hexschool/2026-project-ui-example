<script setup>
import ProductCard from '../components/ProductCard.vue'
import { products, categoryList, widthFilters } from '../data/products'

// 篩選與排序選項（示意）；分類、寬度的件數在 data/products.js 算好
const priceRanges = ['不限', 'NT$ 3,000 以下', 'NT$ 3,000–10,000', 'NT$ 10,000–20,000', 'NT$ 20,000 以上']
const sortOptions = ['推薦排序', '價格由低到高', '價格由高到低', '最新上架']
</script>

<template>
  <div class="container">
    <header class="page-header">
      <nav aria-label="目前位置">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><RouterLink to="/">首頁</RouterLink></li>
          <li class="breadcrumb-item active" aria-current="page">商品一覽</li>
        </ol>
      </nav>
      <div class="d-flex flex-wrap align-items-baseline justify-content-between column-gap-4">
        <h1>商品一覽</h1>
        <RouterLink class="btn btn-text" :to="{ path: '/', hash: '#rooms' }" :aria-current="null">回到首頁看靈感</RouterLink>
      </div>
      <p class="page-lead text-phrase">從沙發、餐桌到收納，找到放得下、也帶得走的家具。</p>
      <p class="dim mt-3 mb-0">
        <span class="dim-line" aria-hidden="true"></span>
        <span>尺寸一律標示為 寬 W × 深 D × 高 H，單位 cm</span>
      </p>
    </header>

    <!-- 手機、平板：分類標籤列（可橫向捲動）。設計稿不實作篩選：分類連結都回到 /products，固定以第一項「全部」為目前選取 -->
    <nav class="products-tabs d-lg-none" aria-label="商品分類">
      <ul class="nav nav-underline">
        <li v-for="(category, i) in categoryList" :key="category.name" class="nav-item">
          <RouterLink
            class="nav-link"
            :class="{ active: i === 0 }"
            to="/products"
            active-class=""
            exact-active-class=""
            :aria-current="i === 0 ? 'page' : null"
          >
            {{ category.name }}<span class="tab-count num">{{ category.count }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div class="row">
      <!-- 篩選：lg 以上為側邊欄，以下收進 offcanvas -->
      <aside class="col-lg-3" aria-label="篩選商品">
        <div id="productsFilter" class="offcanvas-lg offcanvas-end products-filter" tabindex="-1" aria-labelledby="productsFilterTitle">
          <div class="offcanvas-header">
            <h2 id="productsFilterTitle" class="h5 mb-0">篩選條件</h2>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#productsFilter" aria-label="關閉篩選條件"></button>
          </div>

          <div class="offcanvas-body">
            <form id="productsFilterForm" class="w-100" @submit.prevent>
              <section class="products-filter-group d-none d-lg-block" aria-labelledby="productsCatTitle">
                <h2 id="productsCatTitle" class="products-filter-title">分類</h2>
                <ul class="list-unstyled mb-0">
                  <li v-for="(category, i) in categoryList" :key="category.name">
                    <RouterLink
                      class="products-cat"
                      :class="{ 'is-active': i === 0 }"
                      to="/products"
                      active-class=""
                      exact-active-class=""
                      :aria-current="i === 0 ? 'page' : null"
                    >
                      <span class="products-cat-name">{{ category.name }}</span>
                      <span class="num">{{ category.count }}</span>
                    </RouterLink>
                  </li>
                </ul>
              </section>

              <fieldset class="products-filter-group">
                <legend class="products-filter-title">依寬度篩選</legend>
                <p class="text-note mb-3">以家具最寬處計算，擺放時左右各留 5&nbsp;cm 會更從容。</p>
                <div v-for="range in widthFilters" :key="range.id" class="form-check">
                  <input :id="range.id" class="form-check-input" type="checkbox" name="width" />
                  <label class="form-check-label" :for="range.id">
                    <span>{{ range.label }}</span>
                    <span class="products-filter-count num">{{ range.count }}</span>
                  </label>
                </div>
              </fieldset>

              <fieldset class="products-filter-group">
                <legend class="products-filter-title">價格區間</legend>
                <div v-for="(range, i) in priceRanges" :key="range" class="form-check">
                  <input :id="`price-${i}`" class="form-check-input" type="radio" name="price" :checked="i === 0" />
                  <label class="form-check-label" :for="`price-${i}`">{{ range }}</label>
                </div>
              </fieldset>

              <fieldset class="products-filter-group">
                <legend class="products-filter-title">庫存</legend>
                <div class="form-check form-switch">
                  <input id="inStockOnly" class="form-check-input" type="checkbox" role="switch" />
                  <label class="form-check-label" for="inStockOnly">只顯示有現貨的商品</label>
                </div>
              </fieldset>

              <button class="btn btn-text d-none d-lg-inline-flex" type="reset">清除篩選條件</button>
            </form>
          </div>

          <div class="products-filter-foot d-lg-none">
            <button class="btn btn-outline-primary" type="reset" form="productsFilterForm">清除</button>
            <button class="btn btn-primary flex-fill" type="button" data-bs-dismiss="offcanvas" data-bs-target="#productsFilter">
              顯示 <span class="num">{{ products.length }}</span> 件商品
            </button>
          </div>
        </div>
      </aside>

      <!-- 商品清單 -->
      <div class="col-lg-9">
        <div class="products-toolbar">
          <p class="mb-0 d-none d-lg-block">共 <span class="num">{{ products.length }}</span> 件商品</p>
          <button
            class="btn btn-outline-primary d-lg-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#productsFilter"
            aria-controls="productsFilter"
          >
            <i class="bi bi-sliders2 me-2" aria-hidden="true"></i>篩選
          </button>
          <div class="products-sort">
            <label class="products-sort-label" for="productsSort">排序</label>
            <select id="productsSort" class="form-select">
              <option v-for="option in sortOptions" :key="option">{{ option }}</option>
            </select>
          </div>
        </div>
        <p class="text-note d-lg-none mb-4">共 <span class="num">{{ products.length }}</span> 件商品</p>

        <h2 class="visually-hidden">商品列表</h2>
        <div class="row row-cols-2 row-cols-md-3 gx-3 gx-md-4 gy-5">
          <div v-for="product in products" :key="product.id" class="col">
            <ProductCard :product="product" />
          </div>

          <!-- 清單尾端：提醒先量尺寸（md 以上剛好補滿最後一列） -->
          <div class="col-12 col-md-8">
            <div class="products-note">
              <div>
                <h3 class="h5 mb-3">先量尺寸，再挑家具</h3>
                <p class="mb-4">
                  量好牆面寬度與走道，再用「依寬度篩選」縮小範圍。每件商品都標示寬、深、高，下單前對照一次就好。
                </p>
                <RouterLink class="btn btn-text" :to="{ path: '/', hash: '#rooms' }">看看小坪數的空間搭配</RouterLink>
              </div>
              <div class="products-note-dim" aria-hidden="true">
                <span class="text-note">你的牆面寬度</span>
                <span class="dim-line"></span>
              </div>
            </div>
          </div>
        </div>

        <nav class="products-pager d-flex flex-wrap align-items-center justify-content-between gap-3 mt-6 pt-4 border-top" aria-label="商品分頁">
          <p class="text-note mb-0">已顯示全部 <span class="num">{{ products.length }}</span> 件商品</p>
          <ul class="pagination mb-0">
            <li class="page-item disabled">
              <span class="page-link" aria-label="上一頁"><i class="bi bi-chevron-left" aria-hidden="true"></i></span>
            </li>
            <li class="page-item active" aria-current="page">
              <span class="page-link num">1</span>
            </li>
            <li class="page-item disabled">
              <span class="page-link" aria-label="下一頁"><i class="bi bi-chevron-right" aria-hidden="true"></i></span>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>
