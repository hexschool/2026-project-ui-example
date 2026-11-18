// ============================================================
// 產生 05 現代商務創新的 23 張圖片（Codex CLI image_generation）
// 清單、檔名、比例與畫面主體照主題層的 ../IMAGES.md，三套風格檔名相同
//
// 需求：已登入的 codex CLI（>= 0.150）、macOS sips（轉 JPEG 與縮圖）
// 用法：
//   node scripts/generate-images.mjs                          # 產生缺少的圖片（已存在的會跳過）
//   node scripts/generate-images.mjs --only hero-canvas-bag   # 只產生指定檔名（逗號分隔，不含 .jpg）
//   node scripts/generate-images.mjs --force                  # 全部重新產生
//   CONC=1 node scripts/generate-images.mjs                   # 並行數（預設 2）
//
// 換風格時：修改 STYLE（整組圖的共同調性）與各張 prompt，檔名維持不變即可，不用改程式。
// 參考圖：JOBS 每列的第 3 欄可以填 images/ 裡的檔名，會用 codex exec -i 附上，讓同一款商品的外型一致
//         （例如帆布包的細節照、色樣照、贊助者實拍都以 project-01-canvas-bag.jpg 為準）。
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
const RAW = path.join(os.tmpdir(), 'islandmake-business-raw-images') // 原始 PNG（不進版控）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 2)

// 整組圖的共同調性：上市公司年報與募資說明書的企業編輯攝影。明亮均勻的日光（約 5200–5600K）、
// 中性偏冷、清晰準確的色彩、構圖整齊（垂直線拉正、幾何清楚）；產品照放在白色到淡冷灰的無縫背景上，
// 紀實場景平視、冷靜。低到中等飽和度，不加底片顆粒、不做戲劇調色、不要暖金色光
const STYLE = 'Clean corporate editorial photography for an annual report. Bright, even daylight around 5200-5600K, neutral to slightly cool, high clarity and accurate color, minimal clutter, orderly compositions with straight verticals and clear geometry. Interiors feel tidy and well run: white walls, light-gray concrete, brushed steel, glass. Product shots sit on seamless white to pale cool-gray backdrops with soft, short shadows, centered with generous margins like a catalog or prospectus. Documentary scenes are shot straight and calm, eye-level or slightly elevated, medium depth of field so the context stays readable. Low to moderate saturation, no film grain, no dramatic grading, no warm golden light. Set in Taiwan. No text, no letters, no numbers, no logos, no charts, no screens with UI, no watermarks, no brand marks, no signage.'

const WIDE = (desc) => `Photorealistic photograph, wide landscape 3:2 composition, main subject centered inside a safe area with margin on all sides so it can be cropped to 16:9 or 4:3. ${desc} ${STYLE}`
const TALL = (desc) => `Photorealistic photograph, tall portrait 2:3 composition, main subject in the upper two-thirds, the lower third of the frame is a calm simple area (plain tabletop or wall) where text will be overlaid. ${desc} ${STYLE}`
const SQUARE = (desc) => `Photorealistic photograph, square 1:1 composition, main subject centered. ${desc} ${STYLE}`
const PHONE = (desc) => `Photorealistic candid smartphone photo in square 1:1 format, taken casually by a supporter and posted online, slightly imperfect framing, everyday life feeling, not a studio shot, but with clean bright light and accurate neutral color. ${desc} Neutral to slightly cool tones, no grain, no filter. Set in Taiwan. No people's faces, no text, no logo, no watermark, no brand marks, no screens with UI.`

// 帆布包的固定外型（與 hero、project-01 同款），細節照、色樣照、實拍都用這段描述＋參考圖
const BAG = 'the exact same canvas backpack model as the attached reference photo: a rounded zip-around top opening with two brass zipper pulls, a large flat front pocket closed by a horizontal brass zipper, open side pockets, a short top grab handle and padded shoulder straps; no flap, no drawstring, no buckles on the front'

