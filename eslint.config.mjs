// @ts-check
import base from "./src/dotrc/eslint/base.mjs"

export default [
	...base,
	{
		ignores: ["*.config.mjs", "*.config.ts", "dist/**", "dist"],
	},
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,jsx,tsx}"],
		languageOptions: {
			parserOptions: {
				projectService: true,
			},
		},
	},
]
