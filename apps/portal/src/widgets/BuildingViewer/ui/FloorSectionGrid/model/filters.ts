import type { UnitStatus } from '@entities/unit'

/**
 * Filter options for the grid
 */
export interface FilterOptions {
	floors?: number[]
	sections?: number[]
	statuses?: UnitStatus[]
	roomsCount?: number[]
	searchQuery?: string
	priceRubMin?: number
	priceRubMax?: number
	pricePerSqmRubMin?: number
	pricePerSqmRubMax?: number
	totalAreaSqmMin?: number
	totalAreaSqmMax?: number
}