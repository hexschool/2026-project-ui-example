// ============================================================
// 產生島造 ISLANDMAKE｜01 未來硬體實驗室的 23 張圖片（Codex CLI image_generation）
//
// 需求：已登入的 codex CLI（>= 0.150）、macOS sips（轉 JPEG 與縮圖）
// 用法：
//   node scripts/generate-images.mjs                          # 產生缺少的圖片（已存在的會跳過）
//   node scripts/generate-images.mjs --only hero-canvas-bag   # 只產生指定檔名（逗號分隔，不含 .jpg）
//   node scripts/generate-images.mjs --force                  # 全部重新產生
//   CONC=1 node scripts/generate-images.mjs                   # 並行數（預設 1）
//
// 清單與畫面主體照主題的 ../IMAGES.md（各套風格同檔名、同內容），這裡只決定「風格」：
//   STYLE   整組圖的共同調性：深夜產品實驗室的電影感攝影，冷白頂光＋細細的青色、冷藍輪廓光，
//           深石墨與鈦灰的環境沉進陰影，物件保留本來的顏色（呼應介面的深鈦灰底與冷藍→青空充能條）
//   PRODUCT 產品照：深色霧面無縫背景，主體後方一團淡淡的冷色漸層光（深色頁面上不會像開燈）
//   SCENE   工作現場、靜物：藍調時刻或工作燈下的寫實紀錄，不做科幻感
//   CANDID  贊助者手機實拍：夜間室內、檯燈，構圖不完美的生活感
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
const RAW = path.join(os.tmpdir(), 'islandmake-hardware-lab-raw-images') // 原始 PNG（不進版控）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 1)

const STYLE = 'Cinematic night-shift product-lab photography for a Taiwanese local-maker crowdfunding platform. Cool 6500-7500K light: a soft cold-white overhead key with thin cyan and blue rim lights from LED strips, deep graphite and titanium-gray surroundings that fall into shadow, subtle atmospheric haze, crisp micro-detail and controlled specular highlights on metal, thread and canvas weave. Low-clutter composition with strong negative space and shallow depth of field; a slightly low camera angle makes objects feel engineered and precise. Overall palette muted and desaturated, while objects keep their true colors (raw undyed canvas, olive green, charcoal). Natural and respectful, not science fiction. No text, no readable letters or numbers, no logos, no brand marks, no screens showing UI, no holograms, no neon signs, no watermark, no recognizable real people.'
// 比例：3:2 → 1536×1024、2:3 → 1024×1536、square → 1024×1024（存檔時再縮成 1600／1600／1200）
const RATIO = { '3:2': 'wide landscape 3:2 composition', '2:3': 'tall portrait 2:3 composition', '1:1': 'square 1:1 composition' }
const SAFE = 'Keep the main subject inside the central safe area with generous margins on all sides, so it can be cropped to 16:9, 4:3 or 4:5 without cutting the subject.'
const PRODUCT = (ratio, desc) => `Photorealistic studio product photograph, ${RATIO[ratio]}. ${desc} Shot on a dark matte graphite seamless backdrop and floor (never white), with a faint cool blue-to-cyan gradient glow behind the subject, a soft cold-white key light from above and a thin cyan rim light tracing the edges. ${SAFE} ${STYLE}`
const SCENE = (ratio, desc) => `Photorealistic photograph, ${RATIO[ratio]}. ${desc} Set in Taiwan, shot at blue hour or under practical work lights. ${SAFE} ${STYLE}`
const CANDID = (desc) => `Photorealistic candid smartphone photo, square 1:1 format, as posted by a backer on social media, slightly imperfect framing, taken indoors at night under a desk lamp with cool ambient light, natural colors and a little phone-camera noise, not a studio shot. ${desc} No people's faces, no text, no logo, no watermark.`

