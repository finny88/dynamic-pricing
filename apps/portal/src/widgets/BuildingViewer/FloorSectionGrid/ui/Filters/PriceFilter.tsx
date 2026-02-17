import type { FC } from 'react'
import { useState } from 'react'
import { Group, NumberInput, Button } from '@mantine/core'
import { FilterPopover } from './FilterPopover'

interface PriceFilterProps {
	appliedMin: number | undefined
	appliedMax: number | undefined
	onApply: (min: number | undefined, max: number | undefined) => void
}

export const PriceFilter: FC<PriceFilterProps> = ({ appliedMin, appliedMax, onApply }) => {
	const [draftMin, setDraftMin] = useState<number | string>('')
	const [draftMax, setDraftMax] = useState<number | string>('')

	const isActive = appliedMin !== undefined || appliedMax !== undefined

	const handleOpen = () => {
		setDraftMin(appliedMin ?? '')
		setDraftMax(appliedMax ?? '')
	}

	const handleApply = (close: () => void) => {
		onApply(typeof draftMin === 'number' ? draftMin : undefined,
			typeof draftMax === 'number' ? draftMax : undefined)
		close()
	}

	return (
		<FilterPopover id={'price'} label={'Price'} active={isActive} onOpen={handleOpen}>
			{(close) => (
				<>
					<Group grow>
						<NumberInput
							label={'From (₽)'}
							placeholder={'Min'}
							value={draftMin}
							onChange={setDraftMin}
							min={0}
							thousandSeparator={' '}
							allowNegative={false}
						/>
						<NumberInput
							label={'To (₽)'}
							placeholder={'Max'}
							value={draftMax}
							onChange={setDraftMax}
							min={0}
							thousandSeparator={' '}
							allowNegative={false}
						/>
					</Group>
					<Button fullWidth size={'sm'} onClick={() => handleApply(close)}>Apply</Button>
				</>
			)}
		</FilterPopover>
	)
}
