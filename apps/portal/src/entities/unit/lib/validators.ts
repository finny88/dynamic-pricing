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
	'Статус факт': z.string(),
	'№ помещения': ExcelNumberLikeString,
	'Этаж': ExcelNumberLikeString,
	'Секция': ExcelNumberLikeString,
	'Число комнат': ExcelNumberLikeString,
	'Общая цена факт, ₽': ExcelNumberLikeString,
	'Цена 1 кв. м факт, ₽': ExcelNumberLikeString,
	'Общая площадь, кв. м': ExcelNumberLikeString,
})