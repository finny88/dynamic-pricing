import type { FC } from 'react'
import { UnstyledButton, Tooltip } from '@mantine/core'
import { UnitTooltipContent } from './UnitTooltipContent'
import classes from './UnitCell.module.css'
import { ARIA_LABELS } from '../../lib/mappers'
import type { Unit } from '@entities/unit'

interface UnitCellProps {
	unit: Unit
	colors: {
		background: string
		text: string
		hoverBackground: string
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
				className={`${classes.unitButton} ${disabled ? classes.disabled : ''}`}
				style={{
					backgroundColor: colors.background,
				}}
				onMouseEnter={(e) => {
					if (!disabled && colors.hoverBackground) {
						e.currentTarget.style.backgroundColor = colors.hoverBackground
					}
				}}
				onMouseLeave={(e) => {
					if (!disabled) {
						e.currentTarget.style.backgroundColor = colors.background
					}
				}}
			>
				{unit.roomsCount}
			</UnstyledButton>
		</Tooltip>
	)
}
