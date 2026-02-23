/**
 * Creates a drag ghost image showing all cells in a table column.
 * Appends a temporary element to the DOM, sets it as the drag image,
 * and removes it on the next frame.
 */
export const createColumnDragImage = (
	e: React.DragEvent,
	table: HTMLTableElement,
	colIndex: number,
) => {
	const rows = Array.from(table.querySelectorAll('tr')).slice(1)

	const ghost = document.createElement('table')
	ghost.style.cssText =
		'position:absolute;top:-9999px;opacity:0.85;border-collapse:collapse;font-size:inherit;'

	for (const row of rows) {
		// colIndex + 1 because the first cell in each row is the line-number cell
		const cell = row.children[colIndex + 1] as HTMLElement | undefined
		if (cell) {
			const tr = document.createElement('tr')
			const clone = cell.cloneNode(true) as HTMLElement
			clone.style.cssText =
				'padding:4px 8px;border:1px solid var(--mantine-color-gray-3);background:var(--mantine-primary-color-light);white-space:nowrap;'
			tr.appendChild(clone)
			ghost.appendChild(tr)
		}
	}

	document.body.appendChild(ghost)

	// Offset = cursor position relative to the top-left of the ghost image.
	// Ghost top aligns with the first included row; ghost left aligns with the column.
	const anchorCell = rows[0]?.children[colIndex + 1] as HTMLElement | undefined
	const rect = anchorCell?.getBoundingClientRect()
	const offsetX = rect ? e.clientX - rect.left : ghost.offsetWidth / 2
	const offsetY = rect ? e.clientY - rect.top : 20

	e.dataTransfer.setDragImage(
		ghost, offsetX, offsetY,
	)
	requestAnimationFrame(() => document.body.removeChild(ghost))
}
