// ============================================================
// 產生 02 綠色永續生活的 23 張圖片（Codex CLI image_generation）
// 清單、檔名、比例與畫面主體照主題層的 ../IMAGES.md（三套風格共用），這裡只決定「風格」。
//
// 需求：已登入的 codex CLI（>= 0.150）、macOS sips（轉 JPEG 與縮圖）
// 用法：
//   node scripts/generate-images.mjs                                  # 產生缺少的圖片（已存在的會跳過）
//   node scripts/generate-images.mjs --only hero-canvas-bag,ugc-desk-light # 只產生指定檔名
//   node scripts/generate-images.mjs --force                          # 全部重新產生
//   CONC=1 node scripts/generate-images.mjs                           # 並行數（預設 2）
//
// 換風格時：修改 STYLE（整組圖的共同調性）與各張描述，檔名維持不變即可，不用改程式。
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
const RAW = path.join(os.tmpdir(), 'islandmake-green-raw-images') // 原始 PNG（不進版控）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 2)

// 整組圖的調性：明亮的自然光、低對比、暖綠與原木色，像在地小農或工坊的紀實攝影
const STYLE = 'Gentle sustainable-living documentary photography set in Taiwan: soft diffused natural daylight from windows (overcast morning light), airy bright exposure, low contrast, no harsh shadows, honest true-to-life colors leaning toward a calm warm-green palette: fresh young-leaf green and deep forest green accents from plants or textiles, raw natural wood and warm earth browns, unbleached cotton and recycled-paper off-whites. Matte, slightly film-like color, uncluttered composition with breathing room. No text, no readable labels or signage, no logos, no watermark, no brand marks.'
// 3:2 橫幅（顯示時裁成 16:9 或 4:3）
const WIDE = (desc) => `Photorealistic photograph, landscape 3:2 composition. Keep the main subject inside the central safe area with generous margins on all sides so the image can be cropped to 16:9 or 4:3 without cutting the subject. ${desc} ${STYLE}`
// 2:3 直幅（顯示時裁成 4:5，卡片下緣會疊文字）
const TALL = (desc) => `Photorealistic photograph, tall portrait 2:3 composition. Keep the subject in the central safe area so it can be cropped to 4:5; the lower third of the frame must be a calmer, simpler area because text will be overlaid there. ${desc} ${STYLE}`
// 1:1 方形
const SQUARE = (desc) => `Photorealistic photograph, square 1:1 composition. ${desc} ${STYLE}`
// 贊助者用手機隨手拍（UGC）：構圖不完美、生活感、沒有棚拍感
const CANDID = (desc) => `Photorealistic candid smartphone photo in square 1:1 format, as if posted by a backer in Taiwan: casual angle, slightly imperfect framing, natural available light, lived-in everyday feeling, not a studio shot. ${desc} Calm natural colors with a hint of green. No faces, no text, no readable labels, no logo, no watermark.`

