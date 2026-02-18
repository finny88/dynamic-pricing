
import { useRef, useState } from 'react'
import { Alert, Button, Container, Group, TextInput, Title } from '@mantine/core'
import { IconFile, IconFolder, IconTrash } from '@tabler/icons-react'
import * as XLSX from 'xlsx'
import { createValidator } from 'zod-xlsx'
import { rawUnitSchema } from '../../../entities/unit/libs/validators'
import type { RawUnit } from '@entities/unit/models/rawUnit'
import { mapRawUnitsToUnits } from '@entities/unit/libs/mappers'
import { BuildingViewer } from '../../../widgets/BuildingViewer/BuildingViewer'

const isRawUnit = (item: unknown): item is RawUnit => rawUnitSchema.safeParse(item).success

const ACCEPT = '.xls,.xlsx,.csv'

const parseFile = async (file: File) => {
	const buffer = await file.arrayBuffer()
	const workbook = XLSX.read(buffer)
	const { invalid } = createValidator(workbook, { sheetName: workbook.SheetNames[0] }).validate(rawUnitSchema)
	if (invalid.length > 0) {
		return { type: 'invalid' as const, invalid }
	}
	const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
	const result = XLSX.utils.sheet_to_json(firstSheet, { defval: '' }).filter(isRawUnit)
	return { type: 'result' as const, result }
}

export const BuildingPage = () => {
	const [file, setFile] = useState<File | null>(null)
	const [loading, setLoading] = useState(false)
	const [result, setResult] = useState<RawUnit[] | null>(null)
	const [invalid, setInvalid] = useState<{ issues: unknown[]; isValid: boolean; data: Record<string, unknown> }[] | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const handleParse = async () => {
		if (!file) {
			return
		}
		setLoading(true)
		try {
			const parsed = await parseFile(file)
			if (parsed.type === 'invalid') {
				setInvalid(parsed.invalid)
				setResult(null)
			} else {
				setResult(parsed.result)
				setInvalid(null)
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<Container pt={'sm'} style={{ display: 'flex', flexDirection: 'column', height: invalid !== null && invalid.length > 0 ? '100vh' : undefined }}>
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
					style={{ width: 'fit-content' }}
					disabled={!file}
					loading={loading}
					onClick={() => { void handleParse() }}
				>
					Загрузить файл
				</Button>
				{invalid !== null && invalid.length > 0 && (
					<Alert variant={'light'} color={'red'} mt={'sm'} style={{ flex: 1, overflow: 'auto' }}>
						<pre style={{ margin: 0 }}>{JSON.stringify(
							invalid,
							null,
							2,
						)}</pre>
					</Alert>
				)}
			</Container>
			{result !== null && result.length > 0 && (
				<BuildingViewer units={mapRawUnitsToUnits(result)} />
			)}
		</>
	
	)
}
