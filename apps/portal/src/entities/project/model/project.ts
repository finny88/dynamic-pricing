export const housingClassLabels: Record<string, string> = {
	economy: 'Эконом',
	comfort: 'Комфорт',
	business: 'Бизнес',
	elite: 'Элит',
}

import type { BaseEntity, WithTotalArea } from '@shared/lib/entity'

export interface Project extends BaseEntity, WithTotalArea {
	name: string
	developer: string | null
	region: string | null
	area: string | null
	city: string | null
	housingClass: string | null
	profileStatus: string
	buildingsCount: number
	lotsCount: number
	soldArea: number
	planArea: number
	factArea: number
}