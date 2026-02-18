import * as z from 'zod'

export const rawUnitSchema = z.object({
	'Статус факт': z.enum(['Продано', 'Бронь', 'Свободно', 'Продается']),
	'№ помещения': z.string(),
	'Этаж': z.string(),
	'Секция': z.string(),
	'Число комнат': z.string(),
	'Общая цена факт, ₽': z.string(),
	'Цена 1 кв. м факт, ₽': z.string(),
	'Общая площадь, кв. м': z.string(),
})