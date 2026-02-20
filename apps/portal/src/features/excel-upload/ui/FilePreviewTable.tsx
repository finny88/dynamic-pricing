import { useMemo } from 'react'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Table, Text } from '@mantine/core'
import type { FilePreview } from '../lib/parseFile'
import { ExpectedFormatTable } from './ExpectedFormatTable'
import styles from './FilePreviewTable.module.css'

const columnHelper = createColumnHelper<unknown[]>()

const toColumnLetter = (index: number): string => {
	let result = ''
	let n = index + 1
	while (n > 0) {
		n--
		result = String.fromCharCode(65 + (n % 26)) + result
		n = Math.floor(n / 26)
	}
	return result
}

interface Props {
	preview: FilePreview
}

export const FilePreviewTable = ({ preview }: Props) => {
	const { header, rows } = preview

	const columns = useMemo(() => header.map((col, index) =>
		columnHelper.accessor((row) => row[index], {
			id: String(index),
			header: col,
		})),
	[header],)

	const table = useReactTable({
		data: rows,
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	return (
		<>
			<div className={styles.wrapper}>
				<Text size={'sm'} c={'dimmed'} mb={'xs'}>
					Предпросмотр файла (первые 5 строк)
				</Text>
				<div className={styles.scroll}>
					<Table withTableBorder withColumnBorders className={styles.table}>
						<Table.Thead>
							<Table.Tr>
								<Table.Th className={styles.lineNumberCell} />
								{header.map((_, index) => (
									<Table.Th key={index} className={styles.columnLetterCell}>
										{toColumnLetter(index)}
									</Table.Th>
								))}
							</Table.Tr>
							{table.getHeaderGroups().map((headerGroup) => (
								<Table.Tr key={headerGroup.id}>
									<Table.Th className={styles.lineNumberCell} />
									{headerGroup.headers.map((col) => (
										<Table.Th key={col.id} className={styles.th}>
											{flexRender(col.column.columnDef.header, col.getContext())}
										</Table.Th>
									))}
								</Table.Tr>
							))}
						</Table.Thead>
						<Table.Tbody>
							{table.getRowModel().rows.map((row, index) => (
								<Table.Tr key={row.id}>
									<Table.Td className={styles.lineNumberCell}>{index + 1}</Table.Td>
									{row.getVisibleCells().map((cell) => (
										<Table.Td key={cell.id} className={styles.td}>
											{String(cell.getValue() ?? '')}
										</Table.Td>
									))}
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</div>
			</div>
			<ExpectedFormatTable />
		</>
	)
}