const JOBS = [
  // A. 首頁 Hero／專案細節主視覺
  ['hero-canvas-bag', WIDE('Key visual for the crowdfunding project "a canvas backpack from Tainan that lasts ten years": one sturdy heavy-canvas commuter backpack (about W32 x H38 x D12 cm, about 15 liters) in undyed natural raw canvas (unbleached off-white greige), standing upright on an old worn wooden workbench; rolled-up canvas, a large spool of thick thread and a pair of fabric shears lie beside it. Background: a corner of a canvas sewing workshop with industrial sewing machines and bundled bolts of fabric, softly out of focus. The whole bag is in frame, placed slightly right of center; the left third of the frame is quieter open space.')],

  // B. 首頁分類策展（2:3）
  ['category-design-living', TALL('Tabletop still life seen from a 45-degree angle: a canvas tote bag, a plain unprinted notebook, a handmade ceramic cup and a tool with a wooden handle, all with gentle signs of daily use, on a natural oak table.')],
  ['category-hardware', TALL('A small hardware workshop: on the workbench a bare green circuit board, a soldering iron on its stand, several slim light-tube modules and pieces of aluminium extrusion; a pair of hands (hands only, no face) assembling a light module.')],
  ['category-publishing', TALL('Where print meets film: stacks of printed book page proofs, a book being sewn and bound with thread, and an old film movie camera and a film canister beside them on a wooden work table. Absolutely no readable text on any page or cover: blank pages or abstract grey blocks only.')],
  ['category-social-design', TALL('A pair of elderly hands holding a spoon with a thick, chunky easy-grip handle, eating at a home dining table; a younger person\'s hand gently steadies the bowl. Hands and table only, no faces. Warm, dignified and homely, not clinical, no hospital feeling.')],

  // C. 8 個專案的主視覺（3:2，顯示 4:3）
  ['project-01-canvas-bag', WIDE('Product photograph: three identical heavy-canvas commuter backpacks standing side by side, colors from left to right: undyed natural raw canvas (off-white greige), deep ink green, charcoal black; the thick padded shoulder straps and brass zippers are visible. All three bags fully in frame and centered, on a pale wooden floor against a plain soft light wall.')],
  ['project-02-orbitlight', WIDE('On a work desk, a modular desk lighting system: a magnetic base plus several slim, long LED light-tube modules joined end to end, forming an arc along the back edge of the desk and lighting a laptop and a notebook; the "one tube clipped onto the next" modular construction is clearly visible. Minimal matte aluminium design with no brand text; a small potted plant on the desk.')],
  ['project-03-documentary', WIDE('On the deck of a distant-water fishing vessel at sea, with wide open ocean and horizon; two or three fishermen seen from behind or far away are sorting fishing nets; in one foreground corner the matte box of a professional cinema camera is visible, suggesting filming in progress. No identifiable faces; respectful and calm, not tragic or exploitative.')],
  ['project-04-grip-cutlery', WIDE('Product photograph: a set of adaptive cutlery lying flat — a spoon, a fork and a knife, each with a thick rounded soft silicone easy-grip handle, the spoon bowl bent at an angle; a ceramic bowl beside them, on a light linen tablecloth.')],
  ['project-05-bamboo-notebook', WIDE('Two bamboo-fiber recycled-paper notebooks: one closed with a dark grey bamboo-charcoal-dyed cloth cover, one opened flat at 180 degrees showing natural unbleached off-white pages with only a few abstract handwritten pen strokes (no readable text); a fountain pen and a few short pieces of bamboo lie beside them on a wooden desk.')],
  ['project-06-island-boardgame', WIDE('Top-down view of a board game spread on a table: several hand-illustrated cards of Taiwanese native wildlife and plants (Formosan black bear, Taiwan blue magpie, Reeves\'s muntjac, ferns) in a watercolor illustration style with no text on the cards, small wooden tokens, and hexagonal habitat tiles.')],
  ['project-07-coffee-cup', WIDE('Product photograph: a reusable travel cup with a lid, its body made of pressed recycled coffee grounds with a fine speckled granular brown texture; beside it a small heap of used coffee grounds and a small pinch of soil with a few leaves, hinting that it is compostable. No text on the cup.')],
  ['project-08-street-facades', WIDE('Top-down view: a large-format book of architectural drawings opened flat; the spread shows hand-drawn line elevations of old Taiwanese shophouse facades (Japanese-era Western-style buildings with arched windows and decorative gables, tiled facades); beside it a scale ruler, technical drawing pens and a sheet of tracing paper. No readable text or numbers anywhere on the drawings.')],

  // D. 專案故事內文配圖與圖庫（P1 帆布包）
  ['story-canvas-mill', WIDE('Inside an old canvas weaving mill: an old shuttle loom, and beside it whole rolls of uncut heavy unbleached greige duck canvas, daylight falling from high windows; no people, or only one distant figure seen from behind.')],
  ['story-sewing-artisan', WIDE('Tight close-up framed at table height: only the hands and forearms of a veteran seamstress guiding thick canvas through an industrial sewing machine, the needle and the stitch line clearly visible; the person\'s head, face and shoulders are completely outside the frame. In one corner a small woven fabric label sewn onto the canvas showing only abstract marks (no readable numbers or letters).')],
  ['story-fabric-colors', WIDE('Three rolls of heavy canvas fabric side by side — undyed natural off-white greige, deep ink green and charcoal black — with the edges rolled back to show the thickness and weave texture.')],
  ['story-bag-details', WIDE('Macro close-up of canvas backpack details in one frame: a brass zipper pull with a matte oxidized patina, the stitching and the padding thickness of a thick padded shoulder strap, and the double-layer reinforced canvas at the bag bottom.')],

  // E. 提案者
  ['proposer-avatar', SQUARE('Head-and-shoulders portrait of a fictional Taiwanese young craft entrepreneur, about 30 years old, wearing a canvas work apron over a work shirt, in a canvas sewing factory. The face is exactly in the center of the square frame and fills about the middle third of the image (the photo will be cropped to a small circle, so the face must stay centered and large enough), friendly and calm expression, background softly blurred with sewing machines and bolts of fabric.')],
  ['proposer-workshop', WIDE('Wide view of a canvas sewing workshop: a row of several industrial sewing machines, bundled canvas bolts, a cutting table and half-finished bags hanging up; two or three seamstresses seen from behind, working.')],

  // F. 贊助者實拍（UGC）
  ['ugc-canvas-bag', CANDID('Snapped while commuting: a deep ink-green canvas backpack set down on a metro seat, the top open with a laptop and a water bottle peeking out; the canvas shows it has been used for a while.')],
  ['ugc-desk-light', CANDID('A home desk setup in the evening: a modular desk light (a magnetic base with slim LED tube modules joined end to end in an arc) lighting a keyboard, a monitor and a potted plant; warm indoor evening light, casual phone-camera angle.')],

  // G. 生產排程的進度更新照片
  ['update-color-samples', WIDE('On a factory workbench, three mass-production sample canvas backpacks side by side (undyed natural off-white, deep ink green, charcoal black), with color swatch cards, fabric samples and a tape measure beside them; it looks like an internal quality-check photo taken in the factory.')],
  ['update-fabric-rolls', WIDE('A factory storeroom with dozens of large rolls of canvas fabric stacked on wooden pallets and a hand trolley beside them; it looks like a progress photo the maker took on a phone, not a studio shot.')],
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
      // 3:2 → 1600×1066、2:3 → 1066×1600（品質 80）；1:1 → 1200×1200（品質 78）
      const square = /^(proposer-avatar|ugc-)/.test(name)
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
await fs.mkdir(OUT, { recursive: true })
const queue = JOBS.filter(([name]) => !ONLY || ONLY.includes(name))
const results = []
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (queue.length) results.push(await one(queue.shift()))
}))
console.log('DONE', JSON.stringify(results.filter((r) => !r.ok)))
