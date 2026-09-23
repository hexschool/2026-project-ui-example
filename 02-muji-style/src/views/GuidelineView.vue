<script setup>
import ProductCard from '../components/ProductCard.vue'
import CheckoutSteps from '../components/CheckoutSteps.vue'
import { products, cartItems, cartSubtotal, cartQty, cartTotal, shippingText, categories, orderStatuses, findProduct, formatPrice, formatSize, LOW_STOCK } from '../data/products'

// 設計 Guideline：數值對應 scss/_variables.scss 與 scss/_base.scss，改 token 時這裡的文字要一起改
const toc = [
  { id: 'gl-overview', label: '概覽' },
  { id: 'gl-color', label: '色彩' },
  { id: 'gl-type', label: '字級階層' },
  { id: 'gl-space', label: '間距' },
  { id: 'gl-shape', label: '圓角與陰影' },
  { id: 'gl-component', label: '元件狀態' },
  { id: 'gl-rwd', label: 'RWD 斷點' },
  { id: 'gl-dodont', label: 'Do／Don’t' },
]

// 色票：色塊由 _guideline.scss 的 $gl-swatches 產生，hex 與對比度寫在這裡，改色時兩邊要同步
// 對比度依 WCAG 2.x 相對亮度公式計算：對紙白 $paper #F6F3EE、對生成 $kinari #ECE6DC
const palette = [
  {
    name: '底色',
    note: '三種底色明度接近，只用細微的差異分出頁面、區塊與卡片。',
    colors: [
      { name: '紙白', token: '$paper', hex: '#F6F3EE', use: '頁面底色（$body-bg）' },
      { name: '生成', token: '$kinari', hex: '#ECE6DC', use: '區塊底 .section-alt、頁尾、停用的輸入框（$body-secondary-bg）' },
      { name: '暖白', token: '$white-warm', hex: '#FFFDF9', use: '卡片、輸入框、下拉選單；深色按鈕上的文字' },
    ],
  },
  {
    name: '線條',
    note: '所有分隔都是 1px。由淺到深：髮絲線用來分隔；亞麻灰用在裝飾線，以及本身有文字可辨識的外框；表單控制項要看得清邊界，才用鈍亞麻。',
    colors: [
      { name: '髮絲線', token: '$hairline', hex: '#E3DDD3', use: '預設邊框、分隔線、表格線' },
      { name: '亞麻灰', token: '$linen', hex: '#C9C2B6', use: '裝飾線：尺寸線、步驟連接線、麵包屑分隔符號；選項卡與次要按鈕的外框（有文字辨識，不需 3:1）；停用狀態' },
      { name: '鈍亞麻', token: '$linen-dark', hex: '#8E8679', use: '表單控制項邊框：輸入框、下拉選單、核取方塊、數量框', paper: '3.3:1', level: '非文字 3:1', ok: true },
    ],
  },
  {
    name: '原木',
    note: '原木是點綴色，只出現在小面積的裝飾線。原木對紙白只有 2.4:1，文字與鍵盤焦點一律改用深原木。',
    colors: [
      { name: '淺原木', token: '$oak-light', hex: '#E4D6C1', use: '選取狀態的底色、標記' },
      { name: '原木', token: '$oak', hex: '#B89A72', use: '裝飾線：導覽列目前頁的短線、引言線；.btn-oak 的底色', paper: '2.4:1', level: '不可作文字', ok: false },
      { name: '深原木', token: '$oak-deep', hex: '#7A6040', use: '點綴文字、連結 hover、鍵盤焦點外框、輸入框 focus 邊框', paper: '5.3:1', kinari: '4.7:1', level: 'AA', ok: true },
    ],
  },
  {
    name: '墨',
    note: '內文只用墨與深亞麻，不用純黑。點綴與提醒文字改用深原木、深芥子，狀態文字用各自的狀態色。',
    colors: [
      { name: '墨', token: '$sumi', hex: '#3E3A35', use: '主文字、主要按鈕（primary）', paper: '10.2:1', kinari: '9.1:1', level: 'AAA', ok: true },
      { name: '深墨', token: '$sumi-deep', hex: '#2F2C28', use: '強調文字、主要按鈕 hover／active、淺色按鈕上的文字', paper: '12.6:1', kinari: '11.2:1', level: 'AAA', ok: true },
      { name: '深亞麻', token: '$linen-deep', hex: '#6A635A', use: '次要文字、表單說明、輸入框 placeholder（secondary）', paper: '5.4:1', kinari: '4.8:1', level: 'AA', ok: true },
    ],
  },
  {
    name: '狀態',
    note: '取自日本傳統色並降低彩度，出錯時也不會讓畫面變得緊張。芥子太淺，只作底色；提醒文字用深芥子。',
    colors: [
      { name: '苔色', token: '$moss', hex: '#5C6B4C', use: '成功、驗證通過、已完成', paper: '5.2:1', kinari: '4.6:1', level: 'AA', ok: true },
      { name: '弁柄', token: '$bengara', hex: '#A4493D', use: '錯誤、刪除', paper: '5.3:1', kinari: '4.7:1', level: 'AA', ok: true },
      { name: '芥子', token: '$karashi', hex: '#C39A45', use: '提醒，只作底色或圖示：.alert-warning、待付款標籤的淡底', paper: '2.4:1', level: '不可作文字', ok: false },
      { name: '深芥子', token: '$karashi-deep', hex: '#7A5A1C', use: '提醒文字、待付款標籤', paper: '5.7:1', kinari: '5.1:1', level: 'AA', ok: true },
      { name: '藍鼠', token: '$ai-nezumi', hex: '#56697A', use: '資訊、已付款', paper: '5.1:1', kinari: '4.6:1', level: 'AA', ok: true },
    ],
  },
]

const themeColors = [
  { theme: 'primary', token: '$sumi', use: '主要按鈕、核取方塊已選、分頁目前頁' },
  { theme: 'secondary', token: '$linen-deep', use: '次要文字、低強調的外框按鈕' },
  { theme: 'success', token: '$moss', use: '驗證通過、付款完成' },
  { theme: 'info', token: '$ai-nezumi', use: '配送與流程說明' },
  { theme: 'warning', token: '$karashi', use: '提醒的底色；文字改用 $karashi-deep' },
  { theme: 'danger', token: '$bengara', use: '錯誤、刪除' },
  { theme: 'light', token: '$kinari', use: '淺底區塊 .bg-light' },
  { theme: 'dark', token: '$sumi-deep', use: '深色強調，少用' },
  { theme: 'oak', token: '$oak', use: '自訂：.btn-oak、.bg-oak；.text-oak 對比不足，不用於文字' },
]

const semanticTokens = [
  { token: '$body-bg', value: '$paper' },
  { token: '$body-color', value: '$sumi' },
  { token: '$body-secondary-color', value: '$linen-deep' },
  { token: '$body-secondary-bg', value: '$kinari' },
  { token: '$body-emphasis-color', value: '$sumi-deep' },
  { token: '$border-color', value: '$hairline' },
  { token: '$input-border-color', value: '$linen-dark' },
  { token: '$input-placeholder-color', value: '$linen-deep' },
  { token: '$input-focus-border-color', value: '$oak-deep' },
  { token: '$focus-ring-color', value: '$oak-deep' },
  { token: '$link-color', value: '$sumi' },
  { token: '$link-hover-color', value: '$oak-deep' },
  { token: '$code-color', value: '$oak-deep' },
  { token: '$color-contrast-light', value: '$white-warm' },
  { token: '$color-contrast-dark', value: '$sumi-deep' },
]

const typeScale = [
  { name: '.display-1', cls: 'display-1', size: '56px／3.5rem', weight: 300, lh: '1.4', ls: '.12em', sample: '把有限的坪數' },
  { name: '.display-2', cls: 'display-2', size: '48px／3rem', weight: 300, lh: '1.4', ls: '.12em', sample: '把有限的坪數' },
  { name: '.display-3', cls: 'display-3', size: '40px／2.5rem', weight: 300, lh: '1.4', ls: '.12em', sample: '把有限的坪數' },
  { name: '.display-4', cls: 'display-4', size: '36px／2.25rem', weight: 300, lh: '1.4', ls: '.12em', sample: '把有限的坪數' },
  { name: '.display-5', cls: 'display-5', size: '32px／2rem', weight: 300, lh: '1.4', ls: '.12em', sample: '把有限的坪數' },
  { name: '.display-6', cls: 'display-6', size: '28px／1.75rem', weight: 300, lh: '1.4', ls: '.12em', sample: '把有限的坪數' },
  { name: 'h1', cls: 'h1', size: '32px／2rem', weight: 400, lh: '1.5', ls: '.12em', sample: '把有限的坪數，活出無限的講究。', use: '頁面標題，每頁一個。商品詳情的 h1 是完整品名，改用 .h2 尺寸並加 .text-phrase（見下方「標題與品名的換行」）' },
  { name: 'h2', cls: 'h2', size: '26px／1.625rem', weight: 400, lh: '1.5', ls: '.12em', sample: '專為小日子設計的四大堅持', use: '區塊標題' },
  { name: 'h3', cls: 'h3', size: '22px／1.375rem', weight: 400, lh: '1.5', ls: '.12em', sample: '靈感提案｜看見你未來的家', use: '子區塊標題' },
  { name: 'h4', cls: 'h4', size: '18px／1.125rem', weight: 400, lh: '1.5', ls: '.12em', sample: '人氣嚴選｜空間放大的秘密武器', use: '摘要、卡片群組標題' },
  { name: 'h5', cls: 'h5', size: '16px／1rem', weight: 400, lh: '1.5', ls: '.12em', sample: '橡木餐桌', use: '清單項目標題' },
  { name: 'h6', cls: 'h6', size: '14px／.875rem', weight: 400, lh: '1.5', ls: '.12em', sample: '收件資訊', use: '表單群組、頁尾欄位標題' },
  { name: '.page-lead', cls: 'page-lead', size: '16px／1rem', weight: 400, lh: '1.85', ls: '.04em', sample: '從沙發、餐桌到收納，找到放得下、也帶得走的家具。', use: '頁首說明：深亞麻、最寬 36em。.section-heading 的說明同樣式' },
  { name: '內文', cls: '', size: '16px／1rem', weight: 400, lh: '1.85', ls: '.04em（0.64px）', sample: products[0].description, use: '商品介紹、段落' },
  { name: 'small', cls: 'small', size: '13px／.8125rem', weight: 400, lh: '1.85', ls: '0.64px', sample: '滿 NT$ 3,000 免運，大型家具出貨前會先來電約定時間。', use: '註記、表單說明、麵包屑' },
]

const spacers = [
  { key: 0, rem: '0', px: 0, use: '貼齊' },
  { key: 1, rem: '.25rem', px: 4, use: '圖示與文字' },
  { key: 2, rem: '.5rem', px: 8, use: '標題與一句說明' },
  { key: 3, rem: '1rem', px: 16, use: '表單欄位之間、段落' },
  { key: 4, rem: '1.5rem', px: 24, use: '卡片內距、欄位群組、手機的頁首上方' },
  { key: 5, rem: '3rem', px: 48, use: '區塊標題與內容、頁首與內容' },
  { key: 6, rem: '4rem', px: 64, use: '手機的區塊上下留白、頁尾上方' },
  { key: 7, rem: '6rem', px: 96, use: '桌機的區塊上下留白、頁尾上方' },
  { key: 8, rem: '8rem', px: 128, use: '首屏等特大留白' },
]

const radii = [
  { cls: 'rounded-1', token: '$border-radius-sm', value: '1px', use: '小尺寸輸入框 .form-control-sm' },
  { cls: 'rounded', token: '$border-radius', value: '2px', use: '預設：按鈕、輸入框、卡片、提示、標籤' },
  { cls: 'rounded-3', token: '$border-radius-lg', value: '4px', use: 'Modal、大尺寸輸入框' },
  { cls: 'rounded-pill', token: '$border-radius-pill', value: '50rem', use: '購物車數量徽章' },
]

const shadows = [
  { cls: 'border', name: '無陰影', token: '$enable-shadows: false', value: 'none', use: '卡片、區塊一律不加陰影，用髮絲線或底色分層' },
  { cls: 'shadow-sm', name: '.shadow-sm', token: '$box-shadow-sm', value: '0 1px 2px rgba($sumi, .06)', use: '保留給貼近底面的小元件，目前頁面沒有使用。情境圖的標記點是半透明暖白光暈（_home.scss），不是陰影' },
  { cls: 'shadow', name: '.shadow', token: '$box-shadow', value: '0 8px 24px rgba($sumi, .08)', use: '下拉選單（已預設）。情境圖熱點浮出的商品小卡就是下拉選單，不另外加' },
  { cls: 'shadow-lg', name: '.shadow-lg', token: '$box-shadow-lg', value: '0 16px 48px rgba($sumi, .10)', use: 'Modal（已預設）等最上層的浮層' },
]

