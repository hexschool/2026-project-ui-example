// ============================================================
// 產生 06 嘉年華主題樂園的活動照片（Codex CLI image_generation）
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
const RAW = path.join(os.tmpdir(), 'stageone-carnival-raw-images') // 原始 PNG（不進版控）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 2)

// 整組圖的共同調性：像遊樂園節慶指南裡的活動照片：明亮、奶油色高光、糖果紅與鮮黃點綴、海軍藍的陰影與夜空、暖白燈泡串的大圓散景
// 主體不變（Live House、劇場仍是 Live House、劇場），只是燈光換成紅黃藍舞台光＋暖白燈泡，不要畫成摩天輪或遊樂設施
// 本風格的照片多半放在拱窗、圓角框與票券裡，主體要在中央安全範圍（拱頂會切掉上方兩角）
const STYLE = 'Bright cheerful editorial photography for an amusement-park festival guide: sunny daylight or early evening with warm white bulb strings, high-key creamy highlights, saturated but never neon accents of candy red and sunshine yellow set against deep navy shadows and night skies, clean crisp focus with shallow depth of field and big round bokeh from string lights, festive confetti-like color but tidy uncluttered backgrounds, joyful lively mood. Night and indoor stage scenes are lit by warm white bulbs and a colourful red, yellow and navy stage wash, bright enough to read every shape, never murky or gloomy. Keep the main subject inside the central safe area of the frame.'
const RULES = 'No text, no letters, no logo, no watermark, no signage, no readable signs, posters or screens, no QR codes, no tickets, no recognizable faces (backs, silhouettes, hands, figures in soft focus), no children in close-up. Do not turn the scene into a fairground ride, carousel or Ferris wheel.'

const WIDE = (desc) => `Photorealistic event photograph, wide landscape 3:2 composition. ${desc} ${STYLE} ${RULES}`
const TALL = (desc) => `Photorealistic event photograph, tall portrait 2:3 composition. ${desc} ${STYLE} ${RULES}`
const SQUARE = (desc) => `Photorealistic photograph, square 1:1 composition. ${desc} ${STYLE} ${RULES}`

