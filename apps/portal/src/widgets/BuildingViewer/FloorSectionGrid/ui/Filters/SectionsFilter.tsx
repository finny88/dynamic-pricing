import type { FC } from 'react'
import { useState } from 'react'
import { Chip, Group, Button, ScrollArea } from '@mantine/core'
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

	const handleApply = (close: () => void) => {
		onApply(draft.length > 0 ? draft.map(Number) : undefined)
		close()
	}

	return (
		<FilterPopover
			id={'sections'}
			label={isActive ? `Sections (${applied!.length})` : 'Sections'}
			active={isActive}
			onOpen={handleOpen}
		>
			{(close) => (
				<>
					<ScrollArea.Autosize mah={200}>
						<Chip.Group multiple value={draft} onChange={setDraft}>
							<Group gap={'xs'} wrap={'wrap'} p={'xs'}>
								{available.map(s => (
									<Chip key={s} value={String(s)} size={'sm'}>{s}</Chip>
								))}
							</Group>
						</Chip.Group>
					</ScrollArea.Autosize>
					<Button fullWidth size={'sm'} onClick={() => handleApply(close)}>Apply</Button>
				</>
			)}
		</FilterPopover>
	)
}
