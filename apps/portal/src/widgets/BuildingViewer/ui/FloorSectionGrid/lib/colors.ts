import type { Unit } from '@entities/unit'

/**
 * Default color schemes for different unit statuses using Mantine colors
 */
export const DEFAULT_COLOR_SCHEMES = {
	available: {
		background: 'var(--mantine-color-green-6)',
		text: 'var(--mantine-color-white)',
	},
	reserved: {
		background: 'var(--mantine-color-yellow-5)',
		text: 'var(--mantine-color-white)',
	},
	onhold: {
		background: 'var(--mantine-color-indigo-6)',
		text: 'var(--mantine-color-white)',
	},
	sold: {
		background: 'var(--mantine-color-gray-5)',
		text: 'var(--mantine-color-white)',
	},
	unknown: {
		background: 'var(--mantine-color-dark-6)',
		text: 'var(--mantine-color-white)',
	}
} as const

export const getUnitColors = (unit: Unit) => {
	return DEFAULT_COLOR_SCHEMES[unit.actualStatus]
}