import type { Unit } from '@entities/unit'
import { getUnitStatus } from './unit'
import type { UnitStatus } from '../model/unitStatus'

/**
 * Helper function to apply search filter
 */
export const applySearchFilter = (units: Unit[], query: string): Unit[] => {
	if (!units || !query) { return units || [] }
  
	const lowerQuery = query.toLowerCase()
	return units.filter(unit =>
		(unit.unitNumber || '').toLowerCase().includes(lowerQuery) ||
    (unit.floor || '').toLowerCase().includes(lowerQuery) ||
    (unit.section || '').toLowerCase().includes(lowerQuery))
}

/**
 * Helper function to apply floor filter
 */
export const applyFloorFilter = (units: Unit[], floorNumbers: number[]): Unit[] => {
	if (!units || !floorNumbers) { return units || [] }
  
	return units.filter(unit => floorNumbers.includes(Number(unit.floor)))
}

/**
 * Helper function to apply section filter
 */
export const applySectionFilter = (units: Unit[], sectionNumbers: number[]): Unit[] => {
	if (!units || !sectionNumbers) { return units || [] }
  
	return units.filter(unit => sectionNumbers.includes(Number(unit.section)))
}

/**
 * Helper function to apply status filter
 */
export const applyStatusFilter = (units: Unit[], statuses: UnitStatus[]): Unit[] => {
	if (!units || !statuses) { return units || [] }
  
	return units.filter(unit => {
		const status = getUnitStatus(unit)
		return statuses.includes(status)
	})
}

/**
 * Helper function to apply rooms count filter
 */
export const applyRoomsCountFilter = (units: Unit[], roomsCounts: string[]): Unit[] => {
	if (!units || !roomsCounts) { return units || [] }

	return units.filter(unit => roomsCounts.includes(unit.roomsCount))
}

/**
 * Helper function to apply price range filter
 */
export const applyPriceRubFilter = (
	units: Unit[],
	min?: number,
	max?: number
): Unit[] => {
	if (!units || (min === undefined && max === undefined)) { return units || [] }

	return units.filter(unit => {
		const price = parseFloat((unit.actualTotalPriceRub || '').replace(/,/g, ''))
		if (isNaN(price)) { return true }
		if (min !== undefined && price < min) { return false }
		if (max !== undefined && price > max) { return false }
		return true
	})
}

/**
 * Helper function to apply price per sqm filter
 */
export const applyPricePerSqmRubFilter = (
	units: Unit[],
	min?: number,
	max?: number
): Unit[] => {
	if (!units || (min === undefined && max === undefined)) { return units || [] }

	return units.filter(unit => {
		const price = parseFloat((unit.actualPricePerSqmRub || '').replace(/,/g, ''))
		if (isNaN(price)) { return true }
		if (min !== undefined && price < min) { return false }
		if (max !== undefined && price > max) { return false }
		return true
	})
}

/**
 * Helper function to apply total area filter
 */
export const applyTotalAreaSqmFilter = (
	units: Unit[],
	min?: number,
	max?: number
): Unit[] => {
	if (!units || (min === undefined && max === undefined)) { return units || [] }

	return units.filter(unit => {
		const area = parseFloat((unit.totalAreaSqm || '').replace(/,/g, ''))
		if (isNaN(area)) { return true }
		if (min !== undefined && area < min) { return false }
		if (max !== undefined && area > max) { return false }
		return true
	})
}