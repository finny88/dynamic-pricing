# FloorSectionGrid Review — Issues To Fix

## Bugs
- [ ] 1. `lib/formats.ts:2` — `!price` returns `''` for price `0` (zero price renders empty)
- [ ] 2. `ui/Filters/FilterPopover.tsx:38` — `onDismiss` is not a Mantine Popover prop (should be `onClose`); clicking outside won't close the popover
- [ ] 3. `ui/UnitContainer/UnitCellDetailed.tsx:15` — `status` prop declared in interface but never destructured or used

## Design Issues
- [ ] 4. `FloorSectionGrid.tsx:33` — `computeGridData(units, units)` passes same array twice; `availableRoomsCounts` result is never used
- [ ] 5. `lib/colors.ts` — `hoverBackground === background` for every status; `onMouseEnter`/`onMouseLeave` JS logic in UnitCell and UnitCellDetailed is a no-op
- [ ] 6. `ui/Filters/FilterPopover.tsx:46` — `onKeyDown` closes on any key, not just Escape

## Code Quality
- [ ] 7. `lib/unit.ts` — defensive `!units` guards on typed `Unit[]` parameters (dead branches)
- [ ] 8. `lib/colors.ts:31` — `if (!unit)` guard on `unit: Unit` typed parameter
- [ ] 9. `lib/unit.ts:132` — `isExcludedByPriceFilters` wraps single unit in array to call bulk filter functions; inline comparisons would be clearer
- [ ] 10. `lib/mappers.ts` — file named "mappers" but only exports ARIA label constants; rename to `aria.ts`
- [ ] 11. `ui/Filters/FloorsFilter.tsx`, `SectionsFilter.tsx`, `RoomsFilter.tsx`, `StatusFilter.tsx` — `applyAndClose` render prop argument silently ignored
