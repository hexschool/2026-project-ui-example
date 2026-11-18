// ============================================================
// 產生 06 童話玩具工場的 23 張圖片（Codex CLI image_generation）
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
const RAW = path.join(os.tmpdir(), 'islandmake-toy-factory-raw-images') // 原始 PNG（不進版控）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 2)

// 整組圖的調性：明亮柔和的高調攝影、手作玩具工坊的氣氛；粉彩只在背景紙與少量道具，產品維持原本的顏色
const STYLE = 'Soft, cheerful high-key photography with a handmade toy-workshop mood. Bright diffused daylight, warm-neutral 4800-5200K, gentle round shadows, airy and clean. Pastel-forward overall (cherry-blossom pink, macaron lilac, lemon yellow), but products keep their true colors (raw undyed canvas, deep ink green, charcoal). No cartoon or 3D-render look, no characters or mascots, no human faces unless the prompt asks for a portrait, no text, no readable labels, no logos, no watermarks.'
// 產品照：粉彩無縫背景紙＋邊緣少量木頭積木與小木球（不碰到、不遮住產品）
const PROPS = (paper) => `Product still life on a seamless paper backdrop in pastel ${paper}; a few small natural wooden toy blocks and smooth colored wooden balls (cherry-blossom pink, macaron lilac, lemon yellow) sit near the edges of the frame as props, never covering or touching the product.`
// 粉彩背景紙、不放玩具道具
const PAPER = (paper) => `Shot on a seamless paper backdrop in pastel ${paper}, no toys or props.`
// 紀實場景：不放任何玩具道具、花瓶或擺飾，不刻意粉彩（覆蓋 STYLE 的粉彩基調），只用柔和偏暖的光，真實而有尊嚴
const REAL = 'Documentary scene, real and respectful. This overrides the pastel-forward note below: no toy props, no flowers, no vases, no decorative styling props and no artificial pastel styling at all, only items that belong in the place; soft, slightly warm diffused light; any pastel color only where it naturally occurs (a pink thread spool, a lilac fabric bin).'
// 3:2 橫幅（顯示時裁成 16:9 或 4:3）
const WIDE = (desc, mood) => `Photorealistic photograph, landscape 3:2 composition. Keep the main subject inside the central safe area with generous margins on all sides so the image can be cropped to 16:9 or 4:3 without cutting the subject. ${desc} ${mood} ${STYLE}`
// 2:3 直幅（顯示時裁成 4:5）
const TALL = (desc, mood) => `Photorealistic photograph, tall portrait 2:3 composition. Keep the subject in the central safe area so it can be cropped to 4:5; keep the lower third of the frame calm and simple. ${desc} ${mood} ${STYLE}`
// 1:1 方形
const SQUARE = (desc, mood) => `Photorealistic photograph, square 1:1 composition. ${desc} ${mood} ${STYLE}`
// 贊助者用手機隨手拍（UGC）：構圖不完美、生活感、沒有棚拍感
const CANDID = (desc) => `Photorealistic candid smartphone photo in square 1:1 format, as if posted by a backer in Taiwan: casual angle, slightly imperfect framing, natural available light, lived-in everyday feeling, not a studio shot, no toy props. ${desc} Soft bright colors with a gentle warm pastel feel. No faces, no text, no readable labels, no logo, no watermark.`

// P1 帆布包的款式：每張帆布包的圖都用同一個描述，看得出是同一組（和 project-01 一致）
const BAG = 'a rounded zip-top canvas commuter backpack with a brass two-way zipper along the top, a front zip pocket with a brass zipper pull, side slip pockets and thick padded shoulder straps in the same canvas (no flap, no buckles, no leather trim)'

