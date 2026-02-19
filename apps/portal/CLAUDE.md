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