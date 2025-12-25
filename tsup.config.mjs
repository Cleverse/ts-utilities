import { defineConfig } from "tsup"
import { cpSync, globSync, writeFileSync, existsSync } from "node:fs"
import { resolve, dirname, basename, join } from "node:path"

export default defineConfig({
	// Export all files in src directory.
	entry: ["src/**/*.{ts,tsx,js,jsx,mjs}", "!src/dotrc/**", "!src/globals.d.ts"],

	// Output formats
	format: ["esm", "cjs"],
	bundle: false, // preserveModules, keep the structure and hierarchy of the source code
	dts: true, // .d.ts typed definition file for TypeScript
	sourcemap: true, // useful for library debugging
	clean: true, // delete dist folder before building again
	outDir: "dist",

	// Optimization
	minify: false, // not minified to help debugging
	// treeshake: true, // remove code that is not used
	// splitting: true, // share code between subpath (e.g. logger uses types). required `bundle: true`

	// Platform Compatibility
	target: "es2022", // use the latest features of Modern JS (Node 24/Bun supports)
	platform: "neutral",
	shims: true, // for CJS compatibility

	/**
	 * ⚠️ KNOWN ISSUE: tsup DTS Build Race Condition
	 *
	 * `onSuccess` fires after JS/CJS build completes, but tsup's DTS generation
	 * runs as a SEPARATE ASYNC PROCESS using `tsc` that may complete AFTER `onSuccess`.
	 *
	 * Timeline:
	 * 1. tsup starts → cleans dist/ (if clean: true)
	 * 2. esbuild builds JS/CJS → completes
	 * 3. onSuccess fires → we create proxy files (including .d.ts)
	 * 4. tsc DTS build completes → may OVERWRITE our .d.ts proxy files!
	 *
	 * Workaround: Use `postbuild` npm script to run proxy creation AFTER tsup exits.
	 * See package.json: "build": "tsup && node -e \"import('./tsup.config.mjs').then(m => m.createDirectoryProxyFiles())\""
	 *
	 * Alternative solutions:
	 * - Separate `tsup --dts-only` build step
	 * - Use `experimental-dts` with @microsoft/api-extractor
	 * - Define explicit `exports` map in package.json for each subpath
	 */
	onSuccess: async () => {
		// Copy src/dotrc -> dist/dotrc (static config files, not affected by DTS race)
		cpSync(resolve("src/dotrc"), resolve("dist/dotrc"), {
			recursive: true,
			force: true,
		})

		// NOTE: Proxy files are created here but .d.ts may be overwritten by DTS build.
		// The `postbuild` script in package.json will recreate them after tsup exits.
		createDirectoryProxyFiles()
	},
})

/**
 * Create proxy files to solve Directory Index Resolution problem in Node.js ESM.
 *
 * ## Problem: ESM Directory Index Resolution
 * Node.js ESM (and most bundlers) do NOT auto-resolve directory imports to index files (not resolving `utils/time` to `utils/time/index.js`).
 * This is different from CommonJS which auto-resolves `require('./time')` to `./time/index.js`.
 * E.g.
 * - ❌ `import { ms } from "@pkg/utils/time"` → fails (no auto index resolution in ESM)
 * - ✅ `import { ms } from "@pkg/utils/time/index"` → works but ugly
 *
 * ## Solution: Directory-level Proxy Files
 *
 * - `dist/utils/time.js` → `export * from './time/index.js'`
 * - `dist/utils/time.d.ts` → `export * from './time/index'`
 * - `dist/utils/time.cjs` → `module.exports = require('./time/index.cjs')`
 *
 * This allows clean imports: `import { ms } from "@pkg/utils/time"` ✅
 */
export function createDirectoryProxyFiles() {
	const indexFiles = globSync("dist/**/index.js")
	for (const indexFile of indexFiles) {
		const dirPath = dirname(indexFile) // e.g. `dist/utils/time`
		const parentDir = dirname(dirPath) // e.g. `dist/utils`
		const folderName = basename(dirPath) // e.g. `time`

		// Proxied output paths
		const proxyJsPath = join(parentDir, `${folderName}.js`)
		const proxyCjsPath = join(parentDir, `${folderName}.cjs`)
		const proxyDtsPath = join(parentDir, `${folderName}.d.ts`)

		// Proxy target path (relative import)
		const targetPath = `./${folderName}/index`

		// ESM Proxy (.js)
		writeFileSync(proxyJsPath, `export * from '${targetPath}.js';\n`)

		// Type Proxy (.d.ts)
		writeFileSync(proxyDtsPath, `export * from '${targetPath}';\n`)

		// CJS Proxy (.cjs) - only if CJS index exists
		const cjsIndexFile = indexFile.replace(".js", ".cjs")
		if (existsSync(cjsIndexFile)) {
			writeFileSync(proxyCjsPath, `module.exports = require('${targetPath}.cjs');\n`)
		}

		console.log(`⚡ Created proxy files: ${folderName}.{js,cjs,d.ts}`)
	}
}
