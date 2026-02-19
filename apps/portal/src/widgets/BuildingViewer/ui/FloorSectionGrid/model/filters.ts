import type { UnitStatus } from './unitStatus'

/**
 * Filter options for the grid
 */
export interface FilterOptions {
	floors?: number[]
	sections?: number[]
	statuses?: UnitStatus[]
	roomsCount?: string[]
	searchQuery?: string
	priceRubMin?: number
	priceRubMax?: number
	pricePerSqmRubMin?: number
	pricePerSqmRubMax?: number
	totalAreaSqmMin?: number
	totalAreaSqmMax?: number
}