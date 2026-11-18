// ============================================================
// 產生本風格的商品照與空間情境圖（Codex CLI image_generation）
//
// 需求：已登入的 codex CLI（>= 0.150）、macOS sips（轉 JPEG 與縮圖）
// 用法：
//   node scripts/generate-images.mjs                 # 產生缺少的圖片（已存在的會跳過）
//   node scripts/generate-images.mjs --only hero,cta # 只產生指定檔名
//   node scripts/generate-images.mjs --force         # 全部重新產生
//   CONC=2 node scripts/generate-images.mjs          # 並行數（預設 1，避免撞到額度上限）
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
const RAW = path.join(os.tmpdir(), 'nestcraft-organic-raw-images') // 原始 PNG（不進版控）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 1)

// 05 親和無毒風：像採光很好的有機蔬果鋪，純白牆、淡薄荷、鼠尾草灰的棉麻、淺樺木，很多新鮮綠植，冷調的晨光
const STYLE = 'Fresh, clean and non-toxic natural living aesthetic: pure white and very pale mint-tinted walls, sage-grey linen and cotton textiles, pale birch or ash wood, plenty of fresh green houseplants and potted herbs (pothos, a small olive tree, basil and mint in terracotta-free white pots), bright airy cool daylight (around 5500K) with soft diffused shadows, crisp and hygienic like a sunlit organic grocery, light and breathable composition with generous white space. No people, no text, no logo, no watermark, no brand marks.'
const ROOM = (desc) => `Photorealistic interior photograph, wide landscape 3:2 composition, eye-level, 35mm lens. ${desc} Setting: a bright small rental with pure white walls, a pale mint accent, pale birch floors, sheer white curtains and several fresh green plants. ${STYLE}`
const PRODUCT = (desc) => `Photorealistic studio product photograph, square 1:1 composition. ${desc}. The product is centered with generous padding on all sides, on a seamless pure white backdrop that fades into a very pale mint (#EAF6EF) floor, soft diffused overhead daylight, a very soft short contact shadow, high-key but not overexposed, the product keeps its natural material colours. Single product only, no props unless described. No people, no text, no logo, no watermark, no brand marks.`
const CANDID = (desc) => `Photorealistic candid smartphone photo in square 1:1 format, as posted on Instagram by a young renter in Taipei, natural and slightly imperfect framing. ${desc} Bright morning daylight, fresh green plants visible, clean white walls, soft sage and mint tones. No people visible, no text, no logo, no watermark.`