const buttonVariants = [
  { cls: 'btn-primary', label: '前往結帳', use: '主要動作，用來推進流程。同一組動作（一個表單、一個面板、一張卡片）只放一個。' },
  { cls: 'btn-outline-primary', label: '加入購物車', use: '次要動作：與主要按鈕並列，或表單內的單一送出，例如購物車折扣碼的「套用」。' },
  { cls: 'btn-oak', label: '原木點綴', use: '保留的點綴樣式，目前頁面沒有使用。需要時一頁至多一處，不與主要按鈕並列。' },
  { cls: 'btn-outline-secondary', label: '查看明細', use: '低強調的工具動作：篩選、查看明細、頁面導覽。' },
  { cls: 'btn-text', label: '繼續購物', use: '文字連結型：繼續購物、返回購物車、移除。已內建 44px 觸控高度。' },
]

const buttonStates = [
  { key: 'default', label: '預設 default', cls: '' },
  { key: 'hover', label: '滑過 hover', cls: 'gl-is-hover' },
  { key: 'active', label: '按下 active', cls: 'active' },
  { key: 'focus', label: '鍵盤焦點 focus', cls: 'gl-is-focus' },
  { key: 'disabled', label: '停用 disabled', cls: '', disabled: true },
]

const breakpoints = [
  { name: 'xs', px: 0, infix: '無', min: '< 576px', container: '100%', note: '單欄為主；商品列表 2 欄；導覽收合為選單按鈕，會員入口移到選單內；橫向捲動列貼齊螢幕兩側。' },
  { name: 'sm', px: 576, infix: '-sm', min: '≥ 576px', container: '540px', note: '版型同 xs，容器改為置中；頁首右側出現會員圖示。' },
  { name: 'md', px: 768, infix: '-md', min: '≥ 768px', container: '720px', note: '商品列表 3 欄；購物車出現欄位標題列；公告列顯示完整訊息；頁尾改為 3 欄。' },
  { name: 'lg', px: 992, infix: '-lg', min: '≥ 992px', container: '960px', note: '導覽列展開並顯示搜尋框；篩選改為側欄；購物車與結帳摘要移到右側；我的訂單的會員選單移到左側；頁首上方 24 → 48px，區塊與頁尾上方 64 → 96px。' },
  { name: 'xl', px: 1200, infix: '-xl', min: '≥ 1200px', container: '1140px', note: '頁首顯示品牌副標；RFS 停止縮放，標題回到固定字級。' },
  { name: 'xxl', px: 1400, infix: '-xxl', min: '≥ 1400px', container: '1240px', note: '容器最大寬，更寬的螢幕只增加兩側留白；首頁直書主標放大到 42px。' },
]

const layouts = [
  { page: '頁首導覽', sm: '選單收合；右側為搜尋與購物車圖示（576px 以上加上會員），搜尋按放大鏡展開', md: '同手機', lg: '水平展開，顯示搜尋框' },
  { page: '商品列表', sm: '2 欄；分類是橫向捲動的分頁籤，其餘篩選收進 offcanvas，按「篩選」開啟', md: '3 欄；篩選仍為 offcanvas', lg: '左側篩選欄 ＋ 右側 3 欄' },
  { page: '購物車', sm: '應付總額與「前往結帳」先列在清單上方；品項為暖白卡片；訂單摘要接在清單與折扣碼之後', md: '品項改為髮絲線分隔的清單列，出現「商品／數量／小計」欄位標題列；摘要靠右 8 欄', lg: '清單 8 欄 ＋ 摘要 4 欄，摘要 sticky；清單上方的總額列隱藏' },
  { page: '結帳', sm: '訂單摘要收合在表單上方，按「查看訂單明細」展開；表單最後是應付總額與「確認付款」', md: '同手機；姓名與手機號碼並排，付款方式 2 欄', lg: '表單 7 欄 ＋ 摘要 5 欄，摘要 sticky，「確認付款」移到摘要內；1200px 以上 8 ＋ 4，與購物車相同' },
  {
    page: '我的訂單',
    sm: '篩選分頁籤橫向捲動、貼齊螢幕兩側；訂單一列一筆，以髮絲線分隔；會員選單接在訂單清單之後',
    md: '同手機；每筆訂單的品項與金額改為左右排',
    lg: '會員選單 3 欄 sticky ＋ 訂單 9 欄',
    note: '出貨中的訂單會顯示配送進度，節點用語與訂單狀態一致：已付款 → 備貨中 → 出貨中 → 已完成。',
  },
  { page: 'Guideline', sm: '目錄改為頁首下方的橫向捲動列，捲動時固定在頂端', md: '同手機', lg: '左側固定目錄 ＋ 右側內容' },
]

// 品名與尺寸示例（直接讀商品資料，和各頁輸出一致）
const namedProducts = ['p-1007', 'p-1009', 'p-1010'].map(findProduct)
const [nestBox, sofaBed, pegboard] = namedProducts
const wrapProducts = [nestBox, sofaBed]
const sizeSamples = [
  formatSize(products[0].size),
  ...['p-1007', 'p-1010'].map(findProduct).map((p) => formatSize(p.size, p.sizeNote)),
  ...sofaBed.sizeModes.map((m) => formatSize(m, m.label)),
]

const [tableProduct, soldOutProduct, nightstand, quickProduct] = [products[0], products[2], products[3], products[7]]
const stepLabels = ['購物車', '填寫資料與付款', '完成訂單']
</script>

