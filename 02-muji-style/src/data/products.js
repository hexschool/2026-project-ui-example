// 假資料：商品文案取自 Notion「設計稿範例產出文件」（品名、介紹、尺寸、類別、價格逐字使用；尺寸的乘號統一為「×」，
// 尺寸內的空格為不換行空白 \u00a0，讓「W160 × D80 × H75 cm」不會從中間換行）
// 圖片放在 public/images/，以相對路徑引用（配合 vite base: './'）
//
// 品名規則：畫面上一律用完整 name；shortName 只用在商品詳情的麵包屑
// 長品名在詞組之間插入零寬空白（\u200b），配合 .text-phrase 只在這些位置換行；畫面上看不到，文案仍逐字

export const categories = ['全部', '沙發', '餐桌椅', '收納家具', '臥室家具', '居家燈具', '椅子']

export const products = [
  {
    id: 'p-1001',
    name: '橡木餐桌',
    category: '餐桌椅',
    price: 16800,
    size: { w: 160, d: 80, h: 75 },
    sizeText: 'W160\u00a0×\u00a0D80\u00a0×\u00a0H75\u00a0cm',
    material: '北美 FAS 級白橡木',
    stock: 12,
    image: 'images/p-1001.jpg',
    // 細節圖：目前只有橡木餐桌拍了細節，其他商品的圖庫以情境圖補足（見 mediaOf）
    details: [
      { src: 'images/detail-oak-dining.jpg', alt: '橡木餐桌擺在灑進陽光的餐廳，兩側各放一張原木編繩椅' },
      { src: 'images/detail-oak-grain.jpg', alt: '白橡木桌面的木紋與圓弧倒角收邊特寫' },
      { src: 'images/detail-oak-leg.jpg', alt: '實木桌腳與桌面接合處特寫' },
    ],
    description:
      '嚴選北美 FAS 級白橡木打造，保留天然溫潤的木紋肌理與原木觸感。寬敞的桌面設計搭配倒角安全收邊，穩固的實木桌腳提供優異的承重力，為您的餐廳空間注入自然質樸的北歐氣息，是與家人朋友共享美好時光的完美選擇。',
  },
  {
    id: 'p-1002',
    name: '亞麻雙人沙發',
    category: '沙發',
    price: 32800,
    size: { w: 180, d: 90, h: 85 },
    sizeText: 'W180\u00a0×\u00a0D90\u00a0×\u00a0H85\u00a0cm',
    material: '天然亞麻布、實木椅腳',
    stock: 5,
    image: 'images/p-1002.jpg',
    description:
      '採用高透氣性天然亞麻布料，觸感親膚且四季皆宜。內層搭配高密度回彈泡棉與獨立筒彈簧，提供極致的支撐力與包覆感。簡約流暢的線條設計搭配實木沙發腳，輕鬆融入各種現代與無印風居家風格。',
  },
  {
    id: 'p-1003',
    name: '藤編收納櫃',
    category: '收納家具',
    price: 12600,
    size: { w: 80, d: 40, h: 110 },
    sizeText: 'W80\u00a0×\u00a0D40\u00a0×\u00a0H110\u00a0cm',
    material: '手工天然藤編、實木框架',
    stock: 0,
    image: 'images/p-1003.jpg',
    description:
      '結合傳統手工天然藤編與堅固實木框架，呈現優雅的復古質感。透氣的藤編門片不僅能有效防潮、保持內部通風，更為空間帶來若隱若現的視覺層次，提供充足且充滿生活美學的收納機能。',
  },
  {
    id: 'p-1004',
    name: '極簡床頭櫃',
    category: '臥室家具',
    price: 7800,
    size: { w: 45, d: 40, h: 50 },
    sizeText: 'W45\u00a0×\u00a0D40\u00a0×\u00a0H50\u00a0cm',
    material: '橡木貼皮、靜音滑軌',
    stock: 18,
    image: 'images/p-1004.jpg',
    description:
      '俐落的無把手幾何設計，展現純粹的極簡美學。滑順的靜音抽屜軌道與適中的檯面高度，方便您在床邊隨手放置讀物、眼鏡與夜燈。懸浮式的底座設計讓視覺更顯輕盈，同時方便日常清潔打掃。',
  },
  {
    id: 'p-1005',
    name: '弧形落地燈',
    category: '居家燈具',
    price: 6900,
    size: { w: 40, d: 120, h: 180 },
    sizeText: 'W40\u00a0×\u00a0D120\u00a0×\u00a0H180\u00a0cm',
    material: '霧面金屬烤漆、大理石底座',
    stock: 9,
    image: 'images/p-1005.jpg',
    description:
      '優雅的優美弧線燈桿搭配霧面金屬烤漆燈罩，宛如空間中的藝術雕塑。穩固的大理石底座確保不易傾倒，柔和的向下光源能有效防眩光，為客廳或專屬閱讀角落營造溫馨且專注的光影氛圍。',
  },
  {
    id: 'p-1006',
    name: '羊毛休閒單椅',
    category: '椅子',
    price: 14200,
    size: { w: 75, d: 80, h: 90 },
    sizeText: 'W75\u00a0×\u00a0D80\u00a0×\u00a0H90\u00a0cm',
    material: '人造羊毛、實木椅腳',
    stock: 4,
    image: 'images/p-1006.jpg',
    description:
      '嚴選頂級人造羊毛包覆，帶來如雲朵般柔軟的極致坐感。符合人體工學的微傾斜椅背與厚實的寬大坐墊，讓您在忙碌一天後能徹底放鬆，是專屬於您的療癒角落，適合擺放於客廳、臥室或書房。',
  },
  {
    id: 'p-1007',
    name: 'NestBox 自由拼裝\u200b收納方塊 (三入組)',
    shortName: 'NestBox 自由拼裝\u200b收納方塊',
    category: '收納家具',
    price: 1280,
    size: { w: 35, d: 35, h: 35 },
    sizeText: '單入 W35\u00a0×\u00a0D35\u00a0×\u00a0H35\u00a0cm',
    sizeNote: '單入', // 價格為三入組，尺寸為單顆
    material: '環保輕量板材、免工具卡扣',
    stock: 36,
    image: 'images/p-1007.jpg',
    featured: true,
    description:
      '專為小坪數設計的模組化收納方塊。採用輕量且堅固的環保材質，無須工具即可輕鬆卡扣組裝。無論是堆疊成書櫃、橫放作為電視櫃，或是依畸零空間自由變換形狀，都能完美適應你的生活百態。未來搬家時更能輕鬆拆卸打包，絕不成為負擔。',
  },
  {
    id: 'p-1008',
    name: 'SlimFit 夾縫\u200b多功能推車',
    category: '收納家具',
    price: 890,
    size: { w: 15, d: 45, h: 80 },
    sizeText: 'W15\u00a0×\u00a0D45\u00a0×\u00a0H80\u00a0cm',
    material: '粉體烤漆鋼材、靜音滾輪',
    stock: 42,
    image: 'images/p-1008.jpg',
    featured: true,
    description:
      '榨出空間最大潛力的收納神器！僅 15 公分的超薄寬度，能完美隱身於冰箱旁、沙發側或書桌邊的窄小縫隙。搭配滑順靜音滾輪與三層高防護邊框設計，輕鬆收納瓶罐雜物。走到哪推到哪，讓租屋處不再有浪費的死角。',
  },
  {
    id: 'p-1009',
    name: '日暮亞麻｜\u200b雙人沙發床 (底座隱藏收納)',
    shortName: '日暮亞麻｜\u200b雙人沙發床',
    category: '沙發',
    price: 8600,
    size: { w: 150, d: 85, h: 80 },
    sizeText: '沙發模式 W150\u00a0×\u00a0D85\u00a0×\u00a0H80\u00a0cm / 床鋪模式 W150\u00a0×\u00a0D190\u00a0×\u00a0H40\u00a0cm',
    sizeNote: '沙發模式',
    sizeModes: [
      { label: '沙發模式', w: 150, d: 85, h: 80 },
      { label: '床鋪模式', w: 150, d: 190, h: 40 },
    ],
    material: '亞麻混紡布、實木底座',
    stock: 7,
    image: 'images/p-1009.jpg',
    featured: true,
    description:
      '小空間的極致雙棲選擇。白天是擁有溫潤觸感與高支撐力的亞麻雙人沙發，夜晚輕鬆翻摺即可化身舒適好眠的雙人床。底座更暗藏大容量的隱藏式收納空間，換季衣物或備用寢具皆能輕鬆隱形，一物三用，徹底放大你的生活坪數。',
  },
  {
    id: 'p-1010',
    name: '懸浮感\u200b洞洞板\u200b壁面收納組 (免釘牆)',
    shortName: '懸浮感\u200b洞洞板\u200b壁面收納組',
    category: '收納家具',
    price: 1450,
    size: { w: 60, d: 2, h: 60 },
    sizeText: 'W60\u00a0×\u00a0D2\u00a0×\u00a0H60\u00a0cm (單片底板)',
    sizeNote: '單片底板',
    material: '樺木合板、高強度無痕貼',
    stock: 25,
    image: 'images/p-1010.jpg',
    featured: true,
    description:
      '租屋族必備的牆面佈置救星！採用高強度無痕貼設計，免鑽孔、不傷牆面即可牢固安裝，退租無憂。附贈多款層板、木棍與掛勾配件，可隨心所欲打造個人專屬的展示區或玄關收納牆。極簡懸浮的視覺設計，讓日常收納也成為牆上最美的風景。',
  },
]

