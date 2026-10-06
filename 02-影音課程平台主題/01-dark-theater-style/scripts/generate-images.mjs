// ============================================================
// 產生 01 極致暗黑劇院的課程照片（Codex CLI image_generation）
//
// 需求：已登入的 codex CLI（>= 0.150）、macOS sips（裁切、轉 JPEG 與縮放）
// 用法：
//   node scripts/generate-images.mjs                          # 產生缺少的圖片（已存在的會跳過）
//   node scripts/generate-images.mjs --only hero,player-learn # 只產生指定檔名
//   node scripts/generate-images.mjs --force                  # 全部重新產生
//   CONC=2 node scripts/generate-images.mjs                   # 並行數（預設 4）
//
// 檔名、比例、輸出尺寸與畫面主體照上一層的 IMAGES.md（3 套風格共用同一份清單）。
// 換風格時：修改 STYLE（整組圖的共同調性）與各張描述，檔名維持不變即可，不用改程式。
// 原理：codex exec 的輸出會存在 ~/.codex/generated_images/<session id>/，
//       從 log 解析 session id 就能對應到正確的檔案，所以可以安全地並行。
// 比例：codex 只會輸出 3:2、2:3、1:1 三種，16:9 與 4:5 由 3:2、2:3 置中裁切而來，
//       所以 prompt 會提醒「上下（或左右）邊緣會被裁掉」，主體要放在中間。
// ============================================================
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { spawn, execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(HERE, '../images')
const RAW = path.join(os.tmpdir(), 'craftory-dark-theater-raw-images') // 原始 PNG（不進版控）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 4)

// 整組圖的共同調性：像熄燈後的放映廳裡，銀幕上停格的一幀工藝紀錄片。
// 畫面大部分是深空黑，只有一盞柔和的冷白主光打在手與材料上，陰影與輪廓帶一點微光冷藍；
// 材料（陶土、皮革、木頭、銀）保留真實的顏色，但彩度壓低，不做暖金色調
const STYLE = 'Cinematic low-key film still, like a paused frame of a quiet craft documentary projected in a darkened screening room: most of the frame falls into deep space-black shadow, a single soft cool-white key light from above sculpts the hands and materials, a faint cold moonlight-blue rim light and blue-tinted shadows, natural material colours (clay, leather, wood, silver) kept true but slightly desaturated, no warm golden grading, rich clean blacks, shallow depth of field, very fine film grain, calm and focused.'
const RULES = 'No text, no letters, no numbers, no subtitles, no logo, no watermark, no brand marks, no UI elements or play buttons.'
const HANDS = 'Show only hands and forearms, no face visible.'

// codex 的三種輸出比例
const GEN_RATIO = {
  '16:9': 'wide landscape 3:2 composition (the top and bottom edges will be cropped to 16:9, keep everything important inside the middle band)',
  '3:2': 'wide landscape 3:2 composition',
  '4:5': 'tall portrait 2:3 composition (the top and bottom edges will be cropped to 4:5, keep everything important inside the middle)',
  '1:1': 'square 1:1 composition',
}
const PHOTO = (ratio, desc) => `Photorealistic photograph, ${GEN_RATIO[ratio]}. ${desc} ${STYLE} ${RULES}`
// 學員作品牆：手機隨手拍，不要像專業商品照，但維持夜晚、冷色的整體調性
const CANDID = (desc) => `Photorealistic candid smartphone photo, ${GEN_RATIO['1:1']}, as posted on social media by an office worker in Taipei after work at night: slightly imperfect casual framing, lit by an ordinary ceiling or desk lamp, the rest of the room dim with cool bluish evening shadows. ${desc} No people visible. ${RULES}`

// [檔名, 比例, 輸出寬, 輸出高, prompt]
const JOBS = [
  // ---------- 首頁 ----------
  // Hero：左半部與左下壓標題與按鈕、右下壓「正在播放」小卡，都要暗而單純
  ['hero', '16:9', 1920, 1080, PHOTO('16:9', `Extreme close-up of a craftsperson's two hands hand-pinching a small clay bowl on a dark worktable: one thumb pressing the inner wall of the bowl, the other hand cradling the outside, wet clay smeared on the fingers, a hint of slow-motion movement; a small lump of clay, a natural sponge and a trimming knife nearby. The hands and bowl sit in the RIGHT half of the frame, slightly above the centre. The whole LEFT half and the lower-left are plain, nearly black shadow (space for a headline and buttons). The lower-right corner is also dark and plain (space for a small overlay card). Blurred dark studio background. ${HANDS}`)],
  // 工藝情境卡：主體在中上方，下方 1/3 暗而單純（疊作品名稱）
  ['craft-bowl', '4:5', 1200, 1500, PHOTO('4:5', 'A hand-pinched everyday ceramic bowl in use on a home dining table at night: the bowl holds steaming white rice, a pair of wooden chopsticks rests beside it, a single pendant light makes a small pool of light on the table while the room falls into darkness. The bowl sits in the upper-middle of the frame; the bottom third is plain dark tabletop fading to black.')],
  ['craft-cardholder', '4:5', 1200, 1500, PHOTO('4:5', 'A hand-stitched vegetable-tanned leather card holder with neat saddle-stitch lines and burnished edges, one or two plain blank cards tucked in, resting on a dark wooden desk under a narrow beam of light. The card holder sits in the upper-middle of the frame; the bottom third is plain dark desk fading to black.')],
  ['craft-lamp', '4:5', 1200, 1500, PHOTO('4:5', 'A small handmade solid-wood table lamp switched on beside a bed in a dark bedroom: the wooden base shows hand-plane facets and a visible mortise-and-tenon joint, a simple linen shade glowing softly; the lamp glow is the focal point, the room around it in cool blue darkness. The lamp sits in the upper-middle of the frame; the bottom third is plain and dark.')],
  ['craft-ring', '4:5', 1200, 1500, PHOTO('4:5', `A forged plain sterling-silver ring with fine hammered facets resting on an open palm, as if about to be given as a gift, a small open dark gift box nearby; crisp cool light makes the silver gleam. The ring is large and clearly visible in the upper-middle of the frame; the bottom third is plain and dark. ${HANDS}`)],
  // 學員作品牆（手機隨手拍）
  ['ugc-weekend-potter', '1:1', 1080, 1080, CANDID('A beginner\'s first hand-pinched bowl, a little irregular and clearly handmade by a novice, on a home dining table holding a simple dinner of rice and stir-fried vegetables.')],
  ['ugc-leather-lin', '1:1', 1080, 1080, CANDID('A beginner\'s first hand-stitched leather card holder with slightly uneven stitches on a home desk, next to a diamond stitching chisel, two needles with waxed thread and leather offcuts.')],
  // 播放器畫面：中央會疊大播放鈕、上方疊覆蓋文字、下方疊控制列
  ['player-trial', '16:9', 1920, 1080, PHOTO('16:9', `A frame from an online pottery lesson, 45-degree top-down view: on a dark worktable three or four different kinds of clay are laid side by side (red earthenware, white porcelain clay, coarse grogged stoneware, grey clay), each with a different colour and texture; one hand of the craftsperson picks up one block and breaks it open with the fingers to show its cross-section. Subject in the centre with some calm empty space all around. ${HANDS}`)],
  ['player-learn', '16:9', 1920, 1080, PHOTO('16:9', `A frame from an online pottery lesson, close-up three-quarter side view: a fist-sized ball of clay on the worktable, the craftsperson's thumb pressing down into it at about a 45-degree angle to open the shape of a bowl, the other hand supporting the outside of the ball. Subject in the centre; the bottom 15 percent and the upper-left area are plain dark shadow. ${HANDS}`)],

  // ---------- 課程封面（16:9，可能被裁成 4:3：主體放在中央 70%） ----------
  ['course-pottery', '16:9', 1600, 900, PHOTO('16:9', `Two hands hand-pinching a clay bowl at a home dining table covered with a canvas cloth; beside it a few small air-drying bowls, a sponge and a trimming knife — clearly no pottery wheel, just a dining table. Subject in the central 70 percent of the frame. ${HANDS}`)],
  ['course-leather', '16:9', 1600, 900, PHOTO('16:9', `Two hands saddle-stitching with two needles, the leather held in a wooden stitching clamp; on the table a diamond stitching chisel, a leather knife and cut pieces of vegetable-tanned leather. Subject in the central 70 percent of the frame. ${HANDS}`)],
  ['course-woodwork', '16:9', 1600, 900, PHOTO('16:9', `Two hands pushing a hand plane along a solid wood board, a curl of wood shaving rising; on the workbench chisels and a half-finished small side-table leg with a mortise joint. Hand tools only, absolutely no power tools. Subject in the central 70 percent of the frame. ${HANDS}`)],
  ['course-plant-dye', '16:9', 1600, 900, PHOTO('16:9', `Gloved hands lifting a freshly plant-dyed cotton T-shirt out of a dye pot, onion skins, madder roots and indigo leaves beside the pot, an embroidery hoop with stitching in progress nearby. Subject in the central 70 percent of the frame. ${HANDS}`)],
  ['course-silver', '16:9', 1600, 900, PHOTO('16:9', `One hand holding a silver ring on a steel ring mandrel while the other hand strikes it with a small hammer; on the bench a length of silver wire, a file and a small torch. Subject in the central 70 percent of the frame. ${HANDS}`)],
  ['course-candle', '16:9', 1600, 900, PHOTO('16:9', `Two hands pouring melted wax into a glass jar with a wick already standing upright; next to it a few small unlabelled essential-oil dropper bottles, a measuring jug and soy wax flakes. Subject in the central 70 percent of the frame. ${HANDS}`)],
  ['course-rattan', '16:9', 1600, 900, PHOTO('16:9', `Straight top-down overhead view of two hands weaving the base of a rattan basket, a basin of water with soaking rattan strands beside it. Subject in the central 70 percent of the frame. ${HANDS}`)],
  ['course-zine', '16:9', 1600, 900, PHOTO('16:9', `Two hands pulling a squeegee across a silkscreen frame to print ink onto paper; beside it a stack of folded, saddle-stitched small zines. The printed graphics are only abstract shapes, absolutely no readable text. Subject in the central 70 percent of the frame. ${HANDS}`)],

  // ---------- 課程詳情 ----------
  ['outcome-bowl', '4:5', 1200, 1500, PHOTO('4:5', 'A finished work photographed like a gallery exhibit: a glazed hand-pinched food bowl about 12 cm across, a simple form with a naturally undulating pinched rim and a visible foot ring, matte celadon-grey glaze with small iron speckles, alone on a dark slate surface, three-quarter elevated view showing both the inside and the side, a single soft spotlight. The bowl sits in the centre slightly low, with generous dark space around it.')],
  ['instructor-lin-avatar', '1:1', 600, 600, PHOTO('1:1', 'Portrait of a friendly Taiwanese male ceramic artist in his thirties with short black hair, wearing a grey canvas work apron over a dark T-shirt, a warm approachable expression, chest-up, face exactly in the centre with a little headroom so it can be cropped into a circle; blurred dark pottery studio behind him, soft key light on the face and a cool blue rim light.')],
  ['instructor-lin-studio', '3:2', 1600, 1067, PHOTO('3:2', 'Wide documentary shot inside a small pottery studio in the hills of Shenkeng, Taiwan, at dusk: wooden shelves full of drying and fired bowls and plates, a central worktable, an electric kiln in the corner; the same Taiwanese male ceramic artist in his thirties with short black hair and a grey canvas apron works at the table, seen in profile from a distance. Like one calm shot from a documentary film.')],
  // 作品縮圖列：三張同一組作品集（同釉色、同擺法），只差在器型
  ['instructor-lin-work-1', '1:1', 800, 800, PHOTO('1:1', 'Portfolio photo of the artist\'s work: a stack of four hand-pinched rice bowls in matte celadon-grey glaze with small iron speckles, on a dark slate surface under a single soft spotlight, subject centred.')],
  ['instructor-lin-work-2', '1:1', 800, 800, PHOTO('1:1', 'Portfolio photo of the artist\'s work: a set of three small hand-pinched teacups in matte celadon-grey glaze with small iron speckles, on a dark slate surface under a single soft spotlight, subject centred.')],
  ['instructor-lin-work-3', '1:1', 800, 800, PHOTO('1:1', 'Portfolio photo of the artist\'s work: one wide shallow hand-pinched serving plate in matte celadon-grey glaze with small iron speckles, empty, on a dark slate surface under a single soft spotlight, three-quarter elevated view, subject centred.')],
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

// 置中裁成目標比例，再縮放成輸出尺寸並轉 JPEG（品質 80；方形 78）
function toJpeg(raw, out, width, height) {
  const info = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', raw]).toString()
  const w = Number(info.match(/pixelWidth: (\d+)/)[1])
  const h = Number(info.match(/pixelHeight: (\d+)/)[1])
  const target = width / height
  const cropW = w / h > target ? Math.round(h * target) : w
  const cropH = w / h > target ? h : Math.round(w / target)
  const cropped = raw.replace(/\.png$/, '-crop.png')
  execFileSync('sips', ['--cropToHeightWidth', String(cropH), String(cropW), raw, '--out', cropped], { stdio: 'ignore' })
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', width === height ? '78' : '80', '-z', String(height), String(width), cropped, '--out', out], { stdio: 'ignore' })
}

async function one([name, , width, height, prompt]) {
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
      toJpeg(raw, out, width, height)
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
