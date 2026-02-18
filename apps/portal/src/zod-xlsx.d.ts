declare module 'zod-xlsx' {
	import type { WorkBook } from 'xlsx'
	import type { ZodTypeAny } from 'zod'

	interface Resource {
		issues: unknown[]
		isValid: boolean
		data: Record<string, unknown>
	}

	interface Result {
		valid: Resource[]
		invalid: Resource[]
	}

	interface ValidatorOptions {
		sheetName?: string
	}

	export const createValidator: (workbook: WorkBook, opts?: ValidatorOptions) => {
		validate: (schema: ZodTypeAny) => Result
		validateAsync: (schema: ZodTypeAny, options?: { batchSize: number }) => Promise<Result>
		rows: unknown[]
		header: unknown
	}
}
