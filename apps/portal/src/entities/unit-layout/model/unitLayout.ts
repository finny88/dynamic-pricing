export interface UnitLayout {
	id: string
	buildingId: string
	name: string
	image: string // base64 data URL "data:image/...;base64,..."
	unitNumbers: number[] // Unit.unitNumber[] assigned to this layout
	updatedAt: string // ISO timestamp
}

export type CreateUnitLayoutDto = Omit<UnitLayout, 'updatedAt'>
export type UpdateUnitLayoutDto = Omit<UnitLayout, 'updatedAt'>
export type UpdateUnitLayoutUnitsDto = Pick<UnitLayout, 'id' | 'buildingId' | 'unitNumbers'>
