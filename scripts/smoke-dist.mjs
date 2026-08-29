// Loads every public dist entry the way a consumer does: by package specifier through the exports map,
// under plain Node in both module systems. Guards against CJS-only dependencies imported with ESM named
// imports (e.g. verror): vitest's CJS interop hides that class of bug, Node's loader does not.
import { existsSync, globSync } from "node:fs"
import { createRequire } from "node:module"
import { sep } from "node:path"

const require = createRequire(import.meta.url)
const { name } = require("../package.json")

// tsup emits a .d.ts for entries and directory proxies only, never for shared chunks
const isEntry = (file) => existsSync(file.replace(/\.js$/, ".d.ts"))
// spec files need the vitest runtime; *.local.* files are gitignored scratch that tsup still picks up locally
const isSpec = (file) => /\.(spec|test|local)\.js$/.test(file)
const toSubpath = (file) =>
	file
		.replace(/^dist[\\/]/, "")
		.replace(/\.js$/, "")
		.split(sep)
		.join("/")

const subpaths = globSync("dist/**/*.js")
	.filter((file) => isEntry(file) && !isSpec(file))
	.map(toSubpath)
if (subpaths.length === 0) {
	console.error("smoke-dist: no dist entries found, run `pnpm build` first")
	process.exit(1)
}

let failed = 0
for (const subpath of subpaths) {
	const specifier = `${name}/${subpath}`
	try {
		await import(specifier) // "import" condition -> dist/*.js
	} catch (error) {
		failed++
		console.error(`ESM ${specifier}: ${error.message}`)
	}
	try {
		require(specifier) // "require" condition -> dist/*.cjs
	} catch (error) {
		failed++
		console.error(`CJS ${specifier}: ${error.message}`)
	}
}

console.log(`smoke-dist: ${subpaths.length} entries x {import, require}, ${failed} failed`)
process.exit(failed === 0 ? 0 : 1)
