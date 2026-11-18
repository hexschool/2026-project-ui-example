// ============================================================
// 產生 06 平價快時尚的商品照與空間情境圖（Codex CLI image_generation）
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
const RAW = path.join(os.tmpdir(), 'nestcraft-fastfashion-raw-images') // 原始 PNG（不進版控）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 4)

const STYLE = 'Bold fast-fashion campaign aesthetic: crisp bright white spaces with punchy color-blocking, exactly one saturated electric-yellow (#FFE500) element per scene (a painted accent wall panel, a yellow storage box or a yellow throw), pure black metal details, hard frontal flash with clean crisp short shadows, high contrast and saturated, energetic and uncluttered commercial e-commerce catalog photography. No people, no text, no logo, no watermark, no brand marks, no price tags, no signage.'
// 商品照不放黃色：黃色留給介面（價格吊牌、按鈕、倒數條）
const PRODUCT_STYLE = 'Bold fast-fashion e-commerce catalog photography: crisp, high contrast, saturated true-to-material colours, clean and uncluttered. No people, no text, no logo, no watermark, no brand marks, no price tags, no signage, no yellow anywhere.'
// 首頁空間靈感會把 3:2 裁成 4:5（只留中間約一半寬），主要家具集中在畫面中段
// 黃色元素由各張 prompt 自己指定（牆面色塊、收納盒或毯子擇一），外框只描述白牆租屋，避免和 prompt 指定的黃色疊成兩個
const ROOM = (desc) => `Photorealistic interior photograph, wide landscape 3:2 composition, eye-level, 28mm lens, straight-on frontal composition. ${desc} Setting: a compact white-walled rental, black metal fixtures, hard on-camera flash look. ${STYLE}`
const PRODUCT = (desc) => `Photorealistic studio product photograph, square 1:1 composition. ${desc}. The product is centered with generous padding on all sides, on a seamless very light grey (#F2F2F2) backdrop and floor, bright even high-key studio light with a hard flash from the front creating a crisp short shadow under the product, product colours true to its materials, no yellow on the product itself. Single product only, no props unless described. ${PRODUCT_STYLE}`
const DETAIL = (desc) => `Photorealistic close-up product detail photograph, square 1:1. ${desc} Seamless very light grey (#F2F2F2) background, hard frontal flash with a crisp short shadow, true-to-material colours. ${PRODUCT_STYLE}`
const CANDID = (desc) => `Photorealistic candid smartphone photo in square 1:1 format, as posted on Instagram by a young renter in Taipei, direct phone flash, slightly imperfect framing, white walls with one small yellow object in view. ${desc} Bright, punchy, high contrast. No people visible, no text, no logo, no watermark.`

