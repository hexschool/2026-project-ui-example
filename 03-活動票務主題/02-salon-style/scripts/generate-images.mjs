// ============================================================
// 產生 02 古典藝文沙龍的活動照片（Codex CLI image_generation）
//
// 需求：已登入的 codex CLI（>= 0.150）、macOS sips（轉 JPEG 與縮圖）
// 用法：
//   node scripts/generate-images.mjs                          # 產生缺少的圖片（已存在的會跳過）
//   node scripts/generate-images.mjs --only hero-live-crowd   # 只產生指定檔名（逗號分隔）
//   node scripts/generate-images.mjs --force                  # 全部重新產生
//   CONC=1 node scripts/generate-images.mjs                   # 並行數（預設 2）
//
// 換風格時：修改 STYLE（整組圖的共同調性）與各張 prompt，檔名維持不變即可，不用改程式。
// 檔名與畫面主體照主題層的 IMAGES.md（3 套風格共用同一份清單）。
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
const RAW = path.join(os.tmpdir(), 'stageone-salon-raw-images') // 原始 PNG（不進版控）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 2)

// 整組圖的共同調性：像音樂廳演出季節目冊裡的劇照——暖色鎢絲燈、低彩度、陰影偏暖棕而不是純黑、細緻底片顆粒
const STYLE = 'Shot like fine-art editorial photography printed in a classical concert-hall season programme: warm low-saturation palette of parchment beige, khaki, muted oxblood-ochre red and patinated bronze-green, warm tungsten and amber stage light, shadows in warm umber-brown rather than pure black, soft medium-format film grain, gentle matte print finish with slightly lifted blacks, calm dignified composition with generous negative space, timeless and elegant.'
const RULES = 'No text, no letters, no logo, no watermark, no signage, no readable posters or screens, no QR codes, no tickets, no recognizable faces (people seen from behind, in silhouette, backlit or out of focus).'

const WIDE = (desc) => `Photorealistic event photograph, wide landscape 3:2 composition. ${desc} ${STYLE} ${RULES}`
const TALL = (desc) => `Photorealistic event photograph, tall portrait 2:3 composition. ${desc} ${STYLE} ${RULES}`
const SQUARE = (desc) => `Photorealistic photograph, square 1:1 composition. ${desc} ${STYLE} ${RULES}`

