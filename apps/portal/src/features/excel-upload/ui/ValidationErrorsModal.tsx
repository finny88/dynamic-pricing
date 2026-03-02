import { ActionIcon, Button, Group, Modal, ScrollArea, Table, Text, Tooltip } from '@mantine/core'
import { IconCopy, IconFileSpreadsheet, IconHighlight } from '@tabler/icons-react'
import ExcelJS from 'exceljs'
import * as XLSX from 'xlsx'
import type { RowValidationError } from '../lib/parseFile'

interface Props {
	onClose: () => void
	errors: RowValidationError[]
	file: File
}

export const ValidationErrorsModal = ({ onClose, errors, file }: Props) => {
	const handleCopyErrors = () => {
		void navigator.clipboard.writeText(JSON.stringify(
			errors, null, 2
		))
	}

	const handleExportErrors = () => {
		const rows = errors.map((err) => ({
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
		const buffer = await file.arrayBuffer()
		const sheetJsWb = XLSX.read(buffer)
		const sheet = sheetJsWb.Sheets[sheetJsWb.SheetNames[0]]
		const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: false, defval: null })

		const headers = (rows[0] ?? []).map(cell => String(cell))
		const errorCells = new Set(errors.map((err) => `${err.row}:${err.column}`))
		const errorFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCCCC' } }

		const wb = new ExcelJS.Workbook()
		const ws = wb.addWorksheet(sheetJsWb.SheetNames[0] ?? 'Sheet1')

		rows.forEach((row, rowIndex) => {
			const excelRow = ws.addRow(row.map(cell => typeof cell === 'string' ? cell : null))
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
		<Modal
			opened
			onClose={onClose}
			title={
				<Group gap={'xs'}>
					<Text c={'red'} fw={600}>Ошибки валидации</Text>
					<Tooltip label={'Скопировать'}>
						<ActionIcon variant={'subtle'} color={'gray'} onClick={handleCopyErrors}>
							<IconCopy size={16} />
						</ActionIcon>
					</Tooltip>
					<Tooltip label={'Выгрузить в excel'}>
						<ActionIcon variant={'subtle'} color={'gray'} onClick={handleExportErrors}>
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
					{errors.map((err, i) => (
						<Table.Tr key={i}>
							<Table.Td>{err.row}</Table.Td>
							<Table.Td>{err.column}</Table.Td>
							<Table.Td>{err.message}</Table.Td>
							<Table.Td>{String(err.value ?? '')}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
			<Button mt={'md'} color={'red'} onClick={onClose}>
				Закрыть
			</Button>
		</Modal>
	)
}