const JOBS = [
  // A. 首頁 Hero 專案卡、專案細節主視覺（影片封面）＋圖庫第 1 張
  ['hero-canvas-bag', WIDE('Hero image of a sturdy commuter backpack made of thick natural undyed ivory-beige canvas (about 32 cm wide, 38 cm tall, 12 cm deep, 15 liters), standing upright on an old worn wooden workbench, slightly right of center, the whole bag fully in frame; beside it a loosely rolled length of canvas, a spool of thick thread and a pair of fabric shears; in the softly blurred background a corner of a canvas factory with an industrial sewing machine and bundled bolts of fabric; the scene is bright, tidy and orderly with clean daylight; the left side of the frame is calm empty space.')],

  // B. 首頁分類策展（2:3，下方 1/3 會疊文字）
  ['category-design-living', TALL('Still life on a table seen from a 45-degree high angle: a canvas bag, a plain unmarked notebook, a handmade ceramic cup and a wooden-handled tool, all with gentle signs of daily use.')],
  ['category-hardware', TALL('A small hardware workshop bench: a green circuit board, a soldering iron, a few slim LED light-tube modules and aluminium extrusion parts; a pair of hands assembling a module (hands only, no face).')],
  ['category-publishing', TALL('Where print and film meet: stacked page proofs, a book being bound with thread, and an old cine film camera and a film canister beside them; all paper and covers are completely blank with no readable text.')],
  ['category-social-design', TALL('Close-up at a dining table: an elderly person\'s hands holding a spoon with a thick, rounded easy-grip handle while eating, a younger person\'s hand gently steadying the bowl (hands and table only). Warm, dignified and homely, nothing clinical or hospital-like.')],

  // C. 8 個專案的主視覺（顯示 4:3，主體置中、四周留邊）
  ['project-01-canvas-bag', WIDE('Product photograph of three identical canvas commuter backpacks standing side by side: one natural undyed ivory-beige, one deep forest green, one charcoal black; thick padded shoulder straps and brass zippers visible; all three bags fully in frame, evenly spaced on a seamless pale cool-gray backdrop with soft short shadows, catalog style.')],
  ['project-02-orbitlight', WIDE('A modular desk lighting system on a work desk: a magnetic base and several slim linear light-tube modules joined one after another, arranged in a gentle arc along the back edge of the desk, on a tidy white desk in a bright office, lighting a closed laptop and an open notebook; the modular one-piece-connects-to-the-next construction is clearly readable; no brand marks on the lamp.')],
  ['project-03-documentary', WIDE('On the deck of a distant-water fishing vessel at sea, a wide horizon of ocean and sky; two or three fishermen seen from behind or far away, sorting and mending fishing nets; in one corner of the foreground the matte box of a cinema camera is visible, suggesting filming in progress. No identifiable faces, respectful, not miserable or exploitative.')],
  ['project-04-grip-cutlery', WIDE('Product photograph of a cutlery set laid flat: a spoon, a fork and a knife, each with a thick rounded soft silicone grip handle that is easy to hold, the spoon bowl set at an angle; a simple white ceramic bowl beside them, neatly aligned on a seamless pale cool-gray surface, catalog style.')],
  ['project-05-bamboo-notebook', WIDE('Two notebooks made of recycled bamboo-fibre paper: one closed with a dark grey bamboo-charcoal dyed cloth cover, one lying fully open flat at 180 degrees showing natural unbleached pages with only a few abstract handwritten pen strokes (no readable writing); a fountain pen and a few short pieces of bamboo beside them.')],
  ['project-06-island-boardgame', WIDE('Top-down view of a strategy board game spread on a table: several hand-illustrated cards of Taiwanese native wildlife and plants (a Formosan black bear, a Taiwan blue magpie, a muntjac deer, ferns) with absolutely no text on the cards, small wooden tokens and hexagonal habitat tiles.')],
  ['project-07-coffee-cup', WIDE('Product photograph of a reusable travel cup with a lid, its body made of pressed coffee grounds with a fine speckled granular texture, no text on the cup; beside it a small neat pile of used coffee grounds, a pinch of soil and a few leaves hinting that it can decompose, on a seamless pale cool-gray backdrop, catalog style.')],
  ['project-08-street-facades', WIDE('Top-down view of a large-format book of architectural survey drawings lying open: the spread shows hand-drawn line elevations of old Taiwanese shophouse facades with arched windows, decorative gables and tiled fronts, with no readable text or numbers; beside it a scale ruler, technical drawing pens and sheets of tracing paper.')],

  // D. 專案故事內文配圖與圖庫（P1 帆布包）
  ['story-canvas-mill', WIDE('Inside an old canvas mill: a vintage weaving loom and beside it whole uncut bolts of thick heavy ivory-beige grey canvas, light falling from high windows; no people, or only a distant figure seen from behind.')],
  ['story-sewing-artisan', WIDE('Tight close-up of one single veteran seamstress at work, showing exactly two hands in total (her left hand and her right hand, anatomically correct, no extra hands) and her forearms guiding thick ivory canvas under the presser foot of an industrial sewing machine, the needle and the even stitch line clearly visible; the person\'s face, head and shoulders are completely out of frame; in one corner a small fabric tag sewn onto the canvas carries only an abstract mark (no readable numbers).')],
  ['story-fabric-colors', WIDE('Three rolls of canvas fabric side by side in natural undyed ivory-beige, deep forest green and charcoal black, the rolled edges showing the thickness and weave of the cloth.')],
  ['story-bag-details', WIDE(`Close detail shot of ${BAG}, in the deep forest green colorway (a dark bottle green, clearly not olive, not khaki, not gray). A tight three-quarter crop of the lower half of the bag and one shoulder strap shows three details in one frame: a brass zipper pull with a matte oxidised patina, the thickly padded shoulder strap with its stitching, and the double-layer canvas reinforcement panel on the bottom of the bag. On a seamless pale cool-gray backdrop.`), 'project-01-canvas-bag'],

  // E. 提案者
  ['proposer-avatar', SQUARE('Half-length portrait of a fictional young Taiwanese craft entrepreneur around 30 years old wearing a canvas work apron, standing inside a canvas workshop, face in the center of the frame (it will be cropped into a circle), calm friendly expression, background softly blurred.')],
  ['proposer-workshop', WIDE('Wide view of a canvas sewing workshop in Tainan: several industrial sewing machines lined up in a row, bundles of canvas, a cutting table, half-finished bags hanging on a rail; two or three seamstresses seen from behind at work.')],

  // F. 贊助者實拍（手機隨手拍）
  ['ugc-canvas-bag', PHONE(`On the way to work: ${BAG}, in deep forest green, placed on a plain wooden cafe chair next to a window table, the top zipper open with a laptop and a water bottle peeking out; the canvas shows gentle wear from months of daily use. The background is a calm, minimal cafe corner with plain light walls and soft daylight. No signage, no maps, no posters, no menus, no stickers, no logos, no public transport interior.`), 'project-01-canvas-bag'],
  ['ugc-desk-light', PHONE('A home desk setup at night lit by a modular desk lighting system: several slim linear light-tube modules joined end to end in a gentle arc along the back edge of the desk on small magnetic bases (the same modular lamp as the product photo), lighting a keyboard, a monitor with a dark blank screen and a small potted plant; casual phone angle in an evening room with clean neutral light.')],

  // G. 生產排程的進度更新照片（像提案者在工廠拍的進度照）
  ['update-color-samples', WIDE(`Inside a bright, tidy factory, a stainless work table with three production-sample canvas backpacks standing side by side in exactly three colors, natural undyed ivory-beige, deep forest green and charcoal black (no other colors). All three are ${BAG}. Around them on the table: three plain fabric swatches in the same three colors, a few loose canvas samples and a measuring tape, like a quality-check snapshot. Swatch cards are plain fabric with no printed labels.`), 'project-01-canvas-bag'],
  ['update-fabric-rolls', WIDE('A factory warehouse stacked with dozens of large rolls of canvas on wooden pallets, a hand cart beside them; looks like a progress photo taken by the maker on a phone, not a studio shot.')],
]

