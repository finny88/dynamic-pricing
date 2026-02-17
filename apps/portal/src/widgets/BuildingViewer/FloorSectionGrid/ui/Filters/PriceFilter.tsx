import type { FC } from 'react'
import { useState } from 'react'
import { Group, NumberInput, Button, SegmentedControl } from '@mantine/core'
import { FilterPopover } from './FilterPopover'

type PriceMode = 'total' | 'sqm'

interface PriceFilterProps {
	appliedMin: number | undefined
	appliedMax: number | undefined
	appliedSqmMin: number | undefined
	appliedSqmMax: number | undefined
	onApply: (
		min: number | undefined,
		max: number | undefined,
		sqmMin: number | undefined,
		sqmMax: number | undefined
	) => void
}

export const PriceFilter: FC<PriceFilterProps> = ({
	appliedMin,
	appliedMax,
	appliedSqmMin,
	appliedSqmMax,
	onApply
}) => {
	const [mode, setMode] = useState<PriceMode>('total')
	const [draftMin, setDraftMin] = useState<number | string>('')
	const [draftMax, setDraftMax] = useState<number | string>('')
	const [draftSqmMin, setDraftSqmMin] = useState<number | string>('')
	const [draftSqmMax, setDraftSqmMax] = useState<number | string>('')

	const isActive = [appliedMin, appliedMax, appliedSqmMin, appliedSqmMax].some(v => v !== undefined)

	const handleOpen = () => {
		setDraftMin(appliedMin ?? '')
		setDraftMax(appliedMax ?? '')
		setDraftSqmMin(appliedSqmMin ?? '')
		setDraftSqmMax(appliedSqmMax ?? '')
	}

	const handleApply = (close: () => void) => {
		onApply(
			typeof draftMin === 'number' ? draftMin : undefined,
			typeof draftMax === 'number' ? draftMax : undefined,
			typeof draftSqmMin === 'number' ? draftSqmMin : undefined,
			typeof draftSqmMax === 'number' ? draftSqmMax : undefined
		)
		close()
	}

	const numberInputProps = {
		min: 0,
		thousandSeparator: ' ',
		allowNegative: false
	} as const

	return (
		<FilterPopover id={'price'} label={'Price'} active={isActive} onOpen={handleOpen}>
			{(close) => (
				<>
					<SegmentedControl
						fullWidth
						size={'sm'}
						value={mode}
						onChange={(v) => setMode(v as PriceMode)}
						data={[
							{ value: 'total', label: 'Total (₽)' },
							{ value: 'sqm', label: '₽ / m²' }
						]}
					/>
					{mode === 'total' ? (
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
					) : (
						<Group grow>
							<NumberInput
								label={'From'}
								placeholder={'Min'}
								value={draftSqmMin}
								onChange={setDraftSqmMin}
								{...numberInputProps}
							/>
							<NumberInput
								label={'To'}
								placeholder={'Max'}
								value={draftSqmMax}
								onChange={setDraftSqmMax}
								{...numberInputProps}
							/>
						</Group>
					)}
					<Button fullWidth size={'sm'} onClick={() => handleApply(close)}>Apply</Button>
				</>
			)}
		</FilterPopover>
	)
}
