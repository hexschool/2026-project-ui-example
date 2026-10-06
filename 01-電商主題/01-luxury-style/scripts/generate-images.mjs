// ============================================================
// 產生 01 輕奢高定風的商品照與空間情境圖（Codex CLI image_generation）
//
// 需求：已登入的 codex CLI（>= 0.150）、macOS sips（轉 JPEG 與縮圖）
// 用法：
//   node scripts/generate-images.mjs                 # 產生缺少的圖片（已存在的會跳過）
//   node scripts/generate-images.mjs --only hero,cta # 只產生指定檔名
//   node scripts/generate-images.mjs --force         # 全部重新產生
//   CONC=2 node scripts/generate-images.mjs          # 並行數（預設 4）
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
const RAW = path.join(os.tmpdir(), 'nestcraft-luxury-raw-images') // 原始 PNG（不進版控）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 4)

const STYLE = 'Quiet-luxury boutique hotel aesthetic at dusk: deep warm obsidian-black and smoked-walnut shadows, low-key warm lighting from concealed spotlights and lamps creating soft pools of golden light, restrained brushed champagne-gold and brass details, ivory and warm-white textiles, rich but calm, editorial luxury interior magazine photography with deep blacks and soft highlights. No people, no text, no logo, no watermark, no brand marks.'
const ROOM = (desc) => `Photorealistic interior photograph, wide landscape 3:2 composition, eye-level, 35mm lens. ${desc} Setting: a small but refined rental apartment styled like a boutique hotel suite in the evening, dark warm-charcoal plaster walls, smoked oak floor, warm lamp light and one soft overhead spotlight. ${STYLE}`
const PRODUCT = (desc) => `Photorealistic studio product photograph, square 1:1 composition. ${desc}. The product is centered with generous padding on all sides, standing on a seamless deep warm charcoal-brown (#1E1A15) backdrop and floor, lit like a gallery exhibit by a single soft overhead spotlight that makes a gentle oval pool of warm light on the floor, subtle champagne-gold rim light along the edges, the background falling off softly into near-black at the corners. The product must be clearly visible and well exposed. Single product only, no props unless described. ${STYLE}`
const CANDID = (desc) => `Photorealistic candid smartphone photo in square 1:1 format, as posted on Instagram by a young renter in Taipei in the evening, warm lamp light, slightly imperfect framing. ${desc} Warm dark tones with ivory and champagne-gold accents. No people visible, no text, no logo, no watermark.`

