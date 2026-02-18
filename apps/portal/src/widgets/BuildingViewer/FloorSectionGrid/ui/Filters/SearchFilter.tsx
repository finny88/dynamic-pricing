import type { FC } from 'react'
import { useState } from 'react'
import { TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { FilterPopover } from './FilterPopover'

interface SearchFilterProps {
	applied: string | undefined
	onApply: (value: string | undefined) => void
}

export const SearchFilter: FC<SearchFilterProps> = ({ applied, onApply }) => {
	const [draft, setDraft] = useState('')

	const handleOpen = () => setDraft(applied ?? '')

	const handleApply = () => {
		onApply(draft || undefined)
	}

	return (
		<FilterPopover
			id={'search'}
			label={applied ? `Unit: ${applied}` : 'Unit number'}
			active={!!applied}
			onOpen={handleOpen}
			onApply={handleApply}
			onReset={() => onApply(undefined)}
		>
			{(applyAndClose) => (
				<TextInput
					placeholder={'Search by unit number...'}
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