const JOBS = [
  // A. 首頁 Hero 專案卡、專案細節主視覺（左側留空給疊字）
  ['hero-canvas-bag', '3:2', SCENE('3:2', 'Hero image for a canvas commuter backpack: one sturdy thick canvas commuter backpack (about W32 x H38 x D12 cm, 15 liters) in undyed natural off-white raw canvas, standing upright on an old worn wooden workbench, fully in frame and placed slightly right of center; beside it a rolled bolt of canvas, a spool of thick thread and heavy fabric shears. Background: a corner of an old canvas factory in Tainan with an industrial sewing machine and stacked bolts of fabric, out of focus. Leave the left third calm and uncluttered for text overlay. A cold rim light makes the canvas weave texture crisp.')],

  // B. 首頁分類策展（直式；下方 1/3 留單純區域，卡片下緣會疊文字）
  ['category-design-living', '2:3', SCENE('2:3', 'Tabletop still life seen from a 45-degree overhead angle on a dark slate tabletop: a canvas tote bag, a plain notebook with a blank cover, a handmade ceramic cup and a wooden-handled tool, all showing gentle signs of everyday use. The lower third of the frame is mostly plain empty tabletop.')],
  ['category-hardware', '2:3', SCENE('2:3', 'A small hardware workshop bench: a green circuit board, a soldering iron, several slim LED light-tube modules and aluminium extrusion parts; a pair of hands assembling a module (hands only, no face). The lower third of the frame is a plain clean area of the bench.')],
  ['category-publishing', '2:3', SCENE('2:3', 'Where print meets film: stacks of printed page proofs, a book being hand-bound with thread, and an old cine film camera and a film canister beside them. All pages and covers are blank or abstract with no readable text. The lower third of the frame is a plain uncluttered surface.')],
  ['category-social-design', '2:3', SCENE('2:3', 'On a home dining table: an elderly person\'s hands holding a spoon with a thick, rounded easy-grip handle, eating from a bowl, while a younger person\'s hand gently steadies the bowl (hands and table only, no faces). Warm, dignified and everyday, not clinical, no hospital feel. The lower third of the frame is a plain area of the tabletop.')],

  // C. 8 個專案的主視覺（卡片顯示 4:3，主體置中）
  ['project-01-canvas-bag', '3:2', PRODUCT('3:2', 'Three identical canvas commuter backpacks standing side by side in three colours: undyed natural off-white raw canvas, deep forest green and charcoal black. The padded thick shoulder straps and brass zipper pulls are visible. All three bags fully in frame.')],
  ['project-02-orbitlight', '3:2', SCENE('3:2', 'A modular desk lighting system on a matte graphite work desk in a dim room: a magnetic base with several slim light-tube modules joined one by one and arranged in a gentle arc along the back edge of the desk, glowing and lighting up a laptop and an open notebook. The modular, snap-together nature is clearly visible. No brand marks on the lamp.')],
  ['project-03-documentary', '3:2', SCENE('3:2', 'The deck of a distant-water fishing vessel under a wide open sky with a broad sea horizon; two or three fishermen seen from behind or far away sorting a fishing net, in work clothes and rain jackets. In one foreground corner the matte black lens hood of a documentary film camera is visible, implying filming. No recognizable faces, respectful and calm, not tragic.')],
  ['project-04-grip-cutlery', '3:2', PRODUCT('3:2', 'A cutlery set laid flat: a spoon, a fork and a knife, each with a thick, rounded, soft silicone easy-grip handle in matte charcoal, the spoon bowl visibly angled; a simple ceramic bowl beside them. Clean product layout, seen from above at a slight angle.')],
  ['project-05-bamboo-notebook', '3:2', PRODUCT('3:2', 'Two recycled bamboo-fibre paper notebooks: one closed with a dark grey bamboo-charcoal dyed cloth cover, one opened flat at 180 degrees showing natural unbleached pages with a few abstract handwritten pen strokes (no readable text); a fountain pen and a few short pieces of bamboo beside them.')],
  ['project-06-island-boardgame', '3:2', SCENE('3:2', 'Overhead flat-lay of a strategy board game spread on a dark wooden table: several cards with hand-painted illustrations of Taiwanese native wildlife and plants (a Formosan black bear, a Taiwan blue magpie, a Reeves\'s muntjac, ferns) with no text on the cards, wooden tokens and hexagonal habitat tiles.')],
  ['project-07-coffee-cup', '3:2', PRODUCT('3:2', 'One reusable travel cup with a lid, its body made of pressed spent coffee grounds with a fine speckled granular texture, no text on the cup; beside it a small heap of coffee grounds, a pinch of dark soil and a few green leaves, hinting that it is compostable.')],
  ['project-08-street-facades', '3:2', SCENE('3:2', 'Overhead view of a large-format book lying open on a drafting table, the spread showing hand-drawn line elevations of old Taiwanese shophouse facades (Japanese-era arched windows and gables, tiled facades); a scale ruler, a technical pen and tracing paper beside it. No readable text or numbers on the drawings.')],

  // D. 專案故事內文配圖與圖庫（帆布包）
  ['story-canvas-mill', '3:2', SCENE('3:2', 'Inside an old canvas mill: a vintage industrial weaving loom, next to it large uncut rolls of heavy undyed off-white cotton canvas, light streaming from high windows. No people, or only a distant figure from behind.')],
  ['story-sewing-artisan', '3:2', SCENE('3:2', 'Close-up of a veteran sewing artisan\'s hands and forearms stitching heavy canvas on an industrial sewing machine, the stitches crisp and visible; in a corner a small fabric label sewn onto the canvas bearing only abstract marks, no readable numbers. Hands only, no face.')],
  ['story-fabric-colors', '3:2', PRODUCT('3:2', 'Three rolls of heavy canvas fabric side by side in undyed natural off-white, deep forest green and charcoal black, the rolled edges showing the thickness and weave texture of the cloth.')],
  ['story-bag-details', '3:2', SCENE('3:2', 'Extreme close-up macro detail photograph that fills the whole frame with parts of an undyed off-white raw canvas backpack (the same zippered backpack as the hero image, no flap): in focus a brass zipper pull with a matte oxidised patina on a zipper track, next to it the thick padded shoulder strap showing its double stitching and padding thickness, and at the edge the reinforced double-layered canvas base. Do not show the whole bag; only these details, shallow depth of field.')],

  // E. 提案者
  ['proposer-avatar', '1:1', SCENE('1:1', 'Half-length portrait of a fictional young Taiwanese craft entrepreneur around 30 years old wearing a canvas work apron, standing in a canvas factory, face in the centre of the frame (it will be cropped into a circle), friendly confident expression, background softly blurred.')],
  ['proposer-workshop', '3:2', SCENE('3:2', 'Wide view of a canvas sewing workshop in Tainan: a row of industrial sewing machines, stacked bolts of canvas, a cutting table and half-finished bags hanging on a rail; two or three sewing artisans seen from behind at work.')],

  // F. 贊助者實拍（UGC）
  ['ugc-canvas-bag', '1:1', CANDID('A deep forest green canvas backpack resting on a metro seat during a commute, a laptop and a water bottle peeking out of the opening; the bag looks used for a while, slightly worn.')],
  ['ugc-desk-light', '1:1', CANDID('A home desk setup at night: a modular desk lamp made of a magnetic base with several slim light-tube modules joined in a gentle arc along the back of the desk, glowing a natural neutral white (high colour rendering, not RGB, no coloured gaming lights), lighting a keyboard, a monitor and a small potted plant; casual phone-camera angle.')],

  // G. 生產排程的進度更新照片
  ['update-color-samples', '3:2', SCENE('3:2', 'On a factory workbench: three production-sample canvas backpacks side by side in undyed off-white, deep forest green and charcoal black, with colour swatch cards, fabric samples and a measuring tape next to them, like an internal quality-check photo.')],
  ['update-fabric-rolls', '3:2', SCENE('3:2', 'A factory warehouse with dozens of large rolls of canvas fabric stacked on wooden pallets and a hand trolley beside them, shot like a progress photo taken by the maker on a phone, not a studio shot.')],
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

async function one([name, ratio, prompt]) {
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
      const square = ratio === '1:1'
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
