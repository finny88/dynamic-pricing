import { buildingHandlers } from '@entities/building'
import { projectHandlers } from '@entities/project'
import { unitLayoutHandlers } from '@entities/unit-layout'

export const handlers = [...projectHandlers, ...buildingHandlers, ...unitLayoutHandlers]
