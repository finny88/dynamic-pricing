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