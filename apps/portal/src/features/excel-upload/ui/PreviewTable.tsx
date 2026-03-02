import { Table, Text } from '@mantine/core'
import { IconArrowsMove } from '@tabler/icons-react'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { clsx } from 'clsx'
import { useMemo, useState } from 'react'
import type { MouseEvent as ReactMouseEvent, RefObject } from 'react'
import styles from './PreviewTable.module.css'

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
	header: string[]
	rows: unknown[][]
	mappedHeaders: Set<string>
	draggingCol: number | null
	tableRef: RefObject<HTMLTableElement | null>
	onColumnMouseDown: (e: ReactMouseEvent, colIndex: number) => void
}

export const PreviewTable = ({ header, rows, mappedHeaders, draggingCol, tableRef, onColumnMouseDown }: Props) => {
	const [hoveredCol, setHoveredCol] = useState<number | null>(null)

	const columns = useMemo(() => header.map((col, index) =>
		columnHelper.accessor((row) => row[index], {
			id: String(index),
			header: col,
		})),
	[header])

	const table = useReactTable({
		data: rows,
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	const colClass = (colIndex: number, base: string) =>
		clsx(
			base,
			styles.draggableColumn,
			draggingCol === colIndex && styles.draggingColumn,
			hoveredCol === colIndex && styles.hoveredColumn,
		)

	const columnDragProps = (colIndex: number) => ({
		style: { cursor: 'move' as const },
		onMouseDown: (e: ReactMouseEvent) => onColumnMouseDown(e, colIndex),
	})

	const columnMouseProps = (colIndex: number) => ({
		onMouseEnter: () => setHoveredCol(colIndex),
		onMouseLeave: () => setHoveredCol(null),
	})

	return (
		<div className={styles.wrapper}>
			<Text size={'sm'} c={'dimmed'} mb={'xs'}>
				Предпросмотр файла (первые 5 строк)
			</Text>
			<div className={styles.scroll}>
				<Table withTableBorder withColumnBorders className={styles.table} ref={tableRef}>
					<Table.Thead>
						<Table.Tr>
							<Table.Th className={styles.lineNumberCell} />
							{header.map((_, index) => (
								<Table.Th
									key={index}
									className={colClass(index, styles.columnLetterCell)}
									{...columnDragProps(index)}
									{...columnMouseProps(index)}
								>
									{toColumnLetter(index)}
								</Table.Th>
							))}
						</Table.Tr>
						{table.getHeaderGroups().map((headerGroup) => (
							<Table.Tr key={headerGroup.id}>
								<Table.Th className={styles.lineNumberCell} />
								{headerGroup.headers.map((col) => {
									const colIndex = Number(col.id)
									const isMapped = mappedHeaders.has(header[colIndex])
									return (
										<Table.Th
											key={col.id}
											className={colClass(colIndex, styles.th)}
											{...columnDragProps(colIndex)}
											{...columnMouseProps(colIndex)}
										>
											{!isMapped && (
												<div className={styles.headerContent}>
													{flexRender(col.column.columnDef.header, col.getContext())}
													<IconArrowsMove size={16} className={styles.headerIcon} />
												</div>
											)}
										</Table.Th>
									)
								})}
							</Table.Tr>
						))}
					</Table.Thead>
					<Table.Tbody>
						{table.getRowModel().rows.map((row, index) => (
							<Table.Tr key={row.id}>
								<Table.Td className={styles.lineNumberCell}>{index + 1}</Table.Td>
								{row.getVisibleCells().map((cell) => {
									const colIndex = Number(cell.column.id)
									const isMapped = mappedHeaders.has(header[colIndex])
									return (
										<Table.Td
											key={cell.id}
											className={colClass(colIndex, styles.td)}
											{...columnDragProps(colIndex)}
											{...columnMouseProps(colIndex)}
										>
											{isMapped ? '' : String(cell.getValue() ?? '')}
										</Table.Td>
									)
								})}
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</div>
		</div>
	)
}
