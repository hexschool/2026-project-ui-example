// ============================================================
// 產生本風格的商品照與空間情境圖（Codex CLI image_generation）
//
// 需求：已登入的 codex CLI（>= 0.150）、macOS sips（轉 JPEG 與縮圖）
// 用法：
//   node scripts/generate-images.mjs                 # 產生缺少的圖片（已存在的會跳過）
//   node scripts/generate-images.mjs --only hero,cta # 只產生指定檔名
//   node scripts/generate-images.mjs --force         # 全部重新產生
//   CONC=2 node scripts/generate-images.mjs          # 並行數（預設 1，避免撞到額度）
//
// 換風格時：修改 STYLE（整組圖的共同調性）與各張 prompt，檔名維持不變即可，不用改程式。
// 原理：codex exec 的輸出會存在 ~/.codex/generated_images/<session id>/，
//       從 log 解析 session id 就能對應到正確的檔案，所以可以安全地並行。
// ============================================================
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { spawn, execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(HERE, '../images')
const RAW = path.join(os.tmpdir(), 'nestcraft-french-raw-images') // 原始 PNG（不進版控，不和其他風格共用）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 1)

// 04 法式復古風：巴黎老公寓、奶油灰泥牆、人字拼橡木地板、午後金色窗光；勃艮第與焦糖只出現在小織品
const STYLE = 'Parisian vintage apartment aesthetic: warm buttery cream plaster walls, herringbone oak parquet, simple white ceiling moulding, tall French windows with sheer linen curtains, soft late-afternoon golden window light (around 3800K) with gentle long shadows, muted burgundy and caramel-brown accents only in small textiles such as a velvet cushion, a wool throw or a leather strap, antique brass details, a few dried flowers in a ceramic jug, subtle film-like grain, calm, elegant and symmetrical editorial interior photography with creamy highlights. No people, no text, no logo, no watermark, no brand marks.'
// 商品照只取 STYLE 的色調與光線（不帶房間元素，避免背景出現地板或窗框）
const TONE = 'Parisian vintage catalogue aesthetic: warm buttery cream tones, soft golden window light, subtle film-like grain, calm and elegant editorial product photography with creamy highlights. No people, no text, no logo, no watermark, no brand marks.'
const ROOM = (desc) => `Photorealistic interior photograph, wide landscape 3:2 composition, eye-level, 35mm lens, centered and balanced composition. ${desc} Setting: a small Parisian-style rental apartment with warm cream plaster walls, white ceiling moulding, herringbone oak parquet and a tall French window. ${STYLE}`
const PRODUCT = (desc) => `Photorealistic studio product photograph, square 1:1 composition. ${desc}. The product is centered with generous padding on all sides, standing on a seamless warm cream (#EFE4D1) paper backdrop with a soft natural floor shadow, gentle directional window light from the left with a slight golden warmth. Single product only, no props unless described. ${TONE}`
const CANDID = (desc) => `Photorealistic candid smartphone photo in square 1:1 format, as posted on Instagram by a young renter in Taipei, warm golden-hour light, slightly imperfect framing. ${desc} Warm cream, caramel and a touch of burgundy tones. No people visible, no text, no logo, no watermark.`

const JOBS = [
  // 空間靈感（首頁三段之字形情境；熱點座標對照這三張圖）
  ['room-a', ROOM('A 5-ping (16 m2) micro apartment sleeping nook in warm wood tones: an oatmeal linen two-seat sofa bed unfolded flat into a bed on a light-oak base, made up with cream linen bedding and one small burgundy velvet cushion, placed against the wall in the middle of the frame; on the left a minimalist handle-less light-oak bedside table with one drawer and a small ceramic lamp; sheer linen curtain on the French window. Serene and pressure-free.')],
  ['room-b', ROOM('A sunlit small studio with a dual-purpose work-from-home corner: on the left a wall of modular light-oak cube storage boxes stacked three high with books and folded linen; in the center a solid white-oak rectangular table used as a desk in front of the tall French window with one bentwood chair; in the right foreground a compact oatmeal linen two-seat sofa on a light-oak base with a folded caramel wool throw. Tidy and practical.')],
  ['room-c', ROOM('A compact living-dining room in a rental shared by a young couple: in the left foreground a solid white-oak rectangular dining table with two bentwood chairs; behind it against the wall a storage cabinet with natural rattan cane doors in a light-oak frame; in the center-right a flax-grey linen two-seat sofa with one burgundy velvet cushion; beside the sofa a slender arc floor lamp with a curved warm-greige metal arm and off-white dome shade reaching over the sofa. Feels spacious despite the small footprint.')],
  // 商品照（NestCraft 型錄 10 件）
  ['p-1001', PRODUCT('A solid white-oak rectangular dining table (W160 x D80 x H75 cm) with softly rounded chamfered edges and four sturdy square solid-oak legs, natural matte oiled finish showing beautiful straight wood grain, three-quarter view')],
  ['p-1002', PRODUCT('A two-seat sofa (W180 cm) upholstered in natural flax-grey washed linen, simple clean lines, plump loose seat cushions, slim tapered light-oak legs, one small burgundy velvet cushion, three-quarter view')],
  ['p-1003', PRODUCT('A storage cabinet (W80 x H110 cm) with two doors of natural hand-woven rattan cane webbing set in a solid light-oak frame, small antique brass round knobs, three-quarter view')],
  ['p-1004', PRODUCT('A handle-less minimalist bedside table (W45 x H50 cm) in light oak with one push-to-open drawer and one open shelf, recessed floating plinth base, three-quarter view')],
  ['p-1005', PRODUCT('An arc floor lamp (H180 cm) with a slender gracefully curved matte warm-greige metal arm, matte off-white dome shade, heavy round cream marble base; the whole lamp fits in frame')],
  ['p-1006', PRODUCT('A cozy lounge armchair upholstered in cream wool boucle fabric, slightly reclined backrest, thick wide seat cushion, short light-oak legs, a folded caramel wool throw over one arm, three-quarter view')],
  ['p-1007', PRODUCT('A set of three modular 35 cm cube storage boxes with light oak-veneer panels and cream interiors, arranged in an L shape (two stacked, one beside), one holding folded linen towels, one with a small ceramic jug of dried flowers')],
  ['p-1008', PRODUCT('An ultra-slim 15 cm wide three-tier rolling storage cart in warm cream powder-coated steel with a light-wood top tray, small quiet casters, holding a few glass jars and bottles, side three-quarter view showing how narrow it is')],
  ['p-1009', PRODUCT('A compact two-seat sofa bed in warm oatmeal linen on a light-oak base, the hidden storage drawer under the seat is pulled half open revealing neatly folded blankets including one caramel wool throw, three-quarter view')],
  ['p-1010', PRODUCT('A square 60 cm light-birch pegboard mounted on a cream plaster wall section, arranged with two small wooden shelves, wooden dowels and hooks holding a ceramic cup, a key ring with a leather strap, a small trailing plant and a linen tote bag; front view')],
  // 商品詳情圖庫（橡木餐桌）
  ['detail-oak-dining', ROOM('A bright dining nook featuring a solid white-oak rectangular dining table with two bentwood chairs, a few handmade cream ceramic plates, a linen napkin and a ceramic jug of dried flowers, sheer linen curtain, soft late-afternoon light.')],
  ['detail-oak-grain', 'Photorealistic macro close-up photograph, square 1:1. The corner of a solid white-oak tabletop showing the softly rounded chamfered safety edge and fine straight natural wood grain with matte oiled finish, shallow depth of field, soft golden window light, warm cream background blur. ' + TONE],
  ['detail-oak-leg', 'Photorealistic close-up product detail photograph, square 1:1. The joint where a sturdy square solid-oak table leg meets the tabletop apron, precise woodworking joinery, natural matte finish, soft golden daylight, warm cream plaster wall and a glimpse of herringbone oak parquet behind. ' + TONE],
  // 首頁見證（買家實拍）
  ['ugc-1', CANDID('A small rented room with a flax-grey linen sofa and light-oak modular cube shelves stacked beside it, a caramel wool throw and a mug on a cube, afternoon sun through a tall window with a sheer curtain.')],
  ['ugc-2', CANDID('An entryway wall of a small apartment with a light-birch pegboard organizer holding keys, a tote bag and a small plant, and an ultra-slim cream rolling cart tucked into the narrow gap beside it, cream plaster wall and oak parquet floor.')],
  // 登入（放進橢圓浮雕框）、最終 CTA
  ['auth', 'Photorealistic interior still-life photograph, tall portrait 2:3 composition. A sunlit corner by a French window with a sheer curtain, an antique bentwood chair holding a folded caramel wool throw and a small bouquet of dried flowers in a ceramic pitcher, cream plaster wall, the subject centered with even space around it. ' + STYLE],
  ['cta', ROOM('A calm living corner with a large empty cream plaster wall on the left half of the frame, on the right a small burgundy velvet armchair beside a light oak side table holding a ceramic jug of dried flowers, late-afternoon light.')],
]

function run(prompt) {
  return new Promise((resolve) => {
    const child = spawn('codex', ['exec', '--enable', 'image_generation', '-s', 'workspace-write', '--skip-git-repo-check', `$imagegen ${prompt}`],
      { cwd: os.tmpdir(), stdio: ['ignore', 'pipe', 'pipe'] })
    const buf = []
    child.stdout.on('data', (d) => buf.push(d))
    child.stderr.on('data', (d) => buf.push(d))
    const timer = setTimeout(() => child.kill('SIGKILL'), 8 * 60 * 1000)
    child.on('close', (code) => { clearTimeout(timer); resolve({ code, log: Buffer.concat(buf).toString() }) })
  })
}

async function one([name, prompt]) {
  const out = path.join(OUT, `${name}.jpg`)
  if (!FORCE && (await fs.stat(out).catch(() => null))) return { name, ok: true, skipped: true }
  for (let attempt = 1; attempt <= 2; attempt++) {
    const { code, log } = await run(prompt)
    const sid = (log.match(/session id:\s*([0-9a-f-]{36})/) || [])[1]
    let png = null
    if (sid) {
      const dir = path.join(GEN, sid)
      const files = (await fs.readdir(dir).catch(() => [])).filter((f) => f.endsWith('.png'))
      if (files.length) png = path.join(dir, files[files.length - 1])
    }
    if (code === 0 && png) {
      const raw = path.join(RAW, `${name}.png`)
      await fs.copyFile(png, raw)
      // 橫幅／直幅 1600px、方形 1200px，JPEG 品質 80 左右
      const square = /^(p-|ugc-|detail-oak-(grain|leg))/.test(name)
      execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', square ? '78' : '80', '--resampleHeightWidthMax', square ? '1200' : '1600', raw, '--out', out], { stdio: 'ignore' })
      console.log(`[ok] ${name} (attempt ${attempt})`)
      return { name, ok: true }
    }
    console.log(`[retry] ${name} attempt ${attempt} code=${code} sid=${sid} tail=${log.slice(-300).replace(/\n/g, ' ')}`)
    if (/rate[ -]?limit|insufficient[_ -]?(quota|credit)|too many requests/i.test(log)) return { name, ok: false, reason: 'quota' }
  }
  return { name, ok: false }
}

await fs.mkdir(RAW, { recursive: true })
// hero.jpg 由同一組 STYLE 單獨產生（見 README），也可用 --only hero 重做
JOBS.unshift(['hero', ROOM('A bright, airy 16 square-meter Parisian-style studio apartment seen straight-on in a symmetrical composition: a tall French window with sheer linen curtains in the center of the upper half, an oatmeal linen two-seat sofa with one burgundy velvet cushion on the left, a light-oak platform bed with cream linen bedding and a folded caramel wool throw on the right, low modular light-oak storage cubes under the window; the lower third of the frame is calm empty herringbone oak parquet floor.')])
const queue = JOBS.filter(([name]) => !ONLY || ONLY.includes(name))
const results = []
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (queue.length) results.push(await one(queue.shift()))
}))
console.log('DONE', JSON.stringify(results.filter((r) => !r.ok)))
