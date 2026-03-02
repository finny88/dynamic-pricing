import * as XLSX from 'xlsx'
import type * as z from 'zod'
import { mapRawUnitToUnit, rawUnitSchema } from '@entities/unit'
import type { RawUnit, Unit } from '@entities/unit'

export interface RowValidationError {
	row: number;
	column: string;
	message: string;
	value: unknown;
}

const isIndexable = (value: unknown): value is Record<string | number, unknown> =>
	value !== null && typeof value === 'object'

const validateRow = <T extends z.ZodType>(
	schema: T,
	raw: Record<string, unknown>,
	rowIndex: number,
): { success: true; data: z.infer<T> } | { success: false; errors: RowValidationError[] } => {
	const result = schema.safeParse(raw)

	if (result.success) {
		return { success: true, data: result.data }
	}

	const errors: RowValidationError[] = result.error.issues.map((issue) => ({
		row: rowIndex,
		column: issue.path.join('.') || 'unknown',
		message: issue.message,
		value: issue.path.reduce<unknown>((obj, key) => {
			if (isIndexable(obj) && (typeof key === 'string' || typeof key === 'number')) {
				return obj[key]
			}
			return undefined
		}, raw),
	}))

	return { success: false, errors }
}

export interface FilePreview {
	header: string[];
	rows: unknown[][];
}

export const parseFilePreview = async (file: File): Promise<FilePreview> => {
	const buffer = await file.arrayBuffer()
	const workbook = XLSX.read(buffer)
	const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
	const rawRows = XLSX.utils.sheet_to_json<unknown[]>(firstSheet, { header: 1, defval: null, raw: false })

	const [headerRow, ...dataRows] = rawRows
	const header = (headerRow ?? []).map((cell) => String(cell ?? ''))
	const rows = dataRows.slice(0, 5)

	return { header, rows }
}

const mapToRawUnitUnchecked = (row: Record<string, unknown>, mapping: Record<string, string>): Record<string, unknown> =>
	Object.fromEntries(Object.entries(mapping).map(([schemaKey, headerName]) => [schemaKey, row[headerName] ?? null]))

const isRawUnit = (value: unknown): value is RawUnit => rawUnitSchema.safeParse(value).success

export const parseFile = async (
	file: File,
	columnMapping: Record<string, string>,
	schema: z.ZodType,
): Promise<{ data: Unit[]; errors: RowValidationError[] }> => {
	const buffer = await file.arrayBuffer()
	const workbook = XLSX.read(buffer)
	const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
	const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: null, raw: false })

	const data: Unit[] = []
	const errors: RowValidationError[] = []

	rawRows.forEach((row, index) => {
		const rowNumber = index + 2
		const result = validateRow(
			schema,
			row,
			rowNumber,
		)

		if (result.success) {
			if (isIndexable(result.data)) {
				const rawUnit = mapToRawUnitUnchecked(result.data, columnMapping)
				if (isRawUnit(rawUnit)) {
					data.push(mapRawUnitToUnit(rawUnit))
				}
			}
		} else {
			errors.push(...result.errors)
		}
	})

	return { data, errors }
}
