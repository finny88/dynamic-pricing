# Project Architecture: Feature Slice Design

This project follows Feature Slice Design (FSD). Always adhere to these rules:

## Layer Structure (top to bottom)
src/
  app/       # App-wide setup, providers, global styles, routing
  pages/     # Page compositions (can use features, entities, shared)
  widgets/   # Large composite blocks (can use features, entities, shared)
  features/  # User interactions / business scenarios
  entities/  # Business entities (user, product, order...)
  shared/    # Reusable primitives (ui, lib, api, config, types)

## Slice Structure (inside features/ and entities/)
feature-name/
  ui/        # React components
  model/     # State, stores, business logic (Zustand, Redux slice, etc.)
  api/       # API calls related to this feature
  lib/       # Helpers/utilities local to this slice
  index.ts   # Public API — only export what other slices should use

## Strict Rules
- **Imports only go downward**: app → pages → widgets → features → entities → shared
- **Never import between slices on the same layer** (e.g., one feature cannot import from another feature directly)
- **index.ts is the public API** — never import from internal paths like `features/auth/model/store`
- Cross-slice communication happens via shared/ or through props/events

## When creating new functionality
1. Identify the right layer for it
2. Create a slice folder with the appropriate segments
3. Export only the public interface via index.ts
4. Verify the import direction is valid

## Dependency Management

Always install dependencies with exact versions — never use carets (`^`) or tildes (`~`):
- `yarn add <package>@<version>` — use `yarn add --exact <package>` or specify the version explicitly
- `yarn add -D <package>@<version>` — same rule applies for devDependencies
- Never allow version ranges in `package.json`; all entries must be pinned (e.g. `"react": "19.2.0"`, not `"react": "^19.2.0"`)

## ESLint Rules — Never Violate

The project enforces lint rules via `eslint.config.js`. All generated code must pass `yarn lint` without errors.

### FSD boundary rule (`boundaries/element-types`)
Configured via `eslint-plugin-boundaries` + `@feature-sliced/eslint-config`. Violations are **errors**, not warnings.
- A layer must never import from a layer above it or from the same layer
- Forbidden examples:
  ```ts
  // inside features/ — importing from widgets/ is forbidden
  import { BuildingViewer } from '@widgets/building-viewer'

  // inside entities/ — importing from features/ is forbidden
  import { ExcelUpload } from '@features/excel-upload'

  // inside shared/ — importing from anything above is forbidden
  import { UnitCard } from '@entities/unit'
  ```

### TypeScript & code quality rules
Key rules to respect when generating code:
- No non-null assertion operator `!` (`@typescript-eslint/no-non-null-assertion`) — use `?? ''`, `?? []`, optional chaining, or an explicit null guard instead
- `interface` not `type` for object shapes (`@typescript-eslint/consistent-type-definitions`)
- `import type` for type-only imports (`@typescript-eslint/consistent-type-imports`)
- Arrow function expressions only — no `function` declarations (`func-style`)
- No `console.*` calls (`no-console`)
- No nested ternaries (`no-nested-ternary`)
- Tabs for indentation, single quotes, no semicolons
- Files must not exceed 300 lines (`max-lines`)
- Nesting must not exceed 4 levels (`max-depth`)