// ============================================================
// 產生 03 街頭機能風的商品照與空間情境圖（Codex CLI image_generation）
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
const RAW = path.join(os.tmpdir(), 'nestcraft-street-raw-images') // 原始 PNG（不進版控）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 4)

const STYLE = 'Urban street-utility aesthetic: raw concrete grey, deep charcoal, matte black steel, crisp hard-flash lighting with clearly defined shadows, a restrained accent of fluorescent teal-green (#2EF2B3) light, high contrast, editorial streetwear lookbook photography. No people, no text, no logo, no watermark, no brand marks.'
const ROOM = (desc) => `Photorealistic interior photograph, wide landscape 3:2 composition, eye-level, 28mm lens. ${desc} Setting: a compact urban rental with raw board-formed concrete walls, black steel window frames and industrial fixtures, cool daylight mixed with one thin fluorescent teal-green neon tube accent. ${STYLE}`
const PRODUCT = (desc) => `Photorealistic studio product photograph, square 1:1 composition. ${desc}. The product is centered with generous padding on all sides, standing on a smooth polished concrete floor against a seamless cool concrete-grey (#CFCFCB) backdrop, hard direct flash from front-left casting a crisp defined shadow, a thin fluorescent teal-green rim light on the right edge. Single product only, no props unless described. ${STYLE}`
const CANDID = (desc) => `Photorealistic candid smartphone photo in square 1:1 format, as posted on Instagram by a young renter in Taipei at night, direct phone flash, slightly imperfect framing. ${desc} Concrete grey and charcoal tones with a hint of teal-green neon. No people visible, no text, no logo, no watermark.`

const JOBS = [
  // Shop by room
  ['room-a', ROOM('A 5-ping (16 m2) micro apartment sleeping zone: a compact oatmeal linen sofa bed unfolded into bed mode, on a light-oak base with a visible pull-out storage drawer at the bottom, made up with charcoal bedding and pillows; a handle-less light-oak nightstand beside it with one drawer and an open shelf; a clip-on black work lamp.')],
  ['room-b', ROOM('A small studio with a dual-purpose work-from-home corner: slim oak desk against the concrete wall, a black steel chair, a wall of modular storage cubes with oak veneer and charcoal interiors holding books and gear boxes, a potted snake plant; in the lower-left foreground, a compact oatmeal linen sofa bed unfolded into bed mode on a light-oak base with charcoal bedding.')],
  ['room-c', ROOM('A compact living-dining room shared by a young couple: a small rectangular white-oak dining table for two with black steel chairs, a flax-grey linen two-seat sofa, a rattan-door storage cabinet, a slender black arc floor lamp, a charcoal rug.')],
  // Products (NestCraft catalog)
  ['p-1001', PRODUCT('A solid white-oak rectangular dining table (W160 x D80 x H75 cm) with softly rounded chamfered edges and four sturdy square solid-oak legs, natural matte oiled finish with straight wood grain, three-quarter view')],
  ['p-1002', PRODUCT('A two-seat sofa (W180 cm) upholstered in flax-grey washed linen, clean boxy lines, loose seat cushions, slim black steel legs, three-quarter view')],
  ['p-1003', PRODUCT('A storage cabinet (W80 x H110 cm) with two doors of natural hand-woven rattan cane webbing set in a solid oak frame, simple black metal pull knobs, three-quarter view')],
  ['p-1004', PRODUCT('A handle-less minimalist bedside table (W45 x H50 cm) in light oak with one push-to-open drawer and one open shelf, recessed black plinth base, three-quarter view')],
  ['p-1005', PRODUCT('An arc floor lamp (H180 cm) with a slender curved matte black metal arm, matte black dome shade, heavy round white marble base; the whole lamp fits in frame')],
  ['p-1006', PRODUCT('A lounge armchair upholstered in off-white faux-wool boucle fabric, slightly reclined backrest, thick wide seat cushion, short black steel legs, three-quarter view')],
  ['p-1007', PRODUCT('A set of three modular 35 cm cube storage boxes with light oak-veneer outer panels and matte charcoal interiors, arranged in an L shape (two stacked, one beside), one holding a folded black utility tote, one with a small snake plant')],
  ['p-1008', PRODUCT('An ultra-slim 15 cm wide three-tier rolling storage cart in matte charcoal powder-coated steel, small black casters, holding a few glass jars and spray bottles, side three-quarter view showing how narrow it is')],
  ['p-1009', PRODUCT('A compact two-seat sofa bed in oatmeal linen on a light-oak base, the hidden storage drawer under the seat is pulled half open revealing folded charcoal blankets, three-quarter view')],
  ['p-1010', PRODUCT('A square 60 cm birch-plywood pegboard mounted on a concrete wall section, arranged with two small plywood shelves, wooden dowels and black steel hooks holding a black mug, a key ring with a carabiner, a small trailing plant and a canvas tote bag; front view')],
  // Product detail gallery (oak table)
  ['detail-oak-dining', ROOM('A dining corner featuring a solid white-oak rectangular dining table with two black steel chairs, a few matte black ceramic plates and a glass bottle, morning light through a black-framed window.')],
  ['detail-oak-grain', 'Photorealistic macro close-up photograph, square 1:1. The corner of a solid white-oak tabletop showing the softly rounded chamfered safety edge and straight natural wood grain with matte oiled finish, hard side light with crisp shadow, blurred concrete background. ' + STYLE],
  ['detail-oak-leg', 'Photorealistic close-up product detail photograph, square 1:1. The joint where a sturdy square solid-oak table leg meets the tabletop apron, precise woodworking joinery, matte finish, hard flash, raw concrete wall behind. ' + STYLE],
  // UGC (social proof)
  ['ugc-1', CANDID('A small rented room with a flax-grey linen two-seat sofa and, right beside it, three stacked 35 cm modular storage cubes with light oak-veneer outer frames and matte charcoal interiors, holding books, a sneaker box and a small plant; a black throw blanket on the sofa.')],
  ['ugc-2', CANDID('An entryway concrete wall of a small apartment with a birch pegboard organizer holding keys, a canvas tote and a small plant, and an ultra-slim charcoal rolling cart tucked into the narrow gap beside it.')],
  // Auth + CTA
  ['auth', 'Photorealistic interior still-life photograph, tall portrait 2:3 composition. A raw concrete wall corner lit by a single vertical fluorescent teal-green neon tube, a black steel stool holding a neatly folded canvas utility bag and a pair of white sneakers, lots of empty space, crisp shadows. ' + STYLE],
  ['cta', ROOM('A wide space with a large expanse of empty raw concrete wall on the left half of the frame (space for text), and on the right a black steel modular shelving unit with oak storage cubes, a skateboard leaning on it and a potted plant.')],
  // Hero
  ['hero', ROOM('A compact 16 square-meter studio apartment: low platform bed on a black steel frame with charcoal bedding, a flax-grey linen two-seat sofa, modular oak storage cubes with charcoal interiors stacked as a low shelf, a black arc floor lamp, a small concrete side table.')],
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
