import { Chip, Group } from '@mantine/core'
import type { FC } from 'react'
import { useState } from 'react'
import { FilterPopover } from './FilterPopover'

interface RoomsFilterProps {
	applied: number[] | undefined
	available: number[]
	onApply: (value: number[] | undefined) => void
}

export const RoomsFilter: FC<RoomsFilterProps> = ({ applied, available, onApply }) => {
	const [draft, setDraft] = useState<string[]>([])

	const isActive = (applied?.length ?? 0) > 0

	const handleOpen = () => setDraft(applied?.map(String) ?? [])

	const handleApply = () => {
		onApply(draft.length > 0 ? draft.map(Number) : undefined)
	}

	return (
		<FilterPopover
			id={'rooms'}
			label={isActive ? `Комнаты (${applied?.length})` : 'Комнаты'}
			active={isActive}
			onOpen={handleOpen}
			onApply={handleApply}
			onReset={() => onApply(undefined)}
		>
			{() => (
				<Chip.Group multiple value={draft} onChange={setDraft}>
					<Group gap={'xs'} wrap={'wrap'}>
						{available.map(r => (
							<Chip key={r} value={String(r)} size={'sm'}>{r}</Chip>
						))}
					</Group>
				</Chip.Group>
			)}
		</FilterPopover>
	)
}
