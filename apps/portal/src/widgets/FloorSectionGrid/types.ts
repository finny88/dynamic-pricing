import type { Unit } from '@entities/unit'

/**
 * Unit status types based on actualStatus field
 */
export type UnitStatus = 'available' | 'reserved' | 'sold' | 'unknown'

/**
 * Color scheme for unit status
 */
export interface UnitColorScheme {
	background: string
	text: string
	hoverBackground?: string
}

/**
 * Custom color schemes for different unit statuses
 */
export interface ColorSchemes {
	available: UnitColorScheme
	reserved: UnitColorScheme
	sold: UnitColorScheme
	unknown: UnitColorScheme
}

/**
 * Filter options for the grid
 */
export interface FilterOptions {
	floors?: number[]
	sections?: number[]
	statuses?: UnitStatus[]
	roomsCount?: string[]
	searchQuery?: string
}

/**
 * Props for FloorSectionGrid component
 */
export interface FloorSectionGridProps {
	units: Unit[]
}