export const featuredProducts = products.filter((p) => p.featured)

export const findProduct = (id) => products.find((p) => p.id === id) ?? products[0]

// 金額格式：NT$ 16,800
export const formatPrice = (n) => `NT$ ${n.toLocaleString('en-US')}`

// 尺寸格式：W160 × D80 × H75 cm；有限定詞時放在前面，例如「單入 W35 × D35 × H35 cm」
// W×D×H 之間用不換行空白（\u00a0），只允許在限定詞後面換行：「沙發模式／W150 × D85 × H80 cm」
export const formatSize = ({ w, d, h }, note) =>
  `${note ? `${note} ` : ''}W${w}\u00a0×\u00a0D${d}\u00a0×\u00a0H${h}\u00a0cm`

// 運費文字：0 元顯示「免運」
export const feeText = (fee) => (fee === 0 ? '免運' : formatPrice(fee))

// 庫存低於此數量時顯示「剩 N 件」（詳情頁與 Guideline 共用）
export const LOW_STOCK = 10

// 加總：sum(items, 'qty')、sum(items, 'subtotal')
const sum = (items, key) => items.reduce((total, item) => total + item[key], 0)

// ---------- 商品一覽：篩選項目與件數（「全部」為總數） ----------
export const categoryList = categories.map((name) => ({
  name,
  count: name === '全部' ? products.length : products.filter((p) => p.category === name).length,
}))
// 依寬度篩選：租屋族最常問的是「放不放得下」；數字與 cm 之間用不換行空白
export const widthFilters = [
  { id: 'width-s', label: '30\u00a0cm 以下', count: products.filter((p) => p.size.w <= 30).length },
  { id: 'width-m', label: '30–80\u00a0cm', count: products.filter((p) => p.size.w > 30 && p.size.w <= 80).length },
  { id: 'width-l', label: '80\u00a0cm 以上', count: products.filter((p) => p.size.w > 80).length },
]

