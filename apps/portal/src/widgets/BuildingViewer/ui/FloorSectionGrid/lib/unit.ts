import type { Unit } from '@entities/unit'
import type { UnitStatus } from '../model/unitStatus'
import type { FilterOptions } from '../model/filters'

const applyPriceRubFilter = (
	units: Unit[], min?: number, max?: number
): Unit[] => {
	if (!units || (min === undefined && max === undefined)) { return units || [] }
	return units.filter(unit => {
		if (min !== undefined && unit.actualTotalPriceRub < min) { return false }
		if (max !== undefined && unit.actualTotalPriceRub > max) { return false }
		return true
	})
}

const applyPricePerSqmRubFilter = (
	units: Unit[], min?: number, max?: number
): Unit[] => {
	if (!units || (min === undefined && max === undefined)) { return units || [] }
	return units.filter(unit => {
		if (min !== undefined && unit.actualPricePerSqmRub < min) { return false }
		if (max !== undefined && unit.actualPricePerSqmRub > max) { return false }
		return true
	})
}

const applyTotalAreaSqmFilter = (
	units: Unit[], min?: number, max?: number
): Unit[] => {
	if (!units || (min === undefined && max === undefined)) { return units || [] }
	return units.filter(unit => {
		if (min !== undefined && unit.totalAreaSqm < min) { return false }
		if (max !== undefined && unit.totalAreaSqm > max) { return false }
		return true
	})
}

/**
 * Utility function to determine unit status from unit data
 */
export const getUnitStatus = (unit: Unit): UnitStatus => {
	const status = unit.actualStatus?.toLowerCase() || ''
  
	if (status.includes('продан') || status.includes('sold')) {
		return 'sold'
	}
	if (status.includes('брон') || status.includes('reserved') || status.includes('резерв')) {
		return 'reserved'
	}
	if (status.includes('свободн') || status.includes('available') || status.includes('доступн') || status.includes('продается')) {
		return 'available'
	}
  
	return 'unknown'
}

/**
 * Helper function to compute grid matrix and related data
 */
export const computeGridData = (units: Unit[], allUnits: Unit[]) => {
	if (!units || !allUnits) {
		return {
			sections: [],
			floors: [],
			matrix: {},
			availableRoomsCounts: []
		}
	}
	
	const computedSections = Array.from(new Set(units.map(item => Number(item.section)))).sort((a, b) => a - b)
	const computedFloors = Array.from(new Set(units.map(item => Number(item.floor)))).sort((a, b) => b - a)
	const computedRoomsCounts = Array.from(new Set(allUnits.map(item => item.roomsCount))).sort()

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
		unitList.sort((a, b) =>
			a.unitNumber.localeCompare(
				b.unitNumber, undefined, {
					numeric: true
				}
			))
	})

	return {
		sections: computedSections,
		floors: computedFloors,
		matrix: computedMatrix,
		availableRoomsCounts: computedRoomsCounts
	}
}

/**
 * Helper function to compute available floors
 */
export const computeAvailableFloors = (units: Unit[]): number[] => {
	if (!units) { return [] }
	
	return Array.from(new Set(units.map(item => Number(item.floor)))).sort((a, b) => b - a)
}

/**
 * Helper function to compute available sections
 */
export const computeAvailableSections = (units: Unit[]): number[] => {
	if (!units) { return [] }
	
	return Array.from(new Set(units.map(item => Number(item.section)))).sort((a, b) => a - b)
}

const matchesSearchFilter = (unit: Unit, searchQuery: string): boolean => {
	const query = searchQuery.toLowerCase()
	return (
		(unit.unitNumber || '').toLowerCase().includes(query) ||
		String(unit.floor).includes(query) ||
		String(unit.section).toLowerCase().includes(query)
	)
}

const isExcludedByArrayFilter = <T>(value: T, filter: T[] | undefined): boolean =>
	!!filter && filter.length > 0 && !filter.includes(value)

const isExcludedByPriceFilters = (unit: Unit, activeFilters: FilterOptions): boolean =>
	!applyPriceRubFilter(
		[unit], activeFilters.priceRubMin, activeFilters.priceRubMax
	)[0] ||
	!applyPricePerSqmRubFilter(
		[unit], activeFilters.pricePerSqmRubMin, activeFilters.pricePerSqmRubMax
	)[0] ||
	!applyTotalAreaSqmFilter(
		[unit], activeFilters.totalAreaSqmMin, activeFilters.totalAreaSqmMax
	)[0]

/**
 * Helper function to check if a unit should be disabled based on active filters
 */
export const isUnitDisabled = (unit: Unit, activeFilters: FilterOptions): boolean => {
	if (!unit || !activeFilters) { return false }

	if (activeFilters.searchQuery && !matchesSearchFilter(unit, activeFilters.searchQuery)) { return true }
	if (isExcludedByArrayFilter(unit.floor, activeFilters.floors)) { return true }
	if (isExcludedByArrayFilter(Number(unit.section), activeFilters.sections)) { return true }
	if (isExcludedByArrayFilter(getUnitStatus(unit), activeFilters.statuses)) { return true }
	if (isExcludedByArrayFilter(unit.roomsCount, activeFilters.roomsCount)) { return true }
	if (isExcludedByPriceFilters(unit, activeFilters)) { return true }

	return false
}