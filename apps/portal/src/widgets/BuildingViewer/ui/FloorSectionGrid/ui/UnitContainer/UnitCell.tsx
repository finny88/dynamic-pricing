import { UnstyledButton, Tooltip } from '@mantine/core'
import { clsx } from 'clsx'
import type { FC } from 'react'
import type { Unit } from '@entities/unit'
import { ARIA_LABELS } from '../../lib/aria'
import classes from './UnitCell.module.css'
import { UnitTooltipContent } from './UnitTooltipContent'

interface UnitCellProps {
	unit: Unit
	colors: {
		background: string
		text: string
	}
	status: string
	disabled: boolean
}

export const UnitCell: FC<UnitCellProps> = ({ unit, colors, status, disabled }) => {
	return (
		<Tooltip
			color={'white'}
			label={<UnitTooltipContent unit={unit} backgroundColor={colors.background} />}
			withArrow
			position={'top'}
			classNames={{ tooltip: classes.tooltip }}
		>
			<UnstyledButton
				aria-label={`${ARIA_LABELS.UNIT} ${unit.unitNumber} - ${status}${disabled ? ' (filtered)' : ''}`}
				className={clsx(classes.unitButton, disabled && classes.disabled)}
				style={{
					backgroundColor: colors.background,
				}}
			>
				{unit.roomsCount}
			</UnstyledButton>
		</Tooltip>
	)
}
