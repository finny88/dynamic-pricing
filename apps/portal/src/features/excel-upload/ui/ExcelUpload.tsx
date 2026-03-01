import { useRef, useState } from 'react'
import { ActionIcon, Box, Button, Container, Group, LoadingOverlay, Modal, ScrollArea, Table, Text, TextInput, Title, Tooltip } from '@mantine/core'
import { IconCopy, IconFile, IconFileSpreadsheet, IconFolder, IconHighlight, IconTrash } from '@tabler/icons-react'
import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import type * as z from 'zod'
import type { Unit } from '@entities/unit'
import { parseFile, parseFilePreview } from '../lib/parseFile'
import type { FilePreview, RowValidationError } from '../lib/parseFile'
import { FilePreviewTable } from './FilePreviewTable'

const ACCEPT = '.xls,.xlsx,.csv'

interface Props {
	onSuccess: (units: Unit[]) => void
}

export const ExcelUpload = ({ onSuccess }: Props) => {
	const [file, setFile] = useState<File | null>(null)
	const [preview, setPreview] = useState<FilePreview | null>(null)
	const [loading, setLoading] = useState(false)
	const [invalid, setInvalid] = useState<RowValidationError[] | null>(null)
	const [errorsModalOpen, setErrorsModalOpen] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	const handleFileChange = async (selected: File) => {
		setFile(selected)
		setInvalid(null)
		const filePreview = await parseFilePreview(selected)
		setPreview(filePreview)
	}

	const handleParse = async (mapping: Record<string, string>, schema: z.ZodType) => {
		if (!file) {
			return
		}
		setLoading(true)
		try {
			const parsed = await parseFile(
				file, mapping, schema
			)
			if (parsed.errors.length > 0) {
				setInvalid(parsed.errors)
				setErrorsModalOpen(true)
				setLoading(false)
			} else {
				onSuccess(parsed.data)
				// loading stays true — component is about to unmount
			}
		} catch {
			setLoading(false)
		}
	}

	const handleCopyErrors = () => {
		const text = JSON.stringify(
			invalid, null, 2
		)
		void navigator.clipboard.writeText(text)
	}

	const handleExportErrors = () => {
		if (!invalid) {
			return
		}
		const rows = invalid.map((err) => ({
			'Строка': err.row,
			'Колонка': err.column,
			'Ошибка': err.message,
			'Значение': String(err.value ?? ''),
		}))
		const ws = XLSX.utils.json_to_sheet(rows)
		const wb = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(
			wb, ws, 'Ошибки'
		)
		XLSX.writeFile(wb, 'ошибки_валидации.xlsx')
	}

	const handleExportSourceWithErrors = async () => {
		if (!file || !invalid) {
			return
		}
		const buffer = await file.arrayBuffer()
		const sheetJsWb = XLSX.read(buffer)
		const sheet = sheetJsWb.Sheets[sheetJsWb.SheetNames[0]]
		const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: false, defval: null })

		const headers = ((rows[0] ?? []) as string[]).map(String)
		const errorCells = new Set(invalid.map((err) => `${err.row}:${err.column}`))
		const errorFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCCCC' } }

		const wb = new ExcelJS.Workbook()
		const ws = wb.addWorksheet(sheetJsWb.SheetNames[0] ?? 'Sheet1')

		rows.forEach((row, rowIndex) => {
			const excelRow = ws.addRow(row as (string | null)[])
			if (rowIndex === 0) {
				excelRow.font = { bold: true }
			} else {
				const excelRowNum = rowIndex + 1
				headers.forEach((header, colIdx) => {
					if (errorCells.has(`${excelRowNum}:${header}`)) {
						excelRow.getCell(colIdx + 1).fill = errorFill
					}
				})
			}
		})

		const outBuffer = await wb.xlsx.writeBuffer()
		const blob = new Blob([outBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = file.name.replace(/(\.\w+)$/, '_с_ошибками$1')
		a.click()
		URL.revokeObjectURL(url)
	}

	return (
		<>
			<Modal
				opened={errorsModalOpen}
				onClose={() => setErrorsModalOpen(false)}
				title={
					<Group gap={'xs'}>
						<Text c={'red'} fw={600}>Ошибки валидации</Text>
						<Tooltip label={'Скопировать'}>
							<ActionIcon
								variant={'subtle'}
								color={'gray'}
								onClick={handleCopyErrors}
							>
								<IconCopy size={16} />
							</ActionIcon>
						</Tooltip>
						<Tooltip label={'Выгрузить в excel'}>
							<ActionIcon
								variant={'subtle'}
								color={'gray'}
								onClick={handleExportErrors}
							>
								<IconFileSpreadsheet size={16} />
							</ActionIcon>
						</Tooltip>
						<Tooltip label={'Выгрузить исходный файл с ошибками'}>
							<ActionIcon
								variant={'subtle'}
								color={'gray'}
								onClick={() => { void handleExportSourceWithErrors() }}
							>
								<IconHighlight size={16} />
							</ActionIcon>
						</Tooltip>
					</Group>
				}
				size={'lg'}
				centered
				scrollAreaComponent={ScrollArea.Autosize}
			>
				<Table striped withTableBorder>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Строка</Table.Th>
							<Table.Th>Колонка</Table.Th>
							<Table.Th>Ошибка</Table.Th>
							<Table.Th>Значение</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{invalid?.map((err, i) => (
							<Table.Tr key={i}>
								<Table.Td>{err.row}</Table.Td>
								<Table.Td>{err.column}</Table.Td>
								<Table.Td>{err.message}</Table.Td>
								<Table.Td>{String(err.value ?? '')}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				<Button mt={'md'} color={'red'} onClick={() => setErrorsModalOpen(false)}>
					Закрыть
				</Button>
			</Modal>
			<Box pos={'relative'}>
				<LoadingOverlay visible={loading} />
				<Container size={'xl'} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
					<input
						ref={inputRef}
						type={'file'}
						accept={ACCEPT}
						style={{ display: 'none' }}
						onChange={(e) => {
							const selected = e.target.files?.[0]
							if (selected) { void handleFileChange(selected) }
							e.target.value = ''
						}}
					/>
					<Group align={'flex-end'} wrap={'nowrap'} gap={'xs'}>
						<TextInput
							label={<Title order={3}>Загрузить файл</Title>}
							styles={{ label: { display: 'block', width: 'fit-content', marginInline: 'auto', marginBottom: 4 }, root: { flex: 1 } }}
							value={file?.name ?? ''}
							readOnly
							disabled={loading}
							leftSection={file ? <IconFile size={16} /> : null}
						/>
						{file && (
							<Button
								size={'sm'}
								color={'red'}
								disabled={loading}
								leftSection={<IconTrash size={16} />}
								onClick={() => {
									setFile(null)
									setPreview(null)
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
				</Container>
				{preview && (
					<Container fluid px={{ base: 'md', sm: 'lg', md: 'xl' }} mt={'md'}>
						<FilePreviewTable preview={preview} loading={loading} onParse={(mapping, schema) => { void handleParse(mapping, schema) }} />
					</Container>
				)}
			</Box>
		</>
	)
}