const JOBS = [
  // A. 首頁 Hero／專案細節主視覺（P1 帆布包這一組都用櫻花粉背景紙）
  ['hero-canvas-bag', WIDE(`Key visual for the crowdfunding project "a canvas backpack from Tainan that lasts ten years": one sturdy heavy-canvas commuter backpack (about W32 x H38 x D12 cm, about 15 liters) in undyed natural raw canvas (unbleached off-white greige), ${BAG}, standing upright on an old worn wooden workbench; rolled-up canvas, a large spool of thick thread and a pair of fabric shears lie beside it. Behind the workbench hangs a sweep of pastel cherry-blossom pink seamless paper, and further back a corner of a canvas sewing workshop (industrial sewing machines, bundled bolts of fabric) is softly out of focus. The whole bag is in frame, placed slightly right of center; the left third is quieter open space.`, 'A few small natural wooden toy blocks and one lilac wooden ball sit at the far edges of the workbench as props, never touching the bag.')],

  // B. 首頁分類策展（2:3）
  ['category-design-living', TALL('Tabletop still life seen from a 45-degree angle: a canvas tote bag, a plain unprinted notebook, a handmade ceramic cup and a tool with a wooden handle, all with gentle signs of daily use, on a pale wooden table.', PROPS('cherry-blossom pink'))],
  ['category-hardware', TALL('A small hardware workbench: a bare circuit board, a soldering iron on its stand, several slim light-tube modules and pieces of aluminium extrusion; a pair of hands (hands only, no face) assembling a light module.', PROPS('macaron lilac'))],
  ['category-publishing', TALL('Where print meets film: stacks of printed book page proofs, a book being sewn and bound with thread, and an old film movie camera and a film canister beside them on a light wooden table. Absolutely no readable text on any page or cover: blank pages or abstract soft grey blocks only.', PAPER('lemon yellow'))],
  ['category-social-design', TALL('A pair of elderly hands holding a spoon with a thick, chunky easy-grip handle, eating at a home dining table; a younger person\'s hand gently steadies the bowl. Hands and table only, no faces. Warm, dignified and homely, not clinical, no hospital feeling.', REAL)],

  // C. 8 個專案的主視覺（3:2，顯示 4:3）
  ['project-01-canvas-bag', WIDE(`Product photograph: three identical heavy-canvas commuter backpacks (${BAG}) standing side by side, colors from left to right: undyed natural raw canvas (off-white greige), deep ink green, charcoal black; the thick padded shoulder straps and brass zippers are visible. All three bags fully in frame and centered.`, PROPS('cherry-blossom pink'))],
  ['project-02-orbitlight', WIDE('A modular desk lighting system on a small white desk: a magnetic base plus several slim, long LED light-tube modules joined end to end, forming an arc along the back edge of the desk and lighting a laptop and a notebook; the "one tube clipped onto the next" modular construction is clearly visible. Minimal matte aluminium design with no brand text.', PROPS('macaron lilac'))],
  ['project-03-documentary', WIDE('On the deck of a distant-water fishing vessel at sea, with wide open ocean and horizon; two or three fishermen seen from behind or far away are sorting fishing nets; in one foreground corner the matte box of a professional cinema camera is visible, suggesting filming in progress. No identifiable faces; calm and respectful, not tragic or exploitative.', REAL)],
  ['project-04-grip-cutlery', WIDE('Product photograph: a set of adaptive cutlery lying flat, a spoon, a fork and a knife, each with a thick rounded soft silicone easy-grip handle, the spoon bowl bent at an angle; a ceramic bowl beside them.', PROPS('lemon yellow'))],
  ['project-05-bamboo-notebook', WIDE('Two bamboo-fiber recycled-paper notebooks: one closed with a dark grey bamboo-charcoal-dyed cloth cover, one opened flat at 180 degrees showing natural unbleached off-white pages with only a few abstract handwritten pen strokes (no readable text); a fountain pen and a few short pieces of bamboo lie beside them.', PROPS('cherry-blossom pink'))],
  ['project-06-island-boardgame', WIDE('Top-down view of a board game spread out: several hand-illustrated cards of Taiwanese native wildlife and plants (Formosan black bear, Taiwan blue magpie, Reeves\'s muntjac, ferns) in a watercolor illustration style with no text on the cards, small wooden tokens, and hexagonal habitat tiles.', PROPS('macaron lilac'))],
  ['project-07-coffee-cup', WIDE('Product photograph: a reusable travel cup with a lid, its body made of pressed recycled coffee grounds with a fine speckled granular brown texture; beside it a small heap of used coffee grounds and a small pinch of soil with a few leaves, hinting that it is compostable. No text on the cup.', PROPS('lemon yellow'))],
  ['project-08-street-facades', WIDE('Top-down view: a large-format book of architectural drawings opened flat; the spread shows hand-drawn line elevations of old Taiwanese shophouse facades (Japanese-era Western-style buildings with arched windows and decorative gables, tiled facades); beside it a scale ruler, technical drawing pens and a sheet of tracing paper. No readable text or numbers anywhere on the drawings.', PAPER('peach'))],

  // D. 專案故事內文配圖與圖庫（P1 帆布包）
  ['story-canvas-mill', WIDE('Inside an old canvas weaving mill: an old shuttle loom, and beside it whole rolls of uncut heavy unbleached greige duck canvas, soft daylight falling from high windows; no people, or only one distant figure seen from behind.', REAL)],
  ['story-sewing-artisan', WIDE('Tight close-up framed at table height: only the hands and forearms of a veteran seamstress guiding thick canvas through an industrial sewing machine, the needle and the stitch line clearly visible; the person\'s head, face and shoulders are completely outside the frame. In one corner a small woven fabric label sewn onto the canvas showing only abstract marks (no readable numbers or letters). The background is a working sewing workshop with only workshop items (thread cones, fabric bolts, cutting tools, storage bins); no flowers, no vases, no decorative props.', REAL)],
  ['story-fabric-colors', WIDE('Three rolls of heavy canvas fabric side by side, undyed natural off-white greige, deep ink green and charcoal black, with the edges rolled back to show the thickness and weave texture.', PROPS('cherry-blossom pink'))],
  ['story-bag-details', WIDE(`Macro close-up of details of a raw off-white canvas backpack (${BAG}) in one frame: a brass zipper pull with a matte oxidized patina, the stitching and the padding thickness of a thick padded shoulder strap, and the double-layer reinforced canvas at the bag bottom.`, 'Soft pastel cherry-blossom pink paper backdrop behind; one small wooden toy block and one lilac wooden ball at the very edge of the frame, never touching the bag.')],

  // E. 提案者
  ['proposer-avatar', SQUARE('Head-and-shoulders portrait of a fictional Taiwanese young craft entrepreneur, about 30 years old, wearing a canvas work apron over a work shirt, in a bright canvas sewing workshop. The face is exactly in the center of the square frame and fills about the middle third of the image (the photo will be cropped to a small circle, so the face must stay centered and large enough), friendly and calm smile, background softly blurred with sewing machines and bolts of fabric, a hint of soft pink in the background.', 'This is the only photo in the set that shows a face; natural skin tones, no toy props.')],
  ['proposer-workshop', WIDE('Wide view of a canvas sewing workshop in Tainan: a row of several industrial sewing machines, bundled canvas bolts, a cutting table and half-finished bags hanging up; two or three seamstresses seen from behind, working.', REAL)],

  // F. 贊助者實拍（UGC）
  ['ugc-canvas-bag', CANDID(`Snapped while commuting: a deep ink-green canvas backpack (${BAG}) set down on a metro seat, the top open with a laptop and a water bottle peeking out; the canvas shows it has been used for a while.`)],
  ['ugc-desk-light', CANDID('A home desk setup in the evening: a modular desk light (a magnetic base with slim LED tube modules joined end to end in an arc) lighting a keyboard, a monitor and a potted plant; warm indoor evening light, casual phone-camera angle.')],

  // G. 生產排程的進度更新照片
  ['update-color-samples', WIDE(`On a factory workbench, three mass-production sample canvas backpacks (${BAG}) side by side (undyed natural off-white, deep ink green, charcoal black), with color swatch cards, fabric samples and a tape measure beside them; it looks like an internal quality-check photo taken in the factory.`, 'A couple of small wooden toy blocks and a pink wooden ball sit at one edge of the workbench as props, never touching the bags; soft pastel pink sheet of paper under the swatches.')],
  ['update-fabric-rolls', WIDE('A factory storeroom with dozens of large rolls of canvas fabric stacked on wooden pallets and a hand trolley beside them; it looks like a progress photo the maker took on a phone, not a studio shot.', REAL)],
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
