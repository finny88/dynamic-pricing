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
	const ghost = document.createElement('table')
	ghost.style.cssText =
		'position:absolute;top:-9999px;opacity:0.85;border-collapse:collapse;font-size:inherit;'

	for (const row of table.querySelectorAll('tr')) {
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
	e.dataTransfer.setDragImage(
		ghost, ghost.offsetWidth / 2, 20
	)
	requestAnimationFrame(() => document.body.removeChild(ghost))
}
