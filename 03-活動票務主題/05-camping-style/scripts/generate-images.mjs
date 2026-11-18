// ============================================================
// 產生 05 戶外露營音樂節的活動照片（Codex CLI image_generation）
//
// 需求：已登入的 codex CLI（>= 0.150）、macOS sips（轉 JPEG 與縮圖）
// 用法：
//   node scripts/generate-images.mjs                          # 產生缺少的圖片（已存在的會跳過）
//   node scripts/generate-images.mjs --only hero-live-crowd   # 只產生指定檔名（逗號分隔）
//   node scripts/generate-images.mjs --force                  # 全部重新產生
//   CONC=1 node scripts/generate-images.mjs                   # 並行數（預設 1；額度有限時一次一張最穩）
//
// 換風格時：修改 STYLE（整組圖的共同調性）與各張 prompt，檔名維持不變即可，不用改程式。
// 檔名與畫面主體照主題層的 IMAGES.md（各套風格共用同一份清單）。
// 原理：codex exec 的輸出會存在 ~/.codex/generated_images/<session id>/，
//       從 log 解析 session id 就能對應到正確的檔案，所以可以安全地並行。
// 本風格是彩色底片調性（暖金色、泥灰、橄欖、營火橘），不做灰階轉換。
// ============================================================
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { spawn, execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(HERE, '../images')
const RAW = path.join(os.tmpdir(), 'stageone-camping-raw-images') // 原始 PNG（不進版控，本風格專用）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 1)

// 整組圖的共同調性：音樂節紀實攝影師、35mm 彩色底片、黃金時刻、泥灰／橄欖／營火橘、戶外質感
const STYLE = 'Shot by a documentary festival photographer on 35mm color film during golden hour: warm low sun or warm practical light, soft natural haze, earthy palette of muddy gray, khaki-olive green and campfire orange, lifted matte blacks, gentle visible film grain, slightly faded warm highlights, candid unposed framing with generous breathing room of sky, ground or wall, natural tactile textures such as canvas, wood, rope, grass, gravel and paper. Indoor subjects (live house, theatre, workshop) stay warm and amber like lantern light with a little dust in the air, never cold or neon. No cold blue LEDs, no neon pink or green, no glossy commercial look, no text, no letters, no logos, no watermark, no readable screens or signs, no QR codes, no recognizable faces (backs, silhouettes, hands, figures far away).'
const WIDE = (desc) => `Color film photograph, wide landscape 3:2 composition, 35mm lens. ${desc} ${STYLE}`
const TALL = (desc) => `Color film photograph, tall portrait 2:3 composition, 35mm lens. ${desc} ${STYLE}`
const SQUARE = (desc) => `Color film photograph, square 1:1 composition, 50mm lens. ${desc} ${STYLE}`

const JOBS = [
  // 首頁 Hero：本風格 H1 在「左上」（天空的位置），底緣蓋手繪山稜線，右下壓行李吊牌倒數
  ['hero-live-crowd', WIDE('A live music crowd seen from the back toward a stage: warm amber stage lights shine straight at the camera through dusty haze and form soft golden beams; in the foreground a row of audience silhouettes raise their hands. The stage and the tiny musicians sit in the middle of the frame, faces unreadable. The upper-left area of the frame is calmer and simpler for overlaid text (a plain, softly dark haze or ceiling with no bright spots); the lower-left and the lower-right corner are also plain and dark. The light and the crowd are concentrated in the center so a vertical crop still keeps the subject.')],
  // 首頁情境卡（2:3 生成、4:5 顯示；本風格文字在照片下方的相框白邊，不壓在照片上）
  ['scene-music', TALL('Close view of a concert crowd singing together: many hands raised high toward the stage, one arm stretched forward, warm golden stage light pouring down from above through dusty haze. Subject in the upper-middle of the frame; the bottom third is darker and simpler.')],
  ['scene-theatre', TALL('A small theatre seen from the back rows: a single warm spotlight falls on one performer standing on an otherwise empty wooden stage; in the foreground a few rows of seated audience heads in silhouette, still and attentive. Lantern-warm, quiet and focused. The bottom third is darker and plain.')],
  ['scene-market', TALL('An outdoor market aisle at dusk: handmade craft and snack stalls under canvas tents on both sides, strings of warm bulbs overhead, people seen from behind holding drinks and snacks as they stroll on gravel. Subject in the middle of the frame; the bottom third is simple ground.')],
  ['scene-talk', TALL('A small workshop at a long wooden table: hands of participants taking notes and making something by hand, sheets of paper, twine and simple tools; at the far end a speaker stands in front of a blank board, out of focus, face not visible. Warm, focused learning mood. The bottom third is a plain wooden tabletop.')],
  // 活動主視覺（3:2 生成；會裁成 16:9、4:3、16:10，主體放中央）
  ['event-midnight-noise', WIDE('A large live house electronic music show: on stage an electronic musician stands behind synthesizers and a mixing desk as a silhouette, warm amber light beams and a few soft orange laser lines cut through dusty haze, in the foreground a packed crowd in silhouette, a few raised wrists wearing glowing light bands that read as small warm glowing loops. Subject centered so both 16:9 and 4:3 crops keep the stage and the crowd.')],
  ['event-island-monologue', WIDE('A small black-box theatre: ONE contemporary dancer caught mid-stretch under a SINGLE warm overhead light that draws one soft golden circle on the wooden floor, everything around falls into warm darkness; along the bottom edge the low silhouettes of front-row floor-seat audience. The dancer is in the center of the frame, face turned away.')],
  ['event-riverside-market', WIDE('A riverside plaza at golden dusk: a row of canvas tents of handmade craft stalls (pottery, leather, baked goods) lining the river bank, strings of warm bulbs just switched on overhead, their reflections on the water, people browsing seen from behind. The stalls and the river bank sit in the middle band of the frame.')],
  ['event-photo-composition', WIDE('Slightly high-angle view of a wooden tabletop set up for an online live-streamed photography lecture: a film camera, several printed photographs with obvious leading lines and frame-within-a-frame compositions of streets and buildings (no words), a smartphone mounted on a small tripod filming the table, a laptop whose glowing screen is blurred and unreadable, warm window light. Subject centered.')],
  ['event-silent-realm', WIDE('A gallery inside a converted old shophouse with brick walls, timber beams and tall windows letting in late warm afternoon light: large framed photographs on a pale wall, each showing an empty city street with no people; one visitor seen from behind stands before a print. Quiet, lots of empty wall, dust in the light.')],
  ['event-night-run', WIDE('Runners on a riverside path at dusk just after sunset, seen from the side and from behind with gentle motion blur; reflective strips and waist packs on their gear catch warm street lamp light, the river reflects the last orange glow of the sky. No readable race bibs.')],
  ['event-resonance-friday', WIDE('A small basement club: low ceiling with exposed pipes and wooden beams, a DJ booth in the middle distance with the DJ as a silhouette, only a few people dancing on the floor. Intimate and smaller than a festival, no big lighting rigs, one or two warm amber bulbs and a little dusty haze.')],
  ['event-island-zine-fest', WIDE('A converted old warehouse exhibition with daylight from high windows: long wooden tables covered with zines, photo books and handmade books, abstract screen-printed posters with no text pinned on the wall, visitors seen from behind and hands flipping through publications.')],
  // 活動細節「關於這場演出」圖文混排（3:2 生成、21:9 顯示：主體在中間水平帶）
  ['event-midnight-noise-stage', WIDE('A wide view inside one large venue: TWO stages, one on the left and one on the right, both lit at the same time with warm golden and orange light, their beams crossing in the dusty haze above the crowd in the middle. Keep all the important content in the central horizontal band of the frame because the top and bottom quarter will be cropped.')],
  // 活動細節「怎麼去？」場地照（16:9）
  ['venue-entrance', WIDE('Golden dusk at the entrance of a live house next to a large shopping mall: a simple building facade with an entrance canopy, people queuing to enter seen from behind, the pavement still wet from recent rain reflecting the warm light. Absolutely no signage, no letters, no brand marks anywhere.')],
  // 主辦方歷史活動（1:1 小縮圖）
  ['organizer-past-1', SQUARE('A small live house show: one electronic musician on stage behind a synthesizer in warm amber light, the audience standing close to the stage. Subject centered.')],
  ['organizer-past-2', SQUARE('An outdoor music festival at sunset seen from far away on a grassy hill: a large lighting truss above a big crowd, tents and flags at the edges, the sky glowing orange.')],
  ['organizer-past-3', SQUARE('A merchandise table at a music event under a canvas awning: a stack of vinyl records and neatly folded plain T-shirts with no print or lettering, lit by a single warm lamp, wooden crate underneath.')],
  ['organizer-past-4', SQUARE('Close view of a festival crowd at dusk: many raised hands wearing glowing light bands that read as warm glowing loops against the evening sky.')],
  // 首頁主辦方轉換帶（主體中間偏右；左半部暗而單純壓標題）
  ['organizer-cta', WIDE('At an outdoor event entrance gate made of wood and canvas, the moment of ticket scanning: a staff member\'s hand holds a handheld scanner aimed at a smartphone held by a visitor (the phone screen is just a blank bright glow, no content), the queue behind softly out of focus in golden light. The subject sits center-right; the LEFT half of the frame is darker, plain and empty (space for a headline).')],
  // 首頁評價頭像（縮到 48px 仍看得懂，構圖極單純）
  ['review-late-night-gigs', SQUARE('An extremely simple, graphic close-up silhouette: one raised hand against a single warm golden stage light behind it. Bold, minimal, readable even at a tiny size.')],
  ['review-weekend-market-go', SQUARE('An extremely simple close-up: a clear transparent umbrella on a rainy evening, behind it soft round warm bokeh of string lights and reflections on the wet ground. Minimal and graphic.')],
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
      // 寬幅 1600px（IMAGES.md）、方形與直式 1024px；JPEG 品質 80 左右
      const small = /^(scene-|organizer-past-|review-)/.test(name)
      execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', small ? '78' : '80', '--resampleHeightWidthMax', small ? '1024' : '1600', raw, '--out', out], { stdio: 'ignore' })
      console.log(`[ok] ${name} (attempt ${attempt})`)
      return { name, ok: true }
    }
    console.log(`[retry] ${name} attempt ${attempt} code=${code} sid=${sid} tail=${log.slice(-300).replace(/\n/g, ' ')}`)
    if (/rate[ -]?limit|insufficient[_ -]?(quota|credit)|too many requests|usage limit/i.test(log)) return { name, ok: false, reason: 'quota' }
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