<template>
  <div class="gl-page">
    <div class="container">
      <header class="page-header">
        <nav aria-label="目前位置">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><RouterLink to="/">首頁</RouterLink></li>
            <li class="breadcrumb-item active" aria-current="page">設計 Guideline</li>
          </ol>
        </nav>
        <h1>設計 Guideline</h1>
        <p class="page-lead">
          NestCraft 的色彩、字級、間距與元件規範。頁面上的數值對應 <code>_variables.scss</code> 與 <code>_base.scss</code>，改色或改間距時，兩邊要同步。
        </p>
        <dl class="gl-meta">
          <div>
            <dt>品牌</dt>
            <dd>NestCraft 原創生活家居選物</dd>
          </div>
          <div>
            <dt>技術</dt>
            <dd>Vite、Vue 3、Bootstrap 5.3</dd>
          </div>
          <div>
            <dt>更新</dt>
            <dd class="num">2026-09-23</dd>
          </div>
        </dl>
      </header>

      <div class="row gx-4 gx-xl-5">
        <!-- 桌機目錄：左側固定 -->
        <div class="col-lg-3 col-xl-2 d-none d-lg-block">
          <nav class="gl-toc" aria-label="Guideline 目錄">
            <p class="gl-toc-title">目錄</p>
            <ul class="list-unstyled mb-0">
              <li v-for="item in toc" :key="item.id">
                <RouterLink :to="{ hash: `#${item.id}` }" :aria-current="null">{{ item.label }}</RouterLink>
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-lg-9 offset-xl-1">
          <!-- 手機目錄：頁首下方的橫向捲動列，捲動時固定在頂端 -->
          <nav class="gl-toc-mobile d-lg-none" aria-label="Guideline 目錄">
            <ul class="nav nav-underline">
              <li v-for="item in toc" :key="item.id" class="nav-item">
                <RouterLink class="nav-link" :to="{ hash: `#${item.id}` }" :aria-current="null">{{ item.label }}</RouterLink>
              </li>
            </ul>
          </nav>

          <!-- ========== 概覽 ========== -->
          <section id="gl-overview" class="gl-section" aria-labelledby="gl-overview-title">
            <div class="section-heading">
              <h2 id="gl-overview-title">概覽</h2>
              <p>家具每天都會用到，網站也應該像好用的家具：安靜、耐看，需要的時候馬上找得到。</p>
            </div>

            <div class="row g-4 g-md-5">
              <div class="col-md-7">
                <dl class="gl-spec">
                  <div>
                    <dt>風格定位</dt>
                    <dd>日系無印風</dd>
                  </div>
                  <div>
                    <dt>色系搭配</dt>
                    <dd>淺色系 ＋ 暖大地（米白、淺原木、亞麻灰）</dd>
                  </div>
                  <div>
                    <dt>UI 視覺特點</dt>
                    <dd>
                      <blockquote class="gl-quote">極簡清爽的商品結帳清單，大面積留白，減少填寫付款資訊時的焦慮感。</blockquote>
                    </dd>
                  </div>
                  <div>
                    <dt>品牌</dt>
                    <dd>專為租屋族與小資家庭設計的模組化家居電商，主打「靈活收納、小坪數友善」。</dd>
                  </div>
                </dl>
                <p class="text-note mb-0">以上文字引用自課程規格文件。</p>
              </div>
              <div class="col-md-5">
                <figure class="mb-0">
                  <div class="img-frame gl-ratio-3x2">
                    <img src="images/room-b.jpg" alt="陽光照進的小套房：整面原木收納櫃、窗前的原木書桌與椅子，前景是鋪著亞麻寢具的床" width="1600" height="1066" />
                  </div>
                  <figcaption class="text-note mt-3">攝影調性：自然光、米白牆面、低彩度，家具保留原本的材質色。</figcaption>
                </figure>
              </div>
            </div>

            <div class="gl-block">
              <h3 class="h4 gl-block-title">設計原則</h3>
              <dl class="gl-spec gl-principles mb-0">
                <div>
                  <dt>留白即秩序</dt>
                  <dd>區塊之間留 64／96px，用距離分組，而不是加框線、色塊或陰影。</dd>
                </div>
                <div>
                  <dt>素材自然</dt>
                  <dd>顏色取自米白、原木與亞麻；照片使用自然光，不去背、不加漸層。</dd>
                </div>
                <div>
                  <dt>結帳不焦慮</dt>
                  <dd>表單單欄分組、由上而下填寫，只有相關的短欄位才兩兩並排；每個欄位都有標籤，錯誤訊息直接說明怎麼修正。</dd>
                </div>
                <div>
                  <dt>尺寸一目了然</dt>
                  <dd>列表、詳情、購物車都標出 W × D × H，用尺寸線 <code>.dim</code> 呈現，不讓人猜放不放得下。</dd>
                </div>
              </dl>
            </div>
          </section>

          <!-- ========== 色彩 ========== -->
          <section id="gl-color" class="gl-section" aria-labelledby="gl-color-title">
            <div class="section-heading">
              <h2 id="gl-color-title">色彩</h2>
              <p>米白為底、原木點綴、墨色寫字。大面積使用最淺的三種底色，深色只留給文字與主要按鈕。</p>
            </div>

            <figure class="gl-proportion">
              <div class="gl-proportion-bar" aria-hidden="true">
                <span class="gl-chip-paper"></span>
                <span class="gl-chip-kinari"></span>
                <span class="gl-chip-white-warm"></span>
                <span class="gl-chip-sumi"></span>
                <span class="gl-chip-oak"></span>
              </div>
              <figcaption class="text-note">
                建議用色比例：紙白 <span class="num">60%</span>、生成 <span class="num">15%</span>、暖白 <span class="num">10%</span>、墨
                <span class="num">10%</span>、原木 <span class="num">5%</span>
              </figcaption>
            </figure>

            <p class="gl-block-note">
              對比度依 WCAG 公式計算。文字需達 <span class="num">4.5:1</span>（AA），邊框、焦點等非文字元素需達 <span class="num">3:1</span>。色塊與下方的 hex 分別寫在
              <code>_guideline.scss</code> 與頁面資料中，改 <code>_variables.scss</code> 的色票時要一起更新。
            </p>

            <div v-for="group in palette" :key="group.name" class="gl-block">
              <h3 class="h4 gl-block-title">{{ group.name }}</h3>
              <p class="gl-block-note">{{ group.note }}</p>
              <div class="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3 g-md-4">
                <div v-for="c in group.colors" :key="c.token" class="col">
                  <div class="gl-swatch">
                    <div :class="['gl-chip', `gl-chip-${c.token.slice(1)}`]"></div>
                    <h4 class="gl-swatch-name">{{ c.name }}</h4>
                    <p class="gl-swatch-code">
                      <code>{{ c.token }}</code>
                      <span class="num">{{ c.hex }}</span>
                    </p>
                    <p class="gl-swatch-use">{{ c.use }}</p>
                    <p v-if="c.paper" class="gl-swatch-ratio">
                      <span>對紙白 <span class="num">{{ c.paper }}</span></span>
                      <span v-if="c.kinari">對生成 <span class="num">{{ c.kinari }}</span></span>
                      <span :class="c.ok ? 'is-pass' : 'is-fail'">{{ c.level }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="gl-block">
              <h3 class="h4 gl-block-title">Bootstrap theme color 對應</h3>
              <p class="gl-block-note">
                在 <code>$theme-colors</code> 中改寫，所以 <code>.btn-*</code>、<code>.text-*</code>、<code>.bg-*</code>、<code>.alert-*</code> 都會自動換成這組顏色。按鈕與標籤上的字色由 Bootstrap 依底色自動挑選，改成色票內的暖白與深墨。
              </p>
              <div class="table-responsive">
                <table class="table gl-table align-middle">
                  <thead>
                    <tr>
                      <th scope="col">Theme</th>
                      <th scope="col" class="d-none d-sm-table-cell">對應變數</th>
                      <th scope="col">用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="t in themeColors" :key="t.theme">
                      <th scope="row">
                        <span :class="['gl-dot', `gl-chip-${t.token.slice(1)}`]" aria-hidden="true"></span>
                        <code>{{ t.theme }}</code>
                        <code class="d-block d-sm-none gl-table-sub">{{ t.token }}</code>
                      </th>
                      <td class="d-none d-sm-table-cell"><code>{{ t.token }}</code></td>
                      <td>{{ t.use }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4 class="h6 gl-minor-title">語意變數</h4>
              <dl class="gl-token-list">
                <div v-for="s in semanticTokens" :key="s.token">
                  <dt><code>{{ s.token }}</code></dt>
                  <dd><code>{{ s.value }}</code></dd>
                </div>
              </dl>
            </div>
          </section>

          <!-- ========== 字級階層 ========== -->
          <section id="gl-type" class="gl-section" aria-labelledby="gl-type-title">
            <div class="section-heading">
              <h2 id="gl-type-title">字級階層</h2>
              <p>用留白拉開層級，而不是粗體或顏色。標題字重 400、字距 .12em，全站粗體上限 500。</p>
            </div>

            <div class="gl-block gl-block-first">
              <h3 class="h4 gl-block-title">字體家族</h3>
              <div class="row g-4 g-md-5">
                <div class="col-md-6">
                  <div class="gl-font">
                    <p class="gl-font-sample num">NestCraft 0123456789</p>
                    <p class="gl-font-weights">
                      <span class="fw-light">Light 300</span>
                      <span class="fw-normal">Regular 400</span>
                      <span class="fw-medium">Medium 500</span>
                    </p>
                    <p class="gl-font-name">Jost</p>
                    <p class="text-note mb-0">英數：價格、尺寸、訂單編號與品牌字。</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="gl-font">
                    <p class="gl-font-sample">靈活收納，小坪數友善</p>
                    <p class="gl-font-weights">
                      <span class="fw-light">細體 300</span>
                      <span class="fw-normal">常規 400</span>
                      <span class="fw-medium">中等 500</span>
                    </p>
                    <p class="gl-font-name">Noto Sans TC</p>
                    <p class="text-note mb-0">中文：Jost 沒有的字元會自動落到這套字體。</p>
                  </div>
                </div>
              </div>
              <p class="gl-stack">
                <code>$font-family-base</code>：<span class="num">"Jost", "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", system-ui, sans-serif</span>
              </p>
            </div>

            <div class="gl-block">
              <h3 class="h4 gl-block-title">字級表</h3>
              <p class="gl-block-note">
                表列為 1200px 以上的尺寸。20px 以上的字級（display、h1–h3）在 1200px 以下由 Bootstrap RFS 依視窗寬度自動縮小。small 繼承 body 算好的字距 0.64px，不會跟著字級變小。
              </p>
              <div class="gl-type-list">
                <div v-for="t in typeScale" :key="t.name" class="gl-type-row">
                  <div>
                    <p class="gl-type-name"><code>{{ t.name }}</code></p>
                    <ul class="gl-type-spec list-unstyled">
                      <li class="num">{{ t.size }}</li>
                      <li>字重 <span class="num">{{ t.weight }}</span></li>
                      <li>行高 <span class="num">{{ t.lh }}</span></li>
                      <li>字距 <span class="num">{{ t.ls }}</span></li>
                    </ul>
                    <p v-if="t.use" class="gl-type-use">{{ t.use }}</p>
                  </div>
                  <p :class="['gl-type-sample', t.cls]">{{ t.sample }}</p>
                </div>
              </div>
            </div>

            <div class="gl-block">
              <h3 class="h4 gl-block-title">數字</h3>
              <p class="gl-block-note">價格、尺寸、訂單編號加上 <code>.num</code> 或 <code>.price</code>，使用 Jost 的等寬數字，上下對齊更整齊。</p>
              <dl class="gl-spec gl-spec-demo mb-0">
                <div>
                  <dt><code>.price</code> 價格</dt>
                  <dd><span class="price fs-4">NT$ 16,800</span></dd>
                </div>
                <div>
                  <dt><code>.dim</code> 尺寸</dt>
                  <dd>
                    <span class="dim">
                      <span class="dim-line" aria-hidden="true"></span>
                      <span>{{ formatSize(tableProduct.size) }}</span>
                    </span>
                  </dd>
                </div>
                <div>
                  <dt><code>.num</code> 訂單編號</dt>
                  <dd class="num">NC-20260923-001</dd>
                </div>
                <div>
                  <dt>金額靠右對齊</dt>
                  <dd>
                    <dl class="gl-sum">
                      <div v-for="item in cartItems" :key="item.product.id">
                        <dt class="text-phrase">
                          {{ item.product.name }}<span v-if="item.qty > 1" class="text-nowrap"> × <span class="num">{{ item.qty }}</span></span>
                        </dt>
                        <dd class="num">{{ formatPrice(item.subtotal) }}</dd>
                      </div>
                      <div class="gl-sum-total">
                        <dt>小計</dt>
                        <dd class="num">{{ formatPrice(cartSubtotal) }}</dd>
                      </div>
                    </dl>
                  </dd>
                </div>
              </dl>
            </div>

            <div class="gl-block">
              <h3 class="h4 gl-block-title">標題與品名的換行</h3>
              <p class="gl-block-note">
                標題已設定 <code>text-wrap: balance</code>，多行時平均分配；p、li、dd、label 與 <code>.form-text</code> 用 <code>text-wrap: pretty</code>，避免最後一行只剩一個字。品名另外要求：不從詞中間拆開。
              </p>
              <div class="gl-wrap-compare">
                <figure class="gl-wrap-col">
                  <figcaption class="gl-state-label">預設：會從詞中間斷開</figcaption>
                  <div class="gl-wrap-demo">
                    <p v-for="p in wrapProducts" :key="p.id">{{ p.name }}</p>
                  </div>
                </figure>
                <figure class="gl-wrap-col">
                  <figcaption class="gl-state-label text-phrase"><code>.text-phrase</code>：只在空白與斷點換行</figcaption>
                  <div class="gl-wrap-demo">
                    <p v-for="p in wrapProducts" :key="p.id" class="text-phrase">{{ p.name }}</p>
                  </div>
                </figure>
              </div>
              <p class="text-note mt-3">虛線是欄寬邊界。示範欄寬 <span class="num">10rem</span>，約等於手機 2 欄商品卡的標題寬度。</p>
              <ul class="gl-rules mt-4">
                <li>商品詳情的 h1 是完整品名，寫成 <code>&lt;h1 class="h2 text-phrase"&gt;</code>：保留 h1 的文件結構，字級用 h2 的 <span class="num">26px</span>（1200px 以下由 RFS 縮小，390px 約 <span class="num">22px</span>），長品名不會佔掉半個首屏。</li>
                <li>
                  斷點寫在資料裡：<code>data/products.js</code> 的長品名與情境標題，在詞組之間插入零寬空白 <code>\u200b</code>，例如「自由拼裝<code>\u200b</code>收納方塊」「懸浮感<code>\u200b</code>洞洞板<code>\u200b</code>壁面收納組」。畫面上看不到，文案仍然逐字；不要改成一般空白。
                </li>
                <li>
                  加上 <code>.text-phrase</code>（<code>word-break: keep-all</code> ＋ <code>overflow-wrap: anywhere</code>）後，只在空白與這些斷點換行，「收納方塊」「(三入組)」這類詞組不會被拆開；單一詞組比欄寬還長時，才會強制斷行。
                </li>
                <li>商品卡標題 <code>.product-card-title</code> 與訂單摘要的品名已內建同樣的規則，不用再加類別。商品詳情 h1、情境圖小卡、區塊標題等其他地方的品名與短標題，要自己加 <code>.text-phrase</code>。</li>
                <li>不要用在長段落：中文只剩空白與標點可以換行，商品介紹這類段落的行尾會參差不齊，窄欄時還會留下大段空白。</li>
              </ul>
            </div>

            <div class="gl-block">
              <h3 class="h4 gl-block-title">直書主標</h3>
              <p class="gl-block-note">
                全站唯一的招牌元素，只用在首頁主標。直書本身是 <code>.text-vertical</code>（_base.scss），字級、錯位與對齊寫在 _home.scss
                的首屏主標；下方示範與首頁同一組數值，縮放視窗就能看到各斷點的字級。
              </p>
              <div class="row g-4 g-md-5">
                <div class="col-md-6">
                  <div class="gl-vertical-demo" aria-hidden="true">
                    <p class="gl-vertical-title text-vertical">
                      <span class="d-block">把有限的坪數，</span>
                      <span class="d-block">活出無限的講究。</span>
                    </p>
                    <div class="img-frame gl-vertical-media">
                      <img src="images/hero.jpg" alt="" loading="lazy" width="1600" height="1066" />
                    </div>
                  </div>
                  <p class="text-note mt-3 mb-0">手機版首屏的排法：主標在左、圖片在右。</p>
                </div>
                <div class="col-md-6">
                  <ul class="gl-rules">
                    <li><code>writing-mode: vertical-rl</code>，由右至左換行；字距 <span class="num">.24em</span>、行高 <span class="num">2</span>，比橫書更疏。</li>
                    <li>標籤用 h1，字重 <span class="num">400</span>；字級 <span class="num">28／32／36／42px</span>（xs／sm／md／xxl），直接寫 rem，不經 RFS 縮放。</li>
                    <li>兩行各包一個 <code>span.d-block</code> 並設 <code>nowrap</code>，斷句由文案決定，不讓瀏覽器自動換行。</li>
                    <li>第二行加 <code>padding-inline-start: 1em</code>，往下錯開一個字，形成階梯。</li>
                    <li>整組 <code>margin-left: -.5em</code> 靠左：直書每行的寬度是字級的 2 倍、字形置中，左緣會多出半個字寬，拉回後字與版心對齊。</li>
                    <li>手機：主標在左、圖片在右並貼齊螢幕右緣，說明與按鈕接在下方。992px 以上：主標與說明放左欄，圖片佔右欄並延伸到視窗右緣。</li>
                    <li>數字、英文與段落文字不直書。</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <!-- ========== 間距 ========== -->
          <section id="gl-space" class="gl-section" aria-labelledby="gl-space-title">
            <div class="section-heading">
              <h2 id="gl-space-title">間距</h2>
              <p>以 <span class="num">1rem = 16px</span> 為基準，並把 Bootstrap 的 spacer 擴充到 8 階。p、m、gap 工具類別都能使用 0–8。</p>
            </div>

            <div class="gl-space-list">
              <div v-for="s in spacers" :key="s.key" class="gl-space-row">
                <span class="gl-space-key num">{{ s.key }}</span>
                <span><span class="num">{{ s.px }}px</span> <span class="text-note num">{{ s.rem }}</span></span>
                <span class="gl-space-track" aria-hidden="true"><span :class="['gl-space-bar', `gl-space-bar-${s.key}`]"></span></span>
                <span class="gl-space-use">{{ s.use }}</span>
              </div>
            </div>

            <div class="gl-block">
              <h3 class="h4 gl-block-title">區塊節奏</h3>
              <div class="row g-4 g-md-5">
                <div class="col-md-6 order-md-last">
                  <figure class="gl-rhythm mb-0" aria-label="區塊節奏示意，比例 1:1">
                    <div class="gl-rhythm-box">上一個區塊</div>
                    <div class="gl-rhythm-gap gl-gap-6">
                      <span class="gl-vdim" aria-hidden="true"></span>
                      <span class="num">64px</span>
                    </div>
                    <div class="gl-rhythm-box is-heading">
                      <span>區塊標題 h2</span>
                      <span class="text-note">一句說明</span>
                    </div>
                    <div class="gl-rhythm-gap gl-gap-5">
                      <span class="gl-vdim" aria-hidden="true"></span>
                      <span class="num">48px</span>
                    </div>
                    <div class="gl-rhythm-cols">
                      <div class="gl-rhythm-box">內容</div>
                      <div class="gl-rhythm-box">內容</div>
                      <div class="gl-rhythm-box">內容</div>
                    </div>
                    <div class="gl-rhythm-gap gl-gap-6">
                      <span class="gl-vdim" aria-hidden="true"></span>
                      <span class="num">64px</span>
                    </div>
                    <div class="gl-rhythm-box">下一個區塊</div>
                    <figcaption class="text-note mt-3">手機尺寸 1:1 示意。992px 以上區塊上下改為 96px。</figcaption>
                  </figure>
                </div>
                <div class="col-md-6">
                  <dl class="gl-spec gl-spec-stack">
                    <div>
                      <dt><code>.section</code> 上下留白</dt>
                      <dd><span class="num">64px</span>（spacer 6），992px 以上 <span class="num">96px</span>（spacer 7）</dd>
                    </div>
                    <div>
                      <dt><code>.section-heading</code></dt>
                      <dd>標題與說明相距 <span class="num">8px</span>（spacer 2），與內容相距 <span class="num">48px</span>（spacer 5）</dd>
                    </div>
                    <div>
                      <dt>卡片內距</dt>
                      <dd><span class="num">24px</span>（<code>$card-spacer-x／y: 1.5rem</code>）</dd>
                    </div>
                    <div>
                      <dt>格線 gutter</dt>
                      <dd><span class="num">32px</span>（<code>$grid-gutter-width: 2rem</code>）；密集列表可用 <code>.gx-3</code>、<code>.gx-4</code> 收緊</dd>
                    </div>
                    <div>
                      <dt>容器左右內距</dt>
                      <dd>各 <span class="num">20px</span>（<code>$container-padding-x: 2.5rem</code>，左右各取一半）；需大於等於 gutter，<code>.row</code> 才不會溢出</dd>
                    </div>
                    <div>
                      <dt>容器最大寬</dt>
                      <dd><span class="num">1240px</span>（1400px 以上）</dd>
                    </div>
                    <div>
                      <dt>頁首高度</dt>
                      <dd><span class="num">82px</span>（<code>$site-header-height: 5.125rem</code>）：<code>$navbar-padding-y</code> 上下各 16px、44px 圖示按鈕與底線，不含上方公告列</dd>
                    </div>
                    <div>
                      <dt>sticky 位移</dt>
                      <dd>
                        <span class="num">106px</span>（<code>$sticky-top-offset</code>，頁首再加 24px）。側欄、目錄等 sticky 元素的 top，以及 html 的 <code>scroll-padding-top</code> 都用這個值；router.js 的錨點位移寫的是同一個數字，改 token 時要同步。
                      </dd>
                    </div>
                    <div>
                      <dt>頁尾上方</dt>
                      <dd><span class="num">64px</span>（spacer 6），992px 以上 <span class="num">96px</span>（spacer 7），與區塊留白一致</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div class="gl-block">
              <h3 class="h4 gl-block-title">頁首節奏</h3>
              <p class="gl-block-note">
                首頁以外的每一頁，頁首都用 <code>.page-header</code> 包住麵包屑（或結帳步驟）、h1 與一句說明，切換頁面時標題會停在同一個位置。各頁不要另外設定頁首間距。
              </p>
              <div class="row g-4 g-md-5">
                <div class="col-md-6 order-md-last">
                  <figure class="gl-rhythm mb-0" aria-label="頁首節奏示意，比例 1:1">
                    <div class="gl-rhythm-box">網站頁首</div>
                    <div class="gl-rhythm-gap gl-gap-4">
                      <span class="gl-vdim" aria-hidden="true"></span>
                      <span class="num">24px</span>
                    </div>
                    <div class="gl-rhythm-box is-slim">麵包屑或結帳步驟</div>
                    <div class="gl-rhythm-gap gl-gap-4">
                      <span class="gl-vdim" aria-hidden="true"></span>
                      <span class="num">24px</span>
                    </div>
                    <div class="gl-rhythm-box is-heading">
                      <span>頁面標題 h1</span>
                      <span class="text-note">.page-lead 一句說明（與 h1 相距 8px）</span>
                    </div>
                    <div class="gl-rhythm-gap gl-gap-5">
                      <span class="gl-vdim" aria-hidden="true"></span>
                      <span class="num">48px</span>
                    </div>
                    <div class="gl-rhythm-box">第一個內容區塊</div>
                    <figcaption class="text-note mt-3">手機尺寸 1:1 示意。992px 以上兩段 24px 都改為 48px。</figcaption>
                  </figure>
                </div>
                <div class="col-md-6">
                  <dl class="gl-spec gl-spec-stack">
                    <div>
                      <dt>頁首 → 麵包屑</dt>
                      <dd><span class="num">24px</span>，992px 以上 <span class="num">48px</span></dd>
                    </div>
                    <div>
                      <dt>麵包屑或步驟 → h1</dt>
                      <dd><span class="num">24px</span>，992px 以上 <span class="num">48px</span></dd>
                    </div>
                    <div>
                      <dt>h1 → 說明</dt>
                      <dd><span class="num">8px</span>；說明用 <code>.page-lead</code>，深亞麻、最寬 36em</dd>
                    </div>
                    <div>
                      <dt>說明 → 內容</dt>
                      <dd><span class="num">48px</span>，各斷點相同</dd>
                    </div>
                    <div>
                      <dt>麵包屑</dt>
                      <dd>
                        <code>aria-label="目前位置"</code>；第一項是「首頁」，最後一項是目前頁，加 <code>.active</code> 與 <code>aria-current="page"</code>，不做成連結。商品詳情的最後一項用 shortName。每一項都不斷行（<code>.breadcrumb-item</code> 已內建 <code>nowrap</code>），放不下時整項移到下一行。連結已內建 <span class="num">44px</span> 觸控高度。
                      </dd>
                    </div>
                    <div>
                      <dt>結帳流程</dt>
                      <dd>購物車、結帳、付款結果三頁以 CheckoutSteps 取代麵包屑，放在 h1 之前。</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </section>

          <!-- ========== 圓角與陰影 ========== -->
          <section id="gl-shape" class="gl-section" aria-labelledby="gl-shape-title">
            <div class="section-heading">
              <h2 id="gl-shape-title">圓角與陰影</h2>
              <p>近乎直角，幾乎不用陰影。形狀越安靜，木紋與布料的質感越明顯。</p>
            </div>

            <div class="gl-block gl-block-first">
              <h3 class="h4 gl-block-title">圓角</h3>
              <div class="row row-cols-2 row-cols-md-4 g-3 g-md-4">
                <div v-for="r in radii" :key="r.cls" class="col">
                  <div :class="['gl-radius-sample', r.cls]"></div>
                  <p class="gl-sample-name"><code>.{{ r.cls }}</code> <span class="num">{{ r.value }}</span></p>
                  <p class="gl-sample-token"><code>{{ r.token }}</code></p>
                  <p class="gl-sample-use">{{ r.use }}</p>
                </div>
              </div>
              <p class="gl-block-note mt-4 mb-0">
                <code>$border-radius-xl</code>（6px）與 <code>$border-radius-xxl</code>（8px）保留在變數中，本風格不使用。圓形 50% 只用於步驟與狀態的圓點。
              </p>
            </div>

            <div class="gl-block">
              <h3 class="h4 gl-block-title">陰影</h3>
              <p class="gl-block-note">
                <code>$enable-shadows: false</code>，Bootstrap 元件不會自動產生陰影。下拉選單與 Modal 已在 _base.scss 預設加上
                <code>$box-shadow</code>、<code>$box-shadow-lg</code>；其他需要浮起的元素，才手動加上陰影工具類別。
              </p>
              <div class="row row-cols-2 row-cols-xl-4 g-3 g-md-4">
                <div v-for="s in shadows" :key="s.name" class="col">
                  <div :class="['gl-shadow-sample', s.cls]">
                    <span>{{ s.name }}</span>
                  </div>
                  <p class="gl-sample-token"><code>{{ s.token }}</code></p>
                  <p class="gl-sample-name num">{{ s.value }}</p>
                  <p class="gl-sample-use">{{ s.use }}</p>
                </div>
              </div>
            </div>

            <div class="gl-block">
              <h3 class="h4 gl-block-title">邊框</h3>
              <div class="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3 g-md-4">
                <div class="col">
                  <div class="gl-border-sample border"></div>
                  <p class="gl-sample-name">髮絲線 <code>$hairline</code></p>
                  <p class="gl-sample-use">預設。卡片、表格、分隔線 <code>.rule</code>、分頁籤底線。</p>
                </div>
                <div class="col">
                  <div class="gl-border-sample gl-border-linen"></div>
                  <p class="gl-sample-name">亞麻灰 <code>$linen</code></p>
                  <p class="gl-sample-use">裝飾線：尺寸線、步驟之間的連接線、麵包屑分隔符號。也用在本身有文字的外框：結帳選項卡、頁尾頁面導覽與社群登入等次要按鈕，外框不需 3:1。</p>
                </div>
                <div class="col">
                  <div class="gl-border-sample gl-border-linen-dark"></div>
                  <p class="gl-sample-name">鈍亞麻 <code>$linen-dark</code></p>
                  <p class="gl-sample-use">表單控制項：輸入框、下拉選單、核取方塊、數量框、未完成步驟的圓點。對紙白 3.3:1。</p>
                </div>
                <div class="col">
                  <div class="gl-border-sample gl-border-dashed"></div>
                  <p class="gl-sample-name">虛線 <code>dashed</code></p>
                  <p class="gl-sample-use">表示「不再有效或不可選」：已取消的訂單標籤、停用的配送選項卡。另用在「設計稿狀態示意」<code>.demo-state</code> 的分隔線與 <code>.demo-state-stage</code> 的示範框，標出不是正式畫面。</p>
                </div>
              </div>
            </div>
          </section>

          <!-- ========== 元件狀態 ========== -->
          <section id="gl-component" class="gl-section" aria-labelledby="gl-component-title">
            <div class="section-heading">
              <h2 id="gl-component-title">元件狀態規範</h2>
              <p>
                滑過與鍵盤焦點用 <code>.gl-is-hover</code>、<code>.gl-is-focus</code> 強制呈現，讀取的是 Bootstrap 按鈕的 hover 與 focus 變數（<code class="gl-code-var">--bs-btn-hover-*</code>、<code class="gl-code-var">--bs-btn-focus-box-shadow</code>），與真實互動一致。
              </p>
            </div>

            <!-- 按鈕 -->
            <div class="gl-block gl-block-first">
              <h3 class="h4 gl-block-title">按鈕</h3>
              <div class="gl-rows">
                <div v-for="v in buttonVariants" :key="v.cls">
                  <div class="gl-variant-head">
                    <h4 class="gl-variant-name"><code>.{{ v.cls }}</code></h4>
                    <p class="gl-variant-use">{{ v.use }}</p>
                  </div>
                  <div class="row row-cols-2 row-cols-md-3 row-cols-xl-5 g-3">
                    <div v-for="s in buttonStates" :key="s.key" class="col">
                      <div class="gl-state">
                        <button
                          type="button"
                          :class="['btn', v.cls, s.cls]"
                          :disabled="s.disabled"
                          :tabindex="s.cls ? -1 : null"
                        >
                          {{ v.label }}
                        </button>
                        <p class="gl-state-label">{{ s.label }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h4 class="h6 gl-minor-title">尺寸</h4>
              <div class="gl-sizes">
                <div>
                  <button type="button" class="btn btn-primary btn-sm">加入購物車</button>
                  <p class="gl-state-label"><code>.btn-sm</code> 高 <span class="num">44px</span></p>
                </div>
                <div>
                  <button type="button" class="btn btn-primary">加入購物車</button>
                  <p class="gl-state-label">預設 高 <span class="num">54px</span></p>
                </div>
                <div>
                  <button type="button" class="btn btn-primary btn-lg">加入購物車</button>
                  <p class="gl-state-label"><code>.btn-lg</code> 高 <span class="num">64px</span></p>
                </div>
                <div>
                  <button type="button" class="btn btn-outline-primary">
                    <i class="bi bi-bag me-2" aria-hidden="true"></i>加入購物車
                  </button>
                  <p class="gl-state-label">圖示在文字左側，間距 <span class="num">4–8px</span></p>
                </div>
                <div>
                  <button type="button" class="btn btn-text">繼續購物</button>
                  <p class="gl-state-label"><code>.btn-text</code> 高 <span class="num">44px</span>（內建）</p>
                </div>
              </div>
              <ul class="gl-rules">
                <li>三種尺寸都達到 <span class="num">44px</span> 觸控目標。<code>.btn-sm</code> 用在卡片、列表等密集區域，與相鄰按鈕保持 <span class="num">8px</span> 以上間距。</li>
                <li>
                  <code>.btn-text</code> 已內建 <code>inline-flex</code> 與 <code>min-height: 44px</code>，文字垂直置中，看起來仍是一行文字連結。使用時直接寫 <code>class="btn btn-text"</code>，不要再加 <code>py-*</code>、<code>min-height</code> 或自訂 padding。
                </li>
              </ul>

              <h4 class="h6 gl-minor-title">鍵盤焦點</h4>
              <ul class="gl-rules">
                <li>只在鍵盤操作時出現（<code>:focus-visible</code>），滑鼠點擊不留外框。一律是實色深原木 <code>$oak-deep</code>（對紙白 <span class="num">5.3:1</span>），不用半透明光暈。</li>
                <li>全站預設：<span class="num">2px</span> 深原木外框，與元素相距 <span class="num">2px</span>。Bootstrap 的 <code>$focus-ring-color</code> 也設為 <code>$oak-deep</code>，頁首導覽連結、搜尋框、漢堡選單按鈕都是同一個顏色。</li>
                <li>按鈕：先留 <span class="num">2px</span> 紙白間隙，再畫 <span class="num">2px</span> 深原木外圈，五種按鈕一致，見上方「鍵盤焦點 focus」一欄。</li>
                <li>輸入框、下拉選單：<span class="num">1px</span> 邊框換成深原木，外加 <span class="num">1px</span> 深原木（<code>$input-focus-box-shadow</code>），合成 <span class="num">2px</span> 實線框，見下方「表單」的「焦點 focus」。</li>
                <li>核取方塊、單選：和按鈕相同的雙環，<span class="num">2px</span> 紙白間隙加 <span class="num">2px</span> 深原木外圈（<code>$form-check-input-focus-box-shadow</code>）。</li>
                <li>分頁籤與數量框的輸入欄：焦點畫在內側，不會被橫向捲動的容器裁掉。</li>
                <li>不被頁首擋住：html 設 <code>scroll-padding-top: $sticky-top-offset</code>，Tab 到被捲到頂端的元素時，會停在 sticky 頁首下方。</li>
                <li>同頁錨點（本頁目錄、商品詳情的「閱讀完整介紹與規格」）：捲動後焦點也移到目標區塊，下一次 Tab 從那裡繼續。程式移入焦點的目標（<code>[tabindex="-1"]</code>）不畫外框。</li>
                <li>原木 <code>$oak</code> 對紙白只有 <span class="num">2.4:1</span>，不到非文字的 <span class="num">3:1</span>，不用來畫焦點。</li>
              </ul>

              <h4 class="h6 gl-minor-title">觸控目標</h4>
              <ul class="gl-rules">
                <li>可以點的東西至少 <span class="num text-nowrap">44 × 44px</span>，看起來小的元件用 <code>min-height</code>、<code>min-width</code> 或內距補足，不放大字級。</li>
                <li>已內建：三種按鈕尺寸、<code>.btn-text</code>、數量框的加減鍵、麵包屑連結、<code>.nav-underline</code> 分頁（最小寬 <span class="num">44px</span>）、CheckoutSteps 每一步（手機只剩圓點時也是 <span class="num">44 × 44px</span>）、頁首圖示按鈕、頁尾連結。</li>
                <li>頁尾還沒設計的頁面寫成不帶 <code>href</code> 的 <code>&lt;a&gt;</code>：不能點、不能 Tab 到，也不會被 hash 路由帶回首頁。</li>
              </ul>
            </div>

            <!-- 表單 -->
            <div class="gl-block">
              <h3 class="h4 gl-block-title">表單</h3>
              <p class="gl-block-note">
                每個欄位都有看得見的標籤。說明與錯誤訊息用 <code>aria-describedby</code> 連到欄位。邊框用鈍亞麻 <code>$input-border-color</code>；placeholder 用深亞麻 <code>$input-placeholder-color</code>（對暖白 <span class="num">5.8:1</span>），只寫範例格式，不取代標籤。
              </p>
              <ul class="gl-rules mb-4">
                <li>
                  選填：標籤文字後面加 <code>span.form-label-optional</code>，內容只寫「選填」，不加括號。與標籤相距 <span class="num">8px</span>，<span class="num">13px</span> 深亞麻。全站的選填欄位（購物車的折扣碼、結帳的備註）都用這個類別，不要各頁自己寫樣式。
                </li>
                <li>必填不另外加星號；表單開頭用一句話說明，例如結帳頁的「除了標示『選填』的欄位，其他都需要填寫」。</li>
              </ul>
              <div class="row row-cols-1 row-cols-md-2 g-4">
                <div class="col">
                  <div class="gl-field">
                    <p class="gl-state-label">預設 default</p>
                    <label class="form-label" for="gl-f-name">收件人姓名</label>
                    <input id="gl-f-name" class="form-control" type="text" placeholder="例如：王小明" autocomplete="off" />
                  </div>
                </div>
                <div class="col">
                  <div class="gl-field">
                    <p class="gl-state-label">焦點 focus</p>
                    <label class="form-label" for="gl-f-phone">手機號碼</label>
                    <input id="gl-f-phone" class="form-control gl-is-focus num" type="tel" value="0912 345 678" aria-describedby="gl-f-phone-help" autocomplete="off" />
                    <p id="gl-f-phone-help" class="form-text mb-0">出貨前會用這支電話和你約配送時間。</p>
                  </div>
                </div>
                <div class="col">
                  <div class="gl-field">
                    <p class="gl-state-label">通過 is-valid</p>
                    <label class="form-label" for="gl-f-email">電子郵件</label>
                    <input id="gl-f-email" class="form-control is-valid" type="email" value="xiaoming@example.com" aria-describedby="gl-f-email-ok" autocomplete="off" />
                    <p id="gl-f-email-ok" class="valid-feedback mb-0">格式正確，訂單確認信會寄到這裡。</p>
                  </div>
                </div>
                <div class="col">
                  <div class="gl-field">
                    <p class="gl-state-label">錯誤 is-invalid</p>
                    <label class="form-label" for="gl-f-mobile">手機號碼</label>
                    <input id="gl-f-mobile" class="form-control is-invalid num" type="tel" value="0912-345" aria-invalid="true" aria-describedby="gl-f-mobile-err" autocomplete="off" />
                    <p id="gl-f-mobile-err" class="invalid-feedback mb-0">手機號碼需要 10 碼數字，例如 0912 345 678。</p>
                  </div>
                </div>
                <div class="col">
                  <div class="gl-field">
                    <p class="gl-state-label">停用 disabled</p>
                    <label class="form-label" for="gl-f-country">國家／地區</label>
                    <input id="gl-f-country" class="form-control" type="text" value="台灣" disabled aria-describedby="gl-f-country-help" />
                    <p id="gl-f-country-help" class="form-text mb-0">目前只配送台灣本島。</p>
                  </div>
                </div>
                <div class="col">
                  <div class="gl-field">
                    <p class="gl-state-label">下拉選單 select</p>
                    <label class="form-label" for="gl-f-ship">配送方式</label>
                    <select id="gl-f-ship" class="form-select">
                      <option>宅配到府（大型家具）</option>
                      <option>宅配到府</option>
                      <option>超商取貨</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="gl-field">
                    <p class="gl-state-label">多行文字 textarea ＋ 選填標示 ＋ 說明 form-text</p>
                    <label class="form-label" for="gl-f-note">備註<span class="form-label-optional">選填</span></label>
                    <textarea id="gl-f-note" class="form-control" rows="3" placeholder="例如：平日晚上 7 點後方便收貨" aria-describedby="gl-f-note-help"></textarea>
                    <p id="gl-f-note-help" class="form-text mb-0">需要搬運大型家具時，可以在這裡註明樓層與有無電梯。</p>
                  </div>
                </div>
                <div class="col">
                  <fieldset class="gl-field">
                    <legend class="gl-state-label">核取方塊 checkbox</legend>
                    <div class="form-check">
                      <input id="gl-c-1" class="form-check-input" type="checkbox" />
                      <label class="form-check-label" for="gl-c-1">訂閱補貨與新品通知</label>
                    </div>
                    <div class="form-check">
                      <input id="gl-c-2" class="form-check-input" type="checkbox" checked />
                      <label class="form-check-label" for="gl-c-2">我已閱讀並同意服務條款</label>
                    </div>
                    <div class="form-check">
                      <input id="gl-c-3" class="form-check-input" type="checkbox" disabled />
                      <label class="form-check-label" for="gl-c-3">儲存為常用地址（登入後可使用）</label>
                    </div>
                  </fieldset>
                </div>
                <div class="col">
                  <fieldset class="gl-field">
                    <legend class="gl-state-label">單選 radio</legend>
                    <div class="form-check">
                      <input id="gl-r-1" class="form-check-input" type="radio" name="gl-pay" checked />
                      <label class="form-check-label" for="gl-r-1">信用卡</label>
                    </div>
                    <div class="form-check">
                      <input id="gl-r-2" class="form-check-input" type="radio" name="gl-pay" />
                      <label class="form-check-label" for="gl-r-2">ATM 轉帳</label>
                    </div>
                    <div class="form-check">
                      <input id="gl-r-3" class="form-check-input" type="radio" name="gl-pay" disabled aria-describedby="gl-r-3-help" />
                      <label class="form-check-label" for="gl-r-3">貨到付款</label>
                      <p id="gl-r-3-help" class="form-text mt-0 mb-0">大型家具不提供貨到付款。</p>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>

            <!-- 品名與尺寸 -->
            <div class="gl-block">
              <h3 class="h4 gl-block-title">品名與尺寸</h3>
              <p class="gl-block-note">品名與尺寸都讀商品資料輸出，畫面上不另外改寫；品名逐字沿用課程文件。</p>
              <div class="row g-4 g-md-5">
                <div class="col-md-6">
                  <h4 class="h6 gl-minor-title mt-0">品名</h4>
                  <ul class="gl-rules mb-4">
                    <li>完整品名 <code>name</code>：商品卡、商品詳情 h1、購物車品項、訂單摘要、情境圖熱點小卡、我的訂單。</li>
                    <li>簡短品名 <code>shortName</code>：只用在商品詳情的麵包屑；沒有 shortName 的商品用 name。訂單摘要這類窄欄也用完整品名，靠換行規則處理。</li>
                    <li>長品名在資料裡用零寬空白 <code>\u200b</code> 標出斷點，搭配 <code>.text-phrase</code> 只在空白與斷點換行，見「字級階層」的「標題與品名的換行」。</li>
                  </ul>
                  <table class="table gl-table">
                    <thead>
                      <tr>
                        <th scope="col">name</th>
                        <th scope="col">shortName</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="p in namedProducts" :key="p.id">
                        <td class="text-phrase">{{ p.name }}</td>
                        <td class="text-phrase">{{ p.shortName }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="col-md-6">
                  <h4 class="h6 gl-minor-title mt-0">尺寸</h4>
                  <ul class="list-unstyled d-grid gap-2 mb-4">
                    <li v-for="s in sizeSamples" :key="s" class="dim">
                      <span class="dim-line" aria-hidden="true"></span>
                      <span>{{ s }}</span>
                    </li>
                  </ul>
                  <ul class="gl-rules">
                    <li>全站一律用 <code>formatSize(size, note)</code> 輸出：商品卡、商品詳情的尺寸圖、購物車品項、情境圖熱點小卡。不手組字串。</li>
                    <li>乘號用「×」並前後各空一格，單位 cm 放在最後。這些空格是不換行空白 <code>\u00a0</code>，只有限定詞後面可以換行（「沙發模式」／「<span class="text-nowrap">W150 × D85 × H80 cm</span>」），行尾不會吊著一個「×」。</li>
                    <li>價格與尺寸對應的數量不同時，把限定詞 <code>sizeNote</code> 放在最前面，例如「單入」「單片底板」。</li>
                    <li>有兩種使用狀態的商品用 <code>sizeModes</code> 逐行列出，每行以模式名稱開頭；商品卡只顯示第一種。</li>
                    <li>唯一例外：商品詳情「規格」分頁的「尺寸」列，直接顯示課程文件（Notion）的 <code>sizeText</code> 原文，限定詞的位置與括號都照原文。</li>
                  </ul>
                  <dl class="gl-spec gl-spec-sm mt-4 mb-0">
                    <div>
                      <dt><code>formatSize</code> 全站</dt>
                      <dd class="num">{{ formatSize(pegboard.size, pegboard.sizeNote) }}</dd>
                    </div>
                    <div>
                      <dt><code>sizeText</code> 規格表</dt>
                      <dd class="num">{{ pegboard.sizeText }}</dd>
                    </div>
                  </dl>
                  <p class="text-note mt-2 mb-0">同一件商品：{{ pegboard.name }}</p>
                </div>
              </div>
            </div>

            <!-- 數量、狀態、庫存 -->
            <div class="gl-block">
              <h3 class="h4 gl-block-title">數量、訂單狀態與庫存</h3>
              <div class="row row-cols-1 row-cols-md-2 g-4 gy-5">
                <div class="col">
                  <h4 class="h6 gl-minor-title mt-0">數量增減</h4>
                  <p class="gl-block-note">
                    <code>.qty</code>：外框與輸入框相同的鈍亞麻，加減鍵各 <span class="num text-nowrap">44 × 44px</span>。
                  </p>
                  <div class="d-flex flex-wrap gap-4">
                    <div>
                      <div class="qty">
                        <button class="btn" type="button" aria-label="減少數量">−</button>
                        <input value="2" inputmode="numeric" aria-label="數量" />
                        <button class="btn" type="button" aria-label="增加數量">+</button>
                      </div>
                      <p class="gl-state-label">一般</p>
                    </div>
                    <div>
                      <div class="qty">
                        <button class="btn" type="button" aria-label="減少數量" disabled>−</button>
                        <input value="1" inputmode="numeric" aria-label="數量" disabled />
                        <button class="btn" type="button" aria-label="增加數量" disabled>+</button>
                      </div>
                      <p class="gl-state-label">已售完：整組停用，外框改為髮絲線</p>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <h4 class="h6 gl-minor-title mt-0">訂單狀態</h4>
                  <p class="gl-block-note">
                    <code>.badge-status</code>：文字與圓點用狀態色，底色只留淡淡一層；待付款的文字用深芥子 <code>$karashi-deep</code>。
                  </p>
                  <ul class="gl-status list-unstyled mb-0">
                    <li><span class="badge-status is-pending">待付款</span><span>訂單已成立，尚未收到款項；同時寫出付款期限</span></li>
                    <li><span class="badge-status is-paid">已付款</span><span>已收到款項，正在備貨</span></li>
                    <li><span class="badge-status is-shipping">出貨中</span><span>已交給物流，大型家具會先來電</span></li>
                    <li><span class="badge-status is-done">已完成</span><span>已送達並簽收</span></li>
                    <li><span class="badge-status is-cancel">已取消</span><span>訂單已取消，不會扣款；同時寫出取消日期</span></li>
                  </ul>
                  <p class="gl-block-note mt-4 mb-0">
                    配送進度沿用同一組用語：已付款 → 備貨中 → 出貨中 → 已完成。「備貨中」只是進度節點，不是訂單狀態，也不出現在篩選分頁籤。
                  </p>
                </div>
                <div class="col">
                  <h4 class="h6 gl-minor-title mt-0">庫存標示</h4>
                  <p class="gl-block-note">
                    門檻是 <code>data/products.js</code> 的 <code>LOW_STOCK = {{ LOW_STOCK }}</code>，商品詳情與本頁共用，不在各頁另寫數字。
                  </p>
                  <ul class="gl-stock list-unstyled mb-0">
                    <li>
                      <i class="bi bi-check2 text-success" aria-hidden="true"></i>
                      <span>現貨，48 小時內出貨</span>
                      <span class="text-note">庫存 <span class="num">{{ LOW_STOCK }}</span> 件以上</span>
                    </li>
                    <li>
                      <i class="bi bi-hourglass-split gl-text-oak-deep" aria-hidden="true"></i>
                      <span class="gl-text-oak-deep">剩 <span class="num">4</span> 件</span>
                      <span class="text-note"><span class="num">1–{{ LOW_STOCK - 1 }}</span> 件：顯示實際數量</span>
                    </li>
                    <li>
                      <i class="bi bi-dash-circle text-secondary" aria-hidden="true"></i>
                      <span class="text-secondary">已售完</span>
                      <span class="text-note">0 件：商品圖標示「已售完」，數量框停用</span>
                    </li>
                  </ul>
                </div>
                <div class="col">
                  <h4 class="h6 gl-minor-title mt-0">售完時的按鈕</h4>
                  <p class="gl-block-note">
                    商品卡：唯一的按鈕停用並改寫「已售完」。商品詳情：「加入購物車」停用並改寫「已售完」，主要按鈕換成「貨到通知我」，展開 Email 欄位登記補貨通知，讓使用者還有下一步。
                  </p>
                  <div class="d-flex flex-wrap gap-2">
                    <button class="btn btn-outline-primary" type="button" disabled>已售完</button>
                    <button class="btn btn-primary" type="button">
                      <i class="bi bi-bell me-2" aria-hidden="true"></i>貨到通知我
                    </button>
                  </div>
                  <p class="gl-state-label">商品詳情：售完時的兩顆按鈕</p>
                </div>
              </div>
            </div>

            <!-- 導覽 -->
            <div class="gl-block">
              <h3 class="h4 gl-block-title">導覽</h3>
              <div>
                <p class="gl-state-label gl-state-label-top"><code>.nav-underline</code> 商品詳情分頁、訂單篩選</p>
                <div class="nav nav-underline bleed-x" role="group" aria-label="分頁籤示意">
                  <button class="nav-link active" type="button" aria-pressed="true">商品詳情</button>
                  <button class="nav-link" type="button" aria-pressed="false">規格</button>
                  <button class="nav-link" type="button" aria-pressed="false">評價<span class="tab-count num">3</span></button>
                </div>
                <ul class="gl-rules mt-4">
                  <li>會切換下方內容的分頁（商品詳情）用 <code>role="tablist"</code>、<code>role="tab"</code> 加 <code>aria-selected</code>，並以 <code>aria-controls</code> 連到面板；只切換篩選條件的（訂單狀態、商品分類）用 button 加 <code>aria-pressed</code>，如上方示範。選中的按鈕不用 <code>aria-current</code>。</li>
                  <li>高度 <span class="num">44px</span> 以上；只有兩個字的分頁（「規格」「評價」）也保有 <span class="num">44px</span> 最小寬度。放不下時橫向捲動，手機加 <code>.bleed-x</code> 貼齊螢幕兩側。</li>
                  <li>數量接在文字後面，用 <code>span.tab-count</code>（例如評價則數、各分類的商品數），不加括號。</li>
                </ul>
              </div>
              <div class="row row-cols-1 row-cols-md-2 g-4 g-md-5 mt-0">
                <div class="col">
                  <p class="gl-state-label gl-state-label-top"><code>.breadcrumb</code> 分隔符號「/」，目前頁不是連結；單項不斷行</p>
                  <nav aria-label="麵包屑示意">
                    <ol class="breadcrumb mb-0">
                      <li class="breadcrumb-item"><RouterLink to="/">首頁</RouterLink></li>
                      <li class="breadcrumb-item"><RouterLink to="/products">商品一覽</RouterLink></li>
                      <li class="breadcrumb-item active">NestBox 自由拼裝收納方塊</li>
                    </ol>
                  </nav>
                </div>
                <div class="col">
                  <p class="gl-state-label gl-state-label-top"><code>.pagination</code> 目前頁為墨色實心</p>
                  <nav aria-label="分頁示意">
                    <ul class="pagination mb-0">
                      <li class="page-item disabled">
                        <span class="page-link" aria-label="上一頁"><i class="bi bi-chevron-left" aria-hidden="true"></i></span>
                      </li>
                      <li class="page-item active"><span class="page-link num">1</span></li>
                      <li class="page-item"><button class="page-link num" type="button">2</button></li>
                      <li class="page-item"><button class="page-link num" type="button">3</button></li>
                      <li class="page-item">
                        <button class="page-link" type="button" aria-label="下一頁"><i class="bi bi-chevron-right" aria-hidden="true"></i></button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>

            <!-- 提示 -->
            <div class="gl-block">
              <h3 class="h4 gl-block-title">提示訊息</h3>
              <p class="gl-block-note">先說結果，再說下一步。不用驚嘆號，不責怪使用者，也不用錯誤代碼。</p>
              <div class="row row-cols-1 row-cols-md-2 g-3 g-md-4">
                <div class="col">
                  <div class="alert alert-success gl-alert mb-0">
                    <i class="bi bi-check-circle" aria-hidden="true"></i>
                    <div>
                      <p class="gl-alert-title">付款完成</p>
                      <p class="mb-0">訂單 <span class="num">NC-20260923-001</span> 已成立，確認信已寄到你的信箱。</p>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="alert alert-info gl-alert mb-0">
                    <i class="bi bi-info-circle" aria-hidden="true"></i>
                    <div>
                      <p class="gl-alert-title">大型家具採預約配送</p>
                      <p class="mb-0">出貨前客服會先來電，和你確認送達時間與搬運動線。</p>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="alert alert-warning gl-alert mb-0">
                    <i class="bi bi-exclamation-circle" aria-hidden="true"></i>
                    <div>
                      <p class="gl-alert-title">有一件商品已售完</p>
                      <p class="mb-0">「藤編收納櫃」已從這次結帳移除，其他商品不受影響。</p>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="alert alert-danger gl-alert mb-0">
                    <i class="bi bi-x-circle" aria-hidden="true"></i>
                    <div>
                      <p class="gl-alert-title">付款沒有完成</p>
                      <p class="mb-0">這筆交易沒有扣款。請確認卡號與有效期限，再試一次。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 空狀態 -->
            <div class="gl-block">
              <h3 class="h4 gl-block-title">空狀態</h3>
              <p class="gl-block-note">
                列表沒有內容時，用一句話說明現況，再給一個能繼續下去的動作。不道歉、不放插圖或表情符號，也不留下空白的表格標題列。樣式用共用的 <code>.empty-state</code>，各頁不要另外寫。
              </p>
              <div class="row row-cols-1 row-cols-md-2 g-4 g-md-5">
                <div class="col">
                  <p class="gl-state-label gl-state-label-top">整頁沒有內容：購物車是空的</p>
                  <div class="empty-state">
                    <p>購物車裡還沒有商品。</p>
                    <RouterLink class="btn btn-primary" to="/products">瀏覽商品一覽</RouterLink>
                  </div>
                </div>
                <div class="col">
                  <p class="gl-state-label gl-state-label-top">篩選後沒有結果：我的訂單</p>
                  <ul class="nav nav-underline" aria-label="依訂單狀態篩選（示意）">
                    <li v-for="(status, i) in orderStatuses.slice(0, 4)" :key="status" class="nav-item">
                      <button class="nav-link" :class="{ active: i === 1 }" type="button" :aria-pressed="i === 1 ? 'true' : 'false'">{{ status }}</button>
                    </li>
                  </ul>
                  <div class="empty-state">
                    <p>目前沒有待付款的訂單。</p>
                    <button class="btn btn-outline-secondary" type="button">查看全部訂單</button>
                  </div>
                </div>
              </div>
              <ul class="gl-rules mt-5">
                <li>說明只寫事實，例如「購物車裡還沒有商品」「目前沒有待付款的訂單」，不寫「哎呀」「很抱歉」。</li>
                <li>只放一個動作。整頁沒有內容時用主要按鈕帶去逛商品；篩選後沒有結果時用低強調按鈕，回到全部列表。</li>
                <li>靠左對齊，起點與原本的列表相同；上方留 <span class="num">48px</span>，不加框、不加底色。</li>
                <li>
                  設計稿用靜態畫面呈現這些狀態：放在頁面底部的「設計稿狀態示意」<code>.demo-state</code>，以虛線和正式內容分開，標題寫明是哪一種情況（例如「購物車是空的時」「篩選後沒有訂單時」）。
                </li>
              </ul>
            </div>

            <!-- 共用元件 -->
            <div class="gl-block">
              <h3 class="h4 gl-block-title">共用元件</h3>
              <p class="gl-minor-title h6 mt-0">ProductCard</p>
              <p class="gl-block-note">
                卡片依自身寬度調整版面（container query）：寬度 <span class="num">15rem</span> 以下時，價格與按鈕上下排列、按鈕滿版，並隱藏尺寸線。手機的商品列表是 2 欄，看到的就是窄卡。
              </p>
              <div class="row row-cols-2 row-cols-md-3 gx-4 gy-5">
                <div class="col d-flex flex-column">
                  <p class="gl-state-label gl-state-label-top">一般</p>
                  <div class="flex-grow-1"><ProductCard :product="tableProduct" /></div>
                </div>
                <div class="col d-flex flex-column">
                  <p class="gl-state-label gl-state-label-top">已售完：stock 為 0</p>
                  <div class="flex-grow-1"><ProductCard :product="soldOutProduct" /></div>
                </div>
                <div class="col d-flex flex-column">
                  <p class="gl-state-label gl-state-label-top">quick：首頁人氣嚴選</p>
                  <div class="flex-grow-1"><ProductCard :product="quickProduct" quick /></div>
                </div>
                <div class="col d-flex flex-column gl-card-narrow">
                  <p class="gl-state-label gl-state-label-top">窄卡：寬度 15rem 以下</p>
                  <div class="flex-grow-1"><ProductCard :product="tableProduct" /></div>
                </div>
              </div>

              <ul class="gl-rules mt-5">
                <li>一般：<code>btn-outline-primary</code>「加入購物車」。已售完：按鈕停用並改寫「已售完」，圖片左上角標示「已售完」。</li>
                <li>
                  <code>quick</code>：只用在首頁「人氣嚴選」，按鈕改為實心的「閃電結帳」（Notion 文案），直接前往結帳。每張卡只有這一個動作，所以一列四張卡各有一顆實心按鈕；除此之外，同一組動作只放一個主要按鈕。
                </li>
                <li>完整品名已內建詞組換行。圖片和品名連到同一頁，圖片連結不進 Tab 順序、也不讓螢幕閱讀器再念一次。</li>
              </ul>

              <p class="gl-minor-title h6 mt-6">CheckoutSteps</p>
              <p class="gl-block-note">
                放在 <code>.page-header</code> 內、h1 之前，取代麵包屑的位置。靠左橫排，圓點與文字同一行，步驟之間以髮絲線相連。
              </p>
              <div class="gl-rows">
                <div v-for="n in 3" :key="n">
                  <p class="gl-state-label gl-state-label-top"><code>current = {{ n }}</code> {{ stepLabels[n - 1] }}</p>
                  <CheckoutSteps :current="n" />
                </div>
              </div>
              <ul class="gl-rules mt-4">
                <li>目前步驟：墨色實心圓點，並加上 <code>aria-current="step"</code>。</li>
                <li>已完成：墨色外框加打勾，螢幕閱讀器會念出「（已完成）」。在第 2 步時，「購物車」可以點回去修改；付款完成後不再提供返回（元件內的 <code>canGoBack(i)</code> 判斷）。</li>
                <li>未完成：鈍亞麻外框圓點，連接線用亞麻灰。</li>
                <li>手機（<span class="num">576px</span> 以下）只顯示目前步驟的文字，其餘步驟留下圓點；每一步的點擊範圍仍有 <span class="num text-nowrap">44 × 44px</span>。</li>
              </ul>

              <p class="gl-minor-title h6 mt-6">訂單摘要 <code>.order-summary</code></p>
              <p class="gl-block-note">
                購物車、結帳、付款結果三頁共用同一套 markup，樣式寫在 <code>_order-summary.scss</code>，換頁時面板的內距、行距、字級都不變。下方示範讀的是購物車資料，寬度約等於 1440px 時的右欄。
              </p>
              <div class="row row-cols-1 row-cols-md-2 g-4 g-xl-5">
                <div class="col">
                  <p class="gl-state-label gl-state-label-top">結帳：品項 ＋ 金額列</p>
                  <aside class="order-summary gl-summary-demo" aria-label="訂單摘要示意：結帳">
                    <h4 class="order-summary-title">訂單摘要</h4>
                    <ul class="order-summary-items">
                      <li v-for="item in cartItems" :key="item.product.id" class="order-summary-item">
                        <div class="order-summary-thumb img-frame">
                          <img :src="item.product.image" alt="" loading="lazy" />
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
                      <button class="btn btn-primary w-100 mt-4" type="button">確認付款</button>
                      <p class="text-note text-center mt-3 mb-0">確認付款前，你都可以返回修改。</p>
                      <div class="text-center mt-2">
                        <RouterLink class="btn btn-text" to="/cart">
                          <i class="bi bi-chevron-left me-1" aria-hidden="true"></i>返回購物車
                        </RouterLink>
                      </div>
                    </div>
                  </aside>
                </div>
                <div class="col">
                  <p class="gl-state-label gl-state-label-top">購物車：只有金額列，運費下方加補充說明</p>
                  <aside class="order-summary gl-summary-demo" aria-label="訂單摘要示意：購物車">
                    <h4 class="order-summary-title">訂單摘要</h4>
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
                  </aside>
                </div>
              </div>

              <dl class="gl-spec gl-spec-sm mt-5">
                <div>
                  <dt>購物車</dt>
                  <dd>金額列（商品小計、運費與免運門檻、應付總額）→「前往結帳」→「繼續購物」。加 <code>.is-sticky</code>。</dd>
                </div>
                <div>
                  <dt>結帳</dt>
                  <dd>品項 → 金額列 →「確認付款」→「返回購物車」。加 <code>.is-sticky</code>；992px 以下同一組 markup 收合在表單上方，按「查看訂單明細」展開。</dd>
                </div>
                <div>
                  <dt>付款結果</dt>
                  <dd>訂單資訊列（編號、付款、配送、預計到貨）→ 品項 → 付款金額。是頁面的主要內容，外層用 <code>section</code>，不 sticky。</dd>
                </div>
              </dl>
              <ul class="gl-rules mt-4">
                <li>面板：暖白底、髮絲線外框、圓角 <span class="num">2px</span>，不加陰影；內距 <span class="num">24px</span>，1200px 以上 <span class="num">32px</span>。</li>
                <li>標題 <code>.order-summary-title</code>：頁面上是 h2（本頁示範降為 h4），字級用 h4 的 <span class="num">18px</span>，與內容相距 <span class="num">24px</span>。</li>
                <li>品項：縮圖 <span class="num">64px</span> 正方形；完整品名 <span class="num">14px</span>，已內建詞組換行（只在空白與 <code>\u200b</code> 斷點換行）；數量在左、小計在右，不另佔一欄。</li>
                <li>金額列 <code>.order-summary-row</code>：標籤靠左用深亞麻，數值靠右，列距 <span class="num">8px</span>。補充說明 <code>.order-summary-note</code> 獨立一行靠左。</li>
                <li>總額 <code>.order-summary-total</code>：上方一道髮絲線，標籤改用墨色，金額 <span class="num">22px</span>。品項與金額列之間同樣以髮絲線分開，上下各 <span class="num">16px</span>。</li>
                <li><code>.is-sticky</code>：992px 以上固定在右欄，top <span class="num">106px</span>。螢幕較矮時品項清單先縮短、在清單內捲動（至少 <span class="num">120px</span>），金額與按鈕維持看得到。</li>
                <li>按鈕放在面板最後：主要按鈕滿版、上距 <span class="num">24px</span>，下方一個 <code>.btn-text</code>。</li>
              </ul>
            </div>
          </section>

          <!-- ========== RWD 斷點 ========== -->
          <section id="gl-rwd" class="gl-section" aria-labelledby="gl-rwd-title">
            <div class="section-heading">
              <h2 id="gl-rwd-title">RWD 斷點</h2>
              <p>沿用 Bootstrap 預設斷點，只把最大容器改成 1240px。每頁都以 390、768、992、1200、1440px 五種寬度檢查，992 與 1200 是版面切換的邊界，最容易出問題。</p>
            </div>

            <figure class="gl-ruler" aria-label="斷點位置示意，0 到 1440px">
              <div class="gl-ruler-track">
                <span v-for="b in breakpoints.slice(1)" :key="b.name" :class="['gl-ruler-tick', `gl-ruler-tick-${b.name}`]">
                  <span class="gl-ruler-label"><span>{{ b.name }}</span><span class="num">{{ b.px }}</span></span>
                </span>
                <span v-for="w in [390, 768, 992, 1200, 1440]" :key="w" :class="['gl-ruler-view', `gl-ruler-view-${w}`]"><span class="num">{{ w }}</span></span>
              </div>
              <figcaption class="text-note">上方為斷點，下方為檢查用的五種寬度。</figcaption>
            </figure>

            <ol class="gl-bp list-unstyled">
              <li class="gl-bp-head" aria-hidden="true">
                <span>斷點</span>
                <span>視窗寬度</span>
                <span>容器最大寬</span>
                <span>本專案的變化</span>
              </li>
              <li v-for="b in breakpoints" :key="b.name" class="gl-bp-row">
                <span class="gl-bp-name">
                  <span class="visually-hidden">斷點 </span><span class="num">{{ b.name }}</span>
                  <span class="text-note">類別中綴 {{ b.infix }}</span>
                </span>
                <span><span class="visually-hidden">視窗寬度 </span><span class="num">{{ b.min }}</span></span>
                <span><span class="gl-bp-label">容器最大寬 </span><span class="num">{{ b.container }}</span></span>
                <span class="gl-bp-note">{{ b.note }}</span>
              </li>
            </ol>

            <div class="gl-block">
              <h3 class="h4 gl-block-title">各頁的版型行為</h3>
              <div class="gl-layouts">
                <div class="gl-layouts-head" aria-hidden="true">
                  <span>頁面</span>
                  <span>手機 &lt; 768</span>
                  <span>平板 768–991</span>
                  <span>桌機 ≥ 992</span>
                </div>
                <dl v-for="l in layouts" :key="l.page" class="gl-layouts-row">
                  <dt>{{ l.page }}</dt>
                  <dd><span class="gl-layouts-tag">手機 </span>{{ l.sm }}</dd>
                  <dd><span class="gl-layouts-tag">平板 </span>{{ l.md }}</dd>
                  <dd><span class="gl-layouts-tag">桌機 </span>{{ l.lg }}</dd>
                  <dd v-if="l.note" class="gl-layouts-note">{{ l.note }}</dd>
                </dl>
              </div>
            </div>

            <div class="gl-block">
              <h3 class="h4 gl-block-title">手機的橫向捲動列</h3>
              <p class="gl-block-note">
                商品分類標籤、訂單篩選、首頁的空間情境卡與人氣嚴選，以及本頁的手機目錄，在 <span class="num">576px</span> 以下都用 <code>.bleed-x</code>（或
                <code>@include bleed-x</code>）：捲動列貼齊螢幕兩側，第一項仍對齊版心。不要各頁自己計算負 margin。
              </p>
              <div>
                <p class="gl-state-label gl-state-label-top">分類標籤：在手機上往右滑</p>
                <div class="nav nav-underline bleed-x" role="group" aria-label="商品分類（示意）">
                  <button v-for="(c, i) in categories" :key="c" class="nav-link" :class="{ active: i === 0 }" type="button" :aria-pressed="i === 0 ? 'true' : 'false'">{{ c }}</button>
                </div>
              </div>
              <ul class="gl-rules mt-4">
                <li>作法：<code>margin-inline: -20px</code> 加上 <code>padding-inline: 20px</code>，數值取自 <code>$container-padding-x</code> 的一半。</li>
                <li>捲軸隱藏，所以右緣要讓最後一個看得見的項目被切到一半，或加上淡出，提示還能往右滑。</li>
                <li>分頁籤之間，手機 <span class="num">1.5rem</span>、768px 以上 <span class="num">2rem</span>，已內建在 <code>.nav-underline</code>。</li>
              </ul>
            </div>

            <div class="gl-block">
              <h3 class="h4 gl-block-title">格線示意</h3>
              <p class="gl-block-note">12 欄格線。以下使用真實的格線類別，調整視窗寬度就能看到欄數變化。</p>
              <div class="row gx-2 gy-2">
                <div v-for="n in 12" :key="n" class="col-1"><span class="gl-grid-cell num">{{ n }}</span></div>
              </div>
              <p class="gl-state-label gl-state-label-top mt-4"><code>.row-cols-2 .row-cols-md-3</code> 商品列表</p>
              <div class="row row-cols-2 row-cols-md-3 gx-3 gy-3">
                <div v-for="n in 6" :key="n" class="col"><span class="gl-grid-cell is-tall">商品</span></div>
              </div>
              <p class="gl-state-label gl-state-label-top mt-4"><code>.col-lg-7 .col-xl-8</code> ＋ <code>.col-lg-5 .col-xl-4</code> 結帳</p>
              <div class="row gx-3 gy-3">
                <div class="col-lg-7 col-xl-8"><span class="gl-grid-cell is-tall">表單</span></div>
                <div class="col-lg-5 col-xl-4"><span class="gl-grid-cell is-tall">訂單摘要</span></div>
              </div>
            </div>
          </section>

          <!-- ========== Do／Don't ========== -->
          <section id="gl-dodont" class="gl-section" aria-labelledby="gl-dodont-title">
            <div class="section-heading">
              <h2 id="gl-dodont-title">Do／Don’t 對照</h2>
              <p>標示「建議」的是推薦做法，標示「避免」的是應避免的做法；桌機左右並排，手機上下排列。範例都是真實的元件與類別。</p>
            </div>

            <!-- 1 留白 -->
            <div class="gl-dd">
              <h3 class="h5">用留白分組，不堆疊陰影卡片</h3>
              <p class="gl-dd-reason">色塊與陰影越多，視線越找不到重點；留白讓內容自己排出層級。</p>
              <div class="row row-cols-1 row-cols-md-2 g-4 g-md-5">
                <div class="col">
                  <figure class="gl-dd-fig is-do">
                    <figcaption class="gl-dd-label"><i class="bi bi-check-circle" aria-hidden="true"></i>建議</figcaption>
                    <div class="gl-dd-stage">
                      <ul class="gl-mini-list list-unstyled mb-0">
                        <li>
                          <p class="mb-1">免工具組裝</p>
                          <p class="small text-secondary mb-0">90% 商品採卡扣與簡易設計，單人也能輕鬆完成。</p>
                        </li>
                        <li>
                          <p class="mb-1">租屋友善退換</p>
                          <p class="small text-secondary mb-0">14 天猶豫期，專人到府收件，試擺不將就。</p>
                        </li>
                        <li>
                          <p class="mb-1">現貨極速派送</p>
                          <p class="small text-secondary mb-0">48 小時內出貨，週末馬上動手改造。</p>
                        </li>
                      </ul>
                    </div>
                  </figure>
                </div>
                <div class="col">
                  <figure class="gl-dd-fig is-dont">
                    <figcaption class="gl-dd-label"><i class="bi bi-x-circle" aria-hidden="true"></i>避免</figcaption>
                    <div class="gl-dd-stage">
                      <div class="gl-dont-cards">
                        <div class="card shadow-lg rounded-4 bg-oak">
                          <div class="card-body"><p class="gl-dont-bold mb-0">免工具組裝</p></div>
                        </div>
                        <div class="card shadow-lg rounded-4 bg-light">
                          <div class="card-body"><p class="gl-dont-bold mb-0">租屋友善退換</p></div>
                        </div>
                        <div class="card shadow-lg rounded-4 bg-warning">
                          <div class="card-body"><p class="gl-dont-bold mb-0">現貨極速派送</p></div>
                        </div>
                      </div>
                    </div>
                  </figure>
                </div>
              </div>
            </div>

            <!-- 2 按鈕層級 -->
            <div class="gl-dd">
              <h3 class="h5">同一組動作只有一個主要按鈕</h3>
              <p class="gl-dd-reason">每個按鈕都一樣醒目時，使用者得停下來判斷下一步該按哪一個。次要的動作改用外框或文字按鈕。</p>
              <div class="row row-cols-1 row-cols-md-2 g-4 g-md-5">
                <div class="col">
                  <figure class="gl-dd-fig is-do">
                    <figcaption class="gl-dd-label"><i class="bi bi-check-circle" aria-hidden="true"></i>建議</figcaption>
                    <div class="gl-dd-stage">
                      <div class="d-flex flex-wrap align-items-center gap-4">
                        <button type="button" class="btn btn-primary">前往結帳</button>
                        <button type="button" class="btn btn-text">繼續購物</button>
                      </div>
                    </div>
                  </figure>
                </div>
                <div class="col">
                  <figure class="gl-dd-fig is-dont">
                    <figcaption class="gl-dd-label"><i class="bi bi-x-circle" aria-hidden="true"></i>避免</figcaption>
                    <div class="gl-dd-stage">
                      <div class="d-flex flex-wrap gap-2">
                        <button type="button" class="btn btn-danger btn-sm">立即購買</button>
                        <button type="button" class="btn btn-warning btn-sm">加入購物車</button>
                        <button type="button" class="btn btn-info btn-sm">加入收藏</button>
                      </div>
                    </div>
                  </figure>
                </div>
              </div>
            </div>

            <!-- 3 原木小字 -->
            <div class="gl-dd">
              <h3 class="h5">原木色只做點綴，不寫小字</h3>
              <p class="gl-dd-reason"><code>$oak</code> 對紙白只有 2.4:1，未達 AA 的 4.5:1；需要原木色的文字請改用 <code>$oak-deep</code>（5.3:1）。</p>
              <div class="row row-cols-1 row-cols-md-2 g-4 g-md-5">
                <div class="col">
                  <figure class="gl-dd-fig is-do">
                    <figcaption class="gl-dd-label"><i class="bi bi-check-circle" aria-hidden="true"></i>建議</figcaption>
                    <div class="gl-dd-stage">
                      <span class="gl-accent-line" aria-hidden="true"></span>
                      <p class="small gl-text-oak-deep mb-1">滿 NT$ 3,000 免運</p>
                      <p class="text-note mb-0">文字 <code>$oak-deep</code>，原木色只留給上方的短線</p>
                    </div>
                  </figure>
                </div>
                <div class="col">
                  <figure class="gl-dd-fig is-dont">
                    <figcaption class="gl-dd-label"><i class="bi bi-x-circle" aria-hidden="true"></i>避免</figcaption>
                    <div class="gl-dd-stage">
                      <span class="gl-accent-line invisible" aria-hidden="true"></span>
                      <p class="small text-oak mb-1">滿 NT$ 3,000 免運</p>
                      <p class="text-note mb-0">文字 <code>.text-oak</code>，對比 2.4:1</p>
                    </div>
                  </figure>
                </div>
              </div>
            </div>

            <!-- 4 價格 -->
            <div class="gl-dd">
              <h3 class="h5">價格清楚就好，不用紅色粗體促銷</h3>
              <p class="gl-dd-reason">強烈的促銷色會讓結帳前的決定變得急躁；金額好讀，才讓人放心。</p>
              <div class="row row-cols-1 row-cols-md-2 g-4 g-md-5">
                <div class="col">
                  <figure class="gl-dd-fig is-do">
                    <figcaption class="gl-dd-label"><i class="bi bi-check-circle" aria-hidden="true"></i>建議</figcaption>
                    <div class="gl-dd-stage">
                      <p class="small text-secondary mb-1">{{ tableProduct.name }}</p>
                      <p class="price fs-4 mb-1">{{ formatPrice(tableProduct.price) }}</p>
                      <p class="text-note mb-0">含稅，滿 NT$ 3,000 免運</p>
                    </div>
                  </figure>
                </div>
                <div class="col">
                  <figure class="gl-dd-fig is-dont">
                    <figcaption class="gl-dd-label"><i class="bi bi-x-circle" aria-hidden="true"></i>避免</figcaption>
                    <div class="gl-dd-stage">
                      <p class="mb-1"><span class="badge bg-danger gl-dont-bold">限時搶購</span> <del class="small text-secondary">原價 NT$25000</del></p>
                      <p class="gl-dont-price mb-0">NT$16800!!</p>
                    </div>
                  </figure>
                </div>
              </div>
            </div>

            <!-- 5 圖片 -->
            <div class="gl-dd">
              <h3 class="h5">自然光、低彩度的照片，不去背加漸層</h3>
              <p class="gl-dd-reason">照片和網站同樣是暖白的底，畫面才安靜；高飽和與漸層會蓋過家具本身的材質。</p>
              <div class="row row-cols-1 row-cols-md-2 g-4 g-md-5">
                <div class="col">
                  <figure class="gl-dd-fig is-do">
                    <figcaption class="gl-dd-label"><i class="bi bi-check-circle" aria-hidden="true"></i>建議</figcaption>
                    <div class="gl-dd-stage">
                      <div class="img-frame gl-dd-img">
                        <img :src="nightstand.image" alt="米白背景前的極簡床頭櫃，自然光拍攝" loading="lazy" width="1200" height="1200" />
                      </div>
                    </div>
                  </figure>
                </div>
                <div class="col">
                  <figure class="gl-dd-fig is-dont">
                    <figcaption class="gl-dd-label"><i class="bi bi-x-circle" aria-hidden="true"></i>避免</figcaption>
                    <div class="gl-dd-stage">
                      <div class="img-frame gl-dd-img gl-dont-img">
                        <img :src="nightstand.image" alt="同一張床頭櫃照片，被加上高飽和度與漸層背景" loading="lazy" width="1200" height="1200" />
                      </div>
                    </div>
                  </figure>
                </div>
              </div>
            </div>

            <!-- 6 結帳表單 -->
            <div class="gl-dd">
              <h3 class="h5">結帳表單單欄分組，由上而下填寫</h3>
              <p class="gl-dd-reason">
                只有相關的短欄位（姓名／手機、有效期限／安全碼）才兩兩並排。視線不必左右跳動；每一欄都有標籤，就不會填到一半忘了這格要填什麼。
              </p>
              <div class="row row-cols-1 row-cols-md-2 g-4 g-md-5">
                <div class="col">
                  <figure class="gl-dd-fig is-do">
                    <figcaption class="gl-dd-label"><i class="bi bi-check-circle" aria-hidden="true"></i>建議</figcaption>
                    <div class="gl-dd-stage">
                      <fieldset>
                        <legend class="h6 mb-3">收件資訊</legend>
                        <div class="row g-3">
                          <div class="col-sm-6">
                            <label class="form-label" for="gl-dd-name">收件人姓名</label>
                            <input id="gl-dd-name" class="form-control" type="text" autocomplete="off" />
                          </div>
                          <div class="col-sm-6">
                            <label class="form-label" for="gl-dd-phone">手機號碼</label>
                            <input id="gl-dd-phone" class="form-control" type="tel" autocomplete="off" />
                          </div>
                          <div class="col-12">
                            <label class="form-label" for="gl-dd-addr">配送地址</label>
                            <input id="gl-dd-addr" class="form-control" type="text" autocomplete="off" />
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </figure>
                </div>
                <div class="col">
                  <figure class="gl-dd-fig is-dont">
                    <figcaption class="gl-dd-label"><i class="bi bi-x-circle" aria-hidden="true"></i>避免</figcaption>
                    <div class="gl-dd-stage">
                      <div class="row row-cols-4 g-1">
                        <div class="col">
                          <label class="visually-hidden" for="gl-dd-x1">姓名</label>
                          <input id="gl-dd-x1" class="form-control form-control-sm" placeholder="姓名" autocomplete="off" />
                        </div>
                        <div class="col">
                          <label class="visually-hidden" for="gl-dd-x2">電話</label>
                          <input id="gl-dd-x2" class="form-control form-control-sm" placeholder="電話" autocomplete="off" />
                        </div>
                        <div class="col">
                          <label class="visually-hidden" for="gl-dd-x3">Email</label>
                          <input id="gl-dd-x3" class="form-control form-control-sm" placeholder="Email" autocomplete="off" />
                        </div>
                        <div class="col">
                          <label class="visually-hidden" for="gl-dd-x4">統編</label>
                          <input id="gl-dd-x4" class="form-control form-control-sm" placeholder="統編" autocomplete="off" />
                        </div>
                        <div class="col">
                          <label class="visually-hidden" for="gl-dd-x5">地址</label>
                          <input id="gl-dd-x5" class="form-control form-control-sm" placeholder="地址" autocomplete="off" />
                        </div>
                        <div class="col">
                          <label class="visually-hidden" for="gl-dd-x6">卡號</label>
                          <input id="gl-dd-x6" class="form-control form-control-sm" placeholder="卡號" autocomplete="off" />
                        </div>
                        <div class="col">
                          <label class="visually-hidden" for="gl-dd-x7">到期</label>
                          <input id="gl-dd-x7" class="form-control form-control-sm" placeholder="到期" autocomplete="off" />
                        </div>
                        <div class="col">
                          <label class="visually-hidden" for="gl-dd-x8">CVC</label>
                          <input id="gl-dd-x8" class="form-control form-control-sm" placeholder="CVC" autocomplete="off" />
                        </div>
                      </div>
                    </div>
                  </figure>
                </div>
              </div>
            </div>

            <!-- 7 尺寸 -->
            <div class="gl-dd">
              <h3 class="h5">尺寸寫出數字，不用形容詞帶過</h3>
              <p class="gl-dd-reason">租屋族最在意放不放得下，W × D × H 應該在列表上就看得到，而不是點進詳情才找得到。</p>
              <div class="row row-cols-1 row-cols-md-2 g-4 g-md-5">
                <div class="col">
                  <figure class="gl-dd-fig is-do">
                    <figcaption class="gl-dd-label"><i class="bi bi-check-circle" aria-hidden="true"></i>建議</figcaption>
                    <div class="gl-dd-stage">
                      <div class="gl-mini-item">
                        <div class="img-frame gl-mini-thumb"><img :src="quickProduct.image" alt="" loading="lazy" /></div>
                        <div>
                          <p class="mb-1">{{ quickProduct.name }}</p>
                          <p class="dim mb-1">
                            <span class="dim-line" aria-hidden="true"></span>
                            <span>{{ formatSize(quickProduct.size, quickProduct.sizeNote) }}</span>
                          </p>
                          <p class="price mb-0">{{ formatPrice(quickProduct.price) }}</p>
                        </div>
                      </div>
                    </div>
                  </figure>
                </div>
                <div class="col">
                  <figure class="gl-dd-fig is-dont">
                    <figcaption class="gl-dd-label"><i class="bi bi-x-circle" aria-hidden="true"></i>避免</figcaption>
                    <div class="gl-dd-stage">
                      <div class="gl-mini-item">
                        <div class="img-frame gl-mini-thumb"><img :src="quickProduct.image" alt="" loading="lazy" /></div>
                        <div>
                          <p class="mb-1">{{ quickProduct.name }}</p>
                          <p class="small text-secondary mb-1">超薄設計，什麼縫隙都放得進去</p>
                          <p class="price mb-0">{{ formatPrice(quickProduct.price) }}</p>
                        </div>
                      </div>
                    </div>
                  </figure>
                </div>
              </div>
            </div>

            <!-- 8 錯誤訊息 -->
            <div class="gl-dd">
              <h3 class="h5">錯誤訊息說明下一步，不用警告語氣</h3>
              <p class="gl-dd-reason">付款失敗時，使用者最擔心的是有沒有被扣款。先回答這件事，再說怎麼處理。</p>
              <div class="row row-cols-1 row-cols-md-2 g-4 g-md-5">
                <div class="col">
                  <figure class="gl-dd-fig is-do">
                    <figcaption class="gl-dd-label"><i class="bi bi-check-circle" aria-hidden="true"></i>建議</figcaption>
                    <div class="gl-dd-stage">
                      <div class="alert alert-danger gl-alert mb-0">
                        <i class="bi bi-x-circle" aria-hidden="true"></i>
                        <div>
                          <p class="gl-alert-title">付款沒有完成</p>
                          <p class="mb-0">這筆交易沒有扣款。請確認卡號與有效期限，再試一次。</p>
                        </div>
                      </div>
                    </div>
                  </figure>
                </div>
                <div class="col">
                  <figure class="gl-dd-fig is-dont">
                    <figcaption class="gl-dd-label"><i class="bi bi-x-circle" aria-hidden="true"></i>避免</figcaption>
                    <div class="gl-dd-stage">
                      <div class="alert alert-danger gl-dont-shout mb-0">ERROR 402：付款失敗！！請重新操作</div>
                    </div>
                  </figure>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
