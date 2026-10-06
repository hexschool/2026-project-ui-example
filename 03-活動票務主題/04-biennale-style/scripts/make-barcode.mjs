// ============================================================
// 產生 Code 128（B 字集）條碼的 SVG：本風格的招牌「巨型條碼」都是用這支產生後貼進 HTML
//
// 用法：
//   node scripts/make-barcode.mjs T-4471-01     # 印出 <svg>…</svg>，複製到 HTML
//   node scripts/make-barcode.mjs StageOne
//
// 產生的條碼是真的 Code 128：起始碼 B → 每個字元 → 檢查碼 → 結束碼，掃描器讀得出原本的文字。
// SVG 的寬度單位是「模組」（最細的一條＝ 1），加上 preserveAspectRatio="none"，
// 就能用 CSS 把條碼拉成任意寬高（例如頁尾滿版、票券滿寬），條與條的比例不變。
// 顏色用 currentColor：放在黑字區塊是黑條、放在黑底白字區塊就是白條。
// ============================================================

import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Code 128 的 107 種圖樣：每個數字是「條、空、條、空、條、空」的寬度（模組數），合計 11
const PATTERNS = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213',
  '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
  '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
  '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
  '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
  '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111',
  '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214',
  '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
  '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
  '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141',
  '114131', '311141', '411131', '211412', '211214', '211232', '2331112',
]
const START_B = 104
const STOP = 106

export function code128b(text) {
  const values = [...text].map((ch) => {
    const v = ch.charCodeAt(0) - 32
    if (v < 0 || v > 94) throw new Error(`Code 128B 不支援字元「${ch}」`)
    return v
  })
  const checksum = values.reduce((sum, v, i) => sum + v * (i + 1), START_B) % 103
  const widths = [START_B, ...values, checksum, STOP].map((v) => PATTERNS[v]).join('')
  // 轉成 SVG path：只畫「條」（奇數位置），空白不畫
  let x = 0
  let d = ''
  ;[...widths].forEach((w, i) => {
    const width = Number(w)
    if (i % 2 === 0) d += `M${x} 0h${width}v1h-${width}z`
    x += width
  })
  return { width: x, d }
}

// 直接執行時：印出可貼進 HTML 的 SVG（被其他腳本 import 時不印）
if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || '')) {
  const text = process.argv[2] || 'T-4471-01'
  const { width, d } = code128b(text)
  console.log(`<!-- Code 128B「${text}」，${width} 個模組寬；高度由 CSS 決定 -->`)
  console.log(`<svg class="barcode" viewBox="0 0 ${width} 1" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path fill="currentColor" d="${d}"/></svg>`)
}
