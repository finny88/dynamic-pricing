import { UnstyledButton, Tooltip } from '@mantine/core'
import { clsx } from 'clsx'
import type { FC } from 'react'
import type { Unit } from '@entities/unit'
import { ARIA_LABELS } from '../../lib/mappers'
import classes from './UnitCell.module.css'
import { UnitTooltipContent } from './UnitTooltipContent'

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
				className={clsx(classes.unitButton, disabled && classes.disabled)}
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
