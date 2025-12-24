import { dirname } from "path"
import { fileURLToPath } from "url"

import { FlatCompat } from "@eslint/eslintrc"
import tseslint from "typescript-eslint"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
	baseDirectory: __dirname,
})

export default tseslint.config(...compat.extends("next/core-web-vitals", "next/typescript"))
