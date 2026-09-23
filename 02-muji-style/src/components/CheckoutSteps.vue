<script setup>
// 結帳流程步驟：current = 1 購物車 / 2 填寫資料 / 3 完成訂單
// 在第 2 步時，已完成的「購物車」可以點回去修改（付款完成後就不再提供返回）
const props = defineProps({
  current: { type: Number, default: 1 },
})

const steps = [
  { label: '購物車', to: '/cart' },
  { label: '填寫資料與付款' },
  { label: '完成訂單' },
]

// 第 i 步能不能點回去：有連結、已完成，而且還沒付款
const canGoBack = (i) => Boolean(steps[i].to) && i + 1 < props.current && props.current < 3
</script>

<template>
  <nav class="checkout-steps" aria-label="結帳步驟">
    <ol class="list-unstyled mb-0">
      <li
        v-for="(step, i) in steps"
        :key="step.label"
        :class="{ 'is-done': i + 1 < current, 'is-current': i + 1 === current }"
        :aria-current="i + 1 === current ? 'step' : null"
      >
        <component
          :is="canGoBack(i) ? 'RouterLink' : 'span'"
          v-bind="canGoBack(i) ? { to: step.to } : {}"
          class="checkout-steps-item"
        >
          <span class="checkout-steps-dot num" aria-hidden="true">
            <i v-if="i + 1 < current" class="bi bi-check-lg"></i>
            <template v-else>{{ i + 1 }}</template>
          </span>
          <span class="checkout-steps-label">
            {{ step.label }}<span v-if="i + 1 < current" class="visually-hidden">（已完成）</span>
          </span>
        </component>
      </li>
    </ol>
  </nav>
</template>
