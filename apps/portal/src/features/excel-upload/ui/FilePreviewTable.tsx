import { useMemo, useRef, useState } from 'react'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Button, Table, Text } from '@mantine/core'
import { IconArrowsMove } from '@tabler/icons-react'
import * as z from 'zod'
import type { FilePreview } from '../lib/parseFile'
import { rawUnitSchema } from '@entities/unit'
import { REQUIRED_KEYS } from '../lib/requiredKeys'
import { ExpectedFormatTable } from './ExpectedFormatTable'
import { createColumnGhost, type ColumnGhost } from '../lib/createColumnDragImage'
import styles from './FilePreviewTable.module.css'

const columnHelper = createColumnHelper<unknown[]>()

const DRAG_THRESHOLD = 5

const isRawUnitSchemaKey = (key: string): key is keyof typeof rawUnitSchema.shape =>
	key in rawUnitSchema.shape

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
	loading: boolean
	onParse: (columnMapping: Record<string, string>, schema: z.ZodType) => void
}

export const FilePreviewTable = ({ preview, loading, onParse }: Props) => {
	const { header, rows } = preview
	const [mapping, setMapping] = useState<Record<string, string>>({})
	const allRequiredMapped = [...REQUIRED_KEYS].every((key) => mapping[key] !== undefined)
	const [draggingCol, setDraggingCol] = useState<number | null>(null)
	const [hoveredCol, setHoveredCol] = useState<number | null>(null)
	const [dragOverKey, setDragOverKey] = useState<string | null>(null)
	const tableRef = useRef<HTMLTableElement>(null)
	const ghostRef = useRef<ColumnGhost | null>(null)

	const handleDrop = (targetKey: string, sourceHeaderName: string) => {
		setMapping((prev) => ({ ...prev, [targetKey]: sourceHeaderName }))
	}

	const handleRemoveMapping = (key: string) => {
		setMapping((prev) => {
			const next = { ...prev }
			delete next[key]
			return next
		})
	}

	const handleColumnMouseDown = (e: React.MouseEvent, colIndex: number) => {
		e.preventDefault()
		const startX = e.clientX
		const startY = e.clientY
		const headerName = header[colIndex]
		let started = false

		const onMouseMove = (ev: MouseEvent) => {
			if (!started) {
				if (Math.abs(ev.clientX - startX) + Math.abs(ev.clientY - startY) < DRAG_THRESHOLD) {
					return
				}
				started = true
				setDraggingCol(colIndex)
				document.documentElement.classList.add('column-dragging')
				if (tableRef.current) {
					ghostRef.current = createColumnGhost(
						tableRef.current, colIndex, startX, startY,
					)
				}
			}

			ghostRef.current?.update(ev.clientX, ev.clientY)

			const el = document.elementFromPoint(ev.clientX, ev.clientY)
			const dropTarget = el?.closest<HTMLElement>('[data-drop-key]')
			setDragOverKey(dropTarget?.dataset.dropKey ?? null)
		}

		const onMouseUp = (ev: MouseEvent) => {
			document.removeEventListener('mousemove', onMouseMove)
			document.removeEventListener('mouseup', onMouseUp)

			if (started) {
				const el = document.elementFromPoint(ev.clientX, ev.clientY)
				const dropTarget = el?.closest<HTMLElement>('[data-drop-key]')
				if (dropTarget?.dataset.dropKey) {
					handleDrop(dropTarget.dataset.dropKey, headerName)
				}

				ghostRef.current?.destroy()
				ghostRef.current = null
				setDraggingCol(null)
				setDragOverKey(null)
				document.documentElement.classList.remove('column-dragging')
			}
		}

		document.addEventListener('mousemove', onMouseMove)
		document.addEventListener('mouseup', onMouseUp)
	}

	const columnDragProps = (colIndex: number) => ({
		style: { cursor: 'move' as const },
		onMouseDown: (e: React.MouseEvent) => handleColumnMouseDown(e, colIndex),
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

	const onParseClick = () => {
		const dynamicShape: Record<string, z.ZodType> = {}
		for (const [schemaKey, headerName] of Object.entries(mapping)) {
			if (isRawUnitSchemaKey(schemaKey)) {
				dynamicShape[headerName] = rawUnitSchema.shape[schemaKey]
			}
		}
		const dynamicSchema = z.object(dynamicShape).passthrough()

		onParse(mapping, dynamicSchema)
	}

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
										const isMapped = Object.values(mapping).includes(header[colIndex])
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
										const isMapped = Object.values(mapping).includes(header[colIndex])
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
			<ExpectedFormatTable
				rows={rows}
				header={header}
				mapping={mapping}
				dragOverKey={dragOverKey}
				onRemoveMapping={handleRemoveMapping}
			/>
			<Button
				variant={'filled'}
				style={{ width: 'fit-content', flexShrink: 0, marginTop: 12 }}
				disabled={!allRequiredMapped}
				loading={loading}
				onClick={onParseClick}
			>
				Распарсить файл
			</Button>
		</>
	)
}
