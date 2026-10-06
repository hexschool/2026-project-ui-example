// ============================================================
// 產生 04 當代雙年展的活動照片（Codex CLI image_generation）
//
// 需求：已登入的 codex CLI（>= 0.150）、macOS sips（轉灰階 JPEG 與縮圖）
// 用法：
//   node scripts/generate-images.mjs                          # 產生缺少的圖片（已存在的會跳過）
//   node scripts/generate-images.mjs --only hero-live-crowd   # 只產生指定檔名（逗號分隔）
//   node scripts/generate-images.mjs --force                  # 全部重新產生
//   CONC=2 node scripts/generate-images.mjs                   # 並行數（預設 4）
//
// 換風格時：修改 STYLE（整組圖的共同調性）與各張 prompt，檔名維持不變即可，不用改程式。
// 檔名與畫面主體照主題層的 IMAGES.md（3 套風格共用同一份清單）。
// 原理：codex exec 的輸出會存在 ~/.codex/generated_images/<session id>/，
//       從 log 解析 session id 就能對應到正確的檔案，所以可以安全地並行。
// 本風格的圖片一律轉成真正的灰階（Generic Gray Gamma 2.2），
// 就算 AI 生成時帶了一點色偏，輸出也只有黑、白、灰。
// ============================================================
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { spawn, execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(HERE, '../images')
const RAW = path.join(os.tmpdir(), 'stageone-biennale-raw-images') // 原始 PNG（不進版控）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 4)
const GRAY = '/System/Library/ColorSync/Profiles/Generic Gray Gamma 2.2 Profile.icc'

const STYLE = 'Strictly black-and-white fine-art photograph, as printed in a contemporary art biennale catalogue: true monochrome with no color at all, deep pure blacks, clean bright whites and a full range of neutral mid-greys, crisp high contrast, fine silver-gelatin film grain, rigorous geometric composition built on strong verticals, horizontals and hard-edged blocks of light and shadow, generous negative space, calm, detached and precise. No text, no letters, no logo, no watermark, no signage, no posters with words, no readable screens, no QR codes, no barcodes, no recognizable faces.'
const WIDE = (desc) => `Black-and-white photograph, wide landscape 3:2 composition, 35mm lens. ${desc} ${STYLE}`
const TALL = (desc) => `Black-and-white photograph, tall portrait 2:3 composition, 35mm lens. ${desc} ${STYLE}`
const SQUARE = (desc) => `Black-and-white photograph, square 1:1 composition, 50mm lens. ${desc} ${STYLE}`

const JOBS = [
  // 首頁 Hero（左下、下方 1/3 要暗而單純壓主標；右下也留空壓倒數小卡）
  ['hero-live-crowd', WIDE('Inside a live house, seen from the back of the crowd toward the stage: hard stage lights blaze straight at the camera through thin haze, forming sharp white beams; in the foreground a row of audience silhouettes with raised hands, rendered as solid black shapes. The stage and tiny musicians sit in the upper-middle of the frame, faces unreadable. The bottom third and the lower-left of the frame are deep, plain black (space for headline text), and the lower-right corner is also plain dark. The bright light and the crowd are concentrated in the center so a vertical crop still keeps the subject.')],
  // 首頁情境卡（2:3 生成、4:5 顯示；下方 1/3 單純壓字）
  ['scene-music', TALL('Close view of a concert crowd singing together: many hands raised high toward the stage, one arm stretched forward holding a phone light, stage light pouring down from above and cutting the haze into white shafts. Subject in the upper-middle of the frame; the bottom third is dark and simple.')],
  ['scene-theatre', TALL('A small black-box theatre seen from the back rows: a single hard spotlight falls on one performer standing alone on an empty stage, forming a white circle on the floor; in the foreground a few rows of seated audience heads in silhouette, still and attentive. The bottom third is dark and plain.')],
  ['scene-market', TALL('An outdoor evening market aisle: handmade craft and snack stalls on both sides under simple tents, strings of bare light bulbs overhead, people seen from behind holding drinks and snacks as they stroll. Subject in the middle of the frame; the bottom third is simple, a plain paved ground.')],
  ['scene-talk', TALL('A small workshop: hands of participants on a long table taking notes and making something by hand, sheets of paper and simple tools; at the far end a speaker stands in front of a blank projection screen, out of focus, face not visible. Focused, quiet learning mood. The bottom third is a plain tabletop surface.')],
  // 活動主視覺（3:2 生成；會裁成 16:9、4:3、16:10，主體放中央）
  ['event-midnight-noise', WIDE('A large live house electronic music show: on stage an electronic musician stands behind synthesizers and a mixing desk as a pure black silhouette, sharp light beams and laser lines slicing through dense haze, in the foreground a packed crowd in silhouette, a few raised wrists wearing glowing light bands that read as small bright white loops. Subject centered so both 16:9 and 4:3 crops keep the stage and the crowd.')],
  ['event-island-monologue', WIDE('A black-box theatre: ONE contemporary dancer caught mid-stretch under a SINGLE overhead light that draws one hard white circle on the floor, everything around almost completely black; along the bottom edge the low silhouettes of front-row floor-seat audience. The dancer is in the center of the frame, face turned away.')],
  ['event-riverside-market', WIDE('A riverside plaza just after dusk: a row of white canopy tents of handmade craft stalls (pottery, leather, baked goods) lining the river bank, strings of bulbs freshly lit overhead, their reflections on the dark water, people browsing seen from behind. The stalls and the river bank sit in the middle band of the frame.')],
  ['event-photo-composition', WIDE('Slightly high-angle view of a tabletop set up for an online live-streamed lecture: a camera, several printed photographs with obvious leading lines and frame-within-a-frame compositions showing streets and architecture (no words), a smartphone mounted on a small tripod filming the table, and a laptop whose glowing screen is blurred and unreadable. Subject centered.')],
  ['event-silent-realm', WIDE('A gallery inside a converted old shophouse with brick walls, timber beams and tall windows: large framed photographs on a white wall, each showing an empty city street with no people; one visitor seen from behind stands before a print. Quiet, lots of empty wall, soft window light.')],
  ['event-night-run', WIDE('Night runners on a riverside path, seen from the side and from behind, with motion blur; reflective strips and waist packs on their gear flare bright white under the street lamps, the river reflects city lights. No readable race bibs.')],
  ['event-resonance-friday', WIDE('A small basement club: low ceiling with exposed pipes, a DJ booth in the middle distance with the DJ as a silhouette, only a few people dancing on the floor. Intimate and smaller than a festival, no big lighting rigs, one or two hard spotlights.')],
  ['event-island-zine-fest', WIDE('A converted old warehouse exhibition: long tables covered with zines, photo books and handmade books, abstract screen-printed posters with no text pinned on the wall, visitors seen from behind and hands flipping through publications.')],
  // 活動細節「關於這場演出」圖文混排（3:2 生成、21:9 顯示：主體在中間水平帶）
  ['event-midnight-noise-stage', WIDE('A wide view inside one large venue: TWO stages, one on the left and one on the right, both lit at the same time, their light beams crossing in the middle above the crowd; the crowd fills the space between the stages. Keep all the important content in the central horizontal band of the frame because the top and bottom quarter will be cropped.')],
  // 活動細節「怎麼去？」場地照（16:9）
  ['venue-entrance', WIDE('Dusk at the entrance of a live house next to a large shopping mall: a clean geometric building facade with an entrance canopy, people queuing to enter seen from behind, the pavement wet from recent rain reflecting the light. Absolutely no signage, no letters, no brand marks anywhere.')],
  // 主辦方歷史活動（1:1 小縮圖）
  ['organizer-past-1', SQUARE('A small live house show: one electronic musician on stage behind a synthesizer, the audience standing close to the stage. Subject centered.')],
  ['organizer-past-2', SQUARE('An outdoor electronic music festival at night seen from far away: a large lighting truss throwing beams into the sky above a big crowd.')],
  ['organizer-past-3', SQUARE('A merchandise table at a music event: a stack of vinyl records and neatly folded plain T-shirts with no print or lettering, lit by a single lamp.')],
  ['organizer-past-4', SQUARE('Close view of a festival crowd: many raised hands wearing glowing light bands that read as bright white loops against the dark.')],
  // 首頁主辦方轉換帶（主體中間偏右；左半部暗而單純壓標題）
  ['organizer-cta', WIDE('At an event entrance, the moment of ticket scanning: a staff member\'s hand holds a handheld scanner aimed at a smartphone held by a visitor (the phone screen is just a blank bright white glow, no content), the queue behind softly out of focus. The subject sits center-right; the LEFT half of the frame is dark, plain and empty (space for a headline).')],
  // 首頁評價頭像（縮到 48px 仍看得懂，構圖極單純）
  ['review-late-night-gigs', SQUARE('An extremely simple, graphic close-up silhouette: one raised hand against a single bright stage light behind it. Bold, minimal, readable even at a tiny size.')],
  ['review-weekend-market-go', SQUARE('An extremely simple close-up: a clear transparent umbrella on a rainy night, behind it soft round bokeh of string lights and reflections on the wet ground. Minimal and graphic.')],
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
      // 寬幅 1800px、方形與直式 1024px；轉成灰階 JPEG（品質 80 左右）
      const small = /^(scene-|organizer-past-|review-)/.test(name)
      execFileSync('sips', ['-m', GRAY, '-s', 'format', 'jpeg', '-s', 'formatOptions', small ? '78' : '80', '--resampleHeightWidthMax', small ? '1024' : '1800', raw, '--out', out], { stdio: 'ignore' })
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
