import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'
import { cpSync, mkdirSync, rmSync, existsSync } from 'node:fs'

const require = createRequire(import.meta.url)
const entry = require.resolve('@mediapipe/face_mesh')
const pkgDir = dirname(entry)

// Script location: apps/web/scripts/copy-mp-assets.mjs
// Target public dir: apps/web/public/mediapipe/face_mesh
const here = dirname(fileURLToPath(import.meta.url))
const webRoot = resolve(here, '..')
const outDir = join(webRoot, 'public', 'mediapipe', 'face_mesh')

if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })

// Copy the package directory (it includes the model and wasm assets)
cpSync(pkgDir, outDir, { recursive: true })

console.log('[copy-mp-assets] Copied MediaPipe FaceMesh assets to', outDir)
