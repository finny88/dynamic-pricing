import { TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import type { FC } from 'react'
import { useState } from 'react'
import { FilterPopover } from './FilterPopover'

interface UnitNumberFilterProps {
	applied: string | undefined
	onApply: (value: string | undefined) => void
}

export const UnitNumberFilter: FC<UnitNumberFilterProps> = ({ applied, onApply }) => {
	const [draft, setDraft] = useState('')

	const handleOpen = () => setDraft(applied ?? '')

	const handleApply = () => {
		onApply(draft || undefined)
	}

	return (
		<FilterPopover
			id={'search'}
			label={applied ? `Помещение: ${applied}` : 'Номер помещения'}
			active={!!applied}
			onOpen={handleOpen}
			onApply={handleApply}
			onReset={() => onApply(undefined)}
		>
			{(applyAndClose) => (
				<TextInput
					placeholder={'Поиск по номеру помещения...'}
					leftSection={<IconSearch size={16} />}
					value={draft}
					onChange={(e) => setDraft(e.currentTarget.value)}
					onKeyDown={(e) => { if (e.key === 'Enter') { applyAndClose() } }}
					autoFocus
				/>
			)}
		</FilterPopover>
	)
}
