// ============================================================
// 產生 03 電競競技場的活動照片（Codex CLI image_generation）
//
// 需求：已登入的 codex CLI（>= 0.150）、macOS sips（轉 JPEG 與縮圖）
// 用法：
//   node scripts/generate-images.mjs                                   # 產生缺少的圖片（已存在的會跳過）
//   node scripts/generate-images.mjs --only hero-live-crowd,scene-music # 只產生指定檔名
//   node scripts/generate-images.mjs --force                           # 全部重新產生
//   CONC=1 node scripts/generate-images.mjs --only a,b,c               # 並行數（預設 4；本套分批生成時用 1，一次最多 5 張）
//
// 檔名與畫面主體照上一層的 IMAGES.md（3 套風格共用同一份清單）。
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
const RAW = path.join(os.tmpdir(), 'stageone-esports-raw-images') // 原始 PNG（不進版控）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 4)

// 整組圖的共同調性：電競聯賽官方攝影師。冷色溫、曜石灰暗部（保留細節，不壓成純黑），
// 金屬藍的輪廓光與 LED 邊光勾出剪影，薄霧接住光束，對稱或硬斜線構圖。
// 白天、戶外、市集、講座這幾張最容易變暖，一律調成冷藍的藍調時刻；暖色燈泡改成白藍 LED
const STYLE = 'Shot like the official photographer of a professional esports league arena: cool color temperature around 7000K, deep obsidian-graphite shadows that keep detail instead of crushing to pure black, metallic electric-blue rim light and LED edge light carving out silhouettes, crisp high-shutter detail with subtle horizontal anamorphic flare streaks, light haze catching the beams, clean carbon-gray surfaces and brushed-metal reflections, strong symmetrical or hard diagonal compositions with a clear focal point. Even daytime and outdoor subjects are graded to a cool blue-hour look with steel-blue shadows; warm bulbs and string lights read as white-blue LEDs. No neon pink, no green, no warm tungsten orange, no film grain, no text, no logos, no screens with readable content, no recognizable faces (backs, silhouettes, rim-lit profiles in shadow, hands only).'
const RULES = 'No text, no letters, no numbers, no logo, no watermark, no signage, no readable posters or screens, no QR codes, no tickets, no app interfaces.'

// 依 IMAGES.md 的「生成」欄寫比例：wide landscape 3:2、square 1:1、tall portrait 2:3
const WIDE = (desc) => `Photorealistic event photograph, wide landscape 3:2 composition. ${desc} ${STYLE} ${RULES}`
const TALL = (desc) => `Photorealistic event photograph, tall portrait 2:3 composition. ${desc} ${STYLE} ${RULES}`
const SQUARE = (desc) => `Photorealistic event photograph, square 1:1 composition. ${desc} ${STYLE} ${RULES}`

