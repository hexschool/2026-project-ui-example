// ============================================================
// 產生 06 童心啟蒙樂園的 23 張圖片（Codex CLI image_generation）
// 清單、檔名、比例與畫面主體照主題層的 ../IMAGES.md（各風格共用），這裡只決定「風格」。
//
// 需求：已登入的 codex CLI（>= 0.150）、macOS sips（裁切、轉 JPEG 與縮圖）
// 用法：
//   node scripts/generate-images.mjs                          # 產生缺少的圖片（已存在的會跳過）
//   node scripts/generate-images.mjs --only hero,craft-bowl   # 只產生指定檔名
//   node scripts/generate-images.mjs --force                  # 全部重新產生
//   CONC=1 node scripts/generate-images.mjs                   # 並行數（預設 2）
//
// 換風格時：修改 STYLE（整組圖的共同調性）與各張描述，檔名、比例維持不變即可，不用改程式。
// 原理：codex exec 的輸出會存在 ~/.codex/generated_images/<session id>/，
//       從 log 解析 session id 就能對應到正確的檔案，所以可以安全地並行。
//       codex 只產 3:2、2:3、1:1 三種尺寸，這裡再用 sips 從中央裁成 IMAGES.md 的比例與輸出尺寸。
// ============================================================
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { spawn, execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(HERE, '../images')
const RAW = path.join(os.tmpdir(), 'craftory-kids-raw-images') // 原始 PNG（不進版控，本風格專用）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 2)

// 整組圖的調性：晴朗早晨的紀錄攝影，暖陽、向日葵黃、天空藍、珊瑚橘的道具與背景，像一本給大人的闖關繪本；手都是成人的手
const STYLE = 'Sunny, cheerful morning documentary photography for adult beginners. Warm, soft sunlight with gentle shadows, bright but never overexposed. Props and backgrounds in sunflower yellow, sky blue and coral orange: a painted wooden table, colourful cutting mats, pastel walls, a few playful but grown-up objects. Every pair of hands belongs to an adult. Clean, tidy scenes with saturated yet natural colours. Real photograph, not an illustration, not a cartoon, no mascots or characters, no children. No text, no letters, no logos, no UI, no watermark.'

// 手部特寫的人物：同一位職人（林子謙），避免每張生出不同的手與衣著
const HANDS = 'Only the hands and forearms of an adult craftsman in his thirties are visible (no face), sleeves of a sky-blue chambray shirt rolled up under a coral-orange canvas apron.'

// 3:2 橫幅 → 裁成 16:9
const WIDE = (desc) => `Photorealistic photograph, landscape 3:2 composition. It will be center-cropped to 16:9 and may also be shown cropped to 4:3, so keep the main subject inside the central 70% of the frame. ${desc} ${STYLE}`
// 影片畫面（播放器用）：同 WIDE，但像教學影片的一格
const FRAME = (desc) => `Photorealistic still frame from a friendly, well-lit craft-tutorial video, landscape 3:2 composition, it will be center-cropped to 16:9. ${desc} ${HANDS} ${STYLE}`
// 2:3 直幅 → 裁成 4:5（首頁會裁進圓形舷窗，文字在圖片下方）
const TALL = (desc) => `Photorealistic photograph, tall portrait 2:3 composition. It will be center-cropped to 4:5 and may also be shown cropped into a circle, so keep the subject in the center and away from the top and bottom edges. ${desc} ${STYLE}`
// 1:1 方形
const SQUARE = (desc) => `Photorealistic photograph, square 1:1 composition. ${desc} ${STYLE}`
// 學員用手機隨手拍（UGC）：構圖不完美、生活感、沒有棚拍感
const CANDID = (desc) => `Photorealistic candid smartphone photo in square 1:1 format, as posted by an adult beginner student in Taiwan after work: casual angle, slightly imperfect framing, bright cheerful home light, lived-in everyday feeling, not a studio shot. ${desc} A few cheerful sunflower-yellow, sky-blue or coral-orange everyday objects in the scene. No faces, no children, no text, no readable labels, no logo, no watermark.`
// 林子謙的作品集：三張要像同一組作品照
const WORK = (desc) => SQUARE(`Portfolio photograph from one consistent series of the same ceramic artist's work: ${desc}, glazed in the same glossy sunflower-yellow and creamy white glazes with warm clay showing at the foot, on the same pale sky-blue painted wooden board against the same soft coral-pink wall, bright soft morning light, subject centered with generous space around it.`)

// [檔名, 輸出寬, 輸出高, prompt]
const JOBS = [
  // 首頁（9 張）
  ['hero', 1920, 1080, WIDE(`A bright, slow-motion-like frame: two adult hands shaping a small pinch-pot bowl on a sunflower-yellow painted wooden worktable, one thumb pressing the inner wall while the other hand supports the outside, fingers glistening with wet clay, a hint of motion blur; beside them a small lump of clay, a natural sponge and a wooden trimming tool on a coral-orange cutting mat. ${HANDS} Place the hands and the bowl in the RIGHT third of the frame, slightly above the vertical center. The entire LEFT half and the lower-left of the frame must be calm, softly blurred, evenly lit empty space (a pale sky-blue painted wall in warm sunlight and the out-of-focus edge of the table) because a headline and buttons will be overlaid there; the LOWER-RIGHT corner must also be simple and uncluttered. Shallow depth of field.`)],
  ['craft-bowl', 1200, 1500, TALL('A handmade pinch-pot rice bowl in everyday use: filled with steaming white rice, on a sunflower-yellow painted home dining table in morning sunlight, a pair of light wooden chopsticks resting on a small coral-orange chopstick rest, a sky-blue linen napkin softly out of focus. The bowl sits in the center of the frame with calm, simple, evenly lit tabletop around it.')],
  ['craft-cardholder', 1200, 1500, TALL('A hand-stitched vegetable-tanned leather card holder in warm honey-tan leather with neat, even saddle stitching and burnished edges, one or two plain blank cards with no printing tucked inside, lying on a sky-blue cutting mat on a sunny desk beside a coral-orange pencil cup. The card holder sits in the center of the frame with a calm, simple, evenly lit surface around it.')],
  ['craft-lamp', 1200, 1500, TALL('A small handmade solid-wood table lamp glowing warmly: a natural light-wood base showing hand-plane facets and a visible mortise-and-tenon joint, a simple sunflower-yellow fabric lampshade, standing on a bedside table against a pale sky-blue wall beside a small stack of books whose spines are blank. The lamp is the focal point in the center of the frame with calm, simple space around it.')],
  ['craft-ring', 1200, 1500, TALL('A hand-forged plain sterling silver ring with fine hammer marks on its surface, resting in an open adult palm (hand only, no face) held above a small open coral-orange paper gift box lined with sunflower-yellow tissue, as if about to be given as a gift. The ring is large and sharp in the center of the frame with calm, simple space around it.')],
  ['ugc-weekend-potter', 1080, 1080, CANDID('A beginner\'s first handmade pinch-pot bowl, slightly irregular and lopsided, clearly made by a novice, glazed in a glossy sunflower yellow, on a home dining table holding a simple dinner of rice with stir-fried greens, chopsticks beside it.')],
  ['ugc-leather-lin', 1080, 1080, CANDID('A beginner\'s first hand-stitched leather card holder in honey-tan leather with slightly uneven stitching, on a sky-blue cutting mat on a home desk next to a diamond stitching chisel, two needles with waxed thread and small leather offcuts.')],
  ['player-trial', 1920, 1080, FRAME('A 45-degree overhead view of a sunflower-yellow painted worktable: three or four lumps of different clay bodies placed side by side in a row on a sky-blue cutting mat (a red earthenware clay, a smooth pale porcelain-like clay, a grey speckled coarse stoneware clay), and one adult hand picking up one lump and pinching it open with the fingers to show its cross-section. Subject in the center with some empty space all around (a large round play button will be overlaid in the middle, a caption on top and video controls at the bottom); the background is softly blurred.')],
  ['player-learn', 1920, 1080, FRAME('A close-up side view: a fist-sized ball of clay on a sunflower-yellow worktable, one adult thumb pressing down into it at about 45 degrees to open the form of a bowl, the other hand cupping the outside of the ball. Subject centered; the bottom 15% of the frame is a simple, even tabletop (video controls will be overlaid) and the upper-left is calm, out-of-focus sky-blue background (a notification will be overlaid).')],

  // 課程封面（8 張，手部特寫的製作過程）
  ['course-pottery', 1600, 900, WIDE(`Two adult hands pinching a small clay bowl at a home dining table covered with a sky-blue canvas cloth; next to them a few small air-drying bowls, a natural sponge and a wooden trimming tool, a sunflower-yellow mug in the background. The scene clearly shows it is made at a home dining table, with no potter's wheel. ${HANDS}`)],
  ['course-leather', 1600, 900, WIDE(`Two adult hands doing a saddle stitch with two needles on a piece of vegetable-tanned leather clamped in a wooden stitching pony; on a sky-blue cutting mat a diamond stitching chisel, a leather knife and cut pieces of honey-tan leather, a coral-orange spool of waxed thread. ${HANDS}`)],
  ['course-woodwork', 1600, 900, WIDE(`Two adult hands pushing a wooden hand plane along a light solid wood board, curls of wood shavings rising from the plane; on a workbench against a sunflower-yellow wall a set of chisels and the leg of a small side table with a half-finished mortise-and-tenon joint. Hand tools only, absolutely no power tools. ${HANDS}`)],
  ['course-plant-dye', 1600, 900, WIDE(`Gloved adult hands lifting a freshly plant-dyed cotton T-shirt in warm onion-skin yellow and soft coral out of a dye pot; beside the pot lie onion skins, madder roots and indigo leaves, and an embroidery hoop with a half-finished sky-blue stitch. ${HANDS}`)],
  ['course-silver', 1600, 900, WIDE(`One adult hand holding a silver ring on a steel ring mandrel while the other hand taps it with a small hammer; on a sky-blue bench mat a length of silver wire, a file and a small butane torch, a sunflower-yellow tool tray in the background. ${HANDS}`)],
  ['course-candle', 1600, 900, WIDE(`Two adult hands pouring melted soy wax from a small pouring jug into a clear glass jar with a wick already standing in it; beside it several small amber essential-oil dropper bottles without labels, a measuring cup and soy wax flakes on a coral-orange tray, a sunflower-yellow wall behind. ${HANDS}`)],
  ['course-rattan', 1600, 900, WIDE(`A straight top-down overhead view of two adult hands weaving the round base of a rattan basket on a sky-blue painted worktable; beside it a sunflower-yellow basin of water with rattan cane soaking. ${HANDS}`)],
  ['course-zine', 1600, 900, WIDE(`Two adult hands pulling a squeegee across a silkscreen frame, printing an abstract round geometric shape in coral orange and sky blue onto paper; next to it a few folded, saddle-stitched handmade zines whose covers show only abstract shapes. Absolutely no readable text or letters anywhere. ${HANDS}`)],

  // 課程詳情（6 張）
  ['outcome-bowl', 1200, 1500, TALL('Portfolio photograph of one finished hand-pinched rice bowl, about 12 cm in diameter, glazed in a glossy sunflower-yellow glaze with the warm clay body exposed at the trimmed foot ring, gentle natural undulations along the rim; seen from a three-quarter overhead angle that shows the inside, the side and the foot ring; standing alone on a pale sky-blue painted wooden board against a soft coral-pink wall, placed in the center-lower part of the frame with generous empty space around it.')],
  ['instructor-lin-avatar', 600, 600, SQUARE('Chest-up portrait of a fictional Taiwanese male ceramic artist in his mid-thirties: short neat black hair, thin black-rimmed round glasses, light stubble, wearing a coral-orange canvas work apron over a sky-blue chambray shirt; a warm, friendly smile, looking at the camera; behind him his bright pottery studio softly blurred (pale wooden shelves with bowls, a sunflower-yellow wall). The face is in the exact center with some space above the head so the photo can be cropped into a circle without cutting the face.')],
  ['instructor-lin-studio', 1600, 1067, `Photorealistic photograph, landscape 3:2 composition, like a wide shot from a documentary film. A small, bright pottery studio in Shenkeng, New Taipei, in morning sunlight: pale wooden shelves filled with air-drying and fired bowls and plates, a sunflower-yellow painted worktable in the center, an electric kiln visible in a corner, a sky-blue wall; the same male ceramic artist as in his portrait (a Taiwanese man in his mid-thirties with short neat black hair, thin black-rimmed round glasses and light stubble, clearly a man, wearing a coral-orange canvas apron over a sky-blue chambray shirt) working at the table, seen from the side in three-quarter view. ${STYLE}`],
  ['instructor-lin-work-1', 800, 800, WORK('a stack of three or four hand-pinched rice bowls')],
  ['instructor-lin-work-2', 800, 800, WORK('a set of three small hand-pinched teacups standing side by side')],
  ['instructor-lin-work-3', 800, 800, WORK('one shallow hand-pinched large plate, empty, seen from a gentle three-quarter angle')],
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

// 從中央裁成 w:h，再縮放成輸出尺寸、轉 JPEG
function cropAndExport(raw, out, w, h) {
  const info = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', raw]).toString()
  const srcW = Number(info.match(/pixelWidth: (\d+)/)[1])
  const srcH = Number(info.match(/pixelHeight: (\d+)/)[1])
  let cw = srcW
  let ch = Math.round((srcW * h) / w)
  if (ch > srcH) { ch = srcH; cw = Math.round((srcH * w) / h) }
  const cropped = raw.replace(/\.png$/, '.crop.png')
  execFileSync('sips', ['--cropToHeightWidth', String(ch), String(cw), raw, '--out', cropped], { stdio: 'ignore' })
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '80', '-z', String(h), String(w), cropped, '--out', out], { stdio: 'ignore' })
}

async function one([name, w, h, prompt]) {
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
      cropAndExport(raw, out, w, h)
      console.log(`[ok] ${name} ${w}x${h} (attempt ${attempt})`)
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
