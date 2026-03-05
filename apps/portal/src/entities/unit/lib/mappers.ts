import type { RawUnit } from '../model/rawUnit'
import type { Unit } from '../model/unit'
import type { UnitStatus } from '../model/unitStatus'

const str = (value: string | null | undefined): string => value ?? ''
const num = (value: string | null | undefined): number => parseFloat(value ?? '') || 0

const unitStatusKeywords: [UnitStatus, string[]][] = [
	['sold', ['продан', 'sold']],
	['onhold', ['резерв', 'hold']],
	['reserved', ['брон', 'reserved']],
	['available', ['свободн', 'available', 'доступн', 'продается']],
]

const parseUnitStatus = (raw: string): UnitStatus => {
	const status = raw.toLowerCase()
	return unitStatusKeywords.find(([, keywords]) => keywords.some(k => status.includes(k)))?.[0] ?? 'unknown'
}

export const mapRawUnitToUnit = (raw: RawUnit): Unit => ({
	project: str(raw['Проект']),
	address: str(raw['Адрес']),
	classType: str(raw['Класс']),
	building: str(raw['Дом']),
	section: num(raw['Подъезд']),
	salesStartDate: str(raw['Старт продаж']),
	salesEndDate: str(raw['Окончание продаж']),
	commissioningDate: str(raw['Ввод в эксплуатацию']),
	unitNumber: num(raw['Номер квартиры']),
	floor: num(raw['Этаж']),
	roomsCount: num(raw['Количество комнат']),
	totalAreaSqm: num(raw['Общая площадь']),
	livingAreaSqm: num(raw['Жилая площадь']),
	layoutType: str(raw['Планировка, П/план']),
	apartmentConfiguration: str(raw['Конфигурация квартиры']),
	unitsPerFloor: num(raw['Количество квартир на этаже, шт.']),
	balconyOrLoggia: str(raw['Балкон / Лоджия']),
	verandaOrTerrace: str(raw['Веранда / Терраса']),
	ceilingHeightM: num(raw['Высота потолков, м']),
	finishing: str(raw['Отделка']),
	finishingCostPerSqmRub: num(raw['Стоимость отделки, ₽/кв. м']),
	masterBedroom: str(raw['Мастер-спальня']),
	walkInCloset: str(raw['Гардеробная']),
	bathroomsCount: num(raw['Кол-во санузлов, шт.']),
	bathroomType: str(raw['Тип санузла']),
	kitchenType: str(raw['Тип кухни']),
	kitchenAreaSqm: num(raw['Площадь кухни, кв. м']),
	elevatorProximity: str(raw['Близость к лифту']),
	viewType: str(raw['Вид']),
	actualStatus: parseUnitStatus(raw['Статус'] ?? ''),
	actualPricePerSqmRub: num(raw['Цена за 1 кв.м.']),
	actualTotalPriceRub: num(raw['Общая цена']),
	plannedConstructionCostRub: num(raw['Плановая стоимость строительства, руб']),
	saleDate: str(raw['Дата продажи']),
	buyerType: str(raw['Тип покупателя']),
	buyersCount: num(raw['Число покупателей']),
	dealType: str(raw['Тип сделки']),
	initialPricePerSqmRub: num(raw['Цена кв. м на старте продаж, ₽']),
	initialTotalPriceRub: num(raw['Общая цена на старте, ₽']),
	paymentMethod: str(raw['Вариант оплаты']),
	contractRegistrationDate: str(raw['Дата регистрации договора ']),
	discountAmountRub: num(raw['Размер скидки, ₽']),
	specialProgramInfo: str(raw['Информация о спецпрограммах']),
	specialProgramDetails: str(raw['Детали спецпрограммы']),
	fileGeneratedDate: str(raw['Дата формирования файла']),
})
