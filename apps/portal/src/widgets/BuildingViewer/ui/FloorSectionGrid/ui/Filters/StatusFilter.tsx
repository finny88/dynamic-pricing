import type { FC } from 'react'
import { useState } from 'react'
import type { ChipProps } from '@mantine/core'
import { Chip, Group } from '@mantine/core'
import { FilterPopover } from './FilterPopover'
import type { UnitStatus } from '../../model/unitStatus'
import { DEFAULT_COLOR_SCHEMES } from '../../lib/colors'

const isUnitStatus = (value: string): value is UnitStatus =>
	value === 'available' || value === 'reserved' || value === 'sold' || value === 'unknown'

const chipStyles = (status: keyof typeof DEFAULT_COLOR_SCHEMES): ChipProps['styles'] => ({
	label: {
		backgroundColor: DEFAULT_COLOR_SCHEMES[status].background,
		color: DEFAULT_COLOR_SCHEMES[status].text,
	},
})

interface StatusFilterProps {
	applied: UnitStatus[] | undefined
	onApply: (value: UnitStatus[] | undefined) => void
}

export const StatusFilter: FC<StatusFilterProps> = ({ applied, onApply }) => {
	const [draft, setDraft] = useState<string[]>([])

	const isActive = (applied?.length ?? 0) > 0

	const handleOpen = () => setDraft(applied ?? [])

	const handleApply = () => {
		onApply(draft.length > 0 ? draft.filter(isUnitStatus) : undefined)
	}

	return (
		<FilterPopover
			id={'status'}
			label={isActive ? `Статус (${applied?.length})` : 'Статус'}
			active={isActive}
			onOpen={handleOpen}
			onApply={handleApply}
			onReset={() => onApply(undefined)}
		>
			{() => (
				<Chip.Group multiple value={draft} onChange={setDraft}>
					<Group gap={'xs'} wrap={'wrap'}>
						<Chip value={'available'} size={'sm'} styles={chipStyles('available')}>Доступно</Chip>
						<Chip value={'reserved'} size={'sm'} styles={chipStyles('reserved')}>Забронировано</Chip>
						<Chip value={'sold'} size={'sm'} styles={chipStyles('sold')}>Продано</Chip>
						<Chip value={'unknown'} size={'sm'} styles={chipStyles('unknown')}>Неизвестно</Chip>
					</Group>
				</Chip.Group>
			)}
		</FilterPopover>
	)
}
