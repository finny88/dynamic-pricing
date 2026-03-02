export interface Unit {
	// rawUnitSchema fields
	actualPricePerSqmRub: number
	actualStatus: string
	actualTotalPriceRub: number
	floor: number
	livingAreaSqm: number
	roomsCount: number
	section: number
	totalAreaSqm: number
	unitNumber: string

	// other fields
	address: string
	apartmentConfiguration: string
	balconyOrLoggia: string
	bathroomsCount: number
	bathroomType: string
	building: string
	buyersCount: number
	buyerType: string
	ceilingHeightM: number
	classType: string
	commissioningDate: string
	contractRegistrationDate: string
	dealType: string
	discountAmountRub: number
	elevatorProximity: string
	fileGeneratedDate: string
	finishing: string
	finishingCostPerSqmRub: number
	initialPricePerSqmRub: number
	initialTotalPriceRub: number
	kitchenAreaSqm: number
	kitchenType: string
	layoutType: string
	masterBedroom: string
	paymentMethod: string
	plannedConstructionCostRub: number
	project: string
	saleDate: string
	salesEndDate: string
	salesStartDate: string
	specialProgramDetails: string
	specialProgramInfo: string
	unitsPerFloor: number
	verandaOrTerrace: string
	viewType: string
	walkInCloset: string
}
