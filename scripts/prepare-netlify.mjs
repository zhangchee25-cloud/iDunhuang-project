import { copyFile, mkdir, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { build } from 'vite'

const projectRoot = fileURLToPath(new URL('../', import.meta.url))
const publishDir = path.join(projectRoot, 'sites/netlify-dist')
const assets = [
  'favicon.svg',
  'assets/buddha.glb',
  'assets/buddha-real.jpg',
  'assets/diamond-frontispiece.jpg',
  'assets/diamond-text.jpg',
  'assets/diamond-colophon.jpg',
  'assets/diamond-overview.jpg',
  'assets/p3808-score.jpg',
  'assets/team-emblem.svg',
  'assets/team-emblem-purple.svg',
  'assets/team-emblem-small.svg',
]

// Validate inputs before clearing only the dedicated generated output directory.
for (const asset of assets) {
  const input = path.join(projectRoot, 'public', asset)
  if (!(await stat(input)).isFile()) throw new Error(`Missing publish asset: ${asset}`)
}

await build({
  root: projectRoot,
  publicDir: false,
  build: { outDir: publishDir, emptyOutDir: true },
})

// Keep original photo collections, model inputs and development records local.
for (const asset of assets) {
  const target = path.join(publishDir, asset)
  await mkdir(path.dirname(target), { recursive: true })
  await copyFile(path.join(projectRoot, 'public', asset), target)
}
console.log(`Netlify publish files ready: ${publishDir}`)
