// @ts-check
import eslint from "@eslint/js"
import { defineConfig } from "eslint/config"
import { flatConfigs as importPluginFlatConfigs } from "eslint-plugin-import"
import tseslint from "typescript-eslint"

export default defineConfig(
	eslint.configs.recommended,
	tseslint.configs.recommended,
	importPluginFlatConfigs.recommended,
	{
		languageOptions: {
			globals: {
				document: "readonly",
				window: "readonly",
				navigator: "readonly",
				console: "readonly",
				setTimeout: "readonly",
				clearTimeout: "readonly",
				FileReader: "readonly",
				URL: "readonly",
				Element: "readonly",
				Jupyter: "readonly",
				requirejs: "readonly",
			},
		},
		ignores: ["mcp/index.js", "dist/**", "**/dist/**", "**/node_modules/**", ".next/**", "**/build/**"],
	},
	{
		rules: {
			"@typescript-eslint/no-empty-object-type": "off",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
					destructuredArrayIgnorePattern: "^_",
					ignoreRestSiblings: true,
					ignoreClassWithStaticInitBlock: true,
				},
			],
			"import/order": [
				"error",
				{
					alphabetize: {
						order: "asc",
						orderImportKind: "asc",
						caseInsensitive: true,
					},
					pathGroups: [
						{
							pattern: "{react,react-*,react-*/**}",
							group: "external",
							position: "before",
						},
						{
							pattern: "@/**",
							group: "internal",
						},
					],
					pathGroupsExcludedImportTypes: ["react"],
					groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type", "object"],
					"newlines-between": "always",
				},
			],
			"import/newline-after-import": "error",
			"import/no-unresolved": "off",
			"import/no-deprecated": "warn",
			"import/named": "warn",
			"import/first": "warn",
		},
	},
)
