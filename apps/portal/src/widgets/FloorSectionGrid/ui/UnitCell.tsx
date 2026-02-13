import type { FC } from 'react'
import { UnstyledButton, Tooltip } from '@mantine/core'
import type { Unit } from '../types'
import { ARIA_LABELS } from '../constants'
import { UnitTooltipContent } from './UnitTooltipContent'
import classes from './UnitCell.module.css'

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
			styles={{
				tooltip: {
					zIndex: 10000,
					opacity: 1,
					backgroundColor: 'white',
					boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
					border: 'none',
				}
			}}
		>
			<UnstyledButton
				aria-label={`${ARIA_LABELS.UNIT} ${unit.unitNumber} - ${status}${disabled ? ' (filtered)' : ''}`}
				className={`${classes.unitButton} ${disabled ? classes.disabled : ''}`}
				style={{
					backgroundColor: colors.background,
					opacity: disabled ? 0.3 : 1,
					cursor: disabled ? 'not-allowed' : 'pointer',
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