const JOBS = [
  // 首頁 Hero
  ['hero', ROOM('A compact 16 square-meter studio apartment styled like a boutique hotel suite: on the left a low platform bed with ivory linen bedding and a handle-less oak nightstand with a small brass table lamp glowing, in the center a compact ivory linen two-seat sofa with a round dark-marble side table, on the right modular oak storage cubes with deep charcoal interiors stacked as a low shelf; a slender brushed-champagne arc floor lamp casting a warm pool of light.')],
  // 空間情境（熱點位置以這三張圖為準，換圖後要重新校正 index.html 的熱點 left／top）
  ['room-a', ROOM('A 5-ping (16 m2) micro apartment sleeping zone. On the LEFT third of the frame, in the foreground: a handle-less light-oak nightstand with one drawer and an open shelf, a small brass lamp glowing on top. In the CENTER-RIGHT: a compact ivory linen sofa bed unfolded into bed mode on a light-oak base with a visible pull-out storage drawer at the bottom, made up with ivory and charcoal bedding and pillows. A framed abstract artwork lit by a picture light above the bed.')],
  ['room-b', ROOM('A small studio with a dual-purpose work-from-home corner. On the LEFT: a wall of modular 35 cm storage cubes with oak veneer and deep charcoal interiors holding books and a brass object. On the RIGHT: a solid white-oak rectangular table used as a desk against the wall with a dark leather chair and a brass desk lamp glowing. In the lower-RIGHT foreground: the edge of a compact ivory linen sofa bed unfolded into bed mode on a light-oak base.')],
  ['room-c', ROOM('A compact living-dining room shared by a young couple. LEFT foreground: a small rectangular white-oak dining table for two with dark upholstered chairs and a single candle. CENTER-LEFT against the back wall: a storage cabinet with hand-woven rattan cane doors in a solid wood frame with small brass knobs. CENTER-RIGHT: a flax-grey linen two-seat sofa with ivory cushions. Behind the sofa on the RIGHT: a slender brushed-champagne arc floor lamp whose dome shade hangs high in the upper part of the frame, glowing warmly.')],
  // 商品（Notion 10 件，材質要與商品說明一致）
  ['p-1001', PRODUCT('A solid white-oak rectangular dining table (W160 x D80 x H75 cm) with softly rounded chamfered edges and four sturdy square solid-oak legs, natural matte oiled finish with straight wood grain glowing in the spotlight, three-quarter view')],
  ['p-1002', PRODUCT('A two-seat sofa (W180 cm) upholstered in natural flax-grey washed linen, clean tailored lines, loose seat cushions, slim tapered solid-wood legs in smoked oak, three-quarter view')],
  ['p-1003', PRODUCT('A storage cabinet (W80 x H110 cm) with two doors of natural hand-woven rattan cane webbing set in a solid wood frame stained warm walnut, small round brushed-brass knobs, three-quarter view')],
  ['p-1004', PRODUCT('A handle-less minimalist bedside table (W45 x H50 cm) in light oak veneer with one push-to-open drawer and one open shelf, recessed plinth base, three-quarter view')],
  ['p-1005', PRODUCT('An arc floor lamp (H180 cm) with a slender curved arm in matte brushed champagne-gold metal, a matte champagne dome shade glowing softly, a heavy round white Carrara marble base; the whole lamp fits in frame')],
  ['p-1006', PRODUCT('A lounge armchair upholstered in ivory faux-wool boucle fabric, slightly reclined backrest, thick wide seat cushion, short solid-wood legs in smoked oak, three-quarter view')],
  ['p-1007', PRODUCT('A set of three modular 35 cm cube storage boxes with light oak-veneer outer panels and deep charcoal interiors, arranged in an L shape (two stacked, one beside), one holding folded ivory towels, one with a small brass candle holder')],
  ['p-1008', PRODUCT('An ultra-slim 15 cm wide three-tier rolling storage cart in matte warm-black powder-coated steel with fine brushed-champagne edge trims, small quiet casters, holding a few amber glass bottles and jars, side three-quarter view showing how narrow it is')],
  ['p-1009', PRODUCT('A compact two-seat sofa bed in ivory linen-blend fabric on a solid light-oak base, the hidden storage drawer under the seat is pulled half open revealing neatly folded charcoal and ivory blankets, three-quarter view')],
  ['p-1010', PRODUCT('A square 60 cm birch-plywood pegboard mounted on a dark charcoal wall section, arranged with two small birch shelves, wooden dowels and brushed-brass hooks holding a ceramic cup, a key ring, a small trailing plant and an ivory canvas tote bag; front view')],
  // 商品詳情圖庫（橡木餐桌）
  ['detail-oak-dining', ROOM('An intimate evening dining corner featuring a solid white-oak rectangular dining table with two dark upholstered dining chairs, ivory ceramic plates, two wine glasses and a brass candle holder, a pendant lamp casting a warm pool of light on the table.')],
  ['detail-oak-grain', 'Photorealistic macro close-up photograph, square 1:1. The corner of a solid white-oak tabletop showing the softly rounded chamfered safety edge and fine straight natural wood grain with matte oiled finish, raking warm spotlight from the side, the background falling into deep warm black. ' + STYLE],
  ['detail-oak-leg', 'Photorealistic close-up product detail photograph, square 1:1. The joint where a sturdy square solid-oak table leg meets the tabletop apron, precise woodworking joinery, natural matte finish, warm spotlight, deep warm charcoal wall behind. ' + STYLE],
  // 室友見證（UGC）
  ['ugc-1', CANDID('A small rented room in the evening with a flax-grey linen two-seat sofa and, right beside it, three stacked 35 cm modular storage cubes with light oak-veneer outer frames and deep charcoal interiors holding books and a small plant; a warm table lamp glowing, an ivory throw on the sofa.')],
  ['ugc-2', CANDID('An entryway of a small apartment at night: a dark charcoal wall with a birch pegboard organizer holding keys on brass hooks, a canvas tote and a small plant, and an ultra-slim matte black rolling cart tucked into the narrow gap beside it, lit by a warm wall sconce.')],
  // 登入／註冊、底部 CTA
  ['auth', 'Photorealistic interior still-life photograph, tall portrait 2:3 composition. A quiet dark corner of a boutique hotel suite: a warm charcoal plaster wall washed by a single soft spotlight from above, a small solid-oak stool holding neatly folded ivory linen towels and a brass key on a leather tag, a sliver of sheer curtain catching lamp light, lots of empty dark space. ' + STYLE],
  ['cta', ROOM('A wide calm living space in the evening: the LEFT half of the frame is a large expanse of empty, softly lit warm charcoal plaster wall (space for text), and on the RIGHT a low solid-oak bench with an ivory linen cushion, a brushed-brass table lamp glowing and a potted olive tree catching the warm light.')],
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
const queue = JOBS.filter(([name]) => !ONLY || ONLY.includes(name))
const results = []
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (queue.length) results.push(await one(queue.shift()))
}))
console.log('DONE', JSON.stringify(results.filter((r) => !r.ok)))
