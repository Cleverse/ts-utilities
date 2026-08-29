// Loads every public dist entry under plain Node, ESM and CJS.
// Guards against CJS-only dependencies imported with ESM named imports (e.g. verror):
// vitest's CJS interop hides that class of bug, Node's loader does not.
import { globSync } from "node:fs"
import { createRequire } from "node:module"
import { resolve } from "node:path"
import { pathToFileURL } from "node:url"

const require = createRequire(import.meta.url)
const isChunk = (file) => /[\\/]chunk-[A-Z0-9]+\.(js|cjs)$/.test(file)
// spec files need the vitest runtime; *.local.* files are gitignored scratch that tsup still picks up locally
const isSpec = (file) => /\.(spec|test|local)\.(js|cjs)$/.test(file)
const isEntry = (file) => !isChunk(file) && !isSpec(file)

const esmEntries = globSync("dist/**/*.js").filter(isEntry)
const cjsEntries = globSync("dist/**/*.cjs").filter(isEntry)

let failed = 0
for (const file of esmEntries) {
	try {
		await import(pathToFileURL(file).href)
	} catch (error) {
		failed++
		console.error(`ESM ${file}: ${error.message}`)
	}
}
for (const file of cjsEntries) {
	try {
		require(resolve(file))
	} catch (error) {
		failed++
		console.error(`CJS ${file}: ${error.message}`)
	}
}

console.log(`smoke-dist: ${esmEntries.length} esm + ${cjsEntries.length} cjs entries, ${failed} failed`)
process.exit(failed === 0 ? 0 : 1)
