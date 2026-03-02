export interface ColumnGhost {
	update: (clientX: number, clientY: number) => void
	destroy: () => void
}

/**
 * Creates a custom drag ghost that follows the cursor via mouse events.
 * Returns helpers to update position and remove the ghost.
 */
export const createColumnGhost = (
	table: HTMLTableElement,
	colIndex: number,
	startX: number,
	startY: number,
): ColumnGhost => {
	const rows = Array.from(table.querySelectorAll('tr')).slice(1)

	const ghost = document.createElement('table')
	ghost.style.cssText =
		'position:fixed;pointer-events:none;z-index:9999;opacity:0.85;border-collapse:collapse;font-size:inherit;'

	for (const row of rows) {
		// colIndex + 1 because the first cell in each row is the line-number cell
		const rawCell = row.children[colIndex + 1]
		const cell = rawCell instanceof HTMLElement ? rawCell : undefined
		if (cell) {
			const clone = cell.cloneNode(true)
			if (!(clone instanceof HTMLElement)) { continue }
			clone.style.cssText =
				'padding:4px 8px;border:1px solid var(--mantine-color-gray-3);background:var(--mantine-primary-color-light);white-space:nowrap;'
			const tr = document.createElement('tr')
			tr.appendChild(clone)
			ghost.appendChild(tr)
		}
	}

	document.body.appendChild(ghost)

	// Offset = cursor position relative to the ghost top-left
	const rawAnchorCell = rows[0]?.children[colIndex + 1]
	const anchorCell = rawAnchorCell instanceof HTMLElement ? rawAnchorCell : undefined
	const rect = anchorCell?.getBoundingClientRect()
	const offsetX = rect ? startX - rect.left : ghost.offsetWidth / 2
	const offsetY = rect ? startY - rect.top : 20

	ghost.style.left = `${startX - offsetX}px`
	ghost.style.top = `${startY - offsetY}px`

	return {
		update(clientX: number, clientY: number) {
			ghost.style.left = `${clientX - offsetX}px`
			ghost.style.top = `${clientY - offsetY}px`
		},
		destroy() {
			ghost.remove()
		},
	}
}
