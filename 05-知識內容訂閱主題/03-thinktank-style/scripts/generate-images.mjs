// ============================================================
// 產生 03 高端政經智庫的作者頭像、文章封面與內文配圖（Codex CLI image_generation）
// 圖片清單（檔名、比例、主體）照主題的 IMAGES.md：頭像 8、封面 8、內文配圖 1，共 17 張
//
// 需求：已登入的 codex CLI（>= 0.150）、macOS sips（裁切、縮圖、轉 JPEG）
// 用法：
//   node scripts/generate-images.mjs                         # 產生缺少的圖片（已存在的會跳過）
//   node scripts/generate-images.mjs --only avatar-chen,cover-caseload  # 只產生指定檔名
//   node scripts/generate-images.mjs --force                 # 全部重新產生
//   CONC=1 node scripts/generate-images.mjs                  # 並行數（預設 2）
//
// 換風格時：修改 STYLE（整組圖的共同調性）與各張描述即可，檔名維持不變，不用改 HTML。
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
const RAW = path.join(os.tmpdir(), 'fieldnotes-thinktank-raw-images') // 原始 PNG（不進版控）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 2)

// 整組圖的共同調性：政經週刊、智庫報告裡的冷調報導攝影
// 中性偏冷的自然光、低彩度（石板灰、深藍、乾淨的白）、細節清楚、構圖安靜，不要戲劇性打光
const STYLE = 'Visual tone: cool-toned editorial reportage photography as published in a serious policy journal or a quality weekly news magazine. Neutral to slightly cool daylight, restrained desaturated palette dominated by slate grey, deep navy blue and clean whites with natural skin tones kept true, crisp detail, calm documentary composition, honest and unglamorous, subtle fine film grain, no dramatic color grading, no warm orange cast. No text, no readable writing anywhere, no logos, no brand marks, no watermark.'

// 共同 prompt 片段（IMAGES.md 的風格中立描述）＋ 本風格 STYLE
const AVATAR = (person, place) => `Photorealistic head-and-shoulders portrait, square 1:1, of a fictional Taiwanese ${person}, natural relaxed expression looking at the camera, face clearly lit and centered with headroom so a circular or square crop does not cut the face, background is their real workplace (${place}) softly out of focus. Shot like an expert contributor portrait in a policy journal: eye-level, 85mm lens, soft window light. ${STYLE}`
const COVER = (subject) => `Photorealistic editorial photograph, wide landscape 3:2 composition with the main subject inside the central 70% of the frame (top and bottom edges will be cropped to 1200x630). ${subject} Signs of real work, but no faces (hands, backs or distant blurred figures only). ${STYLE}`
const FIGURE = (subject) => `Photorealistic documentary photograph, wide landscape 3:2 composition that will be cropped to 16:9. ${subject} ${STYLE}`