// 會員示意資料（我的訂單、付款結果共用）
export const member = { name: '王小明', email: 'xiaoming@example.com', phone: '0912 345 678' }

// ---------- 購物車（購物車、結帳、付款結果共用） ----------
// 品項一律用商品編號取得，商品順序改變也不會對錯；subtotal＝單價 × 數量
const line = (id, qty) => {
  const product = findProduct(id)
  return { product, qty, subtotal: product.price * qty }
}
export const cartItems = [line('p-1001', 1), line('p-1007', 2), line('p-1008', 1)]
export const shippingFee = 0 // 滿 NT$ 3,000 免運
export const cartSubtotal = sum(cartItems, 'subtotal')
export const cartQty = sum(cartItems, 'qty')
export const cartTotal = cartSubtotal + shippingFee
export const shippingText = feeText(shippingFee)

// ---------- 訂單（我的訂單、付款結果共用） ----------
// 依下單日期新到舊；第一筆就是剛在付款結果頁成立的訂單（品項＝購物車，所以件數、總額＝cartQty、cartTotal）
// 小計、件數、總額由品項與運費算出，不另外手寫
export const orderStatuses = ['全部', '待付款', '已付款', '出貨中', '已完成', '已取消']
const homeAddress = '台北市大安區溫州街 18 號 3 樓'
const creditCard = '信用卡（末四碼 4242）'
const order = (data) => {
  const subtotal = sum(data.items, 'subtotal')
  return { ...data, subtotal, count: sum(data.items, 'qty'), total: subtotal + data.shippingFee }
}
export const orders = [
  order({
    no: 'NC-20260923-001', date: '2026-09-23', status: '已付款', items: cartItems, shippingFee,
    shipping: '宅配到府（免運）', eta: '2026-10-02', address: homeAddress, payment: creditCard,
    history: [['09/23', '下單並完成付款']],
  }),
  order({
    no: 'NC-20260921-009', date: '2026-09-21', status: '待付款', items: [line('p-1004', 1)], shippingFee: 0,
    shipping: '宅配到府', eta: '付款後 3–5 個工作天', payDeadline: '2026-09-24', address: homeAddress, payment: 'ATM 轉帳',
    history: [['09/21', '下單，等待轉帳']],
  }),
  order({
    no: 'NC-20260918-001', date: '2026-09-18', status: '出貨中', items: [line('p-1001', 1), line('p-1007', 2)], shippingFee: 0,
    shipping: '宅配到府（大型家具）', eta: '2026-09-25', address: homeAddress, payment: creditCard,
    history: [['09/18', '下單並完成付款'], ['09/19', '開始備貨'], ['09/22', '出貨，由大型家具專車配送']],
  }),
  // 未滿 NT$ 3,000，超商取貨運費 NT$ 60
  order({
    no: 'NC-20260830-017', date: '2026-08-30', status: '已完成', items: [line('p-1008', 1), line('p-1010', 1)], shippingFee: 60,
    shipping: '超商取貨', eta: '2026-09-02', address: '超商門市：大安和平店', payment: 'LINE Pay',
    history: [['08/30', '下單並完成付款'], ['08/31', '出貨'], ['09/02', '已在門市取貨']],
  }),
  order({
    no: 'NC-20260803-002', date: '2026-08-03', status: '已取消', items: [line('p-1005', 1)], shippingFee: 0,
    shipping: '宅配到府', eta: '—', cancelDate: '2026-08-04', address: homeAddress, payment: '貨到付款',
    history: [['08/03', '下單'], ['08/04', '依你的申請取消訂單，未扣款']],
  }),
]

