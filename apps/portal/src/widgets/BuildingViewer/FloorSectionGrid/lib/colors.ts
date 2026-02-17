import type { Unit } from '@entities/unit'
import { getUnitStatus } from './unit'

/**
 * Default color schemes for different unit statuses using Mantine colors
 */
export const DEFAULT_COLOR_SCHEMES = {
	available: {
		background: 'var(--mantine-color-green-6)',
		text: 'var(--mantine-color-green-9)',
		hoverBackground: 'var(--mantine-color-green-6)'
	},
	reserved: {
		background: 'var(--mantine-color-yellow-5)',
		text: 'var(--mantine-color-yellow-9)',
		hoverBackground: 'var(--mantine-color-yellow-5)'
	},
	sold: {
		background: 'var(--mantine-color-gray-5)',
		text: 'var(--mantine-color-red-0)',
		hoverBackground: 'var(--mantine-color-gray-5)'
	},
	unknown: {
		background: 'var(--mantine-color-dark-6)',
		text: 'var(--mantine-color-dark-0)',
		hoverBackground: 'var(--mantine-color-dark-6)'
	}
} as const

export const getUnitColors = (unit: Unit) => {
	if (!unit) { return DEFAULT_COLOR_SCHEMES.unknown }
	
	const status = getUnitStatus(unit)
	return DEFAULT_COLOR_SCHEMES[status]
}