// [檔名, prompt, 類型]：類型決定裁切與尺寸（avatar 600×600、cover 1200×630、figure 1536×864）
const JOBS = [
  // A. 作者頭像（性別、年齡、服裝與背景照 IMAGES.md，3 套風格一致）
  ['avatar-chen', AVATAR('man in his late 30s, short hair, the chef-owner of a small independent bistro, wearing a dark chef jacket with sleeves rolled up', 'the open kitchen and bar counter of a small bistro'), 'avatar'],
  ['avatar-wang', AVATAR('woman in her early 30s, hair tied back, a semiconductor packaging process engineer, wearing a plain work jacket over a company polo shirt, a blank ID badge on a lanyard (the badge has no text)', 'an office corridor of a factory with glass windows looking onto equipment bays; she is not wearing a cleanroom suit'), 'avatar'],
  ['avatar-lin', AVATAR('man in his late 40s with a tanned complexion and short hair, an agricultural export sales manager, wearing a collared work shirt under a utility vest', 'a fruit packing house with stacked plastic crates of pineapples'), 'avatar'],
  ['avatar-su', AVATAR('woman in her mid 30s with short hair, owner of an independent bookstore, wearing a linen shirt under a knit cardigan', 'wooden bookshelves in a small bookstore; book spines are blurred and unreadable'), 'avatar'],
  ['avatar-guo', AVATAR('man in his early 30s wearing glasses, an independent game studio producer, wearing a plain T-shirt and a hoodie', 'a small studio with several monitors showing abstract blocks of color, nothing readable'), 'avatar'],
  ['avatar-fang', AVATAR('woman in her late 30s with neatly kept hair, a domestic violence prevention social work supervisor, wearing a plain top, calm and composed', 'an office with filing cabinets and a whiteboard with nothing readable on it'), 'avatar'],
  ['avatar-huang', AVATAR('man around 30 years old, a convenience store chain site-selection specialist, wearing a short-sleeved shirt and a light jacket', 'a city street corner and sidewalk in daytime, no signs or brands visible'), 'avatar'],
  ['avatar-zheng', AVATAR('woman in her early 30s, a concert production coordinator, wearing a black T-shirt with a headset intercom hanging around her neck', 'the backstage of a performance venue with stage lighting rigs, empty'), 'avatar'],

  // B. 文章封面（不拍人臉，主體放在畫面中央 70%）
  ['cover-restaurant-costs', COVER('The dining room of a small independent bistro before service: four-person tables set one after another receding into the room, the four-top table in the foreground especially clear and sharp (the table is the subject of the story). Eye-level or slightly elevated oblique angle, tables leading from front to back, overcast daylight from the front windows.'), 'cover'],
  ['cover-chip-packaging', COVER('A semiconductor assembly and test production line: an automated machine with a robotic arm picking up a chip, in the foreground a silicon wafer mounted on a frame. Close-up of the robotic arm, the machines behind softly out of focus, cool clean factory light.'), 'cover'],
  ['cover-pineapple-export', COVER('A fruit packing house where fresh pineapples are being graded and packed into boxes, rows of pineapples in the foreground, behind them the open doors of a refrigerated shipping container (cold chain). Hands of a worker at the edge of the frame only.'), 'cover'],
  ['cover-bookstore-cashflow', COVER('A small independent bookstore seen from the entrance looking inside: a display table of books near the door, and at the back of the shop folding chairs arranged in rows for an evening talk. All book spines, covers and posters are blurred and unreadable.'), 'cover'],
  ['cover-game-launch', COVER('A small game studio late at night seen from behind an empty office chair looking at a wall of several monitors showing abstract monitoring charts with a line that suddenly spikes upward (no readable text or numbers), a half-finished drink on the desk, the room lit mainly by the screens.'), 'cover'],
  ['cover-caseload', COVER('A social worker\'s office desk shot from a 45-degree overhead angle as a still life: a tall stack of case folders with blank labels, a weekly planner filled with dense unreadable handwriting, a desk telephone and a bunch of car keys (for home visits).'), 'cover'],
  ['cover-store-location', COVER('A high-angle view from a pedestrian bridge down onto a city road: a raised median strip runs down the center of the frame, pedestrians walking on the sidewalks on both sides, and a corner shopfront on each side of the road with no signs, no brand colors and nothing readable.'), 'cover'],
  ['cover-concert-pricing', COVER('An empty concert arena before the show seen from the stage looking out at the audience area: a standing pit in front, tiers of seats rising behind it, lighting rigs overhead, wide-angle from the stage viewpoint, house lights on.'), 'cover'],

  // C. 文章內文配圖
  ['figure-kitchen-pass', FIGURE('A busy Friday evening at the pass of a bistro kitchen (the window between kitchen and dining room) at 19:40 peak service: a ticket rail packed with about fourteen order tickets (handwriting unreadable), several freshly plated dishes waiting under heat lamps, a cook\'s hands plating a dish with slight motion blur; busy but orderly. Eye-level from the dining room side, plates in the foreground and the kitchen behind.'), 'figure'],
]

function run(prompt) {
  return new Promise((resolve) => {
    const child = spawn('codex', ['exec', '--enable', 'image_generation', '-s', 'workspace-write', '--skip-git-repo-check', `$imagegen ${prompt}`],
      { cwd: os.tmpdir(), stdio: ['ignore', 'pipe', 'pipe'] })
    const buf = []
    child.stdout.on('data', (d) => buf.push(d))
    child.stderr.on('data', (d) => buf.push(d))
    const timer = setTimeout(() => child.kill('SIGKILL'), 10 * 60 * 1000)
    child.on('close', (code) => { clearTimeout(timer); resolve({ code, log: Buffer.concat(buf).toString() }) })
  })
}

// 先裁切、再縮放、最後轉 JPEG（品質 80）
// - 頭像：1024 × 1024 → 600 × 600
// - 封面：1536 × 1024 → 中央裁成 1536 × 806 → 1200 × 630（約 1.91:1，也是分享卡片的尺寸）
// - 配圖：1536 × 1024 → 中央裁成 1536 × 864（16:9）
// 裁切框依原圖實際尺寸計算（codex 偶爾會給出不同比例），取置中、符合目標比例的最大範圍
const TARGET = { avatar: [600, 600], cover: [1200, 630], figure: [1536, 864] }
function finish(raw, out, kind) {
  const tmp = `${raw}.tmp.png`
  const sips = (...args) => execFileSync('sips', args, { stdio: ['ignore', 'pipe', 'ignore'] }).toString()
  const info = sips('-g', 'pixelWidth', '-g', 'pixelHeight', raw)
  const w = Number(info.match(/pixelWidth: (\d+)/)[1])
  const h = Number(info.match(/pixelHeight: (\d+)/)[1])
  const [tw, th] = TARGET[kind]
  const cropW = Math.min(w, Math.round((h * tw) / th))
  const cropH = Math.min(h, Math.round((w * th) / tw))
  sips('-c', String(cropH), String(cropW), raw, '--out', tmp) // -c 是「高 寬」，以中心裁切
  if (cropW > tw) sips('-z', String(th), String(tw), tmp, '--out', tmp)
  sips('-s', 'format', 'jpeg', '-s', 'formatOptions', '80', tmp, '--out', out)
  return fs.rm(tmp, { force: true })
}

async function one([name, prompt, kind]) {
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
      await finish(raw, out, kind)
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
