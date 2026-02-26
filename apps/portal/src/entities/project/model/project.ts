export const housingClassLabels: Record<string, string> = {
	economy: 'Эконом',
	comfort: 'Комфорт',
	business: 'Бизнес',
	elite: 'Элит',
}

export interface Project {
	id: string
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
	updatedAt: string
}