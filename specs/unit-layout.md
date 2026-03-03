# Unit Layout

> Feature spec — in progress

## Overview

Add a "Планировки помещений" (unit layouts) entry point to the `BuildingPage` summary block, and a new `BuildingLayouts` page it navigates to.

---

## 1. BuildingPage — summary block changes

**Location:** `apps/portal/src/pages/building/ui/BuildingPage.tsx`
The summary block currently contains:
- Stats row: Квартир / Площадь / Обновлено
- Buttons row (right-aligned): "Обновить из файла", "Посмотреть объект"

**Change:** Add a third button to the right-side `Group`, positioned after "Посмотреть объект":

```
[ Обновить из файла ]  [ Посмотреть объект ]  [ icon  Планировки помещений / Заполнено N% ]
```

- **Placement:** right-side `Group`, after the "Посмотреть объект" button
- **Icon:** `IconLayoutBoard` (Tabler)
- **Primary text:** "Планировки помещений"
- **Secondary text:** "Заполнено N%" — fill percentage (see §7)
- **Disabled:** when `building.units.length === 0` (same condition as "Посмотреть объект")
- **On click:** navigates to `BuildingLayouts` page (see §2)

---

## 2. New page — BuildingLayouts

**New route:** `/projects/:projectId/buildings/:buildingId/layouts`

**New page component:** `BuildingLayoutsPage` (in `apps/portal/src/pages/building-layouts/`)

### Page top — identical to `BuildingExportPage`

Uses `BuildingPageHeader` with the same structure:

```
Breadcrumbs: Все ЖК  /  {projectName}  /  {building.name ← link to BuildingPage}
─────────────────────────────────────────────────────────────────────
Title: {building.name}
       {building.address}
─────────────────────────────────────────────────────────────────────
```

- `buildingLink` prop = `/projects/:projectId/buildings/:buildingId` (makes building name a back-link)
- Container: `size={'xl'}`, `pt={{ base: 'md', sm: 'lg', md: 'xl' }}`, `px={{ base: 'md', sm: 'lg', md: 'xl' }}`
- Same loading skeleton (h=32, h=80, h=400) and "Дом не найден" error state as `BuildingExportPage`
- Data fetched via same queries: `useGetBuildingByIdQuery` + `useGetProjectQuery`
- **No summary block** — header flows directly into the page body (no stats row, no action buttons between header and content)

### Page body

#### "Добавить планировку" button

- Positioned above the table
- Mantine `Button` with a plus (`IconPlus`) left section
- Label: "Добавить планировку"
- Opens the Add/Edit layout modal (see §4)

#### Layouts table

Displays all `UnitLayout` records for this building.

| Column | Content |
|--------|---------|
| **Планировка** | Thumbnail image of the layout |
| **Наименование** | Text name of the layout |
| **Помещения, соответствующие планировке** | Unit numbers list (`№{unitNumber}`) assigned to this layout, or "Не установлено" if none. Below the list (in both cases) — always an "Отметить на шахматке" button that opens the Unit Selection modal (see §4) |
| **Дата обновления** | `layout.updatedAt` formatted as a readable date |
| *(actions)* | "Редактировать" and "Удалить" buttons, right-aligned at the row edge |

**Default sort:** by `updatedAt` descending (most recently updated first). Sort is static — no user-controlled column sorting required.

---

## 3. Add / Edit layout modal

Single shared modal component used in two modes:

| Mode | Trigger | Initial state |
|------|---------|---------------|
| **Create** | "Добавить планировку" button | Fields empty |
| **Edit** | "Редактировать" row action | Fields pre-filled with existing `UnitLayout` values |

### Fields

| Field | Type | Required | Edit mode |
|-------|------|----------|-----------|
| **Наименование** | Text input | Yes | Pre-filled with `layout.name` |
| **Изображение** | File input (image upload) | Yes | Pre-filled with current image (shown as preview) |

- Same validation rules in both modes — both fields must be filled before submission is allowed
- Replacing the image in edit mode is optional as long as a previous image is already present (field is already "filled")

### Actions

- **Submit** — creates (or updates) the layout, closes modal, refreshes table
- **Cancel / close** — discards changes

---

## 4. "Отметить на шахматке" — unit selection modal

Triggered by the "Отметить на шахматке" button in every row of the layouts table.

### Purpose

Lets the user pick which units (by clicking cells in the grid) belong to this layout. Saves the result back to `layout.unitNumbers`.

### Content

- **Title:** "Укажите помещения, для которых необходимо применить планировку"
- **Body:** `FloorSectionGrid` rendered in a new **selection mode** — units are toggleable instead of read-only
  - Pre-selected units = current `layout.unitNumbers` for this layout
  - Clicking a unit cell toggles its selected state (selected / deselected)
  - Visual distinction between selected and unselected cells (TBD — e.g. teal fill vs default)
