import type { Unit } from '@entities/unit'
import type { FilterOptions } from '../model/filters'

interface ApplyRangeFilterParams {
	units: Unit[]
	field: keyof Unit
	min?: number
	max?: number
}

const applyRangeFilter = ({ units, field, min, max }: ApplyRangeFilterParams,): Unit[] => {
	if (min === undefined && max === undefined) { return units }
	return units.filter(unit => {
		const value = unit[field] as number
		if (min !== undefined && value < min) { return false }
		if (max !== undefined && value > max) { return false }
		return true
	})
}

/**
 * Helper function to compute grid matrix and related data
 */
export const computeGridData = (units: Unit[]) => {
	const computedSections = Array.from(new Set(units.map(item => Number(item.section)))).sort((a, b) => a - b)
	const computedFloors = Array.from(new Set(units.map(item => Number(item.floor)))).sort((a, b) => b - a)

	const computedMatrix: Record<string, Unit[]> = {}

	units.forEach(item => {
		const key = `${item.floor}_${item.section}`
		if (!computedMatrix[key]) {
			computedMatrix[key] = []
		}
		computedMatrix[key].push(item)
	})

	// sort units by unitNumber ASC
	Object.values(computedMatrix).forEach(unitList => {
		unitList.sort((a, b) => a.unitNumber - b.unitNumber)
	})

	return {
		sections: computedSections,
		floors: computedFloors,
		matrix: computedMatrix,
	}
}

/**
 * Helper function to compute available rooms counts
 */
export const computeAvailableRoomsCounts = (units: Unit[]): number[] => {
	return Array.from(new Set(units.map(item => item.roomsCount))).sort()
}

/**
 * Helper function to compute available floors
 */
export const computeAvailableFloors = (units: Unit[]): number[] => {
	return Array.from(new Set(units.map(item => Number(item.floor)))).sort((a, b) => b - a)
}

/**
 * Helper function to compute available sections
 */
export const computeAvailableSections = (units: Unit[]): number[] => {
	return Array.from(new Set(units.map(item => Number(item.section)))).sort((a, b) => a - b)
}

const matchesUnitNumberFilter = (unit: Unit, searchQuery: string): boolean => {
	return String(unit.unitNumber).includes(searchQuery)
}

const isExcludedByArrayFilter = <T>(value: T, filter: T[] | undefined): boolean =>
	!!filter && filter.length > 0 && !filter.includes(value)

const isExcludedByPriceFilters = (unit: Unit, activeFilters: FilterOptions): boolean =>
	!applyRangeFilter({
		units: [unit],
		field: 'actualTotalPriceRub',
		min: activeFilters.priceRubMin,
		max: activeFilters.priceRubMax,
	})[0] ||
	!applyRangeFilter({
		units: [unit],
		field: 'actualPricePerSqmRub',
		min: activeFilters.pricePerSqmRubMin,
		max: activeFilters.pricePerSqmRubMax,
	})[0] ||
	!applyRangeFilter({
		units: [unit],
		field: 'totalAreaSqm',
		min: activeFilters.totalAreaSqmMin,
		max: activeFilters.totalAreaSqmMax,
	})[0]

/**
 * Helper function to check if a unit should be disabled based on active filters
 */
export const isUnitDisabled = (unit: Unit, activeFilters: FilterOptions): boolean => {
	if (activeFilters.searchQuery && !matchesUnitNumberFilter(unit, activeFilters.searchQuery)) { return true }
	if (isExcludedByArrayFilter(unit.floor, activeFilters.floors)) { return true }
	if (isExcludedByArrayFilter(Number(unit.section), activeFilters.sections)) { return true }
	if (isExcludedByArrayFilter(unit.actualStatus, activeFilters.statuses)) { return true }
	if (isExcludedByArrayFilter(unit.roomsCount, activeFilters.roomsCount)) { return true }
	if (isExcludedByPriceFilters(unit, activeFilters)) { return true }

	return false
}