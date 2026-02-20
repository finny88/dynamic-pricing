import * as XLSX from 'xlsx'
import { rawUnitSchema, mapRawUnitToUnit } from '@entities/unit'
import type { RawUnit, Unit } from '@entities/unit'

export interface RowValidationError {
	row: number;
	column: string;
	message: string;
	value: unknown;
}

const isIndexable = (value: unknown): value is Record<string | number, unknown> =>
	value !== null && typeof value === 'object'

const validateRow = (raw: Record<string, unknown>, rowIndex: number): { success: true; data: RawUnit } | { success: false; errors: RowValidationError[] } => {
	const result = rawUnitSchema.safeParse(raw)

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
	const header = (headerRow as unknown[] ?? []).map((cell) => String(cell ?? ''))
	const rows = dataRows.slice(0, 5)

	return { header, rows }
}

export const parseFile = async (file: File, columnMapping: Record<number, string>): Promise<{ data: Unit[]; errors: RowValidationError[] }> => {
	const buffer = await file.arrayBuffer()
	const workbook = XLSX.read(buffer)
	const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
	const rawRows = XLSX.utils.sheet_to_json<unknown[]>(firstSheet, { header: 1, defval: null, raw: false })
	const [, ...dataRows] = rawRows

	const data: Unit[] = []
	const errors: RowValidationError[] = []

	dataRows.forEach((row, index) => {
		const rowNumber = index + 2
		const namedRow = Object.fromEntries(Object.entries(columnMapping).map(([colIndex, key]) => [key, row[Number(colIndex)] ?? null]))
		const result = validateRow(namedRow, rowNumber)

		if (result.success) {
			data.push(mapRawUnitToUnit(result.data))
		} else {
			errors.push(...result.errors)
		}
	})

	return { data, errors }
}
