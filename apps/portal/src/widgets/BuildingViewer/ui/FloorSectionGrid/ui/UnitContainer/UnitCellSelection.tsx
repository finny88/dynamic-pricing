import { UnstyledButton, Tooltip, Text } from '@mantine/core'
import { clsx } from 'clsx'
import type { FC } from 'react'
import type { Unit } from '@entities/unit'
import classes from './UnitCellSelection.module.css'

interface UnitCellSelectionProps {
	unit: Unit
	selected: boolean
	onToggle: (unitNumber: number) => void
}

export const UnitCellSelection: FC<UnitCellSelectionProps> = ({ unit, selected, onToggle }) => {
	return (
		<Tooltip
			color={'white'}
			label={
				<Text size={'xs'} c={'dark'}>
					{`№${unit.unitNumber}, ${unit.totalAreaSqm} м²`}
				</Text>
			}
			withArrow
			position={'top'}
			classNames={{ tooltip: classes.tooltip }}
		>
			<UnstyledButton
				className={clsx(classes.unitButton, selected && classes.selected)}
				onClick={() => onToggle(unit.unitNumber)}
				aria-pressed={selected}
				aria-label={`Квартира №${unit.unitNumber}${selected ? ' (выбрана)' : ''}`}
			>
				{unit.roomsCount}
			</UnstyledButton>
		</Tooltip>
	)
}
