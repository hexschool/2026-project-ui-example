// ============================================================
// 產生 04 溫暖心靈慢讀的作者頭像、文章封面與內文配圖（Codex CLI image_generation）
//
// 需求：已登入的 codex CLI（>= 0.150）、macOS sips（裁切、縮圖、轉 JPEG）
// 用法：
//   node scripts/generate-images.mjs                          # 產生缺少的圖片（已存在的會跳過）
//   node scripts/generate-images.mjs --only avatar-chen,cover-caseload  # 只產生指定檔名
//   node scripts/generate-images.mjs --force                  # 全部重新產生
//   CONC=1 node scripts/generate-images.mjs                   # 並行數（預設 2）
//
// 圖片清單（檔名、畫面主體）以主題層的 ../IMAGES.md 為準，3 套風格檔名一致。
// 換風格時：修改 STYLE（整組圖的共同調性）即可，檔名與構圖描述維持不變。
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
const RAW = path.join(os.tmpdir(), 'fieldnotes-slow-reading-raw-images') // 原始 PNG 與裁切暫存（不進版控）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 2)

// 整組圖的共同調性：午後窗光般的柔和散射光、燕麥與焦糖色的暖調、低對比、陰影微微提亮
const STYLE = 'Soft, eye-friendly warm look: gentle diffused late-afternoon window light, low contrast with slightly lifted shadows, a muted warm palette of oatmeal, caramel brown and soft warm grey, calm and unhurried mood, natural colours (not orange, not sepia), fine subtle film grain, quiet documentary photography for a slow-reading magazine.'

// IMAGES.md 的「風格中立」prompt 片段，後面接上本風格的 STYLE
const AVATAR = (person, place) => `Photorealistic head-and-shoulders portrait, square 1:1, of a fictional Taiwanese ${person}, natural relaxed expression looking at the camera, face clearly lit and centered with headroom so a circular crop does not cut the face, background is their real workplace (${place}) softly out of focus. No text, no logos, no brand marks, no watermark. ${STYLE}`
const COVER = (subject) => `Photorealistic editorial photograph, wide landscape 3:2 composition with the main subject inside the central 70% of the frame (top and bottom edges will be cropped to 1200x630). ${subject} Signs of real work, but no faces (hands, backs or distant blurred figures only). No readable text anywhere, no logos, no brand marks, no watermark. ${STYLE}`
const FIGURE = (subject) => `Photorealistic documentary photograph, wide landscape 3:2 composition that will be cropped to 16:9. ${subject} No readable text anywhere, no logos, no brand marks, no watermark. ${STYLE}`

