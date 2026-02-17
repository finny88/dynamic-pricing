import type { FC } from 'react'
import { useState } from 'react'
import { Chip, Group, Button } from '@mantine/core'
import { FilterPopover } from './FilterPopover'

interface RoomsFilterProps {
	applied: string[] | undefined
	available: string[]
	onApply: (value: string[] | undefined) => void
}

export const RoomsFilter: FC<RoomsFilterProps> = ({ applied, available, onApply }) => {
	const [draft, setDraft] = useState<string[]>([])

	const isActive = (applied?.length ?? 0) > 0

	const handleOpen = () => setDraft(applied ?? [])

	const handleApply = (close: () => void) => {
		onApply(draft.length > 0 ? draft : undefined)
		close()
	}

	return (
		<FilterPopover
			id={'rooms'}
			label={isActive ? `Rooms (${applied!.length})` : 'Rooms'}
			active={isActive}
			onOpen={handleOpen}
		>
			{(close) => (
				<>
					<Chip.Group multiple value={draft} onChange={setDraft}>
						<Group gap={'xs'} wrap={'wrap'}>
							{available.map(r => (
								<Chip key={r} value={r} size={'sm'}>{r}</Chip>
							))}
						</Group>
					</Chip.Group>
					<Button fullWidth size={'sm'} onClick={() => handleApply(close)}>Apply</Button>
				</>
			)}
		</FilterPopover>
	)
}
