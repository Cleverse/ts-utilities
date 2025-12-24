import { defineConfig } from "tsup"
import { cpSync } from "node:fs"
import { resolve } from "node:path"

export default defineConfig({
	entry: ["src/**/*.{ts,tsx,js,jsx,mjs}", "!src/dotrc/**", "!src/globals.d.ts"],

	// Output formats
	format: ["esm", "cjs"],
	bundle: false, // preserveModules, keep the structure and hierarchy of the source code
	dts: true, // .d.ts file for TypeScript
	sourcemap: true, // help in debugging
	clean: true, // delete dist folder before building again
	outDir: "dist",

	// Optimization
	minify: false, // not minified to help debugging
	// treeshake: true, // remove code that is not used
	// splitting: true, // share code between subpath (e.g. logger uses types). required `bundle: true`

	// Platform Compatibility
	target: "es2022", // use the latest features of Modern JS (Node 24/Bun supports)
	platform: "neutral",

	onSuccess: async () => {
		// Copy src/dotrc -> dist/dotrc
		cpSync(resolve("src/dotrc"), resolve("dist/dotrc"), {
			recursive: true,
			force: true,
		})
	},
})
