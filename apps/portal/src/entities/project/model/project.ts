export const housingClassLabels: Record<string, string> = {
	economy: 'Эконом',
	comfort: 'Комфорт',
	business: 'Бизнес',
	elite: 'Элит',
}

import type { BaseEntity } from '@shared/lib/entity'

export interface Project extends BaseEntity {
	name: string
	developer: string | null
	region: string | null
	area: string | null
	city: string | null
	housingClass: string | null
	profileStatus: string
	buildingsCount: number
	lotsCount: number
	totalArea: number
	soldArea: number
	planArea: number
	factArea: number
}