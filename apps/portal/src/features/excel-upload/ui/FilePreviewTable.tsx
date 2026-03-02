import { Button } from '@mantine/core'
import { useMemo, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import type { ZodType } from 'zod'
import { buildSchema } from '../lib/buildSchema'
import { createColumnGhost, type ColumnGhost } from '../lib/createColumnDragImage'
import type { FilePreview } from '../lib/parseFile'
import { REQUIRED_KEYS } from '../lib/requiredKeys'
import { ExpectedFormatTable } from './ExpectedFormatTable'
import styles from './FilePreviewTable.module.css'
import { PreviewTable } from './PreviewTable'

const DRAG_THRESHOLD = 5

interface Props {
	preview: FilePreview
	loading: boolean
	onParse: (columnMapping: Record<string, string>, schema: ZodType) => void
}

export const FilePreviewTable = ({ preview, loading, onParse }: Props) => {
	const { header, rows } = preview
	const [mapping, setMapping] = useState<Record<string, string>>({})
	const allRequiredMapped = [...REQUIRED_KEYS].every((key) => mapping[key] !== undefined)
	const [draggingCol, setDraggingCol] = useState<number | null>(null)
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

	const handleColumnMouseDown = (e: ReactMouseEvent, colIndex: number) => {
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

	const mappedHeaders = useMemo(() => new Set(Object.values(mapping)), [mapping])

	return (
		<>
			<PreviewTable
				header={header}
				rows={rows}
				mappedHeaders={mappedHeaders}
				draggingCol={draggingCol}
				tableRef={tableRef}
				onColumnMouseDown={handleColumnMouseDown}
			/>
			<ExpectedFormatTable
				rows={rows}
				header={header}
				mapping={mapping}
				dragOverKey={dragOverKey}
				onRemoveMapping={handleRemoveMapping}
			/>
			<Button
				variant={'filled'}
				className={styles.parseButton}
				disabled={!allRequiredMapped}
				loading={loading}
				onClick={() => onParse(mapping, buildSchema(mapping))}
			>
				Распарсить файл
			</Button>
		</>
	)
}
