// ============================================================
// 產生 03 AI 賽博學院的課程照片（Codex CLI image_generation）
//
// 需求：已登入的 codex CLI（>= 0.150）、macOS sips（裁切、轉 JPEG 與縮放）
// 用法：
//   node scripts/generate-images.mjs                          # 產生缺少的圖片（已存在的會跳過）
//   node scripts/generate-images.mjs --only hero,player-learn # 只產生指定檔名
//   node scripts/generate-images.mjs --force                  # 全部重新產生
//   CONC=1 node scripts/generate-images.mjs                   # 並行數（預設 4）
//
// 檔名、比例、輸出尺寸與畫面主體照上一層的 IMAGES.md（各風格共用同一份清單）。
// 換風格時：修改 STYLE（整組圖的共同調性）與各張描述，檔名維持不變即可，不用改程式。
// 原理：codex exec 的輸出會存在 ~/.codex/generated_images/<session id>/，
//       從 log 解析 session id 就能對應到正確的檔案，所以可以安全地並行。
// 比例：codex 只會輸出 3:2、2:3、1:1 三種，16:9 與 4:5 由 3:2、2:3 置中裁切而來，
//       所以 prompt 會提醒「上下（或左右）邊緣會被裁掉」，主體要放在中間。
// 首頁主圖會再被 CSS 裁成 21:9（桌機銀幕）與 4:3（手機），生圖後兩種都要確認手在畫面裡。
// ============================================================
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { spawn, execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(HERE, '../images')
const RAW = path.join(os.tmpdir(), 'craftory-cyber-raw-images') // 原始 PNG（不進版控，本風格專用）
const argv = process.argv.slice(2)
const FORCE = argv.includes('--force')
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null
const GEN = path.join(os.homedir(), '.codex', 'generated_images')
const CONCURRENCY = Number(process.env.CONC || 4)

// 整組圖的共同調性：深夜的工藝實驗室紀錄片。
// 深靛藍的環境暗場，左右兩側打紫色與洋紅的輪廓光，手與材料上是一盞乾淨的冷白主光；
// 空氣裡有一點薄霧，深色的亮面工作檯反射一點彩色的光。材料保持真實質感，陰影裡看得到細節。
// 不要螢幕、全息投影、霓虹招牌與任何文字：科技感由網頁的介面負責，照片只負責「深夜實驗室」的光
const STYLE = 'Night-time craft lab documentary photography. Deep indigo ambient darkness with violet and magenta rim lights from the sides and a cool, clean key light on the hands and the material. A faint haze in the air and a glossy dark work surface that reflects a little of the coloured light. The craft materials (clay, leather, wood, metal, wax, fabric, paper) must stay clearly recognisable with believable texture and true detail in the shadows. Colour grade leans indigo and violet with small hot-pink highlights. Real photograph, cinematic, high contrast. No screens, no holograms, no neon signs, no text, no letters, no logos, no UI, no watermark.'
const RULES = 'No text, no letters, no numbers, no subtitles, no logo, no watermark, no brand marks, no UI elements or play buttons, no computer screens.'
const HANDS = 'Show only hands and forearms, no face visible.'

// codex 的三種輸出比例
const GEN_RATIO = {
  '16:9': 'wide landscape 3:2 composition (the top and bottom edges will be cropped to 16:9, keep everything important inside the middle band)',
  '3:2': 'wide landscape 3:2 composition',
  '4:5': 'tall portrait 2:3 composition (the top and bottom edges will be cropped to 4:5, keep everything important inside the middle)',
  '1:1': 'square 1:1 composition',
}
const PHOTO = (ratio, desc) => `Photorealistic photograph, ${GEN_RATIO[ratio]}. ${desc} ${STYLE} ${RULES}`
// 學員作品牆：手機隨手拍，不要像專業商品照；維持深夜、靛藍帶紫的整體調性，但光是一般家裡的燈
const CANDID = (desc) => `Photorealistic candid smartphone photo, ${GEN_RATIO['1:1']}, as posted on social media by an office worker in Taipei late at night: slightly imperfect casual framing, lit by an ordinary desk lamp, the rest of the room in deep indigo shadow with a faint violet and magenta glow from a small LED strip somewhere out of frame. ${desc} No people visible. ${RULES}`

// [檔名, 比例, 輸出寬, 輸出高, prompt]
const JOBS = [
  // ---------- 首頁 ----------
  // Hero：首頁會裁成 21:9（桌機銀幕，object-position 60% 30%）與 4:3（手機，72% 30%）。
  // 手與碗在右側偏上；左半部與左下、右下角要暗而單純（右下壓 HUD「正在播放」小卡）
  ['hero', '16:9', 1920, 1080, PHOTO('16:9', `Extreme close-up of a craftsperson's two hands hand-pinching a small clay bowl on a glossy dark worktable: one thumb pressing the inner wall of the bowl, the other hand cradling the outside, wet clay smeared on the fingers, a hint of slow-motion movement; a small lump of clay, a natural sponge and a trimming knife nearby. The hands and bowl sit in the RIGHT half of the frame, slightly above the centre, fully inside the frame. The whole LEFT half and the lower-left are plain deep indigo shadow with soft haze (space for a headline). The lower-right corner is also dark and plain (space for a small overlay card). A violet rim light from the left edge and a magenta rim light from the right edge outline the hands. ${HANDS}`)],
  // 工藝情境卡：主體在中上方，下方 1/3 暗而單純（疊作品名稱）
  ['craft-bowl', '4:5', 1200, 1500, PHOTO('4:5', 'A hand-pinched everyday ceramic bowl in use on a home dining table late at night: the bowl holds steaming white rice, a pair of wooden chopsticks rests beside it, a single cool key light on the bowl, violet and magenta rim light catching the steam. The bowl sits in the upper-middle of the frame; the bottom third is plain dark glossy tabletop fading into indigo shadow.')],
  ['craft-cardholder', '4:5', 1200, 1500, PHOTO('4:5', 'A hand-stitched vegetable-tanned leather card holder with neat saddle-stitch lines and burnished edges, one or two plain blank cards tucked in, resting on a dark glossy desk, a cool key light on the leather and a thin violet rim light along its edge. The card holder sits in the upper-middle of the frame; the bottom third is plain dark desk fading into indigo shadow.')],
  ['craft-lamp', '4:5', 1200, 1500, PHOTO('4:5', 'A small handmade solid-wood table lamp switched on beside a bed in a dark bedroom at night: the wooden base shows hand-plane facets and a visible mortise-and-tenon joint, a simple linen shade glowing warm-white; the rest of the room in deep indigo darkness with a faint violet haze. The lamp sits in the upper-middle of the frame; the bottom third is plain and dark.')],
  ['craft-ring', '4:5', 1200, 1500, PHOTO('4:5', `A forged plain sterling-silver ring with fine hammered facets resting on an open palm, as if about to be given as a gift, a small open dark gift box nearby; crisp cool light makes the silver gleam and the facets catch small violet and pink reflections. The ring is large and clearly visible in the upper-middle of the frame; the bottom third is plain and dark. ${HANDS}`)],
  // 學員作品牆（手機隨手拍）
  ['ugc-weekend-potter', '1:1', 1080, 1080, CANDID('A beginner\'s first hand-pinched bowl, a little irregular and clearly handmade by a novice, on a home dining table holding a simple dinner of rice and stir-fried vegetables.')],
  ['ugc-leather-lin', '1:1', 1080, 1080, CANDID('A beginner\'s first hand-stitched leather card holder with slightly uneven stitches on a home desk, next to a diamond stitching chisel, two needles with waxed thread and leather offcuts.')],
  // 播放器畫面：中央會疊大播放鈕、上方疊覆蓋文字、下方疊控制列
  ['player-trial', '16:9', 1920, 1080, PHOTO('16:9', `A frame from an online pottery lesson, 45-degree top-down view: on a glossy dark worktable three or four different kinds of clay are laid side by side (red earthenware, white porcelain clay, coarse grogged stoneware, grey clay), each with a clearly different colour and texture under a clean cool key light; one hand of the craftsperson picks up one block and breaks it open with the fingers to show its cross-section. Subject in the centre with some calm empty space all around. ${HANDS}`)],
  ['player-learn', '16:9', 1920, 1080, PHOTO('16:9', `A frame from an online pottery lesson, close-up three-quarter side view: a fist-sized ball of clay on the glossy dark worktable, the craftsperson's thumb pressing down into it at about a 45-degree angle to open the shape of a bowl, the other hand supporting the outside of the ball; violet rim light on one side, magenta on the other. Subject in the centre; the bottom 15 percent and the upper-left area are plain dark indigo shadow. ${HANDS}`)],

  // ---------- 課程封面（16:9，可能被裁成 4:3 或 1:1：主體放在中央 70%） ----------
  ['course-pottery', '16:9', 1600, 900, PHOTO('16:9', `Two hands hand-pinching a clay bowl at a home dining table covered with a canvas cloth late at night; beside it a few small air-drying bowls, a sponge and a trimming knife — clearly no pottery wheel, just a dining table. Subject in the central 70 percent of the frame. ${HANDS}`)],
  ['course-leather', '16:9', 1600, 900, PHOTO('16:9', `Two hands saddle-stitching with two needles, the leather held in a wooden stitching clamp; on the table a diamond stitching chisel, a leather knife and cut pieces of vegetable-tanned leather. Subject in the central 70 percent of the frame. ${HANDS}`)],
  ['course-woodwork', '16:9', 1600, 900, PHOTO('16:9', `Two hands pushing a hand plane along a solid wood board, a curl of wood shaving rising and catching the violet rim light; on the workbench chisels and a half-finished small side-table leg with a mortise joint. Hand tools only, absolutely no power tools. Subject in the central 70 percent of the frame. ${HANDS}`)],
  ['course-plant-dye', '16:9', 1600, 900, PHOTO('16:9', `Gloved hands lifting a freshly plant-dyed cotton T-shirt out of a dye pot with a little steam rising, onion skins, madder roots and indigo leaves beside the pot, an embroidery hoop with stitching in progress nearby. The dyed fabric keeps its true natural colour. Subject in the central 70 percent of the frame. ${HANDS}`)],
  ['course-silver', '16:9', 1600, 900, PHOTO('16:9', `One hand holding a silver ring on a steel ring mandrel while the other hand strikes it with a small hammer; on the bench a length of silver wire, a file and a small torch. Subject in the central 70 percent of the frame. ${HANDS}`)],
  ['course-candle', '16:9', 1600, 900, PHOTO('16:9', `Two hands pouring melted wax into a glass jar with a wick already standing upright; next to it a few small unlabelled essential-oil dropper bottles, a measuring jug and soy wax flakes. Subject in the central 70 percent of the frame. ${HANDS}`)],
  ['course-rattan', '16:9', 1600, 900, PHOTO('16:9', `Straight top-down overhead view of two hands weaving the base of a rattan basket on a dark glossy table, a basin of water with soaking rattan strands beside it. Subject in the central 70 percent of the frame. ${HANDS}`)],
  ['course-zine', '16:9', 1600, 900, PHOTO('16:9', `Two hands pulling a squeegee across a silkscreen frame to print ink onto paper; beside it a stack of folded, saddle-stitched small zines. The printed graphics are only abstract shapes, absolutely no readable text. Subject in the central 70 percent of the frame. ${HANDS}`)],

  // ---------- 課程詳情 ----------
  ['outcome-bowl', '4:5', 1200, 1500, PHOTO('4:5', 'A finished work photographed like a lab specimen: a glazed hand-pinched food bowl about 12 cm across, a simple form with a naturally undulating pinched rim and a visible foot ring, glossy deep blue-grey glaze with small iron speckles, alone on a dark reflective surface, three-quarter elevated view showing both the inside and the side, one clean cool spotlight, a thin violet rim light on the left and magenta on the right. The bowl sits in the centre slightly low, with generous dark space around it.')],
  ['instructor-lin-avatar', '1:1', 600, 600, PHOTO('1:1', 'Portrait of a friendly Taiwanese male ceramic artist in his thirties with short black hair, wearing a grey canvas work apron over a dark T-shirt, a warm approachable expression, chest-up, face exactly in the centre with a little headroom so it can be cropped into a circle; blurred dark pottery studio behind him at night, a clean soft key light on the face and a violet rim light on one shoulder.')],
  ['instructor-lin-studio', '3:2', 1600, 1067, PHOTO('3:2', 'Wide documentary shot inside a small pottery studio in the hills of Shenkeng, Taiwan, late at night: wooden shelves full of drying and fired bowls and plates, a central worktable under a single cool work light, an electric kiln in the corner; deep indigo shadows and a faint violet haze near the window; the same Taiwanese male ceramic artist in his thirties with short black hair and a grey canvas apron works at the table, seen in profile from a distance. Like one calm shot from a documentary film.')],
  // 作品縮圖列：三張同一組作品集（同釉色、同擺法），只差在器型
  ['instructor-lin-work-1', '1:1', 800, 800, PHOTO('1:1', 'Portfolio photo of the artist\'s work: a stack of four hand-pinched rice bowls in glossy deep blue-grey glaze with small iron speckles, on a dark reflective surface under one clean cool spotlight with a thin violet rim light, subject centred.')],
  ['instructor-lin-work-2', '1:1', 800, 800, PHOTO('1:1', 'Portfolio photo of the artist\'s work: a set of three small hand-pinched teacups in glossy deep blue-grey glaze with small iron speckles, on a dark reflective surface under one clean cool spotlight with a thin violet rim light, subject centred.')],
  ['instructor-lin-work-3', '1:1', 800, 800, PHOTO('1:1', 'Portfolio photo of the artist\'s work: one wide shallow hand-pinched serving plate in glossy deep blue-grey glaze with small iron speckles, empty, on a dark reflective surface under one clean cool spotlight with a thin violet rim light, three-quarter elevated view, subject centred.')],
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
