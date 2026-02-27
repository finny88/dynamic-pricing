import type { BaseEntity, WithTotalArea } from '@shared/lib/entity'
import type { Unit } from '@entities/unit/@x/building'

export interface Building extends BaseEntity, WithTotalArea {
	projectId: string
	name: string
	address: string | null
	units: Unit[]
}