const JOBS = [
  // 首頁 Hero：畫面正中央會壓一塊奶油色跑馬燈招牌（H1 置中），所以左右兩側要有看頭；右下留空壓倒數票
  ['hero-live-crowd', WIDE('Inside a lively live music venue, seen from the back of the crowd toward the stage: warm white bulb strings hang in big loops across the ceiling, the stage glows with a red, sunshine-yellow and navy light wash through thin haze; a row of audience silhouettes raising their hands fills the whole width of the frame; the band is small in the upper middle, faces not visible. The left and right thirds carry the most interesting detail (raised hands, string-light bokeh) because the middle will be covered by a sign; the lower-right corner is calm and simple. Bright and joyful, not dark.')],
  // 首頁情境卡（放進上緣半圓拱頂的拱窗，主體在中央）
  ['scene-music', TALL('Close view of a concert crowd singing along together with raised hands, some arms reaching toward the stage, warm white bulb strings and a red and yellow stage light falling from above, navy night shadows. Subject in the center of the frame.')],
  ['scene-theatre', TALL('A small theatre auditorium seen from the back rows toward the stage: a single warm spotlight on one actor in plain dark modern clothes standing with their back turned to the audience (face not visible, no costume, not a fairy-tale character), a stage framed by a red curtain, in the foreground a few rows of seated audience heads in soft silhouette. Quiet and focused but still warm and readable. Subject in the center.')],
  ['scene-market', TALL('An outdoor evening market aisle at golden hour: handmade craft and snack stalls with red-and-cream striped awnings on both sides, warm white string lights overhead, people seen from behind holding drinks and snacks. Subject in the center.')],
  ['scene-talk', TALL('A small bright workshop: on a long wooden table, participants\' hands taking notes and doing handcraft with colourful paper and pens (hands and tabletop are the focus), a speaker standing in the soft-focus background in front of a blurred projection without any text, face not visible. Cheerful daylight, cream walls. Subject in the center.')],
  // 8 場活動主視覺（主體放中央，裁成 16:9、4:3、16:10 都要保留）
  ['event-midnight-noise', WIDE('A large live house electronic music show: on stage an electronic musician stands in silhouette behind a table of synthesizers and mixers, beams of red, yellow and warm white light cut through haze over a navy-blue dark ceiling, in the foreground a dense happy crowd in silhouette, several people wearing softly glowing wristbands. Subject concentrated in the center.')],
  ['event-island-monologue', WIDE('A black-box studio theatre: one contemporary dancer captured mid-extension under a single warm overhead light that makes a circle of light on the floor, deep navy surroundings with a faint red rim light; along the lower edge the low silhouettes of the front floor-seat audience. The dancer is in the center, face not visible.')],
  ['event-riverside-market', WIDE('A riverside plaza in a modern Taiwanese city (Tainan) just after sunset: white and red-striped tent craft stalls (pottery, leather, baking) lined along a canal bank with low modern concrete steps, warm white bulb strings just switched on overhead, the water reflecting the lights under a deep navy dusk sky, visitors seen from behind, ordinary low-rise Asian city buildings in the background. No domes, no churches, no European architecture. Stalls and river bank in the middle band.')],
  ['event-photo-composition', WIDE('A slightly top-down view of a bright tabletop set up for an online live-streamed photography talk on a cream surface: a camera, several printed photographs of street scenes and buildings with strong leading lines and frame-within-a-frame compositions (no text), a smartphone on a small tripod filming, a laptop beside it with a blurred glowing screen, a red mug and a yellow notebook as colour accents. Subject in the center.')],
  ['event-silent-realm', WIDE('A bright gallery inside a renovated old shophouse with exposed brick walls, wooden beams and high windows letting in sunny daylight: large photographic prints of empty city streets hang on cream white walls; one visitor seen from behind stands in front of a print. Calm, airy, lots of empty space. Subject in the center.')],
  ['event-night-run', WIDE('Runners on a riverside path in a modern Taiwanese city (Kaohsiung Love River) at night, seen from the side and behind with motion blur; reflective strips and waist packs glowing under warm street lamps and strings of bulbs, the river reflecting city lights under a deep navy sky, a low arched footbridge. No domes, no churches, no European architecture. No readable race numbers. Subject in the center.')],
  ['event-resonance-friday', WIDE('A small basement nightclub: low ceiling with exposed pipes wrapped in warm white bulb strings, a DJ booth in the middle background with the DJ in silhouette, red and yellow light wash, a few people dancing on the floor. Smaller and more intimate than a big festival, no large lighting rigs.')],
  ['event-island-zine-fest', WIDE('A converted old warehouse exhibition in bright daylight: long tables covered with colourful zines, photo books and handmade books, abstract screen-printed posters in red, yellow and navy without any lettering on the walls, visitors\' hands leafing through publications, people seen from behind. Subject in the center.')],
  ['event-midnight-noise-stage', WIDE('A wide view of one venue with two stages on the left and right lit at the same time in red, yellow and warm white, their light beams crossing in the middle above the happy crowd standing between the two stages, navy-dark ceiling. Keep the subject inside the horizontal middle band of the frame (top and bottom quarters will be cropped).')],
  ['venue-entrance', WIDE('The entrance of a live house next to a large shopping mall at early evening: building facade and an entrance canopy edged with warm white bulbs, a cheerful queue of people seen from behind waiting to enter, the pavement wet and reflective after rain under a deep navy sky. Absolutely no signage or lettering anywhere. Subject in the center.')],
  // 主辦方歷史活動縮圖
  ['organizer-past-1', SQUARE('A small live house show seen from inside the crowd: one electronic musician on stage behind a synthesizer, strongly backlit by red and yellow stage light so the musician is a dark silhouette with no visible face, the backs of the crowd standing close to the stage in the foreground. Subject centered.')],
  ['organizer-past-2', SQUARE('A night-time outdoor electronic music festival seen from afar: a large lighting truss glowing warm white, red and yellow above a big crowd under a deep navy sky. Subject centered.')],
  ['organizer-past-3', SQUARE('A merchandise stall at a music event: a stack of vinyl records and neatly folded plain red, cream and navy T-shirts without any print, warm bulb-string stall lighting. Subject centered.')],
  ['organizer-past-4', SQUARE('A close view of a happy crowd at an electronic music festival, many people raising hands wearing softly glowing wristbands, warm bulb bokeh behind. Subject centered.')],
  // 首頁主辦方轉換帶（會疊 75% 海軍藍遮罩，主體在中間偏右，左半部單純）
  ['organizer-cta', WIDE('At a festive event entrance under warm white bulb strings, the moment of ticket check: a staff member\'s hand holding a handheld scanner aimed at a visitor\'s phone (the phone screen is just a bright glow, no content), a softly blurred cheerful queue in the background. Subject in the middle-right; the left half of the frame is simple, deep navy evening shadow.')],
  // 首頁評價頭像（放在代幣圓框裡，縮到 48px 也要看得出主題）
  ['review-late-night-gigs', SQUARE('A very simple close-up silhouette of one raised hand in front of a big warm glowing stage light with red and yellow bokeh. Minimal composition that still reads at 48 pixels.')],
  ['review-weekend-market-go', SQUARE('A very simple close-up of a clear transparent umbrella on a rainy evening at a market entrance, warm white string-light bokeh and wet ground reflections behind it. Minimal composition.')],
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