const JOBS = [
  // 空間靈感（3 個情境）
  ['room-a', ROOM('A 5-ping (16 m2) micro apartment sleeping nook: a compact sage-grey linen sofa bed unfolded into bed mode in the centre-right, made up with crisp white and pale mint linen bedding, a minimalist handle-less pale-ash nightstand on the left side of the bed with a small white ceramic lamp, a trailing pothos on a wall shelf, a potted olive tree by the window. Calm, fresh and pressure-free.')],
  ['room-b', ROOM('A sunlit small studio with a dual-purpose work-from-home corner: on the left a wall of modular pale-birch storage cubes holding books, white baskets and potted herbs; in the centre a pale white-oak table used as a desk facing the window with a simple chair; on the right a compact sage-grey linen sofa bed. Tidy and practical.')],
  ['room-c', ROOM('A compact living-dining room in a rental shared by a young couple: on the left a small rectangular pale white-oak dining table with two chairs, behind it a storage cabinet with natural rattan cane doors, on the right a sage-grey linen two-seat sofa and a slender white arc floor lamp leaning over it, a large green monstera. Feels spacious despite the small footprint.')],
  // 商品（NestCraft 10 件）
  ['p-1001', PRODUCT('A solid pale white-oak rectangular dining table (W160 x D80 x H75 cm) with softly rounded chamfered edges and four sturdy square solid-oak legs, natural matte oiled finish showing light straight wood grain, three-quarter view')],
  ['p-1002', PRODUCT('A two-seat sofa (W180 cm) upholstered in soft sage-grey washed linen, simple clean lines, plump loose seat cushions, slim tapered pale-ash legs, three-quarter view')],
  ['p-1003', PRODUCT('A storage cabinet (W80 x H110 cm) with two doors of natural hand-woven rattan cane webbing set in a pale birch frame, simple round wooden knobs, three-quarter view')],
  ['p-1004', PRODUCT('A handle-less minimalist bedside table (W45 x H50 cm) in pale ash wood with one push-to-open drawer and one open shelf holding a small potted mint plant, recessed floating plinth base, three-quarter view')],
  ['p-1005', PRODUCT('An arc floor lamp (H180 cm) with a slender gracefully curved matte white metal arm, matte white dome shade, heavy round pale-grey stone base; the whole lamp fits in frame')],
  ['p-1006', PRODUCT('A cozy lounge armchair upholstered in soft off-white wool boucle fabric with a folded sage-green throw over one arm, slightly reclined backrest, thick wide seat cushion, short pale-ash legs, three-quarter view')],
  ['p-1007', PRODUCT('A set of three modular 35 cm cube storage boxes with pale birch-veneer panels and white interiors, arranged in an L shape (two stacked, one beside), one holding folded sage linen towels, one with a small potted basil plant')],
  ['p-1008', PRODUCT('An ultra-slim 15 cm wide three-tier rolling storage cart in pure white powder-coated steel with a pale birch top tray, small quiet casters, holding a few glass jars of herbs and a small plant, side three-quarter view showing how narrow it is')],
  ['p-1009', PRODUCT('A compact two-seat sofa bed in sage-grey linen on a pale birch base, the hidden storage drawer under the seat is pulled half open revealing neatly folded white and mint blankets, three-quarter view')],
  ['p-1010', PRODUCT('A square 60 cm pale birch pegboard mounted on a white wall section, arranged with two small wooden shelves, wooden dowels and hooks holding a white ceramic cup, a key ring, a small trailing pothos and a sage linen tote bag; front view')],
  // 商品詳情圖庫（橡木餐桌）
  ['detail-oak-dining', ROOM('A bright dining nook featuring a solid pale white-oak rectangular dining table with two simple chairs, a glass carafe of water, a bowl of green apples and a small pot of fresh basil, sheer white curtain, soft morning light.')],
  ['detail-oak-grain', 'Photorealistic macro close-up photograph, square 1:1. The corner of a solid pale white-oak tabletop showing the softly rounded chamfered safety edge and fine straight natural wood grain with matte oiled finish, a sprig of fresh mint resting on it, shallow depth of field, soft cool daylight, pure white and pale mint background blur. ' + STYLE],
  ['detail-oak-leg', 'Photorealistic close-up product detail photograph, square 1:1. The joint where a sturdy square solid pale-oak table leg meets the tabletop apron, precise woodworking joinery, natural matte finish, soft cool daylight, pure white wall and a green plant leaf softly out of focus behind. ' + STYLE],
  // 室友見證（買家實拍）
  ['ugc-1', CANDID('A small rented room with a sage-grey linen sofa and pale birch modular cube shelves stacked beside it, a white throw blanket and a mug on a cube, a pothos on top of the cubes.')],
  ['ugc-2', CANDID('An entryway wall of a small apartment with a pale birch pegboard organizer holding keys, a tote bag and a small plant, and an ultra-slim white rolling cart tucked into the narrow gap beside it.')],
  // 登入、最終 CTA
  ['auth', 'Photorealistic interior still-life photograph, tall portrait 2:3 composition. A bright white corner with a pale birch stool holding folded sage-grey linen towels and a glass jar of fresh mint, a pothos trailing from a shelf above, soft cool daylight, lots of white space. ' + STYLE],
  ['cta', ROOM('A fresh white living corner with a large empty pale wall on the left half of the frame (space for text), on the right a sage linen floor cushion, a pale birch bench and a tall green plant in soft morning light.')],
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
JOBS.unshift(['hero', ROOM('A bright, airy 16 square-meter studio apartment: a low pale-oak platform bed with white and sage-grey linen bedding on the left, a compact sage-grey linen two-seat sofa in the centre, modular pale-birch storage cubes stacked as a low shelf with potted herbs, a tall green plant by the window, sheer white curtains glowing with cool morning daylight.')])
const queue = JOBS.filter(([name]) => !ONLY || ONLY.includes(name))
const results = []
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (queue.length) results.push(await one(queue.shift()))
}))
console.log('DONE', JSON.stringify(results.filter((r) => !r.ok)))