// 訂單狀態 → 標籤樣式（見 scss/_base.scss 的 .badge-status）
export const statusClass = {
  待付款: 'is-pending',
  已付款: 'is-paid',
  出貨中: 'is-shipping',
  已完成: 'is-done',
  已取消: 'is-cancel',
}

// ---------- 首頁：沉浸式空間搭配 ----------
// Hotspot 座標為圖片寬高的百分比，圖片比例固定 3:2 不裁切；座標對照 public/images/room-*.jpg 實際家具位置
// 熱點可用 sizeNote／size 覆寫商品的預設尺寸（例如沙發床在照片中是攤開的床鋪模式）
export const rooms = [
  {
    id: 'room-a',
    label: '5 坪微型公寓',
    title: '溫潤木質調的\u200b無壓舒眠區',
    image: 'images/room-a.jpg',
    alt: '5 坪微型公寓的臥室：原木床架鋪著亞麻寢具，床邊是橡木床頭櫃與檯燈，窗邊垂著白紗簾',
    hotspots: [
      { x: 14, y: 66, product: findProduct('p-1004') }, // 床頭櫃
      { x: 61, y: 62, product: findProduct('p-1009'), sizeNote: '床鋪模式', size: { w: 150, d: 190, h: 40 } }, // 床（沙發床攤開）
    ],
  },
  {
    id: 'room-b',
    label: '陽光小套房',
    title: '兼具在家辦公\u200b與完美收納的\u200b雙棲角落',
    image: 'images/room-b.jpg',
    alt: '陽光小套房：左側是整面原木收納方塊牆，窗前擺著原木書桌與椅子，右下角是亞麻布沙發',
    hotspots: [
      { x: 27, y: 46, product: findProduct('p-1007') }, // 收納方塊牆
      { x: 82, y: 49, product: findProduct('p-1001') }, // 窗前書桌
      { x: 90, y: 77, product: findProduct('p-1009') }, // 右下亞麻沙發
    ],
  },
  {
    id: 'room-c',
    label: '小資雙人租屋',
    title: '共享好時光，\u200b魔術放大的\u200b客餐廳',
    image: 'images/room-c.jpg',
    alt: '小資雙人租屋的客餐廳：前景是原木餐桌椅，後方有藤編收納櫃、淺灰雙人沙發與弧形落地燈',
    hotspots: [
      { x: 25, y: 56, product: findProduct('p-1001') }, // 餐桌
      { x: 41, y: 48, product: findProduct('p-1003') }, // 藤編收納櫃
      { x: 62, y: 58, product: findProduct('p-1002') }, // 雙人沙發
      { x: 69, y: 31, product: findProduct('p-1005') }, // 弧形落地燈
    ],
  },
]
// 預先算好：熱點的尺寸文字；「整套加入」的件數與金額（只計入有庫存的品項）
for (const room of rooms) {
  for (const spot of room.hotspots) {
    spot.sizeText = formatSize(spot.size ?? spot.product.size, spot.sizeNote ?? spot.product.sizeNote)
  }
  const inStock = room.hotspots.filter((spot) => spot.product.stock > 0)
  room.setCount = inStock.length
  room.setTotal = inStock.reduce((total, spot) => total + spot.product.price, 0)
  room.hasSoldOut = inStock.length < room.hotspots.length
}

