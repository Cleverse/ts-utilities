# @cleverse/ts-utilities

> 👀 This package is primarily intended for internal use at Cleverse. The repository is public for convenience, but we
> do not actively maintain it as an open-source project.

Shared utilities and common configurations for TypeScript projects at Cleverse.

## Installation

> **Note:**
>
> There are some packages that are peer dependencies and required you to add them manually to your project (such as
> `eslint`, `typescript`, `zod`, `pino-pretty`).
>
> Recommended to add `auto-install-peers=true` to `.npmrc` file to automatically install them.

This package is **not published to npm**. Install directly from GitHub:

```shell
pnpm add git+https://github.com/cleverse/ts-utilities.git
# or
pnpm add git+ssh://git@github.com:cleverse/ts-utilities.git

# with specific version/tag/commit
pnpm add git+ssh://git@github.com:cleverse/ts-utilities.git#v1.0.0
```

💡 Recommend install package manually by editing `package.json` to ensure installation compatibility on CI/CD such as
GitHub Actions.

```json
// package.json
{
	"dependencies": {
		"@cleverse/ts-utilities": "git+https://github.com/cleverse/ts-utilities.git#v1.0.0"
	}
}
```

## Usage

Import specific modules:

```typescript
import { logger } from "@cleverse/ts-utilities/logger"
import { sleep, errors } from "@cleverse/ts-utilities/utils"
import { awaitAbort } from "@cleverse/ts-utilities/utils/aborts"
```

#### Import shared configs (ESLint, TSConfig)

See [dotrc](./src/dotrc) for available configurations

```json
// tsconfig.json
{
	"extends": "@cleverse/ts-utilities/dotrc/tsconfig/node.json",
	"exclude": ["node_modules", "dist"]
}
```

```javascript
// eslint.config.mjs
import base from "@cleverse/ts-utilities/dotrc/eslint/base.mjs"

export default [
	...base,
	{
		ignores: ["*.config.mjs", "*.config.ts", "dist/**", "dist"],
	},
]
```

---

## Contributing

### Prerequisites

- [mise](https://mise.jdx.dev/) (recommended) or Node.js 24+
- [pnpm](https://pnpm.io/) 10+ (automatically installed by mise or running `$ corepack enable`)

### Setup

```bash
# Install dependencies
pnpm install

# Setup git hooks (husky)
pnpm husky
```

### Development

```bash
# Build the package
pnpm build

# Watch mode during development
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Type checking
pnpm typecheck

# Linting
pnpm lint
pnpm lint:fix

# Formatting
pnpm format
pnpm format:fix

# Check for dependency updates
pnpm check-update
pnpm check-update:fix
```

### Release

1. Update version in `package.json`
2. Commit and push changes
3. Create a git tag: `git tag v1.x.x && git push origin v1.x.x`
4. Wait for the release workflow to complete and check the release notes.

Consumers can then update by referencing the new tag.

---

## License

[MIT](LICENSE) © Cleverse Corporation Co., Ltd.
