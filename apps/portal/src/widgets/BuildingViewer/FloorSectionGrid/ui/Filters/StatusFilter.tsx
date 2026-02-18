import type { FC } from 'react'
import { useState } from 'react'
import { Chip, Group } from '@mantine/core'
import { FilterPopover } from './FilterPopover'
import type { UnitStatus } from '../../models/unitStatus'

interface StatusFilterProps {
	applied: UnitStatus[] | undefined
	onApply: (value: UnitStatus[] | undefined) => void
}

export const StatusFilter: FC<StatusFilterProps> = ({ applied, onApply }) => {
	const [draft, setDraft] = useState<string[]>([])

	const isActive = (applied?.length ?? 0) > 0

	const handleOpen = () => setDraft(applied ?? [])

	const handleApply = () => {
		onApply(draft.length > 0 ? draft as UnitStatus[] : undefined)
	}

	return (
		<FilterPopover
			id={'status'}
			label={isActive ? `Status (${applied!.length})` : 'Status'}
			active={isActive}
			onOpen={handleOpen}
			onApply={handleApply}
		>
			{() => (
				<Chip.Group multiple value={draft} onChange={setDraft}>
					<Group gap={'xs'} wrap={'wrap'}>
						<Chip value={'available'} size={'sm'}>Available</Chip>
						<Chip value={'reserved'} size={'sm'}>Reserved</Chip>
						<Chip value={'sold'} size={'sm'}>Sold</Chip>
						<Chip value={'unknown'} size={'sm'}>Unknown</Chip>
					</Group>
				</Chip.Group>
			)}
		</FilterPopover>
	)
}
