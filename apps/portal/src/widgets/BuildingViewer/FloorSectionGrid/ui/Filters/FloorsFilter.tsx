import type { FC } from 'react'
import { useState } from 'react'
import { Chip, Group, ScrollArea } from '@mantine/core'
import { FilterPopover } from './FilterPopover'

interface FloorsFilterProps {
	applied: number[] | undefined
	available: number[]
	onApply: (value: number[] | undefined) => void
}

export const FloorsFilter: FC<FloorsFilterProps> = ({ applied, available, onApply }) => {
	const [draft, setDraft] = useState<string[]>([])

	const isActive = (applied?.length ?? 0) > 0

	const handleOpen = () => setDraft(applied?.map(String) ?? [])

	const handleApply = () => {
		onApply(draft.length > 0 ? draft.map(Number) : undefined)
	}

	return (
		<FilterPopover
			id={'floors'}
			label={isActive ? `Floors (${applied!.length})` : 'Floors'}
			active={isActive}
			onOpen={handleOpen}
			onApply={handleApply}
		>
			{() => (
				<ScrollArea.Autosize mah={200}>
					<Chip.Group multiple value={draft} onChange={setDraft}>
						<Group gap={'xs'} wrap={'wrap'} p={'xs'}>
							{available.map(f => (
								<Chip key={f} value={String(f)} size={'sm'}>{f}</Chip>
							))}
						</Group>
					</Chip.Group>
				</ScrollArea.Autosize>
			)}
		</FilterPopover>
	)
}
