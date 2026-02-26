import { projectHandlers } from '@entities/project'
import { buildingHandlers } from '@entities/building'

export const handlers = [...projectHandlers, ...buildingHandlers]