const JOBS = [
  // 首頁 Hero：左半要暗而單純（壓碳纖維遮罩、主標與按鈕），右下留空（壓倒數對戰卡），下緣 96px 會疊指令列
  ['hero-live-crowd', WIDE('Inside a packed live house, seen from behind the crowd looking toward the stage: cold white-blue stage lights blast straight back at the camera through haze, forming sharp parallel beams; in the foreground a row of audience silhouettes with both hands raised, rim-lit in steel blue; the stage and performers are small in the upper middle of the frame, faces unreadable. Left half darker and simple for overlaid text: the lower-left and the whole left third fall into deep graphite shadow, the lower-right is also dark and empty. The light and crowd are concentrated in the centre-right so a tall crop still works.')],

  // 首頁情境卡（直式 2:3，下方 1/3 較暗；頁面會裁成平行四邊形的 4:5）
  ['scene-music', TALL('Close view of a concert crowd singing along together, many arms raised high, a few people holding phone lights and stretching their arms toward the stage, cold blue-white beams of stage light falling from above through haze. Subject in the upper-middle; the bottom third is darker and simple.')],
  ['scene-theatre', TALL('A small theatre auditorium seen from the back rows: a single cool white spotlight falls on one performer standing on an otherwise empty stage, rows of seated audience in front shown only as dark head silhouettes with thin blue rim light. Quiet and focused. Bottom third dark.')],
  ['scene-market', TALL('An outdoor evening market alley at blue hour: handmade craft and street-food stalls on both sides, strings of small white-blue LED bulbs overhead, people seen from behind carrying drinks and snacks, steel-blue shadows. Subject in the middle of the frame, the bottom third simple and dark.')],
  ['scene-talk', TALL('A small workshop in a clean modern studio: on a long dark table, participants\' hands taking notes and making crafts, in the background a speaker standing beside a blurred projection with no readable content, face not visible. Focused learning mood, lit by cool daylight-balanced lamps with a blue edge light from the projection. Bottom third simple.')],

  // 8 場活動主視覺（3:2，主體置中，裁成 16:9、4:3、16:10 都要保留主體）
  ['event-midnight-noise', WIDE('A large live house electronic music show: on stage an electronic musician silhouetted behind a table of synthesizers and mixers, cold blue-white light shafts and thin beams cutting through dense haze in a symmetrical fan, a dense crowd of silhouettes in the foreground, several raised wrists wearing glowing ice-blue glow-bracelets. Subject concentrated in the centre so 16:9 and 4:3 crops keep both stage and crowd.')],
  ['event-island-monologue', WIDE('A black-box studio theatre: one single contemporary dancer caught mid-stretch under one single cool white top light that makes a round pool of light on the dark floor, everything around is deep graphite shadow; at the bottom edge the low silhouettes of the front-row floor-seat audience. The dancer is in the centre.')],
  ['event-riverside-market', WIDE('A riverside plaza at blue hour just after dusk: a row of white tent craft stalls (pottery, leather, baking) along the river bank, overhead strings of white-blue LED lights just switched on, the water reflecting the lights in long cool streaks, visitors seen from behind. Stalls and riverbank in the middle band of the frame.')],
  ['event-photo-composition', WIDE('Slightly top-down view of a dark carbon-gray desk set up for an online live-streamed photography lecture: a camera, several printed photographs showing strong leading lines and frame-within-a-frame compositions of streets and buildings (no text), a phone on a small tripod recording, a laptop beside it with a glowing but blurred blue screen. Cool, clean light. Subject centred.')],
  ['event-silent-realm', WIDE('A gallery inside a renovated old townhouse with brick walls, timber beams and high windows at blue hour: large photographic prints of empty, deserted city streets hang on white walls lit by cool track lights, one visitor seen from behind standing in front of a print. Quiet, lots of negative space, cool steel-blue shadows.')],
  ['event-night-run', WIDE('Runners on a riverside path at night, seen from the side and behind with motion blur, reflective strips and waist packs glowing under cold white street lights, the river reflecting city lights in blue streaks. Hard diagonal composition. No readable race bibs.')],
  ['event-resonance-friday', WIDE('A small basement club: low concrete ceiling with exposed metal pipes, a DJ booth in the middle distance with the DJ as a rim-lit silhouette, a few people dancing on the small dance floor. Smaller and more intimate than a big festival, no big lighting rigs, just a few cold blue LED strips and one white spot.')],
  ['event-island-zine-fest', WIDE('A converted old warehouse exhibition under cool daylight from high windows: long tables covered with zines, photo books and handmade books, abstract screen-printed posters with no lettering hanging on the walls, visitors\' hands flipping through publications and figures seen from behind. Steel-blue shadows, clean concrete floor.')],
  ['event-midnight-noise-stage', WIDE('Wide view of one venue with two stages on the left and right both lit at the same time with cold blue-white light, their beams crossing in the middle above the crowd that fills the space between the stages, symmetrical composition. The main subject sits in a horizontal band across the middle of the frame (top and bottom quarters will be cropped).')],
  ['venue-entrance', WIDE('The entrance of a live house next to a large shopping mall at blue hour: modern building facade of glass and brushed metal and an entrance canopy with cool LED edge lighting, people queuing to get in seen from behind, the ground wet and reflective after rain. Absolutely no signs, letters or brand marks anywhere.')],

  // 主辦方歷史活動（方形縮圖）
  ['organizer-past-1', SQUARE('A small live house show: on stage one electronic musician with a synthesizer, rim-lit in electric blue, the crowd standing very close to the stage. Subject centred.')],
  ['organizer-past-2', SQUARE('A wide view of an outdoor night-time electronic music festival: a huge truss lighting rig throwing cold blue-white beams and a big crowd far away.')],
  ['organizer-past-3', SQUARE('A merch stall at a music event: a stack of vinyl records and neatly folded plain charcoal T-shirts without any print or lettering, on a dark metal counter lit by a cool white lamp.')],
  ['organizer-past-4', SQUARE('A close view of a crowd from a previous edition of the festival: many raised hands wearing glowing ice-blue glow-bracelets against haze and blue beams.')],

  // 首頁主辦方轉換帶：主體在中間偏右，左半部暗而單純（壓標題）
  ['organizer-cta', WIDE('At an event entrance, the moment of ticket check: a staff member\'s hand holds a handheld scanner pointed at an attendee\'s phone (the phone screen is just a bright blue-white glow, no content visible), a soft-focus queue of people behind. The subject is in the centre-right. Left half darker and simple for overlaid text.')],

  // 首頁評價頭像（方形，縮到 48px 仍看得出主體）
  ['review-late-night-gigs', SQUARE('Extremely simple composition: one raised hand silhouetted against a burst of cold blue-white stage light behind it.')],
  ['review-weekend-market-go', SQUARE('Extremely simple composition: a close-up of a clear transparent umbrella on a rainy night, bokeh of white-blue LED string lights and wet reflections behind it.')],
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
      // 寬幅最長邊 1600px（品質 80）、直式 1536px、方圖 1024px（品質 78）
      const square = /^(organizer-past-|review-)/.test(name)
      const tall = /^scene-/.test(name)
      const max = square ? '1024' : tall ? '1536' : '1600'
      execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', square ? '78' : '80', '--resampleHeightWidthMax', max, raw, '--out', out], { stdio: 'ignore' })
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