- **Actions:**
  - **"Сохранить"** — saves the unit-to-layout match via RTK Query mutation → Axios → MSW handler → IndexedDB (updates `layout.unitNumbers`), closes modal, refreshes table. See §4 "Uniqueness constraint" below.
  - **"Отмена"** — does **not** close immediately; first shows an inline confirmation: _"Вы уверены? Сопоставление квартир будет потеряно"_ with Confirm / Cancel options. Only on confirm does it discard changes and close the modal.

### Uniqueness constraint — "last win"

A unit number can belong to **at most one** layout at a time. When the user saves a selection, the MSW handler must enforce this atomically:

1. Receive the updated `unitNumbers` for layout A
2. Load all other layouts for this building from IndexedDB
3. For each other layout, remove any `unitNumber` that appears in the new selection for layout A
4. Persist all modified layouts back to IndexedDB
5. Persist layout A with its new `unitNumbers`

**Result:** every `unitNumber` in the saved selection is stripped from whichever other layout previously held it. The last save always wins.

This logic lives entirely in the MSW handler — the client sends its selection as-is; deduplication is the handler's responsibility.

### FloorSectionGrid changes

The existing `FloorSectionGrid` component needs a new **selection mode** variant:
- Accepts `selectedUnitNumbers: number[]` and `onSelectionChange: (unitNumbers: number[]) => void` props (or similar)
- In selection mode, clicking a cell toggles the unit in/out of the selection instead of any existing click behavior
- Visual state:
  - **Selected** — larger square + brighter/more saturated green
  - **Unselected** — standard size + muted/lighter green

#### Cell tooltip in selection mode

Simpler than the existing `UnitTooltipContent` (which shows price, rooms badge, price/sqm).
In selection mode the tooltip contains only:

```
№{unitNumber}, {totalAreaSqm} м²
```

A plain single-line string, comma-separated. No price, no rooms badge.

---

## 5. Delete layout confirmation modal


Triggered by "Удалить" row action.

- Asks the user to confirm deletion of the layout
- **Confirm** — deletes the layout, closes modal, refreshes table
- **Cancel / close** — discards, layout is kept

---

## 6. Data model — UnitLayout


New entity, scoped to a building.

```ts
interface UnitLayout {
  id: string
  name: string           // "Наименование"
  image: string          // base64 data URL: "data:image/...;base64,..."
  unitNumbers: number[]  // unit numbers (Unit.unitNumber) assigned to this layout
  updatedAt: string      // ISO timestamp, auto-set by MSW handler on create/update
}
```

**Image pipeline** — follows the same JSON-only convention as `Building` / `Project`:

```
File input
  → FileReader.readAsDataURL()  →  base64 string
  → RTK Query mutation (JSON body: { ..., image: base64 })
  → Axios
  → MSW handler: request.json()
  → IndexedDB: stored as base64 string
```

Display directly as `<img src={layout.image} />` — no object URL conversion needed.

Relationship: a `UnitLayout` belongs to one building; many units (by `unitNumber`) can be linked to one layout.

Note: `Unit` already has a text field `layoutType`. Whether this field is replaced by or linked to `UnitLayout.id` is TBD (depends on backend decisions).

---

## 7. "Заполнение" (fill percentage) logic

Shown as the secondary text on the summary block card (§1): **"Заполнено N%"**

### Formula

```
filledPercent = Math.round(
  assignedUnitsCount / building.units.length * 100
)
```

Where `assignedUnitsCount` = total number of distinct unit numbers that appear in **any** `UnitLayout.unitNumbers` for this building.

### Notes

- Result is an integer percent (0–100), e.g. `Заполнено 43%`
- If the building has no units (`building.units.length === 0`), display `Заполнено 0%` to avoid division by zero
- Recomputed on the client from the locally available layouts data — no dedicated API call needed

---

## Open questions

- [x] Placement — resolved: third button in right-side Group, after "Посмотреть объект", disabled when no units
- [x] Icon — resolved: `IconLayoutBoard` (Tabler)
- [x] "Заполнение N%" calculation logic — resolved: see §7
- [ ] Exact size delta and color tokens for selected vs unselected cells (design spec needed)
- [ ] Image file type/size limits (accepted formats, max size)
- [ ] Whether `Unit.layoutType` (existing text field) is replaced by or linked to `UnitLayout`
- [ ] API / backend contract for `UnitLayout` CRUD — route pattern follows `/api/projects/:projectId/buildings/:buildingId/layouts` (TBD: confirm with team)