const JOBS = [
  // 首頁 Hero（左下與下方 1/3 要暗、單純，壓主標；右下留空壓倒數小卡）
  ['hero-live-crowd', WIDE('Inside a live music venue, seen from the back of the crowd toward the stage: warm stage lights shine straight toward the camera through thin haze, forming soft beams; in the foreground a row of audience silhouettes raising their hands; the stage and musicians are small in the upper middle of the frame and their faces are not visible. The lower-left and the bottom third of the frame are darker and simple (deep warm umber shadow), the lower-right is also calm and empty. The main light and the crowd are concentrated in the center so a vertical crop still works.')],
  // 首頁情境卡（下方 1/3 要單純，壓文字）
  ['scene-music', TALL('Close view of a concert crowd singing along together with raised hands, some arms reaching toward the stage, warm stage light falling from above. Subject in the upper middle of the frame; the bottom third is darker and simple.')],
  ['scene-theatre', TALL('A small theatre auditorium seen from the back rows toward the stage: a single spotlight on one performer standing on an otherwise empty stage, in the foreground a few rows of seated audience heads in silhouette. Quiet and focused. The bottom third is darker.')],
  ['scene-market', TALL('An outdoor evening market aisle at dusk: handmade craft and snack stalls on both sides, string lights overhead, people seen from behind holding drinks and snacks. Subject in the middle band; the bottom third is simple.')],
  ['scene-talk', TALL('A small workshop: on a long wooden table, participants\' hands taking notes and doing handcraft (hands and tabletop are the focus), a speaker standing in the background in front of a softly blurred projection without any text, face not visible. Warm, focused learning atmosphere. The bottom third is simple.')],
  // 8 場活動主視覺（主體放中央，裁成 16:9、4:3、16:10 都要保留）
  ['event-midnight-noise', WIDE('A large live house electronic music show: on stage an electronic musician stands in silhouette behind a table of synthesizers and mixers, light beams and a few thin laser lines cut through haze, in the foreground a dense crowd in silhouette, several people wearing softly glowing wristbands. Subject concentrated in the center.')],
  ['event-island-monologue', WIDE('A black-box studio theatre: one contemporary dancer captured mid-extension under a single overhead light that makes a circle of light on the floor, the surroundings almost dark; along the lower edge the low silhouettes of the front floor-seat audience. The dancer is in the center, face not visible.')],
  ['event-riverside-market', WIDE('A riverside plaza in a modern Taiwanese city (Tainan) just after dusk: white tent craft stalls (pottery, leather, baking) lined along a canal bank with low modern concrete steps, string lights just switched on overhead, the water reflecting the lights, visitors seen from behind, ordinary low-rise Asian city buildings in the background. No domes, no churches, no European architecture. Stalls and river bank in the middle band.')],
  ['event-photo-composition', WIDE('A slightly top-down view of a tabletop set up for an online live-streamed photography talk: a camera, several printed photographs of street scenes and buildings with strong leading lines and frame-within-a-frame compositions (no text), a smartphone on a small tripod filming, a laptop beside it with a blurred glowing screen. Subject in the center.')],
  ['event-silent-realm', WIDE('A gallery inside a renovated old shophouse with exposed brick walls, wooden beams and high windows: large photographic prints of empty city streets hang on white walls; one visitor seen from behind stands in front of a print. Quiet, lots of empty space.')],
  ['event-night-run', WIDE('Runners on a riverside path in a modern Taiwanese city (Kaohsiung Love River) at night, seen from the side and behind with motion blur; reflective strips and waist packs glowing under street lamps, the river reflecting the lights of modern high-rise buildings and a low arched footbridge. No domes, no churches, no European architecture. No readable race numbers.')],
  ['event-resonance-friday', WIDE('A small basement nightclub: low ceiling with exposed pipes, a DJ booth in the middle background with the DJ in silhouette, a few people dancing on the floor. Smaller and more intimate than a big festival, no large lighting rigs.')],
  ['event-island-zine-fest', WIDE('A converted old warehouse exhibition: long tables covered with zines, photo books and handmade books, abstract screen-printed posters without any lettering on the walls, visitors\' hands leafing through publications, people seen from behind.')],
  ['event-midnight-noise-stage', WIDE('A wide view of one venue with two stages on the left and right lit at the same time, their lights crossing in the middle above the crowd standing between the two stages. Keep the subject inside the horizontal middle band of the frame (top and bottom quarters will be cropped).')],
  ['venue-entrance', WIDE('The entrance of a live house next to a large shopping mall at dusk: building facade and entrance canopy, a queue of people seen from behind waiting to enter, the pavement wet and reflective after rain. Absolutely no signage or lettering anywhere.')],
  // 主辦方歷史活動縮圖
  ['organizer-past-1', SQUARE('A small live house show: one electronic musician on stage with a synthesizer, the crowd standing close to the stage. Subject centered.')],
  ['organizer-past-2', SQUARE('A night-time outdoor electronic music festival seen from afar: a large lighting truss structure glowing above a big crowd.')],
  ['organizer-past-3', SQUARE('A merchandise stall at a music event: a stack of vinyl records and neatly folded plain T-shirts without any print, warm stall lighting.')],
  ['organizer-past-4', SQUARE('A close view of a crowd at an electronic music festival, many people raising hands wearing softly glowing wristbands.')],
  // 首頁主辦方轉換帶（主體在中間偏右，左半部暗而單純）
  ['organizer-cta', WIDE('At an event entrance, the moment of ticket check: a staff member\'s hand holding a handheld scanner aimed at a visitor\'s phone (the phone screen is just a bright glow, no content), a softly blurred queue in the background. Subject in the middle-right; the left half of the frame is dark and simple, deep warm umber.')],
  // 首頁評價頭像（縮到 48px 也要看得出主題）
  ['review-late-night-gigs', SQUARE('A very simple close-up silhouette of one raised hand in front of a warm glowing stage light. Minimal composition that still reads at 48 pixels.')],
  ['review-weekend-market-go', SQUARE('A very simple close-up of a clear transparent umbrella on a rainy night at a market entrance, string-light bokeh and wet ground reflections behind it. Minimal composition.')],
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
      // 寬幅 1600px（Hero 2000px）、方圖與直式圖維持原尺寸（最長邊 1536px），JPEG 品質 80 左右
      const max = name === 'hero-live-crowd' ? '2000' : /^(organizer-past|review)-/.test(name) ? '1024' : /^scene-/.test(name) ? '1536' : '1600'
      execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '80', '--resampleHeightWidthMax', max, raw, '--out', out], { stdio: 'ignore' })
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
