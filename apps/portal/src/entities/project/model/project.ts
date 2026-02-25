export interface Project {
	id: string
	name: string
	code: string | null
	address: string | null
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