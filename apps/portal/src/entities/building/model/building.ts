import type { BaseEntity } from '@shared/lib/entity'

export interface Building extends BaseEntity {
	projectId: string
	name: string
	address: string | null
}
