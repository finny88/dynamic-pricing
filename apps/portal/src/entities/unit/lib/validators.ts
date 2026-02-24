import * as z from 'zod'

const ExcelNumberLikeString = z
	.union([z.string(), z.number()])
	.transform((val, ctx) => {
		const str = String(val).replace(/,/g, '').trim()

		if (Number.isNaN(Number(str))) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Must be a numeric value',
			})
			return z.NEVER
		}

		return str
	})

export const rawUnitSchema = z.object({
	'Статус': z.string(),
	'Номер квартиры': ExcelNumberLikeString,
	'Этаж': ExcelNumberLikeString,
	'Подьезд': ExcelNumberLikeString,
	'Количество комнат': ExcelNumberLikeString,
	'Общая цена': ExcelNumberLikeString,
	'Цена за 1 кв.м.': ExcelNumberLikeString,
	'Общая площадь': ExcelNumberLikeString,
})