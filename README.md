# @cleverse/ts-utilities

Shared utilities and common configurations for TypeScript projects at Cleverse.

> **Note:** This package is primarily intended for internal use at Cleverse. The repository is public for convenience,
> but we do not actively maintain it as an open-source project.

## Installation

This package is **not published to npm**. Install directly from GitHub:

```bash
# via SSH (recommended for internal use)
pnpm add git+ssh://git@github.com:cleverse/ts-utilities.git

# via HTTPS
pnpm add git+https://github.com/cleverse/ts-utilities.git

# with specific version/tag
pnpm add git+ssh://git@github.com:cleverse/ts-utilities.git#v1.0.0

# with specific commit
pnpm add git+ssh://git@github.com:cleverse/ts-utilities.git#abc1234
```

## Usage

```typescript
// Import specific modules
import { Logger } from "@cleverse/ts-utilities/logger"
import { retry, sleep } from "@cleverse/ts-utilities/utils/miscellaneous"

// Import shared configs (ESLint, TSConfig)
// See ./src/dotrc for available configurations
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

Consumers can then update by referencing the new tag.

---

## License

[MIT](LICENSE) © Cleverse Corporation Co., Ltd.
