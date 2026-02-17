import type { Unit } from '@entities/unit'
import type { UnitStatus } from '../models/unitStatus'
import type { FilterOptions } from '../models/filters'
import { applyPricePerSqmRubFilter, applyPriceRubFilter, applyTotalAreaSqmFilter } from './filters'

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
	if (status.includes('свободн') || status.includes('available') || status.includes('доступн')) {
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

/**
 * Helper function to check if a unit should be disabled based on active filters
 */
export const isUnitDisabled = (unit: Unit, activeFilters: FilterOptions): boolean => {
	if (!unit || !activeFilters) { return false }
	
	// Check search filter
	if (activeFilters.searchQuery) {
		const query = activeFilters.searchQuery.toLowerCase()
		const matchesSearch =
			(unit.unitNumber || '').toLowerCase().includes(query) ||
			(unit.floor || '').toLowerCase().includes(query) ||
			(unit.section || '').toLowerCase().includes(query)
		if (!matchesSearch) { return true }
	}

	// Check floor filter
	if (activeFilters.floors && activeFilters.floors.length > 0) {
		if (!activeFilters.floors.includes(Number(unit.floor))) { return true }
	}

	// Check section filter
	if (activeFilters.sections && activeFilters.sections.length > 0) {
		if (!activeFilters.sections.includes(Number(unit.section))) { return true }
	}

	// Check status filter
	if (activeFilters.statuses && activeFilters.statuses.length > 0) {
		const status = getUnitStatus(unit)
		if (!activeFilters.statuses.includes(status)) { return true }
	}

	// Check rooms count filter
	if (activeFilters.roomsCount && activeFilters.roomsCount.length > 0) {
		if (!activeFilters.roomsCount.includes(unit.roomsCount)) { return true }
	}

	// Check price range filters
	if (!applyPriceRubFilter(
		[unit], activeFilters.priceRubMin, activeFilters.priceRubMax
	)[0]) { return true }
	if (!applyPricePerSqmRubFilter(
		[unit], activeFilters.pricePerSqmRubMin, activeFilters.pricePerSqmRubMax
	)[0]) { return true }
	if (!applyTotalAreaSqmFilter(
		[unit], activeFilters.totalAreaSqmMin, activeFilters.totalAreaSqmMax
	)[0]) { return true }

	return false
}