import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		setupFiles: ["dotenv/config"],
		include: ["src/**/*.{spec,test}.ts"],
	},
	resolve: {
		alias: [{ find: "@", replacement: `${__dirname}/src` }],
		conditions: ["node", "import", "default"],
	},
	ssr: {
		noExternal: ["@chonkiejs/core", "@chonkiejs/token"],
	},
})
