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
- Functions must not have more than 2 parameters (`max-params`) — use an object parameter instead. Example: `({ a, b, c }: Params)` instead of `(a: A, b: B, c: C)`
- No non-null assertion operator `!` (`@typescript-eslint/no-non-null-assertion`) — use `?? ''`, `?? []`, optional chaining, or an explicit null guard instead
- Never use the `in` operator for type guards or property checks — use `isObjectOfTypeWithProperty` from `@shared/lib/typeGuards` instead. The `in` operator reads from the prototype chain; `hasOwnProperty` is precise. Example: `isObjectOfTypeWithProperty(result, 'error')` instead of `'error' in result`
- Avoid `as` type assertions — prefer type guards (`instanceof`, `typeof`, custom `is` predicates), typed variable declarations (`const req: IDBRequest<T> = ...`), or structural transformations (`.filter(isX)`, `.map(cell => ...)`) instead. `as const` is always fine. Justified exceptions: third-party APIs with unavoidably loose types (e.g. `cloneNode` returning `Node`, Mantine generic `onChange`)
- `interface` not `type` for object shapes (`@typescript-eslint/consistent-type-definitions`)
- `import type` for type-only imports (`@typescript-eslint/consistent-type-imports`)
- Always import types explicitly — never access them through a namespace inline. Use `import type { MouseEvent as ReactMouseEvent } from 'react'` instead of `React.MouseEvent`, and `import type { ZodType, infer as ZodInfer } from 'zod'` instead of `z.ZodType` / `z.infer`. Use aliases when the name clashes with a native global or reserved word.
- Arrow function expressions only — no `function` declarations (`func-style`)
- No `console.*` calls (`no-console`)
- No nested ternaries (`no-nested-ternary`)
- Prefer CSS module classes over inline `style={{}}` — only use inline styles for values that are truly dynamic at runtime (e.g. computed colors, grid positions from props). Static values always belong in a `.module.css` file alongside the component.
- Use `clsx` for combining CSS class names — never concatenate classes with template literals or `+`. Conditional classes use the `&&` shorthand: `clsx(classes.base, isActive && classes.active)`. `clsx` is available as a transitive dependency of Mantine.
- Prefer `classNames` over `styles` prop for Mantine components — use `classNames={{ slot: classes.myClass }}` with a CSS module instead of `styles={{ slot: { ... } }}`. Only use `styles` when the values are dynamic at runtime (e.g. colors from props).
- Tabs for indentation, single quotes, no semicolons
- Files must not exceed 300 lines (`max-lines`)
- Nesting must not exceed 4 levels (`max-depth`)

## Modal Pattern

All page-level modals follow a consistent pattern. State and mutations live **inside the modal**, not in the parent page.

### Create modal — ref-based
The modal manages its own open/close state and exposes an `open()` handle via `useImperativeHandle`.
Parent holds a ref and calls `ref.current?.open()`. State is reset in `onExitTransitionEnd`.

```tsx
// CreateFooModal.tsx
export interface CreateFooModalHandle { open: () => void }

export const CreateFooModal = ({ ref, ...props }: { ref: Ref<CreateFooModalHandle> }) => {
  const [createFoo] = useCreateFooMutation()
  const [opened, { open, close }] = useDisclosure(false)
  useImperativeHandle(ref, () => ({ open }))
  // ...
  return <Modal opened={opened} onClose={close} onExitTransitionEnd={reset} ...>
}

// ParentPage.tsx
const createRef = useRef<CreateFooModalHandle>(null)
<Button onClick={() => createRef.current?.open()}>Add</Button>
<CreateFooModal ref={createRef} />
```

### Edit / Delete / other entity modals — conditional render
The modal is **conditionally rendered** by the parent. It starts open (`useDisclosure(true)`) and calls `onClose` after the exit animation (`onExitTransitionEnd`), which clears the entity from parent state and unmounts the component.
Parent never holds an `opened` boolean — only the nullable entity to act on.

```tsx
// EditFooModal.tsx
export const EditFooModal = ({ foo, onClose }: { foo: Foo; onClose: () => void }) => {
  const [updateFoo] = useUpdateFooMutation()
  const [opened, { close }] = useDisclosure(true)
  // ...
  return <Modal opened={opened} onClose={close} onExitTransitionEnd={onClose} ...>
}

// ParentPage.tsx
const [editingFoo, setEditingFoo] = useState<Foo | null>(null)
{editingFoo && <EditFooModal foo={editingFoo} onClose={() => setEditingFoo(null)} />}
```

### Key rules
- Parent pages **never** call `useDisclosure` for modals or hold mutation hooks for modal actions
- Mutations (`useCreateXMutation`, `useUpdateXMutation`, etc.) live inside the modal component
- `onClose` on edit/delete modals is triggered by `onExitTransitionEnd`, not `onClose` of `<Modal>`, so the entity state is cleared only after the animation completes (avoids visual pop)