import type { CreateBuildingDto } from '@entities/building'

export type BuildingFormValues = Pick<CreateBuildingDto, 'name' | 'address'>
