import * as z from 'zod'

export const rawUnitSchema = z.object({
	'Статус факт': z.enum(['Продано', 'Бронь', 'Свободно', 'Продается']),
	'№ помещения': z.number(),
	'Этаж': z.number(),
	'Секция': z.number(),
	'Число комнат': z.number(),
	'Общая цена факт, ₽': z.number(),
	'Цена 1 кв. м факт, ₽': z.number(),
	'Общая площадь, кв. м': z.number(),
})