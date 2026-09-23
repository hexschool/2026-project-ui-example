// ============================================================
// 產生本風格的商品照與空間情境圖（Codex CLI image_generation）
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
const OUT = path.resolve(HERE, '../public/images')
const RAW = path.join(os.tmpdir(), 'nestcraft-raw-images') // 原始 PNG（不進版控）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 4)

const STYLE = 'Japanese MUJI-inspired minimalist aesthetic: warm off-white, light natural oak wood, oatmeal and flax-grey linen, soft diffused natural daylight, calm and uncluttered with generous negative space, muted warm earthy palette, editorial catalog photography. No people, no text, no logo, no watermark, no brand marks.'
const ROOM = (desc) => `Photorealistic interior photograph, wide landscape 3:2 composition, eye-level, 35mm lens. ${desc} ${STYLE}`
const PRODUCT = (desc) => `Photorealistic studio product photograph, square 1:1 composition. ${desc}. The product is centered with generous padding on all sides, standing on a seamless warm off-white (#F3EFE8) paper backdrop with a soft natural floor shadow, gentle window light from the left. Single product only, no props unless described. ${STYLE}`
const CANDID = (desc) => `Photorealistic candid smartphone photo in square 1:1 format, as posted on Instagram by a young renter in Taipei, natural and slightly imperfect framing, warm daylight. ${desc} Muted warm earthy palette. No people visible, no text, no logo, no watermark.`

const JOBS = [
  // Shop by room
  ['room-a', ROOM('A 5-ping (16 m2) micro apartment sleeping nook in warm wood tones: low light-oak platform bed with oatmeal linen bedding, a minimalist handle-less oak nightstand with a small ceramic lamp, pale plaster wall, sheer linen curtain. Serene and pressure-free.')],
  ['room-b', ROOM('A sunlit small studio with a dual-purpose work-from-home corner: slim light-oak desk facing a window, simple wooden chair, a wall of modular oak storage cubes with baskets and books, a potted olive plant, tidy and practical.')],
  ['room-c', ROOM('A compact living-dining room in a rental shared by a young couple: a small rectangular white-oak dining table for two with two wooden chairs, a flax-grey linen two-seat sofa, a rattan-door storage cabinet, a slender arc floor lamp, jute rug. Feels spacious despite the small footprint.')],
  // Products (NestCraft catalog)
  ['p-1001', PRODUCT('A solid white-oak rectangular dining table (W160 x D80 x H75 cm) with softly rounded chamfered edges and four sturdy square solid-oak legs, natural matte oiled finish showing beautiful straight wood grain, three-quarter view')],
  ['p-1002', PRODUCT('A two-seat sofa (W180 cm) upholstered in natural flax-grey washed linen, simple clean lines, plump loose seat cushions, slim tapered light-oak legs, three-quarter view')],
  ['p-1003', PRODUCT('A storage cabinet (W80 x H110 cm) with two doors of natural hand-woven rattan cane webbing set in a solid light-oak frame, simple round wooden knobs, three-quarter view')],
  ['p-1004', PRODUCT('A handle-less minimalist bedside table (W45 x H50 cm) in light oak with one push-to-open drawer and one open shelf, recessed floating plinth base, three-quarter view')],
  ['p-1005', PRODUCT('An arc floor lamp (H180 cm) with a slender gracefully curved matte warm-greige metal arm, matte off-white dome shade, heavy round white marble base; the whole lamp fits in frame')],
  ['p-1006', PRODUCT('A cozy lounge armchair upholstered in cream faux-wool boucle fabric, slightly reclined backrest, thick wide seat cushion, short light-oak legs, three-quarter view')],
  ['p-1007', PRODUCT('A set of three modular 35 cm cube storage boxes with light oak-veneer panels and off-white interiors, arranged in an L shape (two stacked, one beside), one holding folded linen towels, one with a small potted plant')],
  ['p-1008', PRODUCT('An ultra-slim 15 cm wide three-tier rolling storage cart in warm off-white powder-coated steel with light-wood top tray, small quiet casters, holding a few glass jars and bottles, side three-quarter view showing how narrow it is')],
  ['p-1009', PRODUCT('A compact two-seat sofa bed in warm oatmeal linen on a light-oak base, the hidden storage drawer under the seat is pulled half open revealing neatly folded blankets, three-quarter view')],
  ['p-1010', PRODUCT('A square 60 cm light-birch pegboard mounted on an off-white wall section, arranged with two small wooden shelves, wooden dowels and hooks holding a ceramic cup, a key ring, a small trailing plant and a linen tote bag; front view')],
  // Product detail gallery (oak table)
  ['detail-oak-dining', ROOM('A bright dining nook featuring a solid white-oak rectangular dining table with two simple wooden chairs, a few handmade ceramic plates and a glass vase with a single branch, linen curtain, soft morning light.')],
  ['detail-oak-grain', 'Photorealistic macro close-up photograph, square 1:1. The corner of a solid white-oak tabletop showing the softly rounded chamfered safety edge and fine straight natural wood grain with matte oiled finish, shallow depth of field, soft window light, warm off-white background blur. ' + STYLE],
  ['detail-oak-leg', 'Photorealistic close-up product detail photograph, square 1:1. The joint where a sturdy square solid-oak table leg meets the tabletop apron, precise woodworking joinery, natural matte finish, soft daylight, warm off-white wall behind. ' + STYLE],
  // UGC (social proof)
  ['ugc-1', CANDID('A small rented room with a flax-grey linen sofa and light-oak modular cube shelves stacked beside it, a throw blanket and a mug on a cube, afternoon sun through the window.')],
  ['ugc-2', CANDID('An entryway wall of a small apartment with a light-birch pegboard organizer holding keys, a tote bag and a small plant, and an ultra-slim white rolling cart tucked into the narrow gap beside it.')],
  // Auth + CTA
  ['auth', 'Photorealistic interior still-life photograph, tall portrait 2:3 composition. A quiet corner: a sheer linen curtain glowing with soft daylight, a simple light-oak stool holding neatly folded oatmeal linen towels and a small ceramic vase with a green branch, pale plaster wall, lots of empty space. ' + STYLE],
  ['cta', ROOM('A wide calm living space with a large expanse of empty warm off-white plaster wall on the left half of the frame (space for text), and on the right a low light-oak bench, a linen floor cushion and a potted plant in soft afternoon light.')],
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
JOBS.unshift(['hero', ROOM('A bright, airy 16 square-meter studio apartment: low light-oak platform bed with oatmeal linen bedding, a compact two-seat flax-grey linen sofa, modular light-oak storage cubes stacked as a low shelf, sheer linen curtain with soft morning daylight, warm off-white walls, pale wooden floor.')])
const queue = JOBS.filter(([name]) => !ONLY || ONLY.includes(name))
const results = []
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (queue.length) results.push(await one(queue.shift()))
}))
console.log('DONE', JSON.stringify(results.filter((r) => !r.ok)))
