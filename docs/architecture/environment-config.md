# Environment Configuration

Two-layer approach:

1. **Config** (`src/lib/config.ts`) - Validates and groups environment variables
2. **Env** (`src/lib/env.ts`) - Provides type-safe access across the app

Benefits:
- Type safety and validation
- Organized by feature
- ESLint compliant (`node/no-process-env`)
- Testing friendly