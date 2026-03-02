import type { Unit } from '@entities/unit/@x/building'
import type { BaseEntity, WithTotalArea } from '@shared/lib/entity'

export interface Building extends BaseEntity, WithTotalArea {
	projectId: string
	name: string
	address: string | null
	units: Unit[]
}

export interface BuildingPageInitialState {
	showViewer: boolean
}