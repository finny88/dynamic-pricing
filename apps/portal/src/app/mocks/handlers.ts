import { buildingHandlers } from '@entities/building'
import { projectHandlers } from '@entities/project'

export const handlers = [...projectHandlers, ...buildingHandlers]
