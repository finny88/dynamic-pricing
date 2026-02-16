export const TABS = {
	GRID: 'grid',
	GRID_PLUS: 'grid-plus',
	ROOMS: 'rooms'
} as const

export const TAB_LABELS = {
	[TABS.GRID]: 'Шахматка',
	[TABS.GRID_PLUS]: 'Шахматка +',
	[TABS.ROOMS]: 'Помещения'
} as const

export const DEFAULT_TAB = TABS.GRID
