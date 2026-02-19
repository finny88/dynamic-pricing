import { useRef, useState } from 'react'
import { Alert, Button, Container, Group, TextInput, Title } from '@mantine/core'
import { IconFile, IconFolder, IconTrash } from '@tabler/icons-react'
import * as XLSX from 'xlsx'
import { rawUnitSchema } from '../../../entities/unit/libs/validators'
import type { RawUnit } from '@entities/unit/models/rawUnit'
import { BuildingViewer } from '../../../widgets/BuildingViewer/BuildingViewer'
import { mapRawUnitToUnit } from '../../../entities/unit/libs/mappers'
import type { Unit } from '@entities/unit'

const ACCEPT = '.xls,.xlsx,.csv'

const isIndexable = (value: unknown): value is Record<string | number, unknown> =>
	value !== null && typeof value === 'object'

interface RowValidationError {
	row: number;
	column: string;
	message: string;
	value: unknown;
}

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

const parseFile = async (file: File) => {
	const buffer = await file.arrayBuffer()
	const workbook = XLSX.read(buffer)
	const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
	const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: null, raw: false })

	const data: Unit[] = []
	const errors: RowValidationError[] = []

	rawRows.forEach((row, index) => {
		const rowNumber = index + 2

		// Normalize keys to lowercase to be safe
		const normalizedRow = Object.fromEntries(Object.entries(row).map(([k, v]) => [k.trim(), v]))

		const result = validateRow(normalizedRow, rowNumber)

		if (result.success) {
			data.push(mapRawUnitToUnit(result.data))
		} else {
			errors.push(...result.errors)
		}
	})
	
	return { data, errors }
}

export const BuildingPage = () => {
	const [file, setFile] = useState<File | null>(null)
	const [loading, setLoading] = useState(false)
	const [result, setResult] = useState<Unit[] | null>(null)
	const [invalid, setInvalid] = useState<RowValidationError[] | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const handleParse = async () => {
		if (!file) {
			return
		}
		setLoading(true)
		try {
			const parsed = await parseFile(file)
			if (parsed.errors.length > 0) {
				setInvalid(parsed.errors)
				setResult(null)
			} else {
				setResult(parsed.data)
				setInvalid(null)
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<Container pb={'sm'} style={{ display: 'flex', flexDirection: 'column', height: invalid !== null && invalid.length > 0 ? '100vh' : undefined }}>
				<input
					ref={inputRef}
					type={'file'}
					accept={ACCEPT}
					style={{ display: 'none' }}
					onChange={(e) => {
						setFile(e.target.files?.[0] ?? null)
						e.target.value = ''
					}}
				/>
				<TextInput
					label={<Title order={3}>Загрузить файл</Title>}
					styles={{ label: { display: 'block', width: 'fit-content', marginInline: 'auto', marginBottom: 4 } }}
					value={file?.name ?? ''}
					readOnly
					disabled={loading}
					leftSection={file ? <IconFile size={16} /> : null}
					rightSection={
						<Group gap={4} wrap={'nowrap'}>
							{file && (
								<Button
									size={'sm'}
									color={'red'}
									disabled={loading}
									leftSection={<IconTrash size={16} />}
									onClick={() => { 
										setFile(null) 
										setResult(null)
										setInvalid(null)
									}}
								>
									Удалить
								</Button>
							)}
							<Button
								size={'sm'}
								variant={'filled'}
								disabled={loading}
								leftSection={<IconFolder size={16} />}
								onClick={() => inputRef.current?.click()}
							>
								Выбрать ...
							</Button>
						</Group>
					}
					rightSectionPointerEvents={'auto'}
				/>
				<Button
					variant={'filled'}
					mt={'sm'}
					style={{ width: 'fit-content', flexShrink: 0 }}
					disabled={!file}
					loading={loading}
					onClick={() => { void handleParse() }}
				>
					Загрузить файл
				</Button>
				{invalid !== null && invalid.length > 0 && (
					<Alert variant={'light'} color={'red'} mt={'sm'} style={{ flex: '0 1 auto', overflow: 'auto' }}>
						<pre style={{ margin: 0 }}>{JSON.stringify(
							invalid,
							null,
							2,
						)}</pre>
					</Alert>
				)}
			</Container>
			{result !== null && result.length > 0 && (
				<BuildingViewer units={result} />
			)}
		</>
	
	)
}
