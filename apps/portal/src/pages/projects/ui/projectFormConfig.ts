import type { CreateProjectDto } from '@entities/project'

export type ProjectFormValues = Pick<CreateProjectDto, 'name' | 'code' | 'housingClass' | 'city' | 'region' | 'area'>

export const housingClassLabels: Record<string, string> = {
	economy: 'Эконом',
	comfort: 'Комфорт',
	business: 'Бизнес',
	elite: 'Элит',
}

export const housingClassOptions = Object.entries(housingClassLabels).map(([value, label]) => ({ value, label }))
