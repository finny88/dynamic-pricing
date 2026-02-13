/**
 * Default color schemes for different unit statuses using Mantine colors
 */
export const DEFAULT_COLOR_SCHEMES = {
	available: {
		background: 'var(--mantine-color-green-6)',
		text: 'var(--mantine-color-green-9)',
		hoverBackground: 'var(--mantine-color-green-7)'
	},
	reserved: {
		background: 'var(--mantine-color-yellow-5)',
		text: 'var(--mantine-color-yellow-9)',
		hoverBackground: 'var(--mantine-color-yellow-6)'
	},
	sold: {
		background: 'var(--mantine-color-red-6)',
		text: 'var(--mantine-color-red-0)',
		hoverBackground: 'var(--mantine-color-red-7)'
	},
	unknown: {
		background: 'var(--mantine-color-gray-5)',
		text: 'var(--mantine-color-gray-9)',
		hoverBackground: 'var(--mantine-color-gray-6)'
	}
} as const

/**
 * ARIA labels and accessibility text
 */
export const ARIA_LABELS = {
	GRID: 'Floor section grid display',
	UNIT: 'Unit',
	FLOOR_LABEL: 'Floor level',
	SECTION_LABEL: 'Section number'
} as const
