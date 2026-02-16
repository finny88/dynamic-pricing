import type { FC } from 'react'
import { UnstyledButton, Text, Stack, Group } from '@mantine/core'
import type { Unit } from '../types'
import { formatPrice } from '../utils'
import classes from './UnitCellDetailed.module.css'

interface UnitCellDetailedProps {
	unit: Unit
	colors: {
		background: string
		text: string
		hoverBackground: string
	}
	status: string
	disabled: boolean
}

export const UnitCellDetailed: FC<UnitCellDetailedProps> = ({ unit, colors, disabled }) => {
	return (
		<UnstyledButton
			className={`${classes.unitButton} ${disabled ? classes.disabled : ''}`}
			style={{
				backgroundColor: colors.background,
				borderColor: colors.background,
				opacity: disabled ? 0.3 : 1,
				cursor: disabled ? 'not-allowed' : 'pointer',
			}}
			onMouseEnter={(e) => {
				if (!disabled && colors.hoverBackground) {
					e.currentTarget.style.backgroundColor = colors.hoverBackground
					e.currentTarget.style.borderColor = colors.background
					e.currentTarget.style.transform = 'scale(1.02)'
				}
			}}
			onMouseLeave={(e) => {
				if (!disabled) {
					e.currentTarget.style.backgroundColor = colors.background
					e.currentTarget.style.borderColor = colors.background
					e.currentTarget.style.transform = 'scale(1)'
				}
			}}
		>
			<Stack gap={4} className={classes.content}>
				<Group gap={4} align={'center'} wrap={'nowrap'} justify={'space-between'}>
					<Group gap={4} align={'center'} wrap={'nowrap'}>
						<Text size={'xs'} c={'white'} fw={700}>
							{unit.roomsCount}
						</Text>
						<Text size={'xs'} c={'white'}>
							Квартира
						</Text>
					</Group>
					<Text size={'xs'} c={'white'} fw={700}>
						{`№${unit.unitNumber}`}
					</Text>
				</Group>
				<Group gap={4} align={'center'} wrap={'nowrap'}>
					<Text size={'lg'} fw={700} c={'white'}>
						{`${formatPrice(unit.actualTotalPriceRub)} ₽`}
					</Text>
				</Group>
				<Group gap={4} align={'center'} wrap={'nowrap'}>
					<Text size={'xs'} c={'white'} style={{ opacity: 0.9 }}>
						{`${unit.totalAreaSqm} м²`}
					</Text>
					<Text size={'xs'} c={'white'} style={{ opacity: 0.9 }}>
						{`– ${formatPrice(unit.actualPricePerSqmRub)} ₽/м²`}
					</Text>
				</Group>
			</Stack>
		</UnstyledButton>
	)
}