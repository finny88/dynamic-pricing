import type { FC } from 'react'
import { useState } from 'react'
import { Group, NumberInput } from '@mantine/core'
import { FilterPopover } from './FilterPopover'

interface PriceFilterProps {
	id: string
	label: string
	appliedMin: number | undefined
	appliedMax: number | undefined
	onApply: (min: number | undefined, max: number | undefined) => void
}

export const PriceFilter: FC<PriceFilterProps> = ({ id, label, appliedMin, appliedMax, onApply }) => {
	const [draftMin, setDraftMin] = useState<number | string>('')
	const [draftMax, setDraftMax] = useState<number | string>('')

	const isActive = appliedMin !== undefined || appliedMax !== undefined

	const handleOpen = () => {
		setDraftMin(appliedMin ?? '')
		setDraftMax(appliedMax ?? '')
	}

	const handleApply = () => {
		onApply(typeof draftMin === 'number' ? draftMin : undefined,
			typeof draftMax === 'number' ? draftMax : undefined)
	}

	const numberInputProps = {
		min: 0,
		thousandSeparator: ' ',
		allowNegative: false
	} as const

	return (
		<FilterPopover id={id} label={label} active={isActive} onOpen={handleOpen} onApply={handleApply} onReset={() => onApply(undefined, undefined)}>
			{() => (
				<Group grow>
					<NumberInput
						label={'From'}
						placeholder={'Min'}
						value={draftMin}
						onChange={setDraftMin}
						{...numberInputProps}
					/>
					<NumberInput
						label={'To'}
						placeholder={'Max'}
						value={draftMax}
						onChange={setDraftMax}
						{...numberInputProps}
					/>
				</Group>
			)}
		</FilterPopover>
	)
}
