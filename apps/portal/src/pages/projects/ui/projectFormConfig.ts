import { housingClassLabels, type CreateProjectDto } from '@entities/project'

export type ProjectFormValues = Pick<CreateProjectDto, 'name' | 'developer' | 'housingClass' | 'city' | 'region' | 'area'>

export const housingClassOptions = Object.entries(housingClassLabels).map(([value, label]) => ({ value, label }))
