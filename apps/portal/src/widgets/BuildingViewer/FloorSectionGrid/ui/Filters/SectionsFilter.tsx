import type { FC } from 'react'
import { useState } from 'react'
import { Chip, Group, ScrollArea } from '@mantine/core'
import { FilterPopover } from './FilterPopover'

interface SectionsFilterProps {
	applied: number[] | undefined
	available: number[]
	onApply: (value: number[] | undefined) => void
}

export const SectionsFilter: FC<SectionsFilterProps> = ({ applied, available, onApply }) => {
	const [draft, setDraft] = useState<string[]>([])

	const isActive = (applied?.length ?? 0) > 0

	const handleOpen = () => setDraft(applied?.map(String) ?? [])

	const handleApply = () => {
		onApply(draft.length > 0 ? draft.map(Number) : undefined)
	}

	return (
		<FilterPopover
			id={'sections'}
			label={isActive ? `Sections (${applied!.length})` : 'Sections'}
			active={isActive}
			onOpen={handleOpen}
			onApply={handleApply}
		>
			{() => (
				<ScrollArea.Autosize mah={200}>
					<Chip.Group multiple value={draft} onChange={setDraft}>
						<Group gap={'xs'} wrap={'wrap'} p={'xs'}>
							{available.map(s => (
								<Chip key={s} value={String(s)} size={'sm'}>{s}</Chip>
							))}
						</Group>
					</Chip.Group>
				</ScrollArea.Autosize>
			)}
		</FilterPopover>
	)
}