// [檔名, 類型, prompt]；類型決定裁切方式：avatar 600×600、cover 1200×630、figure 16:9
const JOBS = [
  // A. 作者頭像（8 張）
  ['avatar-chen', 'avatar', AVATAR('man in his late thirties with short hair, wearing a dark chef jacket with an apron and sleeves rolled up, the chef-owner of a small independent bistro', 'the open kitchen and bar counter of a small bistro')],
  ['avatar-wang', 'avatar', AVATAR('woman in her early thirties with her hair tied back, wearing a plain work jacket over a company polo shirt, a blank ID badge with no text on a lanyard around her neck, a process engineer at a chip packaging plant', 'a factory office corridor with a glass window showing equipment beyond; she is not wearing a cleanroom suit')],
  ['avatar-lin', 'avatar', AVATAR('man in his late forties with tanned skin and short hair, wearing a collared work shirt under a work vest, an agricultural export sales manager', 'a produce packing yard with stacked plastic crates full of pineapples')],
  ['avatar-su', 'avatar', AVATAR('woman in her mid thirties with a short bob, wearing a linen shirt under a knit cardigan, the owner of a small independent bookstore', 'wooden bookshelves in a small bookstore; book spines are blurred and unreadable')],
  ['avatar-guo', 'avatar', AVATAR('man in his early thirties wearing glasses and a plain grey hoodie, an indie game studio producer', 'a small game studio with several monitors on desks showing only abstract blocks of colour, no readable content')],
  ['avatar-fang', 'avatar', AVATAR('woman in her late thirties with neatly tied hair, wearing a plain soft-coloured top, calm and gentle presence, a domestic violence prevention social work supervisor', 'an office with filing cabinets and a whiteboard that has no readable writing')],
  ['avatar-huang', 'avatar', AVATAR('man around thirty wearing a short-sleeved button shirt, a convenience-store chain site-selection specialist', 'a daytime city street corner and sidewalk with no shop signs, no logos and no brand colours')],
  ['avatar-zheng', 'avatar', AVATAR('woman in her early thirties wearing a plain black T-shirt with a headset walkie-talkie hanging around her neck, a concert production coordinator', 'the backstage area of a concert venue with an empty stage lighting truss')],

  // B. 文章封面（8 張，1200 × 630）
  ['cover-restaurant-costs', 'cover', COVER('A small independent bistro dining room before opening: four-person tables set one after another receding into the room, the four-person table in the foreground is especially clear and is the hero of the image. Eye-level or slightly elevated angled view along the row of tables.')],
  ['cover-chip-packaging', 'cover', COVER('A semiconductor packaging and test production line: automated machines and a robotic arm picking up a chip, in the foreground a wafer mounted on a frame. Close-up on the robotic arm with the machines behind softly out of focus.')],
  ['cover-pineapple-export', 'cover', COVER('A produce packing yard where fresh pineapples are being graded and packed into boxes, rows of pineapples in the foreground, and in the background the open doors of a refrigerated shipping container (cold chain).')],
  ['cover-bookstore-cashflow', 'cover', COVER('A small independent bookstore seen from the entrance looking in: a display table of books near the door, and at the back of the shop folding chairs set out in rows for an evening talk. All book spines and posters are blurred and unreadable.')],
  ['cover-game-launch', 'cover', COVER('A small indie game studio late at night, seen from behind an empty office chair: several monitors on the desk show abstract monitoring charts where one line suddenly spikes upward, with no readable text; a half-finished drink on the desk. No people, or only a blurred back.')],
  ['cover-caseload', 'cover', COVER('A social worker\'s desk seen from a 45-degree angle above: a tall stack of case folders with blank labels, a weekly planner filled with illegible handwriting, a desk phone and a bunch of car keys for home visits.')],
  ['cover-store-location', 'cover', COVER('A high-angle view from a pedestrian bridge looking down at a city road: a planted median divider runs down the centre of the frame, pedestrians on both sidewalks, and one corner shopfront on each side of the road with no signs and no brand colours.')],
  ['cover-concert-pricing', 'cover', COVER('An empty concert arena before the show, wide-angle view from the stage looking out at the audience: a standing area at the front, tiers of seats rising behind, and lighting trusses overhead.')],

  // C. 文章內文配圖（1 張，16:9）
  ['figure-kitchen-pass', 'figure', FIGURE('A Friday evening at 19:40 at the kitchen pass of a busy bistro (the counter between the kitchen and the dining room): a ticket rail full of about 14 order tickets with illegible writing, several freshly plated dishes waiting under heat lamps, a cook\'s hands plating with slight motion blur; busy but orderly. Eye-level view from the dining-room side, plates in the foreground and the kitchen behind.')],
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

// 讀出 PNG 的寬高
function size(file) {
  const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file]).toString()
  return { w: Number(out.match(/pixelWidth: (\d+)/)[1]), h: Number(out.match(/pixelHeight: (\d+)/)[1]) }
}

// 先裁切再縮放，最後轉 JPEG（品質 80）
// - avatar：方形 → 600 × 600
// - cover：中央裁成 1.905:1（1536 × 806）→ 1200 × 630
// - figure：中央裁成 16:9（1536 × 864），原圖寬 1536 時不再放大
function finish(raw, kind, out) {
  const tmp = raw.replace(/\.png$/, '-crop.png')
  const { w, h } = size(raw)
  if (kind === 'avatar') {
    const s = Math.min(w, h)
    execFileSync('sips', ['-c', String(s), String(s), raw, '--out', tmp], { stdio: 'ignore' })
    execFileSync('sips', ['-z', '600', '600', tmp, '--out', tmp], { stdio: 'ignore' })
  } else if (kind === 'cover') {
    const ch = Math.round(w * 630 / 1200)
    execFileSync('sips', ['-c', String(Math.min(ch, h)), String(w), raw, '--out', tmp], { stdio: 'ignore' })
    execFileSync('sips', ['-z', '630', '1200', tmp, '--out', tmp], { stdio: 'ignore' })
  } else {
    const ch = Math.round(w * 9 / 16)
    execFileSync('sips', ['-c', String(Math.min(ch, h)), String(w), raw, '--out', tmp], { stdio: 'ignore' })
  }
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '80', tmp, '--out', out], { stdio: 'ignore' })
}

async function one([name, kind, prompt]) {
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
      finish(raw, kind, out)
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
