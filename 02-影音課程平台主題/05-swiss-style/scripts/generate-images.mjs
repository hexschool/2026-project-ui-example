// ============================================================
// 產生 05 瑞士國際排版的課程照片（Codex CLI image_generation）
//
// 需求：已登入的 codex CLI（>= 0.150）、macOS sips（裁切、轉灰階 JPEG 與縮圖）
// 用法：
//   node scripts/generate-images.mjs                       # 產生缺少的圖片（已存在的會跳過）
//   node scripts/generate-images.mjs --only hero,craft-bowl # 只產生指定檔名（逗號分隔）
//   node scripts/generate-images.mjs --force               # 全部重新產生
//   CONC=2 node scripts/generate-images.mjs                # 並行數（預設 4）
//
// 換風格時：修改 STYLE（整組圖的共同調性）與各張 prompt，檔名維持不變即可，不用改程式。
// 檔名、比例、輸出尺寸與畫面主體照主題層的 IMAGES.md（3 套風格共用同一份清單）。
// 原理：codex exec 的輸出會存在 ~/.codex/generated_images/<session id>/，
//       從 log 解析 session id 就能對應到正確的檔案，所以可以安全地並行。
//
// 本風格的照片一律是「客觀攝影」的黑白照：明亮、乾淨、構圖方正。
// 輸出時再轉成真正的灰階（Generic Gray Gamma 2.2），就算 AI 生成時帶了一點色偏，
// 畫面上也只有黑、白、灰，瑞士紅只留給介面上的重點。
// ============================================================
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { spawn, execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(HERE, '../images')
const RAW = path.join(os.tmpdir(), 'craftory-swiss-raw-images') // 原始 PNG（不進版控）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 4)
const GRAY = '/System/Library/ColorSync/Profiles/Generic Gray Gamma 2.2 Profile.icc'

const STYLE = 'Black-and-white photograph in the spirit of Swiss objective photography of the 1960s: true monochrome with no color cast, bright high-key exposure, clean whites and pale greys with crisp deep blacks only in the details, soft even north-facing daylight, sharp focus, precise and calm composition built on clear horizontals and verticals, plain uncluttered backgrounds (white plaster wall, pale concrete, light ash-wood tabletop, white canvas), generous empty negative space. Documentary and unsentimental, like a plate in a Swiss design annual. No text, no letters, no numbers, no logo, no watermark, no brand marks, no user-interface elements.'
const HANDS = 'Only the hands and forearms are visible, no face.'
// 生成比例：WIDE 3:2（1536×1024）、TALL 2:3（1024×1536）、SQUARE 1:1（1024×1024），之後再裁成 IMAGES.md 的比例
const WIDE = (desc) => `Black-and-white photograph, wide landscape 3:2 composition, 50mm lens. ${desc} ${STYLE}`
const TALL = (desc) => `Black-and-white photograph, tall portrait 2:3 composition, 50mm lens. ${desc} ${STYLE}`
const SQUARE = (desc) => `Black-and-white photograph, square 1:1 composition, 50mm lens. ${desc} ${STYLE}`

// [檔名, prompt, 輸出寬, 輸出高]：輸出比例與尺寸照 IMAGES.md；裁切一律取中央
const JOBS = [
  // ---------- 首頁 ----------
  // Hero：手與碗在右側偏上；左半部、左下與右下都要乾淨（左下疊白色標題框、右下疊「正在播放」小卡）
  ['hero', WIDE(`Close-up of a craftsperson's two hands pinching a small clay bowl on a pale wooden worktable: one thumb presses the inside wall of the bowl while the other hand supports the outside, wet clay on the fingers; beside them a small lump of clay, a natural sponge and a wooden trimming tool. It feels like a single frame from a slow-motion video, with a sense of movement. The hands and bowl sit in the RIGHT half of the frame, slightly ABOVE center. The whole LEFT half and the lower-left are a plain, softly lit, empty white wall and tabletop; the lower-right corner is also plain empty tabletop. Shallow depth of field, calm bright studio behind. ${HANDS}`), 1920, 1080],
  // 工藝情境卡（2:3 生成、裁成 4:5）
  ['craft-bowl', TALL('A hand-pinched everyday ceramic bowl in use: filled with steamed white rice on a home dining table, a pair of chopsticks resting beside it. The bowl sits in the upper-middle of the frame; the bottom third is plain, empty tabletop.'), 1200, 1500],
  ['craft-cardholder', TALL('A hand-stitched vegetable-tanned leather card holder showing neat saddle-stitch lines and burnished edges, one or two plain blank cards tucked in, lying on a table. The card holder sits in the upper-middle of the frame; the bottom third is plain, empty tabletop.'), 1200, 1500],
  ['craft-lamp', TALL('A small handmade solid-wood table lamp, switched on and glowing softly: the wooden base shows hand-plane facets and a visible mortise-and-tenon joint, with a simple paper lampshade, standing on a bedside table. The glowing lamp is the focal point, in the upper-middle of the frame; the bottom third is plain, empty table surface.'), 1200, 1500],
  ['craft-ring', TALL('A hand-forged plain silver ring with a fine hammered texture, resting on an open palm as if about to be given as a gift; the ring is large and clearly visible. Subject in the upper-middle of the frame; the bottom third is plain and simple.'), 1200, 1500],
  // 學員作品牆（像手機隨手拍）
  ['ugc-weekend-potter', SQUARE('A casual black-and-white smartphone snapshot taken at home after work: a beginner\'s first hand-pinched bowl, slightly irregular and lopsided, sitting on a dining table with dinner inside it. Imperfect handheld framing, clearly not a professional product photo.'), 1080, 1080],
  ['ugc-leather-lin', SQUARE('A casual black-and-white smartphone snapshot on a home desk: a beginner\'s first hand-stitched leather card holder with slightly uneven stitches, next to a diamond stitching chisel, needles, waxed thread and leather offcuts. Imperfect handheld framing, clearly not a professional product photo.'), 1080, 1080],
  // 播放器畫面（中央會疊大播放鈕，下方疊控制列）
  ['player-trial', WIDE(`Video still, 45-degree overhead view of a pale tabletop where three or four different kinds of pottery clay lie side by side in a neat row (a dark earthenware clay, a smooth white porcelain clay, a coarse grogged stoneware clay, each a clearly different grey tone and texture); one hand picks up one block and the fingers pull it apart to show the broken cross-section. Subject in the center with empty space all around. Only one hand and forearm visible, no face.`), 1920, 1080],
  ['player-learn', WIDE(`Video still, close-up side view: a fist-sized ball of clay on a worktable, a craftsperson's thumb pressing down into it at about a 45-degree angle to open the first hollow of a bowl, the other hand steadying the outside of the ball. Subject in the center; the bottom 15 percent of the frame is plain tabletop and the upper-left is plain empty background. ${HANDS}`), 1920, 1080],

  // ---------- 課程封面（16:9；卡片上可能裁成 4:3，主體放在中央 70%） ----------
  ['course-pottery', WIDE(`Two hands pinching a small clay bowl on a home dining table covered with a canvas cloth; next to them a few small air-drying bowls, a sponge and a trimming tool. Clearly a kitchen table at home, not a studio, no pottery wheel. Subject within the central 70 percent of the frame. ${HANDS}`), 1600, 900],
  ['course-leather', WIDE(`Two hands saddle-stitching with two needles, the leather clamped in a wooden stitching pony; on the table a diamond chisel, a leather knife and cut pieces of vegetable-tanned leather. Subject within the central 70 percent of the frame. ${HANDS}`), 1600, 900],
  ['course-woodwork', WIDE(`Two hands pushing a hand plane along a solid wooden board, a curl of wood shaving rising; on the workbench a chisel and a half-finished small side-table leg with a mortise joint. Hand tools only, absolutely no power tools. Subject within the central 70 percent of the frame. ${HANDS}`), 1600, 900],
  ['course-plant-dye', WIDE(`Gloved hands lifting a freshly dyed cotton T-shirt out of a dye pot, onion skins, madder roots and indigo leaves beside the pot, an embroidery hoop with work in progress nearby. Subject within the central 70 percent of the frame. ${HANDS}`), 1600, 900],
  ['course-silver', WIDE(`One hand holding a silver ring on a steel ring mandrel while the other hand strikes it with a small hammer; on the bench a length of silver wire, a file and a small jeweller's torch. Subject within the central 70 percent of the frame. ${HANDS}`), 1600, 900],
  ['course-candle', WIDE(`Two hands pouring melted wax into a glass jar with a wick already standing in it; beside it a few dropper bottles of essential oil, a measuring cup and soy wax flakes. Subject within the central 70 percent of the frame. ${HANDS}`), 1600, 900],
  ['course-rattan', WIDE(`Straight top-down overhead view of two hands weaving the base of a rattan basket, a basin of water with soaking rattan strands beside it. Subject within the central 70 percent of the frame. ${HANDS}`), 1600, 900],
  ['course-zine', WIDE(`Two hands pulling a squeegee across a silkscreen, printing a pattern of repeated dots and parallel stripes onto paper (purely abstract, nothing that resembles letters, numbers or words); beside it a small stack of folded, saddle-stitched handmade zines with plain dotted covers. No letters or readable text anywhere. Subject within the central 70 percent of the frame. ${HANDS}`), 1600, 900],

  // ---------- 課程詳情 ----------
  ['outcome-bowl', TALL('Product photograph of a finished, glazed, hand-pinched food bowl about 12 cm in diameter: a simple form with the gentle natural undulation of a hand-pinched rim and a visible foot ring, standing alone on a plain white seamless surface, three-quarter top-down angle showing both the inside and the side. The bowl is centered slightly low with generous empty space around it.'), 1200, 1500],
  ['instructor-lin-avatar', SQUARE('Portrait of a friendly Taiwanese male ceramic artist in his mid-thirties with short black hair, wearing a canvas work apron over a plain T-shirt, gentle smile, looking at the camera. Head and shoulders, the face exactly centered with some space above the head so the photo can be cropped into a circle; his pottery studio softly blurred behind.'), 600, 600],
  ['instructor-lin-studio', WIDE('Wide documentary shot of a small pottery studio in Shenkeng, Taiwan: wooden shelves lined with drying and fired bowls and plates, a central worktable, an electric kiln in the corner; the same Taiwanese male potter in his mid-thirties with short black hair and a canvas apron works at the table, seen in profile. Like a frame from a documentary film.'), 1600, 1067],
  ['instructor-lin-work-1', SQUARE('Portfolio product photograph: a stack of three or four hand-pinched rice bowls, all with the same speckled matte glaze, on a plain white seamless background, straight-on slightly elevated angle, soft shadow, subject centered.'), 800, 800],
  ['instructor-lin-work-2', SQUARE('Portfolio product photograph: a set of three hand-pinched teacups, all with the same speckled matte glaze, on a plain white seamless background, straight-on slightly elevated angle, soft shadow, subject centered.'), 800, 800],
  ['instructor-lin-work-3', SQUARE('Portfolio product photograph: one large shallow hand-pinched serving plate, empty, with the same speckled matte glaze, on a plain white seamless background, straight-on slightly elevated angle, soft shadow, subject centered.'), 800, 800],
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

// 讀出圖片尺寸
function size(file) {
  const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file]).toString()
  return [Number(out.match(/pixelWidth: (\d+)/)[1]), Number(out.match(/pixelHeight: (\d+)/)[1])]
}

// 從中央裁成目標比例 → 縮放到輸出尺寸 → 轉灰階 JPEG
function finish(raw, out, w, h) {
  const [rw, rh] = size(raw)
  const ratio = w / h
  const cw = Math.min(rw, Math.round(rh * ratio))
  const ch = Math.min(rh, Math.round(rw / ratio))
  const cropped = raw.replace(/\.png$/, '-crop.png')
  execFileSync('sips', ['--cropToHeightWidth', String(ch), String(cw), raw, '--out', cropped], { stdio: 'ignore' })
  const quality = w * h > 1200 * 1200 ? '80' : '78'
  execFileSync('sips', ['-m', GRAY, '-s', 'format', 'jpeg', '-s', 'formatOptions', quality, '-z', String(h), String(w), cropped, '--out', out], { stdio: 'ignore' })
}

async function one([name, prompt, w, h]) {
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
      finish(raw, out, w, h)
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
