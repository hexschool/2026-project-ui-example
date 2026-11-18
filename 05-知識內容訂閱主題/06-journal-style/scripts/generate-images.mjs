// ============================================================
// 產生 06 手帳筆記插畫風的作者頭像、文章封面與內文配圖（Codex CLI image_generation）
// 圖片清單（檔名、比例、畫面主體）照主題層的 IMAGES.md，共 17 張
//
// 需求：已登入的 codex CLI（>= 0.150）、macOS sips（裁切、縮放與轉 JPEG）
// 用法：
//   node scripts/generate-images.mjs                          # 產生缺少的圖片（已存在的會跳過）
//   node scripts/generate-images.mjs --only avatar-chen,cover-caseload  # 只產生指定檔名
//   node scripts/generate-images.mjs --force                  # 全部重新產生
//   CONC=2 node scripts/generate-images.mjs                   # 並行數（預設 1）
//
// 換風格時：修改 STYLE（整組圖的共同調性）與各張描述，檔名維持不變即可，不用改程式。
// 原理：codex exec 的輸出會存在 ~/.codex/generated_images/<session id>/，
//       從 log 解析 session id 就能對應到正確的檔案，所以可以安全地並行。
// 本風格的照片保留原色：早晨日光、明亮乾淨，點綴色是珊瑚與抹茶。
// 拍立得白框、紙膠帶、傾斜都是 CSS 做的，prompt 明確要求照片本身不能有這些東西。
// ============================================================
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { spawn, execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(HERE, '../images')
const RAW = path.join(os.tmpdir(), 'fieldnotes-journal-raw-images') // 原始 PNG（不進版控）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 1)

// 整組圖的調性：明亮的早晨生活紀實攝影，像夾在手帳裡的一張隨手拍
// 和 04 溫暖心靈慢讀（午後窗光、燕麥焦糖、低對比）拉開：06 是早晨日光、更亮、更乾淨，點綴色是珊瑚與抹茶
const STYLE = 'Bright, airy lifestyle documentary photography with a cozy notebook-snapshot feel: soft diffused morning daylight, gently lifted shadows, low-to-medium contrast, clean warm-white highlights (not yellow, not sepia), a light creamy palette with soft coral-peach and fresh matcha-green accents where they naturally occur (plants, ceramics, fabric, produce), natural true-to-life skin tones, subtle fine film grain like a point-and-shoot snapshot, tidy and uncluttered with a little breathing room. Photographic only: no drawings, no stickers, no doodles, no tape, no polaroid frame, no border and no text added to the photo.'

// 共同 prompt 片段：照 IMAGES.md 的「風格中立」寫法，後面接本風格的 STYLE
const AVATAR = (person, place) => `Photorealistic head-and-shoulders portrait, square 1:1, of a fictional Taiwanese ${person}, natural relaxed expression looking at the camera, face clearly lit and centered with headroom so a circular or square crop does not cut the face, background is their real workplace (${place}) softly out of focus. No text, no logos, no brand marks, no watermark. ${STYLE}`
const COVER = (subject) => `Photorealistic editorial photograph, wide landscape 3:2 composition with the main subject inside the central 70% of the frame (top and bottom edges will be cropped to 1200x630). ${subject} Signs of real work, but no faces (hands, backs or distant blurred figures only). No readable text anywhere, no logos, no brand marks, no watermark. ${STYLE}`
const FIGURE = (subject) => `Photorealistic documentary photograph, wide landscape 3:2 composition that will be cropped to 16:9. ${subject} No readable text anywhere, no logos, no brand marks, no watermark. ${STYLE}`

const JOBS = [
  // A. 作者頭像（8 張，1:1 → 600 × 600）
  ['avatar-chen', AVATAR('man in his late 30s, the chef and owner of a small independent bistro, short hair, dark chef jacket with an apron and rolled-up sleeves', 'the open kitchen and bar counter of a small bistro')],
  ['avatar-wang', AVATAR('woman in her early 30s, a process engineer at a semiconductor packaging and testing plant, hair tied back, plain work jacket over a company polo shirt, a blank ID badge with no writing hanging from a lanyard', 'a factory office corridor with equipment visible behind a glass window; she is not wearing a cleanroom suit')],
  ['avatar-lin', AVATAR('man in his late 40s, export sales manager at an agricultural export company, sun-tanned skin, short hair, collared work shirt or work vest', 'a produce packing and collection yard with stacked plastic crates of pineapples')],
  ['avatar-su', AVATAR('woman in her mid 30s, owner of a small independent bookstore in Tainan, short hair or a low ponytail, linen shirt or knit cardigan', 'wooden bookshelves of a small bookstore, book spines blurred and unreadable')],
  ['avatar-guo', AVATAR('man in his early 30s, producer at a small independent game studio, glasses, plain T-shirt or hoodie', 'a small studio with several monitors on desks showing only abstract blocks of tone, no readable content')],
  ['avatar-fang', AVATAR('woman in her late 30s, a domestic violence prevention social work supervisor, neat hair, plain top, calm and gentle presence', 'an office with filing cabinets and a whiteboard with no readable writing')],
  ['avatar-huang', AVATAR('man around 30, a store expansion specialist for a convenience store chain, short-sleeved shirt or light jacket', 'a city street corner and sidewalk in daytime, with no shop signs or brands')],
  ['avatar-zheng', AVATAR('woman in her early 30s, production coordinator at a live events agency, black T-shirt, an intercom headset hanging around her neck', 'backstage of a concert venue, or an empty stage with lighting trusses')],

  // B. 文章封面（8 張，3:2 → 中央裁成 1200:630 → 1200 × 630）
  ['cover-restaurant-costs', COVER('The dining room of a small independent bistro before service: four-person tables set one after another receding into the room, the nearest four-person table in the foreground especially clear and sharp (the table is the hero of this story). Eye-level or slightly elevated oblique angle, the tables extending from front to back.')],
  ['cover-chip-packaging', COVER('A semiconductor packaging and testing production line: an automated machine with a robotic arm picking up a chip, and in the foreground a wafer mounted on a frame. Close-up of the robotic arm, the machines behind softly out of focus.')],
  ['cover-pineapple-export', COVER('Fresh pineapples being graded and packed into boxes at a produce collection yard, rows of pineapples in the foreground, and in the background the open door of a refrigerated shipping container (cold chain).')],
  ['cover-bookstore-cashflow', COVER('A small independent bookstore seen from the doorway looking inside: a display table of books at the entrance, and at the back of the shop rows of folding chairs set up for a talk. Book spines and posters are unreadable.')],
  ['cover-game-launch', COVER('A small game studio late at night seen from behind an empty office chair looking at a wall of several monitors showing abstract monitoring graphs where a line suddenly spikes upward (no readable text), a half-finished drink on the desk and a small potted plant. No people, or only a blurred figure from behind. It is late at night, so the room is darker than the other photos, lit softly by a warm desk lamp and the screens; keep it clean and calm with no blue or purple neon glow.')],
  ['cover-caseload', COVER('A social worker\'s desk as a still life from above or at 45 degrees: a tall stack of case folders with blank labels, a weekly planner filled with unreadable handwriting, a desk phone and a bunch of car keys for home visits.')],
  ['cover-store-location', COVER('A high-angle view from a pedestrian bridge looking down at a city road with a raised median strip running through the center of the frame, people walking on the sidewalks on both sides, and one corner shopfront on each side of the road without any signs or brand colors.')],
  ['cover-concert-pricing', COVER('An empty concert arena before the doors open, wide-angle view from the stage looking out at the audience: a standing floor area in front, tiers of seats rising behind, lighting rigs overhead. The house work lights are on, giving clean, even, neutral light; no colored stage lighting, no neon, no haze.')],

  // C. 文章內文配圖（1 張，3:2 → 16:9）
  ['figure-kitchen-pass', FIGURE('The kitchen pass of a bistro on a busy Friday night at 19:40: the ticket rail is full of order tickets (about 14, unreadable), several freshly plated dishes wait under the heat lamps, and a cook\'s hands are plating with a little motion blur; busy but orderly. Eye-level from the dining-room side of the pass, plates waiting in the foreground and the kitchen behind.')],
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

// 讀出圖片的寬高
function size(file) {
  const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file]).toString()
  return [Number(out.match(/pixelWidth: (\d+)/)[1]), Number(out.match(/pixelHeight: (\d+)/)[1])]
}

// 先裁切再縮放：中央裁成目標比例（sips -c 由中央裁切），再縮成目標尺寸，最後轉 JPEG（品質 80）
// 頭像 600 × 600、封面 1200 × 630、配圖 16:9（原圖寬 1536 時為 1536 × 864）
function finish(raw, out, name) {
  const tmp = raw.replace(/\.png$/, '-crop.png')
  const [w, h] = size(raw)
  let target
  if (name.startsWith('avatar-')) target = [600, 600]
  else if (name.startsWith('cover-')) target = [1200, 630]
  else target = [Math.min(w, 1600), Math.round(Math.min(w, 1600) * 9 / 16)]
  const ratio = target[0] / target[1]
  const cropW = Math.min(w, Math.round(h * ratio))
  const cropH = Math.min(h, Math.round(cropW / ratio))
  execFileSync('sips', ['-c', String(cropH), String(cropW), raw, '--out', tmp], { stdio: 'ignore' })
  execFileSync('sips', ['-z', String(target[1]), String(target[0]), tmp, '--out', tmp], { stdio: 'ignore' })
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '80', tmp, '--out', out], { stdio: 'ignore' })
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
      finish(raw, out, name)
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
