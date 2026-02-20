import { useMemo, useRef, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Table, Text } from '@mantine/core'
import { IconArrowsMove } from '@tabler/icons-react'
import type { FilePreview } from '../lib/parseFile'
import { ExpectedFormatTable } from './ExpectedFormatTable'
import { createColumnDragImage } from '../lib/createColumnDragImage'
import styles from './FilePreviewTable.module.css'

const columnHelper = createColumnHelper<unknown[]>()

const createIconCursor = (color: string) => {
	const svg = renderToStaticMarkup(<IconArrowsMove size={20} color={color} />)
	return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 10 10, move`
}

const cursorDefault = createIconCursor('#868e96')
const cursorDragging = createIconCursor('#343a40')

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
	const [mapping, setMapping] = useState<Record<string, number>>({})
	const [draggingCol, setDraggingCol] = useState<number | null>(null)
	const [hoveredCol, setHoveredCol] = useState<number | null>(null)
	const tableRef = useRef<HTMLTableElement>(null)

	const handleDrop = (targetKey: string, sourceIndex: number) => {
		setMapping((prev) => ({ ...prev, [targetKey]: sourceIndex }))
	}

	const handleRemoveMapping = (key: string) => {
		setMapping((prev) => {
			const next = { ...prev }
			delete next[key]
			return next
		})
	}

	const handleColumnDragStart = (e: React.DragEvent, colIndex: number) => {
		e.dataTransfer.setData('text/plain', String(colIndex))
		e.dataTransfer.effectAllowed = 'copyMove'
		setDraggingCol(colIndex)

		if (tableRef.current) {
			createColumnDragImage(
				e,
				tableRef.current,
				colIndex,
			)
		}
	}

	const handleColumnDragEnd = () => {
		setDraggingCol(null)
	}

	const columnDragProps = (colIndex: number) => ({
		draggable: true as const,
		style: { cursor: draggingCol !== null ? cursorDragging : cursorDefault },
		onDragStart: (e: React.DragEvent) => handleColumnDragStart(e, colIndex),
		onDragEnd: handleColumnDragEnd,
	})

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

	const colClass = (colIndex: number, base: string) =>
		`${base} ${styles.draggableColumn}${draggingCol === colIndex ? ` ${styles.draggingColumn}` : ''}${hoveredCol === colIndex ? ` ${styles.hoveredColumn}` : ''}`

	const columnMouseProps = (colIndex: number) => ({
		onMouseEnter: () => setHoveredCol(colIndex),
		onMouseLeave: () => setHoveredCol(null),
	})

	return (
		<>
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
										return (
											<Table.Th
												key={col.id}
												className={colClass(colIndex, styles.th)}
												{...columnDragProps(colIndex)}
												{...columnMouseProps(colIndex)}
											>
												<div className={styles.headerContent}>
													{flexRender(col.column.columnDef.header, col.getContext())}
													<IconArrowsMove size={16} className={styles.headerIcon} />
												</div>
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
										return (
											<Table.Td
												key={cell.id}
												className={colClass(colIndex, styles.td)}
												{...columnDragProps(colIndex)}
												{...columnMouseProps(colIndex)}
											>
												{String(cell.getValue() ?? '')}
											</Table.Td>
										)
									})}
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</div>
			</div>
			<ExpectedFormatTable
				rows={rows}
				header={header}
				mapping={mapping}
				onDrop={handleDrop}
				onRemoveMapping={handleRemoveMapping}
			/>
		</>
	)
}