const JOBS = [
  // Shop by room（首頁 lookbook 卡會裁成 4:5，家具集中在畫面中間一半寬）
  ['room-a', ROOM('A 5-ping (16 m2) micro apartment sleeping zone with all key furniture grouped tightly in the central half of the frame: a compact oatmeal linen sofa bed unfolded into bed mode on a light-oak base with a visible pull-out storage drawer at the bottom, made up with crisp white bedding; directly beside it on the left a handle-less light-oak nightstand with one drawer and an open shelf, a small black metal table lamp on top. The single electric-yellow element is a tall painted rectangular color-block panel on the white wall behind the bed. Empty white floor at the far left and far right edges.')],
  ['room-b', ROOM('A small studio with a dual-purpose work-from-home corner, all key furniture grouped tightly in the central half of the frame: on the left-center a wall of modular 35 cm storage cubes with light-oak veneer and white interiors holding books, in the center a solid white-oak rectangular table used as a desk with a black metal chair and a laptop, on the right-center a compact oatmeal linen sofa bed in sofa mode on a light-oak base. The single electric-yellow element is one yellow storage box inside one of the cubes. Plain white wall and floor at the far left and far right edges.')],
  ['room-c', ROOM('A compact living-dining room shared by a young couple, all key furniture grouped tightly in the central half of the frame: in the foreground center a solid white-oak rectangular dining table with two black metal chairs; behind it, left to right, a storage cabinet with natural rattan cane doors in an oak frame, a flax-grey linen two-seat sofa and a slender black arc floor lamp arching over the sofa. The single electric-yellow element is a folded yellow throw blanket on the sofa. Every wall is plain matte white from edge to edge: no painted panel, no color-blocked wall, no colored backdrop; nothing else in the room is yellow, only the blanket.')],
  // Products (NestCraft catalog)
  ['p-1001', PRODUCT('A solid white-oak rectangular dining table (W160 x D80 x H75 cm) with softly rounded chamfered edges and four sturdy square solid-oak legs, natural matte oiled finish with straight wood grain, three-quarter view')],
  ['p-1002', PRODUCT('A two-seat sofa (W180 cm) upholstered in flax-grey washed linen, clean boxy lines, loose seat cushions, slim black steel legs, three-quarter view')],
  ['p-1003', PRODUCT('A storage cabinet (W80 x H110 cm) with two doors of natural hand-woven rattan cane webbing set in a solid oak frame, simple black metal pull knobs, three-quarter view')],
  ['p-1004', PRODUCT('A handle-less minimalist bedside table (W45 x H50 cm) in light oak with one push-to-open drawer and one open shelf, slim black metal plinth base, three-quarter view')],
  ['p-1005', PRODUCT('An arc floor lamp (H180 cm) with a slender curved matte black metal arm, matte black dome shade, heavy round white marble base; the whole lamp fits in frame')],
  ['p-1006', PRODUCT('A lounge armchair upholstered in off-white faux-wool boucle fabric, slightly reclined backrest, thick wide seat cushion, short black steel legs, three-quarter view')],
  ['p-1007', PRODUCT('A set of three modular 35 cm cube storage boxes with light oak-veneer outer panels and bright white interiors, arranged in an L shape (two stacked, one beside), one holding a folded black tote bag, one with a small snake plant')],
  ['p-1008', PRODUCT('An ultra-slim 15 cm wide three-tier rolling storage cart in matte black powder-coated steel, small black casters, holding a few clear glass jars and white spray bottles, side three-quarter view showing how narrow it is')],
  ['p-1009', PRODUCT('A compact two-seat sofa bed in oatmeal linen on a light-oak base, the hidden storage drawer under the seat is pulled half open revealing folded white blankets, three-quarter view')],
  ['p-1010', PRODUCT('A square 60 cm birch-plywood pegboard mounted on a plain white wall section, arranged with two small plywood shelves, wooden dowels and black steel hooks holding a black mug, a key ring, a small trailing plant and a white canvas tote bag; front view')],
  // Product detail gallery (oak table)
  ['detail-oak-dining', ROOM('A dining corner featuring a solid white-oak rectangular dining table in the center of the frame with two black metal chairs, a few white ceramic plates and a clear glass carafe on top. The single electric-yellow element is a large painted color-block panel on the wall behind the table.')],
  ['detail-oak-grain', DETAIL('The corner of a solid white-oak tabletop showing the softly rounded chamfered safety edge and straight natural wood grain with matte oiled finish.')],
  ['detail-oak-leg', DETAIL('The joint where a sturdy square solid-oak table leg meets the tabletop apron, precise woodworking joinery, matte oiled finish.')],
  // UGC (social proof)
  ['ugc-1', CANDID('A small rented room with a flax-grey linen two-seat sofa and, right beside it, three stacked 35 cm modular storage cubes with light oak-veneer frames and white interiors, holding books, a sneaker box and a small plant; a small yellow cushion on the sofa is the only yellow object.')],
  ['ugc-2', CANDID('An entryway white wall of a small apartment with a birch pegboard organizer holding keys, a white canvas tote and a small plant, and an ultra-slim matte black rolling cart tucked into the narrow gap beside it; a small yellow mug on the pegboard shelf is the only yellow object.')],
  // Auth + CTA
  ['auth', 'Photorealistic interior still-life photograph, tall portrait 2:3 composition. A white wall with one electric-yellow painted panel, a black steel stool holding a stack of neatly folded white towels and one yellow storage box, hard flash, the subject in the upper two-thirds and empty floor space in the lower third. ' + STYLE],
  ['cta', ROOM('A white living corner with a large empty white wall on the left, on the right a black metal shelf with a yellow storage box and a light grey sofa, hard flash, high contrast.')],
  // Hero（首頁右半版，會裁成接近方形：家具集中在中間，左下角留給圖說）
  ['hero', ROOM('A bright compact 16 square-meter studio apartment seen straight-on, all furniture arranged in the central part of the frame: a low platform bed with crisp white bedding on the left-center, a flax-grey linen two-seat sofa in the center, modular light-oak storage cubes stacked as a low shelf on the right-center, a slender black arc floor lamp. The single electric-yellow element is a large painted color-block panel on the back wall behind the sofa. Plain white floor in the lower-left corner.')],
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