// ---------- 商品詳情：由上面的資料推得，view 只負責顯示 ----------
// 圖片：圖庫＝商品照＋細節照，沒有細節照時以情境圖（商品出現在首頁哪些空間照）補足；
// 「商品介紹」只放圖庫沒用到的情境圖，沒有就不放。情境圖以熱點位置作為裁切重心
export const mediaOf = (product) => {
  const cover = { src: product.image, alt: `${product.name}商品照` }
  const scenes = rooms.flatMap((room) =>
    room.hotspots
      .filter((spot) => spot.product.id === product.id)
      .map((spot) => ({ src: room.image, alt: room.alt, position: `${spot.x}% 50%`, caption: `${room.label}：${room.title}` })),
  )
  return product.details
    ? { gallery: [cover, ...product.details], storyScene: scenes[0] ?? null }
    : { gallery: [cover, ...scenes], storyScene: null }
}

// 尺寸圖：沙發床有沙發／床鋪兩種模式，各畫一組並共用同一比例尺（以最高的 H、最長的 W＋D 換算）
export const sizeDrawingOf = (product) => {
  const sizeModes = product.sizeModes ?? [{ label: product.sizeNote, ...product.size }]
  const dimScale = {
    '--h-max': Math.max(...sizeModes.map((m) => m.h)),
    '--span-max': Math.max(...sizeModes.map((m) => m.w + m.d)),
  }
  return { sizeModes, dimScale }
}

// 你可能也會喜歡：同分類優先，再補小坪數推薦，最後補其他；取 4 件（手機 2×2，md 以上顯示前 3 件）
export const relatedOf = (product) => {
  const others = products.filter((p) => p.id !== product.id)
  const picks = [...others.filter((p) => p.category === product.category), ...others.filter((p) => p.featured), ...others]
  return [...new Set(picks)].slice(0, 4)
}
