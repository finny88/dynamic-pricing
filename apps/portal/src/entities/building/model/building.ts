import type { BaseEntity } from '@shared/lib/entity'
import type { Unit } from '@entities/unit/@x/building'

export interface Building extends BaseEntity {
	projectId: string
	name: string
	address: string | null
	units: Unit[]
}