function run(prompt, ref) {
  return new Promise((resolve) => {
    const refArgs = ref ? ['-i', path.join(OUT, `${ref}.jpg`)] : []
    const refNote = ref ? 'Use the attached reference photo only to match the product\'s shape, construction and hardware; create a new photograph that follows this description. ' : ''
    const child = spawn('codex', ['exec', '--enable', 'image_generation', '-s', 'workspace-write', '--skip-git-repo-check', ...refArgs, '--', `$imagegen ${refNote}${prompt}`],
      { cwd: os.tmpdir(), stdio: ['ignore', 'pipe', 'pipe'] })
    const buf = []
    child.stdout.on('data', (d) => buf.push(d))
    child.stderr.on('data', (d) => buf.push(d))
    const timer = setTimeout(() => child.kill('SIGKILL'), 8 * 60 * 1000)
    child.on('close', (code) => { clearTimeout(timer); resolve({ code, log: Buffer.concat(buf).toString() }) })
  })
}

// 存檔尺寸（IMAGES.md）：3:2 → 1600×1066、2:3 → 1066×1600（長邊 1600，JPEG 80）；1:1 → 1200×1200（JPEG 78）
const isSquare = (name) => /^(proposer-avatar|ugc-)/.test(name)

async function one([name, prompt, ref]) {
  const out = path.join(OUT, `${name}.jpg`)
  if (!FORCE && (await fs.stat(out).catch(() => null))) return { name, ok: true, skipped: true }
  for (let attempt = 1; attempt <= 2; attempt++) {
    const { code, log } = await run(prompt, ref)
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
      const square = isSquare(name)
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
